import clsx from 'clsx'

const Card = ({ className, ...props }) => {
  return (
    <div
      className={clsx(
        'rounded-card border border-border/80 bg-white px-6 py-6 shadow-subtle',
        className,
      )}
      {...props}
    />
  )
}

export default Card
