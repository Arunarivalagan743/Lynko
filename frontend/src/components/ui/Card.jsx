import clsx from 'clsx'

const Card = ({
  className,
  dogEar,
  shadowSize = 'md',
  variant = 'default',
  hover = false,
  sharp = false, // explicit opt-in for 0px radius (status blocks, QR frames)
  ...props
}) => {
  return (
    <div
      className={clsx(
        'border-2 border-primary relative transition-all duration-normal',
        // Border radius: soft brutalism by default, sharp only when explicitly requested
        sharp ? 'rounded-none' : 'rounded-card',
        // Shadow sizes
        shadowSize === 'lg' ? 'shadow-brutal-lg' :
          shadowSize === 'sm' ? 'shadow-brutal-sm' :
            shadowSize === 'xs' ? 'shadow-brutal-xs' :
              shadowSize === 'none' ? '' :
                'shadow-brutal',
        // Variant backgrounds + padding
        variant === 'flat' && 'bg-surface-container-low px-6 py-6',
        variant === 'tinted' && 'bg-surface-container px-6 py-6',
        variant === 'elevated' && 'bg-white px-6 py-6',
        variant === 'default' && 'bg-white px-6 py-6',
        // Hover lift
        hover && 'card-hover',
        // Dog ear fold (only on sharp cards — doesn't look right with radius)
        dogEar && 'dog-ear',
        className,
      )}
      {...props}
    />
  )
}

export default Card
