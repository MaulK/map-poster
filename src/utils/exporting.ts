import { toPng } from 'html-to-image';

export async function exportPoster(elementId: string) {
  const node = document.getElementById(elementId);
  if (!node) {
    alert("Could not find poster element.");
    return;
  }

  // To ensure high-res export, we scale the rendering process
  const scale = 3; 

  // Temporarily force styles on the node if necessary or just rely on html-to-image scale
  const param = {
    height: node.offsetHeight * scale,
    width: node.offsetWidth * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${node.offsetWidth}px`,
      height: `${node.offsetHeight}px`
    },
    // We must allow CORS for map tiles
    pixelRatio: 1, 
    filter: (domNode: HTMLElement) => {
      // Omit elements like leaflet controls if they slipped through
      if (domNode.classList && domNode.classList.contains('leaflet-control-container')) {
        return false;
      }
      return true;
    }
  };

  try {
    const dataUrl = await toPng(node, param);
    
    const link = document.createElement('a');
    link.download = `MapPoster-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Error generating image', err);
    alert('Failed to generate image. Please ensure all resources have CORS headers enabled.');
  }
}
