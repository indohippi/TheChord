import { create } from "zustand";
import { CharacterClass, CharacterStats } from "@shared/types";

interface CharacterState {
  // Character selection
  selectedClass: CharacterClass | null;
  setSelectedClass: (characterClass: CharacterClass) => void;
  
  // Character stats
  stats: CharacterStats;
  setStats: (stats: CharacterStats) => void;
  updateStat: (stat: keyof CharacterStats, amount: number) => void;
  
  // Character progression
  level: number;
  experience: number;
  experienceToNext: number;
  skillPoints: number;
  
  // Level up
  levelUp: () => void;
  addExperience: (amount: number) => void;
  spendSkillPoint: (stat: keyof CharacterStats) => boolean;
  
  // Character position and state
  position: [number, number, number];
  setPosition: (position: [number, number, number]) => void;
  updatePosition: (position: [number, number, number]) => void;
  
  // Character facing and movement
  facing: number;
  setFacing: (facing: number) => void;
  isMoving: boolean;
  setIsMoving: (moving: boolean) => void;
  
  // Abilities
  abilities: any[];
  activeAbilityIndex: number | null;
  setActiveAbilityIndex: (index: number | null) => void;
  useAbility: (abilityIndex: number) => void;
  
  // Character status
  isAlive: boolean;
  setAlive: (alive: boolean) => void;
  
  // Reset character
  resetCharacter: () => void;
}

// Base stats for each character class
const BASE_STATS: Record<CharacterClass, CharacterStats> = {
  CovenantWeaver: { strength: 6, wisdom: 14, agility: 8, willpower: 12, harmony: 10 },
  PhilosopherKing: { strength: 8, wisdom: 12, agility: 7, willpower: 13, harmony: 10 },
  ChakravartiAvatar: { strength: 14, wisdom: 8, agility: 10, willpower: 8, harmony: 10 },
  SerpentsWhisper: { strength: 7, wisdom: 13, agility: 12, willpower: 9, harmony: 9 },
  JadeDragon: { strength: 10, wisdom: 10, agility: 12, willpower: 9, harmony: 14 }
};

// Calculate experience needed for next level
const calculateExperienceToNext = (level: number): number => {
  return Math.floor(100 * Math.pow(1.2, level - 1));
};

export const useCharacter = create<CharacterState>((set, get) => ({
  // Initial state
  selectedClass: null,
  stats: { strength: 0, wisdom: 0, agility: 0, willpower: 0, harmony: 0 },
  
  level: 1,
  experience: 0,
  experienceToNext: calculateExperienceToNext(1),
  skillPoints: 0,
  
  position: [0, 0, 0],
  facing: 0,
  isMoving: false,
  abilities: [],
  activeAbilityIndex: null,
  
  isAlive: true,
  
  // Set selected character class
  setSelectedClass: (characterClass) => {
    const baseStats = BASE_STATS[characterClass];
    set({
      selectedClass: characterClass,
      stats: { ...baseStats },
      level: 1,
      experience: 0,
      experienceToNext: calculateExperienceToNext(1),
      skillPoints: 0,
      position: [0, 0, 0],
      abilities: [], // This would be populated from character data
      activeAbilityIndex: null,
      isAlive: true
    });
  },
  
  // Set stats directly
  setStats: (stats) => set({ stats }),
  
  // Update a specific stat
  updateStat: (stat, amount) => {
    set(state => ({
      stats: {
        ...state.stats,
        [stat]: Math.max(0, state.stats[stat] + amount)
      }
    }));
  },
  
  // Add experience
  addExperience: (amount) => {
    set(state => {
      const newExperience = state.experience + amount;
      let newLevel = state.level;
      let newExperienceToNext = state.experienceToNext;
      let newSkillPoints = state.skillPoints;
      
      // Check for level ups
      while (newExperience >= newExperienceToNext) {
        newExperience -= newExperienceToNext;
        newLevel++;
        newSkillPoints += 2; // 2 skill points per level
        newExperienceToNext = calculateExperienceToNext(newLevel);
      }
      
      return {
        experience: newExperience,
        level: newLevel,
        experienceToNext: newExperienceToNext,
        skillPoints: newSkillPoints
      };
    });
  },
  
  // Level up manually (for testing)
  levelUp: () => {
    set(state => {
      const newLevel = state.level + 1;
      return {
        level: newLevel,
        experience: 0,
        experienceToNext: calculateExperienceToNext(newLevel),
        skillPoints: state.skillPoints + 2
      };
    });
  },
  
  // Spend skill point
  spendSkillPoint: (stat) => {
    const state = get();
    if (state.skillPoints > 0) {
      set({
        skillPoints: state.skillPoints - 1,
        stats: {
          ...state.stats,
          [stat]: state.stats[stat] + 1
        }
      });
      return true;
    }
    return false;
  },
  
  // Set position
  setPosition: (position) => set({ position }),
  
  // Set active ability index
  setActiveAbilityIndex: (index) => set({ activeAbilityIndex: index }),
  
  // Set alive status
  setAlive: (alive) => set({ isAlive: alive }),
  
  // Update position
  updatePosition: (newPosition: [number, number, number]) => {
    set({ position: newPosition });
  },

  // Set facing
  setFacing: (facing: number) => {
    set({ facing });
  },

  // Set moving state
  setIsMoving: (moving: boolean) => {
    set({ isMoving: moving });
  },

  // Use ability
  useAbility: (abilityIndex: number) => {
    const state = get();
    if (abilityIndex >= 0 && abilityIndex < state.abilities.length) {
      set({ activeAbilityIndex: abilityIndex });
      // Additional ability logic can be added here
    }
  },

  // Reset character
  resetCharacter: () => {
    set({
      selectedClass: null,
      stats: { strength: 0, wisdom: 0, agility: 0, willpower: 0, harmony: 0 },
      level: 1,
      experience: 0,
      experienceToNext: calculateExperienceToNext(1),
      skillPoints: 0,
      position: [0, 0, 0],
      facing: 0,
      isMoving: false,
      abilities: [],
      activeAbilityIndex: null,
      isAlive: true
    });
  }
}));