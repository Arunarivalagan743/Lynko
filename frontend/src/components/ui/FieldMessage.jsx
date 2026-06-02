const FieldMessage = ({ children, tone = 'muted' }) => {
  if (!children) return null

  return (
    <div
      className={
        tone === 'error'
          ? 'rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error'
          : 'rounded-lg border border-border/70 bg-surface px-3 py-2 text-xs text-text-muted'
      }
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}

export default FieldMessage
