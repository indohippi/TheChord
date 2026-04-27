import { useState, useEffect } from 'react';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useTacticalCombat } from '@/game/hooks/useTacticalCombat';

// Action icon mapping
const actionIcons = {
  [CombatActionType.MOVE]: '🚶',
  [CombatActionType.ATTACK]: '⚔️',
  [CombatActionType.ABILITY]: '✨',
  'END_TURN': '⏩'
};

interface CombatActionMenuProps {
  onActionSelected: (action: CombatActionType | null) => void;
}

export function CombatActionMenu({ onActionSelected }: CombatActionMenuProps) {
  const { health, energy } = useGameState();
  const { abilities, setActiveAbilityIndex } = useCharacter();
  const { combatState, selectAction, endPlayerTurn } = useTacticalCombat();
  const [abilityMenuOpen, setAbilityMenuOpen] = useState(false);
  
  // Calculate action availability
  const canMove = combatState.isPlayerTurn && combatState.movementPoints > 0;
  const canAttack = combatState.isPlayerTurn && combatState.actionPoints > 0;
  const canUseAbility = combatState.isPlayerTurn && combatState.actionPoints > 0 && energy >= 10;
  
  // Handle action button clicks
  const handleActionClick = (action: CombatActionType) => {
    if (action === CombatActionType.ABILITY) {
      setAbilityMenuOpen(true);
    } else {
      selectAction(action);
      onActionSelected(action);
    }
  };
  
  // Handle ability selection
  const handleAbilitySelect = (abilityIndex: number) => {
    console.log(`Selected ability: ${abilities[abilityIndex].name}`);
    setActiveAbilityIndex(abilityIndex);
    setAbilityMenuOpen(false);
    selectAction(CombatActionType.ABILITY);
    onActionSelected(CombatActionType.ABILITY);
  };
  
  // Handle end turn
  const handleEndTurn = () => {
    console.log('Ending player turn');
    endPlayerTurn();
  };
  
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-10">
      {/* Main action buttons */}
      <div className={`flex flex-col gap-2 p-2 bg-black/50 rounded-lg ${!combatState.isPlayerTurn ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* Move action */}
        <button
          className={`btn w-14 h-14 rounded-full flex items-center justify-center text-2xl
            ${canMove ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 cursor-not-allowed'}
            ${combatState.currentPhase === 'move' ? 'ring-4 ring-yellow-400' : ''}
          `}
          onClick={() => canMove && handleActionClick(CombatActionType.MOVE)}
          disabled={!canMove}
          title={`Move (${combatState.movementPoints} points remaining)`}
        >
          {actionIcons[CombatActionType.MOVE]}
        </button>
        
        {/* Attack action */}
        <button
          className={`btn w-14 h-14 rounded-full flex items-center justify-center text-2xl
            ${canAttack ? 'bg-red-600 hover:bg-red-500' : 'bg-gray-700 cursor-not-allowed'}
            ${combatState.currentPhase === 'action' ? 'ring-4 ring-yellow-400' : ''}
          `}
          onClick={() => canAttack && handleActionClick(CombatActionType.ATTACK)}
          disabled={!canAttack}
          title={`Attack (${combatState.actionPoints} actions remaining)`}
        >
          {actionIcons[CombatActionType.ATTACK]}
        </button>
        
        {/* Ability action */}
        <button
          className={`btn w-14 h-14 rounded-full flex items-center justify-center text-2xl
            ${canUseAbility ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-700 cursor-not-allowed'}
            ${combatState.currentPhase === 'ability' ? 'ring-4 ring-yellow-400' : ''}
          `}
          onClick={() => canUseAbility && handleActionClick(CombatActionType.ABILITY)}
          disabled={!canUseAbility}
          title="Special Ability"
        >
          {actionIcons[CombatActionType.ABILITY]}
        </button>
        
        {/* End turn */}
        <button
          className="btn w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-green-600 hover:bg-green-500"
          onClick={handleEndTurn}
          title="End Turn"
        >
          {actionIcons['END_TURN']}
        </button>
      </div>
      
      {/* Ability selection menu (overlay) */}
      {abilityMenuOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-20">
          <div className="bg-gray-800 rounded-lg p-4 max-w-md">
            <h3 className="text-xl font-bold mb-4 text-white">Select Ability</h3>
            <div className="grid grid-cols-1 gap-2">
              {abilities.map((ability, index) => (
                <button
                  key={ability.id}
                  className={`p-2 rounded flex justify-between items-center
                    ${energy >= ability.energyCost ? 'bg-purple-700 hover:bg-purple-600' : 'bg-gray-700 opacity-60 cursor-not-allowed'}
                  `}
                  onClick={() => energy >= ability.energyCost && handleAbilitySelect(index)}
                  disabled={energy < ability.energyCost}
                >
                  <span className="text-white font-medium">{ability.name}</span>
                  <span className="bg-blue-800 px-2 py-1 rounded text-sm text-white">{ability.energyCost} Energy</span>
                </button>
              ))}
            </div>
            <button
              className="mt-4 w-full p-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
              onClick={() => setAbilityMenuOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Combat info display */}
      <div className="bg-black/50 rounded-lg p-2 text-white text-sm mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1">
            <span className="font-bold">Phase:</span>
            <span className="capitalize">{combatState.currentPhase}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">Turn:</span>
            <span>{combatState.currentTurn}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">Move:</span>
            <span className="text-blue-400">{combatState.movementPoints}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold">Action:</span>
            <span className="text-red-400">{combatState.actionPoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
}