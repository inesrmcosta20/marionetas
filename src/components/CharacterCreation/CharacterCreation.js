import { useState } from 'react';
import './CharacterCreation.css';
import OneCharacterCreation from './OneCharacterCreation/OneCharacterCreation';

function CharacterCreation({ onBack, onComplete }) {
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);

  // Personagens iniciais (2 personagens vazias)
  const initialCharacters = [
    {
      id: 1,
      name: 'Character 1',
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Character 2', 
      emoji: '👤',
      items: [],
      createdAt: new Date().toISOString()
    }
  ];

  // Carrega personagens iniciais quando o app inicia
  useState(() => {
    setCharacters(initialCharacters);
    // Define o primeiro personagem como atual
    setCurrentCharacter(initialCharacters[0]);
  }, []);

  const handleSaveCharacter = (character) => {
    console.log('💾 Saving character:', character);
    
    setCharacters(prevCharacters => {
      // Verifica se o personagem já existe
      const existingIndex = prevCharacters.findIndex(c => c.id === character.id);
      
      if (existingIndex >= 0) {
        // Atualiza personagem existente
        const updatedCharacters = [...prevCharacters];
        updatedCharacters[existingIndex] = character;
        return updatedCharacters;
      } else {
        // Adiciona novo personagem
        return [...prevCharacters, character];
      }
    });
    
    // Atualiza o personagem atual
    setCurrentCharacter(character);
  };

  

   const handleSelectCharacter = (character) => {
    console.log('👤 Switching to character:', character.name);
    setCurrentCharacter(character);
  };

  return (
    <div className="characters-creation">
      <div className="character-left">
         <OneCharacterCreation
          character={currentCharacter}
          onBack={onBack}
          onDone={onComplete}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={characters}
        />
      </div>
      <div className="character-right">
        <OneCharacterCreation
          character={currentCharacter}
          onBack={onBack}
          onDone={onComplete}
          onSaveCharacter={handleSaveCharacter}
          existingCharacters={characters}
        />
      </div>
    </div>
  );
}

export default CharacterCreation;