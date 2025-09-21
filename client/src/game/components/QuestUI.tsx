import { useState, useEffect } from 'react';
import { useQuest } from '@/lib/stores/useQuest';
import { Quest, QuestType, QuestStatus } from '@shared/questTypes';

interface QuestUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestUI({ isOpen, onClose }: QuestUIProps) {
  const {
    questLog,
    acceptQuest,
    completeQuest,
    abandonQuest,
    getActiveQuests,
    getAvailableQuests,
    getCompletedQuests,
    getQuestById
  } = useQuest();

  const [selectedTab, setSelectedTab] = useState<'active' | 'available' | 'completed'>('active');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [filterType, setFilterType] = useState<QuestType | 'all'>('all');

  // Get quests based on current tab and filter
  const getFilteredQuests = (): Quest[] => {
    let quests: Quest[] = [];
    
    switch (selectedTab) {
      case 'active':
        quests = getActiveQuests();
        break;
      case 'available':
        quests = getAvailableQuests();
        break;
      case 'completed':
        quests = getCompletedQuests();
        break;
    }
    
    if (filterType !== 'all') {
      quests = quests.filter(quest => quest.type === filterType);
    }
    
    return quests;
  };

  // Get quest type color
  const getQuestTypeColor = (type: QuestType): string => {
    switch (type) {
      case 'main': return '#ef4444';
      case 'side': return '#3b82f6';
      case 'daily': return '#10b981';
      case 'weekly': return '#8b5cf6';
      case 'exploration': return '#f59e0b';
      case 'combat': return '#dc2626';
      case 'collection': return '#059669';
      case 'delivery': return '#7c3aed';
      case 'discovery': return '#0891b2';
      case 'crafting': return '#ea580c';
      default: return '#6b7280';
    }
  };

