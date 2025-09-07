import { create } from "zustand";
import { 
  SaveSlot, 
  SaveMetadata, 
  GameSaveData, 
  SaveSlotInfo, 
  SaveSystemState,
  SaveValidation,
  SaveBackup,
  CloudSaveData
} from "@shared/saveTypes";

interface SaveSystemState {
  // Save system state
  saveSystemState: SaveSystemState;
  
  // Save slots
  saveSlots: SaveSlotInfo[];
  
  // Current save data
  currentSaveData: GameSaveData | null;
  
  // Actions
  saveGame: (slot: SaveSlot, characterName?: string) => Promise<boolean>;
  loadGame: (slot: SaveSlot) => Promise<boolean>;
  deleteSave: (slot: SaveSlot) => Promise<boolean>;
  
  // Save management
  getSaveSlots: () => SaveSlotInfo[];
  getSaveMetadata: (slot: SaveSlot) => SaveMetadata | null;
  validateSave: (data: GameSaveData) => SaveValidation;
  
  // Auto-save
  enableAutoSave: (enabled: boolean) => void;
  setAutoSaveInterval: (interval: number) => void;
  performAutoSave: () => Promise<boolean>;
  
  // Backup system
  createBackup: (slot: SaveSlot, description?: string) => Promise<boolean>;
  restoreBackup: (backupId: string) => Promise<boolean>;
  getBackups: (slot: SaveSlot) => SaveBackup[];
  deleteBackup: (backupId: string) => Promise<boolean>;
  
  // Cloud save (placeholder for future implementation)
  uploadToCloud: (slot: SaveSlot) => Promise<boolean>;
  downloadFromCloud: (slot: SaveSlot) => Promise<boolean>;
  getCloudSaves: () => CloudSaveData[];
  
  // Export/Import
  exportSave: (slot: SaveSlot) => Promise<string>;
  importSave: (saveData: string) => Promise<boolean>;
  
  // Utility
  initializeSaveSystem: () => Promise<void>;
  clearAllSaves: () => Promise<void>;
  getSaveSize: (slot: SaveSlot) => number;
  isSaveCorrupted: (slot: SaveSlot) => boolean;
}

// Game version for compatibility checking
const GAME_VERSION = "1.0.0";

// Storage keys
const SAVE_PREFIX = "echoes_save_";
const BACKUP_PREFIX = "echoes_backup_";
const SETTINGS_KEY = "echoes_settings";

