// Character classes
export type CharacterClass = 
  | 'CovenantWeaver'     // Abrahamic - Jewish Kabbalah
  | 'PhilosopherKing'    // Greek Mythos/Rosicrucian
  | 'ChakravartiAvatar'  // Hinduism
  | 'SerpentsWhisper'    // Egyptian Mythology/Kabbalah
  | 'JadeDragon';        // Chinese Mythology

// Echo Zone types
export type EchoZoneType = 
  | 'AzureLabyrinth'     // Greek Echo
  | 'ObsidianDunes'      // Egyptian Echo
  | 'JadeCanopy';        // Chinese Echo

// Character stats structure
export interface CharacterStats {
  strength: number;    // Physical power and damage
  wisdom: number;      // Magical potency and resistance
  agility: number;     // Speed and evasion
  willpower: number;   // Mental fortitude and energy
  harmony: number;     // Connection to echoes and balance
}

// Character ability
export interface Ability {
  id: string;
  name: string;
  description: string;
  energyCost: number;
  cooldown: number;
  effect: string;      // Description of the ability's effect
  animation: string;   // Animation to play when using the ability
  sprite: string;      // Path to the ability icon
}

// Character base data
export interface CharacterData {
  class: CharacterClass;
  name: string;
  description: string;
  visualCues: string[];
  baseStats: CharacterStats;
  abilities: Ability[];
  sprite: string;      // Path to character sprite
}

// Enemy entity
export interface Enemy {
  id: string;
  name: string;
  description: string;
  health: number;
  damage: number;
  weaknesses: string[];
  resistances: string[];
  abilities: string[];
  sprite: string;
  dropChance: number;  // 0-1 chance to drop an item
}

// Echo entity (fragment of cosmic order)
export interface EchoEntity {
  id: string;
  name: string;
  description: string;
  power: number;       // Strength of the echo
  alignment: 'balanced' | 'corrupted' | 'purified';
  interactions: string[];  // Possible interactions with this echo
  sprite: string;      // Path to echo sprite
  position: [number, number, number]; // x, y, z
}

// Echo Zone data
export interface EchoZoneData {
  type: EchoZoneType;
  name: string;
  description: string;
  visualTheme: string[];
  ambientLight: [number, number, number]; // RGB values
  fogDensity: number;
  groundTexture: string;
  echoes: EchoEntity[];
  enemies: Enemy[];
  boundaries: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
}

// Dialog node for the narrative system
export interface DialogNode {
  id: string;
  text: string;
  speaker: string;
  options?: DialogOption[];
  next?: string;        // ID of the next dialog node
}

// Dialog option (for player choices)
export interface DialogOption {
  text: string;
  nextId: string;       // ID of the next dialog node
  condition?: {
    type: string;       // Type of condition (e.g., "stat", "item", "quest")
    value: string;      // Value to check
    threshold?: number; // Threshold for numeric values
  };
}

// Dialog sequence
export interface DialogSequence {
  id: string;
  title: string;
  nodes: { [key: string]: DialogNode };
  startNodeId: string;
}
