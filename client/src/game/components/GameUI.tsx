import { useState, useEffect } from 'react';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { DialogueSystem } from './DialogueSystem';
import { dialogues } from '../data/dialogues';
import { CombatActionType } from '../systems/CombatSystem';

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
    endCombat,
    resetGame
  } = useGameState();
  const { currentZoneData } = useEchoZone();
  
  // UI states
  const [showZoneInfo, setShowZoneInfo] = useState(true);
  const [showAbilityTooltip, setShowAbilityTooltip] = useState<number | null>(null);
  const [activeCombatAction, setActiveCombatAction] = useState<CombatActionType | null>(null);
  const [combatTurn, setCombatTurn] = useState<number>(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [activeEntity, setActiveEntity] = useState<string>('player');
  
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
      
      if (gamePhase === 'combat') {
        setActiveCombatAction(CombatActionType.ABILITY);
      }
    }
  };
  
  // Combat action handlers
  const handleCombatAction = (action: CombatActionType) => {
    setActiveCombatAction(action);
    console.log(`Selected action: ${action}`);
    
    // In a complete implementation, we would integrate with the CombatSystem
    // to process the selected action
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
  
  // Action button renderer
  const renderActionButton = (action: CombatActionType, label: string, icon: string) => {
    const isActive = activeCombatAction === action;
    
    return (
      <button
        onClick={() => handleCombatAction(action)}
        className={`
          px-3 py-2 rounded flex items-center justify-center
          ${isActive ? 'bg-blue-700 text-white' : 'bg-gray-700 text-gray-200'}
          hover:bg-blue-600 transition-colors
        `}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </button>
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
      
      {/* Tactical Combat UI overlay */}
      {inCombat && gamePhase === 'combat' && (
        <>
          {/* Top combat info bar */}
          <div className="fixed top-0 left-0 right-0 bg-gray-900 bg-opacity-90 p-2 flex justify-between items-center border-b border-red-800">
            <div className="flex items-center">
              <div className="bg-red-900 text-white px-3 py-1 rounded-sm mr-3">
                Turn {combatTurn}
              </div>
              <div className={`px-3 py-1 rounded-sm ${isPlayerTurn ? 'bg-blue-800 text-white' : 'bg-gray-700 text-gray-300'}`}>
                {isPlayerTurn ? 'Player Turn' : 'Enemy Turn'}
              </div>
            </div>
            
            <div className="text-white">
              Active: <span className="text-yellow-400">{activeEntity}</span>
            </div>
            
            <div>
              <button 
                onClick={() => console.log('End turn')}
                className="bg-gray-700 text-white px-3 py-1 rounded-sm hover:bg-gray-600"
                disabled={!isPlayerTurn}
              >
                End Turn
              </button>
            </div>
          </div>
          
          {/* Left combat action panel */}
          {isPlayerTurn && (
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-90 p-4 rounded-lg border border-gray-700">
              <div className="text-white font-bold mb-3 text-center">Actions</div>
              
              <div className="flex flex-col gap-2">
                {renderActionButton(CombatActionType.MOVE, 'Move', '⟺')}
                {renderActionButton(CombatActionType.ATTACK, 'Attack', '⚔️')}
                {renderActionButton(CombatActionType.ABILITY, 'Ability', '✨')}
                {renderActionButton(CombatActionType.DEFEND, 'Defend', '🛡️')}
                {renderActionButton(CombatActionType.WAIT, 'Wait', '⏱️')}
              </div>
            </div>
          )}
          
          {/* Combat info panel */}
          <div className="fixed right-4 top-20 bg-gray-900 bg-opacity-90 p-4 rounded-lg border border-gray-700 max-w-xs">
            <h3 className="text-white font-bold mb-2">Enemies</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {currentEnemies.map(enemy => (
                <div key={enemy.id} className="bg-gray-800 p-2 rounded border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{enemy.name}</span>
                    <span className="text-red-400 text-sm">{enemy.health} HP</span>
                  </div>
                  
                  <div className="mt-1 text-xs text-gray-400">
                    <span className="text-yellow-500">Weak:</span> {enemy.weaknesses.join(', ')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 text-xs text-gray-400">
              Click an enemy on the grid to attack or use abilities on them.
            </div>
          </div>
          
          {/* Combat log message */}
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-75 p-2 rounded-lg border border-gray-700 max-w-lg text-center">
            <div className="text-yellow-400">
              {activeCombatAction === CombatActionType.MOVE && 'Select a grid cell to move to.'}
              {activeCombatAction === CombatActionType.ATTACK && 'Select an enemy to attack.'}
              {activeCombatAction === CombatActionType.ABILITY && 'Select a target for your ability.'}
              {activeCombatAction === CombatActionType.DEFEND && 'You take a defensive stance, reducing incoming damage.'}
              {activeCombatAction === CombatActionType.WAIT && 'You wait, conserving your energy.'}
              {!activeCombatAction && isPlayerTurn && 'Choose an action from the menu.'}
              {!isPlayerTurn && 'Enemy is taking their turn...'}
            </div>
          </div>
        </>
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