export const useSaveSystem = create<SaveSystemState>((set, get) => ({
  // Initial state
  saveSystemState: {
    currentSlot: null,
    autoSaveEnabled: true,
    autoSaveInterval: 300, // 5 minutes
    lastAutoSave: 0,
    saveInProgress: false,
    loadInProgress: false
  },
  saveSlots: [],
  currentSaveData: null,
  
  // Save game
  saveGame: async (slot, characterName) => {
    const state = get();
    
    if (state.saveSystemState.saveInProgress) {
      console.log("Save already in progress");
      return false;
    }
    
    set({
      saveSystemState: {
        ...state.saveSystemState,
        saveInProgress: true
      }
    });
    
    try {
      // Collect data from all stores
      const saveData = await state.collectSaveData(slot, characterName);
      
      // Validate save data
      const validation = state.validateSave(saveData);
      if (!validation.isValid) {
        console.error("Save validation failed:", validation.errors);
        return false;
      }
      
      // Save to localStorage
      const saveKey = `${SAVE_PREFIX}${slot}`;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // Update save slots
      const updatedSlots = state.saveSlots.map(s => 
        s.slot === slot 
          ? { ...s, exists: true, metadata: saveData.metadata, corrupted: false }
          : s
      );
      
      set({
        saveSlots: updatedSlots,
        currentSaveData: saveData,
        saveSystemState: {
          ...state.saveSystemState,
          currentSlot: slot,
          saveInProgress: false,
          lastAutoSave: Date.now()
        }
      });
      
      console.log(`Game saved to slot ${slot}`);
      return true;
      
    } catch (error) {
      console.error("Save failed:", error);
      set({
        saveSystemState: {
          ...state.saveSystemState,
          saveInProgress: false
        }
      });
      return false;
    }
  },
  
  // Load game
  loadGame: async (slot) => {
    const state = get();
    
    if (state.saveSystemState.loadInProgress) {
      console.log("Load already in progress");
      return false;
    }
    
    set({
      saveSystemState: {
        ...state.saveSystemState,
        loadInProgress: true
      }
    });
    
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (!saveDataString) {
        console.log(`No save data found in slot ${slot}`);
        return false;
      }
      
      const saveData: GameSaveData = JSON.parse(saveDataString);
      
      // Validate save data
      const validation = state.validateSave(saveData);
      if (!validation.isValid) {
        console.error("Load validation failed:", validation.errors);
        set({
          saveSystemState: {
            ...state.saveSystemState,
            loadInProgress: false
          }
        });
        return false;
      }
      
      // Restore data to all stores
      await state.restoreSaveData(saveData);
      
      set({
        currentSaveData: saveData,
        saveSystemState: {
          ...state.saveSystemState,
          currentSlot: slot,
          loadInProgress: false
        }
      });
      
      console.log(`Game loaded from slot ${slot}`);
      return true;
      
    } catch (error) {
      console.error("Load failed:", error);
      set({
        saveSystemState: {
          ...state.saveSystemState,
          loadInProgress: false
        }
      });
      return false;
    }
  },
  
  // Delete save
  deleteSave: async (slot) => {
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      localStorage.removeItem(saveKey);
      
      const state = get();
      const updatedSlots = state.saveSlots.map(s => 
        s.slot === slot 
          ? { ...s, exists: false, metadata: undefined, corrupted: false }
          : s
      );
      
      set({ saveSlots: updatedSlots });
      
      console.log(`Save deleted from slot ${slot}`);
      return true;
      
    } catch (error) {
      console.error("Delete save failed:", error);
      return false;
    }
  },
  
  // Get save slots
  getSaveSlots: () => {
    const state = get();
    return state.saveSlots;
  },
  
  // Get save metadata
  getSaveMetadata: (slot) => {
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (!saveDataString) return null;
      
      const saveData: GameSaveData = JSON.parse(saveDataString);
      return saveData.metadata;
      
    } catch (error) {
      console.error("Failed to get save metadata:", error);
      return null;
    }
  },
  
  // Validate save
  validateSave: (data) => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required fields
    if (!data.metadata) errors.push("Missing metadata");
    if (!data.character) errors.push("Missing character data");
    if (!data.gameState) errors.push("Missing game state");
    if (!data.inventory) errors.push("Missing inventory data");
    if (!data.quests) errors.push("Missing quest data");
    if (!data.skills) errors.push("Missing skill data");
    if (!data.settings) errors.push("Missing settings data");
    
    // Check version compatibility
    let compatibility: 'compatible' | 'incompatible' | 'unknown' = 'unknown';
    if (data.version) {
      if (data.version === GAME_VERSION) {
        compatibility = 'compatible';
      } else {
        compatibility = 'incompatible';
        warnings.push(`Save version ${data.version} may not be compatible with current version ${GAME_VERSION}`);
      }
    }
    
    // Check data integrity
    if (data.checksum) {
      // This would implement actual checksum validation
      // For now, we'll just check if it exists
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      version: data.version || 'unknown',
      compatibility
    };
  },
  
  // Enable auto-save
  enableAutoSave: (enabled) => {
    set(state => ({
      saveSystemState: {
        ...state.saveSystemState,
        autoSaveEnabled: enabled
      }
    }));
  },
  
  // Set auto-save interval
  setAutoSaveInterval: (interval) => {
    set(state => ({
      saveSystemState: {
        ...state.saveSystemState,
        autoSaveInterval: interval
      }
    }));
  },
  
  // Perform auto-save
  performAutoSave: async () => {
    const state = get();
    
    if (!state.saveSystemState.autoSaveEnabled) return false;
    if (!state.saveSystemState.currentSlot) return false;
    
    const now = Date.now();
    const timeSinceLastSave = now - state.saveSystemState.lastAutoSave;
    
    if (timeSinceLastSave < state.saveSystemState.autoSaveInterval * 1000) {
      return false;
    }
    
    return await state.saveGame(state.saveSystemState.currentSlot);
  },
  
  // Create backup
  createBackup: async (slot, description) => {
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (!saveDataString) return false;
      
      const saveData: GameSaveData = JSON.parse(saveDataString);
      const backupId = `backup_${slot}_${Date.now()}`;
      
      const backup: SaveBackup = {
        id: backupId,
        slot,
        timestamp: Date.now(),
        size: saveDataString.length,
        description: description || `Backup of slot ${slot}`,
        data: saveData
      };
      
      const backupKey = `${BACKUP_PREFIX}${backupId}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));
      
      console.log(`Backup created: ${backupId}`);
      return true;
      
    } catch (error) {
      console.error("Create backup failed:", error);
      return false;
    }
  },
  
  // Restore backup
  restoreBackup: async (backupId) => {
    try {
      const backupKey = `${BACKUP_PREFIX}${backupId}`;
      const backupString = localStorage.getItem(backupKey);
      
      if (!backupString) return false;
      
      const backup: SaveBackup = JSON.parse(backupString);
      
      // Restore the backup data
      const saveKey = `${SAVE_PREFIX}${backup.slot}`;
      localStorage.setItem(saveKey, JSON.stringify(backup.data));
      
      // Update save slots
      const state = get();
      const updatedSlots = state.saveSlots.map(s => 
        s.slot === backup.slot 
          ? { ...s, exists: true, metadata: backup.data.metadata, corrupted: false }
          : s
      );
      
      set({ saveSlots: updatedSlots });
      
      console.log(`Backup restored: ${backupId}`);
      return true;
      
    } catch (error) {
      console.error("Restore backup failed:", error);
      return false;
    }
  },
  
  // Get backups
  getBackups: (slot) => {
    const backups: SaveBackup[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${BACKUP_PREFIX}backup_${slot}_`)) {
        try {
          const backupString = localStorage.getItem(key);
          if (backupString) {
            const backup: SaveBackup = JSON.parse(backupString);
            backups.push(backup);
          }
        } catch (error) {
          console.error("Failed to parse backup:", error);
        }
      }
    }
    
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  },
  
  // Delete backup
  deleteBackup: async (backupId) => {
    try {
      const backupKey = `${BACKUP_PREFIX}${backupId}`;
      localStorage.removeItem(backupKey);
      
      console.log(`Backup deleted: ${backupId}`);
      return true;
      
    } catch (error) {
      console.error("Delete backup failed:", error);
      return false;
    }
  },
  
  // Upload to cloud (placeholder)
  uploadToCloud: async (slot) => {
    // This would implement actual cloud save functionality
    console.log(`Upload to cloud not implemented for slot ${slot}`);
    return false;
  },
  
  // Download from cloud (placeholder)
  downloadFromCloud: async (slot) => {
    // This would implement actual cloud save functionality
    console.log(`Download from cloud not implemented for slot ${slot}`);
    return false;
  },
  
  // Get cloud saves (placeholder)
  getCloudSaves: () => {
    // This would return actual cloud save data
    return [];
  },
  
  // Export save
  exportSave: async (slot) => {
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (!saveDataString) throw new Error("No save data found");
      
      const saveData: GameSaveData = JSON.parse(saveDataString);
      
      const exportData = {
        version: GAME_VERSION,
        timestamp: Date.now(),
        data: saveData,
        metadata: {
          gameName: "The Echoes of Creation",
          gameVersion: GAME_VERSION,
          platform: "web"
        }
      };
      
      return JSON.stringify(exportData, null, 2);
      
    } catch (error) {
      console.error("Export save failed:", error);
      throw error;
    }
  },
  
  // Import save
  importSave: async (saveDataString) => {
    try {
      const exportData = JSON.parse(saveDataString);
      
      if (!exportData.data) throw new Error("Invalid save data format");
      
      const saveData: GameSaveData = exportData.data;
      
      // Validate the imported save
      const state = get();
      const validation = state.validateSave(saveData);
      if (!validation.isValid) {
        throw new Error(`Save validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Find an empty slot
      let targetSlot: SaveSlot = 1;
      for (let i = 1; i <= 5; i++) {
        const slotInfo = state.saveSlots.find(s => s.slot === i);
        if (!slotInfo || !slotInfo.exists) {
          targetSlot = i as SaveSlot;
          break;
        }
      }
      
      // Save the imported data
      const saveKey = `${SAVE_PREFIX}${targetSlot}`;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // Update save slots
      const updatedSlots = state.saveSlots.map(s => 
        s.slot === targetSlot 
          ? { ...s, exists: true, metadata: saveData.metadata, corrupted: false }
          : s
      );
      
      set({ saveSlots: updatedSlots });
      
      console.log(`Save imported to slot ${targetSlot}`);
      return true;
      
    } catch (error) {
      console.error("Import save failed:", error);
      return false;
    }
  },
  
  // Initialize save system
  initializeSaveSystem: async () => {
    const saveSlots: SaveSlotInfo[] = [];
    
    // Check all save slots
    for (let i = 1; i <= 5; i++) {
      const slot = i as SaveSlot;
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      
      if (saveDataString) {
        try {
          const saveData: GameSaveData = JSON.parse(saveDataString);
          saveSlots.push({
            slot,
            exists: true,
            metadata: saveData.metadata,
            corrupted: false
          });
        } catch (error) {
          saveSlots.push({
            slot,
            exists: true,
            corrupted: true
          });
        }
      } else {
        saveSlots.push({
          slot,
          exists: false
        });
      }
    }
    
    set({ saveSlots });
    
    // Start auto-save timer
    const state = get();
    if (state.saveSystemState.autoSaveEnabled) {
      setInterval(() => {
        state.performAutoSave();
      }, 60000); // Check every minute
    }
    
    console.log("Save system initialized");
  },
  
  // Clear all saves
  clearAllSaves: async () => {
    try {
      // Clear all save slots
      for (let i = 1; i <= 5; i++) {
        const saveKey = `${SAVE_PREFIX}${i}`;
        localStorage.removeItem(saveKey);
      }
      
      // Clear all backups
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(BACKUP_PREFIX)) {
          localStorage.removeItem(key);
        }
      }
      
      // Reset save system state
      set({
        saveSlots: Array.from({ length: 5 }, (_, i) => ({
          slot: (i + 1) as SaveSlot,
          exists: false
        })),
        currentSaveData: null,
        saveSystemState: {
          currentSlot: null,
          autoSaveEnabled: true,
          autoSaveInterval: 300,
          lastAutoSave: 0,
          saveInProgress: false,
          loadInProgress: false
        }
      });
      
      console.log("All saves cleared");
      return true;
      
    } catch (error) {
      console.error("Clear all saves failed:", error);
      return false;
    }
  },
  
  // Get save size
  getSaveSize: (slot) => {
    try {
      const saveKey = `${SAVE_PREFIX}${slot}`;
      const saveDataString = localStorage.getItem(saveKey);
      return saveDataString ? saveDataString.length : 0;
    } catch (error) {
      return 0;
    }
  },
  
  // Check if save is corrupted
  isSaveCorrupted: (slot) => {
    const slotInfo = get().saveSlots.find(s => s.slot === slot);
    return slotInfo?.corrupted || false;
  },
  
  // Helper function to collect save data from all stores
  collectSaveData: async (slot, characterName) => {
    // This would collect data from all the Zustand stores
    // For now, we'll return a placeholder structure
    const now = Date.now();
    
    return {
      metadata: {
        slot,
        characterName: characterName || "Unknown",
        characterClass: "Unknown",
        level: 1,
        playTime: 0,
        lastSaved: now,
        currentZone: "azure-labyrinth",
        storyProgress: 0
      },
      character: {
        selectedClass: "Unknown",
        stats: {},
        level: 1,
        experience: 0,
        experienceToNext: 100,
        skillPoints: 0,
        position: [0, 0, 0],
        abilities: [],
        activeAbilityIndex: null,
        isAlive: true
      },
      gameState: {
        gamePhase: "gameplay",
        currentZone: "azure-labyrinth",
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        echoesCaptured: 0,
        storyProgress: 0,
        inCombat: false,
        currentEnemies: []
      },
      inventory: {
        inventory: [],
        equippedItems: {},
        gold: 100,
        echoes: 0,
        knownRecipes: [],
        craftingMaterials: {}
      },
      quests: {
        questLog: {},
        questChains: [],
        factions: [],
        questEvents: []
      },
      skills: {
        skillTrees: [],
        skillCooldowns: [],
        skillActivations: [],
        skillExperience: [],
        skillMastery: [],
        skillPointHistory: [],
        availableSkillPoints: 0
      },
      settings: {
        audio: {
          masterVolume: 1.0,
          musicVolume: 0.8,
          sfxVolume: 0.8,
          isMuted: false
        },
        graphics: {
          quality: 'medium',
          shadows: true,
          particles: true,
          antialiasing: true
        },
        controls: {
          keyBindings: {},
          mouseSensitivity: 1.0,
          invertY: false
        },
        ui: {
          scale: 1.0,
          showTooltips: true,
          showDamageNumbers: true,
          showFPS: false
        }
      },
      version: GAME_VERSION,
      checksum: "placeholder_checksum"
    };
  },
  
  // Helper function to restore save data to all stores
  restoreSaveData: async (saveData) => {
    // This would restore data to all the Zustand stores
    // For now, we'll just log the restoration
    console.log("Restoring save data:", saveData.metadata);
  }
}));