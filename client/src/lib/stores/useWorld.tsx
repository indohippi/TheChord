import { create } from "zustand";
import { 
  Zone, 
  ZoneConnection, 
  FastTravelPoint, 
  WorldObject, 
  NPC, 
  WorldState,
  WorldInteractionResult,
  InteractionType,
  ZoneStatus,
  ExplorationAchievement
} from "@shared/worldTypes";

interface WorldStore {
  // World state
  worldState: WorldState;
  
  // Zones
  zones: Zone[];
  currentZone: Zone | null;
  
  // Fast travel
  fastTravelPoints: FastTravelPoint[];
  unlockedFastTravel: string[];
  
  // Exploration
  explorationAchievements: ExplorationAchievement[];
  
  // Actions
  changeZone: (zoneId: string, position?: [number, number, number]) => Promise<boolean>;
  fastTravel: (pointId: string) => Promise<boolean>;
  
  // Zone management
  getZone: (zoneId: string) => Zone | undefined;
  getCurrentZone: () => Zone | null;
  unlockZone: (zoneId: string) => void;
  updateZoneProgress: (zoneId: string, progress: number) => void;
  
  // World objects
  getWorldObjects: (zoneId: string) => WorldObject[];
  getNPCs: (zoneId: string) => NPC[];
  interactWithObject: (objectId: string, interaction: InteractionType) => Promise<WorldInteractionResult>;
  interactWithNPC: (npcId: string, interaction: InteractionType) => Promise<WorldInteractionResult>;
  
  // Fast travel
  getFastTravelPoints: (zoneId?: string) => FastTravelPoint[];
  unlockFastTravel: (pointId: string) => void;
  canFastTravel: (pointId: string) => boolean;
  
  // Exploration
  discoverSecret: (secretId: string) => void;
  exploreArea: (areaId: string) => void;
  getExplorationProgress: (zoneId: string) => number;
  getTotalExplorationProgress: () => number;
  
  // World events
  getActiveWorldEvents: () => any[];
  triggerWorldEvent: (eventId: string) => void;
  
  // Time and weather
  updateTime: (hours: number) => void;
  updateWeather: (weather: string) => void;
  getTimeOfDay: () => string;
  getWeatherEffects: () => string[];
  
  // Utility
  initializeWorld: () => Promise<void>;
  resetWorld: () => void;
  getWorldStats: () => any;
}

// Default world state
const defaultWorldState: WorldState = {
  currentZone: 'azure-labyrinth',
  currentPosition: [0, 0, 0],
  discoveredZones: ['azure-labyrinth'],
  unlockedFastTravel: [],
  zoneProgress: {},
  discoveredSecrets: [],
  worldEvents: [],
  timeOfDay: 12, // Noon
  dayOfYear: 1,
  weather: {
    current: 'clear',
    forecast: ['clear', 'clear', 'rain']
  }
};

