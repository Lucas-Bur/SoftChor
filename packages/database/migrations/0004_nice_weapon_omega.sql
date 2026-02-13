ALTER TABLE "files" RENAME COLUMN "song_id" TO "songId";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "file_type" TO "fileType";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "s3_key" TO "s3Key";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "size_bytes" TO "sizeBytes";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "songs" RENAME COLUMN "job_status" TO "status";--> statement-breakpoint
ALTER TABLE "songs" RENAME COLUMN "started_at" TO "startedAt";--> statement-breakpoint
ALTER TABLE "songs" RENAME COLUMN "finished_at" TO "finishedAt";--> statement-breakpoint
ALTER TABLE "songs" RENAME COLUMN "error_message" TO "errorMessage";--> statement-breakpoint
ALTER TABLE "songs" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "voices" RENAME COLUMN "song_id" TO "songId";--> statement-breakpoint
ALTER TABLE "voices" RENAME COLUMN "file_id" TO "fileId";--> statement-breakpoint
ALTER TABLE "voices" RENAME COLUMN "label_raw" TO "labelRaw";--> statement-breakpoint
ALTER TABLE "voices" RENAME COLUMN "voice_type" TO "voiceType";--> statement-breakpoint
ALTER TABLE "voices" RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "files_song_id_songs_id_fk";
--> statement-breakpoint
ALTER TABLE "voices" DROP CONSTRAINT "voices_song_id_songs_id_fk";
--> statement-breakpoint
ALTER TABLE "voices" DROP CONSTRAINT "voices_file_id_files_id_fk";
--> statement-breakpoint
DROP INDEX "idx_files_song";--> statement-breakpoint
DROP INDEX "idx_voices_song";--> statement-breakpoint
DROP INDEX "idx_voices_unassigned";--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_songId_songs_id_fk" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voices" ADD CONSTRAINT "voices_songId_songs_id_fk" FOREIGN KEY ("songId") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voices" ADD CONSTRAINT "voices_fileId_files_id_fk" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_files_song" ON "files" USING btree ("songId");--> statement-breakpoint
CREATE INDEX "idx_voices_song" ON "voices" USING btree ("songId");--> statement-breakpoint
CREATE INDEX "idx_voices_unassigned" ON "voices" USING btree ("songId") WHERE "voices"."voiceType" = 'UNASSIGNED';