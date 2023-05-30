import { getStoreItem, TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import {
  CpuChipIcon,
  ExclamationCircleIcon,
  InboxIcon,
  InformationCircleIcon,
  BoltIcon,
  ArrowLeftOnRectangleIcon,
  PhotoIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  LifebuoyIcon,
  UserCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

import React, { Fragment, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { Link, useNavigate } from 'react-router-dom';

import { loginPageInfo, userPageInfo } from '../../constants/PageInfos';
import { useForceUpdate } from '../../helpers/forceUpdate';
import { getPageInfos } from '../../helpers/navigation';
import { updateStatus } from '../../redux/helpers';
import { store, TAppState } from '../../redux/store';
import CmsInfo from '../cmsInfo/CmsInfo';
import { getFileManager } from '../fileManager/helpers';
import { askConfirmation } from '../modal/Confirmation';
import SystemMonitor from '../systemMonitor/SystemMonitor';
import { toast } from '../toast/toast';

export const Topbar = () => {
  const pageInfos = getPageInfos();
  const currentInfo = pageInfos.find((i) => i.route === window.location.pathname.replace('/admin', ''));

  const userInfo: TUser | undefined = getStoreItem('userInfo');
  const [, setOptionsOpen] = useState<boolean>(false);
  const [cmsInfoOpen, setCmsInfoOpen] = useState(false);
  const [systemMonitorOpen, setSystemMonitorOpen] = useState(false);
  const forceUpdate = useForceUpdate();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setOptionsOpen(false);
    await getRestApiClient()?.logOut();
    forceUpdate();
    navigate(loginPageInfo.route);
  };

  const openFileManager = () => {
    getFileManager()?.open();
  };

  const openCmsInfo = () => {
    setCmsInfoOpen(true);
  };

  const openDocs = () => {
    window.open('https://cromwellcms.com/docs/overview/intro', '_blank');
  };

  if (currentInfo?.disableSidebar) return <></>;

  return (
    <header className="w-full lg:max-w-xs rounded-xl bg-white dark:bg-gray-700 items-center h-16 z-40 sticky top-0">
      <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center w-full">
        <div className="relative items-center flex w-full lg:max-w-68 sm:pr-2 sm:ml-0">
          <div className="relative p-1 flex items-center justify-start sm:right-auto w-full">
            <UserMenu
              userInfo={userInfo}
              openFileManager={openFileManager}
              setSystemMonitorOpen={setSystemMonitorOpen}
              openDocs={openDocs}
              openCmsInfo={openCmsInfo}
              handleLogout={handleLogout}
            />
            <NotificationMenu userInfo={userInfo} />

            <CmsInfo open={cmsInfoOpen} onClose={() => setCmsInfoOpen(false)} />
            <SystemMonitor open={systemMonitorOpen} onClose={() => setSystemMonitorOpen(false)} />
          </div>
        </div>
      </div>
    </header>
  );
};

const mapStateToProps = (state: TAppState) => {
  return {
    status: state.status,
  };
};

type TPropsType = PropsType<PropsType, { color?: string }, ReturnType<typeof mapStateToProps>>;

const NotificationMenu = connect(mapStateToProps)((props: TPropsType) => {
  const client = getRestApiClient();

  const updateInfo = props.status?.updateInfo;
  const notifications = props.status?.notifications;

  const isUpdating = props.status?.isUpdating;
  const showUpdateAvailable = props.status?.updateAvailable && updateInfo && !props.status?.isUpdating;

  const nothingToShow = !isUpdating && !showUpdateAvailable && notifications?.length === 0;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStartUpdate = async () => {
    store.setStateProp({
      prop: 'status',
      payload: {
        ...store.getState().status,
        isUpdating: true,
      },
    });

    let success = false;
    try {
      success = await client.launchCmsUpdate();
    } catch (error) {
      console.error(error);
    }
    await updateStatus();

    if (success) {
      toast.success('CMS updated');
      const confirm = await askConfirmation({
        title: `CMS has been updated. Please reload this page to apply changes`,
      });
      if (confirm) {
        window.location.reload();
      }
    } else toast.error('Failed to update CMS');
  };

  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={`rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <BellIcon
              className={`w-6 h-6 m-1 stroke-1 ${open ? 'fill-indigo-400 text-indigo-400' : 'text-gray-300'}`}
            />
            {!nothingToShow && <div className="absolute top-[3px] right-[3px] w-2 h-2 bg-red-500 rounded-full" />}
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute left-0 bottom-8 z-10 w-72 origin-bottom-left max-w-sm px-2 mt-3 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-lg shadow-lg shadow-indigo-300 ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-0 bg-white p-2 lg:grid-cols-1">
                  {isUpdating && (
                    <div className="flex items-center select-none py-2 px-4 transition w-full duration-150 ease-in-out rounded-lg bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-gray-900 sm:h-12 sm:w-12">
                        <ArrowPathIcon className="w-6 h-6 animate-spin fill-gray-900 " />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Update in Progress...</p>
                        <p className="text-sm text-gray-500">This may take a while...</p>
                      </div>
                    </div>
                  )}

                  {showUpdateAvailable && (
                    <div className="flex cursor-pointer items-center select-none py-2 px-4 transition w-full duration-150 ease-in-out rounded-lg bg-purple-500 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                        <BoltIcon className="w-6 h-6 animate-bounce fill-white " />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-white">Update available</p>
                        <p className="text-sm text-gray-100">Click here to update your System.</p>
                      </div>
                    </div>
                  )}

                  {nothingToShow && (
                    <div className="flex cursor-pointer items-center select-none py-2 px-4 transition w-full duration-150 ease-in-out rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50">
                      <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                        <InboxIcon className="w-6 h-6 fill-gray-400 " />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Nothing to see...</p>
                        <p className="text-sm text-gray-400">No new notifications! :-)</p>
                      </div>
                    </div>
                  )}

                  {notifications?.map((note, index) => {
                    let severity = 'info';
                    if (note.type === 'warning') severity = 'warning';
                    if (note.type === 'error') severity = 'error';

                    return (
                      <div
                        key={note.pageLink + index}
                        className={`flex cursor-pointer items-center select-none py-2 px-4 transition w-full duration-150 ease-in-out rounded-lg ${
                          severity === 'info' ? 'bg-blue-100' : 'bg-yellow-100'
                        } ${
                          severity === 'error' ? 'bg-red-100' : ''
                        } hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50`}
                      >
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                          {severity === 'info' && <InformationCircleIcon className="w-6 h-6 fill-blue-500" />}
                          {severity === 'warning' && <ExclamationCircleIcon className="w-6 h-6 fill-yellow-600" />}
                          {severity === 'error' && <XCircleIcon className="w-6 h-6 fill-red-500" />}
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">{note.message}</p>
                        </div>
                        {note.documentationLink && (
                          <div
                            onClick={() => window.open(note.documentationLink, '_blank')}
                            className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12"
                          >
                            <QuestionMarkCircleIcon className="w-6 h-6 fill-gray-800 animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
});

const UserMenu = ({ userInfo, openFileManager, setSystemMonitorOpen, openDocs, openCmsInfo, handleLogout }) => {
  return (
    <Menu as="div" className="relative">
      {({ open }) => (
        <>
          <Menu.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                text-black group bg-white-700 hover:bg-gray-50 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            {userInfo?.avatar && userInfo?.avatar !== '' ? (
              <div
                className="w-8 h-8 rounded-xl border border-indigo-100 bg-gradient-to-tr bg-cover bg-center from-indigo-900 to-pink-900"
                style={{
                  backgroundImage: `url(${userInfo.avatar})`,
                }}
              ></div>
            ) : (
              <UserCircleIcon className="w-8 h-8 fill-gray-500 border border-indigo-100" />
            )}
            <div className="flex flex-col text-xs text-left pl-2">
              <p className="font-medium">{userInfo?.fullName ?? '-'}</p>
              <p className="font-thin">{userInfo?.email ?? '-'}</p>
            </div>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Menu.Items className="absolute left-0 bottom-8 z-10 w-72 origin-bottom-left max-w-sm px-2 mt-3 sm:px-0 lg:max-w-md">
              <div className="overflow-hidden rounded-lg shadow-lg shadow-indigo-300 ring-1 ring-black ring-opacity-5">
                <div className="relative grid gap-0 bg-white p-2 lg:grid-cols-1">
                  <Link
                    to={`${userPageInfo.baseRoute}/${userInfo?.id}`}
                    className="flex items-center p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <UserCircleIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{userInfo?.fullName ?? userInfo?.email ?? ''}</p>
                      <p className="text-sm text-gray-500">View and edit your profile</p>
                    </div>
                  </Link>

                  <div
                    onClick={openFileManager}
                    className="flex items-center cursor-pointer p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <PhotoIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Media</p>
                      <p className="text-sm text-gray-500">Manage your media files</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setSystemMonitorOpen(true)}
                    className="flex items-center cursor-pointer p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <CpuChipIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">System</p>
                      <p className="text-sm text-gray-500">Display system stats and monitoring</p>
                    </div>
                  </div>

                  <div
                    onClick={openDocs}
                    className="flex items-center cursor-pointer p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <LifebuoyIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Documentation</p>
                      <p className="text-sm text-gray-500">View CMS documentation</p>
                    </div>
                  </div>

                  <div
                    onClick={openCmsInfo}
                    className="flex items-center cursor-pointer p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <InformationCircleIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">CMS Info</p>
                      <p className="text-sm text-gray-500">View CMS information, license and version</p>
                    </div>
                  </div>

                  <hr />

                  <div
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer p-4 transition w-full duration-150 ease-in-out rounded-lg hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-indigo-500 focus-visible:ring-opacity-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-white sm:h-12 sm:w-12">
                      <ArrowLeftOnRectangleIcon className="w-6 h-6 fill-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Sign out</p>
                    </div>
                  </div>
                </div>
              </div>
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default Topbar;
