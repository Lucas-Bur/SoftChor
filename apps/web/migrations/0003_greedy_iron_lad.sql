CREATE TYPE "public"."file_type" AS ENUM('ORIGINAL_PDF', 'MUSIC_XML', 'FULL_MP3', 'VOICE_MP3');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."voice_type" AS ENUM('SOPRANO', 'ALTO', 'TENOR', 'BASS', 'OTHER', 'UNASSIGNED');--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"song_id" uuid NOT NULL,
	"file_type" "file_type" NOT NULL,
	"s3_key" text NOT NULL,
	"size_bytes" bigint,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"job_status" "job_status" DEFAULT 'PENDING',
	"started_at" timestamp with time zone,
	"finished_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "voices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"song_id" uuid NOT NULL,
	"file_id" uuid NOT NULL,
	"label_raw" varchar(100) NOT NULL,
	"voice_type" "voice_type" DEFAULT 'UNASSIGNED',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voices" ADD CONSTRAINT "voices_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voices" ADD CONSTRAINT "voices_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_files_song" ON "files" USING btree ("song_id");--> statement-breakpoint
CREATE INDEX "idx_voices_song" ON "voices" USING btree ("song_id");--> statement-breakpoint
CREATE INDEX "idx_voices_unassigned" ON "voices" USING btree ("song_id") WHERE "voices"."voice_type" = 'UNASSIGNED';