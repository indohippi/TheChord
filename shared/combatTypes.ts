// Enhanced combat system types and interfaces

export type StatusEffectType = 
  | 'poison'        // Damage over time
  | 'burn'          // Fire damage over time
  | 'freeze'        // Reduced movement and attack speed
  | 'stun'          // Cannot act
  | 'charm'         // Attacks allies
  | 'fear'          // Reduced accuracy and damage
  | 'rage'          // Increased damage, reduced defense
  | 'shield'        // Damage reduction
  | 'regeneration'  // Health over time
  | 'haste'         // Increased speed
  | 'slow'          // Reduced speed
  | 'silence'       // Cannot use abilities
  | 'blind'         // Reduced accuracy
  | 'vulnerable'    // Increased damage taken
  | 'resistant'     // Reduced damage taken
  | 'immune'        // Immune to certain effects
  | 'marked'        // Increased damage from specific sources
  | 'blessed'       // Various positive effects
  | 'cursed';       // Various negative effects

export type DamageType = 
  | 'physical'      // Physical damage
  | 'magical'       // Magical damage
  | 'fire'          // Fire damage
  | 'ice'           // Ice damage
  | 'lightning'     // Lightning damage
  | 'poison'        // Poison damage
  | 'holy'          // Holy damage
  | 'dark'          // Dark damage
  | 'chaos'         // Chaos damage
  | 'echo';         // Echo damage

export type CombatActionType = 
  | 'move'          // Movement action
  | 'attack'        // Basic attack
  | 'ability'       // Special ability
  | 'item'          // Use item
  | 'defend'        // Defensive action
  | 'wait'          // Skip turn
  | 'combo'         // Combo attack
  | 'environmental' // Environmental interaction
  | 'flee';         // Attempt to flee

export type ComboType = 
  | 'chain'         // Chain attacks
  | 'elemental'     // Elemental combinations
  | 'tactical'      // Tactical combinations
  | 'ultimate';     // Ultimate combinations

export type EnvironmentalInteraction = 
  | 'push'          // Push object
  | 'pull'          // Pull object
  | 'destroy'       // Destroy object
  | 'activate'      // Activate mechanism
  | 'climb'         // Climb object
  | 'jump'          // Jump over object
  | 'hide'          // Hide behind object
  | 'throw';        // Throw object

// Status effect interface
export interface StatusEffect {
  id: string;
  type: StatusEffectType;
  name: string;
  description: string;
  duration: number;        // Duration in turns
  intensity: number;       // Effect strength
  stackable: boolean;      // Can stack with itself
  maxStacks: number;       // Maximum stacks
  currentStacks: number;   // Current stacks
  source: string;          // Source of the effect
  damage?: number;         // Damage per turn (for DoT effects)
  damageType?: DamageType; // Type of damage
  resistances?: DamageType[]; // Resistances granted
  immunities?: StatusEffectType[]; // Immunities granted
  onApply?: string;        // Script to run when applied
  onTick?: string;         // Script to run each turn
  onRemove?: string;       // Script to run when removed
}

// Damage calculation interface
export interface DamageCalculation {
  baseDamage: number;
  damageType: DamageType;
  critical: boolean;
  criticalMultiplier: number;
  resistance: number;      // Resistance to this damage type
  vulnerability: number;   // Vulnerability to this damage type
  finalDamage: number;
  blocked: number;         // Damage blocked
  absorbed: number;        // Damage absorbed
  reflected: number;       // Damage reflected back
}

// Combo attack interface
export interface ComboAttack {
  id: string;
  name: string;
  description: string;
  type: ComboType;
  requirements: {
    abilities: string[];   // Required abilities
    conditions: string[];  // Required conditions
    turns: number;         // Turns to execute
  };
  effects: {
    damage: DamageCalculation;
    statusEffects: StatusEffect[];
    environmentalEffects: EnvironmentalEffect[];
  };
  cooldown: number;        // Cooldown in turns
  energyCost: number;      // Energy cost
  animation: string;       // Animation to play
}

// Environmental effect interface
export interface EnvironmentalEffect {
  id: string;
  name: string;
  description: string;
  type: EnvironmentalInteraction;
  target: string;          // Target object/area
  range: number;           // Range of effect
  damage?: DamageCalculation;
  statusEffects?: StatusEffect[];
  duration?: number;       // Duration of effect
  permanent?: boolean;     // Is effect permanent
}

