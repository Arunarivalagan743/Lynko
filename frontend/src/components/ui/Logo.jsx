/**
 * LynkoLogo — premium inline SVG logo component
 *
 * Props:
 *   variant  — 'full' (icon + wordmark) | 'icon' (icon only)
 *   size     — 'sm' | 'md' | 'lg'
 *   theme    — 'color' (indigo gradient) | 'white' (all white, for dark BGs)
 */

const sizes = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 36, text: 'text-xl'   },
  lg: { icon: 48, text: 'text-3xl'  },
}

const Logo = ({ variant = 'full', size = 'md', theme = 'color', className = '' }) => {
  const { icon: iconSize, text: textSize } = sizes[size] || sizes.md
  const gradId = `lg-${size}`

  const iconFill = theme === 'white' ? '#ffffff' : `url(#${gradId})`
  const wordmarkColor = theme === 'white' ? '#ffffff' : '#0f172a'

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Chain-link icon mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Top-left rounded rectangle — first link */}
        <rect
          x="3" y="9"
          width="22" height="11"
          rx="5.5"
          fill={iconFill}
        />

        {/* Bottom-right rounded rectangle — second link */}
        <rect
          x="15" y="20"
          width="22" height="11"
          rx="5.5"
          fill={iconFill}
        />

        {/* Overlap punch-through cutout on top link (bottom-right corner of top rect) */}
        <rect
          x="21" y="15"
          width="6" height="9"
          rx="0"
          fill={theme === 'white' ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)'}
        />
      </svg>

      {/* Wordmark */}
      {variant === 'full' && (
        <span
          className={`font-semibold tracking-tight leading-none ${textSize}`}
          style={{ color: wordmarkColor, fontFamily: "'Outfit', 'Inter', sans-serif", letterSpacing: '-0.02em' }}
        >
          Lynko
        </span>
      )}
    </div>
  )
}

export default Logo
