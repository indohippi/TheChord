import * as THREE from 'three';

/**
 * Creates an 8-bit style box with pixelated edges
 */
export function createPixelBox(width: number, height: number, depth: number, color: string): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ 
    color, 
    roughness: 0.7, 
    metalness: 0.2 
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates a geometric shape for Echo visualization
 */
export function createEchoGeometry(alignment: 'balanced' | 'corrupted' | 'purified'): THREE.BufferGeometry {
  switch (alignment) {
    case 'balanced':
      // Octahedron for balanced echoes
      return new THREE.OctahedronGeometry(1, 0);
    
    case 'corrupted':
      // Distorted geometry for corrupted echoes
      const corrupted = new THREE.BoxGeometry(1, 1, 1);
      
      // Distort vertices
      const corruptedPos = corrupted.attributes.position;
      for (let i = 0; i < corruptedPos.count; i++) {
        const x = corruptedPos.getX(i);
        const y = corruptedPos.getY(i);
        const z = corruptedPos.getZ(i);
        
        corruptedPos.setXYZ(
          i,
          x + (i % 2) * 0.2,
          y + ((i + 1) % 2) * 0.2,
          z + ((i + 2) % 2) * 0.2
        );
      }
      
      return corrupted;
    
    case 'purified':
      // Icosahedron for purified echoes
      return new THREE.IcosahedronGeometry(1, 0);
    
    default:
      return new THREE.SphereGeometry(1, 8, 8);
  }
}

/**
 * Creates a platform with 8-bit style edges
 */
export function createPlatform(width: number, depth: number, color: string): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, 1, depth);
  const material = new THREE.MeshStandardMaterial({ 
    color, 
    roughness: 0.8
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates a grid of cubes to form an 8-bit terrain
 */
export function createPixelTerrain(
  sizeX: number, 
  sizeZ: number, 
  heightData: number[][], 
  colorMap: string[][]
): THREE.Group {
  const terrain = new THREE.Group();
  
  for (let x = 0; x < sizeX; x++) {
    for (let z = 0; z < sizeZ; z++) {
      const height = heightData[z][x];
      const color = colorMap[z][x];
      
      if (height > 0) {
        const cube = createPixelBox(1, height, 1, color);
        cube.position.set(x - sizeX/2, height/2, z - sizeZ/2);
        terrain.add(cube);
      }
    }
  }
  
  return terrain;
}
