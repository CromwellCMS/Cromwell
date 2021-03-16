import { getStoreItem, setStoreItem, TCreateUser, TUpdateUser, TUser, TUserRole } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { userPageInfo } from '../../constants/PageInfos';
import { userRoles } from '../../constants/roles';
import styles from './User.module.scss';

export default function UserPage() {
    const { id: userId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const history = useHistory();
    let [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const isNew = userId === 'new';

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const getUser = async (id: string) => {
        let data: TUser | undefined;
        try {
            data = await client?.getUserById(id);
        } catch (e) { console.log(e) }

        return data;
    }


    const init = async () => {
        if (userId && !isNew) {
            const data = await getUser(userId);
            if (data?.id) {
                setUserData(data);
            } else setNotFound(true);

        } else if (isNew) {
            setUserData({} as any);
        }
    }

    useEffect(() => {
        init();
    }, []);

    const handleInputChange = (prop: keyof TUser, val: any) => {
        if (userData) {
            const user = Object.assign({}, userData);
            (user[prop] as any) = val;
            setUserData(user);
        }
    }

    const getInput = (): TUpdateUser => ({
        slug: userData.slug,
        pageTitle: userData.pageTitle,
        pageDescription: userData.pageDescription,
        fullName: userData.fullName,
        email: userData.email,
        avatar: userData.avatar,
        bio: userData.bio,
        phone: userData.phone,
        address: userData.address,
        role: userData.role,
    });

    const handleSave = async () => {
        const inputData = getInput();

        if (isNew) {
            try {
                const createInput: TCreateUser = {
                    ...inputData,
                    password: passwordInput
                }
                const newData = await client?.createUser(createInput);
                toast.success('Created user');
                history.push(`${userPageInfo.baseRoute}/${newData.id}`);
                setUserData(newData);
            } catch (e) {
                toast.error('Failed to create user');
                console.error(e)
            }

        } else if (userData?.id) {
            try {
                await client?.updateUser(userData.id, inputData);
                const newData = await getUser(userId);
                setUserData(newData);
                toast.success('Saved!');

                const currentUser: TUser | undefined = getStoreItem('userInfo');
                if (currentUser?.id && currentUser.id === newData.id) {
                    setStoreItem('userInfo', userData);
                }

            } catch (e) {
                toast.error('Failed to save');
                console.error(e)
            }
        }

    }

    if (notFound) {
        return (
            <div className={styles.UserPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>User not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.UserPage}>
            <div className={styles.header}>
                <div></div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>
                        Save</Button>
                </div>
            </div>
            <div className={styles.fields}>
                <TextField
                    label="Name"
                    value={userData?.fullName || ''}
                    fullWidth
                    className={styles.field}
                    onChange={(e) => { handleInputChange('fullName', e.target.value) }}
                />
                <ImagePicker
                    placeholder="Avatar"
                    onChange={(val) => { handleInputChange('avatar', val) }}
                    value={userData?.avatar ?? null}
                    className={styles.imageField}
                    classes={{ image: styles.image }}
                    backgroundSize='cover'
                    width="50px"
                    height="50px"
                    toolTip="Change avatar"
                    showRemove
                />
                <TextField
                    label="E-mail"
                    value={userData?.email || ''}
                    fullWidth
                    className={styles.field}
                    onChange={(e) => { handleInputChange('email', e.target.value) }}
                />
                {isNew && (
                    <TextField
                        label="Password"
                        value={passwordInput || ''}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        className={styles.field}
                        onChange={(e) => { setPasswordInput(e.target.value) }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                <FormControl className={styles.field}>
                    <InputLabel>Role</InputLabel>
                    <Select
                        className={styles.field}
                        value={(userData?.role ?? 'customer') as TUserRole}
                        onChange={(event: React.ChangeEvent<{ value: unknown }>) => {
                            handleInputChange('role', event.target.value)
                        }}
                    >
                        {userRoles.map(role => (
                            <MenuItem value={role} key={role}>{role}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Bio"
                    value={userData?.bio || ''}
                    fullWidth
                    multiline
                    rows={2}
                    className={styles.field}
                    onChange={(e) => { handleInputChange('bio', e.target.value) }}
                />
                <TextField
                    label="Address"
                    value={userData?.address || ''}
                    fullWidth
                    className={styles.field}
                    onChange={(e) => { handleInputChange('address', e.target.value) }}
                />
                <TextField
                    label="Phone"
                    value={userData?.phone || ''}
                    fullWidth
                    className={styles.field}
                    onChange={(e) => { handleInputChange('phone', e.target.value) }}
                />
            </div>
        </div>
    );
}
