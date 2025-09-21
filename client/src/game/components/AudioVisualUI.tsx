import React, { useEffect, useState } from 'react';
import { useAudio } from '@/lib/stores/useAudio';
import { useParticles } from '@/lib/stores/useParticles';
import { useAnimations } from '@/lib/stores/useAnimations';
import { useVisualEffects } from '@/lib/stores/useVisualEffects';
import { audioTracks } from '../data/audioTracks';

interface AudioVisualUIProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioVisualUI: React.FC<AudioVisualUIProps> = ({ isOpen, onClose }) => {
  const {
    settings,
    currentTrack,
    isPlaying,
    isPaused,
    currentTime,
    duration,
    initializeAudio,
    loadTrack,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    setMasterVolume,
    setMusicVolume,
    setSfxVolume,
    setAmbientVolume,
    toggleMute,
    getTracksByType
  } = useAudio();

  const {
    particles,
    createExplosion,
    createHeal,
    createDamage,
    createMagic,
    createSmoke,
    createSparkle,
    createTrail,
    clearParticles
  } = useParticles();

  const {
    activeAnimations,
    createIdleAnimation,
    createWalkAnimation,
    createRunAnimation,
    createAttackAnimation,
    createCastAnimation,
    createHurtAnimation,
    createDeathAnimation,
    createVictoryAnimation,
    setGlobalSpeed,
    pauseAllAnimations,
    resumeAllAnimations,
    clearAllAnimations
  } = useAnimations();

  const {
    effects,
    createScreenShake,
    createScreenFlash,
    createScreenFade,
    createScreenZoom,
    createScreenBlur,
    createScreenGlow,
    clearEffects
  } = useVisualEffects();

