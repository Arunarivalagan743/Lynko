import clsx from 'clsx'

const Spinner = ({ className }) => {
  return (
    <span
      className={clsx(
        'inline-flex h-4 w-4 animate-spin rounded-full border-2 border-border border-t-primary',
        className,
      )}
      aria-hidden="true"
    />
  )
}

export default Spinner
