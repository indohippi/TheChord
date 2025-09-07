import React, { useEffect, useState } from 'react';
import { useUI } from '@/lib/stores/useUI';
import { Tooltip } from './Tooltip';
import { Notification } from './Notification';
import { Modal } from './Modal';
import { LoadingSpinner } from './LoadingSpinner';

interface EnhancedGameUIProps {
  children: React.ReactNode;
}

export const EnhancedGameUI: React.FC<EnhancedGameUIProps> = ({ children }) => {
  const {
    uiState,
    addNotification,
    removeNotification,
    clearNotifications,
    showTooltip,
    hideTooltip,
    clearTooltips,
    showModal,
    hideModal,
    clearModals,
    setLoading,
    clearLoading,
    setBreakpoint,
    setOrientation
  } = useUI();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize responsive breakpoints
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      if (width < 768) {
        setBreakpoint('mobile');
      } else if (width < 1024) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('desktop');
      }
      
      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    setIsInitialized(true);

    return () => window.removeEventListener('resize', updateBreakpoint);
  }, [setBreakpoint, setOrientation]);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    const theme = uiState.theme;
    
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-info', theme.colors.info);
    
    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);
    root.style.setProperty('--font-mono', theme.fonts.mono);
    
    root.style.setProperty('--spacing-xs', theme.spacing.xs);
    root.style.setProperty('--spacing-sm', theme.spacing.sm);
    root.style.setProperty('--spacing-md', theme.spacing.md);
    root.style.setProperty('--spacing-lg', theme.spacing.lg);
    root.style.setProperty('--spacing-xl', theme.spacing.xl);
    
    root.style.setProperty('--border-radius-sm', theme.borderRadius.sm);
    root.style.setProperty('--border-radius-md', theme.borderRadius.md);
    root.style.setProperty('--border-radius-lg', theme.borderRadius.lg);
    
    root.style.setProperty('--shadow-sm', theme.shadows.sm);
    root.style.setProperty('--shadow-md', theme.shadows.md);
    root.style.setProperty('--shadow-lg', theme.shadows.lg);
  }, [uiState.theme]);

  useEffect(() => {
    // Apply accessibility settings
    const root = document.documentElement;
    const accessibility = uiState.accessibility;
    
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    if (accessibility.colorBlindSupport) {
      root.classList.add('color-blind-support');
    } else {
      root.classList.remove('color-blind-support');
    }
  }, [uiState.accessibility]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="enhanced-game-ui">
      {children}
      
      {/* Tooltips */}
      {uiState.tooltips.map((tooltip) => (
        <Tooltip
          key={tooltip.id}
          tooltip={tooltip}
          onClose={() => hideTooltip(tooltip.id)}
        />
      ))}
      
      {/* Notifications */}
      {uiState.notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
      
      {/* Modals */}
      {uiState.modals.map((modal) => (
        <Modal
          key={modal.id}
          modal={modal}
          onClose={() => hideModal(modal.id)}
        />
      ))}
      
      {/* Loading Spinner */}
      <LoadingSpinner loading={uiState.loading} />
      
      {/* Global Styles */}
      <style jsx global>{`
        .enhanced-game-ui {
          --color-primary: var(--color-primary, #3B82F6);
          --color-secondary: var(--color-secondary, #6B7280);
          --color-accent: var(--color-accent, #8B5CF6);
          --color-background: var(--color-background, #111827);
          --color-surface: var(--color-surface, #1F2937);
          --color-text: var(--color-text, #F9FAFB);
          --color-text-secondary: var(--color-text-secondary, #9CA3AF);
          --color-border: var(--color-border, #374151);
          --color-success: var(--color-success, #10B981);
          --color-warning: var(--color-warning, #F59E0B);
          --color-error: var(--color-error, #EF4444);
          --color-info: var(--color-info, #3B82F6);
          
          --font-primary: var(--font-primary, 'Inter, system-ui, sans-serif');
          --font-secondary: var(--font-secondary, 'Inter, system-ui, sans-serif');
          --font-mono: var(--font-mono, 'JetBrains Mono, monospace');
          
          --spacing-xs: var(--spacing-xs, 0.25rem);
          --spacing-sm: var(--spacing-sm, 0.5rem);
          --spacing-md: var(--spacing-md, 1rem);
          --spacing-lg: var(--spacing-lg, 1.5rem);
          --spacing-xl: var(--spacing-xl, 2rem);
          
          --border-radius-sm: var(--border-radius-sm, 0.25rem);
          --border-radius-md: var(--border-radius-md, 0.5rem);
          --border-radius-lg: var(--border-radius-lg, 0.75rem);
          
          --shadow-sm: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));
          --shadow-md: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
          --shadow-lg: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
        }
        
        .high-contrast {
          filter: contrast(150%);
        }
        
        .large-text {
          font-size: 1.2em;
        }
        
        .reduced-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        .color-blind-support {
          filter: hue-rotate(180deg);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          .enhanced-game-ui {
            --color-background: #111827;
            --color-surface: #1F2937;
            --color-text: #F9FAFB;
            --color-text-secondary: #9CA3AF;
            --color-border: #374151;
          }
        }
        
        @media (max-width: 768px) {
          .enhanced-game-ui {
            --spacing-md: 0.75rem;
            --spacing-lg: 1rem;
            --spacing-xl: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};