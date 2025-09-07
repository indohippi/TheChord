import { create } from "zustand";
import { 
  CombatState, 
  CombatEntity, 
  StatusEffect, 
  DamageCalculation, 
  CombatResult,
  CombatTurn,
  EnvironmentalObject,
  EnvironmentalEffect,
  ComboAttack,
  CombatModifier,
  DamageType,
  StatusEffectType
} from "@shared/combatTypes";

interface CombatStore {
  // Combat state
  combatState: CombatState;
  
  // Actions
  startCombat: (entities: CombatEntity[], area: any) => void;
  endCombat: () => void;
  processTurn: (action: string, target?: string, position?: [number, number, number]) => Promise<CombatResult>;
  processAttack: (sourceId: string, targetId: string) => Promise<CombatResult>;
  processAbility: (sourceId: string, targetId: string) => Promise<CombatResult>;
  processMove: (sourceId: string, position: [number, number, number]) => Promise<CombatResult>;
  processDefend: (sourceId: string) => Promise<CombatResult>;
  processItem: (sourceId: string, itemId: string) => Promise<CombatResult>;
  
  // Entity management
  addEntity: (entity: CombatEntity) => void;
  removeEntity: (entityId: string) => void;
  updateEntity: (entityId: string, updates: Partial<CombatEntity>) => void;
  getEntity: (entityId: string) => CombatEntity | undefined;
  
  // Status effects
  applyStatusEffect: (entityId: string, effect: StatusEffect) => void;
  removeStatusEffect: (entityId: string, effectId: string) => void;
  processStatusEffects: (entityId: string) => void;
  getStatusEffects: (entityId: string) => StatusEffect[];
  
  // Damage calculation
  calculateDamage: (source: CombatEntity, target: CombatEntity, baseDamage: number, damageType: DamageType) => DamageCalculation;
  applyDamage: (entityId: string, damage: DamageCalculation) => void;
  applyHealing: (entityId: string, amount: number) => void;
  
  // Environmental interactions
  addEnvironmentalObject: (object: EnvironmentalObject) => void;
  removeEnvironmentalObject: (objectId: string) => void;
  interactWithEnvironment: (entityId: string, objectId: string, interaction: string) => Promise<CombatResult>;
  
  // Combo system
  checkCombo: (entityId: string, action: string) => ComboAttack | null;
  executeCombo: (entityId: string, combo: ComboAttack, target?: string) => Promise<CombatResult>;
  updateComboMeter: (entityId: string, amount: number) => void;
  
  // Combat modifiers
  addCombatModifier: (modifier: CombatModifier) => void;
  removeCombatModifier: (modifierId: string) => void;
  getCombatModifiers: (entityId: string) => CombatModifier[];
  
  // Turn management
  nextTurn: () => void;
  getCurrentEntity: () => CombatEntity | undefined;
  getTurnOrder: () => CombatEntity[];
  
  // Utility
  isCombatActive: () => boolean;
  getCombatStats: () => any;
  resetCombat: () => void;
}

// Default combat state
const defaultCombatState: CombatState = {
  isActive: false,
  turnNumber: 0,
  activeEntity: '',
  entities: [],
  turnOrder: [],
  comboMeter: 0,
  environmentalObjects: [],
  combatModifiers: [],
  turnHistory: []
};

