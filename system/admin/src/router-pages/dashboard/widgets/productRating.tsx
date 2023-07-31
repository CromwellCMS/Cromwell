import { useDashboard } from '@hooks/useDashboard';
import React from 'react';

import { StarRating } from '../components/StarRating';
import { WidgetPanel } from './widgetPanel';

export const ProductRatingWidget = ({ isEditing = false, id = 'productRating' }) => {
  const { stats, isLoadingStats } = useDashboard();
  const avgRating = stats?.averageRating ?? 0;
  const reviewCount = stats?.reviews ?? 0;

  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="grid grid-cols-3 md:grid-cols-3">
        <div
          className="bg-cover mx-auto h-12 w-12 self-center"
          style={{
            backgroundImage: 'url(/admin/static/dashboard-rating.png)',
          }}
        ></div>
        <div className={'col-span-2' + ' draggableCancel'}>
          <h3 className="block text-xl">Product rating</h3>
          <StarRating value={avgRating} className="my-1 -ml-1" maxValue={5} />
          <p className={`${isLoadingStats ? 'animate-pulse w-full rounded-md h-6 bg-gray-200' : ''} text-xs font-bold`}>
            {!isLoadingStats && (
              <span>
                {avgRating.toFixed(2)} - {reviewCount} <span className="font-normal text-gray-600">reviews</span>
              </span>
            )}
          </p>
        </div>
      </div>
    </WidgetPanel>
  );
};
