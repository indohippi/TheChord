import { create } from 'zustand';
import { 
  CraftingMaterial, 
  CraftingRecipe, 
  CraftingStation, 
  CraftingSkill, 
  CraftingSession, 
  CraftingQueue, 
  CraftingDiscovery, 
  CraftingMarket 
} from '@shared/craftingTypes';

interface CraftingStore {
  // Materials
  materials: CraftingMaterial[];
  playerMaterials: Record<string, number>;
  
  // Recipes
  recipes: CraftingRecipe[];
  knownRecipes: string[];
  discoveredRecipes: string[];
  
  // Stations
  stations: CraftingStation[];
  unlockedStations: string[];
  
  // Skills
  skills: CraftingSkill[];
  
  // Active sessions
  activeSessions: CraftingSession[];
  craftingQueue: CraftingQueue | null;
  
  // Discoveries
  discoveries: CraftingDiscovery[];
  
  // Market
  markets: CraftingMarket[];
  
  // Actions
  addMaterial: (material: CraftingMaterial) => void;
  removeMaterial: (materialId: string) => void;
  addPlayerMaterial: (materialId: string, quantity: number) => void;
  removePlayerMaterial: (materialId: string, quantity: number) => void;
  getPlayerMaterialCount: (materialId: string) => number;
  
  // Recipe management
  addRecipe: (recipe: CraftingRecipe) => void;
  learnRecipe: (recipeId: string) => void;
  discoverRecipe: (recipeId: string, method: string, materialsUsed: any[]) => void;
  canCraftRecipe: (recipeId: string) => boolean;
  getRecipe: (recipeId: string) => CraftingRecipe | null;
  
  // Station management
  addStation: (station: CraftingStation) => void;
  unlockStation: (stationId: string) => void;
  upgradeStation: (stationId: string, upgradeLevel: number) => void;
  getStation: (stationId: string) => CraftingStation | null;
  
  // Skill management
  addSkill: (skill: CraftingSkill) => void;
  updateSkillExperience: (skillId: string, experience: number) => void;
  levelUpSkill: (skillId: string) => void;
  getSkill: (skillId: string) => CraftingSkill | null;
  
  // Crafting operations
  startCrafting: (recipeId: string, stationId: string, quantity: number) => void;
  cancelCrafting: (sessionId: string) => void;
  completeCrafting: (sessionId: string) => void;
  updateCraftingProgress: (sessionId: string, progress: number) => void;
  
  // Queue management
  addToQueue: (recipeId: string, quantity: number, priority: number) => void;
  removeFromQueue: (index: number) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  processQueue: () => void;
  
  // Discovery system
  attemptDiscovery: (materials: any[], stationId: string) => void;
  shareDiscovery: (discoveryId: string, playerIds: string[]) => void;
  
  // Market operations
  listItem: (itemId: string, quantity: number, pricePerUnit: number, marketId: string) => void;
  listMaterial: (materialId: string, quantity: number, pricePerUnit: number, marketId: string) => void;
  buyItem: (listingId: string, quantity: number) => void;
  buyMaterial: (listingId: string, quantity: number) => void;
  cancelListing: (listingId: string) => void;
  
  // Utilities
  getMaterialsByType: (type: string) => CraftingMaterial[];
  getRecipesByCategory: (category: string) => CraftingRecipe[];
  getStationsByType: (type: string) => CraftingStation[];
  calculateCraftingTime: (recipeId: string, stationId: string) => number;
  calculateSuccessRate: (recipeId: string, skillId: string, stationId: string) => number;
  getCraftingCost: (recipeId: string) => { gold: number; materials: any[] };
}

