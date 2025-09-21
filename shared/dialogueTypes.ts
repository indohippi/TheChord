export interface DialogueNode {
  id: string;
  speaker: string;
  text: string;
  emotion?: 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised' | 'worried';
  options?: DialogueOption[];
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
  nextNodeId?: string;
}

export interface DialogueOption {
  id: string;
  text: string;
  nextNodeId: string;
  conditions?: DialogueCondition[];
  effects?: DialogueEffect[];
  skillCheck?: SkillCheck;
}

export interface DialogueCondition {
  type: 'quest' | 'item' | 'skill' | 'relationship' | 'flag' | 'level';
  value: string | number;
  operator: 'equals' | 'greater' | 'less' | 'has' | 'not_has';
}

export interface DialogueEffect {
  type: 'quest' | 'item' | 'relationship' | 'flag' | 'experience' | 'gold' | 'echoes';
  value: string | number;
  operation: 'add' | 'remove' | 'set' | 'complete' | 'start' | 'fail';
}

export interface SkillCheck {
  skill: string;
  difficulty: number;
  successNodeId: string;
  failureNodeId: string;
}

export interface DialogueSequence {
  id: string;
  name: string;
  nodes: DialogueNode[];
  startNodeId: string;
  isRepeatable?: boolean;
  cooldown?: number; // in minutes
}

export interface CharacterRelationship {
  characterId: string;
  relationship: 'stranger' | 'acquaintance' | 'friend' | 'close_friend' | 'ally' | 'rival' | 'enemy';
  trust: number; // 0-100
  respect: number; // 0-100
  lastInteraction?: Date;
  interactionCount: number;
}

export interface DialogueFlag {
  id: string;
  value: any;
  setDate: Date;
  expiresAt?: Date;
}

export interface DialogueHistory {
  sequenceId: string;
  nodeId: string;
  timestamp: Date;
  playerChoice?: string;
  outcome?: 'success' | 'failure' | 'neutral';
}