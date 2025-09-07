import React, { useState, useEffect } from 'react';
import { useMultiplayer } from '@/lib/stores/useMultiplayer';
import { useUI } from '@/lib/stores/useUI';

interface MultiplayerUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplayerUI: React.FC<MultiplayerUIProps> = ({ isOpen, onClose }) => {
  const {
    connection,
    currentSession,
    players,
    localPlayer,
    chatMessages,
    leaderboards,
    connect,
    disconnect,
    createSession,
    joinSession,
    leaveSession,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    sendMessage,
    isHost,
    isConnected
  } = useMultiplayer();

  const { addNotification } = useUI();

  const [selectedTab, setSelectedTab] = useState<'sessions' | 'chat' | 'leaderboards' | 'settings'>('sessions');
  const [chatInput, setChatInput] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const [joinSessionId, setJoinSessionId] = useState('');
  const [joinPassword, setJoinPassword] = useState('');

  useEffect(() => {
    if (isConnected()) {
      addNotification({
        title: 'Connected',
        message: 'Successfully connected to multiplayer server',
        type: 'success',
        duration: 3000
      });
    }
  }, [isConnected, addNotification]);

  if (!isOpen) return null;

  const handleCreateSession = async () => {
    try {
      await createSession({
        name: sessionName || 'My Session',
        hostId: localPlayer?.id || 'local_player',
        maxPlayers: 4,
        isPrivate: !!sessionPassword,
        password: sessionPassword || undefined,
        status: 'waiting',
        gameMode: 'coop',
        difficulty: 'normal',
        zone: 'whispering_woods',
        settings: {
          allowSpectators: true,
          friendlyFire: false,
          sharedLoot: true,
          respawnEnabled: true
        }
      });
      
      addNotification({
        title: 'Session Created',
        message: 'Your multiplayer session has been created',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to create session',
        type: 'error'
      });
    }
  };

  const handleJoinSession = async () => {
    try {
      await joinSession(joinSessionId, joinPassword || undefined);
      
      addNotification({
        title: 'Joined Session',
        message: 'Successfully joined the session',
        type: 'success'
      });
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Failed to join session',
        type: 'error'
      });
    }
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput, 'global');
      setChatInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Multiplayer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Connection Status */}
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connection.isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-white">
                {connection.isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {connection.isConnected && (
                <span className="text-gray-400 text-sm">
                  Latency: {connection.latency.toFixed(0)}ms
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {!connection.isConnected ? (
                <button
                  onClick={() => connect('ws://localhost:8080')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Connect
                </button>
              ) : (
                <button
                  onClick={disconnect}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  Disconnect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {(['sessions', 'chat', 'leaderboards', 'settings'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto">
          {selectedTab === 'sessions' && (
            <div className="space-y-6">
              {/* Current Session */}
              {currentSession && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Current Session</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-white font-semibold">{currentSession.name}</h4>
                      <p className="text-gray-400 text-sm">
                        {players.length}/{currentSession.maxPlayers} players
                      </p>
                      <p className="text-gray-400 text-sm">
                        Mode: {currentSession.gameMode} | Difficulty: {currentSession.difficulty}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Status: {currentSession.status}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {isHost() && (
                        <>
                          {currentSession.status === 'waiting' && (
                            <button
                              onClick={startSession}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                              Start Session
                            </button>
                          )}
                          {currentSession.status === 'playing' && (
                            <button
                              onClick={pauseSession}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                            >
                              Pause Session
                            </button>
                          )}
                          {currentSession.status === 'paused' && (
                            <button
                              onClick={resumeSession}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                              Resume Session
                            </button>
                          )}
                          <button
                            onClick={endSession}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            End Session
                          </button>
                        </>
                      )}
                      <button
                        onClick={leaveSession}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                      >
                        Leave Session
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Session */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Create Session</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Session Name</label>
                    <input
                      type="text"
                      value={sessionName}
                      onChange={(e) => setSessionName(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="Enter session name"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Password (Optional)</label>
                    <input
                      type="password"
                      value={sessionPassword}
                      onChange={(e) => setSessionPassword(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="Enter password for private session"
                    />
                  </div>
                  <button
                    onClick={handleCreateSession}
                    disabled={!connection.isConnected}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Create Session
                  </button>
                </div>
              </div>

              {/* Join Session */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Join Session</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Session ID</label>
                    <input
                      type="text"
                      value={joinSessionId}
                      onChange={(e) => setJoinSessionId(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="Enter session ID"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Password (If Required)</label>
                    <input
                      type="password"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                      placeholder="Enter session password"
                    />
                  </div>
                  <button
                    onClick={handleJoinSession}
                    disabled={!connection.isConnected || !joinSessionId}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'chat' && (
            <div className="bg-gray-800 rounded-lg p-4 h-full flex flex-col">
              <h3 className="text-xl font-semibold text-white mb-4">Chat</h3>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {chatMessages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    <span className="text-blue-400 font-semibold text-sm">
                      {message.playerName}:
                    </span>
                    <span className="text-white text-sm">{message.message}</span>
                    <span className="text-gray-400 text-xs">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Chat Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                  placeholder="Type your message..."
                  disabled={!connection.isConnected}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!connection.isConnected || !chatInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {selectedTab === 'leaderboards' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Leaderboards</h3>
                <div className="text-gray-400">
                  Leaderboards will be displayed here when available.
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Multiplayer Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Server URL</label>
                    <input
                      type="text"
                      defaultValue="ws://localhost:8080"
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Player Name</label>
                    <input
                      type="text"
                      defaultValue={localPlayer?.name || 'Player'}
                      className="w-full p-2 bg-gray-700 text-white rounded-lg border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Auto-reconnect</label>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="mr-2"
                    />
                    <span className="text-white">Enable automatic reconnection</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};