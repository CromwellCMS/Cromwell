import {
  TCmsDashboardLayout,
  TCmsStats,
  TProductReview,
} from "@cromwell/core";
import React, {
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  DashboardContextProvider,
  useDashboard,
} from "../../hooks/useDashboard";
import {
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import { PageViewsWidget } from "./widgets/pageViews";
import { ProductRatingWidget } from "./widgets/productRating";
import { SalesValueWidget } from "./widgets/salesValue";
import useLongPress from "../../hooks/useLongPress";
import { SalesLastWeekWidget } from "./widgets/salesLastWeek";
import { OrdersLastWeekWidget } from "./widgets/ordersLastWeek";
import { CogIcon } from "@heroicons/react/outline";
import { PageViewsList } from "./widgets/pageViewsList";
import { WidgetPanel } from "./widgets/widgetPanel";
import { AddWidgetMenu } from "./components/addWidgetMenu";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isEditing, setEditing] = useState(false);
  const {
    isLoadingLayout,
    getLayout,
    layout,
    saveLayout,
    setLayout,
    getReviews,
    getStats,
    resetToSnapshot,
    customWidgets,
  } = useDashboard();
  const longPressEvent = useLongPress(
    () => {
      setEditing(true);
    },
    () => {},
    { shouldPreventDefault: false, delay: 2000 },
  );

  useEffect(() => {
    getReviews();
    getStats();
  }, [getReviews]);

  if (isLoadingLayout) {
    return <DashboardLoader />;
  }

  return (
    <div className="relative">
      <div
        className={`${
          isEditing
            ? "bg-white shadow-md top-2 rounded-lg "
            : ""
        } sticky top-0 backdrop-filter backdrop-blur-xl z-[40] flex flex-row py-2 px-4 justify-between transform transition-all`}>
        <h1 className="font-bold text-3xl inline-block">
          {isEditing ? "Edit" : "Dashboard"}
        </h1>
        {isEditing && <AddWidgetMenu />}
        {isEditing && (
          <div className="inline-block self-center">
            <button
              className="mx-1 text-xs py-1"
              onClick={() => {
                resetToSnapshot();
                setEditing(false);
              }}>
              cancel
            </button>
            <button
              onClick={async () => {
                await saveLayout();
                setEditing(false);
              }}
              className="rounded-lg bg-indigo-700 shadow-lg mx-2 text-xs text-white text-center py-1 px-6 transform transition-all hover:bg-indigo-600 hover:shadow-xl">
              save
            </button>
          </div>
        )}
        {!isEditing && (
          <button
            onClick={() => {
              setEditing(true);
            }}
            className="bg-none bg-transparent text-xs px-4 text-indigo-500 self-center">
            <CogIcon className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="" {...longPressEvent}>
        <ResponsiveGridLayout
          margin={[15, 15]}
          layouts={layout as any}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={(current, nextLayout: any) => {
            setLayout(nextLayout);
          }}
          breakpoints={{
            lg: 1200,
            md: 996,
            sm: 768,
            xs: 480,
            xxs: 0,
          }}
          cols={{ lg: 12, md: 9, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={30}>
          {layout?.lg?.map((item) => {
            if (item.i === "productRating") {
              return (
                <div
                  key="productRating"
                  className="h-full w-full">
                  <ProductRatingWidget
                    id="productRating"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "salesValue") {
              return (
                <div
                  key="salesValue"
                  className="h-full w-full">
                  <SalesValueWidget
                    id="salesValue"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "pageViews") {
              return (
                <div
                  key="pageViews"
                  className="h-full w-full">
                  <PageViewsWidget
                    id="pageViews"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "salesValueLastWeek") {
              return (
                <div
                  key="salesValueLastWeek"
                  className="h-full w-full">
                  <SalesLastWeekWidget
                    id="salesValueLastWeek"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "pageViewsStats") {
              return (
                <div
                  key="pageViewsStats"
                  className="h-full w-full">
                  <PageViewsList
                    id="pageViewsStats"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "productReviews") {
              return (
                <div
                  key="productReviews"
                  className="h-full w-full">
                  <PageViewsList
                    id="productReviews"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            if (item.i === "ordersLastWeek") {
              return (
                <div
                  key="ordersLastWeek"
                  className="h-full w-full">
                  <OrdersLastWeekWidget
                    id="ordersLastWeek"
                    isEditing={isEditing}
                  />
                </div>
              );
            }

            const widget = customWidgets.find(k => k.key === item.i.replace("$widget_", ""))

            return (
              <div key={item.i} className="h-full w-full">
              <WidgetPanel isEditing={isEditing} id={item.i}>
                {widget}
              </WidgetPanel>
            </div>
            )
          }).filter(k => k)}
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

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

export const DashboardWrapper = ({
  stats,
  reviews,
}: {
  stats?: TCmsStats;
  reviews: TProductReview[];
}) => {
  return (
    <DashboardContextProvider>
      <div className="p-4">
        <Dashboard />
      </div>
    </DashboardContextProvider>
  );
};

export default DashboardWrapper;
