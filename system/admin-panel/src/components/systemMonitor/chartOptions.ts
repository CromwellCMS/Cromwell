import { TSystemUsage } from '@cromwell/core';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';

export const getCpuUsageOption = (echarts, loads: TSystemUsage['cpuUsage']['previousLoads']) => {
  return {
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        label: {
          backgroundColor: '#6a7985',
          formatter: (params) => `${params.value}`,
        },
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: loads.map((load) => format(new Date(load.time), 'hh:mm')),
        axisTick: {
          alignWithLabel: true,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        axisLabel: {
          formatter: (val) => `${val.toFixed()}%`,
        },
      },
    ],
    series: [
      {
        name: 'CPU usage',
        type: 'line',
        sampling: 'lttb',
        smooth: true,
        symbol: 'none',
        itemStyle: {
          color: 'rgb(255, 70, 131)',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgb(255, 70, 131)',
            },
            {
              offset: 1,
              color: 'rgb(255, 158, 68)',
            },
          ]),
        },
        data: loads.map((load) => Math.round(load.load)),
      },
    ],
  };
};

export const getPieOption = (title: string, free: number, used: number) => {
  return {
    tooltip: {
      formatter: (params) => {
        return `${params.name}: ${prettyBytes(params.value)}`;
      },
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: title + ' usage',
        type: 'pie',
        radius: [50, 120],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        labelLine: {
          show: false,
        },
        label: {
          show: false,
        },
        data: [
          { value: used, name: title + ' used' },
          { value: free, name: title + ' available' },
        ],
      },
    ],
  };
};
