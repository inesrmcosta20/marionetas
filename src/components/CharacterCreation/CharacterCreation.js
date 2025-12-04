
import { useState, useEffect } from 'react';
import './CharacterCreation.css';
import OneCharacterCreation from './OneCharacterCreation/OneCharacterCreation';

function CharacterCreation({ onBack, onComplete }) {
  const [characters, setCharacters] = useState([]);
  const [currentCharacterLeft, setCurrentCharacterLeft] = useState(null);
  const [currentCharacterRight, setCurrentCharacterRight] = useState(null);

  // Personagens iniciais (2 personagens vazias - ainda não guardadas)
  const initialCharacters = [
    {
      id: 1,
      name: 'Character 1',
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString(),
      isSaved: false
    },
    {
      id: 2,
      name: 'Character 2', 
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString(),
      isSaved: false
    }
  ];

  // Carrega personagens iniciais quando o app inicia
  useEffect(() => {
    setCharacters(initialCharacters);
    setCurrentCharacterLeft(initialCharacters[0]);
    setCurrentCharacterRight(initialCharacters[1]);
  }, [] );

  const handleSaveCharacter = (character) => {
  console.log('💾 Parent: Saving character:', character.name);
  console.log('   Items received:', character.items);
  console.log('   Items count:', character.items?.length || 0);
  
  // Garantir que temos um array válido
  const items = Array.isArray(character.items) ? character.items : [];
  
  const characterToSave = {
    ...character,
    items: items,
    isSaved: items.length > 0,
    updatedAt: new Date().toISOString()
  };
  
  console.log('   Final items count to save:', characterToSave.items.length);
  
  setCharacters(prevCharacters => {
    const existingIndex = prevCharacters.findIndex(c => c.id === character.id);
    
    if (existingIndex >= 0) {
      const updatedCharacters = [...prevCharacters];
      updatedCharacters[existingIndex] = characterToSave;
      console.log('   Updated existing character');
      return updatedCharacters;
    } else {
      console.log('   Added new character');
      return [...prevCharacters, characterToSave];
    }
  });
};
    
  

  // Filtra apenas personagens que foram guardados (têm itens)
  const getSavedCharacters = () => {
    return characters.filter(character => character.isSaved);
  };

  // Cria um novo personagem vazio
  const handleAddNewCharacter = (currentPanelCharacter) => {
    // Só cria novo se o personagem atual já tiver itens (foi modificado)
    if (!currentPanelCharacter || currentPanelCharacter.items.length === 0) {
      console.log('⚠️ Cannot create new character - current character has no items');
      return null;
    }
    
    const newCharacterId = Date.now();
    const newCharacter = {
      id: newCharacterId,
      name: `Character ${characters.length + 1}`,
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString(),
      isSaved: false
    };
    
    setCharacters(prev => [...prev, newCharacter]);
    return newCharacter;
  };

  const handleSwitchCharacter = (character, panelSide) => {
    console.log('👤 Switching to character:', character.name, 'on panel:', panelSide);
    
    // Verifica se o personagem já está sendo editado no outro painel
    const isInLeftPanel = currentCharacterLeft && currentCharacterLeft.id === character.id;
    const isInRightPanel = currentCharacterRight && currentCharacterRight.id === character.id;
    
    if (panelSide === 'left' && isInRightPanel) {
      console.log('⚠️ Character is already being edited in right panel');
      return false; // Não permite trocar
    }
    
    if (panelSide === 'right' && isInLeftPanel) {
      console.log('⚠️ Character is already being edited in left panel');
      return false; // Não permite trocar
    }
    
    // Atualiza o personagem no painel correspondente
    if (panelSide === 'left') {
      setCurrentCharacterLeft(character);
    } else {
      setCurrentCharacterRight(character);
    }
    
    return true;
  };

  return (
    <div className="characters-creation">
      <div className="character-left">
        <OneCharacterCreation
          character={currentCharacterLeft}
          onBack={onBack}
          onDone={onComplete}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={getSavedCharacters()}
          onAddNewCharacter={() => handleAddNewCharacter(currentCharacterLeft)}
          onSwitchCharacter={(char) => handleSwitchCharacter(char, 'left')}
          isActivePanel={true}
          panelSide="left"
          panelId="left-panel" // ← NOVO: Identificador único
        />
      </div>
      <div className="character-right">
        <OneCharacterCreation
          character={currentCharacterRight}
          onBack={onBack}
          onDone={onComplete}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={getSavedCharacters()}
          onAddNewCharacter={() => handleAddNewCharacter(currentCharacterRight)}
          onSwitchCharacter={(char) => handleSwitchCharacter(char, 'right')}
          isActivePanel={true}
          panelSide="right"
          panelId="right-panel" // ← NOVO: Identificador único
        />
      </div>
    </div>
  );
}

export default CharacterCreation;
