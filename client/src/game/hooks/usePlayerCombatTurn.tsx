import { useState, useEffect } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { useTacticalCombat } from './useTacticalCombat';
import { CombatActionType } from '@/game/systems/CombatSystem';

export function usePlayerCombatTurn() {
  const { gamePhase, inCombat } = useGameState();
  const { 
    combatState, 
    selectAction, 
    executeMove, 
    executeAttack, 
    executeAbility, 
    selectEnemy, 
    endPlayerTurn 
  } = useTacticalCombat();
  
  const [selectedAction, setSelectedAction] = useState<CombatActionType | null>(null);
  const [selectedAbilityIndex, setSelectedAbilityIndex] = useState<number | null>(null);
  const [targetMode, setTargetMode] = useState(false);
  
  // Reset selection states when combat phase changes
  useEffect(() => {
    setSelectedAction(null);
    setSelectedAbilityIndex(null);
    setTargetMode(false);
  }, [combatState.currentPhase]);
  
  // Reset everything when combat ends
  useEffect(() => {
    if (!inCombat) {
      setSelectedAction(null);
      setSelectedAbilityIndex(null);
      setTargetMode(false);
    }
  }, [inCombat]);
  
  // Handle action selection from UI
  const handleActionSelect = (action: CombatActionType | null) => {
    if (!combatState.isPlayerTurn) return;
    
    console.log(`Selected action: ${action}`);
    
    // If same action selected, toggle it off
    if (action === selectedAction) {
      setSelectedAction(null);
      setTargetMode(false);
      return;
    }
    
    setSelectedAction(action);
    
    // Notify the combat system
    if (action) {
      selectAction(action);
      
      // For attack and ability, enter targeting mode
      if (action === CombatActionType.ATTACK || action === CombatActionType.ABILITY) {
        setTargetMode(true);
      } else {
        setTargetMode(false);
      }
    }
  };
  
  // Handle ability selection (when in ability action mode)
  const handleAbilitySelect = (abilityIndex: number) => {
    setSelectedAbilityIndex(abilityIndex);
    setTargetMode(true);
  };
  
  // Handle grid cell click for movement
  const handleGridCellClick = (position: [number, number, number]) => {
    if (!selectedAction || !combatState.isPlayerTurn) return;
    
    if (selectedAction === CombatActionType.MOVE) {
      console.log(`Moving to position: [${position[0]}, ${position[1]}, ${position[2]}]`);
      executeMove(position);
      setSelectedAction(null);
    }
  };
  
  // Handle enemy click for targeting
  const handleEnemyClick = (enemyId: string) => {
    if (!targetMode || !combatState.isPlayerTurn) return;
    
    if (selectedAction === CombatActionType.ATTACK) {
      console.log(`Attacking enemy: ${enemyId}`);
      executeAttack(enemyId);
      setSelectedAction(null);
      setTargetMode(false);
    } else if (selectedAction === CombatActionType.ABILITY && selectedAbilityIndex !== null) {
      console.log(`Using ability ${selectedAbilityIndex} on enemy: ${enemyId}`);
      executeAbility(selectedAbilityIndex, enemyId);
      setSelectedAction(null);
      setSelectedAbilityIndex(null);
      setTargetMode(false);
    }
  };
  
  // Handle end turn button click
  const handleEndTurn = () => {
    if (!combatState.isPlayerTurn) return;
    
    console.log('Ending player turn');
    endPlayerTurn();
    setSelectedAction(null);
    setTargetMode(false);
  };
  
  return {
    combatState,
    selectedAction,
    targetMode,
    handleActionSelect,
    handleAbilitySelect,
    handleGridCellClick,
    handleEnemyClick,
    handleEndTurn
  };
}