import React from "react";
import { useDashboard } from "../../../hooks/useDashboard";
import { WidgetPanel } from "./widgetPanel";
import { format } from "date-fns";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedBarSeries,
  Tooltip,
  XYChart,
} from "@visx/xychart";
import { useResizeDetector } from 'react-resize-detector';
import { LinearGradient } from '@visx/gradient';

function numFormat(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export const OrdersLastWeekWidget = ({
  isEditing = false,
  id = "ordersLastWeek"
}) => {
  const { stats, isLoadingStats, cstore } = useDashboard();
  const { width, height, ref } = useResizeDetector()

  const accessors = {
    xAccessor: (d) => d?.date,
    yAccessor: (d) => d?.orders,
  };

  return (
    <WidgetPanel isEditing={isEditing} id={id}>
      <div className="h-full w-full">
        <div className={"col-span-2" + " draggableCancel"}>
          <h3 className="block">
            Orders last week
          </h3>
          <p
            className={`${
              isLoadingStats
                ? "animate-pulse w-full rounded-md h-6 bg-gray-200"
                : "font-bold text-2xl"
            }`}
            id="ordersLastWeek">
            {isLoadingStats
              ? ""
              : stats?.salesPerDay?.reduce<number>(
                  (prev, curr) => curr.orders + prev,
                  0,
                ) ?? 0}
          </p>
        </div>
        <div ref={ref} className="h-[calc(100%-4rem)] text-xs text-black grid w-[calc(100%-2rem)] chart">
            {!isLoadingStats && (
              <XYChart
                width={width}
                height={height}
                xScale={{ type: "band", clamp: true, paddingInner: 0.4  }}
                yScale={{ type: "linear",  }}>
                <LinearGradient id="order-bg" from="rgba(128, 255, 165, .4)" to="rgba(1, 191, 236, .8)" />
                <AnimatedGrid
                  columns={false}
                  numTicks={4}
                  lineStyle={{
                    stroke: "#e1e1e1",
                    strokeLinecap: "round",
                    strokeWidth: 1,
                  }}
                  strokeDasharray="0, 4"
                />
                <AnimatedAxis
                  hideAxisLine
                  // hideTicks
                  orientation="bottom"
                  // tickLabelProps={() => ({
                  //   dy: 10,
                  //   // dx: 0
                  // })}
                  // left={80}
                  numTicks={7}
                  tickFormat={(v) => format(v, "EEE")}
                />
                <AnimatedAxis
                  hideAxisLine
                  hideTicks
                  orientation="left"
                  numTicks={7}
                  // tickLabelProps={() => ({ dx: -10 })}
                />

                <AnimatedBarSeries
                  // fill="url(#order-bg)"
                  colorAccessor={() => "url(#order-bg)"}
                  dataKey="orderWeekBar"
                  barPadding={0.5}
                  data={stats?.salesPerDay}
                  radius={10}
                  radiusTop
                  {...accessors}
                />

                { !isEditing && <Tooltip
                  showVerticalCrosshair
                  showHorizontalCrosshair
                  glyphStyle={{
                    fill: "#3398DB",
                    strokeWidth: 2,
                  }}
                  renderTooltip={({ tooltipData }) => {
                    return (
                      <div className="rounded-lg text-xs py-4 px-2 text-indigo-500">
                        {Object.entries(
                          tooltipData.datumByKey,
                        ).map((lineDataArray) => {
                          const [key, value] = lineDataArray;

                          return (
                            <div className="row" key={key}>
                              <div className="font-bold text-xs text-black mb-2">
                                {format(
                                  accessors.xAccessor(
                                    value.datum,
                                  ),
                                  "MMM d",
                                )}
                              </div>
                              <p className="font-light mt-2 text-xs text-gray-600">Orders</p>
                              <div className="flex font-semibold items-center">
                                <div className="rounded bg-[#3398DB] h-3 mr-2 w-3 inline-block" />
                                {numFormat(accessors.yAccessor(
                                  value.datum,
                                ), 2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }}
                />}
              </XYChart>
            )}
        </div>
      </div>
    </WidgetPanel>
  );
};
