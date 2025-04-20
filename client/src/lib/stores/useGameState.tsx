import { create } from "zustand";
import { CharacterClass, EchoZoneType, Enemy } from "@shared/types";

// Game phases
export type GamePhase = 'loading' | 'mainMenu' | 'characterSelection' | 'gameplay' | 'dialogue' | 'combat' | 'gameOver';

interface GameState {
  // Game state
  gamePhase: GamePhase;
  setGamePhase: (phase: GamePhase) => void;
  
  // Current location
  currentZone: EchoZoneType | null;
  setCurrentZone: (zone: EchoZoneType) => void;
  
  // Player state
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  
  // Update health/energy
  updateHealth: (amount: number) => void;
  updateEnergy: (amount: number) => void;
  
  // Combat state
  inCombat: boolean;
  currentEnemies: Enemy[];
  startCombat: (enemies: Enemy[]) => void;
  endCombat: () => void;
  
  // Quest/story progress
  echoesCaptured: number;
  incrementEchoesCaptured: () => void;
  storyProgress: number;
  advanceStory: () => void;
  
  // Reset game state
  resetGame: () => void;
}

// Default game state values
const DEFAULT_MAX_HEALTH = 100;
const DEFAULT_MAX_ENERGY = 100;

export const useGameState = create<GameState>((set) => ({
  // Initial game state
  gamePhase: 'loading',
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  currentZone: null,
  setCurrentZone: (zone) => set({ currentZone: zone }),
  
  // Player stats
  health: DEFAULT_MAX_HEALTH,
  maxHealth: DEFAULT_MAX_HEALTH,
  energy: DEFAULT_MAX_ENERGY,
  maxEnergy: DEFAULT_MAX_ENERGY,
  
  // Health and energy update functions
  updateHealth: (amount) => set((state) => ({ 
    health: Math.min(Math.max(state.health + amount, 0), state.maxHealth),
    gamePhase: state.health + amount <= 0 ? 'gameOver' : state.gamePhase
  })),
  
  updateEnergy: (amount) => set((state) => ({ 
    energy: Math.min(Math.max(state.energy + amount, 0), state.maxEnergy) 
  })),
  
  // Combat state
  inCombat: false,
  currentEnemies: [],
  startCombat: (enemies) => set({ 
    inCombat: true, 
    currentEnemies: enemies,
    gamePhase: 'combat'
  }),
  endCombat: () => set({ 
    inCombat: false, 
    currentEnemies: [],
    gamePhase: 'gameplay'
  }),
  
  // Progress tracking
  echoesCaptured: 0,
  incrementEchoesCaptured: () => set((state) => ({ 
    echoesCaptured: state.echoesCaptured + 1 
  })),
  
  storyProgress: 0,
  advanceStory: () => set((state) => ({ 
    storyProgress: state.storyProgress + 1 
  })),
  
  // Reset the game to initial state
  resetGame: () => set({
    gamePhase: 'mainMenu',
    health: DEFAULT_MAX_HEALTH,
    energy: DEFAULT_MAX_ENERGY,
    inCombat: false,
    currentEnemies: [],
    echoesCaptured: 0,
    storyProgress: 0
  })
}));
