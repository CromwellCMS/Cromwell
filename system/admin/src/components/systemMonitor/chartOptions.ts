import { TSystemUsage } from '@cromwell/core';
import { format } from 'date-fns';
import prettyBytes from 'pretty-bytes';
import type { EChartsOption } from 'echarts';

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

export const getCmsCpuUsageOption = (echarts, processStats: TSystemUsage['processStats']): EChartsOption => {
  return {
    xAxis: {
      min: 0,
      max: 100,
      axisLabel: {
        formatter: (val) => `${val}%`,
      },
    },
    yAxis: {
      type: 'category',
      data: ['total', ...processStats.map((stat, i) => `${stat.name}_${i}`)],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      axisLabel: {
        fontSize: 10,
        formatter: (value) => value.split(' ').join('\n'),
      },
    },
    grid: {
      left: 120,
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: [processStats.reduce((prev, curr) => prev + curr.cpu, 0), ...processStats.map((stat) => stat.cpu)].map(
          (value) => Number(value.toFixed(3)),
        ),
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
          formatter: (val) => `${val.data}%`,
        },
      },
    ],
    legend: {
      show: false,
    },
    animationDuration: 0,
    animationDurationUpdate: 2000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  } as EChartsOption;
};
export const getCmsMemoryUsageOption = (echarts, processStats: TSystemUsage['processStats']): EChartsOption => {
  return {
    xAxis: {
      axisLabel: {
        formatter: (val) => `${prettyBytes(val)}`,
      },
    },
    yAxis: {
      type: 'category',
      data: ['total', ...processStats.map((stat, i) => `${stat.name}_${i}`)],
      inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
      axisLabel: {
        fontSize: 10,
        formatter: (value) => value.split(' ').join('\n'),
      },
    },
    grid: {
      left: 120,
    },
    series: [
      {
        realtimeSort: true,
        name: 'X',
        type: 'bar',
        data: [processStats.reduce((prev, curr) => prev + curr.memory, 0), ...processStats.map((stat) => stat.memory)],
        label: {
          show: true,
          position: 'right',
          valueAnimation: true,
          formatter: (val) => `${prettyBytes(Number(val.data))}`,
        },
      },
    ],
    legend: {
      show: false,
    },
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  } as EChartsOption;
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
