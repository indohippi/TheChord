import { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import { useGameState } from '@/lib/stores/useGameState';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { useAudio } from '@/lib/stores/useAudio';

export function SoundManager() {
  const { gamePhase, inCombat } = useGameState();
  const { currentZoneType } = useEchoZone();
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound, 
    toggleMute, 
    isMuted 
  } = useAudio();
  
  const [currentBgm, setCurrentBgm] = useState<Howl | null>(null);
  
  // Initialize sounds
  useEffect(() => {
    // Background music
    const bgMusic = new Howl({
      src: ['/sounds/background.mp3'],
      loop: true,
      volume: 0.4,
      autoplay: false,
    });
    
    // Sound effects
    const hitSfx = new Howl({
      src: ['/sounds/hit.mp3'],
      volume: 0.5,
      autoplay: false,
    });
    
    const successSfx = new Howl({
      src: ['/sounds/success.mp3'],
      volume: 0.5,
      autoplay: false,
    });
    
    // Add to audio store
    setBackgroundMusic('main_theme');
    setHitSound('hit_sound');
    setSuccessSound('success_sound');
    
    // Store current BGM for management
    setCurrentBgm(bgMusic);
    
    // Set initial mute state based on store
    if (isMuted()) {
      Howler.mute(true);
    }
    
    return () => {
      // Clean up
      bgMusic.stop();
      Howler.mute(false);
    };
  }, []);
  
  // Handle game phase changes
  useEffect(() => {
    if (!currentBgm) return;
    
    if (gamePhase === 'mainMenu' || gamePhase === 'characterSelection') {
      // Menu music
      currentBgm.play();
    } else if (gamePhase === 'gameplay' || gamePhase === 'dialogue') {
      // Exploration music
      if (!currentBgm.playing()) {
        currentBgm.play();
      }
    } else if (gamePhase === 'combat') {
      // Combat music would be different in a full game
      if (!currentBgm.playing()) {
        currentBgm.play();
      }
    } else if (gamePhase === 'gameOver') {
      // Stop music on game over
      currentBgm.stop();
    }
  }, [gamePhase, currentBgm]);
  
  // Handle zone changes (would adjust music in a full game)
  useEffect(() => {
    if (currentZoneType && currentBgm) {
      console.log(`Adjusting music for ${currentZoneType}`);
      
      // In a full game, we would change music based on zone
      // For now, we'll just ensure it's playing
      if (!currentBgm.playing() && gamePhase === 'gameplay') {
        currentBgm.play();
      }
    }
  }, [currentZoneType, currentBgm]);
  
  // Sound toggle button
  return (
    <button 
      className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center bg-gray-800 bg-opacity-80 text-white rounded-full hover:bg-gray-700"
      onClick={() => {
        toggleMute();
        Howler.mute(!isMuted());
      }}
    >
      {isMuted() ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 8a5 5 0 0 1 0 8"></path>
          <path d="M17.7 5a9 9 0 0 1 0 14"></path>
          <path d="M6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l3.5-4.5A.8.8 0 0 1 11 5v14a.8.8 0 0 1-1.5.5L6 15z"></path>
        </svg>
      )}
    </button>
  );
}
