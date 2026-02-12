import React, { createContext, useContext, useState, useEffect } from "react";
import { useCompanyProfile } from "../hooks/useCompanyProfile";

interface ThemeContextType {
  /**
   * Whether brutalist theme is currently active (either permanently set or temporarily toggled)
   */
  isBrutalist: boolean;
  /**
   * Whether the user has permanently set brutalist theme in their profile
   */
  isPermanentBrutalist: boolean;
  /**
   * Toggle the temporary brutalist theme (session-only, not persisted)
   */
  toggleBrutalist: () => void;
  /**
   * Whether the toggle button should be shown (false when permanently set)
   */
  showToggleButton: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: profile } = useCompanyProfile();
  const [temporaryBrutalist, setTemporaryBrutalist] = useState(false);

  // Check if user has permanently set brutalist theme
  const isPermanentBrutalist = profile?.use_brutalist_theme ?? false;

  // Brutalist is active if either permanently set OR temporarily toggled
  const isBrutalist = isPermanentBrutalist || temporaryBrutalist;

  // Show toggle button only when not permanently set
  const showToggleButton = !isPermanentBrutalist;

  // Toggle temporary brutalist mode
  const toggleBrutalist = () => {
    setTemporaryBrutalist((prev) => !prev);
  };

  // Reset temporary state when permanent setting changes
  useEffect(() => {
    if (isPermanentBrutalist) {
      setTemporaryBrutalist(false);
    }
  }, [isPermanentBrutalist]);

  // Apply theme class to document root for global styling
  useEffect(() => {
    if (isBrutalist) {
      document.documentElement.classList.add("brutalist-theme");
    } else {
      document.documentElement.classList.remove("brutalist-theme");
    }

    return () => {
      document.documentElement.classList.remove("brutalist-theme");
    };
  }, [isBrutalist]);

  return (
    <ThemeContext.Provider
      value={{
        isBrutalist,
        isPermanentBrutalist,
        toggleBrutalist,
        showToggleButton,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Hook that can be used outside of ThemeProvider (returns safe defaults)
 * Useful for components that may or may not be wrapped in ThemeProvider
 */
export function useThemeSafe(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    return {
      isBrutalist: false,
      isPermanentBrutalist: false,
      toggleBrutalist: () => {},
      showToggleButton: false,
    };
  }
  return context;
}