export const useCrafting = create<CraftingStore>((set, get) => ({
  // Initial state
  materials: [],
  playerMaterials: {},
  recipes: [],
  knownRecipes: [],
  discoveredRecipes: [],
  stations: [],
  unlockedStations: [],
  skills: [],
  activeSessions: [],
  craftingQueue: null,
  discoveries: [],
  markets: [],

  // Add material
  addMaterial: (material: CraftingMaterial) => {
    set(state => ({
      materials: [...state.materials.filter(m => m.id !== material.id), material]
    }));
  },

  // Remove material
  removeMaterial: (materialId: string) => {
    set(state => ({
      materials: state.materials.filter(m => m.id !== materialId)
    }));
  },

  // Add player material
  addPlayerMaterial: (materialId: string, quantity: number) => {
    set(state => ({
      playerMaterials: {
        ...state.playerMaterials,
        [materialId]: (state.playerMaterials[materialId] || 0) + quantity
      }
    }));
  },

  // Remove player material
  removePlayerMaterial: (materialId: string, quantity: number) => {
    set(state => ({
      playerMaterials: {
        ...state.playerMaterials,
        [materialId]: Math.max(0, (state.playerMaterials[materialId] || 0) - quantity)
      }
    }));
  },

  // Get player material count
  getPlayerMaterialCount: (materialId: string) => {
    const state = get();
    return state.playerMaterials[materialId] || 0;
  },

  // Add recipe
  addRecipe: (recipe: CraftingRecipe) => {
    set(state => ({
      recipes: [...state.recipes.filter(r => r.id !== recipe.id), recipe]
    }));
  },

  // Learn recipe
  learnRecipe: (recipeId: string) => {
    set(state => ({
      knownRecipes: [...state.knownRecipes.filter(id => id !== recipeId), recipeId]
    }));
  },

  // Discover recipe
  discoverRecipe: (recipeId: string, method: string, materialsUsed: any[]) => {
    const discovery: CraftingDiscovery = {
      id: `discovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: 'local_player',
      recipeId,
      discoveredAt: new Date(),
      method: method as any,
      materialsUsed,
      shared: false,
      sharedWith: []
    };

    set(state => ({
      discoveredRecipes: [...state.discoveredRecipes.filter(id => id !== recipeId), recipeId],
      discoveries: [...state.discoveries, discovery]
    }));
  },

  // Check if can craft recipe
  canCraftRecipe: (recipeId: string) => {
    const state = get();
    const recipe = state.recipes.find(r => r.id === recipeId);
    if (!recipe) return false;

    // Check materials
    for (const material of recipe.materials) {
      if (state.getPlayerMaterialCount(material.materialId) < material.quantity) {
        return false;
      }
    }

    // Check requirements
    // TODO: Add level and skill checks

    return true;
  },

  // Get recipe
  getRecipe: (recipeId: string) => {
    const state = get();
    return state.recipes.find(r => r.id === recipeId) || null;
  },

  // Add station
  addStation: (station: CraftingStation) => {
    set(state => ({
      stations: [...state.stations.filter(s => s.id !== station.id), station]
    }));
  },

  // Unlock station
  unlockStation: (stationId: string) => {
    set(state => ({
      unlockedStations: [...state.unlockedStations.filter(id => id !== stationId), stationId]
    }));
  },

  // Upgrade station
  upgradeStation: (stationId: string, upgradeLevel: number) => {
    set(state => ({
      stations: state.stations.map(s => 
        s.id === stationId ? { ...s, currentUpgrade: upgradeLevel } : s
      )
    }));
  },

  // Get station
  getStation: (stationId: string) => {
    const state = get();
    return state.stations.find(s => s.id === stationId) || null;
  },

  // Add skill
  addSkill: (skill: CraftingSkill) => {
    set(state => ({
      skills: [...state.skills.filter(s => s.id !== skill.id), skill]
    }));
  },

  // Update skill experience
  updateSkillExperience: (skillId: string, experience: number) => {
    set(state => ({
      skills: state.skills.map(s => {
        if (s.id === skillId) {
          const newExperience = s.experience + experience;
          const newLevel = Math.floor(newExperience / 1000) + 1;
          const experienceToNext = 1000 - (newExperience % 1000);
          
          return {
            ...s,
            level: newLevel,
            experience: newExperience,
            experienceToNext
          };
        }
        return s;
      })
    }));
  },

  // Level up skill
  levelUpSkill: (skillId: string) => {
    set(state => ({
      skills: state.skills.map(s => {
        if (s.id === skillId) {
          return {
            ...s,
            level: s.level + 1,
            experience: 0,
            experienceToNext: 1000
          };
        }
        return s;
      })
    }));
  },

  // Get skill
  getSkill: (skillId: string) => {
    const state = get();
    return state.skills.find(s => s.id === skillId) || null;
  },

  // Start crafting
  startCrafting: (recipeId: string, stationId: string, quantity: number) => {
    const state = get();
    const recipe = state.getRecipe(recipeId);
    const station = state.getStation(stationId);
    
    if (!recipe || !station) return;

    const session: CraftingSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      recipeId,
      playerId: 'local_player',
      stationId,
      startTime: new Date(),
      status: 'active',
      progress: 0,
      quality: 'normal',
      materialsUsed: recipe.materials.map(m => ({
        materialId: m.materialId,
        quantity: m.quantity * quantity
      })),
      experienceGained: 0
    };

    // Consume materials
    for (const material of recipe.materials) {
      state.removePlayerMaterial(material.materialId, material.quantity * quantity);
    }

    set(state => ({
      activeSessions: [...state.activeSessions, session]
    }));

    // Start crafting timer
    const craftingTime = state.calculateCraftingTime(recipeId, stationId);
    const interval = setInterval(() => {
      const currentSession = get().activeSessions.find(s => s.id === session.id);
      if (currentSession && currentSession.status === 'active') {
        const progress = Math.min(100, currentSession.progress + (100 / (craftingTime / 1000)));
        get().updateCraftingProgress(session.id, progress);
        
        if (progress >= 100) {
          get().completeCrafting(session.id);
          clearInterval(interval);
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  },

  // Cancel crafting
  cancelCrafting: (sessionId: string) => {
    set(state => ({
      activeSessions: state.activeSessions.map(s => 
        s.id === sessionId ? { ...s, status: 'cancelled' } : s
      )
    }));
  },

  // Complete crafting
  completeCrafting: (sessionId: string) => {
    const state = get();
    const session = state.activeSessions.find(s => s.id === sessionId);
    if (!session) return;

    const recipe = state.getRecipe(session.recipeId);
    if (!recipe) return;

    // Calculate success
    const successRate = state.calculateSuccessRate(session.recipeId, 'weaponcraft', session.stationId);
    const isSuccess = Math.random() * 100 < successRate;
    
    if (isSuccess) {
      // Grant experience
      state.updateSkillExperience('weaponcraft', recipe.experience);
      
      set(state => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === sessionId ? { 
            ...s, 
            status: 'completed',
            endTime: new Date(),
            result: {
              itemId: recipe.result.itemId,
              quantity: recipe.result.quantity,
              quality: recipe.result.quality
            }
          } : s
        )
      }));
    } else {
      set(state => ({
        activeSessions: state.activeSessions.map(s => 
          s.id === sessionId ? { 
            ...s, 
            status: 'failed',
            endTime: new Date(),
            failureReason: 'Crafting failed'
          } : s
        )
      }));
    }
  },

  // Update crafting progress
  updateCraftingProgress: (sessionId: string, progress: number) => {
    set(state => ({
      activeSessions: state.activeSessions.map(s => 
        s.id === sessionId ? { ...s, progress } : s
      )
    }));
  },

  // Add to queue
  addToQueue: (recipeId: string, quantity: number, priority: number) => {
    const state = get();
    const recipe = state.getRecipe(recipeId);
    if (!recipe) return;

    const estimatedTime = state.calculateCraftingTime(recipeId, 'forge') * quantity;

    if (!state.craftingQueue) {
      set({
        craftingQueue: {
          id: `queue_${Date.now()}`,
          playerId: 'local_player',
          stationId: 'forge',
          items: [{
            recipeId,
            quantity,
            priority,
            estimatedTime
          }],
          isActive: false
        }
      });
    } else {
      set(state => ({
        craftingQueue: {
          ...state.craftingQueue!,
          items: [...state.craftingQueue!.items, {
            recipeId,
            quantity,
            priority,
            estimatedTime
          }]
        }
      }));
    }
  },

  // Remove from queue
  removeFromQueue: (index: number) => {
    set(state => ({
      craftingQueue: state.craftingQueue ? {
        ...state.craftingQueue,
        items: state.craftingQueue.items.filter((_, i) => i !== index)
      } : null
    }));
  },

  // Reorder queue
  reorderQueue: (fromIndex: number, toIndex: number) => {
    set(state => {
      if (!state.craftingQueue) return state;
      
      const items = [...state.craftingQueue.items];
      const [removed] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, removed);
      
      return {
        craftingQueue: {
          ...state.craftingQueue,
          items
        }
      };
    });
  },

  // Process queue
  processQueue: () => {
    const state = get();
    if (!state.craftingQueue || state.craftingQueue.isActive) return;
    
    const nextItem = state.craftingQueue.items[0];
    if (nextItem) {
      state.startCrafting(nextItem.recipeId, state.craftingQueue.stationId, nextItem.quantity);
      
      set(state => ({
        craftingQueue: {
          ...state.craftingQueue!,
          isActive: true,
          currentItem: nextItem.recipeId,
          startTime: new Date(),
          estimatedCompletion: new Date(Date.now() + nextItem.estimatedTime * 1000)
        }
      }));
    }
  },

  // Attempt discovery
  attemptDiscovery: (materials: any[], stationId: string) => {
    // Simulate discovery attempt
    const success = Math.random() < 0.1; // 10% chance
    if (success) {
      // Generate random recipe
      const recipeId = `discovered_${Date.now()}`;
      get().discoverRecipe(recipeId, 'experimentation', materials);
    }
  },

  // Share discovery
  shareDiscovery: (discoveryId: string, playerIds: string[]) => {
    set(state => ({
      discoveries: state.discoveries.map(d => 
        d.id === discoveryId ? { 
          ...d, 
          shared: true, 
          sharedWith: [...d.sharedWith, ...playerIds] 
        } : d
      )
    }));
  },

  // List item
  listItem: (itemId: string, quantity: number, pricePerUnit: number, marketId: string) => {
    // Implementation for listing items
  },

  // List material
  listMaterial: (materialId: string, quantity: number, pricePerUnit: number, marketId: string) => {
    // Implementation for listing materials
  },

  // Buy item
  buyItem: (listingId: string, quantity: number) => {
    // Implementation for buying items
  },

  // Buy material
  buyMaterial: (listingId: string, quantity: number) => {
    // Implementation for buying materials
  },

  // Cancel listing
  cancelListing: (listingId: string) => {
    // Implementation for canceling listings
  },

  // Get materials by type
  getMaterialsByType: (type: string) => {
    const state = get();
    return state.materials.filter(m => m.type === type);
  },

  // Get recipes by category
  getRecipesByCategory: (category: string) => {
    const state = get();
    return state.recipes.filter(r => r.category === category);
  },

  // Get stations by type
  getStationsByType: (type: string) => {
    const state = get();
    return state.stations.filter(s => s.type === type);
  },

  // Calculate crafting time
  calculateCraftingTime: (recipeId: string, stationId: string) => {
    const state = get();
    const recipe = state.getRecipe(recipeId);
    const station = state.getStation(stationId);
    
    if (!recipe || !station) return 0;
    
    let time = recipe.craftingTime;
    
    // Apply station bonuses
    if (station.currentUpgrade > 0) {
      const upgrade = station.upgrades[station.currentUpgrade - 1];
      time *= (1 - upgrade.benefits.speedBonus);
    }
    
    return Math.max(1, time);
  },

  // Calculate success rate
  calculateSuccessRate: (recipeId: string, skillId: string, stationId: string) => {
    const state = get();
    const recipe = state.getRecipe(recipeId);
    const skill = state.getSkill(skillId);
    const station = state.getStation(stationId);
    
    if (!recipe || !skill || !station) return 0;
    
    let successRate = recipe.successRate;
    
    // Apply skill bonuses
    successRate += (skill.level - recipe.requirements.level) * 5;
    
    // Apply station bonuses
    if (station.currentUpgrade > 0) {
      const upgrade = station.upgrades[station.currentUpgrade - 1];
      successRate += upgrade.benefits.successBonus;
    }
    
    return Math.min(100, Math.max(0, successRate));
  },

  // Get crafting cost
  getCraftingCost: (recipeId: string) => {
    const state = get();
    const recipe = state.getRecipe(recipeId);
    
    if (!recipe) return { gold: 0, materials: [] };
    
    return {
      gold: 0, // Base crafting is free
      materials: recipe.materials
    };
  }
}));