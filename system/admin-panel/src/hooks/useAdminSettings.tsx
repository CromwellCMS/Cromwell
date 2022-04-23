import { setStoreItem, TAdminCustomEntity, TAdminCustomField, TCmsConfig } from "@cromwell/core";
import { CustomEntity } from "@cromwell/core-backend";
import { getRestApiClient, useCmsSettings } from "@cromwell/core-frontend";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "../components/toast/toast";

const client = getRestApiClient()

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any

type CustomEntityType = ArrayElement<TAdminCmsSettingsType["customEntities"]>;

export type TAdminCmsSettingsType = AsyncReturnType<typeof client.getAdminCmsSettings>

const uniqBy = (arr: any[], predicate?: any) => {
  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
  
  return [...arr.reduce((map, item) => {
    const key = (item === null || item === undefined) ? 
      item : cb(item);
    
    map.has(key) || map.set(key, item);
    
    return map;
  }, new Map()).values()];
};

const useAdminSettingsContext = () => {
  const cmsSets = useCmsSettings()
  const [adminSettings, setAdminSettings] = useState<TAdminCmsSettingsType>(null);
  
  const getAdminCmsSettings = useCallback(async () => {
    const client = getRestApiClient()

    try {
      const settings = await client.getAdminCmsSettings();

      if (settings) {
        if (!Array.isArray(settings.currencies)) settings.currencies = [];
        setAdminSettings(settings);
      }

    } catch (e) {
      console.error(e)
    }

  }, [])

  useEffect(() => {
    if (adminSettings) {
      console.log("SETTING STORE ITEM");
      setStoreItem("cmsSettings", adminSettings);
      console.log("STORE ITEM SET");
    }
  }, [adminSettings, setStoreItem])

  const saveAdminCmsSettings = useCallback(async (newData: Partial<TAdminCmsSettingsType>) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      ...newData,
      currencies: uniqBy([...old.currencies, ...newData?.currencies], 'tag'),
      customFields: uniqBy([...old.customFields, ...newData?.customFields], 'id'),
      customMeta: {
        ...old.customMeta,
        ...newData.customMeta,
      },
      modules: {
        ...old.modules,
        ...newData.modules,
      },
      redirects: [
        ...old.redirects,
        ...newData.redirects,
      ],
      rewrites: [
        ...old.rewrites,
        ...newData.rewrites,
      ],
    }

    return await __saveSettings(newSettings)
  }, [adminSettings, getAdminCmsSettings])

  const saveStoreSettings = useCallback(async (newData: Partial<TAdminCmsSettingsType>) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      ...newData,
      currencies: [...newData?.currencies],
    }

    return await __saveSettings(newSettings)
  }, [adminSettings])

  const saveCodeSettings = useCallback(async (newData: Partial<TAdminCmsSettingsType>) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      ...newData,
    }

    return await __saveSettings(newSettings)
  }, [adminSettings])

  const __saveSettings = useCallback(async (newSettings: TAdminCmsSettingsType) => {
    try {
      const settings = await client.saveCmsSettings(newSettings)
      toast.success("Settings saved")
      setAdminSettings(o => ({ ...o, ...settings }))
      return true;
    } catch (e) {
      toast.error("Failed to save settings")
      console.error(e)
    }
  }, [])

  const addCustomEntityToDB = useCallback(async (entity: TAdminCustomEntity) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      customEntities: [
        ...(old?.customEntities || []),
        entity
      ]
    }

    return await __saveSettings(newSettings)
  }, [adminSettings])

  const saveDefaultEntity = useCallback(async (entityType: string, customFields: TAdminCustomField[]) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      customFields: [
        ...old.customFields.filter(k => k.entityType !== entityType),
        ...customFields
      ],
    }

    return await __saveSettings(newSettings)
  }, [adminSettings])

  const saveCustomEntity = useCallback(async (originalEntityType: string, entity: TAdminCustomEntity, customFields: TAdminCustomField[]) => {
    const old = adminSettings
    const newSettings: TAdminCmsSettingsType = {
      ...old,
      customFields: [
        ...old.customFields.filter(k => k.entityType !== originalEntityType),
        ...customFields
      ],
      customEntities: [
        ...old.customEntities.filter(k => k.entityType !== originalEntityType),
        entity
      ]
    }

    return await __saveSettings(newSettings)
  }, [adminSettings])

  return {
    settings: cmsSets,
    adminSettings,
    getAdminCmsSettings,
    saveStoreSettings,
    saveAdminCmsSettings,
    saveCodeSettings,
    addCustomEntityToDB,
    saveCustomEntity,
    saveDefaultEntity,
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

  useEffect(() => {
    value.getAdminCmsSettings();
  }, [value.getAdminCmsSettings])

  return (
    <AdminSettingsContext.Provider value={value}>
      {children}
    </AdminSettingsContext.Provider>
  )
}