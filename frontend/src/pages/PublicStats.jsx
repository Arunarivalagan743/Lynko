import React from 'react'
import { useParams } from 'react-router-dom'

export default function PublicStats() {
  const { shortCode } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Public Stats for /{shortCode}</h1>
      <p className="text-text-muted">Statistics for this short link.</p>
    </div>
  )
}
