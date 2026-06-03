import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Globe, MapPin } from 'lucide-react'

export default function VisitorMap({ pins = [], isLoading = false }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    // 1. Initialize map only once
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 2,
        minZoom: 1,
        maxZoom: 18,
        zoomControl: false, // Custom position control
      })

      // Add zoom control at bottom-right for clean looks
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map)

      mapInstanceRef.current = map
    }

    // Cleanup map on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // 2. Clear old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    if (!pins || pins.length === 0) {
      // Reset view to default if no pins
      map.setView([20, 0], 2)
      return
    }

    const bounds = L.latLngBounds()

    // 3. Add new markers
    pins.forEach((pin) => {
      const { lat, lng, clicks, country, city, region } = pin
      if (typeof lat !== 'number' || typeof lng !== 'number') return

      // Create a gorgeous neo-brutalist custom marker
      const customIcon = L.divIcon({
        className: 'custom-brutal-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer">
            <div class="absolute w-8 h-8 bg-secondary/35 rounded-full animate-ping pointer-events-none"></div>
            <div class="relative w-7 h-7 bg-secondary border border-primary/20 flex items-center justify-center font-sans text-[11px] font-bold text-white shadow-sm rounded-full hover:scale-110 transition-transform">
              ${clicks}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      })

      const locationString = [city, region, country].filter(Boolean).join(', ')

      const popupContent = `
        <div class="font-sans p-2 text-primary space-y-1">
          <div class="flex items-center gap-1.5 border-b border-primary/10 pb-1">
            <span class="font-bold text-[10px] uppercase tracking-wider text-secondary">Location Details</span>
          </div>
          <div class="font-bold text-sm text-primary">
            📍 ${locationString}
          </div>
          <div class="flex justify-between items-center text-xs pt-1 border-t border-primary/10 font-bold">
            <span class="text-on-surface-variant font-medium">Clicks registered:</span>
            <span class="bg-primary text-white px-2 py-0.5 ml-2 font-mono font-bold rounded">${clicks}</span>
          </div>
        </div>
      `

      const marker = L.marker([lat, lng], { icon: customIcon })
        .bindPopup(popupContent, {
          closeButton: false,
          className: 'custom-brutal-popup'
        })
        .addTo(map)

      markersRef.current.push(marker)
      bounds.extend([lat, lng])
    })

    // 4. Fit map to markers bounds
    if (pins.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 })
    }
  }, [pins])

  return (
    <div className="w-full rounded-lg border border-primary/15 bg-white shadow-sm relative overflow-hidden">
      {/* Dynamic Style injection for custom styled Leaflet & Popups */}
      <style>{`
        /* Theming Leaflet Tiles to match Paper Tech */
        .paper-tech-map-container .leaflet-tile-container {
          filter: grayscale(100%) sepia(30%) contrast(90%) brightness(95%) hue-rotate(60deg);
        }
        /* Style adjustments for brutality */
        .paper-tech-map-container {
          background-color: #f2f4ef !important;
        }
        .custom-brutal-popup .leaflet-popup-content-wrapper {
          border-radius: 8px !important;
          border: 1px solid rgba(0, 50, 45, 0.1) !important;
          background: #ffffff !important;
          box-shadow: 0 4px 6px -1px rgba(0, 50, 45, 0.05) !important;
          color: #00322d !important;
        }
        .custom-brutal-popup .leaflet-popup-tip {
          border: 1px solid rgba(0, 50, 45, 0.1) !important;
          background: #ffffff !important;
          box-shadow: none !important;
        }
      `}</style>

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-primary/10 bg-surface-container-low px-5 py-3 select-none">
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-primary animate-spin-[20s]" />
          <h2 className="font-anton text-sm uppercase tracking-wide text-primary">Visitor Geography Map</h2>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase bg-white border border-primary/20 rounded-md px-2.5 py-0.5 text-primary">
          <span>Active Coordinates:</span>
          <span>{pins.length}</span>
        </div>
      </div>

      {/* Map body */}
      <div className="relative h-[380px] w-full paper-tech-map-container">
        {isLoading && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm space-y-3">
            <Globe size={32} className="text-primary animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Plotting coordinates...</p>
          </div>
        )}
        
        {!isLoading && pins.length === 0 && (
          <div className="absolute inset-0 z-[999] flex flex-col items-center justify-center bg-surface-container-low/20 p-6 text-center space-y-3">
            <MapPin size={36} className="text-primary/30 animate-pulse" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold uppercase text-primary">No Geolocation Pins</h4>
              <p className="label-meta text-on-surface-variant max-w-sm">
                Visits must contain valid latitude & longitude coordinates from IP geocoding to display on this map.
              </p>
            </div>
          </div>
        )}

        <div ref={mapRef} className="h-full w-full z-10" />
      </div>
    </div>
  )
}
