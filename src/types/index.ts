export interface PosterState {
  title: string;
  subtitle: string;
  coordinatesLabel: string;
  lat: number;
  lon: number;
  bbox?: [number, number, number, number]; // [south, north, west, east]
  zoom: number;
  themeUrl: string;
  posterStyle: string;
}
