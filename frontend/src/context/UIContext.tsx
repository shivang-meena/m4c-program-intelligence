
import { createContext, useState, ReactNode } from 'react';

export type UIState = {
  isLoading: boolean;
  globalError: string | null;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
};

export const UIContext = createContext<UIState | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  return (
    <UIContext.Provider value={{ isLoading, globalError, setLoading: setIsLoading, setError: setGlobalError }}>
      {children}
    </UIContext.Provider>
  );
};