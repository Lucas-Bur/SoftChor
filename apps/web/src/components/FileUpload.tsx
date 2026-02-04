'use client'

import { FileAudio, Loader2, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

type FileUploadProps = {
  accept?: string
  maxSize?: number // in bytes
  onUpload?: (
    file: File,
    onProgress: (progress: number) => void,
  ) => Promise<void>
  onRemove?: () => void
}

export function FileUpload({
  accept = '*',
  maxSize = 50 * 1024 * 1024, // 50MB default
  onUpload,
  onRemove,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      setError(`File size exceeds ${formatBytes(maxSize)}`)
      return
    }

    setFile(selectedFile)
    setError(null)
    setProgress(0)

    if (onUpload) {
      setIsUploading(true)
      try {
        await onUpload(selectedFile, setProgress)
        setProgress(100)
      } catch (e: unknown) {
        console.error(e)
        setError('Upload failed')
        setFile(null)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const handleRemove = () => {
    setFile(null)
    setProgress(0)
    setError(null)
    onRemove?.()
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className='w-full max-w-md'>
      {/* Upload Area */}
      {!file && (
        <div className='relative'>
          <input
            type='file'
            accept={accept}
            onChange={handleFileChange}
            className='sr-only'
            id='file-upload'
            disabled={isUploading}
          />
          <label
            htmlFor='file-upload'
            className={cn(
              'flex flex-col items-center justify-center',
              'border-2 border-dashed rounded-lg p-8',
              'cursor-pointer transition-colors',
              'hover:border-primary hover:bg-primary/5',
              isUploading && 'pointer-events-none opacity-50',
            )}
          >
            <FileAudio className='h-12 w-12 mb-4 text-muted-foreground' />
            <p className='mb-2 text-foreground'>
              Klicken Sie, um eine Datei auszuwählen
            </p>
            <p className='text-sm text-muted-foreground'>
              Max {formatBytes(maxSize)}
            </p>
          </label>
        </div>
      )}

      {/* Upload Progress */}
      {file && isUploading && (
        <div className='border rounded-lg p-6'>
          <div className='flex items-center gap-4 mb-4'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium truncate'>{file.name}</p>
              <p className='text-xs text-muted-foreground'>
                Uploading... {progress}%
              </p>
            </div>
          </div>
          <Progress value={progress} className='h-2' />
        </div>
      )}

      {/* Upload Complete */}
      {file && !isUploading && (
        <div className='border rounded-lg p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3 min-w-0'>
              <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                <FileAudio className='h-5 w-5 text-primary' />
              </div>
              <div className='min-w-0'>
                <p className='text-sm font-medium truncate'>{file.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatBytes(file.size)}
                </p>
              </div>
            </div>
            <Button variant='ghost' size='icon' onClick={handleRemove}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className='mt-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm'>
          {error}
        </div>
      )}
    </div>
  )
}
