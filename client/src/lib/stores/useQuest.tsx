import { create } from "zustand";
import { 
  Quest, 
  QuestLog, 
  QuestStatus, 
  QuestType, 
  QuestObjective, 
  QuestReward,
  QuestEvent,
  QuestChain,
  Faction
} from "@shared/questTypes";

interface QuestState {
  // Quest log
  questLog: QuestLog;
  
  // Quest chains
  questChains: QuestChain[];
  
  // Factions
  factions: Faction[];
  
  // Quest events
  questEvents: QuestEvent[];
  
  // Actions
  acceptQuest: (questId: string) => boolean;
  completeQuest: (questId: string) => boolean;
  failQuest: (questId: string) => boolean;
  abandonQuest: (questId: string) => boolean;
  
  // Objective tracking
  updateObjective: (questId: string, objectiveId: string, progress: number) => void;
  completeObjective: (questId: string, objectiveId: string) => void;
  
  // Quest discovery
  discoverQuest: (questId: string) => void;
  checkQuestAvailability: (questId: string) => boolean;
  
  // Quest management
  getActiveQuests: () => Quest[];
  getCompletedQuests: () => Quest[];
  getAvailableQuests: () => Quest[];
  getQuestById: (questId: string) => Quest | undefined;
  
  // Quest chain management
  startQuestChain: (chainId: string) => boolean;
  completeQuestChain: (chainId: string) => boolean;
  getCurrentQuestInChain: (chainId: string) => Quest | undefined;
  
  // Faction management
  updateFactionReputation: (factionId: string, amount: number) => void;
  getFactionLevel: (factionId: string) => number;
  
  // Quest tracking
  getQuestProgress: (questId: string) => number;
  getTotalQuestProgress: () => number;
  
  // Utility
  resetQuestLog: () => void;
  addQuestEvent: (event: QuestEvent) => void;
}

// Initial quest log
const initialQuestLog: QuestLog = {
  activeQuests: [],
  completedQuests: [],
  failedQuests: [],
  availableQuests: [],
  lockedQuests: [],
  totalQuestsCompleted: 0,
  mainQuestsCompleted: 0,
  sideQuestsCompleted: 0,
  questCategories: {
    main: { completed: 0, available: 0, active: 0 },
    side: { completed: 0, available: 0, active: 0 },
    daily: { completed: 0, available: 0, active: 0 },
    weekly: { completed: 0, available: 0, active: 0 },
    exploration: { completed: 0, available: 0, active: 0 },
    combat: { completed: 0, available: 0, active: 0 },
    collection: { completed: 0, available: 0, active: 0 },
    delivery: { completed: 0, available: 0, active: 0 },
    discovery: { completed: 0, available: 0, active: 0 },
    crafting: { completed: 0, available: 0, active: 0 }
  }
};

