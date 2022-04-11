import { TCmsStats, TProductReview } from "@cromwell/core";
import React, { Suspense, useEffect, useState } from "react";
import { DashboardContextProvider, useDashboard } from "../../hooks/useDashboard";
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PageViewsWidget } from "./widgets/pageViews";
// import DashboardOld from "./DashboardOld";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isEditing, setEditing] = useState(false);
  const { isLoadingLayout, getLayout, layout, saveLayout, setLayout, getReviews } = useDashboard()

  useEffect(() => {
    getReviews()
  }, [getReviews])

  if (isLoadingLayout) {
    return <DashboardLoader />
  }

  return (
    <div>
      <ResponsiveGridLayout
        margin={[15, 15]}
        layouts={layout as any}
        isDraggable={isEditing}
        isResizable={isEditing}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      >
        <PageViewsWidget key="pageViews" />
      </ResponsiveGridLayout>
    </div>
  )
}

const DashboardLoader = () => {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array(6)
        .fill(0)
        .map((k, id) => (
          <div
            key={id}
            className="bg-white flex flex-col rounded-2xl shadow-lg p-2 gap-5 select-none sm:flex-row sm:h-64 sm:p-4 ">
            <div className="rounded-xl bg-gray-200 h-52 animate-pulse sm:h-full sm:w-72"></div>
            <div className="flex flex-col flex-1 gap-5 sm:p-2">
              <div className="flex flex-col flex-1 gap-3">
                <div className="bg-gray-200 rounded-2xl h-14 w-full animate-pulse"></div>
                <div className="bg-gray-200 rounded-2xl h-3 w-full animate-pulse"></div>
                <div className="bg-gray-200 rounded-2xl h-3 w-full animate-pulse"></div>
                <div className="bg-gray-200 rounded-2xl h-3 w-full animate-pulse"></div>
                <div className="bg-gray-200 rounded-2xl h-3 w-full animate-pulse"></div>
              </div>
              <div className="flex mt-auto gap-3">
                <div className="rounded-full bg-gray-200 h-8 animate-pulse w-20"></div>
                <div className="rounded-full bg-gray-200 h-8 animate-pulse w-20"></div>
                <div className="rounded-full ml-auto bg-gray-200 h-8 animate-pulse w-20"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export const DashboardWrapper = ({ stats, reviews }: { stats?: TCmsStats, reviews: TProductReview[] }) => {
  return (
      <DashboardContextProvider>
        <div className="p-4">
            <Dashboard />
        </div>
      </DashboardContextProvider>
  );
};

export default DashboardWrapper;
