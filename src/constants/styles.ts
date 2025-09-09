// Constantes de estilos reutilizables para mantener consistencia en toda la aplicación

export const PANEL_STYLES = {
  base: 'bg-black/30 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20',
  padding: {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-10'
  }
} as const;

export const BUTTON_STYLES = {
  primary: 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white',
  success: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white',
  danger: 'bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white',
  sizes: {
    sm: 'px-4 py-2 text-sm font-medium rounded-lg',
    md: 'px-6 py-3 font-semibold rounded-xl',
    lg: 'px-8 py-4 text-lg font-bold rounded-xl'
  },
  base: 'transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:scale-100'
} as const;

export const INPUT_STYLES = {
  base: 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all',
  checkbox: 'w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2'
} as const;

export const TEXT_STYLES = {
  title: {
    main: 'text-4xl font-bold text-white mb-3 drop-shadow-lg',
    section: 'text-xl font-bold text-white mb-6',
    subsection: 'text-lg font-semibold text-white mb-4'
  },
  subtitle: {
    main: 'text-white/90 text-lg font-medium drop-shadow-md',
    secondary: 'text-white/70 text-sm'
  },
  body: {
    white: 'text-white font-medium',
    muted: 'text-white/70',
    error: 'text-red-400 text-sm'
  }
} as const;

export const LAYOUT_STYLES = {
  container: 'w-full',
  grid: {
    twoCol: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
    threeCol: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
  },
  spacing: {
    section: 'mb-8',
    subsection: 'mb-6',
    item: 'mb-4'
  }
} as const;

export const ANIMATION_STYLES = {
  fadeIn: 'animate-fade-in',
  bounceSlow: 'animate-bounce-slow',
  gradientX: 'animate-gradient-x',
  slideInRight: 'animate-slide-in-right',
  pulseGlow: 'animate-pulse-glow',
  hoverLift: 'hover-lift',
  inputFocus: 'input-focus'
} as const;

export const STATUS_STYLES = {
  success: 'bg-green-500/10 border-green-500/30 text-green-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-400',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
} as const;