// Sample zones data
const sampleZones: Zone[] = [
  {
    id: 'azure-labyrinth',
    name: 'Azure Labyrinth',
    description: 'A mystical maze of ancient Greek architecture, filled with echoes of lost knowledge.',
    type: 'labyrinth',
    status: 'available',
    size: [20, 20],
    level: 1,
    difficulty: 3,
    theme: 'greek',
    lighting: {
      level: 0.7,
      color: [0.4, 0.6, 1.0],
      dynamic: true
    },
    npcs: [
      {
        id: 'wandering-scholar',
        name: 'Wandering Scholar',
        description: 'A learned individual studying the mysteries of the labyrinth.',
        type: 'quest_giver',
        position: [5, 0, 5],
        level: 5,
        health: 100,
        maxHealth: 100,
        faction: 'philosophers-guild',
        reputation: 0,
        interactions: ['talk', 'examine'],
        dialogue: 'wandering-scholar-dialogue',
        quests: ['philosophers-notes', 'echo-fragments'],
        sprite: 'wandering-scholar',
        customData: {}
      }
    ],
    objects: [
      {
        id: 'ancient-pedestal',
        name: 'Ancient Pedestal',
        description: 'A stone pedestal with mysterious inscriptions.',
        type: 'interactive',
        position: [10, 0, 10],
        size: [1, 1, 1],
        interactions: ['examine', 'activate'],
        locked: false,
        sprite: 'ancient-pedestal',
        data: {
          text: 'The inscriptions speak of cosmic order and the echoes of creation.',
          script: 'reveal-secret'
        }
      }
    ],
    enemies: [],
    items: [],
    secrets: [
      {
        id: 'hidden-chamber',
        name: 'Hidden Chamber',
        description: 'A secret room containing ancient knowledge.',
        type: 'hidden_area',
        position: [15, 0, 15],
        discovered: false,
        requirements: {
          level: 3,
          interactions: ['activate']
        },
        reward: {
          experience: 100,
          items: ['ancient-tome']
        }
      }
    ],
    connections: [
      {
        id: 'labyrinth-to-dunes',
        fromZone: 'azure-labyrinth',
        toZone: 'obsidian-dunes',
        fromPosition: [19, 0, 10],
        toPosition: [0, 0, 10],
        type: 'portal',
        requirements: {
          level: 5,
          quests: ['first-echo']
        },
        description: 'A shimmering portal leading to the Obsidian Dunes',
        locked: true
      }
    ],
    fastTravelPoints: [
      {
        id: 'labyrinth-entrance',
        name: 'Labyrinth Entrance',
        description: 'The main entrance to the Azure Labyrinth',
        type: 'shrine',
        position: [0, 0, 0],
        zone: 'azure-labyrinth',
        unlocked: true
      }
    ],
    explorationProgress: 0,
    discoveredAreas: [],
    hiddenAreas: ['hidden-chamber'],
    customData: {}
  },
  {
    id: 'obsidian-dunes',
    name: 'Obsidian Dunes',
    description: 'A vast desert of black sand, where Egyptian echoes whisper of ancient power.',
    type: 'wilderness',
    status: 'locked',
    size: [30, 30],
    level: 5,
    difficulty: 5,
    theme: 'egyptian',
    lighting: {
      level: 0.9,
      color: [1.0, 0.8, 0.4],
      dynamic: true
    },
    weather: {
      type: 'sandstorm',
      intensity: 0.3,
      effects: ['reduced_visibility', 'sand_damage']
    },
    npcs: [],
    objects: [],
    enemies: [],
    items: [],
    secrets: [],
    connections: [
      {
        id: 'dunes-to-labyrinth',
        fromZone: 'obsidian-dunes',
        toZone: 'azure-labyrinth',
        fromPosition: [0, 0, 10],
        toPosition: [19, 0, 10],
        type: 'portal',
        requirements: {},
        description: 'A shimmering portal leading back to the Azure Labyrinth',
        locked: false
      }
    ],
    fastTravelPoints: [
      {
        id: 'dunes-oasis',
        name: 'Desert Oasis',
        description: 'A peaceful oasis in the heart of the dunes',
        type: 'shrine',
        position: [15, 0, 15],
        zone: 'obsidian-dunes',
        unlocked: false,
        requirements: {
          level: 5,
          quests: ['first-echo']
        }
      }
    ],
    explorationProgress: 0,
    discoveredAreas: [],
    hiddenAreas: [],
    customData: {}
  },
  {
    id: 'jade-canopy',
    name: 'Jade Canopy',
    description: 'A mystical forest where Chinese echoes dance among ancient trees.',
    type: 'garden',
    status: 'locked',
    size: [25, 25],
    level: 10,
    difficulty: 7,
    theme: 'chinese',
    lighting: {
      level: 0.6,
      color: [0.2, 0.8, 0.4],
      dynamic: true
    },
    npcs: [],
    objects: [],
    enemies: [],
    items: [],
    secrets: [],
    connections: [],
    fastTravelPoints: [
      {
        id: 'canopy-shrine',
        name: 'Harmony Shrine',
        description: 'A shrine dedicated to the balance of yin and yang',
        type: 'shrine',
        position: [12, 0, 12],
        zone: 'jade-canopy',
        unlocked: false,
        requirements: {
          level: 10,
          quests: ['corrupted-guardian']
        }
      }
    ],
    explorationProgress: 0,
    discoveredAreas: [],
    hiddenAreas: [],
    customData: {}
  }
];