// Combat modifier interface
export interface CombatModifier {
  id: string;
  name: string;
  description: string;
  type: 'damage' | 'accuracy' | 'critical' | 'defense' | 'speed' | 'resistance';
  value: number;           // Modifier value
  condition?: string;      // Condition for modifier to apply
  duration?: number;       // Duration in turns
  stackable: boolean;      // Can stack with other modifiers
}

// Combat result interface
export interface CombatResult {
  success: boolean;
  damage?: DamageCalculation;
  statusEffects?: StatusEffect[];
  environmentalEffects?: EnvironmentalEffect[];
  comboTriggered?: ComboAttack;
  criticalHit?: boolean;
  miss?: boolean;
  blocked?: boolean;
  reflected?: boolean;
  message: string;         // Result message
}

// Combat turn interface
export interface CombatTurn {
  turnNumber: number;
  activeEntity: string;
  action: CombatActionType;
  target?: string;
  position?: [number, number];
  result: CombatResult;
  timestamp: number;
}

// Combat state interface
export interface CombatState {
  isActive: boolean;
  turnNumber: number;
  activeEntity: string;
  entities: CombatEntity[];
  turnOrder: string[];
  currentAction?: CombatActionType;
  selectedTarget?: string;
  selectedPosition?: [number, number];
  comboMeter: number;      // Combo meter (0-100)
  environmentalObjects: EnvironmentalObject[];
  combatModifiers: CombatModifier[];
  turnHistory: CombatTurn[];
}

// Enhanced combat entity interface
export interface CombatEntity {
  id: string;
  name: string;
  type: 'player' | 'enemy' | 'ally' | 'neutral';
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  position: [number, number];
  stats: {
    strength: number;
    wisdom: number;
    agility: number;
    willpower: number;
    harmony: number;
    defense: number;
    resistance: number;
    accuracy: number;
    critical: number;
    speed: number;
  };
  statusEffects: StatusEffect[];
  immunities: StatusEffectType[];
  resistances: DamageType[];
  vulnerabilities: DamageType[];
  abilities: string[];
  equipment: Record<string, any>;
  ai?: {
    type: 'aggressive' | 'defensive' | 'support' | 'tactical';
    priority: string[];
    behaviors: string[];
  };
  hasActed: boolean;
  hasMoved: boolean;
  comboCount: number;      // Current combo count
  lastAction?: CombatActionType;
}

// Environmental object interface
export interface EnvironmentalObject {
  id: string;
  name: string;
  type: 'obstacle' | 'hazard' | 'interactive' | 'destructible' | 'movable';
  position: [number, number];
  size: [number, number];
  health?: number;         // For destructible objects
  effects: EnvironmentalEffect[];
  interactions: EnvironmentalInteraction[];
  description: string;
  sprite: string;
  animation?: string;
}

// Combat area interface
export interface CombatArea {
  id: string;
  name: string;
  description: string;
  size: [number, number];
  environmentalObjects: EnvironmentalObject[];
  hazards: EnvironmentalEffect[];
  interactiveElements: EnvironmentalObject[];
  lighting: {
    level: number;         // 0-1 brightness
    color: [number, number, number]; // RGB
    dynamic: boolean;      // Does lighting change
  };
  weather?: {
    type: 'clear' | 'rain' | 'storm' | 'fog' | 'snow';
    intensity: number;     // 0-1
    effects: StatusEffect[];
  };
}

// Combat AI interface
export interface CombatAI {
  id: string;
  name: string;
  description: string;
  type: 'aggressive' | 'defensive' | 'support' | 'tactical' | 'berserker' | 'sniper';
  behaviors: {
    attack: {
      priority: string[];
      conditions: string[];
      modifiers: CombatModifier[];
    };
    defend: {
      priority: string[];
      conditions: string[];
      modifiers: CombatModifier[];
    };
    move: {
      priority: string[];
      conditions: string[];
      modifiers: CombatModifier[];
    };
    ability: {
      priority: string[];
      conditions: string[];
      modifiers: CombatModifier[];
    };
  };
  decisionTree: {
    conditions: string[];
    actions: string[];
    weights: number[];
  }[];
}

// Combat event interface
export interface CombatEvent {
  type: 'damage' | 'heal' | 'status_effect' | 'combo' | 'environmental' | 'turn_start' | 'turn_end';
  source: string;
  target?: string;
  data: any;
  timestamp: number;
}

// Combat statistics interface
export interface CombatStats {
  totalDamage: number;
  totalHealing: number;
  criticalHits: number;
  misses: number;
  combos: number;
  statusEffectsApplied: number;
  environmentalInteractions: number;
  turns: number;
  duration: number;        // In seconds
}