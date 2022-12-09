import { StarIcon as EmptyStarIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { useDashboard } from '../../../hooks/useDashboard';
import { WidgetPanel } from './widgetPanel';

const StarRating = ({ value = 0, maxValue = 5, className = '' }) => {
  const fillValue = value / maxValue;

  return (
    <div className={`block relative h-4 ${className}`}>
      <div className="relative">
        <div
          style={{
            width: `${maxValue * 1.5}rem`,
          }}
          className="top-0 left-0 absolute"
        >
          {Array(maxValue)
            .fill(0)
            .map((star, idx) => (
              <EmptyStarIcon key={idx} className="h-4 text-orange-500 w-4 inline-block" />
            ))}
        </div>
        <div
          style={{
            width: `${fillValue * maxValue * 1.5}rem`,
          }}
          className={`absolute left-0 top-0 w-full overflow-x-hidden whitespace-nowrap`}
        >
          {Array(maxValue)
            .fill(0)
            .map((star, idx) => (
              <StarIcon key={idx} className="h-4 text-orange-500 w-4 inline" />
            ))}
        </div>
      </div>
    </div>
  );
};

export const ProductReviewsList = ({ isEditing = false, id = 'productReviews' }) => {
  const { reviews, isLoadingReviews } = useDashboard();
  // console.log(stats);
  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="h-full">
        <h3 className="bg-white pb-2 w-[calc(100%-10px)] block">Recent reviews</h3>

        {!isLoadingReviews && (
          <div className="h-[calc(100%-26px)] grid grid-cols-1 relative overflow-y-auto scrollbar-slim">
            {reviews?.map((review, idx) => (
              <div
                key={idx}
                className="rounded-lg space-y-2 text-xs grid transform transition-colors gap-4 grid-cols-6 group hover:bg-indigo-100"
              >
                <h4 className="text-xs px-2 text-gray-400 col-span-2 self-center hover:text-indigo-800">
                  {review?.userName ?? ''}
                </h4>
                <p
                  className={`font-bold ${
                    review.approved ? 'text-green-800' : 'text-orange-600'
                  } h-full flex items-center col-span-2 self-center`}
                >
                  {review?.approved ? 'Approved' : 'Pending'}
                </p>
                <div className="space-y-1 grid py-1 grid-cols-1 col-span-1">
                  <span className="">{review.title ?? '-'}</span>
                  <StarRating value={review.rating} maxValue={5} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  );
};
