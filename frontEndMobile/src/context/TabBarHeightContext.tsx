// src/context/TabBarHeightContext.tsx
import React, { createContext, useContext, useState, useMemo } from "react";

type ContextValue = {
  height: number;
  setHeight: (h: number) => void;
};

const TabBarHeightContext = createContext<ContextValue>({
  height: 0,
  setHeight: () => {},
});

export function TabBarHeightProvider({ children }: { children: React.ReactNode }) {
  const [height, setHeight] = useState(0);
  const value = useMemo(() => ({ height, setHeight }), [height]);

  return (
    <TabBarHeightContext.Provider value={value}>
      {children}
    </TabBarHeightContext.Provider>
  );
}

// Hook utilisé par ScreenContainer pour LIRE la hauteur
export function useTabBarHeight() {
  return useContext(TabBarHeightContext).height;
}

// Hook utilisé par CustomTabBar pour ÉCRIRE la hauteur mesurée
export function useSetTabBarHeight() {
  return useContext(TabBarHeightContext).setHeight;
}