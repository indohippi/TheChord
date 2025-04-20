import { create } from "zustand";
import { CharacterClass, CharacterStats, Ability } from "@shared/types";
import { characters } from "@/game/data/characters";

interface CharacterState {
  // Selected character class
  selectedClass: CharacterClass | null;
  setSelectedClass: (characterClass: CharacterClass) => void;
  
  // Character stats
  stats: CharacterStats;
  updateStat: (statName: keyof CharacterStats, amount: number) => void;
  
  // Character abilities
  abilities: Ability[];
  
  // Active ability
  activeAbilityIndex: number | null;
  setActiveAbilityIndex: (index: number | null) => void;
  
  // Use ability
  useAbility: (abilityIndex: number) => boolean;
  
  // Check if character has enough energy for ability
  hasEnoughEnergyForAbility: (abilityIndex: number) => boolean;
  
  // Position and movement
  position: [number, number, number];
  setPosition: (position: [number, number, number]) => void;
  
  // Player movement direction (for rendering)
  facing: 'north' | 'east' | 'south' | 'west';
  setFacing: (direction: 'north' | 'east' | 'south' | 'west') => void;
  
  // Movement animation
  isMoving: boolean;
  setIsMoving: (moving: boolean) => void;
}

export const useCharacter = create<CharacterState>((set, get) => ({
  // Initially no character is selected
  selectedClass: null,
  setSelectedClass: (characterClass) => {
    const characterData = characters.find(c => c.class === characterClass);
    if (characterData) {
      set({
        selectedClass: characterClass,
        stats: { ...characterData.baseStats },
        abilities: [...characterData.abilities],
        activeAbilityIndex: null,
      });
      console.log("Character selected:", characterClass);
    }
  },
  
  // Default stats (will be overridden when character is selected)
  stats: {
    strength: 10,
    wisdom: 10,
    agility: 10,
    willpower: 10,
    harmony: 10
  },
  
  updateStat: (statName, amount) => set((state) => ({
    stats: {
      ...state.stats,
      [statName]: Math.max(0, state.stats[statName] + amount)
    }
  })),
  
  // Abilities (will be populated when character is selected)
  abilities: [],
  
  // Active ability tracking
  activeAbilityIndex: null,
  setActiveAbilityIndex: (index) => set({ activeAbilityIndex: index }),
  
  // Ability usage logic
  useAbility: (abilityIndex) => {
    const { abilities } = get();
    if (abilityIndex >= 0 && abilityIndex < abilities.length) {
      const ability = abilities[abilityIndex];
      // In a real game, we'd check energy cost, cooldowns, etc.
      set({ activeAbilityIndex: abilityIndex });
      console.log(`Using ability: ${ability.name}`);
      return true;
    }
    return false;
  },
  
  // Check energy requirements
  hasEnoughEnergyForAbility: (abilityIndex) => {
    const { abilities } = get();
    if (abilityIndex >= 0 && abilityIndex < abilities.length) {
      // In a real game, we'd compare current energy to ability cost
      return true;
    }
    return false;
  },
  
  // Character position in 3D space [x, y, z]
  position: [0, 0, 0],
  setPosition: (position) => set({ position }),
  
  // Character orientation
  facing: 'south',
  setFacing: (direction) => set({ facing: direction }),
  
  // Animation state
  isMoving: false,
  setIsMoving: (moving) => set({ isMoving: moving }),
}));
