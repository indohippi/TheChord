import { create } from 'zustand';
import { Player, GameSession, ChatMessage, LeaderboardEntry, MultiplayerEvent, ConnectionState, NetworkMessage } from '@shared/multiplayerTypes';

interface MultiplayerStore {
  // Connection state
  connection: ConnectionState;
  
  // Current session
  currentSession: GameSession | null;
  
  // Players
  players: Player[];
  localPlayer: Player | null;
  
  // Chat
  chatMessages: ChatMessage[];
  
  // Leaderboards
  leaderboards: Record<string, LeaderboardEntry[]>;
  
  // Events
  events: MultiplayerEvent[];
  
  // Actions
  connect: (serverUrl: string) => Promise<void>;
  disconnect: () => void;
  createSession: (session: Omit<GameSession, 'id' | 'createdAt' | 'players'>) => Promise<void>;
  joinSession: (sessionId: string, password?: string) => Promise<void>;
  leaveSession: () => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  
  // Player management
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
  setLocalPlayer: (player: Player) => void;
  
  // Chat
  sendChatMessage: (message: string, type: 'global' | 'team' | 'whisper', targetId?: string) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  
  // Leaderboards
  updateLeaderboard: (category: string, entries: LeaderboardEntry[]) => void;
  getLeaderboard: (category: string, period: string) => LeaderboardEntry[];
  
  // Events
  addEvent: (event: MultiplayerEvent) => void;
  clearEvents: () => void;
  
  // Network
  sendNetworkMessage: (message: NetworkMessage) => void;
  handleMessage: (message: NetworkMessage) => void;
  
  // Utilities
  isHost: () => boolean;
  isConnected: () => boolean;
  getPlayer: (playerId: string) => Player | null;
  getPlayersInRange: (position: { x: number; y: number; z: number }, range: number) => Player[];
}

