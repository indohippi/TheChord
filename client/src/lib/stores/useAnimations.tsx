import { create } from 'zustand';
import { AnimationState, AnimationKeyframe, AnimationSystem } from '../../../shared/audioTypes';

interface AnimationStore {
  // Animation system
  animationSystem: AnimationSystem;
  
  // Active animations
  activeAnimations: Map<string, AnimationState>;
  
  // Actions
  createAnimation: (animation: AnimationState) => void;
  startAnimation: (id: string, animation: AnimationState) => void;
  stopAnimation: (id: string) => void;
  pauseAnimation: (id: string) => void;
  resumeAnimation: (id: string) => void;
  updateAnimations: (deltaTime: number) => void;
  
  // Animation effects
  createIdleAnimation: (id: string, duration?: number) => void;
  createWalkAnimation: (id: string, duration?: number) => void;
  createRunAnimation: (id: string, duration?: number) => void;
  createAttackAnimation: (id: string, duration?: number) => void;
  createCastAnimation: (id: string, duration?: number) => void;
  createHurtAnimation: (id: string, duration?: number) => void;
  createDeathAnimation: (id: string, duration?: number) => void;
  createVictoryAnimation: (id: string, duration?: number) => void;
  
  // System management
  setGlobalSpeed: (speed: number) => void;
  pauseAllAnimations: () => void;
  resumeAllAnimations: () => void;
  clearAllAnimations: () => void;
  
  // Animation utilities
  interpolate: (start: number, end: number, t: number, easing: string) => number;
  getEasingFunction: (easing: string) => (t: number) => number;
}

