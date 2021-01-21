import { isServer } from "@cromwell/core"

export const getFileManager = () => {
    if (!isServer()) return window.CromwellFileManager;
    else return global.CromwellFileManager;
}