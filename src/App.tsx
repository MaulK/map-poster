import { useState } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import PosterPreview from './components/PosterPreview';
import type { PosterState } from './types';

export default function App() {
  const [state, setState] = useState<PosterState>({
    title: 'Paris',
    subtitle: 'France',
    coordinatesLabel: '48°51′24″N 2°21′8″E',
    lat: 48.8566,
    lon: 2.3522,
    bbox: undefined,
    zoom: 12,
    themeUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    posterStyle: 'A4 Portrait (21x29.7cm)',
    margin: 3,
    fontFamily: 'var(--font-poster-sans)',
    textColor: '#111111',
    paperColor: '#FEFAF6'
  });

  return (
    <div className="app-container">
      <Sidebar state={state} setState={setState} />
      <main className="main-stage">
        <PosterPreview state={state} />
      </main>
    </div>
  );
}
