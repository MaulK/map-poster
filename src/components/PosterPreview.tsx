import MapEngine from './MapEngine';
import type { PosterState } from '../types';

interface PosterPreviewProps {
  state: PosterState;
}

export default function PosterPreview({ state }: PosterPreviewProps) {
  
  // Calculate aspect ratio
  const getAspectRatio = () => {
    if (state.posterStyle.includes('Square')) return '1 / 1';
    return '1 / 1.414'; // A-series default
  };

  // The text color depends lightly on theme or can be forced for simplicity.
  const frameColor = state.textColor;
  const paperColor = state.paperColor;
  const textColor = state.textColor;
  const subtitleColor = state.textColor;
  
  return (
    <div 
      className="poster-wrapper" 
      id="poster-element" 
      style={{
        aspectRatio: getAspectRatio(),
        backgroundColor: paperColor,
        display: 'flex',
        flexDirection: 'column',
        padding: `${state.margin}%`,
      }}
    >
      {/* Inner Frame */}
      <div 
        style={{ 
          flex: 1, 
          border: `2px solid ${frameColor}`, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        
        {/* Map Area fills the whole poster */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <MapEngine lat={state.lat} lon={state.lon} zoom={state.zoom} bbox={state.bbox} themeUrl={state.themeUrl} />
        </div>

        {/* Labels Overlay at the bottom */}
        <div style={{ flex: 1, zIndex: 2, pointerEvents: 'none' }} />
        
        <div 
          style={{ 
            padding: '6% 8%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            backgroundColor: `${paperColor}F2`, /* Slight transparency so map barely peeks thru, or solid depending on style */
            color: textColor,
            zIndex: 10,
            width: '85%',
            margin: '0 auto 6%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <h2 
            style={{ 
              fontFamily: state.fontFamily, 
              fontSize: '3rem', 
              fontWeight: 800, 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase', 
              margin: 0,
              lineHeight: 1,
              textAlign: 'center'
            }}
          >
            {state.title}
          </h2>
          
          <div style={{ width: '40px', height: '2px', backgroundColor: frameColor, margin: '16px 0' }}></div>
          
          {state.subtitle && (
            <h3 
              style={{ 
                fontFamily: 'var(--font-poster-serif)', 
                fontStyle: 'italic',
                fontSize: '1.2rem', 
                fontWeight: 400,
                color: subtitleColor,
                margin: '0 0 8px 0',
                textAlign: 'center'
              }}
            >
              {state.subtitle}
            </h3>
          )}

          <p 
            style={{ 
              fontFamily: 'var(--font-ui)', 
              fontSize: '0.85rem', 
              letterSpacing: '0.3em', 
              textTransform: 'uppercase', 
              color: subtitleColor,
              margin: 0
            }}
          >
            {state.coordinatesLabel}
          </p>
        </div>

      </div>
    </div>
  );
}
