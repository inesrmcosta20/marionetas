
import './CharacterBody.css';
import CharacterItem from './CharacterItem';
import { useEffect } from 'react'; // ← Adicione esta importação

function CharacterBody({ characterItems, onItemDrop, onItemSelect, selectedItem, onItemUpdate, panelId }) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const getPositionForItemType = (itemType) => {
    const positionMap = {
      'hat': { x: 50, y: 15 },
      'top': { x: 50, y: 40 },
      'pants': { x: 50, y: 65 },
      'shoes': { x: 50, y: 85 },
      'accessory': { x: 50, y: 30 }
    };
    
    return positionMap[itemType] || { x: 50, y: 50 };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemData = e.dataTransfer.getData('application/json');
    
    console.log(`📦 [${panelId || 'CharacterBody'}] Drop event, data:`, itemData);
    
    if (itemData) {
      try {
        const item = JSON.parse(itemData);
        console.log(`📦 [${panelId || 'CharacterBody'}] Parsed item:`, item);
        
        // Verifica se o item tem tipo
        if (!item.type) {
          console.error(`❌ [${panelId || 'CharacterBody'}] Item missing type property:`, item);
          return;
        }
        
        const position = getPositionForItemType(item.type);
        console.log(`📍 [${panelId || 'CharacterBody'}] Position calculated:`, position, 'for type:', item.type);
        
        onItemDrop({ ...item, position });
        
      } catch (error) {
        console.error(`❌ [${panelId || 'CharacterBody'}] Error parsing dropped item:`, error, 'Data:', itemData);
      }
    } else {
      console.log(`❌ [${panelId || 'CharacterBody'}] No item data found in drop event`);
    }
  };

  // NOVO: useEffect para lidar com eventos do Carousel
  useEffect(() => {
    const handleCarouselDrop = (e) => {
      console.log(`🎯 [${panelId}] Received carousel drop event:`, e.detail);
      
      // Certifique-se de que o item tenha um type
      if (!e.detail.type) {
        console.error(`❌ [${panelId}] Carousel drop item missing type:`, e.detail);
        return;
      }
      
      // Usar posição do evento ou calcular baseado no tipo
      const position = e.detail.position || getPositionForItemType(e.detail.type);
      
      const itemToDrop = {
        ...e.detail,
        position: position,
        id: e.detail.id || `${e.detail.type}_${Date.now()}`
      };
      
      console.log(`📍 [${panelId}] Final item to drop:`, itemToDrop);
      onItemDrop(itemToDrop);
    };

    // Adicionar listener para o evento customizado do Carousel
    const container = document.querySelector(`.character-body[data-panel-id="${panelId}"]`);
    if (container) {
      container.addEventListener('carousel-item-drop', handleCarouselDrop);
      console.log(`✅ [${panelId}] Added carousel drop listener`);
    }

    return () => {
      if (container) {
        container.removeEventListener('carousel-item-drop', handleCarouselDrop);
        console.log(`🧹 [${panelId}] Removed carousel drop listener`);
      }
    };
  }, [panelId, onItemDrop]); // ← Dependências

  const handleItemUpdate = (updatedItem) => {
    onItemUpdate(updatedItem);
  };

  return (
    <div 
      className="character-body"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      data-panel-id={panelId}
    >
      {/* Base skeleton */}
      <div className="character-base">
        <div className="head"></div>
        <div className="up">
          <div className="left-arm"></div>
          <div className="tronco"></div>
          <div className="right-arm"></div>
        </div>
        <div className="legs">
          <div className="left-leg"></div>
          <div className="right-leg"></div>
        </div>
      </div>
      
      {/* Placed items */}
      {characterItems.map((item) => (
        <CharacterItem
          key={`${panelId}-${item.id}`}
          item={item}
          isSelected={selectedItem?.id === item.id}
          onSelect={onItemSelect}
          onUpdate={handleItemUpdate}
          panelId={panelId}
        />
      ))}
      
      {characterItems.length === 0 && (
        <div className="drop-hint">
          <p>Drag items here to dress your character</p>
        </div>
      )}
    </div>
  );
}

export default CharacterBody;