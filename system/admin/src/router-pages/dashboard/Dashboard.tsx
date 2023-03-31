import { TextButton } from '@components/buttons/TextButton';
import { CogIcon } from '@heroicons/react/24/outline';
import { DashboardContextProvider, useDashboard } from '@hooks/useDashboard';
import useLongPress from '@hooks/useLongPress';
import React, { useEffect, useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { AddWidgetMenu } from './components/addWidgetMenu';
import { OrdersLastWeekWidget } from './widgets/ordersLastWeek';
import { PageViewsWidget } from './widgets/pageViews';
import { PageViewsList } from './widgets/pageViewsList';
import { ProductRatingWidget } from './widgets/productRating';
import { ProductReviewsList } from './widgets/productReviews';
import { SalesLastWeekWidget } from './widgets/salesLastWeek';
import { SalesValueWidget } from './widgets/salesValue';
import { WidgetPanel } from './widgets/widgetPanel';

const ResponsiveGridLayout = WidthProvider(Responsive);

const Dashboard = () => {
  const [isEditing, setEditing] = useState(false);
  const { isLoadingLayout, layout, saveLayout, setLayout, getReviews, getStats, resetToSnapshot, customWidgets } =
    useDashboard();
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
          isEditing ? 'bg-white shadow-md top-2 rounded-lg ' : ''
        } sticky top-0 backdrop-filter backdrop-blur-xl z-[40] flex flex-row py-3 px-4 justify-between transform transition-all items-center`}
      >
        <h1 className="font-bold text-2xl inline-block">{isEditing ? 'Edit' : 'Dashboard'}</h1>
        {isEditing && <AddWidgetMenu />}
        {isEditing && (
          <div className="flex self-center">
            <TextButton
              variant="outlined"
              className="mx-1 text-xs py-1 mr-2"
              onClick={() => {
                resetToSnapshot();
                setEditing(false);
              }}
            >
              Cancel
            </TextButton>
            <TextButton
              onClick={async () => {
                await saveLayout();
                setEditing(false);
              }}
            >
              Save
            </TextButton>
          </div>
        )}
        {!isEditing && (
          <button
            onClick={() => {
              setEditing(true);
            }}
            className="bg-none bg-transparent text-xs px-4 text-indigo-500 self-center"
          >
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
          rowHeight={30}
        >
          {layout?.lg
            ?.map((item) => {
              let content;

              if (item.i === 'productRating') {
                content = <ProductRatingWidget id="productRating" isEditing={isEditing} />;
              }

              if (item.i === 'salesValue') {
                content = <SalesValueWidget id="salesValue" isEditing={isEditing} />;
              }

              if (item.i === 'pageViews') {
                content = <PageViewsWidget id="pageViews" isEditing={isEditing} />;
              }

              if (item.i === 'salesValueLastWeek') {
                content = <SalesLastWeekWidget id="salesValueLastWeek" isEditing={isEditing} />;
              }

              if (item.i === 'pageViewsStats') {
                content = <PageViewsList id="pageViewsStats" isEditing={isEditing} />;
              }

              if (item.i === 'productReviews') {
                content = <ProductReviewsList id="productReviews" isEditing={isEditing} />;
              }

              if (item.i === 'ordersLastWeek') {
                content = <OrdersLastWeekWidget id="ordersLastWeek" isEditing={isEditing} />;
              }

              if (!content) {
                const widgetName = item.i.replace('$widget_', '');
                const widget = customWidgets.find((k) => k.key === widgetName);
                content = (
                  <WidgetPanel isEditing={isEditing} id={widgetName}>
                    {widget}
                  </WidgetPanel>
                );
              }

              return (
                <div key={item.i} id={item.i.replace('$widget_', '')} className="h-full w-full">
                  {content}
                </div>
              );
            })
            .filter(Boolean)}
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
            className="bg-white flex flex-col rounded-2xl shadow-lg p-2 gap-5 select-none sm:flex-row sm:h-64 sm:p-4 "
          >
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

export const DashboardWrapper = () => {
  return (
    <DashboardContextProvider>
      <div className="p-4">
        <Dashboard />
      </div>
    </DashboardContextProvider>
  );
};

export default DashboardWrapper;
