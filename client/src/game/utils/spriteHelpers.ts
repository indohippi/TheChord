import * as THREE from 'three';

/**
 * Creates an 8-bit style sprite from SVG data
 * @param svgData - The SVG data to use for the sprite
 * @param scale - Scale factor for the sprite
 * @param color - Color tint for the sprite
 */
export function createSpriteFromSVG(svgId: string, scale: number = 1, color: string = '#ffffff'): THREE.Sprite {
  // Create a canvas element to draw the SVG
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Could not get canvas context');
    // Return an empty sprite if context is not available
    return new THREE.Sprite(new THREE.SpriteMaterial());
  }
  
  // Get the SVG element
  const svgElement = document.getElementById(svgId);
  if (!svgElement) {
    console.error(`SVG element with id ${svgId} not found`);
    // Return an empty sprite if SVG element is not found
    return new THREE.Sprite(new THREE.SpriteMaterial());
  }
  
  // Convert SVG to data URL
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(svgBlob);
  
  // Create image from data URL
  const img = new Image();
  const texture = new THREE.Texture(canvas);
  
  // Load image and update texture
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Apply color tint if needed
    if (color !== '#ffffff') {
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
    }
    
    // Pixelate the image for 8-bit style
    pixelateCanvas(canvas, 8);
    
    texture.needsUpdate = true;
    URL.revokeObjectURL(url);
  };
  
  img.src = url;
  
  // Create sprite material and sprite
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  
  return sprite;
}

/**
 * Creates a simple 8-bit sprite using a geometric shape
 * @param shape - The shape type ('square', 'circle', 'triangle')
 * @param color - Color of the sprite
 * @param scale - Scale factor for the sprite
 */
export function createSimpleSprite(shape: 'square' | 'circle' | 'triangle', color: string, scale: number = 1): THREE.Sprite {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    console.error('Could not get canvas context');
    // Return an empty sprite if context is not available
    return new THREE.Sprite(new THREE.SpriteMaterial());
  }
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
  
  // Draw shape
  switch (shape) {
    case 'square':
      ctx.fillRect(8, 8, 48, 48);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(32, 32, 24, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(32, 8);
      ctx.lineTo(56, 56);
      ctx.lineTo(8, 56);
      ctx.closePath();
      ctx.fill();
      break;
  }
  
  // Pixelate the image for 8-bit style
  pixelateCanvas(canvas, 8);
  
  // Create texture from canvas
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  
  // Create sprite material and sprite
  const material = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true
  });
  
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(scale, scale, 1);
  
  return sprite;
}

/**
 * Creates a character sprite based on character class
 * @param characterClass - The character class
 * @param facing - Direction the character is facing
 */
export function createCharacterSprite(characterClass: string | null, facing: 'north' | 'east' | 'south' | 'west'): THREE.Sprite {
  // Color based on character class
  const classColors: {[key: string]: string} = {
    'CovenantWeaver': '#3498db', // Blue
    'PhilosopherKing': '#e74c3c', // Red
    'ChakravartiAvatar': '#f39c12', // Orange
    'SerpentsWhisper': '#2ecc71', // Green
    'JadeDragon': '#9b59b6', // Purple
    'default': '#ffffff' // White
  };
  
  const color = characterClass ? classColors[characterClass] : classColors.default;
  
  // ID for the sprite based on character class and direction
  const spriteId = characterClass ? `${characterClass.toLowerCase()}-${facing}` : `default-${facing}`;
  
  // Try to get SVG sprite, fallback to simple sprite if not found
  try {
    return createSpriteFromSVG(spriteId, 2, color);
  } catch (error) {
    console.warn(`SVG sprite ${spriteId} not found, using simple sprite`);
    return createSimpleSprite('square', color, 2);
  }
}

/**
 * Creates an enemy sprite based on enemy type
 * @param enemyType - The enemy type
 */
export function createEnemySprite(enemyType: string): THREE.Sprite {
  // Color based on enemy type
  let color = '#ff3d3d'; // Default red
  
  if (enemyType.includes('Oracle') || enemyType.includes('Philosopher')) {
    color = '#3d9eff'; // Blue
  } else if (enemyType.includes('Dragon') || enemyType.includes('Monk')) {
    color = '#9b27b0'; // Purple
  }
  
  // Try to get SVG sprite, fallback to simple sprite if not found
  try {
    const spriteId = enemyType.toLowerCase().replace(/\s+/g, '-');
    return createSpriteFromSVG(spriteId, 1.5, color);
  } catch (error) {
    console.warn(`SVG sprite for ${enemyType} not found, using simple sprite`);
    return createSimpleSprite(
      enemyType.includes('Spirit') ? 'circle' : 
      enemyType.includes('Serpent') ? 'triangle' : 'square', 
      color, 
      1.5
    );
  }
}

/**
 * Creates an echo sprite based on alignment
 * @param alignment - The echo alignment
 */
export function createEchoSprite(alignment: 'balanced' | 'corrupted' | 'purified'): THREE.Sprite {
  // Color based on alignment
  const colors = {
    'balanced': '#4ac6ff',
    'corrupted': '#ff4a4a',
    'purified': '#4aff9f'
  };
  
  // Shape based on alignment
  const shapes = {
    'balanced': 'circle',
    'corrupted': 'triangle',
    'purified': 'square'
  };
  
  // Try to get SVG sprite, fallback to simple sprite if not found
  try {
    return createSpriteFromSVG(`echo-${alignment}`, 1.2, colors[alignment]);
  } catch (error) {
    console.warn(`SVG sprite for ${alignment} echo not found, using simple sprite`);
    return createSimpleSprite(
      shapes[alignment] as 'square' | 'circle' | 'triangle', 
      colors[alignment], 
      1.2
    );
  }
}

/**
 * Pixelates a canvas for 8-bit style rendering
 * @param canvas - The canvas to pixelate
 * @param pixelSize - Size of pixels
 */
function pixelateCanvas(canvas: HTMLCanvasElement, pixelSize: number): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const w = canvas.width;
  const h = canvas.height;
  
  // Get current image data
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  
  // Create a temporary canvas for the pixelated version
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;
  
  tempCanvas.width = w;
  tempCanvas.height = h;
  
  // Draw current image to temp canvas
  tempCtx.putImageData(imageData, 0, 0);
  
  // Clear original canvas
  ctx.clearRect(0, 0, w, h);
  
  // Draw pixelated version
  ctx.imageSmoothingEnabled = false;
  
  // Scale down and up to pixelate
  const scaledWidth = Math.floor(w / pixelSize);
  const scaledHeight = Math.floor(h / pixelSize);
  
  ctx.drawImage(
    tempCanvas,
    0, 0, w, h,
    0, 0, scaledWidth, scaledHeight
  );
  
  ctx.drawImage(
    ctx.canvas,
    0, 0, scaledWidth, scaledHeight,
    0, 0, w, h
  );
}
