import { TUser } from "@cromwell/core";
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
}) => {
  const isExpanded = props.expanded === props.data.id;

  if (props.data?.roles && props.userInfo?.role) {
    if (!props.data.roles.includes(props.userInfo.role)) {
      return null;
    }
  }

  const head = (
    <div>
      <div className="">
        <div className="">{props.data.icon}</div>
        <p>{props.data.title}</p>
      </div>
    </div>
  );

  if (props.data.route) {
    return (
      <Link
        className={` ${
          props.activeId === props.data.id
            ? "w-full font-thin text-indigo-500 flex items-center p-4 my-2 transition-colors duration-200 justify-start bg-gradient-to-r from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-gray-800 border-r-4 border-indigo-500"
            : "w-full font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500"
        }`}
        onClick={(e) => e.stopPropagation()}
        to={props.data.route}>
        <span className="text-left">{props.data.icon}</span>
        <span className="mx-4 text-sm font-normal">
          {props.data.title}
        </span>
      </Link>
    );
  }

  if (props.data.subLinks) {
    return (
      <Disclosure defaultOpen={isExpanded}>
        {({ open }) => {
          // console.log(props.data.title, isExpanded, open)
          return (
            <>
              <Disclosure.Button
                onChange={() => props.toggleSubMenu(props.data.id)}
                onClick={() => props.toggleSubMenu(props.data.id)}
                className={`w-full font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500`}>
                <span className="text-left">
                  {props.data.icon}
                </span>
                <span className="mx-4 text-sm font-normal">
                  {props.data.title}
                </span>

                <ChevronRightIcon
                  className={`w-5 h-5 text-right ${
                    open ? "transform rotate-90" : ""
                  }`}
                />
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
      className={` ${
        props.activeId === props.data.id
          ? "w-full font-thin text-indigo-500 flex items-center p-4 my-2 transition-colors duration-200 justify-start bg-gradient-to-r from-white to-indigo-100 border-r-4 border-indigo-500 dark:from-gray-700 dark:to-gray-800 border-r-4 border-indigo-500"
          : "w-full font-thin text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-indigo-500"
      }`}
      to={props.data.route}>
      <span className="text-left">{props.data.icon}</span>
      <span className="mx-4 text-sm font-normal">
        {props.data.title}
      </span>
    </Link>
  );
};

export default SideNavLink;
