import { gql } from '@apollo/client';
import { EDBEntity, getStoreItem, setStoreItem, TCreateUser, TUpdateUser, TUser, TUserRole } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import {
    ArrowBack as ArrowBackIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { Button, Grid, IconButton, InputAdornment, SelectChangeEvent, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { ImagePicker } from '../../components/imagePicker/ImagePicker';
import { Select } from '../../components/select/Select';
import { toast } from '../../components/toast/toast';
import { userPageInfo } from '../../constants/PageInfos';
import { userRoles } from '../../constants/roles';
import { getCustomMetaFor, getCustomMetaKeysFor, RenderCustomFields } from '../../helpers/customFields';
import commonStyles from '../../styles/common.module.scss';
import styles from './User.module.scss';

export default function UserPage() {
    const { id: userId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const history = useHistory();
    const [userData, setUserData] = useState<TUser | undefined | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const isNew = userId === 'new';
    const [canValidate, setCanValidate] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const getUser = async (id: number) => {
        let data: TUser | undefined;
        try {
            data = await client?.getUserById(id,
                gql`
                fragment AdminPanelUserFragment on User {
                    id
                    slug
                    createDate
                    updateDate
                    isEnabled
                    pageTitle
                    pageDescription
                    meta {
                        keywords
                    }
                    fullName
                    email
                    avatar
                    bio
                    phone
                    address
                    role
                    customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(EDBEntity.User))})
                }`, 'AdminPanelUserFragment');
        } catch (e) { console.error(e) }

        return data;
    }


    const init = async () => {
        if (userId && !isNew) {
            const data = await getUser(parseInt(userId));
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

    const refetchMeta = async () => {
        if (!userId) return;
        const data = await getUser(parseInt(userId));
        return data?.customMeta;
    };


    const handleInputChange = (prop: keyof TUser, val: any) => {
        if (userData) {
            setUserData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
        }
    }

    const getInput = async (): Promise<TUpdateUser> => ({
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
        customMeta: Object.assign({}, userData.customMeta, await getCustomMetaFor(EDBEntity.User)),
    });

    const handleSave = async () => {
        setCanValidate(true);
        const inputData = await getInput();

        if (!inputData.email || !inputData.fullName || !inputData.role) return;

        if (isNew) {
            if (!passwordInput) return;
            try {
                const createInput: TCreateUser = {
                    ...inputData,
                    password: passwordInput
                }
                const newData = await client?.createUser(createInput);
                toast.success('Created user');
                history.replace(`${userPageInfo.baseRoute}/${newData.id}`);
                setUserData(newData);
            } catch (e) {
                toast.error('Failed to create user');
                console.error(e);
            }

        } else if (userData?.id) {
            try {
                await client?.updateUser(userData.id, inputData);
                const newData = await getUser(parseInt(userId));
                setUserData(newData);
                toast.success('Saved!');

                const currentUser: TUser | undefined = getStoreItem('userInfo');
                if (currentUser?.id && currentUser.id === newData.id) {
                    setStoreItem('userInfo', userData);
                }

            } catch (e) {
                toast.error('Failed to save');
                console.error(e);
            }
        }
        setCanValidate(false);
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
                <div className={styles.headerLeft}>
                    <IconButton
                        onClick={() => window.history.back()}
                    >
                        <ArrowBackIcon style={{ fontSize: '18px' }} />
                    </IconButton>
                    <p className={commonStyles.pageTitle}>account</p>
                </div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>
                        Save</Button>
                </div>
            </div>
            <div className={styles.fields}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <TextField
                            label="Name"
                            value={userData?.fullName || ''}
                            fullWidth
                            variant="standard"
                            className={styles.field}
                            onChange={(e) => { handleInputChange('fullName', e.target.value) }}
                            error={canValidate && !userData?.fullName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <ImagePicker
                            label="Avatar"
                            onChange={(val) => { handleInputChange('avatar', val) }}
                            value={userData?.avatar ?? null}
                            className={styles.imageField}
                            classes={{ image: styles.image }}
                            backgroundSize='cover'
                            width="50px"
                            height="50px"
                            showRemove
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="E-mail"
                            value={userData?.email || ''}
                            fullWidth
                            variant="standard"
                            className={styles.field}
                            onChange={(e) => { handleInputChange('email', e.target.value) }}
                            error={canValidate && !userData?.email}
                        />
                    </Grid>
                    {isNew && (
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Password"
                                value={passwordInput || ''}
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                variant="standard"
                                className={styles.field}
                                onChange={(e) => { setPasswordInput(e.target.value) }}
                                error={canValidate && !passwordInput}
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
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6} display="flex" alignItems="flex-end">
                        <Select
                            fullWidth
                            variant="standard"
                            label="Role"
                            value={(userData?.role ?? '') as TUserRole}
                            onChange={(event: SelectChangeEvent<unknown>) => {
                                handleInputChange('role', event.target.value)
                            }}
                            error={canValidate && !userData?.role}
                            options={userRoles.map(role => ({ label: role, value: role }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Bio"
                            value={userData?.bio || ''}
                            fullWidth
                            variant="standard"
                            multiline
                            className={styles.field}
                            onChange={(e) => { handleInputChange('bio', e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Address"
                            value={userData?.address || ''}
                            fullWidth
                            variant="standard"
                            className={styles.field}
                            onChange={(e) => { handleInputChange('address', e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            value={userData?.phone || ''}
                            fullWidth
                            variant="standard"
                            className={styles.field}
                            onChange={(e) => { handleInputChange('phone', e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        {userData && (
                            <RenderCustomFields
                                entityType={EDBEntity.User}
                                entityData={userData}
                                refetchMeta={refetchMeta}
                            />
                        )}
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
