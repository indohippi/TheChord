import { create } from 'zustand';
import { DialogueSequence, DialogueNode, CharacterRelationship, DialogueFlag, DialogueHistory, DialogueCondition, DialogueEffect } from '@shared/dialogueTypes';
import { useQuest } from './useQuest';
import { useInventory } from './useInventory';
import { useCharacter } from './useCharacter';
import { useSkills } from './useSkills';

interface DialogueState {
  // Current dialogue state
  currentSequence: DialogueSequence | null;
  currentNode: DialogueNode | null;
  isDialogueActive: boolean;
  
  // Character relationships
  relationships: Record<string, CharacterRelationship>;
  
  // Dialogue flags and history
  flags: Record<string, DialogueFlag>;
  history: DialogueHistory[];
  
  // Available sequences
  availableSequences: DialogueSequence[];
  
  // Actions
  startDialogue: (sequenceId: string) => void;
  endDialogue: () => void;
  selectOption: (optionId: string) => void;
  advanceDialogue: (nodeId: string) => void;
  
  // Relationship management
  updateRelationship: (characterId: string, relationship: Partial<CharacterRelationship>) => void;
  getRelationship: (characterId: string) => CharacterRelationship;
  
  // Flag management
  setFlag: (flagId: string, value: any, expiresAt?: Date) => void;
  getFlag: (flagId: string) => any;
  clearFlag: (flagId: string) => void;
  
  // Condition checking
  checkConditions: (conditions: DialogueCondition[]) => boolean;
  
  // Effect application
  applyEffects: (effects: DialogueEffect[]) => void;
  
  // History management
  addToHistory: (sequenceId: string, nodeId: string, playerChoice?: string, outcome?: 'success' | 'failure' | 'neutral') => void;
  getHistory: (sequenceId?: string) => DialogueHistory[];
  
  // Sequence management
  addSequence: (sequence: DialogueSequence) => void;
  removeSequence: (sequenceId: string) => void;
  canStartSequence: (sequenceId: string) => boolean;
}

