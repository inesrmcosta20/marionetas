
import { useState, useRef, useEffect } from 'react';
import './Carousel.css';

function Carousel({ 
  items = [], 
  onItemSelect, 
  type = 'items', 
  onAddNew, 
  selectedColor,
  panelId // ← NOVO: Recebe identificador do painel
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const activeDragsRef = useRef(new Map());
  const lastTapRef = useRef(0); // Para detectar double tap

  const startTouchDrag = (e, item, idx) => {
    // Evitar conflito com toque rápido (double tap)
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;
    
    if (timeSinceLastTap < 300) { // Double tap detection
      console.log(`[carousel ${panelId}] Double tap detected, ignoring drag`);
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    
    lastTapRef.current = now;

    // Apenas para touch/pointer
    if (e.pointerType === 'mouse') return;

    // Prevenir comportamento padrão
    e.stopPropagation();
    e.preventDefault?.();

    const pointerId = e.pointerId;
    
    // Verificar se este pointer já está arrastando
    if (activeDragsRef.current.has(pointerId)) {
      console.log(`[carousel ${panelId}] Pointer ${pointerId} já está arrastando`);
      return;
    }

   const dragItem = { 
    ...item, 
    id: item.id || `${Date.now()}_${idx}`,
    type: item.type // ← Garantir que o type está presente
  };
  
  console.log(`[carousel ${panelId}] Iniciando arrasto: ${dragItem.name}, type: ${dragItem.type}, pointer: ${pointerId}`);

    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    ghost.setAttribute('data-panel-id', panelId);
    
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name || '';
      img.style.width = '80px';
      img.style.height = '80px';
      img.style.objectFit = 'contain';
      ghost.appendChild(img);
    } else if (item.color) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '80px';
      colorDiv.style.height = '80px';
      colorDiv.style.backgroundColor = item.color;
      colorDiv.style.borderRadius = '6px';
      ghost.appendChild(colorDiv);
    } else {
      const emojiDiv = document.createElement('div');
      emojiDiv.textContent = item.emoji || '👕';
      emojiDiv.style.fontSize = '40px';
      emojiDiv.style.textAlign = 'center';
      emojiDiv.style.lineHeight = '80px';
      ghost.appendChild(emojiDiv);
    }

    Object.assign(ghost.style, {
      position: 'fixed',
      left: `${e.clientX}px`,
      top: `${e.clientY}px`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 10000,
      borderRadius: '6px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '6px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.2)',
      border: '2px solid #007bff',
      transition: 'transform 0.1s ease'
    });

    document.body.appendChild(ghost);
    activeDragsRef.current.set(pointerId, { item: dragItem, ghost });

    console.log(`[carousel ${panelId}] Ghost criado para pointer ${pointerId}`);
  };

  // Handlers globais para múltiplos arrastos simultâneos
  useEffect(() => {
    const onPointerMove = (mv) => {
      const drag = activeDragsRef.current.get(mv.pointerId);
      if (!drag) return;

      const { ghost } = drag;
      if (ghost && ghost.parentElement) {
        ghost.style.left = `${mv.clientX}px`;
        ghost.style.top = `${mv.clientY}px`;
      }
    };

    const onPointerUp = (up) => {
      const drag = activeDragsRef.current.get(up.pointerId);
      if (!drag) return;

      const { item: dragItem, ghost } = drag;

      console.log(`[carousel ${panelId}] Soltando item ${dragItem.name} em x:${Math.round(up.clientX)}, y:${Math.round(up.clientY)}`);

      // Encontrar o character-body correto baseado no panelId
      let targetBody = null;
      const allBodies = document.querySelectorAll('.character-body');
      
      for (let body of allBodies) {
        const bodyPanelId = body.getAttribute('data-panel-id');
        const rect = body.getBoundingClientRect();
        const isInside = (
          up.clientX >= rect.left &&
          up.clientX <= rect.right &&
          up.clientY >= rect.top &&
          up.clientY <= rect.bottom
        );
        
        if (isInside) {
          // Preferir o body com o mesmo panelId
          if (bodyPanelId === panelId) {
            targetBody = body;
            console.log(`[carousel ${panelId}] Encontrado body com panelId correspondente`);
            break;
          } else if (!targetBody) {
            targetBody = body; // Fallback para qualquer body
          }
        }
      }

      // Se encontrou um body válido, disparar evento
      if (targetBody) {
        const rect = targetBody.getBoundingClientRect();
        const relativeX = up.clientX - rect.left;
        const relativeY = up.clientY - rect.top;
        const percentX = (relativeX / rect.width) * 100;
        const percentY = (relativeY / rect.height) * 100;

        const dropDetail = {
          ...dragItem,
          position: {
            x: Math.max(0, Math.min(100, percentX)),
            y: Math.max(0, Math.min(100, percentY))
          }
        };

        // Disparar evento customizado
        targetBody.dispatchEvent(new CustomEvent('carousel-item-drop', { 
          detail: dropDetail,
          bubbles: true
        }));
        
        console.log(`[carousel ${panelId}] Item dropado com sucesso em x:${Math.round(dropDetail.position.x)}%, y:${Math.round(dropDetail.position.y)}%`);
      } else {
        console.log(`[carousel ${panelId}] Drop rejeitado - fora do character-body`);
      }

      // Cleanup do ghost
      if (ghost) {
        // Animar desaparecimento
        ghost.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        ghost.style.opacity = '0';
        ghost.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        setTimeout(() => {
          if (ghost.parentElement) {
            ghost.parentElement.removeChild(ghost);
          }
        }, 200);
      }
      
      activeDragsRef.current.delete(up.pointerId);
      console.log(`[carousel ${panelId}] Arrasto finalizado, restantes: ${activeDragsRef.current.size}`);
    };

    const onPointerCancel = (cancel) => {
      const drag = activeDragsRef.current.get(cancel.pointerId);
      if (!drag) return;

      const { ghost } = drag;
      console.log(`[carousel ${panelId}] Pointer cancelado: ${cancel.pointerId}`);

      if (ghost) {
        if (ghost.parentElement) {
          ghost.parentElement.removeChild(ghost);
        }
      }
      
      activeDragsRef.current.delete(cancel.pointerId);
    };

    // Adicionar listeners
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      
      // Limpar ghosts pendentes
      activeDragsRef.current.forEach(({ ghost }) => {
        if (ghost && ghost.parentElement) {
          ghost.parentElement.removeChild(ghost);
        }
      });
      activeDragsRef.current.clear();
    };
  }, [panelId]);

  const scrollToIndex = (index) => {
    if (carouselRef.current && items.length > 0) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / items.length;
      carouselRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
    setCurrentIndex(index);
  };

  const handleScroll = () => {
    if (carouselRef.current && items.length > 0) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.scrollWidth / items.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  const handleTouchStart = (e) => {
    // Para scroll tátil suave
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'auto';
    }
    e.stopPropagation(); // Evitar conflito com drag
  };

  const handleTouchEnd = () => {
    if (carouselRef.current) {
      carouselRef.current.style.scrollBehavior = 'smooth';
    }
  };

  const nextItem = () => {
    if (items.length > 0) {
      const nextIndex = (currentIndex + 1) % items.length;
      scrollToIndex(nextIndex);
    }
  };

  const prevItem = () => {
    if (items.length > 0) {
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      scrollToIndex(prevIndex);
    }
  };

  const handleItemClick = (e, item) => {
    // Para tipos que não são drag (cores, characters)
    if (type === 'colors' || type === 'characters') {
      console.log(`[carousel ${panelId}] Item clicado: ${item.name || item.color}`);
      onItemSelect(item);
    }
  };

  return (
    <div className="carousel" data-panel-id={panelId}>
      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button 
            className="carousel-arrow carousel-arrow-prev" 
            onClick={prevItem}
            onTouchStart={(e) => e.stopPropagation()}
          >
            ‹
          </button>
          <button 
            className="carousel-arrow carousel-arrow-next" 
            onClick={nextItem}
            onTouchStart={(e) => e.stopPropagation()}
          >
            ›
          </button>
        </>
      )}

      {/* Carousel Items */}
      <div 
        className="carousel-container"
        ref={carouselRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-x pinch-zoom' }}
      >
        {type === 'items' ? (
          // Items Carousel (para roupas, acessórios)
          <>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="carousel-item"
                onPointerDown={(e) => startTouchDrag(e, item, index)}
                onTouchStart={(e) => e.stopPropagation()}
                title={item.name}
                data-item-type={item.type}
              >
                <div className="item-preview">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span>{item.emoji || '👕'}</span>
                  )}
                </div>
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </>
        ) : type === 'colors' ? (
          // Colors Carousel
          <>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className={`carousel-item color-item ${selectedColor === item.color ? 'color-selected' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleItemClick(e, item);
                }}
                title={item.name}
              >
                <div 
                  className="item-preview color-preview"
                  style={{ backgroundColor: item.color }}
                />
                <span className="item-name">{item.name}</span>
              </div>
            ))}
          </>
        ) : type === 'characters' ? (
          // Characters Carousel
          <>
            {items.map((character, index) => (
              <div
                key={character.id || index}
                className="carousel-item management-item"
                onClick={(e) => handleItemClick(e, character)}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  handleItemClick(e, character);
                }}
                title={`${character.name} (${character.items?.length || 0} items)`}
              >
                <div className="item-preview character-preview">
                  {character.emoji || '👤'}
                  {character.items && character.items.length > 0 && (
                    <div className="character-badge">
                      {character.items.length}
                    </div>
                  )}
                </div>
                <span className="item-name">{character.name}</span>
              </div>
            ))}
            {/* Add New Button */}
            <div 
              className="carousel-item add-new-item"
              onClick={onAddNew}
              onTouchEnd={(e) => {
                e.stopPropagation();
                onAddNew();
              }}
            >
              <div className="item-preview">
                +
              </div>
              <span className="item-name">New Character</span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Carousel;
