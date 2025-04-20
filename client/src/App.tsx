import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { CharacterSelection } from "@/game/components/CharacterSelection";
import { MainMenu } from "@/game/components/MainMenu";
import { Lights } from "@/game/components/Lights";
import { GameUI } from "@/game/components/GameUI";
import { SoundManager } from "@/game/components/SoundManager";
import { useGameState } from "@/lib/stores/useGameState";
import { EchoZone } from "@/game/components/EchoZone";
import { Player } from "@/game/components/Player";
import { MovementSystem } from "@/game/systems/MovementSystem";
import { CollisionSystem } from "@/game/systems/CollisionSystem";
import "@fontsource/inter";

// Define control keys for the game
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  interact = 'interact',
  ability1 = 'ability1',
  ability2 = 'ability2',
  ability3 = 'ability3',
  menu = 'menu'
}

// Main App component
function App() {
  const { gamePhase, setGamePhase } = useGameState();
  const [showCanvas, setShowCanvas] = useState(false);

  // Define key mappings
  const keyMap = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.interact, keys: ['KeyE'] },
    { name: Controls.ability1, keys: ['KeyQ'] },
    { name: Controls.ability2, keys: ['KeyR'] },
    { name: Controls.ability3, keys: ['KeyF'] },
    { name: Controls.menu, keys: ['Escape'] }
  ];

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
    
    // Initialize game state
    setGamePhase('mainMenu');
    
    console.log("Game initialized, current phase:", gamePhase);
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {showCanvas && (
        <KeyboardControls map={keyMap}>
          {gamePhase === 'mainMenu' && <MainMenu />}

          {gamePhase === 'characterSelection' && <CharacterSelection />}

          {(gamePhase === 'gameplay' || gamePhase === 'dialogue' || gamePhase === 'combat') && (
            <>
              <Canvas
                shadows
                camera={{
                  position: [0, 10, 15],
                  fov: 60,
                  near: 0.1,
                  far: 1000
                }}
                gl={{
                  antialias: true,
                  pixelRatio: window.devicePixelRatio
                }}
              >
                {/* Global light setup */}
                <Lights />
                
                {/* Game systems */}
                <MovementSystem />
                <CollisionSystem />
                
                <Suspense fallback={null}>
                  <EchoZone />
                  <Player />
                </Suspense>
              </Canvas>
              
              {/* UI overlay */}
              <GameUI />
            </>
          )}

          {/* Audio system */}
          <SoundManager />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
