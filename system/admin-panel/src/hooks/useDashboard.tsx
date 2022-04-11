import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCStore, getGraphQLClient, getRestApiClient, useForceUpdate } from '@cromwell/core-frontend';
import { TCmsDashboardLayout, TCmsDashboardSettings, TCmsStats, TProductReview } from "@cromwell/core";

const useDashboardContext = () => {
  const [stats, setStats] = useState<TCmsStats>();
  const [reviews, setReviews]= useState<TProductReview[]>([]);
  const [isLoadingStats, setLoadingStats] = useState(true);
  const [isLoadingReviews, setLoadingReviews] = useState(true);
  const [layout, setLayout] = useState<TCmsDashboardLayout|undefined>();
  const [isLoadingLayout, setLoading] = useState(true);

  const getReviews = useCallback(async () => {
    setLoadingReviews(true)
    try {
      const nReviews = await getGraphQLClient()?.getProductReviews({
        pageSize: 10,
      })
      if (nReviews?.elements) {
        setReviews(nReviews.elements)
      }
    } catch (e) {

    }
    setLoadingReviews(false);
  }, [])

  const getStats = useCallback(async () => {
    setLoadingStats(true)
    const client = getRestApiClient();
    const cstore = getCStore();

    try {
      const nStats = await client?.getCmsStats();
      if (nStats) {
        setStats(nStats);
      }
    } catch(e) {

    }
    setLoadingStats(false);
  }, [])

  const getLayout = useCallback(async () => {
    const client = getRestApiClient();

    const settings = await client.getDashboardLayout()

    setLayout(settings.layout)
    setLoading(false)
  }, [])

  const saveLayout = useCallback(async () => {
    const client = getRestApiClient();

    const newLayout = await client.saveDashboardLayout({
      type: "user",
      layout,
    })

    setLayout(newLayout.layout)
  }, [layout])

  useEffect(() => {
    getLayout();
  }, [getLayout])

  const isLoading = isLoadingLayout || isLoadingReviews || isLoadingStats;

  return {
    layout,
    isLoadingLayout,
    isLoading,
    stats,
    reviews,
    getStats,
    getReviews,
    getLayout,
    setLayout,
    saveLayout,
    isLoadingReviews,
    isLoadingStats,
  }
}

export const useDashboard = () => {
  return React.useContext(DashboardContext);
}

type ContextType = ReturnType<typeof useDashboardContext>;
const Empty = {} as ContextType;

const DashboardContext = React.createContext<ContextType>(Empty);

export const DashboardContextProvider = ({ children }) => {
  const value = useDashboardContext();

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}