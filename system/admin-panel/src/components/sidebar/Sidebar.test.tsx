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
            }
        ],
        homePageInfo,
        userPageInfo: {},
        pageInfos: [],
        getLinkByInfo: () => undefined,
    }
});

jest.mock('../notificationCenter/NotificationCenter', () => {
    return () => <></>;
})

import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { homePageInfo, sideBarLinks } from '../../constants/PageInfos';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';

describe('Sidebar component', () => {

    it("renders links from pageInfos", () => {
        render(<Router><Sidebar /></Router>);

        screen.getByText('_test1_');
        screen.getByText('_test2_');

    });

    it("renders single link", () => {
        const homeLink = sideBarLinks.find(l => l.route === homePageInfo.route);
        expect(homeLink).toBeTruthy();
        if (!homeLink) return;

        render(<Router><SidebarLink
            toggleSubmenu={() => () => { }}
            expanded={false}
            forceUpdate={() => { }}
            activeId={null}
            setActiveId={() => { }}
            data={homeLink}
            userInfo={{ role: 'administrator' } as any}
        /></Router>);

        screen.getByText(homePageInfo.name);
    });



})
