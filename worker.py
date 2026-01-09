import json
import os
import sys
import time
import traceback
from dataclasses import dataclass
from typing import Any, Dict, Optional

import boto3
import pika
import psycopg
from psycopg.rows import dict_row


@dataclass
class Config:
    amqp_url: str
    queue: str
    db_url: str
    s3_endpoint_url: str
    s3_access_key_id: str
    s3_secret_access_key: str
    s3_bucket: str
    s3_region: str
    s3_force_path_style: bool


def load_config() -> Config:
    amqp_url = os.getenv("AMQP_URL", "amqp://app:app-secret@localhost:5672")
    queue = os.getenv("AMQP_QUEUE", "song_jobs")
    db_url = os.getenv("DATABASE_URL", "")

    s3_endpoint_url = os.getenv("S3_ENDPOINT_URL", "http://localhost:9000")
    s3_access_key_id = os.getenv("S3_ACCESS_KEY_ID", "minioadmin")
    s3_secret_access_key = os.getenv("S3_SECRET_ACCESS_KEY", "minioadmin")
    s3_bucket = os.getenv("S3_BUCKET", "scores-bucket")
    s3_region = os.getenv("S3_REGION", "eu-central-1")
    s3_force_path_style = os.getenv("S3_FORCE_PATH_STYLE", "true").lower() in (
        "1",
        "true",
        "yes",
    )

    return Config(
        amqp_url=amqp_url,
        queue=queue,
        db_url=db_url,
        s3_endpoint_url=s3_endpoint_url,
        s3_access_key_id=s3_access_key_id,
        s3_secret_access_key=s3_secret_access_key,
        s3_bucket=s3_bucket,
        s3_region=s3_region,
        s3_force_path_style=s3_force_path_style,
    )


def make_s3(cfg: Config):
    s3 = boto3.client(
        "s3",
        endpoint_url=cfg.s3_endpoint_url,
        aws_access_key_id=cfg.s3_access_key_id,
        aws_secret_access_key=cfg.s3_secret_access_key,
        region_name=cfg.s3_region,
        config=boto3.session.Config(
            s3={"addressing_style": "path"} if cfg.s3_force_path_style else {}
        ),
    )
    return s3


def db_connect(cfg: Config):
    # autocommit False -> wir machen Transaktionen bewusst
    return psycopg.connect(cfg.db_url, row_factory=dict_row)


def parse_message(body: bytes) -> str:
    data = json.loads(body.decode("utf-8"))
    job_id = data.get("job_id")
    if not isinstance(job_id, str):
        raise ValueError("Message missing job_id")
    return job_id


def claim_job(conn, job_id: str) -> Optional[Dict[str, Any]]:
    """
    Idempotenz/De-Dupe: wenn Job schon PROCESSING/COMPLETED ist, nicht nochmal starten.
    Wir 'claimen' nur, wenn Status PENDING ist.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
      UPDATE songs
      SET status = 'PROCESSING',
          started_at = COALESCE(started_at, NOW()),
          error_message = NULL
      WHERE id = %(id)s
        AND status = 'PENDING'
      RETURNING id, status, started_at;
      """,
            {"id": job_id},
        )
        row = cur.fetchone()
        return row


