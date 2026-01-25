import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { enqueueJob } from '@/features/queue/lib/rabbitmq'

export const enqueueSongProcessing = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      jobId: z.uuid(),
      taskType: z.enum(['generate_xml_from_input', 'generate_voices_from_xml']),
      taskParams: z.object({ inputKey: z.string() }),
    }),
  )
  .handler(async ({ data }) => {
    const { jobId, taskType, taskParams } = data

    const message = {
      job_id: jobId,
      task_type: taskType,
      task_params: { input_key: taskParams.inputKey },
    }

    await enqueueJob(message)

    return { enqueued: true as const }
  })
