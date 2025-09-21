// World exploration system types and interfaces

export type ZoneType = 
  | 'labyrinth'     // Maze-like areas
  | 'dungeon'       // Underground areas
  | 'wilderness'    // Open areas
  | 'city'          // Urban areas
  | 'temple'        // Sacred areas
  | 'ruins'         // Ancient areas
  | 'cave'          // Cave systems
  | 'tower'         // Vertical areas
  | 'garden'        // Natural areas
  | 'void';         // Special areas

export type ZoneStatus = 
  | 'locked'        // Cannot access
  | 'available'     // Can access
  | 'explored'      // Has been visited
  | 'completed'     // All objectives completed
  | 'corrupted';    // Corrupted by chaos

export type InteractionType = 
  | 'examine'       // Look at object
  | 'use'           // Use object
  | 'take'          // Take item
  | 'talk'          // Talk to NPC
  | 'activate'      // Activate mechanism
  | 'destroy'       // Destroy object
  | 'repair'        // Repair object
  | 'climb'         // Climb object
  | 'jump'          // Jump over object
  | 'push'          // Push object
  | 'pull'          // Pull object
  | 'open'          // Open container
  | 'close'         // Close container
  | 'lock'          // Lock object
  | 'unlock'        // Unlock object
  | 'read'          // Read text
  | 'touch'         // Touch object
  | 'smell'         // Smell object
  | 'listen';       // Listen to object

export type FastTravelType = 
  | 'portal'        // Magical portal
  | 'shrine'        // Sacred shrine
  | 'waypoint'      // Travel waypoint
  | 'gate'          // Ancient gate
  | 'teleporter'    // Technological device
  | 'path'          // Natural path
  | 'bridge'        // Bridge connection
  | 'tunnel';       // Underground tunnel

// Zone interface
export interface Zone {
  id: string;
  name: string;
  description: string;
  type: ZoneType;
  status: ZoneStatus;
  
  // Zone properties
  size: [number, number];  // Width x Height
  level: number;           // Recommended level
  difficulty: number;      // 1-10 difficulty rating
  
  // Visual properties
  theme: string;           // Visual theme
  lighting: {
    level: number;         // 0-1 brightness
    color: [number, number, number]; // RGB
    dynamic: boolean;      // Does lighting change
  };
  weather?: {
    type: 'clear' | 'rain' | 'storm' | 'fog' | 'snow' | 'sandstorm';
    intensity: number;     // 0-1
    effects: string[];     // Weather effects
  };
  
  // Zone content
  npcs: NPC[];
  objects: WorldObject[];
  enemies: EnemySpawn[];
  items: ItemSpawn[];
  secrets: Secret[];
  
  // Connections
  connections: ZoneConnection[];
  fastTravelPoints: FastTravelPoint[];
  
  // Exploration
  explorationProgress: number; // 0-100
  discoveredAreas: string[];   // Discovered area IDs
  hiddenAreas: string[];       // Hidden area IDs
  
  // Zone-specific data
  customData: Record<string, any>;
}

// Zone connection interface
export interface ZoneConnection {
  id: string;
  fromZone: string;
  toZone: string;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  type: 'door' | 'portal' | 'path' | 'teleporter' | 'bridge' | 'tunnel';
  requirements?: {
    level?: number;
    items?: string[];
    quests?: string[];
    keys?: string[];
  };
  description: string;
  locked: boolean;
}

// Fast travel point interface
export interface FastTravelPoint {
  id: string;
  name: string;
  description: string;
  type: FastTravelType;
  position: [number, number, number];
  zone: string;
  unlocked: boolean;
  requirements?: {
    level?: number;
    quests?: string[];
    items?: string[];
  };
  cost?: {
    type: 'gold' | 'energy' | 'item';
    amount: number;
  };
  cooldown?: number; // Cooldown in seconds
}

// World object interface
export interface WorldObject {
  id: string;
  name: string;
  description: string;
  type: 'decoration' | 'interactive' | 'container' | 'mechanism' | 'obstacle' | 'secret';
  position: [number, number, number];
  size: [number, number, number];
  
  // Interaction properties
  interactions: InteractionType[];
  locked: boolean;
  health?: number;         // For destructible objects
  maxHealth?: number;
  
  // Visual properties
  sprite: string;
  animation?: string;
  glow?: boolean;
  color?: [number, number, number];
  
