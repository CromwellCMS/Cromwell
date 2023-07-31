import { StarIcon as EmptyStarIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import React from 'react';

export const StarRating = ({ value = 0, maxValue = 5, className = '' }) => {
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
