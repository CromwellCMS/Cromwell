import { TCmsStats, TSalePerDay, TPageStats } from '@cromwell/core';
import { format } from 'date-fns';
import * as echarts from 'echarts';


export const getOrdersPerDayOption = (sales: TSalePerDay[]) => {
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
                min: 1,
                type: 'value',
            }
        ],
        series: [
            {
                name: 'Orders',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                            { offset: 0, color: '#83bff6' },
                            { offset: 0.5, color: '#188df0' },
                            { offset: 1, color: '#188df0' }
                        ]
                    )
                },
                data: sales.map(sale => sale.orders).reverse()
            }
        ]
    };
}

export const getSalesValuePerDayOption = (sales: TSalePerDay[]) => {
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
                data: sales.map(sale => format(new Date(sale.date), 'eee')).reverse(),
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                minInterval: 1,
                min: 1,
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
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
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
