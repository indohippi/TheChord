import { useState, useEffect } from 'react';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { useInventory } from '@/lib/stores/useInventory';
import { useQuest } from '@/lib/stores/useQuest';
import { useSkills } from '@/lib/stores/useSkills';
import { useSaveSystem } from '@/lib/stores/useSaveSystem';
import { useWorld } from '@/lib/stores/useWorld';
import { DialogueSystem } from './DialogueSystem';
import { InventoryUI } from './InventoryUI';
import { QuestUI } from './QuestUI';
import { SkillTreeUI } from './SkillTreeUI';
import { SaveLoadUI } from './SaveLoadUI';
import { WorldMapUI } from './WorldMapUI';
import { useDialogue } from '@/lib/stores/useDialogue';
import { DialogueUI } from './DialogueUI';
import { useAudio } from '@/lib/stores/useAudio';
import { useParticles } from '@/lib/stores/useParticles';
import { useAnimations } from '@/lib/stores/useAnimations';
import { useVisualEffects } from '@/lib/stores/useVisualEffects';
import { AudioVisualUI } from './AudioVisualUI';
import { useUI } from '@/lib/stores/useUI';
import { EnhancedGameUI } from './EnhancedGameUI';
import { useMultiplayer } from '@/lib/stores/useMultiplayer';
import { MultiplayerUI } from './MultiplayerUI';
import { dialogues } from '../data/dialogues';
import { CombatActionType } from '../systems/CombatSystem';

interface GameUIProps {
  activeCombatAction?: CombatActionType | null;
  setActiveCombatAction?: (action: CombatActionType | null) => void;
}

