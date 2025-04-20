import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EchoEntity } from '@shared/types';
import { useGameState } from '@/lib/stores/useGameState';

interface EchoProps {
  data: EchoEntity;
  onInteract: (echo: EchoEntity) => void;
}

export function Echo({ data, onInteract }: EchoProps) {
  const { gamePhase } = useGameState();
  const echoRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  
  // Create material based on echo alignment
  const getMaterial = () => {
    switch (data.alignment) {
      case 'balanced':
        return new THREE.MeshStandardMaterial({ 
          color: '#4ac6ff', 
          emissive: '#4ac6ff',
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.8
        });
      case 'corrupted':
        return new THREE.MeshStandardMaterial({ 
          color: '#ff4a4a', 
          emissive: '#ff4a4a',
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.8
        });
      case 'purified':
        return new THREE.MeshStandardMaterial({ 
          color: '#4aff9f', 
          emissive: '#4aff9f',
          emissiveIntensity: 0.5,
          transparent: true,
          opacity: 0.8
        });
      default:
        return new THREE.MeshStandardMaterial({ 
          color: '#ffffff',
          transparent: true,
          opacity: 0.8
        });
    }
  };
  
  // Set up glow color based on alignment
  const getGlowColor = () => {
    switch (data.alignment) {
      case 'balanced': return new THREE.Color('#4ac6ff');
      case 'corrupted': return new THREE.Color('#ff4a4a');
      case 'purified': return new THREE.Color('#4aff9f');
      default: return new THREE.Color('#ffffff');
    }
  };
  
  // Animation logic
  useFrame((_, delta) => {
    if (echoRef.current && gamePhase === 'gameplay') {
      // Gentle hovering motion
      echoRef.current.position.y = data.position[1] + Math.sin(Date.now() * 0.002) * 0.2;
      
      // Slow rotation
      echoRef.current.rotation.y += delta * 0.5;
      
      // Pulsating glow
      if (glowRef.current) {
        const pulseIntensity = 0.8 + Math.sin(Date.now() * 0.003) * 0.3;
        glowRef.current.intensity = pulseIntensity;
      }
    }
  });
  
  // Log when echo is mounted
  useEffect(() => {
    console.log(`Echo created: ${data.name} (${data.alignment})`);
  }, []);
  
  return (
    <group 
      ref={echoRef} 
      position={[data.position[0], data.position[1], data.position[2]]}
      onClick={() => gamePhase === 'gameplay' && onInteract(data)}
    >
      {/* Geometric shapes arranged in an 8-bit style crystalline formation */}
      <mesh material={getMaterial()}>
        <octahedronGeometry args={[0.6, 0]} />
      </mesh>
      
      {/* Outer geometric shapes */}
      <group rotation={[Math.PI/4, 0, Math.PI/4]}>
        <mesh material={getMaterial()} position={[0, 0.5, 0]} scale={0.5}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
        
        <mesh material={getMaterial()} position={[0, -0.5, 0]} scale={0.5}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </group>
      
      {/* Glow effect */}
      <pointLight 
        ref={glowRef} 
        distance={3} 
        intensity={1} 
        color={getGlowColor()} 
      />
    </group>
  );
}
