// Homepage.js - Componente principal da página inicial
import { useState } from 'react';
import './Homepage.css';
import CharacterCreation from '../CharacterCreation/CharacterCreation';
import ScenarioSelection from '../ScenarioSelection/ScenarioSelection';
import Button from '../common/Button/Button';
import Theater from '../Theater/theater';

/**
 * Componente principal da homepage.
 * Controla a navegação entre as views principais: criação de personagem, seleção de cenário e teatro.
 */
function Homepage() {
  // Estado para controlar a view atual
  const [currentView, setCurrentView] = useState('homepage');
  // Estado para personagens criados
  const [createdCharacters, setCreatedCharacters] = useState([]);
  // Estado para personagens em edição
  const [editingCharacters, setEditingCharacters] = useState([]);
  const [chosenScenario, setChosenScenario] = useState([]);

  // Inicia novo teatro, indo para criação de personagem
  const handleNewTheater = () => {
    setEditingCharacters([]);
    setCurrentView('character-creation');
  };

  // Quando termina a criação de personagens
  const handleCharactersComplete = (characters) => {
    setCreatedCharacters(characters);
    setEditingCharacters(characters);
    setCurrentView('scenario-selection');
  };

  // Volta à homepage
  const handleBackToHome = () => {
    setCurrentView('homepage');
  };

  // Quando termina a seleção de cenário
  const handleScenarioComplete = (scenario) => {
    setChosenScenario(scenario)
    setCurrentView('theater');
  };

  // Renderiza a view de criação de personagem
  if (currentView === 'character-creation') {
    return (
      <CharacterCreation 
        onBack={handleBackToHome}
        onComplete={handleCharactersComplete}
        initialCharacters={editingCharacters.length > 0 ? editingCharacters : undefined}
      />
    );
  }

  // Renderiza a view de seleção de cenário
  if (currentView === 'scenario-selection') {
    return (
      <ScenarioSelection 
        onBack={() => setCurrentView('character-creation')}
        onComplete={handleScenarioComplete}
        initialScenario={chosenScenario ? chosenScenario : undefined}
      />
    );
  }

  // Renderiza a view do teatro
  if (currentView === 'theater') {
    console.log('vou dar: ', chosenScenario);
    return (
      <Theater 
        characters={createdCharacters} 
        scenario = {chosenScenario}
        onBack={() => setCurrentView('scenario-selection')} 
      />
    );
  }

  // Renderiza a homepage inicial
  return (
    <div className="homepage">
      <h1>Início</h1>
      <div className="homepage-buttons">
        <Button onClick={handleNewTheater} className="new-theater">
          Novo Teatro
        </Button>
        <Button className="stored">
          Guardados
        </Button>
      </div>
    </div>
  );
}

// Exporta o componente Homepage
export default Homepage;