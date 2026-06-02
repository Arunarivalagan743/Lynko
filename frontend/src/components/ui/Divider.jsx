const Divider = ({ label }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-text-muted">
          {label}
        </span>
      )}
      <div className="h-px flex-1 bg-border" />
    </div>
  )
}

export default Divider
