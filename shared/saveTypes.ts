// Save system types and interfaces

export type SaveSlot = 1 | 2 | 3 | 4 | 5;

export interface SaveMetadata {
  slot: SaveSlot;
  characterName: string;
  characterClass: string;
  level: number;
  playTime: number; // In seconds
  lastSaved: number; // Timestamp
  currentZone: string;
  storyProgress: number;
  thumbnail?: string; // Base64 encoded thumbnail
}

export interface CharacterSaveData {
  // Character state
  selectedClass: string;
  stats: Record<string, number>;
  level: number;
  experience: number;
  experienceToNext: number;
  skillPoints: number;
  position: [number, number, number];
  abilities: any[];
  activeAbilityIndex: number | null;
  isAlive: boolean;
}

export interface GameStateSaveData {
  // Game state
  gamePhase: string;
  currentZone: string;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  echoesCaptured: number;
  storyProgress: number;
  inCombat: boolean;
  currentEnemies: any[];
}

export interface InventorySaveData {
  // Inventory state
  inventory: any[];
  equippedItems: Record<string, any>;
  gold: number;
  echoes: number;
  knownRecipes: string[];
  craftingMaterials: Record<string, number>;
}

export interface QuestSaveData {
  // Quest state
  questLog: any;
  questChains: any[];
  factions: any[];
  questEvents: any[];
}

export interface SkillSaveData {
  // Skill state
  skillTrees: any[];
  skillCooldowns: any[];
  skillActivations: any[];
  skillExperience: any[];
  skillMastery: any[];
  skillPointHistory: any[];
  availableSkillPoints: number;
}

export interface SettingsSaveData {
  // Game settings
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    isMuted: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high' | 'ultra';
    shadows: boolean;
    particles: boolean;
    antialiasing: boolean;
  };
  controls: {
    keyBindings: Record<string, string[]>;
    mouseSensitivity: number;
    invertY: boolean;
  };
  ui: {
    scale: number;
    showTooltips: boolean;
    showDamageNumbers: boolean;
    showFPS: boolean;
  };
}

export interface GameSaveData {
  // Complete save data
  metadata: SaveMetadata;
  character: CharacterSaveData;
  gameState: GameStateSaveData;
  inventory: InventorySaveData;
  quests: QuestSaveData;
  skills: SkillSaveData;
  settings: SettingsSaveData;
  version: string; // Game version for compatibility
  checksum: string; // For data integrity
}

export interface SaveSlotInfo {
  slot: SaveSlot;
  exists: boolean;
  metadata?: SaveMetadata;
  corrupted?: boolean;
}

export interface SaveSystemState {
  // Save system state
  currentSlot: SaveSlot | null;
  autoSaveEnabled: boolean;
  autoSaveInterval: number; // In seconds
  lastAutoSave: number;
  saveInProgress: boolean;
  loadInProgress: boolean;
}

// Save validation interface
export interface SaveValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  version: string;
  compatibility: 'compatible' | 'incompatible' | 'unknown';
}

// Backup interface
export interface SaveBackup {
  id: string;
  slot: SaveSlot;
  timestamp: number;
  size: number;
  description: string;
  data: GameSaveData;
}

// Cloud save interface
export interface CloudSaveData {
  id: string;
  slot: SaveSlot;
  uploaded: number;
  lastModified: number;
  size: number;
  checksum: string;
  data: GameSaveData;
}

// Save export/import interface
export interface SaveExport {
  version: string;
  timestamp: number;
  data: GameSaveData;
  metadata: {
    gameName: string;
    gameVersion: string;
    platform: string;
  };
}