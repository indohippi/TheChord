// Quest system types and interfaces

export type QuestType = 
  | 'main'        // Main story quests
  | 'side'        // Optional side quests
  | 'daily'       // Daily repeatable quests
  | 'weekly'      // Weekly repeatable quests
  | 'exploration' // Exploration-based quests
  | 'combat'      // Combat-focused quests
  | 'collection'  // Item collection quests
  | 'delivery'    // Item delivery quests
  | 'discovery'   // Discovery and lore quests
  | 'crafting';   // Crafting-based quests

export type QuestStatus = 
  | 'available'   // Quest is available to accept
  | 'active'      // Quest is currently active
  | 'completed'   // Quest has been completed
  | 'failed'      // Quest has failed
  | 'locked'      // Quest is locked (requirements not met)
  | 'expired';    // Quest has expired

export type QuestObjectiveType = 
  | 'kill'        // Kill specific enemies
  | 'collect'     // Collect specific items
  | 'deliver'     // Deliver items to NPC
  | 'explore'     // Explore specific areas
  | 'talk'        // Talk to specific NPCs
  | 'craft'       // Craft specific items
  | 'use'         // Use specific items
  | 'reach'       // Reach specific locations
  | 'survive'     // Survive for specific time
  | 'discover';   // Discover specific lore/echoes

export type QuestRewardType = 
  | 'experience'  // Experience points
  | 'gold'        // Gold currency
  | 'echoes'      // Echo currency
  | 'item'        // Specific items
  | 'equipment'   // Equipment items
  | 'ability'     // New abilities
  | 'skill_point' // Skill points
  | 'reputation'; // Reputation with factions

// Quest objective interface
export interface QuestObjective {
  id: string;
  type: QuestObjectiveType;
  description: string;
  target: string;           // What needs to be done (enemy ID, item ID, etc.)
  quantity: number;         // How many times
  current: number;          // Current progress
  optional: boolean;        // Is this objective optional?
  hidden: boolean;          // Is this objective hidden until revealed?
}

// Quest reward interface
export interface QuestReward {
  type: QuestRewardType;
  value: number;            // Amount or item ID
  quantity?: number;        // For items
  description: string;      // Description of the reward
}

// Quest condition interface
export interface QuestCondition {
  type: 'level' | 'quest' | 'item' | 'stat' | 'zone' | 'faction';
  value: string | number;
  operator: '>=' | '<=' | '==' | '!=' | '>' | '<';
  description: string;
}

// Quest interface
export interface Quest {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // Detailed description
  type: QuestType;
  status: QuestStatus;
  
  // Quest requirements
  level: number;            // Minimum level required
  prerequisites: string[];  // Quest IDs that must be completed
  conditions: QuestCondition[]; // Additional conditions
  
  // Quest objectives
  objectives: QuestObjective[];
  
  // Quest rewards
  rewards: QuestReward[];
  
  // Quest metadata
  giver: string;            // NPC or source that gives the quest
  zone: string;             // Zone where quest takes place
  timeLimit?: number;       // Time limit in seconds (optional)
  repeatable: boolean;      // Can quest be repeated?
  cooldown?: number;        // Cooldown between repeats in seconds
  
  // Quest progression
  startTime?: number;       // When quest was started
  completedTime?: number;   // When quest was completed
  progress: number;         // Overall quest progress (0-100)
  
  // Quest flags
  flags: {
    isMainQuest: boolean;
    isUrgent: boolean;
    isSecret: boolean;
    affectsStory: boolean;
  };
}

// Quest log interface
export interface QuestLog {
  activeQuests: Quest[];
  completedQuests: string[]; // Quest IDs
  failedQuests: string[];    // Quest IDs
  availableQuests: Quest[];
  lockedQuests: Quest[];
  
  // Quest tracking
  totalQuestsCompleted: number;
  mainQuestsCompleted: number;
  sideQuestsCompleted: number;
  
  // Quest categories
  questCategories: {
    [key in QuestType]: {
      completed: number;
      available: number;
      active: number;
    };
  };
}

// Quest event interface
export interface QuestEvent {
  type: 'objective_complete' | 'quest_complete' | 'quest_failed' | 'quest_available';
  questId: string;
  objectiveId?: string;
  timestamp: number;
  data?: any;
}

// Quest chain interface
export interface QuestChain {
  id: string;
  name: string;
  description: string;
  quests: string[];         // Quest IDs in order
  currentQuest: number;     // Index of current quest in chain
  completed: boolean;
  rewards: QuestReward[];   // Chain completion rewards
}

// Faction interface
export interface Faction {
  id: string;
  name: string;
  description: string;
  reputation: number;       // Player's reputation with faction (-100 to 100)
  level: number;            // Faction level (0-10)
  quests: string[];         // Available quest IDs
  rewards: QuestReward[];   // Faction rewards
}

// Quest dialogue interface
export interface QuestDialogue {
  questId: string;
  stage: 'offer' | 'accept' | 'progress' | 'complete' | 'fail';
  npcId: string;
  text: string;
  options?: {
    text: string;
    action: 'accept' | 'decline' | 'complete' | 'continue';
    nextDialogue?: string;
  }[];
}