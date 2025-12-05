import React, { useState, useEffect } from 'react';
import './ScenarioSelection.css';
import Button from '../common/Button/Button';
import images from '../../data/images';
import DoneButton from '../common/DoneButton/DoneButton';


function ScenarioSelection({ onBack , onComplete, initialScenario }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarioImages = [images.hat1, images.hat2, images.hat3, images.hat1];

  const handleScenarioClick = (scenario) => {
    console.log('clicked: ', scenario);
    setSelectedScenario(scenario);
  };

  const handleDoneClick = () => {
    if (selectedScenario !== null){
      if (onComplete)
        onComplete(selectedScenario);
    }else{
      console.log('nothing selected');
    }
  }

  useEffect(() => {
    const scenario = initialScenario ? initialScenario : null;
    setSelectedScenario(scenario);

  },[initialScenario]);

  return (
    <div className="scenario-selection">
      <h2>Seleção de Cenário</h2>
      <p>Escolhe um dos 4.</p>
      <div className="scenario-grid">
        {scenarioImages.map((src, idx) => (
          <img
            key={idx}
            className={selectedScenario === idx + 1 ? 'scenario-selected' : 'scenario'}
            onClick={() => handleScenarioClick(idx + 1)}
            src={src}
            alt={`Cenário ${idx + 1}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleScenarioClick(idx + 1);
              }
            }}
          />
        ))}
      </div>


      <Button onClick={onBack}>Voltar</Button>
      <DoneButton onClick={handleDoneClick} />
    </div>
  );
}

export default ScenarioSelection;