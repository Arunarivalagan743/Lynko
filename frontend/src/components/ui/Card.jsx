import clsx from 'clsx'

const Card = ({ className, dogEar, shadowSize = 'md', variant = 'default', hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'border-2 border-primary rounded-none relative transition-all duration-normal',
        // Shadow sizes
        shadowSize === 'lg' ? 'shadow-brutal-lg' : shadowSize === 'sm' ? 'shadow-brutal-sm' : shadowSize === 'none' ? '' : 'shadow-brutal',
        // Variant backgrounds + padding
        variant === 'flat' && 'bg-surface-container-low px-7 py-7',
        variant === 'tinted' && 'bg-surface-container px-7 py-7',
        variant === 'elevated' && 'bg-white px-7 py-7',
        variant === 'default' && 'bg-white px-7 py-7',
        // Hover lift
        hover && 'card-hover',
        // Dog ear fold
        dogEar && 'dog-ear',
        className,
      )}
      {...props}
    />
  )
}

export default Card
