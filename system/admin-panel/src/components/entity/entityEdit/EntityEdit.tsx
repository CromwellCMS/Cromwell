import { gql } from '@apollo/client';
import { getStoreItem, resolvePageRoute, serviceLocator, TBasePageEntity } from '@cromwell/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Autocomplete as MuiAutocomplete, Button, Grid, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { getCustomMetaFor, getCustomMetaKeysFor, RenderCustomFields } from '../../../helpers/customFields';
import commonStyles from '../../../styles/common.module.scss';
import { toast } from '../../toast/toast';
import { TBaseEntityFilter, TEntityPageProps } from '../types';
import styles from './EntityEdit.module.scss';

type TEntityEditProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    = TEntityPageProps<TEntityType, TFilterType> & RouteComponentProps<{ id: string }>;

class EntityEdit<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
    extends React.Component<TEntityEditProps<TEntityType, TFilterType>, {
        entityData?: TEntityType;
        isLoading: boolean;
        notFound: boolean;
        isSaving: boolean;
    }> {

    componentDidMount() {
        this.init();
    }

    private init = async () => {
        if (!this.props.match) {
            console.error('this.props.match in not defined, you must provide "react-router" props for entity to be displayed');
            return;
        }
        this.setState({ isLoading: true });
        const entityId = this.props.match.params?.id;
        let entityData: TEntityType;

        if (entityId === 'new') {
            entityData = {} as any;
        } else if (entityId) {
            entityData = await this.getEntity(parseInt(entityId));
        }

        if (!entityData) {
            this.setState({ notFound: true });
        } else {
            this.setState({ entityData });
        }

        this.setState({ isLoading: false });
    }

    private refetchMeta = async () => {
        const entityId = this.props.match?.params?.id;
        if (!entityId) return;
        const data = await this.getEntity(parseInt(entityId));
        return data?.customMeta;
    };

    private getEntity = async (entityId: number) => {
        let data: TEntityType;
        if (!this.props.getById) {
            console.error('this.props.getById in not defined, you must provide "getById" prop for entity to be displayed');
            return;
        }
        try {
            data = await this.props.getById(entityId,
                gql`
                    fragment ${this.props.entityCategory}AdminPanelFragment on ${this.props.entityCategory} {
                        id
                        slug
                        createDate
                        updateDate
                        pageTitle
                        pageDescription
                        meta {
                            keywords
                        }
                        isEnabled
                        entityType
                        customMeta (keys: ${JSON.stringify(getCustomMetaKeysFor(this.props.entityType ?? this.props.entityCategory))})
                    }`, `${this.props.entityCategory}AdminPanelFragment`
            );
        } catch (e) {
            console.error(e)
        }
        return data;
    }

    private handleInputChange = (key: keyof TEntityType, val: any) => {
        this.setState(prev => {
            return {
                entityData: {
                    ...(prev?.entityData ?? {} as any),
                    [key]: val,
                }
            }
        });
    }

    private handleSave = async () => {
        if (!this.props.getInput) {
            console.error('this.props.getInput in not defined, you must provide "getInput" prop for entity to be saved');
            return;
        }
        if (!this.props.getInput) {
            console.error('this.props.create in not defined, you must provide "create" prop for entity to be saved');
            return;
        }
        if (!this.props.getInput) {
            console.error('this.props.update in not defined, you must provide "update" prop for entity to be saved');
            return;
        }
        if (!this.props.history) {
            console.error('this.props.history in not defined, you must provide "react-router" props for entity to be saved');
            return;
        }

        const entityData = this.state?.entityData
        if (!entityData) return;
        this.setState({ isSaving: true });
        const entityId = this.props.match?.params?.id;

        const inputData: Omit<TEntityType, 'id'> = {
            slug: entityData.slug,
            pageTitle: entityData.pageTitle,
            pageDescription: entityData.pageDescription,
            meta: entityData.meta && {
                keywords: entityData.meta.keywords,
            },
            ...this.props.getInput(),
        }

        inputData.customMeta = Object.assign({}, inputData.customMeta,
            await getCustomMetaFor(this.props.entityType ?? this.props.entityCategory));

        if (entityId === 'new') {
            try {
                const newData = await this.props.create(inputData);
                toast.success(`Created ${(this.props.entityType
                    ?? this.props.entityCategory).toLocaleLowerCase()}`);

                this.props.history.replace(`${this.props.entityBaseRoute}/${newData.id}`);

                const updatedData = await this.getEntity(newData.id);
                this.setState({ entityData: updatedData });
            } catch (e) {
                toast.error(`Failed to create ${(this.props.entityType
                    ?? this.props.entityCategory).toLocaleLowerCase()}`);
                console.error(e);
            }
        } else {
            try {
                await this.props.update(parseInt(entityId), inputData);
                const updatedData = await this.getEntity(parseInt(entityId));
                this.setState({ entityData: updatedData });
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                console.error(e);
            }
        }
        this.setState({ isSaving: false });
    }

    render() {
        if (this.state?.notFound) {
            return (
                <div className={styles.EntityEdit}>
                    <div className={styles.notFoundPage}>
                        <p className={styles.notFoundText}>{this.props.entityType
                            ?? this.props.entityCategory} not found</p>
                    </div>
                </div>
            )
        }

        let pageFullUrl;
        if (this.state?.entityData) {
            const pageName = this.props.defaultPageName ?? this.props.entityType ?? this.props.entityCategory;
            if (getStoreItem('defaultPages')?.[pageName]) {
                pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute(pageName,
                    { slug: this.state.entityData.slug ?? this.state.entityData.id + '' }
                );
            }
        }

        const entityData = this.state?.entityData;

        return (
            <div className={styles.EntityEdit}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <IconButton
                            onClick={() => window.history.back()}
                        >
                            <ArrowBackIcon style={{ fontSize: '18px' }} />
                        </IconButton>
                        <p className={commonStyles.pageTitle}>{(this.props.entityLabel ?? this.props.entityType
                            ?? this.props.entityCategory).toLocaleLowerCase()}</p>
                    </div>
                    <div className={styles.headerActions}>
                        {pageFullUrl && (
                            <Tooltip
                                title={`Open ${(this.props.entityType ?? this.props.entityCategory).toLocaleLowerCase()} in the new tab`}
                            >
                                <IconButton
                                    className={styles.openPageBtn}
                                    aria-label="open"
                                    onClick={() => { window.open(pageFullUrl, '_blank'); }}
                                >
                                    <OpenInNewIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                        <div className={commonStyles.center}>
                            <Button variant="contained" color="primary"
                                className={styles.saveBtn}
                                size="small"
                                disabled={this.state?.isSaving}
                                onClick={this.handleSave}
                            >Save</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>
                    {this.state?.isLoading && (
                        Array(8).fill(1).map((it, index) => (
                            <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
                        ))
                    )}
                    {!this.state?.isLoading && (
                        <Grid container spacing={3}>
                            {this.state?.entityData && this.props.renderFields?.(this.state.entityData)}
                            <Grid item xs={12} >
                                {this.state?.entityData && (
                                    <RenderCustomFields
                                        entityType={this.props.entityType ?? this.props.entityCategory}
                                        entityData={this.state?.entityData}
                                        refetchMeta={this.refetchMeta}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Slug"
                                    value={entityData?.slug ?? ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.defaultField}
                                    onChange={(e) => { this.handleInputChange('slug', e.target.value) }}
                                    helperText={pageFullUrl}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Meta title"
                                    value={entityData?.pageTitle ?? ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.defaultField}
                                    onChange={(e) => { this.handleInputChange('pageTitle', e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Meta description"
                                    value={entityData?.pageDescription ?? ''}
                                    fullWidth
                                    variant="standard"
                                    className={styles.defaultField}
                                    onChange={(e) => { this.handleInputChange('pageDescription', e.target.value) }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <MuiAutocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    className={styles.defaultField}
                                    value={entityData?.meta?.keywords ?? []}
                                    getOptionLabel={(option) => option as any}
                                    onChange={(e, newVal) => {
                                        this.handleInputChange('meta', {
                                            ...(entityData.meta ?? {}),
                                            keywords: newVal
                                        })
                                    }}
                                    renderInput={(params) => (
                                        <Tooltip title="Press ENTER to add">
                                            <TextField
                                                {...params}
                                                variant="standard"
                                                label="Meta keywords"
                                            />
                                        </Tooltip>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    )}
                </div>
            </div >
        )
    }
}

export default withRouter(EntityEdit);
