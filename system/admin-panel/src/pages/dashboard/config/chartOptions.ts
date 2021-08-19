import { TSalePerDay, TSystemUsage } from '@cromwell/core';
import { format } from 'date-fns';


export const getOrdersPerDayOption = (echarts, sales: TSalePerDay[]) => {
    return {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: sales.map(sale => format(new Date(sale.date), 'eee')).reverse(),
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                minInterval: 1,
                type: 'value',
            }
        ],
        series: [
            {
                name: 'Orders',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: echarts.graphic && new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#13e0fe' },
                            { offset: 1, color: '#4a7bbf' }
                        ]
                    )
                },
                data: sales.map(sale => sale.orders).reverse()
            }
        ]
    };
}

export const getSalesValuePerDayOption = (echarts, sales: TSalePerDay[]) => {
    return {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: sales.map(sale => format(new Date(sale.date), 'eee')).reverse(),
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
            }
        ],
        series: [
            {
                name: 'Sales value',
                type: 'line',
                smooth: true,
                lineStyle: {
                    width: 0
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: echarts.graphic && new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(128, 255, 165)'
                    }, {
                        offset: 1,
                        color: 'rgba(1, 191, 236)'
                    }])
                },
                emphasis: {
                    focus: 'series'
                },
                data: sales.map(sale => sale.salesValue).reverse(),
            },
        ]
    };
}


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
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: loads.map(load => format(new Date(load.time), 'hh:mm')),
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: (val) => `${val.toFixed()}%`,
                }
            }
        ],
        series: [
            {
                name: 'CPU usage',
                type: 'line',
                sampling: 'lttb',
                smooth: true,
                symbol: 'none',
                itemStyle: {
                    color: 'rgb(255, 70, 131)'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 70, 131)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 158, 68)'
                    }])
                },
                data: loads.map(load => Math.round(load.load)),
            },
        ]
    };
}
