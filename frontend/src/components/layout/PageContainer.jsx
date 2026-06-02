import React from 'react'

export default function PageContainer({ children, className = '' }) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-6 py-8 md:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  )
}