export const useMultiplayer = create<MultiplayerStore>((set, get) => ({
  // Initial state
  connection: {
    isConnected: false,
    isHost: false,
    latency: 0,
    lastPing: new Date(),
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  },
  
  currentSession: null,
  players: [],
  localPlayer: null,
  chatMessages: [],
  leaderboards: {},
  events: [],

  // Connect to server
  connect: async (serverUrl: string) => {
    try {
      // Simulate connection
      set(state => ({
        connection: {
          ...state.connection,
          isConnected: true,
          latency: Math.random() * 50 + 20
        }
      }));
      
      // Start ping interval
      const pingInterval = setInterval(() => {
        set(state => ({
          connection: {
            ...state.connection,
            lastPing: new Date(),
            latency: Math.random() * 50 + 20
          }
        }));
      }, 1000);
      
      // Store interval for cleanup
      (get() as any).pingInterval = pingInterval;
      
    } catch (error) {
      console.error('Failed to connect to server:', error);
      throw error;
    }
  },

  // Disconnect from server
  disconnect: () => {
    const state = get();
    if ((state as any).pingInterval) {
      clearInterval((state as any).pingInterval);
    }
    
    set({
      connection: {
        isConnected: false,
        isHost: false,
        latency: 0,
        lastPing: new Date(),
        reconnectAttempts: 0,
        maxReconnectAttempts: 5
      },
      currentSession: null,
      players: [],
      localPlayer: null
    });
  },

  // Create session
  createSession: async (sessionData: Omit<GameSession, 'id' | 'createdAt' | 'players'>) => {
    const session: GameSession = {
      ...sessionData,
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      players: []
    };
    
    set({
      currentSession: session,
      connection: {
        ...get().connection,
        isHost: true
      }
    });
  },

  // Join session
  joinSession: async (sessionId: string, password?: string) => {
    // Simulate joining session
    const session: GameSession = {
      id: sessionId,
      name: 'Test Session',
      hostId: 'host_123',
      players: [],
      maxPlayers: 4,
      isPrivate: false,
      status: 'waiting',
      gameMode: 'coop',
      difficulty: 'normal',
      zone: 'whispering_woods',
      createdAt: new Date(),
      settings: {
        allowSpectators: true,
        friendlyFire: false,
        sharedLoot: true,
        respawnEnabled: true
      }
    };
    
    set({ currentSession: session });
  },

  // Leave session
  leaveSession: () => {
    set({
      currentSession: null,
      players: [],
      localPlayer: null
    });
  },

  // Start session
  startSession: () => {
    const state = get();
    if (state.currentSession && state.isHost()) {
      set(state => ({
        currentSession: {
          ...state.currentSession!,
          status: 'playing',
          startedAt: new Date()
        }
      }));
    }
  },

  // Pause session
  pauseSession: () => {
    const state = get();
    if (state.currentSession && state.isHost()) {
      set(state => ({
        currentSession: {
          ...state.currentSession!,
          status: 'paused'
        }
      }));
    }
  },

  // Resume session
  resumeSession: () => {
    const state = get();
    if (state.currentSession && state.isHost()) {
      set(state => ({
        currentSession: {
          ...state.currentSession!,
          status: 'playing'
        }
      }));
    }
  },

  // End session
  endSession: () => {
    const state = get();
    if (state.currentSession && state.isHost()) {
      set(state => ({
        currentSession: {
          ...state.currentSession!,
          status: 'finished',
          endedAt: new Date()
        }
      }));
    }
  },

  // Add player
  addPlayer: (player: Player) => {
    set(state => ({
      players: [...state.players.filter(p => p.id !== player.id), player]
    }));
  },

  // Remove player
  removePlayer: (playerId: string) => {
    set(state => ({
      players: state.players.filter(p => p.id !== playerId)
    }));
  },

  // Update player
  updatePlayer: (playerId: string, updates: Partial<Player>) => {
    set(state => ({
      players: state.players.map(p => 
        p.id === playerId ? { ...p, ...updates } : p
      )
    }));
  },

  // Set local player
  setLocalPlayer: (player: Player) => {
    set({ localPlayer: player });
  },

  // Send chat message
  sendChatMessage: (message: string, type: 'global' | 'team' | 'whisper', targetId?: string) => {
    const state = get();
    if (!state.localPlayer) return;
    
    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      playerId: state.localPlayer.id,
      playerName: state.localPlayer.name,
      message,
      timestamp: new Date(),
      type,
      targetId
    };
    
    state.addChatMessage(chatMessage);
  },

  // Add chat message
  addChatMessage: (message: ChatMessage) => {
    set(state => ({
      chatMessages: [...state.chatMessages, message]
    }));
  },

  // Clear chat
  clearChat: () => {
    set({ chatMessages: [] });
  },

  // Update leaderboard
  updateLeaderboard: (category: string, entries: LeaderboardEntry[]) => {
    set(state => ({
      leaderboards: {
        ...state.leaderboards,
        [category]: entries
      }
    }));
  },

  // Get leaderboard
  getLeaderboard: (category: string, period: string) => {
    const state = get();
    const key = `${category}_${period}`;
    return state.leaderboards[key] || [];
  },

  // Add event
  addEvent: (event: MultiplayerEvent) => {
    set(state => ({
      events: [...state.events, event]
    }));
  },

  // Clear events
  clearEvents: () => {
    set({ events: [] });
  },

  // Send network message
  sendNetworkMessage: (message: NetworkMessage) => {
    // Simulate sending message
    console.log('Sending message:', message);
  },

  // Handle network message
  handleMessage: (message: NetworkMessage) => {
    // Handle different message types
    switch (message.type) {
      case 'player_join':
        get().addPlayer(message.data);
        break;
      case 'player_leave':
        get().removePlayer(message.data.playerId);
        break;
      case 'player_update':
        get().updatePlayer(message.data.playerId, message.data.updates);
        break;
      case 'chat_message':
        get().addChatMessage(message.data);
        break;
      case 'session_update':
        set({ currentSession: message.data });
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  },

  // Check if host
  isHost: () => {
    const state = get();
    return state.connection.isHost;
  },

  // Check if connected
  isConnected: () => {
    const state = get();
    return state.connection.isConnected;
  },

  // Get player by ID
  getPlayer: (playerId: string) => {
    const state = get();
    return state.players.find(p => p.id === playerId) || null;
  },

  // Get players in range
  getPlayersInRange: (position: { x: number; y: number; z: number }, range: number) => {
    const state = get();
    return state.players.filter(player => {
      const distance = Math.sqrt(
        Math.pow(player.position.x - position.x, 2) +
        Math.pow(player.position.y - position.y, 2) +
        Math.pow(player.position.z - position.z, 2)
      );
      return distance <= range;
    });
  }
}));