export const useQuest = create<QuestState>((set, get) => ({
  // Initial state
  questLog: initialQuestLog,
  questChains: [],
  factions: [],
  questEvents: [],
  
  // Accept quest
  acceptQuest: (questId) => {
    const state = get();
    const quest = state.questLog.availableQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in available quests`);
      return false;
    }
    
    // Check if player can accept the quest
    if (!state.checkQuestAvailability(questId)) {
      console.log(`Quest ${questId} requirements not met`);
      return false;
    }
    
    // Move quest from available to active
    const updatedQuest = { ...quest, status: 'active' as QuestStatus, startTime: Date.now() };
    
    set({
      questLog: {
        ...state.questLog,
        activeQuests: [...state.questLog.activeQuests, updatedQuest],
        availableQuests: state.questLog.availableQuests.filter(q => q.id !== questId),
        questCategories: {
          ...state.questLog.questCategories,
          [quest.type]: {
            ...state.questLog.questCategories[quest.type],
            active: state.questLog.questCategories[quest.type].active + 1,
            available: state.questLog.questCategories[quest.type].available - 1
          }
        }
      }
    });
    
    // Add quest event
    state.addQuestEvent({
      type: 'quest_available',
      questId,
      timestamp: Date.now()
    });
    
    console.log(`Accepted quest: ${quest.title}`);
    return true;
  },
  
  // Complete quest
  completeQuest: (questId) => {
    const state = get();
    const quest = state.questLog.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in active quests`);
      return false;
    }
    
    // Check if all objectives are completed
    const allObjectivesComplete = quest.objectives.every(obj => 
      obj.current >= obj.quantity || obj.optional
    );
    
    if (!allObjectivesComplete) {
      console.log(`Quest ${questId} objectives not complete`);
      return false;
    }
    
    // Move quest from active to completed
    const completedQuest = { ...quest, status: 'completed' as QuestStatus, completedTime: Date.now() };
    
    set({
      questLog: {
        ...state.questLog,
        activeQuests: state.questLog.activeQuests.filter(q => q.id !== questId),
        completedQuests: [...state.questLog.completedQuests, questId],
        totalQuestsCompleted: state.questLog.totalQuestsCompleted + 1,
        mainQuestsCompleted: quest.type === 'main' ? state.questLog.mainQuestsCompleted + 1 : state.questLog.mainQuestsCompleted,
        sideQuestsCompleted: quest.type === 'side' ? state.questLog.sideQuestsCompleted + 1 : state.questLog.sideQuestsCompleted,
        questCategories: {
          ...state.questLog.questCategories,
          [quest.type]: {
            ...state.questLog.questCategories[quest.type],
            completed: state.questLog.questCategories[quest.type].completed + 1,
            active: state.questLog.questCategories[quest.type].active - 1
          }
        }
      }
    });
    
    // Add quest event
    state.addQuestEvent({
      type: 'quest_complete',
      questId,
      timestamp: Date.now()
    });
    
    // Apply quest rewards
    quest.rewards.forEach(reward => {
      // This would integrate with other systems (inventory, character, etc.)
      console.log(`Quest reward: ${reward.description}`);
    });
    
    console.log(`Completed quest: ${quest.title}`);
    return true;
  },
  
  // Fail quest
  failQuest: (questId) => {
    const state = get();
    const quest = state.questLog.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in active quests`);
      return false;
    }
    
    // Move quest from active to failed
    set({
      questLog: {
        ...state.questLog,
        activeQuests: state.questLog.activeQuests.filter(q => q.id !== questId),
        failedQuests: [...state.questLog.failedQuests, questId],
        questCategories: {
          ...state.questLog.questCategories,
          [quest.type]: {
            ...state.questLog.questCategories[quest.type],
            active: state.questLog.questCategories[quest.type].active - 1
          }
        }
      }
    });
    
    // Add quest event
    state.addQuestEvent({
      type: 'quest_failed',
      questId,
      timestamp: Date.now()
    });
    
    console.log(`Failed quest: ${quest.title}`);
    return true;
  },
  
  // Abandon quest
  abandonQuest: (questId) => {
    const state = get();
    const quest = state.questLog.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in active quests`);
      return false;
    }
    
    // Move quest from active to available (if repeatable) or remove
    if (quest.repeatable) {
      const abandonedQuest = { ...quest, status: 'available' as QuestStatus };
      
      set({
        questLog: {
          ...state.questLog,
          activeQuests: state.questLog.activeQuests.filter(q => q.id !== questId),
          availableQuests: [...state.questLog.availableQuests, abandonedQuest],
          questCategories: {
            ...state.questLog.questCategories,
            [quest.type]: {
              ...state.questLog.questCategories[quest.type],
              active: state.questLog.questCategories[quest.type].active - 1,
              available: state.questLog.questCategories[quest.type].available + 1
            }
          }
        }
      });
    } else {
      set({
        questLog: {
          ...state.questLog,
          activeQuests: state.questLog.activeQuests.filter(q => q.id !== questId),
          questCategories: {
            ...state.questLog.questCategories,
            [quest.type]: {
              ...state.questLog.questCategories[quest.type],
              active: state.questLog.questCategories[quest.type].active - 1
            }
          }
        }
      });
    }
    
    console.log(`Abandoned quest: ${quest.title}`);
    return true;
  },
  
  // Update objective progress
  updateObjective: (questId, objectiveId, progress) => {
    const state = get();
    const quest = state.questLog.activeQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in active quests`);
      return;
    }
    
    const objective = quest.objectives.find(obj => obj.id === objectiveId);
    if (!objective) {
      console.log(`Objective ${objectiveId} not found in quest ${questId}`);
      return;
    }
    
    // Update objective progress
    objective.current = Math.min(progress, objective.quantity);
    
    // Update quest progress
    const totalProgress = quest.objectives.reduce((sum, obj) => {
      if (obj.optional) return sum;
      return sum + (obj.current / obj.quantity);
    }, 0);
    
    quest.progress = Math.min(100, (totalProgress / quest.objectives.filter(obj => !obj.optional).length) * 100);
    
    // Check if objective is complete
    if (objective.current >= objective.quantity) {
      state.completeObjective(questId, objectiveId);
    }
    
    set({ questLog: { ...state.questLog } });
  },
  
  // Complete objective
  completeObjective: (questId, objectiveId) => {
    const state = get();
    
    // Add quest event
    state.addQuestEvent({
      type: 'objective_complete',
      questId,
      objectiveId,
      timestamp: Date.now()
    });
    
    console.log(`Completed objective ${objectiveId} in quest ${questId}`);
  },
  
  // Discover quest
  discoverQuest: (questId) => {
    const state = get();
    const quest = state.questLog.lockedQuests.find(q => q.id === questId);
    
    if (!quest) {
      console.log(`Quest ${questId} not found in locked quests`);
      return;
    }
    
    // Move quest from locked to available
    const discoveredQuest = { ...quest, status: 'available' as QuestStatus };
    
    set({
      questLog: {
        ...state.questLog,
        lockedQuests: state.questLog.lockedQuests.filter(q => q.id !== questId),
        availableQuests: [...state.questLog.availableQuests, discoveredQuest],
        questCategories: {
          ...state.questLog.questCategories,
          [quest.type]: {
            ...state.questLog.questCategories[quest.type],
            available: state.questLog.questCategories[quest.type].available + 1
          }
        }
      }
    });
    
    console.log(`Discovered quest: ${quest.title}`);
  },
  
  // Check quest availability
  checkQuestAvailability: (questId) => {
    const state = get();
    const quest = state.questLog.availableQuests.find(q => q.id === questId) ||
                  state.questLog.lockedQuests.find(q => q.id === questId);
    
    if (!quest) {
      return false;
    }
    
    // Check prerequisites
    const prerequisitesMet = quest.prerequisites.every(prereqId => 
      state.questLog.completedQuests.includes(prereqId)
    );
    
    if (!prerequisitesMet) {
      return false;
    }
    
    // Check conditions
    // This would integrate with other systems to check level, stats, etc.
    
    return true;
  },
  
  // Get active quests
  getActiveQuests: () => {
    return get().questLog.activeQuests;
  },
  
  // Get completed quests
  getCompletedQuests: () => {
    const state = get();
    return state.questLog.completedQuests.map(questId => 
      state.questLog.availableQuests.find(q => q.id === questId) ||
      state.questLog.activeQuests.find(q => q.id === questId) ||
      state.questLog.lockedQuests.find(q => q.id === questId)
    ).filter(Boolean) as Quest[];
  },
  
  // Get available quests
  getAvailableQuests: () => {
    return get().questLog.availableQuests;
  },
  
  // Get quest by ID
  getQuestById: (questId) => {
    const state = get();
    return state.questLog.activeQuests.find(q => q.id === questId) ||
           state.questLog.availableQuests.find(q => q.id === questId) ||
           state.questLog.lockedQuests.find(q => q.id === questId);
  },
  
  // Start quest chain
  startQuestChain: (chainId) => {
    const state = get();
    const chain = state.questChains.find(c => c.id === chainId);
    
    if (!chain) {
      console.log(`Quest chain ${chainId} not found`);
      return false;
    }
    
    if (chain.completed) {
      console.log(`Quest chain ${chainId} already completed`);
      return false;
    }
    
    // Start the first quest in the chain
    const firstQuestId = chain.quests[0];
    return state.acceptQuest(firstQuestId);
  },
  
  // Complete quest chain
  completeQuestChain: (chainId) => {
    const state = get();
    const chain = state.questChains.find(c => c.id === chainId);
    
    if (!chain) {
      console.log(`Quest chain ${chainId} not found`);
      return false;
    }
    
    // Check if all quests in chain are completed
    const allQuestsComplete = chain.quests.every(questId => 
      state.questLog.completedQuests.includes(questId)
    );
    
    if (!allQuestsComplete) {
      console.log(`Not all quests in chain ${chainId} are completed`);
      return false;
    }
    
    // Mark chain as completed
    set({
      questChains: state.questChains.map(c => 
        c.id === chainId ? { ...c, completed: true } : c
      )
    });
    
    console.log(`Completed quest chain: ${chain.name}`);
    return true;
  },
  
  // Get current quest in chain
  getCurrentQuestInChain: (chainId) => {
    const state = get();
    const chain = state.questChains.find(c => c.id === chainId);
    
    if (!chain || chain.completed) {
      return undefined;
    }
    
    // Find the first incomplete quest in the chain
    for (const questId of chain.quests) {
      if (!state.questLog.completedQuests.includes(questId)) {
        return state.getQuestById(questId);
      }
    }
    
    return undefined;
  },
  
  // Update faction reputation
  updateFactionReputation: (factionId, amount) => {
    const state = get();
    const faction = state.factions.find(f => f.id === factionId);
    
    if (!faction) {
      console.log(`Faction ${factionId} not found`);
      return;
    }
    
    // Update reputation
    faction.reputation = Math.max(-100, Math.min(100, faction.reputation + amount));
    
    // Update faction level based on reputation
    if (faction.reputation >= 80) faction.level = 10;
    else if (faction.reputation >= 60) faction.level = 8;
    else if (faction.reputation >= 40) faction.level = 6;
    else if (faction.reputation >= 20) faction.level = 4;
    else if (faction.reputation >= 0) faction.level = 2;
    else faction.level = 0;
    
    set({ factions: [...state.factions] });
    
    console.log(`Updated reputation for ${faction.name}: ${faction.reputation}`);
  },
  
  // Get faction level
  getFactionLevel: (factionId) => {
    const state = get();
    const faction = state.factions.find(f => f.id === factionId);
    return faction ? faction.level : 0;
  },
  
  // Get quest progress
  getQuestProgress: (questId) => {
    const quest = get().getQuestById(questId);
    return quest ? quest.progress : 0;
  },
  
  // Get total quest progress
  getTotalQuestProgress: () => {
    const state = get();
    const totalQuests = state.questLog.availableQuests.length + 
                       state.questLog.activeQuests.length + 
                       state.questLog.completedQuests.length;
    
    return totalQuests > 0 ? (state.questLog.totalQuestsCompleted / totalQuests) * 100 : 0;
  },
  
  // Reset quest log
  resetQuestLog: () => {
    set({
      questLog: initialQuestLog,
      questChains: [],
      factions: [],
      questEvents: []
    });
  },
  
  // Add quest event
  addQuestEvent: (event) => {
    set(state => ({
      questEvents: [...state.questEvents, event]
    }));
  }
}));