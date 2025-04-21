import { useState, useEffect, useRef } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';
import { BabylonScene } from '@/game/components/BabylonScene';
import { MainMenu } from '@/game/components/MainMenu';
import { CharacterSelection } from '@/game/components/CharacterSelection';
import { CombatActionMenu } from '@/game/components/CombatActionMenu';
import { CombatLogPanel } from '@/game/components/CombatLogPanel';
import { Controls } from './App';

// Main Babylon App component
export function BabylonApp() {
  const { gamePhase, setGamePhase, inCombat } = useGameState();
  const { isMuted, toggleMute } = useAudio();
  const [loading, setLoading] = useState(true);
  
  // Initialize game state
  useEffect(() => {
    // Simulate loading resources
    const loadingTimer = setTimeout(() => {
      setLoading(false);
      setGamePhase('mainMenu');
      console.log("Game initialized with Babylon.js, current phase:", gamePhase);
    }, 1000);
    
    return () => clearTimeout(loadingTimer);
  }, []);
  
  // Handle global key events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle mute with M key
      if (event.code === 'KeyM') {
        toggleMute();
      }
      
      // Escape key to return to main menu when in gameplay
      if (event.code === 'Escape' && gamePhase === 'gameplay') {
        setGamePhase('mainMenu');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gamePhase]);
  
  // Render appropriate UI based on game phase
  const renderUI = () => {
    if (loading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">The Echoes of Creation</h1>
            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '70%' }}></div>
            </div>
            <p className="mt-2 text-gray-400">Loading game assets...</p>
          </div>
        </div>
      );
    }
    
    switch (gamePhase) {
      case 'mainMenu':
        return <MainMenu />;
      case 'characterSelection':
        return <CharacterSelection />;
      case 'gameplay':
      case 'dialogue':
      case 'combat':
        return (
          <>
            {/* 3D scene */}
            <div className="fixed inset-0">
              <BabylonScene />
            </div>
            
            {/* UI overlay for combat */}
            {gamePhase === 'combat' && (
              <>
                <CombatActionMenu onActionSelected={() => {}} />
                <CombatLogPanel />
              </>
            )}
            
            {/* Sound control */}
            <button 
              className="fixed bottom-4 left-4 p-3 bg-black/50 rounded-full text-white"
              onClick={toggleMute}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full h-full overflow-hidden">
      {renderUI()}
    </div>
  );
}