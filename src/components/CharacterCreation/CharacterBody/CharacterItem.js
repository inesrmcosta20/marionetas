
import { useRef, useEffect, useState } from 'react';
import './CharacterItem.css';

function CharacterItem({ item, isSelected, onSelect, onUpdate, panelId }) {
  const canvasRef = useRef();
  const containerRef = useRef();
  const [painting, setPainting] = useState(false);
  const [size, setSize] = useState({ width: 120, height: 120 });

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setSize({ width, height });
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = size.width;
    canvas.height = size.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      if (item.paintedImage) {
        const paintedImg = new window.Image();
        paintedImg.onload = () => ctx.drawImage(paintedImg, 0, 0, canvas.width, canvas.height);
        paintedImg.src = item.paintedImage;
      }
    };
    img.src = item.image;
  }, [item.image, item.paintedImage, size]);

  const paint = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(x, y, Math.max(canvas.width, canvas.height) * 0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  };

  const save = () => {
    const canvas = canvasRef.current;
    onUpdate({ ...item, paintedImage: canvas.toDataURL('image/png') });
  };

  return (
    <div
      ref={containerRef}
      className={`character-item${isSelected ? ' selected' : ''}${item.color ? ' has-color' : ''}`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 120,
        height: 120
      }}
      onClick={e => { 
        console.log(`🖱️ [${panelId || 'CharacterItem'}] Item clicked:`, item.name);
        e.stopPropagation(); 
        onSelect(item); 
      }}
      draggable={!item.color}
      onDragStart={e => {
        if (item.color) return e.preventDefault();
        e.dataTransfer.setData('application/json', JSON.stringify(item));
        e.dataTransfer.effectAllowed = 'move';
        console.log(`👆 [${panelId || 'CharacterItem'}] Drag started for:`, item.name);
      }}
      data-panel-id={panelId}
    >
      <canvas
        ref={canvasRef}
        className="item-canvas"
        onMouseDown={e => { if (item.color) { setPainting(true); paint(e.nativeEvent.offsetX, e.nativeEvent.offsetY); } }}
        onMouseMove={e => { if (painting && item.color) paint(e.nativeEvent.offsetX, e.nativeEvent.offsetY); }}
        onMouseUp={() => { if (painting) { setPainting(false); save(); } }}
        onMouseLeave={() => { if (painting) { setPainting(false); save(); } }}
        style={{ cursor: item.color ? 'crosshair' : 'default', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}

export default CharacterItem;
