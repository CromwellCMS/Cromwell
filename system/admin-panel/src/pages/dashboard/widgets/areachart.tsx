import React, { useMemo, useCallback, useRef } from 'react';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleTime, scaleLinear } from '@visx/scale';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { max, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#75daad';
const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
// const getDate = (d: AppleStock) => new Date(d.date);
// const getStockValue = (d: AppleStock) => d.close;
const bisectDate = bisector<any, Date>((d) => new Date(d.date)).left;

export type AreaProps = {
  // width: number;
  // height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  accessors?: {
    getX: any;
    getY: any;
  };
  data?: any;
};

export const AreaChart = withTooltip<AreaProps, any>(
  ({
    margin = { top: 0, right: 0, bottom: 0, left: 0 },
    showTooltip,
    hideTooltip,
    accessors,
    data,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: AreaProps & WithTooltipProvidedProps<any>) => {
    const ref = useRef<SVGSVGElement>(null);
    // if (width < 10) return null;

    // bounds
    const bounds = ref.current?.getBoundingClientRect();
    // const innerWidth = ref.current?.getBoundingClientRect()?.width - margin.left - margin.right;
    // const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = bounds?.width || 100;
    const innerHeight = bounds?.height || 100;

    // scales
    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin.left, innerWidth + margin.left],
          domain: extent(data, accessors.getX) as [Date, Date],
        }),
      [innerWidth, margin.left],
    );
    const yScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin.top, margin.top],
          domain: [0, (max(data, accessors.getY) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin.top, innerHeight],
    );

    // tooltip handler
    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = dateScale.invert(x);
        const index = bisectDate(data, x0, 1);
        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;
        if (d1 && accessors.getX(d1)) {
          d = x0.valueOf() - accessors.getX(d0).valueOf() > accessors.getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: yScale(accessors.getY(d)),
        });
      },
      [showTooltip, yScale, dateScale],
    );

    return (
      <div className="h-full w-full">
        <svg width="100%" height="100%" ref={ref}>
          <rect x={0} y={0} width="100%" height="100%" fill="url(#area-background-gradient)" rx={14} />
          <LinearGradient id="area-background-gradient" from={background} to={background2} />
          <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />
          <GridRows
            left={margin.left}
            scale={yScale}
            width={innerWidth}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
          <AreaClosed<any>
            data={data}
            x={(d) => dateScale(accessors.getX(d)) ?? 0}
            y={(d) => yScale(accessors.getY(d)) ?? 0}
            yScale={yScale}
            strokeWidth={1}
            stroke="url(#area-gradient)"
            fill="url(#area-gradient)"
            curve={curveMonotoneX}
          />
          <Bar
            x={margin.left}
            y={margin.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            rx={14}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
          {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div className="ttp">
            <TooltipWithBounds key={Math.random()} top={tooltipTop - 12} left={tooltipLeft + 12} style={tooltipStyles}>
              {`$${accessors.getY(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin.top - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(accessors.getY(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  },
);
