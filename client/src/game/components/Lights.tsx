import { useEffect } from 'react';
import { useEchoZone } from '@/lib/stores/useEchoZone';

export function Lights() {
  const { ambientLight, currentZoneType } = useEchoZone();
  
  // Log the current lighting setup
  useEffect(() => {
    if (currentZoneType) {
      console.log(`Setting up lights for ${currentZoneType} zone`);
      console.log(`Ambient light: RGB(${ambientLight.join(', ')})`);
    }
  }, [currentZoneType, ambientLight]);

  return (
    <>
      {/* Ambient light with color based on current zone */}
      <ambientLight intensity={0.5} color={`rgb(${ambientLight.map(c => c * 255).join(',')})`} />
      
      {/* Main directional light (sun-like) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      
      {/* Secondary fill light */}
      <directionalLight
        position={[-10, 15, -10]}
        intensity={0.8}
        color="#b3cde0"
      />
      
      {/* Ground reflection light */}
      <hemisphereLight
        args={["#ddeeff", "#202020", 0.6]}
      />
    </>
  );
}
