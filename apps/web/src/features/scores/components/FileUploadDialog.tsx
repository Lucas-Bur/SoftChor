import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { db, files, generateTxId, SONG_FILE } from '@repo/database'
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui'

import { FileUpload } from '@/components/FileUpload'
import { uploadFileFn } from '@/features/s3/services/storage'
import { voicesCollection } from '@/features/scores/db/collections'

import { zodResolver } from '@hookform/resolvers/zod'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { createServerFn } from '@tanstack/react-start'

const fileTypeLabels = {
  SCORE: 'Score (PDF/Image)',
  MUSIC_XML: 'MusicXML',
  AUDIO: 'Audio (MP3/WAV)',
}

const uploadSchema = z.object({
  fileType: z.enum(SONG_FILE),
  voiceId: z.string().optional(),
})

type UploadForm = z.infer<typeof uploadSchema>

interface FileUploadDialogProps {
  songId: string
  children: React.ReactNode
}

const uploadFileServer = createServerFn({ method: 'POST' })
  .inputValidator(z.instanceof(FormData))
  .handler(async ({ data: inputFormData }) => {
    const songId = inputFormData.get('songId') as string
    const file = inputFormData.get('file') as File
    const fileType = inputFormData.get('fileType') as string as (typeof SONG_FILE)[number]
    const voiceId = inputFormData.get('voiceId') as string | null
    // Upload to S3
    const uploadResult = await uploadFileFn({
      data: (() => {
        const formData = new FormData()
        formData.append('file', file)
        return formData
      })(),
    })

    // Save to DB
    const result = await db.transaction(async tx => {
      const txid = await generateTxId(tx)
      const newFile = await tx
        .insert(files)
        .values({
          songId,
          voiceId: voiceId ?? null,
          fileType,
          s3Key: uploadResult.key,
          originalName: file.name,
          sizeBytes: file.size,
        })
        .returning()
      return { item: newFile[0], txid }
    })

    return result
  })

export function FileUploadDialog({ songId, children }: FileUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: voices } = useLiveQuery(q =>
    q.from({ voicesCollection }).where(v => eq(v.voicesCollection.songId, songId))
  )

  const form = useForm<UploadForm>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      fileType: 'SCORE',
    },
  })

  const fileType = form.watch('fileType')

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || uploading) return

    const formData = form.getValues()
    if (fileType === 'AUDIO' && voices.length > 0 && !formData.voiceId) {
      toast.error('Please select a voice for audio files')
      return
    }

    setUploading(true)
    try {
      const uploadFormData = new FormData()
      uploadFormData.append('songId', songId)
      uploadFormData.append('file', selectedFile)
      uploadFormData.append('fileType', formData.fileType)
      if (formData.voiceId) {
        uploadFormData.append('voiceId', formData.voiceId)
      }
      await uploadFileServer({ data: uploadFormData })
      toast.success('File uploaded successfully')
      setOpen(false)
      form.reset()
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload scores, MusicXML, or audio files for this song.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <FormField
              control={form.control}
              name='fileType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select file type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SONG_FILE.map(type => (
                        <SelectItem key={type} value={type}>
                          {fileTypeLabels[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {fileType === 'AUDIO' && (
              <FormField
                control={form.control}
                name='voiceId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select voice' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voices.map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.labelRaw}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FileUpload
              accept={
                fileType === 'SCORE'
                  ? 'application/pdf,image/*'
                  : fileType === 'MUSIC_XML'
                    ? 'application/xml,text/xml'
                    : 'audio/*'
              }
              maxSize={
                fileType === 'SCORE'
                  ? 50 * 1024 * 1024 // 50MB
                  : fileType === 'MUSIC_XML'
                    ? 10 * 1024 * 1024 // 10MB
                    : 100 * 1024 * 1024 // 100MB
              }
              onUpload={handleFileSelect}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type='submit' onClick={handleSubmit} disabled={!selectedFile || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