export const useAnimations = create<AnimationStore>((set, get) => ({
  // Initial state
  animationSystem: {
    animations: new Map(),
    activeAnimations: new Map(),
    globalSpeed: 1,
    paused: false
  },
  
  activeAnimations: new Map(),

  // Create animation
  createAnimation: (animation: AnimationState) => {
    const state = get();
    state.animationSystem.animations.set(animation.id, animation);
  },

  // Start animation
  startAnimation: (id: string, animation: AnimationState) => {
    const state = get();
    const activeAnimation = { ...animation, duration: animation.duration };
    state.animationSystem.activeAnimations.set(id, activeAnimation);
    set({ activeAnimations: new Map(state.animationSystem.activeAnimations) });
  },

  // Stop animation
  stopAnimation: (id: string) => {
    const state = get();
    state.animationSystem.activeAnimations.delete(id);
    set({ activeAnimations: new Map(state.animationSystem.activeAnimations) });
  },

  // Pause animation
  pauseAnimation: (id: string) => {
    const state = get();
    const animation = state.animationSystem.activeAnimations.get(id);
    if (animation) {
      animation.duration = Math.max(0, animation.duration);
      state.animationSystem.activeAnimations.set(id, animation);
      set({ activeAnimations: new Map(state.animationSystem.activeAnimations) });
    }
  },

  // Resume animation
  resumeAnimation: (id: string) => {
    const state = get();
    const animation = state.animationSystem.activeAnimations.get(id);
    if (animation) {
      animation.duration = animation.duration;
      state.animationSystem.activeAnimations.set(id, animation);
      set({ activeAnimations: new Map(state.animationSystem.activeAnimations) });
    }
  },

  // Update animations
  updateAnimations: (deltaTime: number) => {
    const state = get();
    const updatedAnimations = new Map();
    
    for (const [id, animation] of state.animationSystem.activeAnimations) {
      if (state.animationSystem.paused) {
        updatedAnimations.set(id, animation);
        continue;
      }
      
      const newDuration = animation.duration - (deltaTime * state.animationSystem.globalSpeed);
      
      if (newDuration <= 0) {
        if (animation.loop) {
          // Restart animation
          const restartedAnimation = { ...animation, duration: animation.duration };
          updatedAnimations.set(id, restartedAnimation);
        }
        // If not looping, animation ends and is removed
      } else {
        updatedAnimations.set(id, { ...animation, duration: newDuration });
      }
    }
    
    state.animationSystem.activeAnimations = updatedAnimations;
    set({ activeAnimations: new Map(updatedAnimations) });
  },

  // Create idle animation
  createIdleAnimation: (id: string, duration: number = 2) => {
    const animation: AnimationState = {
      id,
      name: 'idle',
      type: 'idle',
      duration,
      loop: true,
      easing: 'ease-in-out',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.5,
          properties: {
            position: { x: 0, y: 0.1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create walk animation
  createWalkAnimation: (id: string, duration: number = 1) => {
    const animation: AnimationState = {
      id,
      name: 'walk',
      type: 'walk',
      duration,
      loop: true,
      easing: 'linear',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.25,
          properties: {
            position: { x: 0, y: 0.2, z: 0 },
            rotation: { x: 0, y: 0, z: 5 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.5,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.75,
          properties: {
            position: { x: 0, y: 0.2, z: 0 },
            rotation: { x: 0, y: 0, z: -5 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create run animation
  createRunAnimation: (id: string, duration: number = 0.5) => {
    const animation: AnimationState = {
      id,
      name: 'run',
      type: 'run',
      duration,
      loop: true,
      easing: 'linear',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.2,
          properties: {
            position: { x: 0, y: 0.3, z: 0 },
            rotation: { x: 0, y: 0, z: 8 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.4,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.6,
          properties: {
            position: { x: 0, y: 0.3, z: 0 },
            rotation: { x: 0, y: 0, z: -8 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.8,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create attack animation
  createAttackAnimation: (id: string, duration: number = 0.8) => {
    const animation: AnimationState = {
      id,
      name: 'attack',
      type: 'attack',
      duration,
      loop: false,
      easing: 'ease-out',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.3,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: -15 },
            scale: { x: 1.1, y: 1.1, z: 1.1 }
          }
        },
        {
          time: 0.6,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 15 },
            scale: { x: 1.2, y: 1.2, z: 1.2 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create cast animation
  createCastAnimation: (id: string, duration: number = 1.2) => {
    const animation: AnimationState = {
      id,
      name: 'cast',
      type: 'cast',
      duration,
      loop: false,
      easing: 'ease-in-out',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.4,
          properties: {
            position: { x: 0, y: 0.1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.05, y: 1.05, z: 1.05 }
          }
        },
        {
          time: 0.8,
          properties: {
            position: { x: 0, y: 0.2, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.1, y: 1.1, z: 1.1 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create hurt animation
  createHurtAnimation: (id: string, duration: number = 0.5) => {
    const animation: AnimationState = {
      id,
      name: 'hurt',
      type: 'hurt',
      duration,
      loop: false,
      easing: 'ease-out',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.2,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 10 },
            scale: { x: 0.9, y: 0.9, z: 0.9 }
          }
        },
        {
          time: 0.4,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: -10 },
            scale: { x: 0.9, y: 0.9, z: 0.9 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create death animation
  createDeathAnimation: (id: string, duration: number = 2) => {
    const animation: AnimationState = {
      id,
      name: 'death',
      type: 'death',
      duration,
      loop: false,
      easing: 'ease-in',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.3,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.8, y: 0.8, z: 0.8 }
          }
        },
        {
          time: 0.6,
          properties: {
            position: { x: 0, y: -0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.6, y: 0.6, z: 0.6 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: -1, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 0.3, y: 0.3, z: 0.3 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Create victory animation
  createVictoryAnimation: (id: string, duration: number = 1.5) => {
    const animation: AnimationState = {
      id,
      name: 'victory',
      type: 'victory',
      duration,
      loop: false,
      easing: 'ease-out',
      keyframes: [
        {
          time: 0,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        },
        {
          time: 0.3,
          properties: {
            position: { x: 0, y: 0.5, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.2, y: 1.2, z: 1.2 }
          }
        },
        {
          time: 0.6,
          properties: {
            position: { x: 0, y: 0.3, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1.1, y: 1.1, z: 1.1 }
          }
        },
        {
          time: 1,
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
          }
        }
      ]
    };
    
    get().startAnimation(id, animation);
  },

  // Set global speed
  setGlobalSpeed: (speed: number) => {
    set(state => ({
      animationSystem: { ...state.animationSystem, globalSpeed: speed }
    }));
  },

  // Pause all animations
  pauseAllAnimations: () => {
    set(state => ({
      animationSystem: { ...state.animationSystem, paused: true }
    }));
  },

  // Resume all animations
  resumeAllAnimations: () => {
    set(state => ({
      animationSystem: { ...state.animationSystem, paused: false }
    }));
  },

  // Clear all animations
  clearAllAnimations: () => {
    set(state => ({
      animationSystem: { ...state.animationSystem, activeAnimations: new Map() },
      activeAnimations: new Map()
    }));
  },

  // Interpolate between values
  interpolate: (start: number, end: number, t: number, easing: string) => {
    const easingFunction = get().getEasingFunction(easing);
    const easedT = easingFunction(t);
    return start + (end - start) * easedT;
  },

  // Get easing function
  getEasingFunction: (easing: string) => {
    switch (easing) {
      case 'linear':
        return (t: number) => t;
      case 'ease-in':
        return (t: number) => t * t;
      case 'ease-out':
        return (t: number) => 1 - Math.pow(1 - t, 2);
      case 'ease-in-out':
        return (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      case 'bounce':
        return (t: number) => {
          if (t < 1 / 2.75) {
            return 7.5625 * t * t;
          } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
          } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
          } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
          }
        };
      case 'elastic':
        return (t: number) => {
          if (t === 0 || t === 1) return t;
          return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * (2 * Math.PI) / 0.4) + 1;
        };
      default:
        return (t: number) => t;
    }
  }
}));