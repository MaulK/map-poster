import { useState, useRef } from 'react';
import { Download, Search } from 'lucide-react';
import { searchLocation } from '../utils/geocoding';
import type { LocationResult } from '../utils/geocoding';
import { exportPoster } from '../utils/exporting';
import type { PosterState } from '../types';

interface SidebarProps {
  state: PosterState;
  setState: React.Dispatch<React.SetStateAction<PosterState>>;
}

export default function Sidebar({ state, setState }: SidebarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (val.trim().length > 2) {
      searchTimeout.current = setTimeout(async () => {
        setIsSearching(true);
        const res = await searchLocation(val);
        setResults(res);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
    }
  };

  const selectLocation = (loc: LocationResult) => {
    const lat = parseFloat(loc.lat);
    const lon = parseFloat(loc.lon);
    
    // Convert to nice deg min sec or simple lat/lon string
    const latStr = lat >= 0 ? `${lat.toFixed(4)}° N` : `${Math.abs(lat).toFixed(4)}° S`;
    const lonStr = lon >= 0 ? `${lon.toFixed(4)}° E` : `${Math.abs(lon).toFixed(4)}° W`;

    // Try to smartly pick title/subtitle
    const title = loc.address?.city || loc.address?.town || loc.address?.village || loc.name;
    const subtitle = loc.address?.country || loc.address?.state || '';

    const bboxStr = loc.boundingbox;
    let bbox: [number, number, number, number] | undefined;
    if (bboxStr && bboxStr.length === 4) {
      bbox = [parseFloat(bboxStr[0]), parseFloat(bboxStr[1]), parseFloat(bboxStr[2]), parseFloat(bboxStr[3])];
    }

    setState(prev => ({
      ...prev,
      lat,
      lon,
      bbox,
      title: title || loc.name,
      subtitle,
      coordinatesLabel: `${latStr} ${lonStr}`
    }));
    
    setResults([]);
    setQuery('');
  };

  const THEMES = [
    { name: 'Minimal Light', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
    { name: 'Minimal Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
    { name: 'Voyager', url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png' },
    { name: 'OSM Standard', url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="logo">MapPoster</h1>
      </div>
      
      <div className="sidebar-content">
        <div className="control-group">
          <label className="control-label">Location Search</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-secondary)' }} />
            <input 
              type="search" 
              value={query}
              onChange={handleSearchChange}
              placeholder="Search city or region..." 
              style={{ paddingLeft: 40 }}
            />
            {isSearching && <div style={{ position: 'absolute', right: 12, top: 12, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>...</div>}
          </div>
          
          {results.length > 0 && (
            <div style={{ 
              marginTop: 8, 
              background: 'rgba(0,0,0,0.5)', 
              borderRadius: 8, 
              overflow: 'hidden',
              border: '1px solid var(--panel-border)'
            }}>
              {results.map((r, i) => (
                <div 
                  key={i} 
                  onClick={() => selectLocation(r)}
                  style={{ 
                    padding: '10px 12px', 
                    cursor: 'pointer', 
                    borderBottom: i < results.length -1 ? '1px solid var(--panel-border)' : 'none',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ fontWeight: 600, color: 'white' }}>{r.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: 2 }}>{r.display_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="control-group">
          <label className="control-label">Map Theme</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {THEMES.map(theme => (
              <button 
                key={theme.name}
                className={`btn ${state.themeUrl === theme.url ? 'btn-primary' : ''}`}
                onClick={() => setState(prev => ({ ...prev, themeUrl: theme.url }))}
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">Poster Dimensions</label>
           <select 
             className="btn" 
             value={state.posterStyle}
             onChange={e => setState(prev => ({ ...prev, posterStyle: e.target.value }))}
             style={{ width: '100%', textAlign: 'left', appearance: 'none' }}
           >
              <option>A4 Portrait (21x29.7cm)</option>
              <option>A3 Portrait (29.7x42cm)</option>
              <option>Square (30x30cm)</option>
           </select>
        </div>

        <div className="control-group">
          <label className="control-label">Typography & Color</label>
          <select 
             className="btn" 
             value={state.fontFamily}
             onChange={e => setState(prev => ({ ...prev, fontFamily: e.target.value }))}
             style={{ width: '100%', textAlign: 'left', appearance: 'none', marginBottom: '8px' }}
           >
              <option value="var(--font-poster-sans)">Modern Sans</option>
              <option value="var(--font-poster-serif)">Elegant Serif</option>
              <option value="var(--font-ui)">Clean Tech</option>
           </select>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Text / Frame</label>
                <input 
                  type="color" 
                  value={state.textColor}
                  onChange={e => setState(prev => ({ ...prev, textColor: e.target.value }))}
                  style={{ width: '100%', height: '36px', padding: '2px', cursor: 'pointer', border: '1px solid var(--panel-border)', borderRadius: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Paper / BG</label>
                <input 
                  type="color" 
                  value={state.paperColor}
                  onChange={e => setState(prev => ({ ...prev, paperColor: e.target.value }))}
                  style={{ width: '100%', height: '36px', padding: '2px', cursor: 'pointer', border: '1px solid var(--panel-border)', borderRadius: '4px' }}
                />
              </div>
           </div>
        </div>

        <div className="control-group">
          <label className="control-label">Poster Margin (%)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="range" 
              min="0" max="15" step="1"
              value={state.margin}
              onChange={e => setState(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, minWidth: '30px', textAlign: 'right' }}>{state.margin}%</span>
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Custom Labels</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Primary Title" 
              value={state.title} 
              onChange={e => setState(prev => ({ ...prev, title: e.target.value }))}
            />
            <input 
              type="text" 
              placeholder="Subtitle / Country" 
              value={state.subtitle} 
              onChange={e => setState(prev => ({ ...prev, subtitle: e.target.value }))}
            />
            <input 
              type="text" 
              placeholder="Coordinates Label" 
              value={state.coordinatesLabel} 
              onChange={e => setState(prev => ({ ...prev, coordinatesLabel: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="control-group">
          <label className="control-label">Map Zoom (Manual Override)</label>
          <input 
            type="range" 
            min="3" max="18" 
            value={state.zoom}
            onChange={e => setState(prev => ({ ...prev, zoom: parseInt(e.target.value), bbox: undefined }))}
            style={{ width: '100%' }}
          />
        </div>

      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--panel-border)' }}>
        <button 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          onClick={() => exportPoster('poster-element')}
        >
          <Download size={18} />
          Export High-Res Poster
        </button>
      </div>
    </aside>
  );
}
