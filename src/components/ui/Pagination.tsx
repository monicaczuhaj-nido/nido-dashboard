import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  page: number
  totalPages: number
  total: number
  pageSize: number
  hrefPrev: string
  hrefNext: string
}

export default function Pagination({ page, totalPages, total, pageSize, hrefPrev, hrefNext }: Props) {
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const btn = 'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors'
  const active = `${btn} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`
  const disabled = `${btn} border-gray-100 text-gray-300 cursor-not-allowed select-none`

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">
        Mostrando {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-2">
        {page > 1
          ? <Link href={hrefPrev} className={active}><ChevronLeft size={14} />Anterior</Link>
          : <span className={disabled}><ChevronLeft size={14} />Anterior</span>
        }
        {page < totalPages
          ? <Link href={hrefNext} className={active}>Siguiente<ChevronRight size={14} /></Link>
          : <span className={disabled}>Siguiente<ChevronRight size={14} /></span>
        }
      </div>
    </div>
  )
}
