ALTER TABLE "voices" DROP CONSTRAINT "voices_fileId_files_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "fileType" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."file_type";--> statement-breakpoint
CREATE TYPE "public"."file_type" AS ENUM('SCORE', 'MUSIC_XML', 'AUDIO');--> statement-breakpoint
ALTER TABLE "files" ALTER COLUMN "fileType" SET DATA TYPE "public"."file_type" USING "fileType"::"public"."file_type";--> statement-breakpoint
ALTER TABLE "files" ADD COLUMN "voiceId" uuid;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_voiceId_voices_id_fk" FOREIGN KEY ("voiceId") REFERENCES "public"."voices"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_files_voice" ON "files" USING btree ("voiceId");--> statement-breakpoint
ALTER TABLE "voices" DROP COLUMN "fileId";