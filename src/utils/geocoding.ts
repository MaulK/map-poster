export interface LocationResult {
  place_id: number;
  lat: string;
  lon: string;
  boundingbox?: string[]; // [latMin, latMax, lonMin, lonMax]
  display_name: string;
  name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    country?: string;
    state?: string;
  };
}

export async function searchLocation(query: string): Promise<LocationResult[]> {
  if (!query) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });
    const data = await res.json();
    return data;
  } catch(e) {
    console.error("Geocoding error:", e);
    return [];
  }
}
