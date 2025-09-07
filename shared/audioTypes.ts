export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  type: 'music' | 'sfx' | 'ambient';
  volume: number;
  loop: boolean;
  fadeIn?: number;
  fadeOut?: number;
  category?: string;
}

export interface AudioSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  ambientVolume: number;
  muted: boolean;
}

export interface AudioState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loop: boolean;
}

export interface ParticleEffect {
  id: string;
  name: string;
  type: 'explosion' | 'heal' | 'damage' | 'magic' | 'smoke' | 'sparkle' | 'trail';
  position: { x: number; y: number; z: number };
  duration: number;
  intensity: number;
  color: string;
  size: number;
  speed: number;
  direction?: { x: number; y: number; z: number };
  gravity?: number;
  fadeOut?: boolean;
  scale?: boolean;
}

export interface AnimationState {
  id: string;
  name: string;
  type: 'idle' | 'walk' | 'run' | 'attack' | 'cast' | 'hurt' | 'death' | 'victory';
  duration: number;
  loop: boolean;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic';
  keyframes: AnimationKeyframe[];
}

export interface AnimationKeyframe {
  time: number;
  properties: {
    position?: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    scale?: { x: number; y: number; z: number };
    opacity?: number;
    color?: string;
  };
}

export interface VisualEffect {
  id: string;
  name: string;
  type: 'screen-shake' | 'flash' | 'fade' | 'zoom' | 'blur' | 'glow';
  duration: number;
  intensity: number;
  target?: 'screen' | 'character' | 'enemy' | 'ui';
  color?: string;
  direction?: { x: number; y: number };
}

export interface AudioContext {
  audioContext: AudioContext | null;
  gainNode: GainNode | null;
  musicGain: GainNode | null;
  sfxGain: GainNode | null;
  ambientGain: GainNode | null;
  isInitialized: boolean;
}

export interface ParticleSystem {
  particles: ParticleEffect[];
  maxParticles: number;
  gravity: number;
  wind: { x: number; y: number; z: number };
  bounds: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
}

export interface AnimationSystem {
  animations: Map<string, AnimationState>;
  activeAnimations: Map<string, AnimationState>;
  globalSpeed: number;
  paused: boolean;
}

export interface VisualEffectSystem {
  effects: VisualEffect[];
  maxEffects: number;
  screenEffects: VisualEffect[];
  uiEffects: VisualEffect[];
}