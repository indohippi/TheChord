import { useEffect, useRef, useState } from 'react';
import { useCharacter } from '@/lib/stores/useCharacter';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';
import { useGridSystem } from './GridSystem';
import { Enemy as EnemyType } from '@shared/types';

// Enum for combat action types
export enum CombatActionType {
  MOVE = 'move',
  ATTACK = 'attack',
  ABILITY = 'ability',
  WAIT = 'wait',
  DEFEND = 'defend'
}

// Combat action interface
export interface CombatAction {
  type: CombatActionType;
  sourceEntityId: string;
  targetEntityId?: string;
  targetPosition?: [number, number];
  abilityIndex?: number;
}

// Combat entity interface
export interface CombatEntity {
  id: string;
  type: 'player' | 'enemy';
  name: string;
  health: number;
  maxHealth: number;
  energy: number; 
  maxEnergy: number;
  position: [number, number]; // Grid position
  movementRange: number;
  attackRange: number;
  stats: Record<string, number>;
  abilities: string[];
  hasMoved: boolean;
  hasActed: boolean;
}

export function CombatSystem() {
  // Get character state
  const { selectedClass, position: playerPosition, setPosition, stats, abilities, activeAbilityIndex } = useCharacter();
  
  // Get game state
  const { gamePhase, inCombat, currentEnemies, updateHealth, updateEnergy, endCombat } = useGameState();
  
  // Get audio functions
  const { playHit, playSuccess } = useAudio();
  
  // Get grid system
  const {
    gridState,
    getWorldPosition,
    getGridPosition,
    setCellOccupation,
    setCellWalkable,
    selectCell,
    clearSelection,
    highlightMovementRange,
    highlightAttackRange,
    calculatePath,
    clearHighlights
  } = useGridSystem();
  
  // Combat state
  const [combatEntities, setCombatEntities] = useState<CombatEntity[]>([]);
  const [activeEntityIndex, setActiveEntityIndex] = useState<number>(-1);
  const [combatPhase, setCombatPhase] = useState<'initializing' | 'playerTurn' | 'enemyTurn' | 'resolving'>('initializing');
  const [combatTurn, setCombatTurn] = useState<number>(1);
  const [selectedAction, setSelectedAction] = useState<CombatActionType | null>(null);
  const [actionTarget, setActionTarget] = useState<[number, number] | null>(null);
  
  // Initialize combat when it starts
  useEffect(() => {
    if (inCombat && gamePhase === 'combat') {
      console.log('Combat started with:', currentEnemies);
      
      // Reset combat state
      setCombatTurn(1);
      setCombatPhase('initializing');
      setSelectedAction(null);
      setActionTarget(null);
      
      // Initialize grid for combat
      initializeCombatGrid();
      
      // Initialize combat entities
      initializeCombatEntities();
      
      // Start player's turn after initialization
      setTimeout(() => {
        setCombatPhase('playerTurn');
        setActiveEntityIndex(0); // Player is always first
        
        // Highlight player's movement range
        const playerEntity = combatEntities[0];
        if (playerEntity) {
          highlightMovementRange(playerEntity.position[0], playerEntity.position[1], playerEntity.movementRange);
        }
      }, 500);
    }
  }, [inCombat, gamePhase]);
  
  // Initialize combat grid
  const initializeCombatGrid = () => {
    // Clear existing grid state
    clearHighlights();
    clearSelection();
    
    // If we get position from player, convert to grid coordinates
    const [gridX, gridZ] = getGridPosition(playerPosition[0], playerPosition[2]) || [5, 5];
    
    // Initialize player position on grid
    setCellOccupation(gridX, gridZ, true, 'player', 'player');
    
    // Initialize enemy positions on grid
    currentEnemies.forEach((enemy, index) => {
      // Place enemies around the player with some spacing
      const enemyGridX = gridX + 3 + index;
      const enemyGridZ = gridZ + (index % 2 === 0 ? -1 : 1);
      
      setCellOccupation(enemyGridX, enemyGridZ, true, 'enemy', enemy.id);
    });
  };
  
  // Initialize combat entities
  const initializeCombatEntities = () => {
    const entities: CombatEntity[] = [];
    
    // Create player entity
    const [gridX, gridZ] = getGridPosition(playerPosition[0], playerPosition[2]) || [5, 5];
    
    const playerEntity: CombatEntity = {
      id: 'player',
      type: 'player',
      name: selectedClass || 'Player',
      health: 100, // Get from game state
      maxHealth: 100,
      energy: 100,
      maxEnergy: 100,
      position: [gridX, gridZ],
      movementRange: 3,
      attackRange: 1,
      stats: {
        strength: stats.strength,
        wisdom: stats.wisdom,
        agility: stats.agility,
        willpower: stats.willpower,
        harmony: stats.harmony
      },
      abilities: abilities.map(a => a.id),
      hasMoved: false,
      hasActed: false
    };
    
    entities.push(playerEntity);
    
    // Create enemy entities
    currentEnemies.forEach((enemy, index) => {
      // Place enemies around the player with some spacing
      const enemyGridX = gridX + 3 + index;
      const enemyGridZ = gridZ + (index % 2 === 0 ? -1 : 1);
      
      const enemyEntity: CombatEntity = {
        id: enemy.id,
        type: 'enemy',
        name: enemy.name,
        health: enemy.health,
        maxHealth: enemy.health,
        energy: 50,
        maxEnergy: 50,
        position: [enemyGridX, enemyGridZ],
        movementRange: 2,
        attackRange: 1,
        stats: {
          strength: enemy.damage,
          wisdom: 10,
          agility: 10,
          willpower: 10,
          harmony: 10
        },
        abilities: enemy.abilities,
        hasMoved: false,
        hasActed: false
      };
      
      entities.push(enemyEntity);
    });
    
    setCombatEntities(entities);
  };
  
  // Process player's turn when they use an ability
  useEffect(() => {
    if (inCombat && gamePhase === 'combat' && activeAbilityIndex !== null && combatPhase === 'playerTurn') {
      const activeEntity = combatEntities[activeEntityIndex];
      
      if (activeEntity && activeEntity.type === 'player' && !activeEntity.hasActed) {
        const ability = abilities[activeAbilityIndex];
        
        // Set the action type to ability
        setSelectedAction(CombatActionType.ABILITY);
        
        // Highlight attack range for the ability
        clearHighlights();
        highlightAttackRange(activeEntity.position[0], activeEntity.position[1], activeEntity.attackRange);
        
        // User needs to select a target now
        console.log(`Select a target for ${ability.name}`);
      }
    }
  }, [activeAbilityIndex, inCombat, gamePhase, combatPhase, activeEntityIndex]);
  
  // Process action when target is selected
  useEffect(() => {
    if (inCombat && gamePhase === 'combat' && actionTarget && selectedAction) {
      const activeEntity = combatEntities[activeEntityIndex];
      
      if (activeEntity && combatPhase === 'playerTurn') {
        // Process the action based on its type
        switch (selectedAction) {
          case CombatActionType.MOVE:
            handleMoveAction(activeEntity, actionTarget);
            break;
            
          case CombatActionType.ATTACK:
            handleAttackAction(activeEntity, actionTarget);
            break;
            
          case CombatActionType.ABILITY:
            handleAbilityAction(activeEntity, actionTarget, activeAbilityIndex || 0);
            break;
            
          default:
            console.log(`Unhandled action type: ${selectedAction}`);
        }
        
        // Reset action selection
        setSelectedAction(null);
        setActionTarget(null);
        
        // Progress to next entity or phase
        progressCombat();
      }
    }
  }, [actionTarget, selectedAction]);
  
  // Handle entity movement
  const handleMoveAction = (entity: CombatEntity, target: [number, number]) => {
    // Check if movement is valid
    const [targetX, targetZ] = target;
    const distance = Math.abs(entity.position[0] - targetX) + Math.abs(entity.position[1] - targetZ);
    
    if (distance <= entity.movementRange) {
      // Update grid cells
      setCellOccupation(entity.position[0], entity.position[1], false);
      setCellOccupation(targetX, targetZ, true, entity.type, entity.id);
      
      // Update entity position
      setCombatEntities(prev => prev.map(e => 
        e.id === entity.id 
          ? { ...e, position: [targetX, targetZ], hasMoved: true }
          : e
      ));
      
      // If player entity, update their world position
      if (entity.type === 'player') {
        const worldPos = getWorldPosition(targetX, targetZ);
        if (worldPos) {
          setPosition([worldPos[0], playerPosition[1], worldPos[2]]);
        }
      }
      
      console.log(`${entity.name} moved to [${targetX}, ${targetZ}]`);
    } else {
      console.log(`Invalid movement - distance ${distance} exceeds movement range ${entity.movementRange}`);
    }
  };
  
  // Handle basic attack
  const handleAttackAction = (entity: CombatEntity, target: [number, number]) => {
    // Find target entity at the location
    const [targetX, targetZ] = target;
    const targetEntity = combatEntities.find(e => 
      e.position[0] === targetX && e.position[1] === targetZ && e.id !== entity.id
    );
    
    if (targetEntity) {
      // Calculate attack distance
      const distance = Math.abs(entity.position[0] - targetX) + Math.abs(entity.position[1] - targetZ);
      
      if (distance <= entity.attackRange) {
        // Perform attack
        playHit();
        
        // Simple damage calculation
        const baseDamage = entity.stats.strength;
        const damage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4));
        
        console.log(`${entity.name} attacks ${targetEntity.name} for ${damage} damage`);
        
        // Update target health
        setCombatEntities(prev => prev.map(e => 
          e.id === targetEntity.id 
            ? { ...e, health: Math.max(0, e.health - damage) }
            : e
        ));
        
        // Mark entity as having acted
        setCombatEntities(prev => prev.map(e => 
          e.id === entity.id 
            ? { ...e, hasActed: true }
            : e
        ));
        
        // If target is player, update player health
        if (targetEntity.type === 'player') {
          updateHealth(-damage);
        }
        
        // Check if target is defeated
        setTimeout(() => {
          const updatedTarget = combatEntities.find(e => e.id === targetEntity.id);
          if (updatedTarget && updatedTarget.health <= 0) {
            console.log(`${targetEntity.name} was defeated!`);
            handleEntityDefeat(targetEntity);
          }
        }, 10);
      } else {
        console.log(`Attack out of range - distance ${distance} exceeds attack range ${entity.attackRange}`);
      }
    } else {
      console.log(`No target at position [${targetX}, ${targetZ}]`);
    }
  };
  
  // Handle ability use
  const handleAbilityAction = (entity: CombatEntity, target: [number, number], abilityIndex: number) => {
    if (abilityIndex < 0 || abilityIndex >= abilities.length) {
      console.log('Invalid ability index');
      return;
    }
    
    const ability = abilities[abilityIndex];
    
    // Find target entity at the location
    const [targetX, targetZ] = target;
    const targetEntity = combatEntities.find(e => 
      e.position[0] === targetX && e.position[1] === targetZ && e.id !== entity.id
    );
    
    if (targetEntity) {
      // Calculate ability distance
      const distance = Math.abs(entity.position[0] - targetX) + Math.abs(entity.position[1] - targetZ);
      
      if (distance <= entity.attackRange + 1) { // Abilities have slightly longer range
        // Perform ability
        playHit();
        
        // Ability damage calculation - based on wisdom for magical abilities
        const baseDamage = entity.stats.wisdom * 1.2;
        const damage = Math.floor(baseDamage * (0.9 + Math.random() * 0.3));
        
        console.log(`${entity.name} uses ${ability.name} on ${targetEntity.name} for ${damage} damage`);
        
        // Consume energy
        updateEnergy(-ability.energyCost);
        
        // Update target health
        setCombatEntities(prev => prev.map(e => 
          e.id === targetEntity.id 
            ? { ...e, health: Math.max(0, e.health - damage) }
            : e
        ));
        
        // Mark entity as having acted
        setCombatEntities(prev => prev.map(e => 
          e.id === entity.id 
            ? { ...e, hasActed: true }
            : e
        ));
        
        // If target is player, update player health
        if (targetEntity.type === 'player') {
          updateHealth(-damage);
        }
        
        // Check if target is defeated
        setTimeout(() => {
          const updatedTarget = combatEntities.find(e => e.id === targetEntity.id);
          if (updatedTarget && updatedTarget.health <= 0) {
            console.log(`${targetEntity.name} was defeated!`);
            handleEntityDefeat(targetEntity);
          }
        }, 10);
      } else {
        console.log(`Ability out of range - distance ${distance} exceeds range ${entity.attackRange + 1}`);
      }
    } else {
      console.log(`No target at position [${targetX}, ${targetZ}]`);
    }
  };
  
  // Handle entity defeat (remove from combat)
  const handleEntityDefeat = (entity: CombatEntity) => {
    // Update grid
    setCellOccupation(entity.position[0], entity.position[1], false);
    
    // Remove entity from combat
    setCombatEntities(prev => prev.filter(e => e.id !== entity.id));
    
    // Check win/loss condition
    const remainingEnemies = combatEntities.filter(e => e.type === 'enemy' && e.health > 0);
    const playerEntity = combatEntities.find(e => e.type === 'player');
    
    if (remainingEnemies.length === 0) {
      // Player wins
      console.log('Combat victory!');
      playSuccess();
      
      // End combat after a delay
      setTimeout(() => {
        endCombat();
      }, 1500);
    } else if (!playerEntity || playerEntity.health <= 0) {
      // Player loses
      console.log('Combat defeat!');
      
      // Game over handling would go here
    }
  };
  
  // Progress to next entity or phase
  const progressCombat = () => {
    // Find next entity that hasn't acted
    let nextEntityIndex = -1;
    
    if (combatPhase === 'playerTurn') {
      // Check if player has both moved and acted
      const playerEntity = combatEntities[activeEntityIndex];
      
      if (playerEntity && (!playerEntity.hasMoved || !playerEntity.hasActed)) {
        // Player still has actions available
        nextEntityIndex = activeEntityIndex;
        
        // Update available actions
        if (!playerEntity.hasMoved) {
          highlightMovementRange(playerEntity.position[0], playerEntity.position[1], playerEntity.movementRange);
        } else if (!playerEntity.hasActed) {
          highlightAttackRange(playerEntity.position[0], playerEntity.position[1], playerEntity.attackRange);
        }
      } else {
        // Player turn complete, move to enemy turn
        console.log('Player turn complete, switching to enemy turn');
        setCombatPhase('enemyTurn');
        
        // Find first enemy
        nextEntityIndex = combatEntities.findIndex(e => e.type === 'enemy');
      }
    } else if (combatPhase === 'enemyTurn') {
      // Find next enemy that hasn't acted
      nextEntityIndex = combatEntities.findIndex(
        (e, i) => i > activeEntityIndex && e.type === 'enemy' && (!e.hasMoved || !e.hasActed)
      );
      
      if (nextEntityIndex === -1) {
        // Check from beginning
        nextEntityIndex = combatEntities.findIndex(
          e => e.type === 'enemy' && (!e.hasMoved || !e.hasActed)
        );
        
        if (nextEntityIndex === -1) {
          // All enemies have acted, end turn
          console.log('Enemy turn complete, starting new turn');
          setCombatPhase('resolving');
          
          // Reset entity states for new turn
          setCombatEntities(prev => prev.map(e => ({
            ...e,
            hasMoved: false,
            hasActed: false
          })));
          
          // Increment turn counter
          setCombatTurn(prev => prev + 1);
          
          // Start next turn after a delay
          setTimeout(() => {
            setCombatPhase('playerTurn');
            const playerIndex = combatEntities.findIndex(e => e.type === 'player');
            setActiveEntityIndex(playerIndex !== -1 ? playerIndex : 0);
            
            // Highlight player's movement range
            const playerEntity = combatEntities[playerIndex];
            if (playerEntity) {
              highlightMovementRange(playerEntity.position[0], playerEntity.position[1], playerEntity.movementRange);
            }
          }, 1000);
          
          return;
        }
      }
    }
    
    // Update active entity
    if (nextEntityIndex !== -1) {
      setActiveEntityIndex(nextEntityIndex);
      
      // Process enemy AI if it's an enemy's turn
      const nextEntity = combatEntities[nextEntityIndex];
      if (combatPhase === 'enemyTurn' && nextEntity && nextEntity.type === 'enemy') {
        // Process enemy AI after a delay
        setTimeout(() => {
          processEnemyAI(nextEntity);
        }, 1000);
      }
    }
  };
  
  // Process enemy AI
  const processEnemyAI = (enemy: CombatEntity) => {
    console.log(`Processing AI for ${enemy.name}`);
    
    // Get player entity
    const playerEntity = combatEntities.find(e => e.type === 'player');
    
    if (!playerEntity) {
      // No player found, skip turn
      setCombatEntities(prev => prev.map(e => 
        e.id === enemy.id 
          ? { ...e, hasMoved: true, hasActed: true }
          : e
      ));
      
      progressCombat();
      return;
    }
    
    // Calculate distance to player
    const distance = Math.abs(enemy.position[0] - playerEntity.position[0]) + 
                     Math.abs(enemy.position[1] - playerEntity.position[1]);
    
    // If within attack range, attack
    if (distance <= enemy.attackRange) {
      // Attack player
      handleAttackAction(enemy, playerEntity.position);
      
      // Mark as moved too since we're not moving
      setCombatEntities(prev => prev.map(e => 
        e.id === enemy.id 
          ? { ...e, hasMoved: true }
          : e
      ));
      
      // Progress combat after a delay
      setTimeout(() => {
        progressCombat();
      }, 1000);
    } else {
      // Need to move toward player
      const [playerX, playerZ] = playerEntity.position;
      const [enemyX, enemyZ] = enemy.position;
      
      // Calculate movement toward player (simple approach)
      let moveX = enemyX;
      let moveZ = enemyZ;
      
      if (Math.abs(enemyX - playerX) > Math.abs(enemyZ - playerZ)) {
        // Move in X direction
        moveX = enemyX > playerX ? enemyX - 1 : enemyX + 1;
      } else {
        // Move in Z direction
        moveZ = enemyZ > playerZ ? enemyZ - 1 : enemyZ + 1;
      }
      
      // Check if target cell is walkable and not occupied
      const targetCell = gridState.cells[moveX]?.[moveZ];
      
      if (targetCell && targetCell.isWalkable && !targetCell.isOccupied) {
        // Move to the cell
        handleMoveAction(enemy, [moveX, moveZ]);
        
        // Check if we're now in attack range
        const newDistance = Math.abs(moveX - playerX) + Math.abs(moveZ - playerZ);
        
        if (newDistance <= enemy.attackRange) {
          // Attack after moving
          setTimeout(() => {
            handleAttackAction(enemy, playerEntity.position);
            
            // Progress combat after a delay
            setTimeout(() => {
              progressCombat();
            }, 1000);
          }, 1000);
        } else {
          // Just mark as acted
          setCombatEntities(prev => prev.map(e => 
            e.id === enemy.id 
              ? { ...e, hasActed: true }
              : e
          ));
          
          // Progress combat after a delay
          setTimeout(() => {
            progressCombat();
          }, 1000);
        }
      } else {
        // Can't move, skip turn
        console.log(`${enemy.name} can't move, skipping turn`);
        
        setCombatEntities(prev => prev.map(e => 
          e.id === enemy.id 
            ? { ...e, hasMoved: true, hasActed: true }
            : e
        ));
        
        // Progress combat after a delay
        setTimeout(() => {
          progressCombat();
        }, 1000);
      }
    }
  };
  
  return null;
}
