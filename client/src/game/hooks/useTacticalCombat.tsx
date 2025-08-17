import { useState, useEffect } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useAudio } from '@/lib/stores/useAudio';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { Enemy } from '@shared/types';

// Combat turn state management
type CombatPhase = 'move' | 'action' | 'ability' | 'enemy' | 'end';

interface CombatEnemy extends Enemy {
  currentHealth: number;
  position: [number, number, number];
  isSelected: boolean;
  hasTakenTurn: boolean;
}

export interface TacticalCombatState {
  isActive: boolean;
  currentTurn: number;
  isPlayerTurn: boolean;
  currentPhase: CombatPhase;
  enemies: CombatEnemy[];
  selectedEnemyId: string | null;
  movementPoints: number;
  actionPoints: number;
  combatLog: string[];
  lastAction: string | null;
}

export function useTacticalCombat() {
  const { gamePhase, inCombat, currentEnemies, endCombat, updateHealth, updateEnergy } = useGameState();
  const { position, stats, abilities, setPosition } = useCharacter();
  const { playHit, playSuccess } = useAudio();
  
  // Combat state
  const [combatState, setCombatState] = useState<TacticalCombatState>({
    isActive: false,
    currentTurn: 1,
    isPlayerTurn: true,
    currentPhase: 'move',
    enemies: [],
    selectedEnemyId: null,
    movementPoints: 3,
    actionPoints: 2,
    combatLog: [],
    lastAction: null
  });
  
  // Initialize combat when it starts
  useEffect(() => {
    if (inCombat && gamePhase === 'combat') {
      // Initialize enemies with full health
      const initialEnemies: CombatEnemy[] = currentEnemies.map((enemy, index) => {
        // Position enemies in a semi-circle around the player
        const angle = (Math.PI / (currentEnemies.length + 1)) * (index + 1);
        const distance = 4; // Distance from player
        const offsetX = Math.cos(angle) * distance;
        const offsetZ = Math.sin(angle) * distance;
        
        return {
          ...enemy,
          currentHealth: enemy.health,
          position: [position[0] + offsetX, 0, position[2] + offsetZ],
          isSelected: false,
          hasTakenTurn: false
        };
      });
      
      setCombatState({
        isActive: true,
        currentTurn: 1,
        isPlayerTurn: true,
        currentPhase: 'move',
        enemies: initialEnemies,
        selectedEnemyId: null,
        movementPoints: 3,
        actionPoints: 2,
        combatLog: ['Combat initiated!', 'Your turn - Movement phase'],
        lastAction: null
      });
      
      // Log the start of combat
      console.log('Combat started with enemies:', initialEnemies);
    } else if (!inCombat && combatState.isActive) {
      // Reset when combat ends
      setCombatState(prev => ({
        ...prev,
        isActive: false
      }));
    }
  }, [inCombat, gamePhase, currentEnemies]);
  
  // Add message to combat log
  const addLogMessage = (message: string) => {
    setCombatState(prev => ({
      ...prev,
      combatLog: [...prev.combatLog, message]
    }));
    console.log(`[Combat]: ${message}`);
  };
  
  // Handle combat action selection
  const selectAction = (action: CombatActionType) => {
    if (!combatState.isPlayerTurn) return;
    
    switch (action) {
      case CombatActionType.MOVE:
        if (combatState.movementPoints <= 0) {
          addLogMessage('No movement points remaining');
          return;
        }
        setCombatState(prev => ({
          ...prev,
          currentPhase: 'move',
          lastAction: 'Selected movement action'
        }));
        addLogMessage('Movement mode - Select a destination tile');
        break;
        
      case CombatActionType.ATTACK:
        if (combatState.actionPoints <= 0) {
          addLogMessage('No action points remaining');
          return;
        }
        setCombatState(prev => ({
          ...prev,
          currentPhase: 'action',
          lastAction: 'Selected attack action'
        }));
        addLogMessage('Attack mode - Select an enemy to attack');
        break;
        
      case CombatActionType.ABILITY:
        if (combatState.actionPoints <= 0) {
          addLogMessage('No action points remaining');
          return;
        }
        setCombatState(prev => ({
          ...prev,
          currentPhase: 'ability',
          lastAction: 'Selected ability action'
        }));
        addLogMessage('Ability mode - Select an ability and target');
        break;
        
      default:
        break;
    }
  };
  
  // Execute a movement action
  const executeMove = (destination: [number, number, number]) => {
    if (combatState.currentPhase !== 'move' || !combatState.isPlayerTurn) return;
    
    // Calculate Manhattan distance on grid (grid size assumed 1 unit)
    const dx = Math.abs(Math.round(destination[0]) - Math.round(position[0]));
    const dz = Math.abs(Math.round(destination[2]) - Math.round(position[2]));
    const distance = dx + dz;
    
    if (distance <= 0) {
      addLogMessage('You are already on this tile');
      return;
    }
    
    if (distance > combatState.movementPoints) {
      addLogMessage('Not enough movement points');
      return;
    }
    
    // Move player to new position
    setPosition([destination[0], position[1], destination[2]]);
    addLogMessage(`Moved ${distance} tile${distance > 1 ? 's' : ''}`);
    
    // Consume movement points
    setCombatState(prev => ({
      ...prev,
      movementPoints: prev.movementPoints - distance,
      lastAction: 'Moved to new position',
      currentPhase: prev.movementPoints - distance <= 0 ? 'action' : 'move'
    }));
    
    // If out of movement points, automatically switch to action phase
    if (combatState.movementPoints - distance <= 0) {
      addLogMessage('Out of movement points. Now in action phase.');
    }
  };
  
  // Execute an attack action
  const executeAttack = (enemyId: string) => {
    if (combatState.currentPhase !== 'action' || !combatState.isPlayerTurn) return;
    
    // Find the target enemy
    const targetEnemy = combatState.enemies.find(enemy => enemy.id === enemyId);
    if (!targetEnemy) {
      addLogMessage('Invalid target');
      return;
    }
    
    // Consume an action point
    setCombatState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - 1,
      selectedEnemyId: enemyId,
      lastAction: `Attacked ${targetEnemy.name}`
    }));
    
    // Calculate damage based on player stats
    const damage = Math.floor(stats.strength * 1.5 + Math.random() * 10);
    
    // Apply damage animation/sound
    playHit();
    
    // Update enemy health
    setCombatState(prev => ({
      ...prev,
      enemies: prev.enemies.map(enemy => 
        enemy.id === enemyId 
          ? { ...enemy, currentHealth: Math.max(0, enemy.currentHealth - damage) }
          : enemy
      )
    }));
    
    // Log the attack
    addLogMessage(`Attacked ${targetEnemy.name} for ${damage} damage!`);
    
    // Check if enemy was defeated
    setTimeout(() => {
      setCombatState(prev => {
        const updatedEnemy = prev.enemies.find(e => e.id === enemyId);
        if (updatedEnemy && updatedEnemy.currentHealth <= 0) {
          // Enemy defeated
          playSuccess();
          addLogMessage(`${updatedEnemy.name} was defeated!`);
          
          // Update enemy list
          const remainingEnemies = prev.enemies.filter(e => e.id !== enemyId || e.currentHealth > 0);
          
          // Check for victory
          if (remainingEnemies.length === 0) {
            addLogMessage('Victory! All enemies defeated.');
            // End combat after delay
            setTimeout(() => endCombat(), 2000);
          }
          
          return {
            ...prev,
            enemies: remainingEnemies,
            selectedEnemyId: null,
            currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
          };
        }
        
        // Enemy still alive
        return {
          ...prev,
          selectedEnemyId: null,
          currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
        };
      });
      
      // If out of action points, automatically end turn
      if (combatState.actionPoints - 1 <= 0) {
        addLogMessage('Out of action points.');
      }
    }, 500);
  };
  
  // Execute an ability action
  const executeAbility = (abilityIndex: number, targetEnemyId: string) => {
    if (combatState.currentPhase !== 'ability' || !combatState.isPlayerTurn) return;
    
    const ability = abilities[abilityIndex];
    if (!ability) {
      addLogMessage('Invalid ability');
      return;
    }
    
    // Find the target enemy
    const targetEnemy = combatState.enemies.find(enemy => enemy.id === targetEnemyId);
    if (!targetEnemy) {
      addLogMessage('Invalid ability target');
      return;
    }
    
    // Check ability cost
    if (ability.energyCost > 0) {
      // Deduct energy
      updateEnergy(-ability.energyCost);
    }
    
    // Consume an action point
    setCombatState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - 1,
      selectedEnemyId: targetEnemyId,
      lastAction: `Used ${ability.name} on ${targetEnemy.name}`
    }));
    
    // Calculate ability damage/effect based on player stats and ability
    const baseDamage = Math.floor(stats.wisdom * 2 + Math.random() * 15);
    
    // Apply ability effect
    playHit();
    
    // Update enemy health
    setCombatState(prev => ({
      ...prev,
      enemies: prev.enemies.map(enemy => 
        enemy.id === targetEnemyId 
          ? { ...enemy, currentHealth: Math.max(0, enemy.currentHealth - baseDamage) }
          : enemy
      )
    }));
    
    // Log the ability use
    addLogMessage(`Used ${ability.name} on ${targetEnemy.name} for ${baseDamage} damage!`);
    
    // Check if enemy was defeated (similar to attack logic)
    setTimeout(() => {
      setCombatState(prev => {
        const updatedEnemy = prev.enemies.find(e => e.id === targetEnemyId);
        if (updatedEnemy && updatedEnemy.currentHealth <= 0) {
          // Enemy defeated by ability
          playSuccess();
          addLogMessage(`${updatedEnemy.name} was defeated by ${ability.name}!`);
          
          // Update enemy list
          const remainingEnemies = prev.enemies.filter(e => e.id !== targetEnemyId || e.currentHealth > 0);
          
          // Check for victory
          if (remainingEnemies.length === 0) {
            addLogMessage('Victory! All enemies defeated.');
            // End combat after delay
            setTimeout(() => endCombat(), 2000);
          }
          
          return {
            ...prev,
            enemies: remainingEnemies,
            selectedEnemyId: null,
            currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
          };
        }
        
        // Enemy still alive
        return {
          ...prev,
          selectedEnemyId: null,
          currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
        };
      });
    }, 500);
  };
  
  // End the player's turn
  const endPlayerTurn = () => {
    if (!combatState.isPlayerTurn) return;
    
    addLogMessage('Ending your turn. Enemy phase begins...');
    
    // Switch to enemy turn
    setCombatState(prev => ({
      ...prev,
      isPlayerTurn: false,
      currentPhase: 'enemy',
      lastAction: 'Ended turn'
    }));
    
    // Process enemy turns after a delay
    setTimeout(() => {
      processeEnemyTurns();
    }, 1000);
  };
  
  // Process all enemy turns
  const processeEnemyTurns = () => {
    // For each active enemy, take a turn
    const activeEnemies = combatState.enemies.filter(enemy => !enemy.hasTakenTurn);
    
    if (activeEnemies.length === 0) {
      // All enemies have acted, start new turn
      startNewTurn();
      return;
    }
    
    // Process first enemy's turn
    const enemy = activeEnemies[0];
    
    // Set as the active enemy
    setCombatState(prev => ({
      ...prev,
      selectedEnemyId: enemy.id,
      lastAction: `${enemy.name} is acting`
    }));
    
    addLogMessage(`${enemy.name} is taking its turn...`);
    
    // Simulate enemy thinking time
    setTimeout(() => {
      // Calculate damage
      const damage = Math.floor(enemy.damage * 0.8 + Math.random() * (enemy.damage * 0.4));
      
      // Enemy attacks player
      playHit();
      updateHealth(-damage);
      
      addLogMessage(`${enemy.name} attacks for ${damage} damage!`);
      
      // Mark this enemy as having taken its turn
      setCombatState(prev => ({
        ...prev,
        enemies: prev.enemies.map(e => 
          e.id === enemy.id ? { ...e, hasTakenTurn: true } : e
        ),
        selectedEnemyId: null
      }));
      
      // Process next enemy turn after a delay
      setTimeout(() => {
        processeEnemyTurns();
      }, 1000);
    }, 1500);
  };
  
  // Start a new turn
  const startNewTurn = () => {
    // Reset all enemies' turn status
    setCombatState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn + 1,
      isPlayerTurn: true,
      currentPhase: 'move',
      movementPoints: 3,
      actionPoints: 2,
      selectedEnemyId: null,
      enemies: prev.enemies.map(enemy => ({ ...enemy, hasTakenTurn: false })),
      lastAction: 'New turn started'
    }));
    
    addLogMessage(`Turn ${combatState.currentTurn + 1} begins. Your move!`);
  };
  
  // Select an enemy (for targeting)
  const selectEnemy = (enemyId: string) => {
    if (combatState.isPlayerTurn && (combatState.currentPhase === 'action' || combatState.currentPhase === 'ability')) {
      setCombatState(prev => ({
        ...prev,
        selectedEnemyId: enemyId,
        enemies: prev.enemies.map(enemy => 
          ({ ...enemy, isSelected: enemy.id === enemyId })
        )
      }));
      
      // If in action phase, directly attack the selected enemy
      if (combatState.currentPhase === 'action') {
        executeAttack(enemyId);
      }
      // If in ability phase, ability selection is required first,
      // then the executeAbility function will be called
    }
  };
  
  return {
    combatState,
    selectAction,
    executeMove,
    executeAttack,
    executeAbility,
    selectEnemy,
    endPlayerTurn
  };
}