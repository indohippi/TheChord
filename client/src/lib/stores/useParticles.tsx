import { create } from 'zustand';
import { ParticleEffect, ParticleSystem } from '@shared/audioTypes';

interface ParticleStore {
  // Particle system
  particleSystem: ParticleSystem;
  
  // Active particles
  particles: ParticleEffect[];
  
  // Actions
  createParticle: (effect: Omit<ParticleEffect, 'id'>) => void;
  removeParticle: (id: string) => void;
  clearParticles: () => void;
  updateParticles: (deltaTime: number) => void;
  
  // Particle effects
  createExplosion: (position: { x: number; y: number; z: number }, intensity?: number) => void;
  createHeal: (position: { x: number; y: number; z: number }) => void;
  createDamage: (position: { x: number; y: number; z: number }, damage: number) => void;
  createMagic: (position: { x: number; y: number; z: number }, color?: string) => void;
  createSmoke: (position: { x: number; y: number; z: number }) => void;
  createSparkle: (position: { x: number; y: number; z: number }) => void;
  createTrail: (start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }) => void;
  
  // System management
  setMaxParticles: (max: number) => void;
  setGravity: (gravity: number) => void;
  setWind: (wind: { x: number; y: number; z: number }) => void;
  setBounds: (bounds: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }) => void;
}

