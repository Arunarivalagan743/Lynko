import React from 'react'
import logoPng from '../../assets/logo.png'

/**
 * LynkoLogo — premium logo component utilizing logo.png
 *
 * Props:
 *   variant  — 'full' (icon + wordmark) | 'icon' (icon only)
 *   size     — 'sm' | 'md' | 'lg'
 *   theme    — 'color' | 'white'
 */

const sizes = {
  sm: { icon: 28, text: 'text-base' },
  md: { icon: 36, text: 'text-xl'   },
  lg: { icon: 48, text: 'text-3xl'  },
}

const Logo = ({ variant = 'full', size = 'md', theme = 'color', className = '' }) => {
  const { icon: iconSize, text: textSize } = sizes[size] || sizes.md
  const wordmarkColor = theme === 'white' ? '#ffffff' : '#00322d' // Unified brand primary green

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand logo PNG image */}
      <img
        src={logoPng}
        alt="Lynko Logo"
        width={iconSize}
        height={iconSize}
        className="object-contain shrink-0"
      />

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
