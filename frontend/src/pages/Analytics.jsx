import React from 'react'
import { useParams } from 'react-router-dom'

export default function Analytics() {
  const { id } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Analytics for URL ID: {id}</h1>
      <p className="text-text-muted">Visual analytics dashboards for this short link.</p>
    </div>
  )
}
