// Skill system types and interfaces

export type SkillCategory = 
  | 'combat'      // Combat-related skills
  | 'magic'       // Magical abilities
  | 'survival'    // Survival and utility skills
  | 'social'      // Social interaction skills
  | 'crafting'    // Crafting and creation skills
  | 'exploration' // Exploration and discovery skills;

export type SkillType = 
  | 'passive'     // Always active bonuses
  | 'active'      // Activated abilities
  | 'aura'        // Area of effect effects
  | 'toggle'      // Can be turned on/off
  | 'triggered';  // Triggered by specific events

export type SkillRequirementType = 
  | 'level'       // Character level requirement
  | 'stat'        // Stat requirement
  | 'skill'       // Other skill requirement
  | 'quest'       // Quest completion requirement
  | 'item';       // Item requirement

// Skill effect interface
export interface SkillEffect {
  type: 'stat_boost' | 'damage_bonus' | 'resistance' | 'ability_unlock' | 'special_effect';
  target: string;           // What the effect targets
  value: number;            // Effect value
  duration?: number;        // Duration in seconds (for temporary effects)
  condition?: string;       // Condition for the effect to apply
}

// Skill requirement interface
export interface SkillRequirement {
  type: SkillRequirementType;
  value: string | number;   // Requirement value
  description: string;      // Human-readable description
}

// Skill interface
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  type: SkillType;
  level: number;            // Current skill level (0 = not learned)
  maxLevel: number;         // Maximum skill level
  cost: number;             // Cost to learn/upgrade (skill points)
  
  // Requirements
  requirements: SkillRequirement[];
  
  // Effects per level
  effects: SkillEffect[];
  
  // Skill metadata
  icon: string;             // Icon path
  flavorText?: string;      // Lore text
  cooldown?: number;        // Cooldown in seconds (for active skills)
  energyCost?: number;      // Energy cost (for active skills)
  
  // Skill tree position
  position: {
    x: number;              // X position in skill tree
    y: number;              // Y position in skill tree
  };
  
  // Connections to other skills
  connections: string[];    // Skill IDs this skill connects to
  prerequisites: string[];  // Skill IDs required to learn this skill
}

// Skill tree interface
export interface SkillTree {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  skills: Skill[];
  maxPoints: number;        // Maximum points that can be spent in this tree
  currentPoints: number;    // Current points spent in this tree
}

// Skill point allocation interface
export interface SkillPointAllocation {
  skillId: string;
  points: number;
  timestamp: number;
}

// Skill cooldown interface
export interface SkillCooldown {
  skillId: string;
  endTime: number;
}

// Skill activation interface
export interface SkillActivation {
  skillId: string;
  target?: string;          // Target for targeted skills
  position?: [number, number, number]; // Position for area skills
  timestamp: number;
}

// Skill experience interface
export interface SkillExperience {
  skillId: string;
  experience: number;
  level: number;
  experienceToNext: number;
}

// Skill mastery interface
export interface SkillMastery {
  skillId: string;
  masteryLevel: number;     // 0-100 mastery level
  experience: number;       // Total experience gained
  uses: number;            // Number of times used
  lastUsed: number;        // Timestamp of last use
}

// Skill book interface (for learning new skills)
export interface SkillBook {
  id: string;
  name: string;
  description: string;
  skills: string[];         // Skill IDs that can be learned
  requirements: SkillRequirement[];
  cost: number;            // Cost to learn from this book
  consumable: boolean;     // Is the book consumed when used?
}

// Skill trainer interface
export interface SkillTrainer {
  id: string;
  name: string;
  description: string;
  category: SkillCategory;
  skills: string[];         // Skills this trainer can teach
  level: number;           // Trainer level
  reputation: number;      // Required reputation with trainer
  location: string;        // Where to find this trainer
}

// Skill quest interface
export interface SkillQuest {
  id: string;
  name: string;
  description: string;
  skillId: string;         // Skill that will be unlocked
  objectives: {
    type: string;
    description: string;
    target: string;
    quantity: number;
  }[];
  rewards: {
    type: string;
    value: any;
  }[];
}