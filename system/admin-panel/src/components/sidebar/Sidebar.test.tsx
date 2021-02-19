import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { homePageInfo, sideBarLinks } from '../../constants/PageInfos';
import Sidebar from './Sidebar';
import SidebarLink from './SidebarLink';

describe('Sidebar component', () => {

    it("renders link", () => {
        const homeLink = sideBarLinks.find(l => l.route === homePageInfo.route);
        expect(homeLink).toBeTruthy();
        if (!homeLink) return;

        render(<Router><SidebarLink
            toggleSubmenu={() => () => { }}
            expanded={false}
            forceUpdate={() => { }}
            activeId={'1'}
            setActiveId={() => { }}
            data={homeLink}
        /></Router>);

        screen.getByText(homePageInfo.name);
    });

    it("has logo", () => {
        render(<Router><Sidebar /></Router>);
        screen.getByAltText('logo');
    });


})
