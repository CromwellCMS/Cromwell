import { ExternalLinkIcon } from '@heroicons/react/solid';
import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../../hooks/useDashboard';
import { WidgetPanel } from './widgetPanel';

export const PageViewsList = ({ isEditing = false, id = 'pageViewsStats' }) => {
  const { stats, isLoadingStats } = useDashboard();
  // console.log(stats);
  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="h-full">
        <h3 className="bg-white pb-2 w-[calc(100%-10px)] block">Page views</h3>

        {!isLoadingStats && (
          <div className="h-[calc(100%-26px)] grid grid-cols-1 relative overflow-y-auto scrollbar-slim">
            {stats?.topPageViews?.map((pageView, idx) => (
              <div
                key={idx}
                className="rounded-lg space-y-2 text-xs grid transform transition-colors gap-4 grid-cols-6 group hover:bg-indigo-100"
              >
                <h4 className="text-xs px-2 text-gray-400 col-span-3 self-center hover:text-indigo-800">
                  {pageView?.pageRoute}
                </h4>
                <span className="font-bold text-gray-600 col-span-1 self-center">{pageView?.views}</span>
                <a
                  href={`${pageView?.pageRoute}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mr-4 col-span-2 justify-self-end"
                >
                  <ExternalLinkIcon className="h-4 text-indigo-600 w-4 hover:text-indigo:-400" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  );
};