export const useDialogue = create<DialogueState>((set, get) => ({
  // Initial state
  currentSequence: null,
  currentNode: null,
  isDialogueActive: false,
  relationships: {},
  flags: {},
  history: [],
  availableSequences: [],

  // Start dialogue sequence
  startDialogue: (sequenceId: string) => {
    const state = get();
    const sequence = state.availableSequences.find(s => s.id === sequenceId);
    
    if (!sequence || !state.canStartSequence(sequenceId)) {
      return;
    }

    const startNode = sequence.nodes.find(n => n.id === sequence.startNodeId);
    if (!startNode) {
      return;
    }

    set({
      currentSequence: sequence,
      currentNode: startNode,
      isDialogueActive: true
    });
  },

  // End dialogue
  endDialogue: () => {
    set({
      currentSequence: null,
      currentNode: null,
      isDialogueActive: false
    });
  },

  // Select dialogue option
  selectOption: (optionId: string) => {
    const state = get();
    if (!state.currentNode || !state.currentSequence) return;

    const option = state.currentNode.options?.find(o => o.id === optionId);
    if (!option) return;

    // Check conditions
    if (option.conditions && !state.checkConditions(option.conditions)) {
      return;
    }

    // Apply effects
    if (option.effects) {
      state.applyEffects(option.effects);
    }

    // Add to history
    state.addToHistory(
      state.currentSequence.id,
      state.currentNode.id,
      option.text,
      'success'
    );

    // Move to next node
    state.advanceDialogue(option.nextNodeId);
  },

  // Advance dialogue to next node
  advanceDialogue: (nodeId: string) => {
    const state = get();
    if (!state.currentSequence) return;

    const nextNode = state.currentSequence.nodes.find(n => n.id === nodeId);
    if (!nextNode) {
      state.endDialogue();
      return;
    }

    // Check node conditions
    if (nextNode.conditions && !state.checkConditions(nextNode.conditions)) {
      state.endDialogue();
      return;
    }

    // Apply node effects
    if (nextNode.effects) {
      state.applyEffects(nextNode.effects);
    }

    set({ currentNode: nextNode });
  },

  // Update character relationship
  updateRelationship: (characterId: string, updates: Partial<CharacterRelationship>) => {
    set(state => ({
      relationships: {
        ...state.relationships,
        [characterId]: {
          ...state.relationships[characterId],
          characterId,
          relationship: 'stranger',
          trust: 50,
          respect: 50,
          interactionCount: 0,
          ...state.relationships[characterId],
          ...updates
        }
      }
    }));
  },

  // Get character relationship
  getRelationship: (characterId: string) => {
    const state = get();
    return state.relationships[characterId] || {
      characterId,
      relationship: 'stranger',
      trust: 50,
      respect: 50,
      interactionCount: 0
    };
  },

  // Set dialogue flag
  setFlag: (flagId: string, value: any, expiresAt?: Date) => {
    set(state => ({
      flags: {
        ...state.flags,
        [flagId]: {
          id: flagId,
          value,
          setDate: new Date(),
          expiresAt
        }
      }
    }));
  },

  // Get dialogue flag
  getFlag: (flagId: string) => {
    const state = get();
    const flag = state.flags[flagId];
    
    if (!flag) return null;
    
    // Check if flag has expired
    if (flag.expiresAt && new Date() > flag.expiresAt) {
      state.clearFlag(flagId);
      return null;
    }
    
    return flag.value;
  },

  // Clear dialogue flag
  clearFlag: (flagId: string) => {
    set(state => {
      const newFlags = { ...state.flags };
      delete newFlags[flagId];
      return { flags: newFlags };
    });
  },

  // Check dialogue conditions
  checkConditions: (conditions: DialogueCondition[]) => {
    const state = get();
    
    for (const condition of conditions) {
      let conditionMet = false;
      
      switch (condition.type) {
        case 'quest':
          const questState = useQuest.getState();
          const quest = questState.questLog.find(q => q.id === condition.value);
          if (quest) {
            switch (condition.operator) {
              case 'equals':
                conditionMet = quest.status === condition.value;
                break;
              case 'has':
                conditionMet = quest.status === 'active' || quest.status === 'completed';
                break;
              case 'not_has':
                conditionMet = quest.status === 'available' || quest.status === 'failed';
                break;
            }
          }
          break;
          
        case 'item':
          const inventoryState = useInventory.getState();
          const hasItem = inventoryState.items.some(item => item.id === condition.value);
          conditionMet = condition.operator === 'has' ? hasItem : !hasItem;
          break;
          
        case 'skill':
          const skillsState = useSkills.getState();
          const skillLevel = skillsState.getLearnedSkills().filter(s => s.id === condition.value).length;
          switch (condition.operator) {
            case 'greater':
              conditionMet = skillLevel > (condition.value as number);
              break;
            case 'less':
              conditionMet = skillLevel < (condition.value as number);
              break;
            case 'equals':
              conditionMet = skillLevel === condition.value;
              break;
          }
          break;
          
        case 'relationship':
          const relationship = state.getRelationship(condition.value as string);
          switch (condition.operator) {
            case 'greater':
              conditionMet = relationship.trust > (condition.value as number);
              break;
            case 'less':
              conditionMet = relationship.trust < (condition.value as number);
              break;
            case 'equals':
              conditionMet = relationship.relationship === condition.value;
              break;
          }
          break;
          
        case 'flag':
          const flagValue = state.getFlag(condition.value as string);
          conditionMet = condition.operator === 'has' ? flagValue !== null : flagValue === null;
          break;
          
        case 'level':
          const characterState = useCharacter.getState();
          switch (condition.operator) {
            case 'greater':
              conditionMet = characterState.level > (condition.value as number);
              break;
            case 'less':
              conditionMet = characterState.level < (condition.value as number);
              break;
            case 'equals':
              conditionMet = characterState.level === condition.value;
              break;
          }
          break;
      }
      
      if (!conditionMet) {
        return false;
      }
    }
    
    return true;
  },

  // Apply dialogue effects
  applyEffects: (effects: DialogueEffect[]) => {
    const state = get();
    
    for (const effect of effects) {
      switch (effect.type) {
        case 'quest':
          const questState = useQuest.getState();
          if (effect.operation === 'start') {
            questState.startQuest(effect.value as string);
          } else if (effect.operation === 'complete') {
            questState.completeQuest(effect.value as string);
          } else if (effect.operation === 'fail') {
            questState.failQuest(effect.value as string);
          }
          break;
          
        case 'item':
          const inventoryState = useInventory.getState();
          if (effect.operation === 'add') {
            inventoryState.addItem(effect.value as string, 1);
          } else if (effect.operation === 'remove') {
            inventoryState.removeItem(effect.value as string, 1);
          }
          break;
          
        case 'relationship':
          const relationship = state.getRelationship(effect.value as string);
          if (effect.operation === 'add') {
            state.updateRelationship(effect.value as string, {
              trust: Math.min(100, relationship.trust + (effect.value as number)),
              interactionCount: relationship.interactionCount + 1
            });
          }
          break;
          
        case 'flag':
          if (effect.operation === 'set') {
            state.setFlag(effect.value as string, true);
          } else if (effect.operation === 'remove') {
            state.clearFlag(effect.value as string);
          }
          break;
          
        case 'experience':
          const characterState = useCharacter.getState();
          if (effect.operation === 'add') {
            characterState.addExperience(effect.value as number);
          }
          break;
          
        case 'gold':
          const inventoryState2 = useInventory.getState();
          if (effect.operation === 'add') {
            inventoryState2.addGold(effect.value as number);
          }
          break;
          
        case 'echoes':
          const inventoryState3 = useInventory.getState();
          if (effect.operation === 'add') {
            inventoryState3.addEchoes(effect.value as number);
          }
          break;
      }
    }
  },

  // Add to dialogue history
  addToHistory: (sequenceId: string, nodeId: string, playerChoice?: string, outcome?: 'success' | 'failure' | 'neutral') => {
    set(state => ({
      history: [
        ...state.history,
        {
          sequenceId,
          nodeId,
          timestamp: new Date(),
          playerChoice,
          outcome
        }
      ]
    }));
  },

  // Get dialogue history
  getHistory: (sequenceId?: string) => {
    const state = get();
    if (sequenceId) {
      return state.history.filter(h => h.sequenceId === sequenceId);
    }
    return state.history;
  },

  // Add dialogue sequence
  addSequence: (sequence: DialogueSequence) => {
    set(state => ({
      availableSequences: [...state.availableSequences, sequence]
    }));
  },

  // Remove dialogue sequence
  removeSequence: (sequenceId: string) => {
    set(state => ({
      availableSequences: state.availableSequences.filter(s => s.id !== sequenceId)
    }));
  },

  // Check if sequence can be started
  canStartSequence: (sequenceId: string) => {
    const state = get();
    const sequence = state.availableSequences.find(s => s.id === sequenceId);
    
    if (!sequence) return false;
    
    // Check cooldown
    if (sequence.cooldown) {
      const lastInteraction = state.getHistory(sequenceId).pop();
      if (lastInteraction) {
        const timeSinceLastInteraction = Date.now() - lastInteraction.timestamp.getTime();
        if (timeSinceLastInteraction < sequence.cooldown * 60 * 1000) {
          return false;
        }
      }
    }
    
    // Check if not repeatable and already completed
    if (!sequence.isRepeatable) {
      const hasCompleted = state.getHistory(sequenceId).some(h => h.outcome === 'success');
      if (hasCompleted) return false;
    }
    
    return true;
  }
}));