def mark_failed(conn, job_id: str, error_message: str) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
      UPDATE songs
      SET status = 'FAILED',
          finished_at = NOW(),
          error_message = %(err)s
      WHERE id = %(id)s;
      """,
            {"id": job_id, "err": error_message[:10000]},
        )


def mark_completed(conn, job_id: str) -> None:
    with conn.cursor() as cur:
        cur.execute(
            """
      UPDATE songs
      SET status = 'COMPLETED',
          finished_at = NOW(),
          error_message = NULL
      WHERE id = %(id)s;
      """,
            {"id": job_id},
        )


def fetch_inputs(conn, job_id: str) -> Dict[str, Any]:
    """
    Beispiel: hole ORIGINAL_PDF Key aus files Tabelle.
    Passe das an dein tatsächliches Input-Modell an.
    """
    with conn.cursor() as cur:
        cur.execute(
            """
      SELECT f.s3_key
      FROM files f
      WHERE f.song_id = %(id)s
        AND f.file_type = 'ORIGINAL_PDF'
      ORDER BY f.created_at ASC
      LIMIT 1;
      """,
            {"id": job_id},
        )
        row = cur.fetchone()

    if not row:
        raise RuntimeError("No ORIGINAL_PDF input file for job")

    return {"pdf_key": row["s3_key"]}


def download_s3_to_bytes(s3, bucket: str, key: str) -> bytes:
    resp = s3.get_object(Bucket=bucket, Key=key)
    return resp["Body"].read()


def upload_bytes_to_s3(s3, bucket: str, key: str, data: bytes, content_type: str):
    s3.put_object(
        Bucket=bucket,
        Key=key,
        Body=data,
        ContentType=content_type,
    )


def insert_output_file(conn, job_id: str, file_type: str, s3_key: str, size: int):
    with conn.cursor() as cur:
        cur.execute(
            """
      INSERT INTO files (song_id, file_type, s3_key, size_bytes)
      VALUES (%(song_id)s, %(file_type)s, %(s3_key)s, %(size_bytes)s);
      """,
            {
                "song_id": job_id,
                "file_type": file_type,
                "s3_key": s3_key,
                "size_bytes": size,
            },
        )


def process_job(cfg: Config, conn, s3, job_id: str) -> None:
    """
    Hier kommt deine ML/Processing Pipeline rein.
    Der Skeleton macht:
      - Input PDF laden
      - "verarbeiten" (Dummy)
      - Output nach S3 schreiben
      - DB Eintrag in files anlegen
    """
    inputs = fetch_inputs(conn, job_id)
    pdf_key = inputs["pdf_key"]

    pdf_bytes = download_s3_to_bytes(s3, cfg.s3_bucket, pdf_key)

    # TODO: ersetze das mit echter Verarbeitung
    # Beispiel: generiere MusicXML
    musicxml_bytes = b"<score-partwise version='3.1'></score-partwise>\n"

    out_key = f"jobs/{job_id}/music.xml"
    upload_bytes_to_s3(
        s3,
        cfg.s3_bucket,
        out_key,
        musicxml_bytes,
        content_type="application/vnd.recordare.musicxml+xml",
    )
    insert_output_file(
        conn,
        job_id,
        file_type="MUSIC_XML",
        s3_key=out_key,
        size=len(musicxml_bytes),
    )


def on_message(cfg: Config, s3, connection, channel, method, properties, body):
    try:
        job_id = parse_message(body)
    except Exception:
        # Message ist kaputt -> nicht requeue, sonst Endlosschleife
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
        return

    conn = None
    try:
        conn = db_connect(cfg)

        # Transaktion 1: claim
        conn.execute("BEGIN;")
        claimed = claim_job(conn, job_id)
        conn.commit()

        if not claimed:
            # Schon nicht mehr PENDING -> idempotent drop
            channel.basic_ack(delivery_tag=method.delivery_tag)
            return

        # Transaktion 2: processing + outputs + completion
        conn.execute("BEGIN;")
        process_job(cfg, conn, s3, job_id)
        mark_completed(conn, job_id)
        conn.commit()

        channel.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        if conn is not None:
            try:
                conn.rollback()
            except Exception:
                pass

            try:
                conn.execute("BEGIN;")
                mark_failed(conn, job_id, error_message=traceback.format_exc())
                conn.commit()
            except Exception:
                try:
                    conn.rollback()
                except Exception:
                    pass

        # Requeue?
        # Für "einfach" würde ich erstmal NICHT requeue'n, sonst können Poison-Jobs blockieren.
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

    finally:
        if conn is not None:
            try:
                conn.close()
            except Exception:
                pass


def main():
    cfg = load_config()
    s3 = make_s3(cfg)

    # params = pika.URLParameters(cfg.amqp_url)
    params = pika.URLParameters("amqp://app:app-secret@localhost:5672")
    while True:
        try:
            connection = pika.BlockingConnection(params)
            channel = connection.channel()

            # channel.queue_declare(queue=cfg.queue, durable=True)
            channel.queue_declare(queue="song_jobs", durable=True)

            # global seriell: nur 1 unacked message
            channel.basic_qos(prefetch_count=1)

            # channel.basic_consume(
            #     queue=cfg.queue,
            #     on_message_callback=lambda ch, method, props, body: on_message(
            #         cfg, s3, connection, ch, method, props, body
            #     ),
            #     auto_ack=False,
            # )

            def dummy_consume(ch, method, props, body):
                print(f"[worker] received message: {body.decode('utf-8')}", flush=True)
                print(ch, method, props, body, flush=True)
                time.sleep(1.0)  # simulate work
                ch.basic_ack(delivery_tag=method.delivery_tag)
                print(f"[worker] done processing message", flush=True)

            channel.basic_consume(
                queue="song_jobs",
                on_message_callback=lambda ch, method, props, body: dummy_consume(
                    ch, method, props, body
                ),
                auto_ack=False,
            )

            # print(f"[worker] consuming queue={cfg.queue}", flush=True)
            print(f"[worker] consuming queue={"song_jobs"}", flush=True)
            channel.start_consuming()

        except KeyboardInterrupt:
            print("[worker] stopping", flush=True)
            sys.exit(0)
        except Exception as e:
            print(f"[worker] connection error: {e}", flush=True)
            time.sleep(2.0)


if __name__ == "__main__":
    main()
