import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { TCmsStats, TProductReview } from '@cromwell/core';
import { getCStore, getRestAPIClient, getGraphQLClient } from '@cromwell/core-frontend';
import { Rating } from '@material-ui/lab';
import { CountUp } from 'countup.js';
import * as echarts from 'echarts';
import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import ReactResizeDetector from 'react-resize-detector';

import { getOrdersPerDayOption, getSalesValuePerDayOption } from './config/chartOptions';
import { getDefaultLayout } from './config/defaultLayout';
import ReviewListItem from '../reviewList/ReviewListItem';
import styles from './Dashboard.module.scss';

const ResponsiveGridLayout = WidthProvider(Responsive);


export default class Dashboard extends React.Component<any, {
    stats: TCmsStats;
    reviews: TProductReview[];
}> {

    private contentRef: React.RefObject<HTMLDivElement> = React.createRef();
    private ordersChart;
    private salesValueChart;

    componentDidMount() {
        this.getCmsStats();
        this.getReviews();
    }

    private async getCmsStats() {
        const cstore = getCStore();
        try {
            const stats = await getRestAPIClient()?.getCmsStats();
            if (stats) {
                this.setState({ stats });

                if (stats.salesValue) {
                    const countUp = new CountUp('salesValue', stats.salesValue, {
                        duration: 1,
                        prefix: cstore.getActiveCurrencySymbol(),
                    });
                    countUp.start();
                }
                if (stats.pageViews) {
                    const countUp = new CountUp('pageViews', stats.pageViews, {
                        duration: 1,
                    });
                    countUp.start();
                }

                if (stats.salesPerDay) {
                    this.ordersChart = echarts.init(document.getElementById('ordersLastWeek'));
                    this.ordersChart.setOption(getOrdersPerDayOption(stats.salesPerDay));

                    const ordersCountLastWeek = stats.salesPerDay.reduce<number>((prev, curr) => curr.orders + prev, 0);
                    const countUp = new CountUp('ordersTotalLastWeek', ordersCountLastWeek, {
                        duration: 1,
                    });
                    countUp.start();


                    this.salesValueChart = echarts.init(document.getElementById('salesValueLastWeek'));
                    this.salesValueChart.setOption(getSalesValuePerDayOption(stats.salesPerDay));

                    const salesValueTotalLastWeek = stats.salesPerDay.reduce<number>((prev, curr) => curr.salesValue + prev, 0);
                    const countUp2 = new CountUp('salesValueTotalLastWeek', salesValueTotalLastWeek, {
                        duration: 1,
                        prefix: cstore.getActiveCurrencySymbol(),
                    });
                    countUp2.start();
                }
            }

        } catch (error) {
            console.error(error);
        }
    }

    private async getReviews() {
        try {
            const reviews = await getGraphQLClient()?.getProductReviews({
                pageSize: 10
            });
            if (reviews?.elements) this.setState({ reviews: reviews.elements })
        } catch (error) {
            console.error(error);
        }
    }

    private getGridLayout = () => {
        let saved: any = window.localStorage.getItem('crw_dashboard_layout');
        if (saved) {
            try {
                saved = JSON.parse(saved);
                if (saved) return saved;
            } catch (error) {
                console.error(error);
            }
        }
        return getDefaultLayout();
    }

    private onLayoutChange = (currentLayout, allLayouts) => {
        window.localStorage.setItem('crw_dashboard_layout', JSON.stringify(allLayouts));
    }

    render() {
        const averageRating = this.state?.stats?.averageRating ?? 0;
        const reviewsNumber = this.state?.stats?.reviews ?? 0;

        return (
            <div className={styles.Dashboard} ref={this.contentRef}>
                <ResponsiveGridLayout
                    margin={[15, 15]}
                    layouts={this.getGridLayout()}
                    onLayoutChange={this.onLayoutChange}
                    breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                    rowHeight={30}
                    cols={{ lg: 12, md: 9, sm: 6, xs: 4, xxs: 2 }}
                    draggableCancel='.draggableCancel'
                >
                    <div key="productRating" className={styles.topStatItem}>
                        <div className={styles.topStatContent}>
                            <div className={styles.topStatIcon} style={{ backgroundImage: 'url(/admin/static/dashboard-rating.png)' }}></div>
                            <div className={styles.topStatCaption + ' draggableCancel'}>
                                <h3 className={styles.topStatTitle}>Product Rating</h3>
                                <Rating name="read-only"
                                    value={averageRating}
                                    className={styles.rating}
                                    precision={0.2} readOnly
                                />
                                <p className={styles.statTip}>
                                    {averageRating.toFixed(2)}, based on {reviewsNumber} reviews</p>
                            </div>
                        </div>
                    </div>
                    <div key="salesValue" className={styles.topStatItem}>
                        <div className={styles.topStatContent}>
                            <div className={styles.topStatIcon} style={{ backgroundImage: 'url(/admin/static/dashboard-sales.png)' }}></div>
                            <div className={styles.topStatCaption + ' draggableCancel'}>
                                <h3 className={styles.topStatTitle}>Sales value</h3>
                                <p className={styles.statBig} id="salesValue">{this.state?.stats?.salesValue ?? 0}</p>
                                <p className={styles.statTip}>From {this.state?.stats?.orders ?? 0} orders</p>
                            </div>
                        </div>
                    </div>
                    <div key="pageViews" className={styles.topStatItem}>
                        <div className={styles.topStatContent}>
                            <div className={styles.topStatIcon} style={{ backgroundImage: 'url(/admin/static/dashboard-views.png)' }}></div>
                            <div className={styles.topStatCaption + ' draggableCancel'}>
                                <h3 className={styles.topStatTitle}>Page views</h3>
                                <p className={styles.statBig} id="pageViews">{this.state?.stats?.pageViews ?? 0}</p>
                                <p className={styles.statTip}>For {this.state?.stats?.pages ?? 0} pages</p>
                            </div>
                        </div>
                    </div>
                    <div key="ordersLastWeek" className={styles.chartBox}>
                        <div className={styles.chartCaption}>
                            <p className={styles.chartTitle + ' draggableCancel'}>Orders last week</p>
                            <p className={styles.statBig + ' draggableCancel'} id="ordersTotalLastWeek">{this.state?.stats?.salesPerDay?.reduce<number>((prev, curr) => curr.orders + prev, 0) ?? 0}</p>
                        </div>
                        <ReactResizeDetector handleWidth handleHeight>
                            {({ targetRef }) => {
                                this.ordersChart?.resize?.();
                                return (
                                    <div id="ordersLastWeek" ref={targetRef as any} className={styles.chart}></div>
                                )
                            }}
                        </ReactResizeDetector>
                    </div>
                    <div key="salesValueLastWeek" className={styles.chartBox}>
                        <div className={styles.chartCaption}>
                            <p className={styles.chartTitle + ' draggableCancel'}>Sales value last week</p>
                            <p className={styles.chartTotal + ' draggableCancel'} id="salesValueTotalLastWeek">{this.state?.stats?.salesPerDay?.reduce<number>((prev, curr) => curr.salesValue + prev, 0) ?? 0}</p>
                        </div>
                        <ReactResizeDetector handleWidth handleHeight>
                            {({ targetRef }) => {
                                this.salesValueChart?.resize?.();
                                return (
                                    <div id="salesValueLastWeek" ref={targetRef as any} className={styles.chart}></div>
                                )
                            }}
                        </ReactResizeDetector>
                    </div>
                    <div key="pageViewsStats" className={styles.chartBox}>
                        <div className={styles.chartCaption}>
                            <p className={styles.chartTitle + ' draggableCancel'}>Most viewed pages</p>
                        </div>
                        <div className={styles.pageViewList}>
                            {this.state?.stats?.topPageViews?.map(stats => {
                                return (
                                    <div key={stats.pageRoute} className={styles.pageViewItem}>
                                        <p className={styles.pageViewText + ' draggableCancel'}>{stats.pageRoute}</p>
                                        <p className={styles.pageViewText + ' draggableCancel'}>{stats.views ?? 0}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div key="productReviews" className={styles.chartBox}>
                        <div className={styles.chartCaption}>
                            <p className={styles.chartTitle + ' draggableCancel'}>Recent product reviews</p>
                        </div>
                        <div className={styles.productReviewsList}>
                            {this.state?.reviews?.map(review => {
                                return (
                                    <ReviewListItem
                                        embedded={true}
                                        key={review.id}
                                        data={review}
                                        lislistItemProps={{
                                            handleDeleteBtnClick: () => null,
                                            toggleSelection: () => null,
                                            handleOpenReview: () => null,
                                            handleApproveReview: () => null,
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </ResponsiveGridLayout>
            </div>
        )
    }
}
