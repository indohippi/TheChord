import { create } from 'zustand';
import { AudioTrack, AudioSettings, AudioState, AudioContext } from '../../../shared/audioTypes';

interface AudioStore {
  // Audio settings
  settings: AudioSettings;
  
  // Audio context
  audioContext: AudioContext;
  
  // Current audio state
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  
  // Audio tracks
  tracks: AudioTrack[];
  
  // Actions
  initializeAudio: () => void;
  loadTrack: (track: AudioTrack) => void;
  playTrack: (trackId: string) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  setVolume: (volume: number) => void;
  setMasterVolume: (volume: number) => void;
  setMusicVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setAmbientVolume: (volume: number) => void;
  toggleMute: () => void;
  fadeIn: (trackId: string, duration: number) => void;
  fadeOut: (duration: number) => void;
  crossfade: (fromTrackId: string, toTrackId: string, duration: number) => void;
  
  // Track management
  addTrack: (track: AudioTrack) => void;
  removeTrack: (trackId: string) => void;
  getTrack: (trackId: string) => AudioTrack | null;
  getTracksByType: (type: 'music' | 'sfx' | 'ambient') => AudioTrack[];
  
  // Playback control
  seek: (time: number) => void;
  setLoop: (loop: boolean) => void;
  updateCurrentTime: (time: number) => void;
}

