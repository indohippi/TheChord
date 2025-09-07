import { create } from 'zustand';
import { Tooltip, Notification, Modal, LoadingState, Theme, AccessibilitySettings, UIState, ResponsiveBreakpoint } from '../../../shared/uiTypes';

interface UIStore {
  // UI state
  uiState: UIState;
  
  // Actions
  setTheme: (theme: Theme) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Tooltips
  showTooltip: (tooltip: Omit<Tooltip, 'id' | 'visible'>) => void;
  hideTooltip: (id: string) => void;
  updateTooltipPosition: (id: string, position: { x: number; y: number }) => void;
  clearTooltips: () => void;
  
  // Modals
  showModal: (modal: Omit<Modal, 'id'>) => void;
  hideModal: (id: string) => void;
  clearModals: () => void;
  
  // Loading
  setLoading: (loading: Partial<LoadingState>) => void;
  clearLoading: () => void;
  
  // Layout
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setHeaderHeight: (height: number) => void;
  setFooterHeight: (height: number) => void;
  setFooterVisible: (visible: boolean) => void;
  
  // Responsive
  setBreakpoint: (breakpoint: string) => void;
  setOrientation: (orientation: 'portrait' | 'landscape') => void;
  
  // Utilities
  getResponsiveValue: <T>(values: Record<string, T>) => T;
  isMobile: () => boolean;
  isTablet: () => boolean;
  isDesktop: () => boolean;
}

export const useUI = create<UIStore>((set, get) => ({
  // Initial state
  uiState: {
    theme: {
      name: 'dark',
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#8B5CF6',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        border: '#374151',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fonts: {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Inter, system-ui, sans-serif',
        mono: 'JetBrains Mono, monospace'
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      focusVisible: true,
      colorBlindSupport: false
    },
    notifications: [],
    tooltips: [],
    modals: [],
    loading: {
      isLoading: false
    },
    sidebar: {
      collapsed: false,
      width: 280
    },
    header: {
      height: 64,
      sticky: true
    },
    footer: {
      height: 48,
      visible: true
    },
    breakpoint: 'desktop',
    orientation: 'landscape'
  },

  // Set theme
  setTheme: (theme: Theme) => {
    set(state => ({
      uiState: { ...state.uiState, theme }
    }));
  },

  // Update accessibility settings
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        accessibility: { ...state.uiState.accessibility, ...settings }
      }
    }));
  },

  // Add notification
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    set(state => ({
      uiState: {
        ...state.uiState,
        notifications: [...state.uiState.notifications, newNotification]
      }
    }));

    // Auto-remove notification after duration
    if (notification.duration && !notification.persistent) {
      setTimeout(() => {
        get().removeNotification(newNotification.id);
      }, notification.duration);
    }
  },

  // Remove notification
  removeNotification: (id: string) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        notifications: state.uiState.notifications.filter(n => n.id !== id)
      }
    }));
  },

  // Clear notifications
  clearNotifications: () => {
    set(state => ({
      uiState: { ...state.uiState, notifications: [] }
    }));
  },

  // Show tooltip
  showTooltip: (tooltip: Omit<Tooltip, 'id' | 'visible'>) => {
    const newTooltip: Tooltip = {
      ...tooltip,
      id: `tooltip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      visible: true
    };

    set(state => ({
      uiState: {
        ...state.uiState,
        tooltips: [...state.uiState.tooltips, newTooltip]
      }
    }));
  },

  // Hide tooltip
  hideTooltip: (id: string) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        tooltips: state.uiState.tooltips.map(t => 
          t.id === id ? { ...t, visible: false } : t
        )
      }
    }));
  },

  // Update tooltip position
  updateTooltipPosition: (id: string, position: { x: number; y: number }) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        tooltips: state.uiState.tooltips.map(t => 
          t.id === id ? { ...t, position } : t
        )
      }
    }));
  },

  // Clear tooltips
  clearTooltips: () => {
    set(state => ({
      uiState: { ...state.uiState, tooltips: [] }
    }));
  },

  // Show modal
  showModal: (modal: Omit<Modal, 'id'>) => {
    const newModal: Modal = {
      ...modal,
      id: `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    set(state => ({
      uiState: {
        ...state.uiState,
        modals: [...state.uiState.modals, newModal]
      }
    }));
  },

  // Hide modal
  hideModal: (id: string) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        modals: state.uiState.modals.filter(m => m.id !== id)
      }
    }));
  },

  // Clear modals
  clearModals: () => {
    set(state => ({
      uiState: { ...state.uiState, modals: [] }
    }));
  },

  // Set loading state
  setLoading: (loading: Partial<LoadingState>) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        loading: { ...state.uiState.loading, ...loading }
      }
    }));
  },

  // Clear loading state
  clearLoading: () => {
    set(state => ({
      uiState: {
        ...state.uiState,
        loading: { isLoading: false }
      }
    }));
  },

  // Toggle sidebar
  toggleSidebar: () => {
    set(state => ({
      uiState: {
        ...state.uiState,
        sidebar: {
          ...state.uiState.sidebar,
          collapsed: !state.uiState.sidebar.collapsed
        }
      }
    }));
  },

  // Set sidebar width
  setSidebarWidth: (width: number) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        sidebar: { ...state.uiState.sidebar, width }
      }
    }));
  },

  // Set header height
  setHeaderHeight: (height: number) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        header: { ...state.uiState.header, height }
      }
    }));
  },

  // Set footer height
  setFooterHeight: (height: number) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        footer: { ...state.uiState.footer, height }
      }
    }));
  },

  // Set footer visible
  setFooterVisible: (visible: boolean) => {
    set(state => ({
      uiState: {
        ...state.uiState,
        footer: { ...state.uiState.footer, visible }
      }
    }));
  },

  // Set breakpoint
  setBreakpoint: (breakpoint: string) => {
    set(state => ({
      uiState: { ...state.uiState, breakpoint }
    }));
  },

  // Set orientation
  setOrientation: (orientation: 'portrait' | 'landscape') => {
    set(state => ({
      uiState: { ...state.uiState, orientation }
    }));
  },

  // Get responsive value
  getResponsiveValue: <T>(values: Record<string, T>) => {
    const state = get();
    const breakpoint = state.uiState.breakpoint;
    return values[breakpoint] || values['desktop'] || Object.values(values)[0];
  },

  // Check if mobile
  isMobile: () => {
    const state = get();
    return state.uiState.breakpoint === 'mobile';
  },

  // Check if tablet
  isTablet: () => {
    const state = get();
    return state.uiState.breakpoint === 'tablet';
  },

  // Check if desktop
  isDesktop: () => {
    const state = get();
    return state.uiState.breakpoint === 'desktop';
  }
}));