import { useEffect, useState } from 'react';

import { getStoreItem, onStoreChange, removeOnStoreChange } from './global-store';

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState(getStoreItem('userInfo'));

    useEffect(() => {
        const onUserChange = (info) => {
            setUserInfo(info);
        }
        onStoreChange('userInfo', onUserChange);

        return () => {
            removeOnStoreChange('userInfo', onUserChange);
        }
    }, []);

    return userInfo;
}