  // Object-specific data
  data: {
    items?: string[];      // Items contained
    text?: string;         // Text to display
    script?: string;       // Script to execute
    effects?: string[];    // Effects when interacted
  };
}

// NPC interface
export interface NPC {
  id: string;
  name: string;
  description: string;
  type: 'merchant' | 'quest_giver' | 'guard' | 'citizen' | 'enemy' | 'ally';
  position: [number, number, number];
  
  // NPC properties
  level: number;
  health: number;
  maxHealth: number;
  faction: string;
  reputation: number;      // Player's reputation with this NPC
  
  // Interaction properties
  interactions: InteractionType[];
  dialogue?: string;       // Dialogue ID
  quests?: string[];       // Available quest IDs
  shop?: string;           // Shop ID
  
  // Visual properties
  sprite: string;
  animation?: string;
  scale?: number;
  
  // AI properties
  ai?: {
    type: 'static' | 'patrol' | 'guard' | 'wander' | 'follow';
    behavior: string[];
    range?: number;
    speed?: number;
  };
  
  // NPC-specific data
  customData: Record<string, any>;
}

// Enemy spawn interface
export interface EnemySpawn {
  id: string;
  enemyId: string;
  position: [number, number, number];
  level: number;
  respawnTime: number;     // Respawn time in seconds
  maxInstances: number;    // Maximum instances
  currentInstances: number;
  conditions?: {
    time?: string;         // Time of day
    weather?: string;      // Weather condition
    quests?: string[];     // Required quests
  };
}

// Item spawn interface
export interface ItemSpawn {
  id: string;
  itemId: string;
  position: [number, number, number];
  respawnTime: number;     // Respawn time in seconds
  maxInstances: number;    // Maximum instances
  currentInstances: number;
  hidden: boolean;         // Is spawn hidden
  conditions?: {
    level?: number;        // Required level
    quests?: string[];     // Required quests
    items?: string[];      // Required items
  };
}

// Secret interface
export interface Secret {
  id: string;
  name: string;
  description: string;
  type: 'hidden_area' | 'secret_item' | 'lore_fragment' | 'easter_egg' | 'achievement';
  position: [number, number, number];
  discovered: boolean;
  requirements?: {
    level?: number;
    items?: string[];
    quests?: string[];
    interactions?: string[];
  };
  reward?: {
    experience?: number;
    items?: string[];
    quests?: string[];
    achievements?: string[];
  };
}

// Area interface
export interface Area {
  id: string;
  name: string;
  description: string;
  zone: string;
  position: [number, number, number];
  size: [number, number, number];
  discovered: boolean;
  explored: boolean;
  objects: string[];       // Object IDs in this area
  npcs: string[];          // NPC IDs in this area
  secrets: string[];       // Secret IDs in this area
}

// World state interface
export interface WorldState {
  currentZone: string;
  currentPosition: [number, number, number];
  discoveredZones: string[];
  unlockedFastTravel: string[];
  zoneProgress: Record<string, number>; // Zone exploration progress
  discoveredSecrets: string[];
  worldEvents: WorldEvent[];
  timeOfDay: number;       // 0-24 hours
  dayOfYear: number;       // 1-365 days
  weather: {
    current: string;
    forecast: string[];
  };
}

// World event interface
export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'festival' | 'disaster' | 'invasion' | 'discovery' | 'celebration';
  zone: string;
  startTime: number;
  endTime: number;
  active: boolean;
  effects: string[];
  requirements?: {
    level?: number;
    quests?: string[];
    reputation?: Record<string, number>;
  };
}

// Exploration achievement interface
export interface ExplorationAchievement {
  id: string;
  name: string;
  description: string;
  type: 'zone_explorer' | 'secret_finder' | 'fast_traveler' | 'lore_master' | 'treasure_hunter';
  requirements: {
    zones?: string[];
    secrets?: string[];
    fastTravel?: string[];
    lore?: string[];
    treasures?: string[];
  };
  reward: {
    experience?: number;
    items?: string[];
    title?: string;
    achievement?: string;
  };
  unlocked: boolean;
  progress: number;        // 0-100
}

// World interaction result interface
export interface WorldInteractionResult {
  success: boolean;
  message: string;
  effects?: string[];
  items?: string[];
  experience?: number;
  quests?: string[];
  achievements?: string[];
  worldChanges?: Record<string, any>;
}