export const useParticles = create<ParticleStore>((set, get) => ({
  // Initial state
  particleSystem: {
    particles: [],
    maxParticles: 1000,
    gravity: 0.5,
    wind: { x: 0, y: 0, z: 0 },
    bounds: {
      min: { x: -100, y: -100, z: -100 },
      max: { x: 100, y: 100, z: 100 }
    }
  },
  
  particles: [],

  // Create particle
  createParticle: (effect: Omit<ParticleEffect, 'id'>) => {
    const state = get();
    
    if (state.particles.length >= state.particleSystem.maxParticles) {
      // Remove oldest particle
      state.removeParticle(state.particles[0].id);
    }
    
    const newParticle: ParticleEffect = {
      ...effect,
      id: `particle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    set(state => ({
      particles: [...state.particles, newParticle]
    }));
  },

  // Remove particle
  removeParticle: (id: string) => {
    set(state => ({
      particles: state.particles.filter(p => p.id !== id)
    }));
  },

  // Clear all particles
  clearParticles: () => {
    set({ particles: [] });
  },

  // Update particles
  updateParticles: (deltaTime: number) => {
    const state = get();
    const updatedParticles = state.particles.map(particle => {
      // Update position based on speed and direction
      if (particle.direction) {
        particle.position.x += particle.direction.x * particle.speed * deltaTime;
        particle.position.y += particle.direction.y * particle.speed * deltaTime;
        particle.position.z += particle.direction.z * particle.speed * deltaTime;
      }
      
      // Apply gravity
      if (particle.gravity !== undefined) {
        particle.position.y -= particle.gravity * deltaTime;
      }
      
      // Apply wind
      particle.position.x += state.particleSystem.wind.x * deltaTime;
      particle.position.y += state.particleSystem.wind.y * deltaTime;
      particle.position.z += state.particleSystem.wind.z * deltaTime;
      
      // Update duration
      particle.duration -= deltaTime;
      
      // Check bounds
      const bounds = state.particleSystem.bounds;
      if (particle.position.x < bounds.min.x || particle.position.x > bounds.max.x ||
          particle.position.y < bounds.min.y || particle.position.y > bounds.max.y ||
          particle.position.z < bounds.min.z || particle.position.z > bounds.max.z) {
        particle.duration = 0; // Mark for removal
      }
      
      return particle;
    }).filter(particle => particle.duration > 0);
    
    set({ particles: updatedParticles });
  },

  // Create explosion effect
  createExplosion: (position: { x: number; y: number; z: number }, intensity: number = 1) => {
    const state = get();
    const particleCount = Math.floor(20 * intensity);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      
      state.createParticle({
        name: 'explosion',
        type: 'explosion',
        position: { ...position },
        duration: 1 + Math.random() * 2,
        intensity,
        color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`, // Orange to red
        size: 0.5 + Math.random() * 1.5,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 2,
          z: Math.sin(angle) * speed
        },
        gravity: 0.5,
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create heal effect
  createHeal: (position: { x: number; y: number; z: number }) => {
    const state = get();
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1 + Math.random() * 2;
      
      state.createParticle({
        name: 'heal',
        type: 'heal',
        position: { ...position },
        duration: 2 + Math.random() * 2,
        intensity: 1,
        color: `hsl(${Math.random() * 60 + 120}, 100%, 50%)`, // Green to blue
        size: 0.3 + Math.random() * 0.7,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 3 + 1,
          z: Math.sin(angle) * speed
        },
        gravity: -0.2, // Float upward
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create damage effect
  createDamage: (position: { x: number; y: number; z: number }, damage: number) => {
    const state = get();
    const particleCount = Math.min(10, Math.floor(damage / 10));
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      
      state.createParticle({
        name: 'damage',
        type: 'damage',
        position: { ...position },
        duration: 1 + Math.random() * 1.5,
        intensity: 1,
        color: `hsl(${Math.random() * 60 + 300}, 100%, 50%)`, // Red to purple
        size: 0.2 + Math.random() * 0.5,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 2 + 1,
          z: Math.sin(angle) * speed
        },
        gravity: 0.3,
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create magic effect
  createMagic: (position: { x: number; y: number; z: number }, color: string = '#8B5CF6') => {
    const state = get();
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 1 + Math.random() * 2;
      
      state.createParticle({
        name: 'magic',
        type: 'magic',
        position: { ...position },
        duration: 2 + Math.random() * 3,
        intensity: 1,
        color,
        size: 0.4 + Math.random() * 0.8,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 2,
          z: Math.sin(angle) * speed
        },
        gravity: 0.1,
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create smoke effect
  createSmoke: (position: { x: number; y: number; z: number }) => {
    const state = get();
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1;
      
      state.createParticle({
        name: 'smoke',
        type: 'smoke',
        position: { ...position },
        duration: 3 + Math.random() * 4,
        intensity: 1,
        color: `rgba(100, 100, 100, ${0.3 + Math.random() * 0.4})`,
        size: 1 + Math.random() * 2,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 2 + 1,
          z: Math.sin(angle) * speed
        },
        gravity: -0.1, // Float upward
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create sparkle effect
  createSparkle: (position: { x: number; y: number; z: number }) => {
    const state = get();
    const particleCount = 8;
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 0.5 + Math.random() * 1;
      
      state.createParticle({
        name: 'sparkle',
        type: 'sparkle',
        position: { ...position },
        duration: 1 + Math.random() * 2,
        intensity: 1,
        color: `hsl(${Math.random() * 360}, 100%, 80%)`,
        size: 0.1 + Math.random() * 0.3,
        speed,
        direction: {
          x: Math.cos(angle) * speed,
          y: Math.random() * 1,
          z: Math.sin(angle) * speed
        },
        gravity: 0.2,
        fadeOut: true,
        scale: true
      });
    }
  },

  // Create trail effect
  createTrail: (start: { x: number; y: number; z: number }, end: { x: number; y: number; z: number }) => {
    const state = get();
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) +
      Math.pow(end.y - start.y, 2) +
      Math.pow(end.z - start.z, 2)
    );
    
    const particleCount = Math.floor(distance * 2);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const position = {
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
        z: start.z + (end.z - start.z) * t
      };
      
      state.createParticle({
        name: 'trail',
        type: 'trail',
        position,
        duration: 0.5 + Math.random() * 1,
        intensity: 1,
        color: `hsl(${Math.random() * 60 + 200}, 100%, 60%)`,
        size: 0.2 + Math.random() * 0.4,
        speed: 0,
        direction: { x: 0, y: 0, z: 0 },
        gravity: 0,
        fadeOut: true,
        scale: true
      });
    }
  },

  // Set max particles
  setMaxParticles: (max: number) => {
    set(state => ({
      particleSystem: { ...state.particleSystem, maxParticles: max }
    }));
  },

  // Set gravity
  setGravity: (gravity: number) => {
    set(state => ({
      particleSystem: { ...state.particleSystem, gravity }
    }));
  },

  // Set wind
  setWind: (wind: { x: number; y: number; z: number }) => {
    set(state => ({
      particleSystem: { ...state.particleSystem, wind }
    }));
  },

  // Set bounds
  setBounds: (bounds: { min: { x: number; y: number; z: number }; max: { x: number; y: number; z: number } }) => {
    set(state => ({
      particleSystem: { ...state.particleSystem, bounds }
    }));
  }
}));