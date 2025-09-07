export interface Tooltip {
  id: string;
  content: string;
  position: { x: number; y: number };
  visible: boolean;
  delay?: number;
  maxWidth?: number;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  theme?: 'light' | 'dark' | 'info' | 'warning' | 'error' | 'success';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  timestamp: Date;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface Modal {
  id: string;
  title: string;
  content: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  onClose?: () => void;
  actions?: ModalAction[];
}

export interface ModalAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  progress?: number;
  indeterminate?: boolean;
}

export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  fonts: {
    primary: string;
    secondary: string;
    mono: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlindSupport: boolean;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
}

export interface UIState {
  theme: Theme;
  accessibility: AccessibilitySettings;
  notifications: Notification[];
  tooltips: Tooltip[];
  modals: Modal[];
  loading: LoadingState;
  sidebar: {
    collapsed: boolean;
    width: number;
  };
  header: {
    height: number;
    sticky: boolean;
  };
  footer: {
    height: number;
    visible: boolean;
  };
  breakpoint: string;
  orientation: 'portrait' | 'landscape';
}

export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

export interface TransitionConfig {
  property: string;
  duration: number;
  easing: string;
  delay?: number;
}

export interface LayoutConfig {
  grid: {
    columns: number;
    gap: string;
    autoRows?: string;
    autoColumns?: string;
  };
  flexbox: {
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    wrap: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    gap: string;
  };
  spacing: {
    margin: string;
    padding: string;
  };
  sizing: {
    width: string;
    height: string;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
  };
}