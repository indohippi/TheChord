import { useState, useEffect } from 'react';
import { useGameState } from '@/lib/stores/useGameState';
import { useAudio } from '@/lib/stores/useAudio';

export function MainMenu() {
  const { setGamePhase, resetGame } = useGameState();
  const { playSuccess } = useAudio();
  
  const [fadeOut, setFadeOut] = useState(false);
  
  // Handle start game
  const handleStartGame = () => {
    // Play sound effect
    playSuccess();
    
    // Fade out animation
    setFadeOut(true);
    
    // Reset game state
    resetGame();
    
    // Transition to character selection after animation
    setTimeout(() => {
      setGamePhase('characterSelection');
    }, 800);
  };
  
  // Main menu logo pixel art style
  const pixelLogo = (
    <div className="flex flex-col items-center justify-center mb-10">
      <div 
        className="text-center relative w-auto h-16 mb-2"
        style={{
          color: '#4ac6ff',
          textShadow: '0 0 10px rgba(74, 198, 255, 0.8), 0 0 20px rgba(74, 198, 255, 0.4)',
          fontFamily: 'monospace',
          fontSize: '3.5rem',
          fontWeight: 'bold',
          lineHeight: 1,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}
      >
        The Echoes
      </div>
      <div
        className="text-center relative w-auto h-16 mb-4"
        style={{
          color: '#ff4a4a',
          textShadow: '0 0 10px rgba(255, 74, 74, 0.8), 0 0 20px rgba(255, 74, 74, 0.4)',
          fontFamily: 'monospace',
          fontSize: '2.8rem',
          fontWeight: 'bold',
          lineHeight: 1,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
        }}
      >
        of Creation
      </div>
    </div>
  );
  
  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50 transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Background geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white opacity-20"
            style={{
              width: 20 + (i % 3) * 10,
              height: 20 + (i % 3) * 10,
              top: `${10 + (i * 17) % 80}%`,
              left: `${5 + (i * 19) % 90}%`,
              transform: `rotate(${(i * 45) % 360}deg)`,
              boxShadow: i % 2 === 0 ? '0 0 15px rgba(74, 198, 255, 0.6)' : '0 0 15px rgba(255, 74, 74, 0.6)',
            }}
          />
        ))}
      </div>
      
      {/* Logo */}
      {pixelLogo}
      
      {/* Subtitle */}
      <p className="text-gray-300 mb-12 text-center max-w-xl px-4">
        Journey through the fractured remains of reality, gathering the Echoes of Creation 
        to restore the shattered cosmic order.
      </p>
      
      {/* Menu buttons */}
      <div className="flex flex-col gap-4 items-center">
        <button 
          className="border-2 border-blue-500 bg-gray-800 text-blue-300 px-8 py-3 text-lg font-bold hover:bg-blue-900 hover:text-white transition-colors"
          style={{ boxShadow: '0 0 10px rgba(74, 198, 255, 0.4)' }}
          onClick={handleStartGame}
        >
          Start Journey
        </button>
        
        {/* Disabled for now */}
        <button 
          className="border-2 border-gray-600 bg-gray-800 text-gray-400 px-8 py-3 text-lg font-bold opacity-50 cursor-not-allowed"
        >
          Settings
        </button>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-4 text-gray-500 text-sm">
        The Echoes of Creation • 8-bit Edition
      </div>
    </div>
  );
}
