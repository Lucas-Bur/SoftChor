/**
 * Storage type definitions for SoftChor.
 */

export interface FileMetadata {
  key: string
  size: number
  contentType: string
  lastModified?: Date
}

export type FileType = 'audio' | 'image' | 'document' | 'other'