export const useAudio = create<AudioStore>((set, get) => ({
  // Initial state
  settings: {
    masterVolume: 0.7,
    musicVolume: 0.6,
    sfxVolume: 0.8,
    ambientVolume: 0.5,
    muted: false
  },
  
  audioContext: {
    audioContext: null,
    gainNode: null,
    musicGain: null,
    sfxGain: null,
    ambientGain: null,
    isInitialized: false
  },
  
  currentTrack: null,
  isPlaying: false,
  isPaused: false,
  currentTime: 0,
  duration: 0,
  tracks: [],

  // Initialize audio context
  initializeAudio: () => {
    const state = get();
    if (state.audioContext.isInitialized) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      const musicGain = audioContext.createGain();
      const sfxGain = audioContext.createGain();
      const ambientGain = audioContext.createGain();

      // Connect gain nodes
      musicGain.connect(gainNode);
      sfxGain.connect(gainNode);
      ambientGain.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set initial volumes
      gainNode.gain.value = state.settings.masterVolume;
      musicGain.gain.value = state.settings.musicVolume;
      sfxGain.gain.value = state.settings.sfxVolume;
      ambientGain.gain.value = state.settings.ambientVolume;

      set({
        audioContext: {
          audioContext,
          gainNode,
          musicGain,
          sfxGain,
          ambientGain,
          isInitialized: true
        }
      });
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  },

  // Load audio track
  loadTrack: (track: AudioTrack) => {
    set(state => ({
      tracks: [...state.tracks.filter(t => t.id !== track.id), track]
    }));
  },

  // Play track
  playTrack: (trackId: string) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);
    
    if (!track || !state.audioContext.isInitialized) return;

    // Stop current track if playing
    if (state.currentTrack && state.isPlaying) {
      state.stopTrack();
    }

    // Create audio element
    const audio = new Audio(track.url);
    audio.volume = track.volume;
    audio.loop = track.loop;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      set({ duration: audio.duration });
    });

    audio.addEventListener('timeupdate', () => {
      set({ currentTime: audio.currentTime });
    });

    audio.addEventListener('ended', () => {
      if (!track.loop) {
        set({
          isPlaying: false,
          currentTrack: null,
          currentTime: 0
        });
      }
    });

    // Play the track
    audio.play().then(() => {
      set({
        currentTrack: track,
        isPlaying: true,
        isPaused: false,
        currentTime: 0
      });
    }).catch(error => {
      console.error('Failed to play track:', error);
    });
  },

  // Pause track
  pauseTrack: () => {
    const state = get();
    if (state.currentTrack && state.isPlaying) {
      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        audio.pause();
        set({ isPaused: true, isPlaying: false });
      }
    }
  },

  // Resume track
  resumeTrack: () => {
    const state = get();
    if (state.currentTrack && state.isPaused) {
      const audio = document.querySelector('audio') as HTMLAudioElement;
      if (audio) {
        audio.play().then(() => {
          set({ isPaused: false, isPlaying: true });
        }).catch(error => {
          console.error('Failed to resume track:', error);
        });
      }
    }
  },

  // Stop track
  stopTrack: () => {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    set({
      currentTrack: null,
      isPlaying: false,
      isPaused: false,
      currentTime: 0
    });
  },

  // Set volume
  setVolume: (volume: number) => {
    const state = get();
    if (state.audioContext.gainNode) {
      state.audioContext.gainNode.gain.value = volume;
    }
    
    set(state => ({
      settings: { ...state.settings, masterVolume: volume }
    }));
  },

  // Set master volume
  setMasterVolume: (volume: number) => {
    const state = get();
    if (state.audioContext.gainNode) {
      state.audioContext.gainNode.gain.value = volume;
    }
    
    set(state => ({
      settings: { ...state.settings, masterVolume: volume }
    }));
  },

  // Set music volume
  setMusicVolume: (volume: number) => {
    const state = get();
    if (state.audioContext.musicGain) {
      state.audioContext.musicGain.gain.value = volume;
    }
    
    set(state => ({
      settings: { ...state.settings, musicVolume: volume }
    }));
  },

  // Set SFX volume
  setSfxVolume: (volume: number) => {
    const state = get();
    if (state.audioContext.sfxGain) {
      state.audioContext.sfxGain.gain.value = volume;
    }
    
    set(state => ({
      settings: { ...state.settings, sfxVolume: volume }
    }));
  },

  // Set ambient volume
  setAmbientVolume: (volume: number) => {
    const state = get();
    if (state.audioContext.ambientGain) {
      state.audioContext.ambientGain.gain.value = volume;
    }
    
    set(state => ({
      settings: { ...state.settings, ambientVolume: volume }
    }));
  },

  // Toggle mute
  toggleMute: () => {
    const state = get();
    const newMuted = !state.settings.muted;
    
    if (state.audioContext.gainNode) {
      state.audioContext.gainNode.gain.value = newMuted ? 0 : state.settings.masterVolume;
    }
    
    set(state => ({
      settings: { ...state.settings, muted: newMuted }
    }));
  },

  // Fade in
  fadeIn: (trackId: string, duration: number) => {
    const state = get();
    const track = state.tracks.find(t => t.id === trackId);
    
    if (!track || !state.audioContext.isInitialized) return;

    state.playTrack(trackId);
    
    if (state.audioContext.gainNode) {
      const gainNode = state.audioContext.gainNode;
      gainNode.gain.value = 0;
      
      const startTime = state.audioContext.audioContext!.currentTime;
      gainNode.gain.linearRampToValueAtTime(
        state.settings.masterVolume,
        startTime + duration
      );
    }
  },

  // Fade out
  fadeOut: (duration: number) => {
    const state = get();
    
    if (state.audioContext.gainNode) {
      const gainNode = state.audioContext.gainNode;
      const startTime = state.audioContext.audioContext!.currentTime;
      
      gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
      
      setTimeout(() => {
        state.stopTrack();
      }, duration * 1000);
    }
  },

  // Crossfade between tracks
  crossfade: (fromTrackId: string, toTrackId: string, duration: number) => {
    const state = get();
    
    // Start fade out of current track
    state.fadeOut(duration);
    
    // Start fade in of new track
    setTimeout(() => {
      state.fadeIn(toTrackId, duration);
    }, duration * 1000 / 2);
  },

  // Add track
  addTrack: (track: AudioTrack) => {
    set(state => ({
      tracks: [...state.tracks, track]
    }));
  },

  // Remove track
  removeTrack: (trackId: string) => {
    set(state => ({
      tracks: state.tracks.filter(t => t.id !== trackId)
    }));
  },

  // Get track
  getTrack: (trackId: string) => {
    const state = get();
    return state.tracks.find(t => t.id === trackId) || null;
  },

  // Get tracks by type
  getTracksByType: (type: 'music' | 'sfx' | 'ambient') => {
    const state = get();
    return state.tracks.filter(t => t.type === type);
  },

  // Seek to time
  seek: (time: number) => {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = time;
      set({ currentTime: time });
    }
  },

  // Set loop
  setLoop: (loop: boolean) => {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (audio) {
      audio.loop = loop;
    }
    
    set(state => ({
      currentTrack: state.currentTrack ? { ...state.currentTrack, loop } : null
    }));
  },

  // Update current time
  updateCurrentTime: (time: number) => {
    set({ currentTime: time });
  }
}));