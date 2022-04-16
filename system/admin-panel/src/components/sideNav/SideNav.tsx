import {
  getStoreItem,
  onStoreChange,
  TUser,
} from "@cromwell/core";
import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import SideNavLink from "./SideNavLink";
import { useForceUpdate } from "../../helpers/forceUpdate";
import {
  getLinkByInfo,
  getPageInfos,
  getSideBarLinks,
} from "../../helpers/navigation";
import { store } from "../../redux/store";
import Topbar from "../topbar/Topbar";

export const SideNav = () => {
  const pageInfos = getPageInfos();
  const currentInfo = pageInfos.find(
    (i) =>
      i.route ===
      window.location.pathname.replace("/admin", ""),
  );
  const currentLink = getLinkByInfo(currentInfo);
  const [expanded, setExpanded] = useState<string | false>(
    currentLink?.parentId ?? false,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory?.();
  const forceUpdate = useForceUpdate();

  const userInfo: TUser | undefined =
    getStoreItem("userInfo");
  const toggleSubMenu =
    (panel: string) =>
    (
      event: React.ChangeEvent<any>,
      isExpanded: boolean,
    ) => {
      setExpanded(isExpanded ? panel : false);
    };
  const handleCloseMenu = () => {
    setMobileOpen(false);
  };
  const handleOpenMenu = () => {
    setMobileOpen(true);
  };

  useEffect(() => {
    onStoreChange("userInfo", () => {
      setTimeout(forceUpdate, 100);
    });
    history?.listen(() => {
      const currentInfo = pageInfos.find(
        (i) =>
          i.route ===
          window.location.pathname.replace("/admin", ""),
      );
      const newCurrentLink = getLinkByInfo(currentInfo);
      if (
        newCurrentLink &&
        newCurrentLink !== currentLink
      ) {
        // setActiveId(newCurrentLink.id);
        if (newCurrentLink.parentId)
          setExpanded(newCurrentLink.parentId);
      }
      setTimeout(forceUpdate, 100);
    });

    store.setStateProp({
      prop: "forceUpdateSidebar",
      payload: forceUpdate,
    });
  }, []);

  // check for disabled sidebar
  if (currentInfo?.disableSidebar) return <></>;

  return (
    <>
      <div className="bg-white max-h-full rounded-2xl shadow-lg my-4 mb-8 ml-4 transform-gpu transition-all top-4 shadow-indigo-200 w-80 z-[90] hidden sticky lg:block dark:bg-gray-700">
        <div className="h-full rounded-2xl">
          <div className="flex py-2 items-center justify-center">
            <Link to="/">
              <img
                src="/admin/static/logo_small_black.svg"
                width="30px"
                className="mx-auto mt-0"
              />
            </Link>
          </div>
          <nav className="h-[calc(100vh-150px)] mt-0 overflow-y-auto scrollbar-slim">
            {
              (
                <div className={`h-full flex ${currentInfo?.minimizeSidebar ? "flex-row" : "flex-col"}`}>
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
              )
            }
          </nav>
          <Topbar />
        </div>
      </div>
    </>
  );
};

export default SideNav;
