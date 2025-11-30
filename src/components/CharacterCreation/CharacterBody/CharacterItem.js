import { useRef, useEffect, useState } from 'react';
import './CharacterItem.css';

function CharacterItem({ item, isSelected, onSelect, onUpdate }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isPainting, setIsPainting] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 120, height: 120 });

  // Configura o tamanho do canvas baseado no container
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Inicializa e redesenha o canvas quando necessário
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      if (item.paintedImage) {
        const paintedImg = new Image();
        paintedImg.onload = () => {
          ctx.drawImage(paintedImg, 0, 0, canvas.width, canvas.height);
        };
        paintedImg.src = item.paintedImage;
      }
    };
    img.src = item.image;

  }, [item.image, item.paintedImage, canvasSize]);

  // Eventos de pintura - APENAS no canvas
  const handleCanvasMouseDown = (e) => {
    if (!item.color) return; // Só pinta se tiver cor selecionada
    
    setIsPainting(true);
    paintAtPosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleCanvasMouseMove = (e) => {
    if (!isPainting || !item.color) return;
    paintAtPosition(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleCanvasMouseUp = () => {
    if (isPainting) {
      setIsPainting(false);
      saveCanvasState();
    }
  };

  // Eventos de drag - NO CONTAINER (div principal)
  const handleContainerDragStart = (e) => {
    // BLOQUEIA drag se o item tem cor selecionada
    if (item.color) {
      e.preventDefault();
      return;
    }
    
    console.log('🚀 Starting drag for:', item.name);
    const itemData = JSON.stringify(item);
    e.dataTransfer.setData('application/json', itemData);
    e.dataTransfer.effectAllowed = 'move';
  };

  const paintAtPosition = (x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = item.color;
    ctx.beginPath();
    
    const brushSize = Math.max(canvas.width, canvas.height) * 0.05;
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.globalCompositeOperation = 'source-over';
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    onUpdate({ ...item, paintedImage: dataURL });
  };

  const handleContainerClick = (e) => {
    e.stopPropagation();
    onSelect(item);
  };

  // Determina se o item é arrastável
  const isDraggable = !item.color;

  return (
    <div
      ref={containerRef}
      className={`character-item ${isSelected ? 'selected' : ''} ${item.color ? 'has-color' : ''}`}
      style={{
        left: `${item.position.x}%`,
        top: `${item.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: '120px',
        height: '120px'
      }}
      onClick={handleContainerClick}
      draggable={isDraggable} // Só permite drag se NÃO tiver cor
      onDragStart={handleContainerDragStart}
    >
      <canvas
        ref={canvasRef}
        className="item-canvas"
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
        style={{ 
          cursor: item.color ? 'crosshair' : 'default',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}

export default CharacterItem;