export const useCombat = create<CombatStore>((set, get) => ({
  // Initial state
  combatState: defaultCombatState,
  
  // Start combat
  startCombat: (entities, area) => {
    // Calculate turn order based on speed
    const sortedEntities = [...entities].sort((a, b) => b.stats.speed - a.stats.speed);
    const turnOrder = sortedEntities.map(e => e.id);
    
    set({
      combatState: {
        ...defaultCombatState,
        isActive: true,
        turnNumber: 1,
        activeEntity: turnOrder[0],
        entities: sortedEntities,
        turnOrder,
        environmentalObjects: area?.environmentalObjects || [],
        comboMeter: 0
      }
    });
    
    console.log("Combat started with", entities.length, "entities");
  },
  
  // End combat
  endCombat: () => {
    set({
      combatState: {
        ...defaultCombatState,
        isActive: false
      }
    });
    
    console.log("Combat ended");
  },
  
  // Process turn
  processTurn: async (action, target, position) => {
    const state = get();
    const currentEntity = state.getCurrentEntity();
    
    if (!currentEntity) {
      return {
        success: false,
        message: "No active entity"
      };
    }
    
    let result: CombatResult = {
      success: false,
      message: "Action failed"
    };
    
    try {
      switch (action) {
        case 'attack':
          if (target) {
            result = await state.processAttack(currentEntity.id, target);
          }
          break;
        case 'ability':
          if (target) {
            result = await state.processAbility(currentEntity.id, target);
          }
          break;
        case 'move':
          if (position) {
            result = await state.processMove(currentEntity.id, position);
          }
          break;
        case 'defend':
          result = await state.processDefend(currentEntity.id);
          break;
        case 'item':
          if (target) {
            result = await state.processItem(currentEntity.id, target);
          }
          break;
        default:
          result = {
            success: false,
            message: "Unknown action"
          };
      }
      
      // Add turn to history
      const turn: CombatTurn = {
        turnNumber: state.combatState.turnNumber,
        activeEntity: currentEntity.id,
        action: action as any,
        target,
        position,
        result,
        timestamp: Date.now()
      };
      
      set({
        combatState: {
          ...state.combatState,
          turnHistory: [...state.combatState.turnHistory, turn]
        }
      });
      
      // Check for combo
      const combo = state.checkCombo(currentEntity.id, action);
      if (combo) {
        result.comboTriggered = combo;
        state.updateComboMeter(currentEntity.id, 10);
      }
      
      // Process status effects
      state.processStatusEffects(currentEntity.id);
      
      // Check win/lose conditions
      const remainingEnemies = state.combatState.entities.filter(e => 
        e.type === 'enemy' && e.health > 0
      );
      const player = state.combatState.entities.find(e => e.type === 'player');
      
      if (remainingEnemies.length === 0) {
        // Player wins
        state.endCombat();
        result.message = "Victory!";
      } else if (!player || player.health <= 0) {
        // Player loses
        state.endCombat();
        result.message = "Defeat!";
      } else {
        // Continue combat
        state.nextTurn();
      }
      
      return result;
      
    } catch (error) {
      console.error("Error processing turn:", error);
      return {
        success: false,
        message: "Error processing action"
      };
    }
  },
  
  // Add entity
  addEntity: (entity) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        entities: [...state.combatState.entities, entity]
      }
    });
  },
  
  // Remove entity
  removeEntity: (entityId) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        entities: state.combatState.entities.filter(e => e.id !== entityId),
        turnOrder: state.combatState.turnOrder.filter(id => id !== entityId)
      }
    });
  },
  
  // Update entity
  updateEntity: (entityId, updates) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        entities: state.combatState.entities.map(e => 
          e.id === entityId ? { ...e, ...updates } : e
        )
      }
    });
  },
  
  // Get entity
  getEntity: (entityId) => {
    const state = get();
    return state.combatState.entities.find(e => e.id === entityId);
  },
  
  // Apply status effect
  applyStatusEffect: (entityId, effect) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    // Check if entity is immune to this effect
    if (entity.immunities.includes(effect.type)) {
      console.log(`${entity.name} is immune to ${effect.type}`);
      return;
    }
    
    // Check if effect already exists
    const existingEffect = entity.statusEffects.find(e => e.type === effect.type);
    
    if (existingEffect) {
      if (effect.stackable && existingEffect.currentStacks < effect.maxStacks) {
        existingEffect.currentStacks++;
        existingEffect.duration = Math.max(existingEffect.duration, effect.duration);
      } else {
        existingEffect.duration = effect.duration;
        existingEffect.intensity = effect.intensity;
      }
    } else {
      entity.statusEffects.push({ ...effect, currentStacks: 1 });
    }
    
    state.updateEntity(entityId, { statusEffects: entity.statusEffects });
    
    console.log(`Applied ${effect.type} to ${entity.name}`);
  },
  
  // Remove status effect
  removeStatusEffect: (entityId, effectId) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    entity.statusEffects = entity.statusEffects.filter(e => e.id !== effectId);
    state.updateEntity(entityId, { statusEffects: entity.statusEffects });
    
    console.log(`Removed status effect ${effectId} from ${entity.name}`);
  },
  
  // Process status effects
  processStatusEffects: (entityId) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    const effectsToRemove: string[] = [];
    
    entity.statusEffects.forEach(effect => {
      // Apply effect
      switch (effect.type) {
        case 'poison':
        case 'burn':
          if (effect.damage) {
            const damage: DamageCalculation = {
              baseDamage: effect.damage * effect.currentStacks,
              damageType: effect.damageType || 'poison',
              critical: false,
              criticalMultiplier: 1,
              resistance: 0,
              vulnerability: 0,
              finalDamage: effect.damage * effect.currentStacks,
              blocked: 0,
              absorbed: 0,
              reflected: 0
            };
            state.applyDamage(entityId, damage);
          }
          break;
        case 'regeneration':
          state.applyHealing(entityId, effect.intensity * effect.currentStacks);
          break;
        // Add more status effect processing here
      }
      
      // Decrease duration
      effect.duration--;
      
      if (effect.duration <= 0) {
        effectsToRemove.push(effect.id);
      }
    });
    
    // Remove expired effects
    effectsToRemove.forEach(effectId => {
      state.removeStatusEffect(entityId, effectId);
    });
  },
  
  // Calculate damage
  calculateDamage: (source, target, baseDamage, damageType) => {
    // Base damage calculation
    let finalDamage = baseDamage;
    
    // Apply source stats
    finalDamage += source.stats.strength * 0.5;
    
    // Apply target defense
    const defense = target.stats.defense;
    finalDamage = Math.max(1, finalDamage - defense);
    
    // Apply resistances
    if (target.resistances.includes(damageType)) {
      finalDamage *= 0.5;
    }
    
    // Apply vulnerabilities
    if (target.vulnerabilities.includes(damageType)) {
      finalDamage *= 1.5;
    }
    
    // Critical hit chance
    const criticalChance = source.stats.critical / 100;
    const isCritical = Math.random() < criticalChance;
    const criticalMultiplier = isCritical ? 2 : 1;
    
    if (isCritical) {
      finalDamage *= criticalMultiplier;
    }
    
    // Apply combat modifiers
    const modifiers = get().getCombatModifiers(source.id);
    modifiers.forEach(modifier => {
      if (modifier.type === 'damage') {
        finalDamage *= (1 + modifier.value / 100);
      }
    });
    
    return {
      baseDamage,
      damageType,
      critical: isCritical,
      criticalMultiplier,
      resistance: target.resistances.includes(damageType) ? 0.5 : 0,
      vulnerability: target.vulnerabilities.includes(damageType) ? 0.5 : 0,
      finalDamage: Math.floor(finalDamage),
      blocked: 0,
      absorbed: 0,
      reflected: 0
    };
  },
  
  // Apply damage
  applyDamage: (entityId, damage) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    // Apply status effect modifiers
    entity.statusEffects.forEach(effect => {
      if (effect.type === 'shield') {
        damage.blocked = Math.min(damage.finalDamage, effect.intensity);
        damage.finalDamage -= damage.blocked;
      }
    });
    
    // Apply damage
    entity.health = Math.max(0, entity.health - damage.finalDamage);
    
    state.updateEntity(entityId, { health: entity.health });
    
    console.log(`${entity.name} takes ${damage.finalDamage} damage (${damage.blocked} blocked)`);
  },
  
  // Apply healing
  applyHealing: (entityId, amount) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    entity.health = Math.min(entity.maxHealth, entity.health + amount);
    state.updateEntity(entityId, { health: entity.health });
    
    console.log(`${entity.name} heals for ${amount} health`);
  },
  
  // Add environmental object
  addEnvironmentalObject: (object) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        environmentalObjects: [...state.combatState.environmentalObjects, object]
      }
    });
  },
  
  // Remove environmental object
  removeEnvironmentalObject: (objectId) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        environmentalObjects: state.combatState.environmentalObjects.filter(o => o.id !== objectId)
      }
    });
  },
  
  // Interact with environment
  interactWithEnvironment: async (entityId, objectId, interaction) => {
    const state = get();
    const entity = state.getEntity(entityId);
    const object = state.combatState.environmentalObjects.find(o => o.id === objectId);
    
    if (!entity || !object) {
      return {
        success: false,
        message: "Invalid interaction"
      };
    }
    
    // Check if interaction is available
    if (!object.interactions.includes(interaction as any)) {
      return {
        success: false,
        message: "Interaction not available"
      };
    }
    
    // Process interaction
    let result: CombatResult = {
      success: true,
      message: `${entity.name} ${interaction}s ${object.name}`
    };
    
    switch (interaction) {
      case 'push':
        // Move object
        object.position[0] += 1;
        break;
      case 'destroy':
        // Destroy object
        state.removeEnvironmentalObject(objectId);
        result.message = `${entity.name} destroys ${object.name}`;
        break;
      case 'activate':
        // Activate object effects
        object.effects.forEach(effect => {
          // Apply environmental effect
          console.log(`Environmental effect: ${effect.name}`);
        });
        break;
    }
    
    return result;
  },
  
  // Check combo
  checkCombo: (entityId, action) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return null;
    
    // Simple combo system - check for consecutive actions
    if (entity.comboCount >= 2) {
      // Return a combo attack
      return {
        id: 'basic-combo',
        name: 'Basic Combo',
        description: 'A powerful combination attack',
        type: 'chain',
        requirements: {
          abilities: [],
          conditions: ['combo_count_2'],
          turns: 1
        },
        effects: {
          damage: {
            baseDamage: 50,
            damageType: 'physical',
            critical: false,
            criticalMultiplier: 1,
            resistance: 0,
            vulnerability: 0,
            finalDamage: 50,
            blocked: 0,
            absorbed: 0,
            reflected: 0
          },
          statusEffects: [],
          environmentalEffects: []
        },
        cooldown: 3,
        energyCost: 20,
        animation: 'combo-attack'
      };
    }
    
    return null;
  },
  
  // Execute combo
  executeCombo: async (entityId, combo, target) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return {
      success: false,
      message: "Cannot execute combo"
    };
    
    // Reset combo count
    entity.comboCount = 0;
    state.updateEntity(entityId, { comboCount: 0 });
    
    // Apply combo effects
    if (target) {
      const targetEntity = state.getEntity(target);
      if (targetEntity) {
        const damage = state.calculateDamage(entity, targetEntity, combo.effects.damage.baseDamage, combo.effects.damage.damageType);
        state.applyDamage(target, damage);
      }
    }
    
    return {
      success: true,
      message: `${entity.name} executes ${combo.name}!`,
      comboTriggered: combo
    };
  },
  
  // Update combo meter
  updateComboMeter: (entityId, amount) => {
    const state = get();
    const entity = state.getEntity(entityId);
    
    if (!entity) return;
    
    entity.comboCount += amount;
    state.updateEntity(entityId, { comboCount: entity.comboCount });
    
    // Update global combo meter
    set({
      combatState: {
        ...state.combatState,
        comboMeter: Math.min(100, state.combatState.comboMeter + amount)
      }
    });
  },
  
  // Add combat modifier
  addCombatModifier: (modifier) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        combatModifiers: [...state.combatState.combatModifiers, modifier]
      }
    });
  },
  
  // Remove combat modifier
  removeCombatModifier: (modifierId) => {
    const state = get();
    set({
      combatState: {
        ...state.combatState,
        combatModifiers: state.combatState.combatModifiers.filter(m => m.id !== modifierId)
      }
    });
  },
  
  // Get combat modifiers
  getCombatModifiers: (entityId) => {
    const state = get();
    return state.combatState.combatModifiers.filter(m => 
      !m.condition || m.condition === entityId
    );
  },
  
  // Next turn
  nextTurn: () => {
    const state = get();
    const currentIndex = state.combatState.turnOrder.indexOf(state.combatState.activeEntity);
    const nextIndex = (currentIndex + 1) % state.combatState.turnOrder.length;
    const nextEntityId = state.combatState.turnOrder[nextIndex];
    
    // Reset entity actions
    state.combatState.entities.forEach(entity => {
      if (entity.id === nextEntityId) {
        entity.hasActed = false;
        entity.hasMoved = false;
      }
    });
    
    set({
      combatState: {
        ...state.combatState,
        activeEntity: nextEntityId,
        turnNumber: nextIndex === 0 ? state.combatState.turnNumber + 1 : state.combatState.turnNumber
      }
    });
  },
  
  // Get current entity
  getCurrentEntity: () => {
    const state = get();
    return state.getEntity(state.combatState.activeEntity);
  },
  
  // Get turn order
  getTurnOrder: () => {
    const state = get();
    return state.combatState.turnOrder.map(id => state.getEntity(id)).filter(Boolean) as CombatEntity[];
  },
  
  // Is combat active
  isCombatActive: () => {
    return get().combatState.isActive;
  },
  
  // Get combat stats
  getCombatStats: () => {
    const state = get();
    return {
      turnNumber: state.combatState.turnNumber,
      activeEntity: state.combatState.activeEntity,
      entitiesCount: state.combatState.entities.length,
      comboMeter: state.combatState.comboMeter,
      environmentalObjects: state.combatState.environmentalObjects.length
    };
  },
  
  // Reset combat
  resetCombat: () => {
    set({
      combatState: defaultCombatState
    });
  },
  
  // Helper methods for processing different actions
  processAttack: async (sourceId, targetId) => {
    const state = get();
    const source = state.getEntity(sourceId);
    const target = state.getEntity(targetId);
    
    if (!source || !target) {
      return { success: false, message: "Invalid target" };
    }
    
    const damage = state.calculateDamage(source, target, 20, 'physical');
    state.applyDamage(targetId, damage);
    
    // Update combo count
    state.updateComboMeter(sourceId, 1);
    
    return {
      success: true,
      damage,
      message: `${source.name} attacks ${target.name} for ${damage.finalDamage} damage`,
      criticalHit: damage.critical
    };
  },
  
  processAbility: async (sourceId, targetId) => {
    // Placeholder for ability processing
    return {
      success: true,
      message: "Ability used"
    };
  },
  
  processMove: async (sourceId, position) => {
    const state = get();
    state.updateEntity(sourceId, { position, hasMoved: true });
    
    return {
      success: true,
      message: "Moved to new position"
    };
  },
  
  processDefend: async (sourceId) => {
    const state = get();
    const entity = state.getEntity(sourceId);
    
    if (!entity) return { success: false, message: "Invalid entity" };
    
    // Apply defensive status effect
    const shieldEffect: StatusEffect = {
      id: `shield_${Date.now()}`,
      type: 'shield',
      name: 'Defensive Stance',
      description: 'Reduces incoming damage',
      duration: 2,
      intensity: 10,
      stackable: false,
      maxStacks: 1,
      currentStacks: 1,
      source: sourceId
    };
    
    state.applyStatusEffect(sourceId, shieldEffect);
    
    return {
      success: true,
      message: `${entity.name} takes a defensive stance`
    };
  },
  
  processItem: async (sourceId, itemId) => {
    // Placeholder for item processing
    return {
      success: true,
      message: "Item used"
    };
  },

  // Get status effects for entity
  getStatusEffects: (entityId: string) => {
    const state = get();
    const entity = state.combatState.entities.find(e => e.id === entityId);
    return entity?.statusEffects || [];
  },

  // Process attack
  processAttack: async (sourceId: string, targetId: string) => {
    const state = get();
    const source = state.getEntity(sourceId);
    const target = state.getEntity(targetId);
    
    if (!source || !target) {
      return { success: false, message: "Invalid entities" };
    }
    
    // Calculate damage
    const damage = state.calculateDamage(source, target, 10, 'physical');
    state.applyDamage(targetId, damage);
    
    return {
      success: true,
      message: `${source.name} attacks ${target.name} for ${damage.total} damage`
    };
  },

  // Process ability
  processAbility: async (sourceId: string, targetId: string) => {
    const state = get();
    const source = state.getEntity(sourceId);
    const target = state.getEntity(targetId);
    
    if (!source || !target) {
      return { success: false, message: "Invalid entities" };
    }
    
    return {
      success: true,
      message: `${source.name} uses ability on ${target.name}`
    };
  },

  // Process move
  processMove: async (sourceId: string, position: [number, number, number]) => {
    const state = get();
    const entity = state.getEntity(sourceId);
    
    if (!entity) {
      return { success: false, message: "Invalid entity" };
    }
    
    state.updateEntity(sourceId, { position });
    
    return {
      success: true,
      message: `${entity.name} moves to new position`
    };
  },

  // Process defend
  processDefend: async (sourceId: string) => {
    const state = get();
    const entity = state.getEntity(sourceId);
    
    if (!entity) {
      return { success: false, message: "Invalid entity" };
    }
    
    return {
      success: true,
      message: `${entity.name} takes a defensive stance`
    };
  }
}));