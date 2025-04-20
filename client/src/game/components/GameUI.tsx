import { useState, useEffect } from 'react';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { DialogueSystem } from './DialogueSystem';
import { dialogues } from '../data/dialogues';

export function GameUI() {
  const { selectedClass, stats, abilities, activeAbilityIndex, useAbility } = useCharacter();
  const { 
    gamePhase, 
    health, 
    maxHealth, 
    energy, 
    maxEnergy, 
    echoesCaptured,
    inCombat,
    currentEnemies,
    endCombat
  } = useGameState();
  const { currentZoneData } = useEchoZone();
  
  // UI states
  const [showZoneInfo, setShowZoneInfo] = useState(true);
  const [showAbilityTooltip, setShowAbilityTooltip] = useState<number | null>(null);
  
  // Show zone info briefly when entering a zone
  useEffect(() => {
    if (currentZoneData) {
      setShowZoneInfo(true);
      const timer = setTimeout(() => {
        setShowZoneInfo(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentZoneData]);
  
  // Handle ability use
  const handleAbilityClick = (abilityIndex: number) => {
    if (gamePhase === 'gameplay' || gamePhase === 'combat') {
      useAbility(abilityIndex);
    }
  };
  
  // Combat victory handler
  const handleDefeatEnemy = () => {
    // In a real game, we'd handle enemy attacks, damage calculation, etc.
    // For simplicity, we'll just end combat immediately
    
    endCombat();
    console.log('Combat ended - player victorious!');
  };
  
  // Render health/energy bars
  const renderStatusBar = (current: number, max: number, color: string) => {
    const percentage = Math.max(0, Math.min(100, (current / max) * 100));
    
    return (
      <div className="relative w-full h-6 bg-gray-900 border-2 border-gray-700">
        <div 
          className="absolute top-0 left-0 h-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`, 
            background: color,
            boxShadow: `0 0 8px ${color}`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
          {current} / {max}
        </div>
      </div>
    );
  };
  
  return (
    <>
      {/* Zone information overlay */}
      {showZoneInfo && currentZoneData && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-80 text-white p-6 text-center rounded-lg border border-blue-500 transition-opacity duration-500">
          <h2 className="text-2xl font-bold mb-2 text-blue-300">{currentZoneData.name}</h2>
          <p className="text-gray-300">{currentZoneData.description}</p>
        </div>
      )}
      
      {/* Player HUD */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 bg-opacity-80 p-4 flex flex-col md:flex-row justify-between items-center">
        {/* Character info */}
        <div className="flex items-center mb-4 md:mb-0">
          {/* Character icon - simple colored box for 8-bit style */}
          <div 
            className="w-12 h-12 mr-3"
            style={{ 
              background: selectedClass === 'CovenantWeaver' ? '#3498db' : 
                         selectedClass === 'PhilosopherKing' ? '#e74c3c' :
                         selectedClass === 'ChakravartiAvatar' ? '#f39c12' :
                         selectedClass === 'SerpentsWhisper' ? '#2ecc71' :
                         '#9b59b6', // Jade Dragon
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
            }}
          />
          
          <div className="mr-4">
            <div className="text-white font-bold">{selectedClass}</div>
            <div className="text-gray-400 text-xs">
              Echoes: {echoesCaptured} | Zone: {currentZoneData?.name.split(' ')[1] || '???'}
            </div>
          </div>
          
          {/* Status bars */}
          <div className="flex-1 flex flex-col gap-2 w-48">
            {/* Health bar */}
            {renderStatusBar(health, maxHealth, '#ff3d3d')}
            
            {/* Energy bar */}
            {renderStatusBar(energy, maxEnergy, '#3d9eff')}
          </div>
        </div>
        
        {/* Abilities */}
        <div className="flex gap-3">
          {abilities.slice(0, 3).map((ability, index) => (
            <div 
              key={ability.id}
              className="relative"
              onMouseEnter={() => setShowAbilityTooltip(index)}
              onMouseLeave={() => setShowAbilityTooltip(null)}
            >
              <button
                onClick={() => handleAbilityClick(index)}
                className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                  ${activeAbilityIndex === index ? 'border-yellow-500 bg-yellow-900 bg-opacity-50' : 'border-gray-600 bg-gray-800'}
                  hover:border-gray-300 transition-colors
                `}
                style={{
                  boxShadow: activeAbilityIndex === index ? '0 0 10px rgba(255, 255, 0, 0.5)' : 'none'
                }}
              >
                {index + 1}
              </button>
              
              {/* Keybinding indicator */}
              <div className="absolute -bottom-1 -right-1 bg-gray-700 text-white text-xs w-5 h-5 flex items-center justify-center">
                {['Q', 'R', 'F'][index]}
              </div>
              
              {/* Tooltip */}
              {showAbilityTooltip === index && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 w-48 bg-gray-900 p-2 text-white text-sm border border-gray-700 z-10">
                  <div className="font-bold text-blue-300">{ability.name}</div>
                  <div className="text-xs mt-1">{ability.description}</div>
                  <div className="text-xs mt-1 text-blue-200">Cost: {ability.energyCost} energy</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Combat UI overlay */}
      {inCombat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg border-2 border-red-500 max-w-md w-full">
            <h2 className="text-xl text-red-400 font-bold mb-4">Combat Encounter!</h2>
            
            <div className="mb-4">
              {currentEnemies.map(enemy => (
                <div key={enemy.id} className="flex justify-between items-center mb-2 p-2 bg-gray-800">
                  <div>
                    <div className="text-white font-bold">{enemy.name}</div>
                    <div className="text-sm text-gray-400">{enemy.health} HP</div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Weak: {enemy.weaknesses.join(', ')}
                  </div>
                </div>
              ))}
            </div>
            
            <p className="text-gray-300 mb-4">
              Use your abilities to defeat the corrupted Echoes.
            </p>
            
            <div className="flex justify-center">
              <button 
                onClick={handleDefeatEnemy}
                className="bg-red-900 text-white px-4 py-2 hover:bg-red-800"
              >
                Attack
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Dialog system - active only during dialogue phase */}
      {gamePhase === 'dialogue' && (
        <DialogueSystem dialogueSequence={dialogues['intro']} />
      )}
      
      {/* Game over screen */}
      {gamePhase === 'gameOver' && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 border-2 border-red-600 text-center max-w-md">
            <h2 className="text-3xl text-red-500 font-bold mb-4">Reality Fractures</h2>
            <p className="text-white mb-6">
              The Echoes have overwhelmed you. The cosmic order remains shattered.
            </p>
            <button 
              onClick={() => resetGame()}
              className="bg-gray-800 text-white border border-gray-600 px-6 py-3 hover:bg-gray-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
}
