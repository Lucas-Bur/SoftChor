// src/server/jobs.ts
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { enqueueJob } from '@/features/queue/lib/rabbitmq'
import { songs } from '@/features/scores/db/schema'

export const enqueueSongProcessing = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      jobId: z.uuid(),
    }),
  )
  .handler(async ({ data }) => {
    const jobId = data.jobId
    // Optional, aber empfehlenswert: Existenz prüfen und Status guarden
    // const [song] = await db
    //   .select({ id: songs.id, status: songs.status })
    //   .from(songs)
    //   .where(eq(songs.id, jobId))
    //   .limit(1)

    // if (!song) {
    //   throw new Error('Song not found')
    // }

    // if (song.status !== 'PENDING') {
    //   // verhindert doppeltes Enqueue aus UI-Races
    //   return { enqueued: false as const, reason: 'NOT_PENDING' as const }
    // }

    // Optional: setze startedAt/PROCESSING erst im Worker (üblich),
    // oder setze hier "PENDING bleibt PENDING" und Worker macht den Transition.
    // Wenn du hier updatest, riskierst du "PROCESSING" ohne Worker-Start bei Publish-Fail.
    //
    // Ich mache daher: erst publish, dann DB minimal ändern ODER gar nicht ändern.

    await enqueueJob({ job_id: jobId })

    // Optional: wenn du willst, dass UI sofort "queued" sieht,
    // könntest du hier einen extra Status QUEUED einführen.
    // Da du nur PENDING/PROCESSING/... hast, lasse ich es bei PENDING.

    return { enqueued: true as const }
  })
