import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
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
import { CombatActionType } from "@/game/systems/CombatSystem";
import { GridSystem, GridCell } from "@/game/systems/GridSystem";
import { Grid } from "@/game/components/Grid";
import { TacticalCombatUI } from "@/game/components/TacticalCombatUI";
import { GridVisualizer } from "@/game/components/GridVisualizer";
import { EnemyStatsDisplay } from "@/game/components/EnemyStatsDisplay";
import { CombatArena } from "@/game/components/CombatArena";
import { CombatActionMenu } from "@/game/components/CombatActionMenu";
import { CombatLogPanel } from "@/game/components/CombatLogPanel";
import { useTacticalCombat } from "@/game/hooks/useTacticalCombat";
import "@fontsource/inter";
import { useCharacter } from "@/lib/stores/useCharacter";

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
  const { gamePhase, setGamePhase, inCombat } = useGameState();
  const [showCanvas, setShowCanvas] = useState(false);
  const [activeCombatAction, setActiveCombatAction] = useState<CombatActionType | null>(null);
  const { activeAbilityIndex } = useCharacter();
  
  // Import our tactical combat hook
  const { 
    combatState,
    selectAction,
    executeMove,
    executeAttack,
    executeAbility,
    selectEnemy,
    endPlayerTurn
  } = useTacticalCombat();

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

  // Handle grid cell click
  const handleGridCellClick = (cell: GridCell) => {
    if (!activeCombatAction) return;
    
    console.log(`Grid cell clicked at [${cell.position[0]}, ${cell.position[1]}] with action ${activeCombatAction}`);
    const [worldX, _worldY, worldZ] = cell.worldPosition;

    switch (activeCombatAction) {
      case CombatActionType.MOVE: {
        // Execute movement to the cell world position
        executeMove([worldX, 0, worldZ]);
        break;
      }
      case CombatActionType.ATTACK: {
        // Find an enemy near this cell
        const target = combatState.enemies.find(e => {
          const [ex, _ey, ez] = e.position;
          const dx = Math.abs(ex - worldX);
          const dz = Math.abs(ez - worldZ);
          return dx < 0.6 && dz < 0.6;
        });
        if (target) {
          // Option 1: selectEnemy (auto-attacks in action phase)
          // selectEnemy(target.id);
          // Option 2: directly execute attack
          executeAttack(target.id);
        }
        break;
      }
      case CombatActionType.ABILITY: {
        if (activeAbilityIndex == null) {
          // No ability selected
          break;
        }
        const target = combatState.enemies.find(e => {
          const [ex, _ey, ez] = e.position;
          const dx = Math.abs(ex - worldX);
          const dz = Math.abs(ez - worldZ);
          return dx < 0.6 && dz < 0.6;
        });
        if (target) {
          executeAbility(activeAbilityIndex, target.id);
        }
        break;
      }
      default:
        break;
    }
    
    // Reset active action after click
    setActiveCombatAction(null);
  };

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
                <GridSystem />
                
                {/* Camera controls for tactical view during combat */}
                {gamePhase === 'combat' && (
                  <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    maxPolarAngle={Math.PI / 2.2}
                    minPolarAngle={Math.PI / 6}
                  />
                )}
                
                <Suspense fallback={null}>
                  <EchoZone />
                  <Player />
                  
                  {/* Combat arena and grid during combat */}
                  {gamePhase === 'combat' && (
                    <>
                      <CombatArena />
                      <Grid 
                        selectedAction={activeCombatAction}
                        onCellClick={handleGridCellClick}
                      />
                    </>
                  )}
                </Suspense>
              </Canvas>
              
              {/* UI overlay */}
              {gamePhase !== 'combat' ? (
                <GameUI 
                  activeCombatAction={activeCombatAction}
                  setActiveCombatAction={setActiveCombatAction}
                />
              ) : (
                <>
                  <CombatActionMenu 
                    onActionSelected={(action) => {
                      setActiveCombatAction(action);
                      if (action) selectAction(action);
                    }}
                  />
                  <CombatLogPanel />
                </>
              )}
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
