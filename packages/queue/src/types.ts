import { z } from 'zod'

/**
 * Task types supported by the worker.
 * TODO: Keep in sync with Python worker (apps/worker/src/task_types.py)
 */
export const TaskType = z.enum(['generate_xml_from_input', 'generate_voices_from_xml'])

export type TaskType = z.infer<typeof TaskType>

export const JobMessageSchema = z.object({
  job_id: z.string().uuid(),
  task_type: TaskType,
  task_params: z.object({
    input_key: z.string(),
  }),
})

export type JobMessage = z.infer<typeof JobMessageSchema>
