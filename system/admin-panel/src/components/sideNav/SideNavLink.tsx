import { TUser, matchPermissions } from "@cromwell/core";
import { Disclosure, Transition } from "@headlessui/react";
import { ChevronRightIcon } from "@heroicons/react/solid";
import React from "react";
import { Link } from "react-router-dom";

import { TSidebarLink } from "../../constants/PageInfos";

const SideNavLink = (props: {
  data: TSidebarLink;
  toggleSubMenu: (
    panel: string,
  ) => (
      event: React.ChangeEvent,
      isExpanded: boolean,
    ) => void;
  expanded: string | false;
  forceUpdate: () => void;
  activeId: string;
  userInfo: TUser | undefined;
  minimize?: boolean;
}) => {
  const { data, userInfo, expanded } = props;
  const isExpanded = expanded === data.id;

  const hasPermission = (link: TSidebarLink) => !(link?.permissions?.length &&
    !matchPermissions(userInfo, link?.permissions))

  if (!hasPermission(data)) return null;
  // Don't show sidebar category if no sub links permitted to access
  if (!data.route && !data.subLinks.some(hasPermission)) return null;

  if (props.data.route) {
    return (
      <Link
        className={` ${props.activeId === props.data.id
          ? "font-thin text-indigo-500 flex items-center p-4 my-2 transition-colors duration-200 justify-start bg-gradient-to-r from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-gray-800"
          : "font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500 hover:border-r-4 hover:border-indigo-300"
          } ${props.minimize ? "w-6 h-6" : " w-full"}`}
        onClick={(e) => e.stopPropagation()}
        to={props.data.route}>
        <span className="text-left">{props.data.icon}</span>
        {!props.minimize && (
          <span className="mx-4 text-sm font-normal">
            {props.data.title}
          </span>
        )}
      </Link>
    );
  }

  if (props.data.subLinks && !props.minimize) {
    return (
      <Disclosure defaultOpen={isExpanded}>
        {({ open }) => {
          return (
            <>
              <Disclosure.Button
                onChange={() =>
                  props.toggleSubMenu(props.data.id)
                }
                onClick={() =>
                  props.toggleSubMenu(props.data.id)
                }
                className={`font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500 hover:border-r-4 hover:border-indigo-300 ${props.minimize ? "w-6 h-6" : " w-full"
                  }`}>
                <span className="text-left">
                  {props.data.icon}
                </span>
                {!props.minimize && (
                  <>
                    <span className="mx-4 text-sm font-normal">
                      {props.data.title}
                    </span>
                    <ChevronRightIcon
                      className={`w-5 h-5 text-right ${open ? "transform rotate-90" : ""
                        }`}
                    />{" "}
                  </>
                )}
              </Disclosure.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-90 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-200 opacity-100"
                leaveTo="transform scale-90 opacity-0">
                <Disclosure.Panel className="pl-4">
                  {props.data.subLinks.map((subLink) => (
                    <SideNavLink
                      data={subLink}
                      key={subLink.id}
                      expanded={props.expanded}
                      toggleSubMenu={props.toggleSubMenu}
                      forceUpdate={props.forceUpdate}
                      activeId={props.activeId}
                      userInfo={props.userInfo}
                    />
                  ))}
                </Disclosure.Panel>
              </Transition>
            </>
          );
        }}
      </Disclosure>
    );
  }

  return (
    <Link
      className={` ${props.activeId === props.data.id
        ? "font-thin text-indigo-500 flex items-center p-4 my-2 transition-colors duration-200 justify-start bg-gradient-to-r from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-indigo-800 hover:bg-gradient-to-r hover:border-r-4 hover:border-indigo-300"
        : "font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500 bg-gradient-to-r hover:border-r-4 hover:border-indigo-300"
        } ${props.minimize ? "w-6 h-6" : " w-full"}`}
      to={props.data.route}>
      <span className="text-left">{props.data.icon}</span>
      {!props.minimize && (
        <span className="mx-4 text-sm font-normal">
          {props.data.title}
        </span>
      )}
    </Link>
  );
};

export default SideNavLink;
