import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Echo } from './Echo';
import { Enemy } from './Enemy';
import { useEchoZone } from '@/lib/stores/useEchoZone';
import { useGameState } from '@/lib/stores/useGameState';
import { EchoEntity } from '@shared/types';
import { pixelShader } from '../utils/pixelShader';

export function EchoZone() {
  const { currentZoneData, currentZoneType, echoes, fogDensity, setCurrentZone, removeEcho } = useEchoZone();
  const { gamePhase, incrementEchoesCaptured, startCombat } = useGameState();
  const { scene } = useThree();
  
  // Set up initial zone on component mount
  useEffect(() => {
    // Default to Azure Labyrinth if no zone is selected
    if (!currentZoneType) {
      setCurrentZone('AzureLabyrinth');
    }
  }, []);
  
  // Handle fog and environment setup when zone changes
  useEffect(() => {
    if (currentZoneData) {
      console.log(`Setting up zone: ${currentZoneData.name}`);
      
      // Set fog based on zone
      scene.fog = new THREE.FogExp2(
        new THREE.Color(`rgb(${currentZoneData.ambientLight.map(c => c * 255).join(',')})`),
        fogDensity
      );
      
      // Apply post-processing effect
      const pixelEffect = pixelShader();
      scene.onBeforeRender = () => {
        // Apply pixel shader effect (would be implemented in a real shader)
        console.log('Rendering with 8-bit pixel shader');
      };
      
      return () => {
        // Cleanup
        scene.fog = null;
        scene.onBeforeRender = () => {};
      };
    }
  }, [currentZoneData, fogDensity]);
  
  // Handle echo interaction
  const handleEchoInteract = (echo: EchoEntity) => {
    console.log(`Interacting with echo: ${echo.name}`);
    
    // Handle based on alignment
    if (echo.alignment === 'corrupted') {
      // Start combat with enemies
      const enemyList = currentZoneData?.enemies.slice(0, 2) || [];
      startCombat(enemyList);
    } else {
      // Collect the echo
      removeEcho(echo.id);
      incrementEchoesCaptured();
      console.log('Echo collected!');
    }
  };
  
  // Create the ground plane based on zone type
  const GroundPlane = useMemo(() => {
    if (!currentZoneData) return null;
    
    let texture;
    
    // Select texture based on zone type
    switch (currentZoneType) {
      case 'AzureLabyrinth':
        texture = 'stone';
        break;
      case 'ObsidianDunes':
        texture = 'sand';
        break;
      case 'JadeCanopy':
        texture = 'grass';
        break;
      default:
        texture = 'stone';
    }
    
    // Zone dimensions from boundaries
    const width = currentZoneData.boundaries.maxX - currentZoneData.boundaries.minX;
    const depth = currentZoneData.boundaries.maxZ - currentZoneData.boundaries.minZ;
    
    console.log(`Creating ${width}x${depth} ground plane with ${texture} texture`);
    
    // Create material based on zone
    const material = new THREE.MeshStandardMaterial({ 
      color: currentZoneType === 'ObsidianDunes' ? '#222222' : 
             currentZoneType === 'JadeCanopy' ? '#1a472a' : 
             '#2a4d69',
      roughness: 0.8,
      metalness: 0.2
    });
    
    return (
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.1, 0]} 
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial 
          color={currentZoneType === 'ObsidianDunes' ? '#222222' : 
                 currentZoneType === 'JadeCanopy' ? '#1a472a' : 
                 '#2a4d69'}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    );
  }, [currentZoneData, currentZoneType]);
  
  // If no zone is loaded yet
  if (!currentZoneData) {
    return null;
  }
  
  return (
    <>
      {/* Ground plane */}
      {GroundPlane}
      
      {/* Echo entities */}
      {echoes.map((echo) => (
        <Echo 
          key={echo.id} 
          data={echo} 
          onInteract={handleEchoInteract} 
        />
      ))}
      
      {/* Environment-specific elements based on zone type */}
      {currentZoneType === 'AzureLabyrinth' && (
        // Crystal formations for Azure Labyrinth
        <>
          {[...Array(8)].map((_, index) => {
            // Deterministic positions based on index
            const x = ((index % 4) * 10) - 15;
            const z = (Math.floor(index / 4) * 10) - 10;
            const height = 3 + (index % 3);
            
            return (
              <mesh 
                key={`crystal-${index}`} 
                position={[x, height/2, z]} 
                castShadow 
                receiveShadow
              >
                <boxGeometry args={[2, height, 2]} />
                <meshStandardMaterial 
                  color="#a7c5eb" 
                  transparent={true} 
                  opacity={0.7} 
                  roughness={0.2} 
                  metalness={0.8} 
                />
              </mesh>
            );
          })}
        </>
      )}
      
      {currentZoneType === 'ObsidianDunes' && (
        // Obsidian obelisks for Obsidian Dunes
        <>
          {[...Array(5)].map((_, index) => {
            const x = ((index % 3) * 15) - 15;
            const z = (Math.floor(index / 3) * 15) - 15;
            const height = 5 + (index % 3) * 2;
            
            return (
              <mesh 
                key={`obelisk-${index}`} 
                position={[x, height/2, z]} 
                castShadow 
                receiveShadow
              >
                <boxGeometry args={[2, height, 2]} />
                <meshStandardMaterial 
                  color="#111111" 
                  roughness={0.3} 
                  metalness={0.6} 
                />
              </mesh>
            );
          })}
        </>
      )}
      
      {currentZoneType === 'JadeCanopy' && (
        // Bioluminescent trees for Jade Canopy
        <>
          {[...Array(6)].map((_, index) => {
            const x = ((index % 3) * 12) - 12;
            const z = (Math.floor(index / 3) * 12) - 12;
            
            return (
              <group key={`tree-${index}`} position={[x, 0, z]}>
                {/* Tree trunk */}
                <mesh castShadow receiveShadow>
                  <cylinderGeometry args={[1, 1.5, 6, 8]} />
                  <meshStandardMaterial color="#3e2723" roughness={0.8} />
                </mesh>
                
                {/* Foliage */}
                <mesh position={[0, 5, 0]} castShadow>
                  <boxGeometry args={[4, 4, 4]} />
                  <meshStandardMaterial 
                    color="#2e7d32" 
                    emissive="#81c784"
                    emissiveIntensity={0.2}
                  />
                </mesh>
              </group>
            );
          })}
        </>
      )}
    </>
  );
}
