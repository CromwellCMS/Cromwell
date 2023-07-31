import { useDashboard } from '@hooks/useDashboard';
import React from 'react';

import { StarRating } from '../components/StarRating';
import { WidgetPanel } from './widgetPanel';

export const ProductReviewsList = ({ isEditing = false, id = 'productReviews' }) => {
  const { reviews, isLoadingReviews } = useDashboard();
  // console.log(stats);
  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="h-full">
        <h3 className="bg-white pb-2 w-[calc(100%-10px)] block text-xl">Recent reviews</h3>

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
