'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ============================================================================
// TIPOS
// ============================================================================

export type ThemeType = 'light' | 'dark' | 'vibrant';

interface ThemeColors {
  // Backgrounds
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  bgCardHover: string;
  bgInput: string;
  
  // Borders
  borderPrimary: string;
  borderSecondary: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Sidebar
  sidebarBg: string;
  sidebarText: string;
  sidebarHover: string;
  sidebarActive: string;
  
  // Topbar
  topbarBg: string;
  topbarText: string;
  
  // Accent (AahBrant red)
  accent: string;
  accentHover: string;
  accentBg: string;
  
  // Status colors
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  info: string;
  infoBg: string;
}

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
  themeName: string;
}

// ============================================================================
// DEFINIÇÃO DOS TEMAS
// ============================================================================

const themes: Record<ThemeType, ThemeColors> = {
  // Tema Claro - Clean e profissional
  light: {
    bgPrimary: '#F8F9FA',
    bgSecondary: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardHover: '#F1F3F4',
    bgInput: '#FFFFFF',
    
    borderPrimary: '#E0E0E0',
    borderSecondary: '#EEEEEE',
    
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textMuted: '#757575',
    
    sidebarBg: '#1A1A1A',
    sidebarText: '#E0E0E0',
    sidebarHover: '#2D2D2D',
    sidebarActive: '#96110D',
    
    topbarBg: '#FFFFFF',
    topbarText: '#1A1A1A',
    
    accent: '#96110D',
    accentHover: '#B81510',
    accentBg: 'rgba(150, 17, 13, 0.1)',
    
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.1)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.1)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.1)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.1)',
  },
  
  // Tema Escuro - O atual
  dark: {
    bgPrimary: '#0A0A0A',
    bgSecondary: '#111111',
    bgCard: 'rgba(17, 17, 17, 0.8)',
    bgCardHover: 'rgba(38, 38, 38, 0.5)',
    bgInput: '#1A1A1A',
    
    borderPrimary: 'rgba(38, 38, 38, 0.6)',
    borderSecondary: 'rgba(38, 38, 38, 0.4)',
    
    textPrimary: '#F5F5F5',
    textSecondary: '#A0A0A0',
    textMuted: '#6B6B6B',
    
    sidebarBg: '#0D0D0D',
    sidebarText: '#A0A0A0',
    sidebarHover: '#1A1A1A',
    sidebarActive: '#96110D',
    
    topbarBg: '#0D0D0D',
    topbarText: '#F5F5F5',
    
    accent: '#96110D',
    accentHover: '#B81510',
    accentBg: 'rgba(150, 17, 13, 0.2)',
    
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.2)',
    warning: '#F59E0B',
    warningBg: 'rgba(245, 158, 11, 0.2)',
    error: '#EF4444',
    errorBg: 'rgba(239, 68, 68, 0.2)',
    info: '#3B82F6',
    infoBg: 'rgba(59, 130, 246, 0.2)',
  },
  
  // Tema Jovial/Vibrante - Moderno e colorido
  vibrant: {
    bgPrimary: '#F0F4FF',
    bgSecondary: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardHover: '#E8EDFF',
    bgInput: '#FFFFFF',
    
    borderPrimary: '#C7D2FE',
    borderSecondary: '#E0E7FF',
    
    textPrimary: '#1E293B',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    
    sidebarBg: 'linear-gradient(180deg, #4F46E5 0%, #7C3AED 100%)',
    sidebarText: '#FFFFFF',
    sidebarHover: 'rgba(255, 255, 255, 0.1)',
    sidebarActive: '#FBBF24',
    
    topbarBg: '#FFFFFF',
    topbarText: '#1E293B',
    
    accent: '#7C3AED',
    accentHover: '#6D28D9',
    accentBg: 'rgba(124, 58, 237, 0.1)',
    
    success: '#10B981',
    successBg: 'rgba(16, 185, 129, 0.15)',
    warning: '#FBBF24',
    warningBg: 'rgba(251, 191, 36, 0.15)',
    error: '#F43F5E',
    errorBg: 'rgba(244, 63, 94, 0.15)',
    info: '#06B6D4',
    infoBg: 'rgba(6, 182, 212, 0.15)',
  },
};

const themeNames: Record<ThemeType, string> = {
  light: 'Claro',
  dark: 'Escuro',
  vibrant: 'Jovial',
};

// ============================================================================
// CONTEXTO
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const [mounted, setMounted] = useState(false);

  // Carrega tema do localStorage
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('genesis-theme') as ThemeType;
    if (savedTheme && themes[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  // Salva tema no localStorage e aplica CSS variables
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('genesis-theme', newTheme);
  };

  // Aplica CSS variables no documento
  useEffect(() => {
    if (!mounted) return;
    
    const colors = themes[theme];
    const root = document.documentElement;
    
    // Aplica todas as cores como CSS variables
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    
    // Adiciona classe do tema no body
    document.body.className = `theme-${theme}`;
  }, [theme, mounted]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    colors: themes[theme],
    themeName: themeNames[theme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { themes, themeNames };