  const [selectedTab, setSelectedTab] = useState<'audio' | 'particles' | 'animations' | 'effects'>('audio');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeAudio();
      audioTracks.forEach(track => loadTrack(track));
      setIsInitialized(true);
    }
  }, [initializeAudio, loadTrack, isInitialized]);

  if (!isOpen) return null;

  const musicTracks = getTracksByType('music');
  const sfxTracks = getTracksByType('sfx');
  const ambientTracks = getTracksByType('ambient');

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-blue-500 rounded-lg p-6 w-11/12 max-w-6xl h-5/6 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">
            Audio & Visual Effects
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {(['audio', 'particles', 'animations', 'effects'] as const).map((tab) => (
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
          {selectedTab === 'audio' && (
            <div className="space-y-6">
              {/* Audio Settings */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Audio Settings</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white mb-2">Master Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.masterVolume}
                      onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-gray-400 text-sm">{Math.round(settings.masterVolume * 100)}%</span>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Music Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.musicVolume}
                      onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-gray-400 text-sm">{Math.round(settings.musicVolume * 100)}%</span>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">SFX Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.sfxVolume}
                      onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-gray-400 text-sm">{Math.round(settings.sfxVolume * 100)}%</span>
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Ambient Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={settings.ambientVolume}
                      onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-gray-400 text-sm">{Math.round(settings.ambientVolume * 100)}%</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={toggleMute}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      settings.muted
                        ? 'bg-red-600 text-white'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    {settings.muted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
              </div>

              {/* Current Track */}
              {currentTrack && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-white mb-4">Now Playing</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{currentTrack.name}</h4>
                      <p className="text-gray-400 text-sm">{currentTrack.type} • {currentTrack.category}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isPlaying ? (
                        <button
                          onClick={pauseTrack}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                        >
                          ⏸️
                        </button>
                      ) : (
                        <button
                          onClick={resumeTrack}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          ▶️
                        </button>
                      )}
                      <button
                        onClick={stopTrack}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                      >
                        ⏹️
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Music Tracks */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Music Tracks</h3>
                <div className="grid grid-cols-2 gap-2">
                  {musicTracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track.id)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <div className="text-white font-semibold">{track.name}</div>
                      <div className="text-gray-400 text-sm">{track.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* SFX Tracks */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Sound Effects</h3>
                <div className="grid grid-cols-3 gap-2">
                  {sfxTracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => playTrack(track.id)}
                      className="text-left p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <div className="text-white text-sm font-semibold">{track.name}</div>
                      <div className="text-gray-400 text-xs">{track.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'particles' && (
            <div className="space-y-6">
              {/* Particle Controls */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Particle Effects</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => createExplosion({ x: 0, y: 0, z: 0 }, 1)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    💥 Explosion
                  </button>
                  <button
                    onClick={() => createHeal({ x: 0, y: 0, z: 0 })}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    💚 Heal
                  </button>
                  <button
                    onClick={() => createDamage({ x: 0, y: 0, z: 0 }, 50)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    ❤️ Damage
                  </button>
                  <button
                    onClick={() => createMagic({ x: 0, y: 0, z: 0 })}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    ✨ Magic
                  </button>
                  <button
                    onClick={() => createSmoke({ x: 0, y: 0, z: 0 })}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    💨 Smoke
                  </button>
                  <button
                    onClick={() => createSparkle({ x: 0, y: 0, z: 0 })}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                  >
                    ✨ Sparkle
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearParticles}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Clear All Particles
                  </button>
                </div>
              </div>

              {/* Active Particles */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Active Particles ({particles.length})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  {particles.map((particle) => (
                    <div key={particle.id} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                      <div>
                        <span className="text-white font-semibold">{particle.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{particle.type}</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {particle.duration.toFixed(1)}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'animations' && (
            <div className="space-y-6">
              {/* Animation Controls */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Character Animations</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => createIdleAnimation('test_character')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    🧍 Idle
                  </button>
                  <button
                    onClick={() => createWalkAnimation('test_character')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    🚶 Walk
                  </button>
                  <button
                    onClick={() => createRunAnimation('test_character')}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                  >
                    🏃 Run
                  </button>
                  <button
                    onClick={() => createAttackAnimation('test_character')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    ⚔️ Attack
                  </button>
                  <button
                    onClick={() => createCastAnimation('test_character')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    🔮 Cast
                  </button>
                  <button
                    onClick={() => createHurtAnimation('test_character')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
                  >
                    😵 Hurt
                  </button>
                  <button
                    onClick={() => createDeathAnimation('test_character')}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    💀 Death
                  </button>
                  <button
                    onClick={() => createVictoryAnimation('test_character')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    🎉 Victory
                  </button>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={pauseAllAnimations}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                  >
                    Pause All
                  </button>
                  <button
                    onClick={resumeAllAnimations}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Resume All
                  </button>
                  <button
                    onClick={clearAllAnimations}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Active Animations */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Active Animations ({activeAnimations.size})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  {Array.from(activeAnimations.entries()).map(([id, animation]) => (
                    <div key={id} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                      <div>
                        <span className="text-white font-semibold">{animation.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{animation.type}</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {animation.duration.toFixed(1)}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'effects' && (
            <div className="space-y-6">
              {/* Visual Effects */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Visual Effects</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => createScreenShake(1, 1)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    📳 Screen Shake
                  </button>
                  <button
                    onClick={() => createScreenFlash('#ff0000', 0.5)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    ⚡ Screen Flash
                  </button>
                  <button
                    onClick={() => createScreenFade('#000000', 2, false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    🌑 Screen Fade
                  </button>
                  <button
                    onClick={() => createScreenZoom(1.2, 1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    🔍 Screen Zoom
                  </button>
                  <button
                    onClick={() => createScreenBlur(5, 2)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    🌫️ Screen Blur
                  </button>
                  <button
                    onClick={() => createScreenGlow('#00ff00', 0.5, 2)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    ✨ Screen Glow
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearEffects}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                  >
                    Clear All Effects
                  </button>
                </div>
              </div>

              {/* Active Effects */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Active Effects ({effects.length})
                </h3>
                <div className="max-h-40 overflow-y-auto">
                  {effects.map((effect) => (
                    <div key={effect.id} className="flex justify-between items-center p-2 bg-gray-700 rounded mb-2">
                      <div>
                        <span className="text-white font-semibold">{effect.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{effect.type}</span>
                      </div>
                      <div className="text-gray-400 text-sm">
                        {effect.duration.toFixed(1)}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};