export const useWorld = create<WorldStore>((set, get) => ({
  // Initial state
  worldState: defaultWorldState,
  zones: sampleZones,
  currentZone: null,
  fastTravelPoints: [],
  unlockedFastTravel: [],
  explorationAchievements: [],
  
  // Change zone
  changeZone: async (zoneId, position) => {
    const state = get();
    const zone = state.getZone(zoneId);
    
    if (!zone) {
      console.log(`Zone ${zoneId} not found`);
      return false;
    }
    
    if (zone.status === 'locked') {
      console.log(`Zone ${zoneId} is locked`);
      return false;
    }
    
    // Update world state
    const newPosition = position || [0, 0, 0];
    const discoveredZones = state.worldState.discoveredZones.includes(zoneId)
      ? state.worldState.discoveredZones
      : [...state.worldState.discoveredZones, zoneId];
    
    set({
      worldState: {
        ...state.worldState,
        currentZone: zoneId,
        currentPosition: newPosition,
        discoveredZones
      },
      currentZone: zone
    });
    
    console.log(`Changed to zone: ${zone.name}`);
    return true;
  },
  
  // Fast travel
  fastTravel: async (pointId) => {
    const state = get();
    const point = state.fastTravelPoints.find(p => p.id === pointId);
    
    if (!point) {
      console.log(`Fast travel point ${pointId} not found`);
      return false;
    }
    
    if (!point.unlocked) {
      console.log(`Fast travel point ${pointId} is not unlocked`);
      return false;
    }
    
    // Check requirements
    if (!state.canFastTravel(pointId)) {
      console.log(`Cannot fast travel to ${pointId}`);
      return false;
    }
    
    // Change zone and position
    const success = await state.changeZone(point.zone, point.position);
    
    if (success) {
      console.log(`Fast traveled to ${point.name}`);
    }
    
    return success;
  },
  
  // Get zone
  getZone: (zoneId) => {
    const state = get();
    return state.zones.find(z => z.id === zoneId);
  },
  
  // Get current zone
  getCurrentZone: () => {
    const state = get();
    return state.currentZone;
  },
  
  // Unlock zone
  unlockZone: (zoneId) => {
    const state = get();
    const zone = state.getZone(zoneId);
    
    if (zone && zone.status === 'locked') {
      zone.status = 'available';
      
      set({
        zones: state.zones.map(z => z.id === zoneId ? zone : z)
      });
      
      console.log(`Unlocked zone: ${zone.name}`);
    }
  },
  
  // Update zone progress
  updateZoneProgress: (zoneId, progress) => {
    const state = get();
    const zone = state.getZone(zoneId);
    
    if (zone) {
      zone.explorationProgress = Math.min(100, Math.max(0, progress));
      
      set({
        zones: state.zones.map(z => z.id === zoneId ? zone : z),
        worldState: {
          ...state.worldState,
          zoneProgress: {
            ...state.worldState.zoneProgress,
            [zoneId]: progress
          }
        }
      });
      
      console.log(`Updated progress for ${zone.name}: ${progress}%`);
    }
  },
  
  // Get world objects
  getWorldObjects: (zoneId) => {
    const state = get();
    const zone = state.getZone(zoneId);
    return zone ? zone.objects : [];
  },
  
  // Get NPCs
  getNPCs: (zoneId) => {
    const state = get();
    const zone = state.getZone(zoneId);
    return zone ? zone.npcs : [];
  },
  
  // Interact with object
  interactWithObject: async (objectId, interaction) => {
    const state = get();
    const currentZone = state.getCurrentZone();
    
    if (!currentZone) {
      return {
        success: false,
        message: "No current zone"
      };
    }
    
    const object = currentZone.objects.find(o => o.id === objectId);
    
    if (!object) {
      return {
        success: false,
        message: "Object not found"
      };
    }
    
    if (!object.interactions.includes(interaction)) {
      return {
        success: false,
        message: "Cannot perform this interaction"
      };
    }
    
    if (object.locked && interaction !== 'unlock') {
      return {
        success: false,
        message: "Object is locked"
      };
    }
    
    // Process interaction
    let result: WorldInteractionResult = {
      success: true,
      message: `You ${interaction} the ${object.name}`
    };
    
    switch (interaction) {
      case 'examine':
        result.message = object.description;
        if (object.data.text) {
          result.message += `\n\n${object.data.text}`;
        }
        break;
        
      case 'activate':
        if (object.data.script) {
          // Execute script
          console.log(`Executing script: ${object.data.script}`);
          result.effects = object.data.effects;
        }
        break;
        
      case 'take':
        if (object.data.items && object.data.items.length > 0) {
          result.items = object.data.items;
          // Remove items from object
          object.data.items = [];
        }
        break;
        
      case 'destroy':
        if (object.health !== undefined) {
          object.health -= 10;
          if (object.health <= 0) {
            // Remove object
            currentZone.objects = currentZone.objects.filter(o => o.id !== objectId);
            result.message = `You destroy the ${object.name}`;
          } else {
            result.message = `You damage the ${object.name}`;
          }
        }
        break;
    }
    
    return result;
  },
  
  // Interact with NPC
  interactWithNPC: async (npcId, interaction) => {
    const state = get();
    const currentZone = state.getCurrentZone();
    
    if (!currentZone) {
      return {
        success: false,
        message: "No current zone"
      };
    }
    
    const npc = currentZone.npcs.find(n => n.id === npcId);
    
    if (!npc) {
      return {
        success: false,
        message: "NPC not found"
      };
    }
    
    if (!npc.interactions.includes(interaction)) {
      return {
        success: false,
        message: "Cannot perform this interaction"
      };
    }
    
    // Process interaction
    let result: WorldInteractionResult = {
      success: true,
      message: `You ${interaction} with ${npc.name}`
    };
    
    switch (interaction) {
      case 'talk':
        if (npc.dialogue) {
          result.message = `You talk to ${npc.name}`;
          // This would trigger dialogue system
        }
        break;
        
      case 'examine':
        result.message = npc.description;
        break;
    }
    
    return result;
  },
  
  // Get fast travel points
  getFastTravelPoints: (zoneId) => {
    const state = get();
    if (zoneId) {
      return state.fastTravelPoints.filter(p => p.zone === zoneId);
    }
    return state.fastTravelPoints;
  },
  
  // Unlock fast travel
  unlockFastTravel: (pointId) => {
    const state = get();
    const point = state.fastTravelPoints.find(p => p.id === pointId);
    
    if (point && !point.unlocked) {
      point.unlocked = true;
      
      set({
        fastTravelPoints: state.fastTravelPoints.map(p => p.id === pointId ? point : p),
        unlockedFastTravel: [...state.unlockedFastTravel, pointId]
      });
      
      console.log(`Unlocked fast travel point: ${point.name}`);
    }
  },
  
  // Can fast travel
  canFastTravel: (pointId) => {
    const state = get();
    const point = state.fastTravelPoints.find(p => p.id === pointId);
    
    if (!point || !point.unlocked) return false;
    
    // Check requirements
    if (point.requirements) {
      // This would check level, quests, items, etc.
    }
    
    // Check cooldown
    if (point.cooldown) {
      // This would check if cooldown has expired
    }
    
    return true;
  },
  
  // Discover secret
  discoverSecret: (secretId) => {
    const state = get();
    const currentZone = state.getCurrentZone();
    
    if (!currentZone) return;
    
    const secret = currentZone.secrets.find(s => s.id === secretId);
    
    if (secret && !secret.discovered) {
      secret.discovered = true;
      
      set({
        worldState: {
          ...state.worldState,
          discoveredSecrets: [...state.worldState.discoveredSecrets, secretId]
        }
      });
      
      console.log(`Discovered secret: ${secret.name}`);
    }
  },
  
  // Explore area
  exploreArea: (areaId) => {
    const state = get();
    const currentZone = state.getCurrentZone();
    
    if (!currentZone) return;
    
    if (!currentZone.discoveredAreas.includes(areaId)) {
      currentZone.discoveredAreas.push(areaId);
      
      // Update exploration progress
      const totalAreas = currentZone.discoveredAreas.length + currentZone.hiddenAreas.length;
      const progress = (currentZone.discoveredAreas.length / totalAreas) * 100;
      
      state.updateZoneProgress(currentZone.id, progress);
      
      console.log(`Explored area: ${areaId}`);
    }
  },
  
  // Get exploration progress
  getExplorationProgress: (zoneId) => {
    const state = get();
    const zone = state.getZone(zoneId);
    return zone ? zone.explorationProgress : 0;
  },
  
  // Get total exploration progress
  getTotalExplorationProgress: () => {
    const state = get();
    const totalProgress = state.zones.reduce((sum, zone) => sum + zone.explorationProgress, 0);
    return totalProgress / state.zones.length;
  },
  
  // Get active world events
  getActiveWorldEvents: () => {
    const state = get();
    const now = Date.now();
    return state.worldState.worldEvents.filter(event => 
      event.active && event.startTime <= now && event.endTime >= now
    );
  },
  
  // Trigger world event
  triggerWorldEvent: (eventId) => {
    const state = get();
    const event = state.worldState.worldEvents.find(e => e.id === eventId);
    
    if (event) {
      event.active = true;
      event.startTime = Date.now();
      
      set({
        worldState: {
          ...state.worldState,
          worldEvents: state.worldState.worldEvents.map(e => e.id === eventId ? event : e)
        }
      });
      
      console.log(`Triggered world event: ${event.name}`);
    }
  },
  
  // Update time
  updateTime: (hours) => {
    const state = get();
    const newTime = (state.worldState.timeOfDay + hours) % 24;
    
    set({
      worldState: {
        ...state.worldState,
        timeOfDay: newTime
      }
    });
  },
  
  // Update weather
  updateWeather: (weather) => {
    set(state => ({
      worldState: {
        ...state.worldState,
        weather: {
          ...state.worldState.weather,
          current: weather
        }
      }
    }));
  },
  
  // Get time of day
  getTimeOfDay: () => {
    const state = get();
    const hour = state.worldState.timeOfDay;
    
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  },
  
  // Get weather effects
  getWeatherEffects: () => {
    const state = get();
    const currentZone = state.getCurrentZone();
    
    if (!currentZone || !currentZone.weather) return [];
    
    return currentZone.weather.effects || [];
  },
  
  // Initialize world
  initializeWorld: async () => {
    const state = get();
    
    // Set current zone
    const currentZone = state.getZone(state.worldState.currentZone);
    
    // Collect all fast travel points
    const allFastTravelPoints = state.zones.flatMap(zone => zone.fastTravelPoints);
    
    set({
      currentZone,
      fastTravelPoints: allFastTravelPoints
    });
    
    console.log("World initialized");
  },
  
  // Reset world
  resetWorld: () => {
    set({
      worldState: defaultWorldState,
      currentZone: null,
      fastTravelPoints: [],
      unlockedFastTravel: [],
      explorationAchievements: []
    });
  },
  
  // Get world stats
  getWorldStats: () => {
    const state = get();
    return {
      discoveredZones: state.worldState.discoveredZones.length,
      totalZones: state.zones.length,
      unlockedFastTravel: state.unlockedFastTravel.length,
      totalFastTravel: state.fastTravelPoints.length,
      discoveredSecrets: state.worldState.discoveredSecrets.length,
      totalExploration: state.getTotalExplorationProgress(),
      timeOfDay: state.getTimeOfDay(),
      weather: state.worldState.weather.current
    };
  }
}));