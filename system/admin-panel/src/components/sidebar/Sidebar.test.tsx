import SidebarLink from './SidebarLink';
import Sidebar from './Sidebar';
import { homePageInfo, sideBarLinks } from '../../constants/PageInfos';
import React from 'react';
import { Link } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Sidebar component', () => {

    it("has link", () => {
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
