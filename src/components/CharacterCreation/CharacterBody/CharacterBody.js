import './CharacterBody.css';
import CharacterItem from './CharacterItem';

function CharacterBody({ characterItems, onItemDrop, onItemSelect, selectedItem, onItemUpdate }) {
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
    
    if (itemData) {
      try {
        const item = JSON.parse(itemData);
        const position = getPositionForItemType(item.type);
        
        console.log('📦 Item dropped:', item);
        onItemDrop({ ...item, position });
        
      } catch (error) {
        console.error('❌ Error parsing dropped item:', error);
      }
    }
  };

  const handleItemUpdate = (updatedItem) => {
    onItemUpdate(updatedItem);
  };

  return (
    <div 
      className="character-body"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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
          key={item.id}
          item={item}
          isSelected={selectedItem?.id === item.id}
          onSelect={onItemSelect}
          onUpdate={handleItemUpdate}
        />
      ))}
    </div>
  );
}

export default CharacterBody;