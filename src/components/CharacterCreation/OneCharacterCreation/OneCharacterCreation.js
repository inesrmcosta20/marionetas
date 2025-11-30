import { useState, useEffect } from 'react';
import './OneCharacterCreation.css';
import ReturnButton from '../../common/ReturnButton/ReturnButton';
import TrashButton from '../../common/TrashButton/TrashButton';
import DoneButton from '../../common/DoneButton/DoneButton';
import SideTab from '../../common/SideTab/SideTab';
import Carousel from '../../common/Carousel/Carousel';
import CharacterBody from '../CharacterBody/CharacterBody';
import { characterToolbarItems, characterTabConfig } from '../../../data/toolbarItems';

function OneCharacterCreation({ 
  character: initialCharacter, 
  onBack, 
  onDone,
  onSaveCharacter,
  existingCharacters = []
}) {
  const [characterItems, setCharacterItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openTab, setOpenTab] = useState(null);
  const [createdCharacters, setCreatedCharacters] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  // Carrega o personagem inicial quando o componente monta ou quando initialCharacter muda
  useEffect(() => {
    if (initialCharacter) {
      console.log('📥 Loading initial character:', initialCharacter);
      setCharacterItems(initialCharacter.items || []);
    }
  }, [initialCharacter]);

  // Carrega os personagens existentes
  useEffect(() => {
    setCreatedCharacters(existingCharacters);
  }, [existingCharacters]);

  const handleItemDrop = (item) => {
    if (item.id && characterItems.some(i => i.id === item.id)) {
      const updatedItems = characterItems.map(i => 
        i.id === item.id ? { ...i, position: item.position } : i
      );
      setCharacterItems(updatedItems);
    } else {
      const newItem = {
        ...item,
        id: Date.now() + Math.random(),
        position: item.position || item.defaultPosition || { x: 50, y: 50 },
      };
      
      if (item.type !== 'color') {
        const filteredItems = characterItems.filter(i => i.type !== newItem.type);
        setCharacterItems([...filteredItems, newItem]);
      }
    }
  };

  const handleColorSelect = (colorItem) => {
    if (selectedColor === colorItem.color) {
      console.log('🎨 Color deselected');
      setSelectedColor(null);
      
      if (selectedItem) {
        const updatedItems = characterItems.map(item =>
          item.id === selectedItem.id ? { ...item, color: null } : item
        );
        setCharacterItems(updatedItems);
        setSelectedItem(prev => prev ? { ...prev, color: null } : null);
      }
    } else {
      console.log('🎨 Color selected:', colorItem.color);
      setSelectedColor(colorItem.color);
      
      if (selectedItem) {
        console.log('🔄 Applying color to selected item:', selectedItem.name);
        
        const updatedItems = characterItems.map(item =>
          item.id === selectedItem.id ? { ...item, color: colorItem.color } : item
        );
        
        setCharacterItems(updatedItems);
        setSelectedItem(prev => prev ? { ...prev, color: colorItem.color } : null);
      }
    }
  };

  const handleItemUpdate = (updatedItem) => {
    const updatedItems = characterItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setCharacterItems(updatedItems);
    
    if (selectedItem && selectedItem.id === updatedItem.id) {
      setSelectedItem(updatedItem);
    }
  };

  const handleTrashDrop = (itemData) => {
    try {
      const item = JSON.parse(itemData);
      setCharacterItems(characterItems.filter(i => i.id !== item.id));
      setSelectedItem(null);
    } catch (error) {
      console.error('❌ Error parsing item for trash:', error);
    }
  };

  const handleItemSelect = (item) => {
    console.log('📌 Item selected:', item.name, 'Current color:', item.color);
    setSelectedItem(item);
    
    if (item.color) {
      setSelectedColor(item.color);
    } else {
      setSelectedColor(null);
    }
  };

  const toggleTab = (tabName) => {
    setOpenTab(openTab === tabName ? null : tabName);
  };

  const handleAddCharacter = () => {
    const newCharacterId = Date.now(); // ID único baseado no timestamp
    const newCharacter = {
      id: newCharacterId,
      name: `Character ${createdCharacters.length + 1}`,
      emoji: '👤',
      items: [], // Personagem vazio
      createdAt: new Date().toISOString()
    };
    
    // Chama a função para salvar o novo personagem
    if (onSaveCharacter) {
      onSaveCharacter(newCharacter);
    }
    
    console.log('👥 New character created:', newCharacter);
  };

  const handleCharacterSelect = (character) => {
    console.log('👤 Character selected for editing:', character);
    
    // Carrega o personagem selecionado para edição
    setCharacterItems(character.items || []);
    setSelectedItem(null);
    setSelectedColor(null);
    
    // Se houver uma callback para notificar a App, chama-a
    if (onSaveCharacter) {
      onSaveCharacter(character); // Atualiza o personagem atual
    }
  };

  const handleDoneClick = () => {
    if (characterItems.length === 0) {
      alert('Please add at least one item to your character before completing.');
      return;
    }
    
    // Cria o objeto do personagem completo
    const currentCharacter = {
      id: initialCharacter?.id || Date.now(),
      name: initialCharacter?.name || `Character ${createdCharacters.length + 1}`,
      emoji: '👤',
      items: characterItems,
      updatedAt: new Date().toISOString()
    };
    
    console.log('✅ Character completed:', currentCharacter);
    
    // Salva o personagem atual
    if (onSaveCharacter) {
      onSaveCharacter(currentCharacter);
    }
    
    // Chama a callback de done
    onDone(currentCharacter);
  };

  return (
    <div className="character-creation-page">
      {/* Left Side - Grid interna */}
      <div className="left-side-tabs">
        <ReturnButton onClick={onBack} />
        
        <div className="tabs-container">
          {/* Clothing/Accessory Tabs */}
          {Object.entries(characterTabConfig).map(([tabKey, config]) => (
            <SideTab
              key={tabKey}
              icon={config.icon}
              title={config.title}
              isOpen={openTab === tabKey}
              onToggle={() => toggleTab(tabKey)}
              itemCount={characterToolbarItems[tabKey]?.length || 0}
              position="left"
            >
              {tabKey === 'colors' ? (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleColorSelect}
                  type="colors"
                  selectedColor={selectedColor}
                />
              ) : (
                <Carousel
                  items={characterToolbarItems[tabKey] || []}
                  onItemSelect={handleItemDrop}
                  type="items"
                />
              )}
            </SideTab>
          ))}
        </div>

        <TrashButton onDrop={handleTrashDrop} />
      </div>

      {/* Center - Character Area */}
      <div className="character-body-area">
        <CharacterBody
          characterItems={characterItems}
          onItemDrop={handleItemDrop}
          onItemSelect={handleItemSelect}
          onItemUpdate={handleItemUpdate}
          selectedItem={selectedItem}
        />
      </div>

      {/* Right Side - Grid interna */}
      <div className="right-side-tabs">
        <SideTab
          icon="👥"
          title="Characters"
          isOpen={openTab === 'characters'}
          onToggle={() => toggleTab('characters')}
          itemCount={createdCharacters.length}
          position="right"
        >
          <Carousel
            items={createdCharacters}
            onItemSelect={handleCharacterSelect}
            onAddNew={handleAddCharacter}
            type="characters"
          />
        </SideTab>

        <DoneButton 
          onClick={handleDoneClick}
          disabled={characterItems.length === 0}
        />
      </div>
    </div>
  );
}

export default OneCharacterCreation;