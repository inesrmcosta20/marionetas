import { useState, useRef } from 'react';
import './Carousel.css';

function Carousel({ items = [], onItemSelect, type = 'items', onAddNew, selectedColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
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
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.scrollWidth / items.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  const nextItem = () => {
    const nextIndex = (currentIndex + 1) % items.length;
    scrollToIndex(nextIndex);
  };

  const prevItem = () => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    scrollToIndex(prevIndex);
  };

  return (
    <div className="carousel">
      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button className="carousel-arrow carousel-arrow-prev" onClick={prevItem}>
            ‹
          </button>
          <button className="carousel-arrow carousel-arrow-next" onClick={nextItem}>
            ›
          </button>
        </>
      )}

      {/* Carousel Items */}
      <div 
        className="carousel-container"
        ref={carouselRef}
        onScroll={handleScroll}
      >
        {type === 'items' ? (
          // Items Carousel (for clothing, objects, etc.)
          <>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="carousel-item"
                draggable
                onDragStart={(e) => {
                  const itemData = JSON.stringify({
                    ...item,
                    id: item.id || Date.now() + index
                  });
                  e.dataTransfer.setData('application/json', itemData);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                title={item.name}
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
                onClick={() => onItemSelect(item)}
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
              onClick={() => onItemSelect(character)}
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