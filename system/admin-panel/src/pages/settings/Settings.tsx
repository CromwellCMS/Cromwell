import React from "react";
import { AdminSettingsContextProvider, useAdminSettings } from "../../hooks/useAdminSettings";

export const SettingsPage = () => {
  const data = useAdminSettings();

  return (
    <div className="p-4">
      <h1 className="font-bold my-3 text-3xl inline-block">
        Settings
      </h1>

      <div className="bg-white rounded-lg h-96 shadow-lg w-full">
        
      </div>
    </div>
  )
}

export const SettingsPageWithProvider = () => {
  return (
    <AdminSettingsContextProvider>
      <SettingsPage />
    </AdminSettingsContextProvider>
  )
}

export default SettingsPageWithProvider;