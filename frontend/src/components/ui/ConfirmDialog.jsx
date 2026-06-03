import { useEffect } from 'react'
import clsx from 'clsx'
import { X } from 'lucide-react'
import Card from './Card.jsx'
import Button from './Button.jsx'

const ConfirmDialog = ({
  open,
  title,
  description,
  details = [],
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmTone = 'primary',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onCancel?.()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-primary/20 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div className="relative z-10 w-full max-w-lg">
        <Card className="space-y-4 p-0" shadowSize="lg">
          <div className="flex items-start justify-between border-b-2 border-primary px-6 py-5">
            <div>
              <p className="label-overline">Confirm</p>
              <h2 className="heading-section text-primary">{title}</h2>
            </div>
            <button
              type="button"
              onClick={loading ? undefined : onCancel}
              className="rounded-none border-2 border-primary bg-white p-2 text-primary shadow-brutal-xs hover:bg-surface-container-low active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all duration-fast"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-3 px-6">
            {description && (
              <p className="text-sm font-medium text-on-surface-variant">{description}</p>
            )}
            {details.length > 0 && (
              <div className="border-2 border-primary/20 bg-surface-container-low px-4 py-3 text-xs font-space uppercase font-bold text-primary">
                {details.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 border-t-2 border-primary px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
              className="sm:min-w-[140px]"
            >
              {cancelLabel}
            </Button>
            <Button
              variant={confirmTone === 'danger' ? 'secondary' : 'primary'}
              onClick={onConfirm}
              loading={loading}
              className={clsx(
                'sm:min-w-[160px]',
                confirmTone === 'danger' &&
                'border-2 border-error bg-error text-white shadow-brutal hover:bg-error/80 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
              )}
            >
              {confirmLabel}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ConfirmDialog
