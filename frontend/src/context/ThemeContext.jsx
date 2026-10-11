import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import { THEMES, FONTS, getThemeById, getFontById } from '../constants/themes';
import { toast } from 'sonner';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [activeThemeId, setActiveThemeId] = useState(() => {
    try {
      return localStorage.getItem('dhansiri_theme') || 'golden-harvest';
    } catch {
      return 'golden-harvest';
    }
  });

  const [activeFontId, setActiveFontId] = useState(() => {
    try {
      return localStorage.getItem('dhansiri_font') || 'playfair';
    } catch {
      return 'playfair';
    }
  });

  const [loading, setLoading] = useState(true);

  // Apply CSS variables and font styles to DOM
  const applyStylesToDom = useCallback((themeId, fontId) => {
    const theme = getThemeById(themeId);
    const font = getFontById(fontId);
    const root = document.documentElement;

    // Apply color palette variables
    root.style.setProperty('--brand-primary', theme.colors.primary);
    root.style.setProperty('--brand-primary-hover', theme.colors.primaryHover);
    root.style.setProperty('--brand-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--brand-accent', theme.colors.accent);
    root.style.setProperty('--brand-accent-hover', theme.colors.accentHover);
    root.style.setProperty('--brand-accent-light', theme.colors.accentLight);
    root.style.setProperty('--brand-bg', theme.colors.bgMain);
    root.style.setProperty('--brand-surface', theme.colors.bgSurface);
    root.style.setProperty('--brand-subtle', theme.colors.bgSubtle);
    root.style.setProperty('--brand-border', theme.colors.border);
    root.style.setProperty('--brand-border-light', theme.colors.borderLight);
    root.style.setProperty('--brand-text', theme.colors.textPrimary);
    root.style.setProperty('--brand-text-muted', theme.colors.textMuted);
    root.style.setProperty('--brand-footer-bg', theme.colors.footerBg);
    root.style.setProperty('--brand-footer-text', theme.colors.footerText);
    root.style.setProperty('--brand-footer-border', theme.colors.footerBorder);

    // Dynamic emerald override variables for Tailwind elements
    root.style.setProperty('--color-emerald-950', theme.colors.primaryHover);
    root.style.setProperty('--color-emerald-900', theme.colors.primaryHover);
    root.style.setProperty('--color-emerald-800', theme.colors.primary);
    root.style.setProperty('--color-emerald-700', theme.colors.primary);
    root.style.setProperty('--color-emerald-600', theme.colors.primary);
    root.style.setProperty('--color-emerald-500', theme.colors.primary);
    root.style.setProperty('--color-emerald-200', theme.colors.primaryLight);
    root.style.setProperty('--color-emerald-100', theme.colors.primaryLight);
    root.style.setProperty('--color-emerald-50', theme.colors.primaryLight);

    // Dynamic accent overrides
    root.style.setProperty('--color-amber-600', theme.colors.accent);
    root.style.setProperty('--color-amber-500', theme.colors.accent);
    root.style.setProperty('--color-amber-400', theme.colors.accentLight);

    // Apply font variables
    root.style.setProperty('--font-heading', font.headingFamily);
    root.style.setProperty('--font-body', font.bodyFamily);

    // Set attributes for CSS hooks
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-font', fontId);

    // Update body background and font directly for seamless rendering
    document.body.style.backgroundColor = theme.colors.bgMain;
    document.body.style.color = theme.colors.textPrimary;
    document.body.style.fontFamily = font.bodyFamily;
  }, []);

  // Initial immediate application from local cache
  useEffect(() => {
    applyStylesToDom(activeThemeId, activeFontId);
  }, []);

  // Fetch settings from API
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/cms/settings');
      const settingsData = res?.data || res;
      if (settingsData && settingsData.activeTheme) {
        setSettings(settingsData);
        // Only override if user doesn't have an explicit local preference
        const savedTheme = localStorage.getItem('dhansiri_theme');
        const themeId = savedTheme || settingsData.activeTheme || 'golden-harvest';
        const savedFont = localStorage.getItem('dhansiri_font');
        const fontId = savedFont || settingsData.activeFont || 'playfair';

        setActiveThemeId(themeId);
        setActiveFontId(fontId);
        applyStylesToDom(themeId, fontId);
      }
    } catch (err) {
      console.warn('Using local theme settings:', err);
      applyStylesToDom(activeThemeId, activeFontId);
    } finally {
      setLoading(false);
    }
  }, [applyStylesToDom, activeThemeId, activeFontId]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Persist theme selection
  const setTheme = async (themeId) => {
    setActiveThemeId(themeId);
    try {
      localStorage.setItem('dhansiri_theme', themeId);
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
    applyStylesToDom(themeId, activeFontId);

    try {
      const res = await api.put('/cms/settings', { activeTheme: themeId });
      if (res.success || res.data) {
        setSettings(res.data || res);
        toast.success(`Theme updated to "${getThemeById(themeId).name}"`);
      }
    } catch (err) {
      // Still active locally even if server save is unauthorized
      toast.success(`Theme "${getThemeById(themeId).name}" applied locally`);
    }
  };

  // Persist font selection
  const setFont = async (fontId) => {
    setActiveFontId(fontId);
    try {
      localStorage.setItem('dhansiri_font', fontId);
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
    applyStylesToDom(activeThemeId, fontId);

    try {
      const res = await api.put('/cms/settings', { activeFont: fontId });
      if (res.success || res.data) {
        setSettings(res.data || res);
        toast.success(`Typography updated to "${getFontById(fontId).name}"`);
      }
    } catch (err) {
      toast.success(`Typography "${getFontById(fontId).name}" applied locally`);
    }
  };

  // General settings update (hero, contact, logistics, etc.)
  const updateSettings = async (updatedFields) => {
    try {
      const res = await api.put('/cms/settings', updatedFields);
      const data = res.data || res;
      setSettings(data);
      if (updatedFields.activeTheme || updatedFields.activeFont) {
        const tId = updatedFields.activeTheme || activeThemeId;
        const fId = updatedFields.activeFont || activeFontId;
        setActiveThemeId(tId);
        setActiveFontId(fId);
        applyStylesToDom(tId, fId);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  const currentTheme = getThemeById(activeThemeId);
  const currentFont = getFontById(activeFontId);

  return (
    <ThemeContext.Provider
      value={{
        settings,
        loading,
        activeThemeId,
        activeFontId,
        currentTheme,
        currentFont,
        themes: THEMES,
        fonts: FONTS,
        setTheme,
        setFont,
        updateSettings,
        refreshSettings: fetchSettings
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
