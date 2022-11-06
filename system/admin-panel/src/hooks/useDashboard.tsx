import React, { useCallback, useEffect, useState } from 'react';
import {
  getCStore,
  getGraphQLClient,
  getRestApiClient,
  getWidgets,
  getWidgetsForPlace,
  onWidgetRegister,
  WidgetNames,
  WidgetTypes,
} from '@cromwell/core-frontend';
import { TCmsDashboardLayout, TCmsDashboardSingleLayout, TCmsStats, TProductReview } from '@cromwell/core';
import { WidgetErrorBoundary } from '../helpers/WidgetErrorBoundary';

export const getThirdPartyWidget = <T extends WidgetNames>(widgetName: T, widgetProps?: WidgetTypes[T]) => {
  const widgets = getWidgets(widgetName) ?? {};
  return Object.keys(widgets)
    .map((pluginName) => {
      const Comp = widgets[pluginName];
      if (!Comp) return null;
      return (
        <WidgetErrorBoundary widgetName={pluginName} key={pluginName}>
          <Comp {...(typeof widgetProps !== 'object' ? ({} as any) : widgetProps)} />
        </WidgetErrorBoundary>
      );
    })
    .filter(Boolean);
};

const defaultWidgetList = [
  { id: 'productRating', title: 'Avg. Product Rating' },
  { id: 'salesValue', title: 'Total Sales' },
  { id: 'pageViews', title: 'Total Page Views' },
  { id: 'salesValueLastWeek', title: 'Weekly Sales Chart' },
  { id: 'ordersLastWeek', title: 'Weekly Orders Chart' },
  { id: 'productReviews', title: 'Latest Product Reviews' },
  { id: 'pageViewsStats', title: 'Top Page Views' },
];

const defaultWidgetKeys = defaultWidgetList.map((k) => k.id);

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

const getDefaultLayout: (w: string) => ArrayElement<TCmsDashboardSingleLayout> = (widgetKey: string) => {
  return {
    h: 4,
    i: widgetKey,
    minH: 2,
    minW: 2,
    moved: false,
    static: false,
    w: 4,
    x: 100,
    y: 100,
  };
};

const useDashboardContext = () => {
  const cstore = getCStore();
  const [stats, setStats] = useState<TCmsStats>();
  const [reviews, setReviews] = useState<TProductReview[]>([]);
  const [isLoadingStats, setLoadingStats] = useState(true);
  const [isLoadingReviews, setLoadingReviews] = useState(true);
  const [layout, setLayout] = useState<TCmsDashboardLayout | undefined>();
  const [lastSnapshot, setLastSnapshot] = useState<TCmsDashboardLayout | undefined>();
  const [isLoadingLayout, setLoading] = useState(true);
  const [customWidgets, setCustomWidgets] = useState<JSX.Element[]>([]);
  const [widgetList, setWidgetList] = useState<ArrayElement<typeof defaultWidgetList>[]>(defaultWidgetList);

  useEffect(() => {
    onWidgetRegister('Dashboard', (pluginName) => {
      // console.log("PLUGIN WIDGET", pluginName);
      setWidgetList((o) => [...o, { id: pluginName, title: pluginName }]);
      setCustomWidgets(
        getWidgetsForPlace('Dashboard', {
          stats,
          setSize: () => {},
        }),
      );
    });
  }, []);

  const getReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const nReviews = await getGraphQLClient()?.getProductReviews({
        pagedParams: {
          pageSize: 10,
        },
      });
      if (nReviews?.elements) {
        setReviews(nReviews.elements);
      }
    } catch (e) {}
    setLoadingReviews(false);
  }, []);

  const getStats = useCallback(async () => {
    setLoadingStats(true);
    const client = getRestApiClient();

    try {
      const nStats = await client?.getCmsStats();
      if (nStats) {
        nStats.salesPerDay = nStats.salesPerDay
          .map((p) => ({
            ...p,
            date: new Date(p.date),
            // orders: parseInt((Math.random() * 1000).toFixed(2)),
            // salesValue: parseInt(
            //   (Math.random() * 10000).toFixed(2),
            // ),
          }))
          .reverse();
        setStats(nStats);
      }
    } catch (e) {}
    setLoadingStats(false);
  }, []);

  const getLayout = useCallback(async () => {
    const client = getRestApiClient();

    const settings = await client.getDashboardLayout();

    setLayout(settings.layout);
    setLastSnapshot(JSON.parse(JSON.stringify(settings.layout)));
    setLoading(false);
  }, []);

  const deleteWidget = useCallback(async (widgetKey: string) => {
    if (!widgetKey || widgetKey === '') return;
    setLayout((oldLayout) => ({
      xxs: oldLayout?.xxs?.filter((l) => l.i !== widgetKey),
      xs: oldLayout?.xs?.filter((l) => l.i !== widgetKey),
      sm: oldLayout?.sm?.filter((l) => l.i !== widgetKey),
      md: oldLayout?.md?.filter((l) => l.i !== widgetKey),
      lg: oldLayout?.lg?.filter((l) => l.i !== widgetKey),
    }));
  }, []);

  const addWidget = useCallback(async (widgetKey: string) => {
    setLayout((oldLayout) => {
      if (oldLayout.lg.find((k) => k.i === widgetKey)) {
        return oldLayout;
      }

      return {
        xxs: [...oldLayout?.xxs, getDefaultLayout(widgetKey)],
        xs: [...oldLayout?.xs, getDefaultLayout(widgetKey)],
        sm: [...oldLayout?.sm, getDefaultLayout(widgetKey)],
        md: [...oldLayout?.md, getDefaultLayout(widgetKey)],
        lg: [...oldLayout?.lg, getDefaultLayout(widgetKey)],
      };
    });
  }, []);

  const saveLayout = useCallback(async () => {
    const client = getRestApiClient();

    await client.saveDashboardLayout({
      type: 'user',
      layout,
    });

    setLastSnapshot(layout);
  }, [layout]);

  const resetToSnapshot = useCallback(async () => {
    setLayout(lastSnapshot);
  }, [lastSnapshot]);

  useEffect(() => {
    getLayout();
  }, [getLayout]);

  const isLoading = isLoadingLayout || isLoadingReviews || isLoadingStats;

  return {
    layout,
    isLoadingLayout,
    isLoading,
    stats,
    reviews,
    getStats,
    getReviews,
    deleteWidget,
    getLayout,
    setLayout,
    addWidget,
    widgetList,
    saveLayout,
    resetToSnapshot,
    isLoadingReviews,
    isLoadingStats,
    customWidgets,
    cstore,
  };
};

export const useDashboard = () => {
  return React.useContext(DashboardContext);
};

type ContextType = ReturnType<typeof useDashboardContext>;
const Empty = {} as ContextType;

const DashboardContext = React.createContext<ContextType>(Empty);

export const DashboardContextProvider = ({ children }) => {
  const value = useDashboardContext();

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
