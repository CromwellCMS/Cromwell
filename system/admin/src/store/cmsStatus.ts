import { getStoreItem, matchPermissions, onStoreChange, TCmsStatus } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { create } from 'zustand';

const cmsStatusStore = create<{
  status?: TCmsStatus;
  setStatus: (status: TCmsStatus) => void;
}>((set) => ({
  status: undefined,
  setStatus: (status: TCmsStatus) => set({ status }),
}));

export function setCmsStatus(status: TCmsStatus) {
  cmsStatusStore.getState().setStatus(status);
}

export function getCmsStatus() {
  return cmsStatusStore.getState().status;
}

export function useCmsStatus() {
  return cmsStatusStore((state) => state.status);
}

export function setCmsUpdating(updating: boolean) {
  const status = cmsStatusStore.getState().status;
  cmsStatusStore.getState().setStatus({
    ...status!,
    isUpdating: updating,
  });
}

export const updateCmsStatus = async () => {
  try {
    const status = await getRestApiClient().getCmsStatus({ disableLog: true });
    if (status) {
      setCmsStatus(status);
    }
  } catch (error) {
    console.error(error);
  }
};

let isChecking = false;
const runCmsUpdateChecker = () => {
  if (isChecking) return;

  if (matchPermissions(getStoreItem('userInfo'), ['update_cms', 'read_cms_status'])) {
    isChecking = true;
    updateChecker();
  }
};

const updateChecker = async () => {
  await updateCmsStatus();
  requestAnimationFrame(() => setTimeout(updateChecker, 30000));
};

export function startCmsUpdateChecker() {
  setTimeout(() => {
    runCmsUpdateChecker();

    onStoreChange('userInfo', () => {
      runCmsUpdateChecker();
    });
  }, 100);
}
