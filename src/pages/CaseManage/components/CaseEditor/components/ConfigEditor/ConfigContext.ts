import { createContext, useContext } from "react";

export interface ConfigContextProps {
  getConfig: <T>(path: string) => T;
}

export const ConfigContext = createContext<ConfigContextProps>(
  {} as ConfigContextProps
);

export const useConfig = () => {
  return useContext(ConfigContext);
};
