import { useState, useEffect } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useAudio } from '@/lib/stores/useAudio';
import { CombatActionType } from '@/game/systems/CombatSystem';
import { Enemy } from '@shared/types';

// Combat turn state management
type CombatPhase = 'move' | 'action' | 'ability' | 'enemy' | 'end';

type StatusEffectType = 'dot' | 'stun' | 'weaken';
interface StatusEffect {
  id: string;
  type: StatusEffectType;
  duration: number; // turns remaining
  magnitude: number; // effect strength
}

interface CombatEnemy extends Enemy {
  currentHealth: number;
  position: [number, number, number];
  isSelected: boolean;
  hasTakenTurn: boolean;
  effects: StatusEffect[];
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
          hasTakenTurn: false,
          effects: []
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
      
      console.log('Combat started with enemies:', initialEnemies);
    } else if (!inCombat && combatState.isActive) {
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
  
  // Helper: apply status effect to an enemy
  const applyEffectToEnemy = (enemyId: string, effect: StatusEffect) => {
    setCombatState(prev => ({
      ...prev,
      enemies: prev.enemies.map(e => e.id === enemyId ? { ...e, effects: [...e.effects, effect] } : e)
    }));
  };
  
  // Helper: tick effects at enemy start of turn
  const tickEffectsOnEnemy = (enemy: CombatEnemy): CombatEnemy => {
    let updated = { ...enemy };
    for (const eff of updated.effects) {
      if (eff.type === 'dot' && eff.duration > 0) {
        const damage = eff.magnitude;
        updated.currentHealth = Math.max(0, updated.currentHealth - damage);
        addLogMessage(`${updated.name} suffers ${damage} damage from lingering effect.`);
      }
      // Other effect types can modify behavior elsewhere
      eff.duration = Math.max(0, eff.duration - 1);
    }
    // Remove expired effects
    updated.effects = updated.effects.filter(eff => eff.duration > 0);
    return updated;
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
    
    if (combatState.movementPoints - distance <= 0) {
      addLogMessage('Out of movement points. Now in action phase.');
    }
  };
  
  // Execute an attack action
  const executeAttack = (enemyId: string) => {
    if (combatState.currentPhase !== 'action' || !combatState.isPlayerTurn) return;
    
    const targetEnemy = combatState.enemies.find(enemy => enemy.id === enemyId);
    if (!targetEnemy) {
      addLogMessage('Invalid target');
      return;
    }
    
    setCombatState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - 1,
      selectedEnemyId: enemyId,
      lastAction: `Attacked ${targetEnemy.name}`
    }));
    
    const damage = Math.floor(stats.strength * 1.5 + Math.random() * 10);
    playHit();
    
    setCombatState(prev => ({
      ...prev,
      enemies: prev.enemies.map(enemy => 
        enemy.id === enemyId 
          ? { ...enemy, currentHealth: Math.max(0, enemy.currentHealth - damage) }
          : enemy
      )
    }));
    
    addLogMessage(`Attacked ${targetEnemy.name} for ${damage} damage!`);
    
    setTimeout(() => {
      setCombatState(prev => {
        const updatedEnemy = prev.enemies.find(e => e.id === enemyId);
        if (updatedEnemy && updatedEnemy.currentHealth <= 0) {
          playSuccess();
          addLogMessage(`${updatedEnemy.name} was defeated!`);
          const remainingEnemies = prev.enemies.filter(e => e.id !== enemyId || e.currentHealth > 0);
          if (remainingEnemies.length === 0) {
            addLogMessage('Victory! All enemies defeated.');
            setTimeout(() => endCombat(), 2000);
          }
          return {
            ...prev,
            enemies: remainingEnemies,
            selectedEnemyId: null,
            currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
          };
        }
        return {
          ...prev,
          selectedEnemyId: null,
          currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
        };
      });
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
    
    const targetEnemy = combatState.enemies.find(enemy => enemy.id === targetEnemyId);
    if (!targetEnemy) {
      addLogMessage('Invalid ability target');
      return;
    }
    
    if (ability.energyCost > 0) {
      updateEnergy(-ability.energyCost);
    }
    
    setCombatState(prev => ({
      ...prev,
      actionPoints: prev.actionPoints - 1,
      selectedEnemyId: targetEnemyId,
      lastAction: `Used ${ability.name} on ${targetEnemy.name}`
    }));
    
    // Base damage for offensive abilities
    let baseDamage = Math.floor(stats.wisdom * 2 + Math.random() * 15);
    let appliedEffect: StatusEffect | null = null;
    
    // Map ability ids to special effects
    switch (ability.id) {
      case 'serpents-embrace':
        // DoT effect
        appliedEffect = { id: 'serpents-dot', type: 'dot', duration: 3, magnitude: 4 + Math.floor(stats.willpower / 4) };
        addLogMessage(`${targetEnemy.name} is afflicted with corrosive energies!`);
        break;
      case "avatars-strike":
        // Stun
        appliedEffect = { id: 'stunned', type: 'stun', duration: 1, magnitude: 0 };
        addLogMessage(`${targetEnemy.name} is stunned and will skip its next action!`);
        baseDamage += 6;
        break;
      case 'qliphoth-seal':
        // Weaken
        appliedEffect = { id: 'weakened', type: 'weaken', duration: 2, magnitude: 3 };
        addLogMessage(`${targetEnemy.name} is weakened by the seal!`);
        break;
      default:
        break;
    }
    
    playHit();
    
    setCombatState(prev => ({
      ...prev,
      enemies: prev.enemies.map(enemy => 
        enemy.id === targetEnemyId 
          ? { ...enemy, currentHealth: Math.max(0, enemy.currentHealth - baseDamage), effects: appliedEffect ? [...enemy.effects, appliedEffect] : enemy.effects }
          : enemy
      )
    }));
    
    addLogMessage(`Used ${ability.name} on ${targetEnemy.name} for ${baseDamage} damage!`);
    
    setTimeout(() => {
      setCombatState(prev => {
        const updatedEnemy = prev.enemies.find(e => e.id === targetEnemyId);
        if (updatedEnemy && updatedEnemy.currentHealth <= 0) {
          playSuccess();
          addLogMessage(`${updatedEnemy.name} was defeated by ${ability.name}!`);
          const remainingEnemies = prev.enemies.filter(e => e.id !== targetEnemyId || e.currentHealth > 0);
          if (remainingEnemies.length === 0) {
            addLogMessage('Victory! All enemies defeated.');
            setTimeout(() => endCombat(), 2000);
          }
          return {
            ...prev,
            enemies: remainingEnemies,
            selectedEnemyId: null,
            currentPhase: prev.actionPoints - 1 <= 0 ? 'end' : 'action'
          };
        }
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
    
    setCombatState(prev => ({
      ...prev,
      isPlayerTurn: false,
      currentPhase: 'enemy',
      lastAction: 'Ended turn'
    }));
    
    setTimeout(() => {
      processeEnemyTurns();
    }, 1000);
  };
  
  // Process all enemy turns
  const processeEnemyTurns = () => {
    const activeEnemies = combatState.enemies.filter(enemy => !enemy.hasTakenTurn);
    
    if (activeEnemies.length === 0) {
      startNewTurn();
      return;
    }
    
    const enemy = activeEnemies[0];
    
    setCombatState(prev => ({
      ...prev,
      selectedEnemyId: enemy.id,
      lastAction: `${enemy.name} is acting`
    }));
    
    // Tick effects
    let enemyAfterEffects: CombatEnemy | null = null;
    setCombatState(prev => {
      const updatedEnemies = prev.enemies.map(e => e.id === enemy.id ? tickEffectsOnEnemy(e) : e);
      enemyAfterEffects = updatedEnemies.find(e => e.id === enemy.id) || null;
      return { ...prev, enemies: updatedEnemies };
    });
    
    const resolvedEnemy = enemyAfterEffects as CombatEnemy | null;
    if (resolvedEnemy && resolvedEnemy.currentHealth <= 0) {
      addLogMessage(`${resolvedEnemy.name} succumbs to lingering effects!`);
      setCombatState(prev => ({
        ...prev,
        enemies: prev.enemies.filter(e => e.id !== resolvedEnemy!.id),
        selectedEnemyId: null
      }));
      setTimeout(() => processeEnemyTurns(), 800);
      return;
    }
    
    addLogMessage(`${enemy.name} is taking its turn...`);
    
    setTimeout(() => {
      // Calculate damage
      let base = Math.floor(enemy.damage * 0.8 + Math.random() * (enemy.damage * 0.4));
      const weakened = (resolvedEnemy?.effects || []).find(e => e.type === 'weaken');
      if (weakened) base = Math.max(0, base - weakened.magnitude);
      const stunned = (resolvedEnemy?.effects || []).some(e => e.type === 'stun');
      
      if (stunned) {
        addLogMessage(`${enemy.name} is stunned and skips the turn!`);
      } else {
        playHit();
        updateHealth(-base);
        addLogMessage(`${enemy.name} attacks for ${base} damage!`);
      }
      
      setCombatState(prev => ({
        ...prev,
        enemies: prev.enemies.map(e => 
          e.id === enemy.id ? { ...e, hasTakenTurn: true } : e
        ),
        selectedEnemyId: null
      }));
      
      setTimeout(() => {
        processeEnemyTurns();
      }, 1000);
    }, 1500);
  };
  
  // Start a new turn
  const startNewTurn = () => {
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
      
      if (combatState.currentPhase === 'action') {
        executeAttack(enemyId);
      }
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