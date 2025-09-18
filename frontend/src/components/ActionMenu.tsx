import { useEffect, useRef, useState } from 'react'

type Props = {
  onEdit?: () => void
  onDelete?: () => void
  disabledDelete?: boolean
}

export default function ActionMenu({ onEdit, onDelete, disabledDelete }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        className="px-2 py-1 rounded border bg-white"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        ⋮
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-1 w-36 rounded border bg-white shadow-lg z-10"
        >
          {onEdit && (
            <button
              role="menuitem"
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
              onClick={() => { onEdit(); setOpen(false) }}
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              role="menuitem"
              className={`w-full text-left px-3 py-2 hover:bg-gray-50 ${disabledDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => { if (!disabledDelete) { onDelete(); setOpen(false) } }}
              disabled={disabledDelete}
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  )
}