export function GameUI({ activeCombatAction, setActiveCombatAction }: GameUIProps) {
  const { 
    selectedClass, 
    stats, 
    abilities, 
    activeAbilityIndex, 
    useAbility,
    level,
    experience,
    experienceToNext,
    skillPoints,
    addExperience
  } = useCharacter();
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
  const { gold, echoes } = useInventory();
  const { questLog, getActiveQuests } = useQuest();
  const { availableSkillPoints, getLearnedSkills } = useSkills();
  const { performAutoSave } = useSaveSystem();
  const { getWorldStats } = useWorld();
  const { isDialogueActive, startDialogue, addSequence } = useDialogue();
  const { initializeAudio } = useAudio();
  const { updateParticles } = useParticles();
  const { updateAnimations } = useAnimations();
  const { updateEffects } = useVisualEffects();
  const { addNotification, showTooltip, showModal } = useUI();
  const { isConnected, players } = useMultiplayer();
  
  // UI states
  const [showZoneInfo, setShowZoneInfo] = useState(true);
  const [showAbilityTooltip, setShowAbilityTooltip] = useState<number | null>(null);
  const [localActiveCombatAction, setLocalActiveCombatAction] = useState<CombatActionType | null>(null);
  const [combatTurn, setCombatTurn] = useState<number>(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [activeEntity, setActiveEntity] = useState<string>('player');
  const [showInventory, setShowInventory] = useState(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState(false);
  const [showQuestLog, setShowQuestLog] = useState(false);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [showSaveLoad, setShowSaveLoad] = useState(false);
  const [saveLoadMode, setSaveLoadMode] = useState<'save' | 'load'>('save');
  const [showWorldMap, setShowWorldMap] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showAudioVisual, setShowAudioVisual] = useState(false);
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  
  // Use props if provided, otherwise use local state
  const currentActiveCombatAction = activeCombatAction !== undefined ? activeCombatAction : localActiveCombatAction;
  const updateActiveCombatAction = setActiveCombatAction || setLocalActiveCombatAction;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'KeyI' && !showInventory) {
        setShowInventory(true);
      } else if (event.code === 'KeyC' && !showCharacterSheet) {
        setShowCharacterSheet(true);
      } else if (event.code === 'KeyQ' && !showQuestLog) {
        setShowQuestLog(true);
      } else if (event.code === 'KeyT' && !showSkillTree) {
        setShowSkillTree(true);
      } else if (event.code === 'KeyS' && event.ctrlKey) {
        event.preventDefault();
        setSaveLoadMode('save');
        setShowSaveLoad(true);
        } else if (event.code === 'KeyL' && event.ctrlKey) {
          event.preventDefault();
          setSaveLoadMode('load');
          setShowSaveLoad(true);
        } else if (event.code === 'KeyM' && !showWorldMap) {
          setShowWorldMap(true);
        } else if (event.code === 'KeyD' && !showDialogue) {
          setShowDialogue(true);
        } else if (event.code === 'KeyV' && !showAudioVisual) {
          setShowAudioVisual(true);
        } else if (event.code === 'KeyP' && !showMultiplayer) {
          setShowMultiplayer(true);
        } else if (event.code === 'Escape') {
          setShowInventory(false);
          setShowCharacterSheet(false);
          setShowQuestLog(false);
          setShowSkillTree(false);
          setShowSaveLoad(false);
          setShowWorldMap(false);
          setShowDialogue(false);
          setShowAudioVisual(false);
          setShowMultiplayer(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInventory, showCharacterSheet, showQuestLog, showSkillTree, showSaveLoad, showWorldMap, showDialogue, showAudioVisual, showMultiplayer]);
  
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

  // Initialize dialogue sequences
  useEffect(() => {
    dialogues.forEach(dialogue => {
      addSequence(dialogue);
    });
  }, [addSequence]);

  // Initialize audio system
  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  // Update audio/visual systems
  useEffect(() => {
    const interval = setInterval(() => {
      const deltaTime = 1/60; // 60 FPS
      updateParticles(deltaTime);
      updateAnimations(deltaTime);
      updateEffects(deltaTime);
    }, 1000/60);

    return () => clearInterval(interval);
  }, [updateParticles, updateAnimations, updateEffects]);
  
  // Handle ability use
  const handleAbilityClick = (abilityIndex: number) => {
    if (gamePhase === 'gameplay' || gamePhase === 'combat') {
      useAbility(abilityIndex);
      
      if (gamePhase === 'combat') {
        updateActiveCombatAction(CombatActionType.ABILITY);
      }
    }
  };
  
  // Combat action handlers
  const handleCombatAction = (action: CombatActionType) => {
    updateActiveCombatAction(action);
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
  
  // End turn handler
  const handleEndTurn = () => {
    console.log('Ending player turn');
    setIsPlayerTurn(false);
    
    // Simulate enemy turn after a delay
    setTimeout(() => {
      setIsPlayerTurn(true);
      setCombatTurn(prev => prev + 1);
    }, 2000);
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
    const isActive = currentActiveCombatAction === action;
    
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
    <EnhancedGameUI>
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
              Level {level} | Echoes: {echoesCaptured} | Zone: {currentZoneData?.name.split(' ')[1] || '???'}
            </div>
            <div className="text-gray-500 text-xs">
              XP: {experience}/{experienceToNext} | SP: {skillPoints}
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
                onClick={handleEndTurn}
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
              {currentActiveCombatAction === CombatActionType.MOVE && 'Select a grid cell to move to.'}
              {currentActiveCombatAction === CombatActionType.ATTACK && 'Select an enemy to attack.'}
              {currentActiveCombatAction === CombatActionType.ABILITY && 'Select a target for your ability.'}
              {currentActiveCombatAction === CombatActionType.DEFEND && 'You take a defensive stance, reducing incoming damage.'}
              {currentActiveCombatAction === CombatActionType.WAIT && 'You wait, conserving your energy.'}
              {!currentActiveCombatAction && isPlayerTurn && 'Choose an action from the menu.'}
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

      {/* Inventory UI */}
      <InventoryUI 
        isOpen={showInventory} 
        onClose={() => setShowInventory(false)} 
      />

      {/* Quest UI */}
      <QuestUI 
        isOpen={showQuestLog} 
        onClose={() => setShowQuestLog(false)} 
      />

      {/* Skill Tree UI */}
      <SkillTreeUI 
        isOpen={showSkillTree} 
        onClose={() => setShowSkillTree(false)} 
      />

      {/* Save/Load UI */}
      <SaveLoadUI
        isOpen={showSaveLoad}
        onClose={() => setShowSaveLoad(false)}
        mode={saveLoadMode}
      />
      <WorldMapUI
        isOpen={showWorldMap}
        onClose={() => setShowWorldMap(false)}
      />
      <DialogueUI
        isOpen={showDialogue || isDialogueActive}
        onClose={() => setShowDialogue(false)}
      />
      <AudioVisualUI
        isOpen={showAudioVisual}
        onClose={() => setShowAudioVisual(false)}
      />
      <MultiplayerUI
        isOpen={showMultiplayer}
        onClose={() => setShowMultiplayer(false)}
      />

      {/* Character Sheet UI */}
      {showCharacterSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-4xl h-5/6 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-300">Character Sheet</h2>
              <button
                onClick={() => setShowCharacterSheet(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
              {/* Character Info */}
              <div className="space-y-4">
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Character Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Class:</span>
                      <span className="font-bold">{selectedClass}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-bold">{level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Experience:</span>
                      <span className="font-bold">{experience}/{experienceToNext}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Skill Points:</span>
                      <span className="font-bold text-yellow-400">{skillPoints}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Stats</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(stats).map(([stat, value]) => (
                      <div key={stat} className="flex justify-between">
                        <span className="capitalize">{stat}:</span>
                        <span className="font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Currency */}
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Currency</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Gold:</span>
                      <span className="font-bold text-yellow-400">{gold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Echoes:</span>
                      <span className="font-bold text-purple-400">{echoes}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div className="space-y-4">
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Abilities</h3>
                  <div className="space-y-2">
                    {abilities.map((ability, index) => (
                      <div key={ability.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-blue-300">{ability.name}</span>
                          <span className="text-xs text-gray-400">Cost: {ability.energyCost}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-1">{ability.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Bar */}
                <div className="border border-gray-600 rounded p-4">
                  <h3 className="text-lg font-bold text-blue-300 mb-2">Experience Progress</h3>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div 
                      className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                      style={{ width: `${(experience / experienceToNext) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-400 mt-1 text-center">
                    {experience} / {experienceToNext} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Buttons */}
      <div className="fixed top-4 right-4 flex gap-2 z-40">
        <button
          onClick={() => setShowInventory(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Inventory (I)"
        >
          🎒
        </button>
        <button
          onClick={() => setShowCharacterSheet(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Character Sheet (C)"
        >
          👤
        </button>
        <button
          onClick={() => setShowQuestLog(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 relative"
          title="Quest Log (Q)"
        >
          📋
          {getActiveQuests().length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveQuests().length}
            </span>
          )}
        </button>
        <button
          onClick={() => setShowSkillTree(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 relative"
          title="Skill Tree (T)"
        >
          🌟
          {availableSkillPoints > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {availableSkillPoints}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setSaveLoadMode('save');
            setShowSaveLoad(true);
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Save Game (Ctrl+S)"
        >
          💾
        </button>
        <button
          onClick={() => {
            setSaveLoadMode('load');
            setShowSaveLoad(true);
          }}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Load Game (Ctrl+L)"
        >
          📁
        </button>
        <button
          onClick={() => setShowWorldMap(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="World Map (M)"
        >
          🗺️
        </button>
        <button
          onClick={() => setShowDialogue(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Dialogue (D)"
        >
          💬
        </button>
        <button
          onClick={() => setShowAudioVisual(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600"
          title="Audio & Visual (V)"
        >
          🎵
        </button>
        <button
          onClick={() => setShowMultiplayer(true)}
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded border border-gray-600 relative"
          title="Multiplayer (P)"
        >
          🌐
          {isConnected() && players.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {players.length}
            </span>
          )}
        </button>
      </div>
    </EnhancedGameUI>
  );
}
