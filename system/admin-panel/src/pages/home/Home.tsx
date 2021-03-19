import React, { useEffect, useRef } from 'react';
//@ts-ignore
import ApexCharts from 'apexcharts';
import styles from './Home.module.scss';

export default function HomePage() {
    const chartRef = useRef<HTMLDivElement | null>(null);
    const chartOptions = {
        chart: {
            type: 'line'
        },
        series: [{
            name: 'sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }],
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
    }

    useEffect(() => {
        if (chartRef.current) {
            const chart = new ApexCharts(chartRef.current, chartOptions);
            chart.render();
        }
    }, [])

    return (
        <div className={styles.HomePage}>
            <div className={styles.chart} ref={chartRef} id="test-chart" ></div>
        </div>
    )
}
