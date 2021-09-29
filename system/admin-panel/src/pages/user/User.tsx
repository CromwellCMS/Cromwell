import { getStoreItem, setStoreItem, TCreateUser, TUpdateUser, TUser, TUserRole } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { userPageInfo } from '../../constants/PageInfos';
import { userRoles } from '../../constants/roles';
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

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const getUser = async (id: string) => {
        let data: TUser | undefined;
        try {
            data = await client?.getUserById(id);
        } catch (e) { console.error(e) }

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
            setUserData((prevData) => {
                const newData = Object.assign({}, prevData);
                (newData[prop] as any) = val;
                return newData;
            });
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
                <p className={commonStyles.pageTitle}>account</p>
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
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Name"
                            value={userData?.fullName || ''}
                            fullWidth
                            className={styles.field}
                            onChange={(e) => { handleInputChange('fullName', e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="E-mail"
                            value={userData?.email || ''}
                            fullWidth
                            className={styles.field}
                            onChange={(e) => { handleInputChange('email', e.target.value) }}
                        />
                    </Grid>
                    {isNew && (
                        <Grid item xs={12} sm={6}>
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
                        </Grid>
                    )}
                    <Grid item xs={12} sm={6}>
                        <FormControl className={styles.field} fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                fullWidth
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Bio"
                            value={userData?.bio || ''}
                            fullWidth
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
                            className={styles.field}
                            onChange={(e) => { handleInputChange('address', e.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Phone"
                            value={userData?.phone || ''}
                            fullWidth
                            className={styles.field}
                            onChange={(e) => { handleInputChange('phone', e.target.value) }}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
