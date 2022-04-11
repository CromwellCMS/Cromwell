import React, { useEffect } from "react"
import { useDashboard } from "../../../hooks/useDashboard"

export const PageViewsWidget = () => {
  const  { stats, isLoadingStats, getStats } = useDashboard()

  useEffect(() => {
    getStats()
  },[])

  return (
    <div key="pageViews" className="bg-white rounded-xl shadow-md w-full p-4">
      <div className="">
          <div className="h-6 w-6" style={{ backgroundImage: 'url(/admin/static/dashboard-views.png)' }}></div>
          <div className={"" + ' draggableCancel'}>
              <h3 className="font-bold block">Page views</h3>
              <p className={`${isLoadingStats ? "animate-pulse" : ""}`} id="pageViews">{stats?.pageViews ?? 0}</p>
              <p className="">For {stats?.pages ?? 0} pages</p>
          </div>
      </div>
  </div>
  )
}