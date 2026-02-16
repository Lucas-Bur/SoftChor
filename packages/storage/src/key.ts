import { v7 as uuidv7 } from 'uuid'

/**
 * Generate a unique storage key for a file using UUIDv7.
 * UUIDv7 is time-sortable, which is useful for organizing uploads.
 *
 * @param filename - The original filename to extract extension from
 * @param prefix - Optional prefix for the key (defaults to 'uploads')
 * @returns A unique storage key in the format: prefix/uuid.extension
 */
export function generateStorageKey(filename: string, prefix = 'uploads'): string {
  const uuidV7 = uuidv7()
  const extension = filename.split('.').pop() ?? ''
  return `${prefix}/${uuidV7}.${extension}`
}
