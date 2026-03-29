'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, Image } from 'lucide-react'

interface FileUploadProps {
  onChange: (files: File[]) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export default function FileUpload({ onChange }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return
      setError(null)

      const valid: File[] = []
      for (const file of Array.from(incoming)) {
        if (!ACCEPTED.includes(file.type)) {
          setError(`"${file.name}": tipo no permitido. Solo PDF, imágenes y texto.`)
          continue
        }
        if (file.size > MAX_SIZE) {
          setError(`"${file.name}": excede el límite de 10 MB.`)
          continue
        }
        if (!files.some((f) => f.name === file.name && f.size === file.size)) {
          valid.push(file)
        }
      }

      const next = [...files, ...valid]
      setFiles(next)
      onChange(next)
    },
    [files, onChange]
  )

  const removeFile = (index: number) => {
    const next = files.filter((_, i) => i !== index)
    setFiles(next)
    onChange(next)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const FileIcon = ({ type }: { type: string }) => {
    if (type.startsWith('image/')) return <Image size={14} className="text-blue-500" />
    return <FileText size={14} className="text-gray-400" />
  }

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <Upload size={20} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">
          Arrastrá archivos acá o{' '}
          <span className="text-indigo-600 font-medium">buscá en tu dispositivo</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF, imágenes, texto — máx. 10 MB por archivo</p>
        <input
          id="file-input"
          type="file"
          multiple
          accept={ACCEPTED.join(',')}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
              <FileIcon type={file.type} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
              </div>
              {file.type.startsWith('image/') && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-10 h-10 object-cover rounded border border-gray-200"
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="text-gray-400 hover:text-red-500 flex-shrink-0 transition-colors"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
