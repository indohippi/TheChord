export interface Player {
  id: string;
  name: string;
  characterClass: string;
  level: number;
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  position: { x: number; y: number; z: number };
  isOnline: boolean;
  lastSeen: Date;
  stats: {
    strength: number;
    intelligence: number;
    wisdom: number;
    dexterity: number;
    constitution: number;
    charisma: number;
  };
  equipment: {
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  abilities: string[];
  experience: number;
  echoes: number;
  gold: number;
}

export interface GameSession {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  isPrivate: boolean;
  password?: string;
  status: 'waiting' | 'playing' | 'paused' | 'finished';
  gameMode: 'coop' | 'pvp' | 'raid';
  difficulty: 'easy' | 'normal' | 'hard' | 'nightmare';
  zone: string;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  settings: {
    allowSpectators: boolean;
    friendlyFire: boolean;
    sharedLoot: boolean;
    respawnEnabled: boolean;
    timeLimit?: number;
  };
}

export interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  type: 'global' | 'team' | 'whisper' | 'system';
  targetId?: string;
}

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  rank: number;
  category: 'experience' | 'echoes' | 'quests' | 'combat' | 'exploration';
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface MultiplayerEvent {
  id: string;
  type: 'player_join' | 'player_leave' | 'player_move' | 'player_attack' | 'player_use_ability' | 'player_die' | 'player_respawn' | 'item_pickup' | 'quest_complete' | 'zone_change' | 'chat_message';
  playerId: string;
  sessionId: string;
  data: any;
  timestamp: Date;
}

export interface ConnectionState {
  isConnected: boolean;
  isHost: boolean;
  sessionId?: string;
  playerId?: string;
  latency: number;
  lastPing: Date;
  reconnectAttempts: number;
  maxReconnectAttempts: number;
}

export interface NetworkMessage {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  senderId: string;
  recipientId?: string;
  reliable: boolean;
  priority: 'low' | 'normal' | 'high' | 'critical';
}