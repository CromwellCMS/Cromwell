jest.mock('../../constants/PageInfos', () => {
  const homePageInfo = {
    name: 'Dashboard',
    route: '/',
  };
  return {
    sideBarLinks: [
      {
        id: 'homePage',
        title: homePageInfo.name,
        route: homePageInfo.route,
      },
      {
        id: '1',
        title: '_test1_',
        route: '_test1_',
      },
      {
        id: '2',
        title: '_test2_',
        route: '_test2_',
      },
    ],
    homePageInfo,
    userPageInfo: {},
  };
});

jest.mock('../../helpers/navigation', () => {
  return {
    getLinkByInfo: () => undefined,
    getPageInfos: () => [],
    getSideBarLinks: () => [
      {
        id: 'homePage',
        title: homePageInfo.name,
        route: homePageInfo.route,
      },
      {
        id: '1',
        title: '_test1_',
        route: '_test1_',
      },
      {
        id: '2',
        title: '_test2_',
        route: '_test2_',
      },
    ],
  };
});

jest.mock('../notificationCenter/NotificationCenter', () => {
  return () => <></>;
});

import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { homePageInfo } from '../../constants/PageInfos';
import { getSideBarLinks } from '../../helpers/navigation';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';

describe('Sidebar component', () => {
  it('renders links from pageInfos', () => {
    render(
      <Router>
        <Sidebar />
      </Router>,
    );

    screen.getByText('_test1_');
    screen.getByText('_test2_');
  });

  it('renders single link', () => {
    const homeLink = getSideBarLinks().find((l) => l.route === homePageInfo.route);
    expect(homeLink).toBeTruthy();
    if (!homeLink) return;

    render(
      <Router>
        <SidebarLink
          toggleSubMenu={() => () => {}}
          expanded={false}
          forceUpdate={() => {}}
          activeId={null}
          // setActiveId={() => { }}
          data={homeLink}
          userInfo={{ roles: [{ name: 'administrator', permissions: ['all'] }] } as any}
        />
      </Router>,
    );

    screen.getByText(homePageInfo.name);
  });
});