  // Get quest status color
  const getQuestStatusColor = (status: QuestStatus): string => {
    switch (status) {
      case 'active': return '#10b981';
      case 'available': return '#3b82f6';
      case 'completed': return '#6b7280';
      case 'failed': return '#ef4444';
      case 'locked': return '#9ca3af';
      case 'expired': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Handle quest actions
  const handleAcceptQuest = (questId: string) => {
    if (acceptQuest(questId)) {
      setSelectedTab('active');
    }
  };

  const handleCompleteQuest = (questId: string) => {
    if (completeQuest(questId)) {
      setSelectedTab('completed');
    }
  };

  const handleAbandonQuest = (questId: string) => {
    if (abandonQuest(questId)) {
      setSelectedTab('available');
    }
  };

  if (!isOpen) return null;

  const filteredQuests = getFilteredQuests();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-300">Quest Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 h-full">
          {/* Main content area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(['active', 'available', 'completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded capitalize ${
                    selectedTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab} ({tab === 'active' ? questLog.activeQuests.length : 
                           tab === 'available' ? questLog.availableQuests.length : 
                           questLog.completedQuests.length})
                </button>
              ))}
            </div>

            {/* Filter */}
            <div className="mb-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as QuestType | 'all')}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="all">All Types</option>
                <option value="main">Main Quests</option>
                <option value="side">Side Quests</option>
                <option value="daily">Daily Quests</option>
                <option value="weekly">Weekly Quests</option>
                <option value="exploration">Exploration</option>
                <option value="combat">Combat</option>
                <option value="collection">Collection</option>
                <option value="delivery">Delivery</option>
                <option value="discovery">Discovery</option>
                <option value="crafting">Crafting</option>
              </select>
            </div>

            {/* Quest list */}
            <div className="space-y-2 h-96 overflow-y-auto">
              {filteredQuests.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">📋</div>
                  <p>No quests found</p>
                </div>
              ) : (
                filteredQuests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`border rounded p-4 cursor-pointer transition-colors ${
                      selectedQuest?.id === quest.id
                        ? 'border-blue-500 bg-blue-900 bg-opacity-30'
                        : 'border-gray-600 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedQuest(quest)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white">{quest.title}</h3>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getQuestTypeColor(quest.type),
                              color: 'white'
                            }}
                          >
                            {quest.type}
                          </span>
                          <span
                            className="text-xs px-2 py-1 rounded"
                            style={{
                              backgroundColor: getQuestStatusColor(quest.status),
                              color: 'white'
                            }}
                          >
                            {quest.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{quest.description}</p>
                        <div className="text-xs text-gray-400">
                          Level {quest.level} • {quest.giver} • {quest.zone}
                        </div>
                      </div>
                      
                      {/* Quest actions */}
                      <div className="flex gap-2 ml-4">
                        {quest.status === 'available' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAcceptQuest(quest.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Accept
                          </button>
                        )}
                        {quest.status === 'active' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAbandonQuest(quest.id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Abandon
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quest details panel */}
          {selectedQuest && (
            <div className="w-80 border-l border-gray-600 pl-4">
              <div className="space-y-4">
                {/* Quest header */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{selectedQuest.title}</h3>
                  <div className="flex gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: getQuestTypeColor(selectedQuest.type),
                        color: 'white'
                      }}
                    >
                      {selectedQuest.type}
                    </span>
                    <span
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: getQuestStatusColor(selectedQuest.status),
                        color: 'white'
                      }}
                    >
                      {selectedQuest.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{selectedQuest.description}</p>
                  {selectedQuest.longDescription && (
                    <p className="text-gray-400 text-xs">{selectedQuest.longDescription}</p>
                  )}
                </div>

                {/* Quest info */}
                <div className="border border-gray-600 rounded p-3">
                  <h4 className="font-bold text-blue-300 mb-2">Quest Info</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span>{selectedQuest.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giver:</span>
                      <span>{selectedQuest.giver}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone:</span>
                      <span>{selectedQuest.zone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{selectedQuest.progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Objectives */}
                <div className="border border-gray-600 rounded p-3">
                  <h4 className="font-bold text-blue-300 mb-2">Objectives</h4>
                  <div className="space-y-2">
                    {selectedQuest.objectives.map((objective) => (
                      <div key={objective.id} className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className={objective.current >= objective.quantity ? 'text-green-400' : 'text-gray-300'}>
                            {objective.description}
                          </span>
                          <span className="text-gray-400">
                            {objective.current}/{objective.quantity}
                          </span>
                        </div>
                        {objective.optional && (
                          <span className="text-xs text-yellow-400">(Optional)</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rewards */}
                <div className="border border-gray-600 rounded p-3">
                  <h4 className="font-bold text-blue-300 mb-2">Rewards</h4>
                  <div className="space-y-1">
                    {selectedQuest.rewards.map((reward, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        {reward.description}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quest flags */}
                {selectedQuest.flags && (
                  <div className="border border-gray-600 rounded p-3">
                    <h4 className="font-bold text-blue-300 mb-2">Quest Flags</h4>
                    <div className="space-y-1 text-sm">
                      {selectedQuest.flags.isMainQuest && (
                        <div className="text-red-400">Main Story Quest</div>
                      )}
                      {selectedQuest.flags.isUrgent && (
                        <div className="text-yellow-400">Urgent</div>
                      )}
                      {selectedQuest.flags.isSecret && (
                        <div className="text-purple-400">Secret Quest</div>
                      )}
                      {selectedQuest.flags.affectsStory && (
                        <div className="text-blue-400">Affects Story</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-2">
                  {selectedQuest.status === 'available' && (
                    <button
                      onClick={() => handleAcceptQuest(selectedQuest.id)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    >
                      Accept Quest
                    </button>
                  )}
                  
                  {selectedQuest.status === 'active' && (
                    <button
                      onClick={() => handleAbandonQuest(selectedQuest.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                      Abandon Quest
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedQuest(null)}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quest statistics */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            Total Quests: {questLog.totalQuestsCompleted} completed
          </div>
          <div className="text-sm text-gray-400">
            Main: {questLog.mainQuestsCompleted} | Side: {questLog.sideQuestsCompleted}
          </div>
        </div>
      </div>
    </div>
  );
}