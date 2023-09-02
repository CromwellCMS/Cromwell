import { getStoreItem, onStoreChange, TUser } from '@cromwell/core';
import { useForceUpdate } from '@helpers/forceUpdate';
import { getLinkByInfo, getPageInfos, getSideBarLinks } from '@helpers/navigation';
import { EyeIcon } from '@heroicons/react/24/solid';
import { appStore } from '@store/app';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Topbar from '../topbar/Topbar';
import SideNavLink from './SideNavLink';

export const SideNav = ({ screen }: { screen: 'mobile' | 'desktop' }) => {
  const pageInfos = getPageInfos();
  const currentInfo = pageInfos.find((i) => i.route === window.location.pathname.replace('/admin', ''));
  const currentLink = getLinkByInfo(currentInfo!);
  const [expanded, setExpanded] = useState<string | false>(currentLink?.parentId ?? false);
  const location = useLocation();
  const forceUpdate = useForceUpdate();

  const userInfo: TUser | undefined = getStoreItem('userInfo');
  const toggleSubMenu = (panel: string) => (event: React.ChangeEvent<any>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    onStoreChange('userInfo', () => {
      setTimeout(forceUpdate, 100);
    });

    appStore.getState().setForceUpdateSidebar(forceUpdate);
  }, []);

  useEffect(() => {
    const currentInfo = pageInfos.find((i) => i.route === window.location.pathname.replace('/admin', ''));
    const newCurrentLink = getLinkByInfo(currentInfo!);
    if (newCurrentLink && newCurrentLink !== currentLink) {
      // setActiveId(newCurrentLink.id);
      if (newCurrentLink.parentId) setExpanded(newCurrentLink.parentId);
    }
    setTimeout(forceUpdate, 100);
  }, [location]);

  return (
    <div
      className={`bg-white h-full shadow-lg ${
        screen === 'desktop' ? 'my-4 mb-4 ml-4 top-4 rounded-2xl' : ''
      } shadow-indigo-200 w-80 z-[90] lg:block dark:bg-gray-700`}
    >
      <div className="h-full rounded-2xl">
        <div className="flex py-2 items-center justify-center relative">
          <Link to="/">
            <img src="/admin/static/logo_small_black.svg" width="30px" className="mx-auto mt-0" />
          </Link>
          <a href="/" target="_blank" className="top-2 left-2 absolute">
            <EyeIcon className="h-4 text-gray-400 w-4 hover:text-indigo-600" />
          </a>
        </div>
        <nav className="h-[calc(100vh-150px)] mt-0 overflow-y-auto scrollbar-slim">
          {
            <div className={`h-full flex ${currentInfo?.minimizeSidebar ? 'flex-row' : 'flex-col'}`}>
              {getSideBarLinks().map((link) => (
                <SideNavLink
                  data={link}
                  key={link.id}
                  toggleSubMenu={toggleSubMenu}
                  expanded={expanded}
                  forceUpdate={forceUpdate}
                  activeId={currentLink?.id}
                  userInfo={userInfo}
                  minimize={!!currentInfo?.minimizeSidebar}
                />
              ))}
            </div>
          }
        </nav>
        <Topbar />
      </div>
    </div>
  );
};

export default SideNav;
