import React from 'react'

export default function JumpingLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[9999]">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="loader">
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__bar"></div>
          <div className="loader__ball"></div>
        </div>
        <p className="font-space text-[11px] font-bold uppercase tracking-[0.2em] text-primary animate-pulse">
          Securing session...
        </p>
      </div>
    </div>
  )
}
export { JumpingLoader }
