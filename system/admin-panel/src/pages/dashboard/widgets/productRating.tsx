import { StarIcon } from "@heroicons/react/solid";
import { StarIcon as EmptyStarIcon } from "@heroicons/react/outline";
import React from "react";
import { useDashboard } from "../../../hooks/useDashboard";
import { WidgetPanel } from "./widgetPanel";

const StarRating = ({
  value = 0,
  maxValue = 5,
  className = "",
}) => {
  const fillValue = value / maxValue;

  return (
    <div className={`block relative h-6 ${className}`}>
      <div className="relative">
        <div
          style={{
            width: `${maxValue * 1.5}rem`,
          }}
          className="top-0 left-0 absolute">
          {Array(maxValue)
            .fill(0)
            .map((star, idx) => (
              <EmptyStarIcon
                key={idx}
                className="h-6 text-orange-500 w-6 inline-block"
              />
            ))}
        </div>
        <div
          style={{
            width: `${fillValue * maxValue * 1.5}rem`,
          }}
          className={`absolute left-0 top-0 w-full overflow-x-hidden whitespace-nowrap`}>
          {Array(maxValue)
            .fill(0)
            .map((star, idx) => (
              <StarIcon
                key={idx}
                className="h-6 text-orange-500 w-6 inline"
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export const ProductRatingWidget = ({
  isEditing = false,
  id = "productRating"
}) => {
  const { stats, isLoadingStats, getStats } =
    useDashboard();
  const avgRating = stats?.averageRating ?? 0;
  const reviewCount = stats?.reviews ?? 0;

  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="grid grid-cols-3 md:grid-cols-3">
        <div
          className="bg-cover mx-auto h-12 w-12 self-center"
          style={{
            backgroundImage:
              "url(/admin/static/dashboard-rating.png)",
          }}></div>
        <div className={"col-span-2" + " draggableCancel"}>
          <h3 className="block">
            Product rating
          </h3>
          <StarRating
            value={avgRating}
            className="my-1 -ml-1"
            maxValue={5}
          />
          <p
            className={`${
              isLoadingStats
                ? "animate-pulse w-full rounded-md h-6 bg-gray-200"
                : ""
            } text-xs font-bold`}>
            {!isLoadingStats && (
              <span>
                {avgRating.toFixed(2)} - {reviewCount}{" "}
                <span className="font-normal text-gray-600">
                  reviews
                </span>
              </span>
            )}
          </p>
        </div>
      </div>
    </WidgetPanel>
  );
};
