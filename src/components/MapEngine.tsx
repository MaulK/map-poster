import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapUpdater({ center, zoom, bbox }: { center: [number, number], zoom: number, bbox?: [number, number, number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (bbox) {
      map.fitBounds([
        [bbox[0], bbox[2]],
        [bbox[1], bbox[3]]
      ], { animate: true, duration: 1.5 });
    } else {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, bbox, map]);
  return null;
}

interface MapEngineProps {
  lat: number;
  lon: number;
  zoom: number;
  bbox?: [number, number, number, number];
  themeUrl: string;
}

export default function MapEngine({ lat, lon, zoom, bbox, themeUrl }: MapEngineProps) {
  const position: [number, number] = [lat, lon];

  return (
    <MapContainer 
      center={position} 
      zoom={zoom} 
      zoomControl={false}
      attributionControl={false}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
    >
      <MapUpdater center={position} zoom={zoom} bbox={bbox} />
      {/* The key on TileLayer forces re-render if URL changes */}
      <TileLayer key={themeUrl} url={themeUrl} crossOrigin="anonymous" />
    </MapContainer>
  );
}
