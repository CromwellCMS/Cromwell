import { useCmsSettings } from "@cromwell/core-frontend";
import React from "react";

const useAdminSettingsContext = () => {
  const cmsSets = useCmsSettings()
  return {
    settings: cmsSets
  }
}

export const useAdminSettings = () => {
  return React.useContext(AdminSettingsContext);
}

type ContextType = ReturnType<typeof useAdminSettingsContext>;
const Empty = {} as ContextType;

const AdminSettingsContext = React.createContext<ContextType>(Empty);

export const AdminSettingsContextProvider = ({ children }) => {
  const value = useAdminSettingsContext();

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  )
}