import { gql } from '@apollo/client';
import { resolvePageRoute, serviceLocator, TBasePageEntity } from '@cromwell/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Button, Grid, IconButton, Skeleton, Tooltip } from '@mui/material';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { tagPageInfo } from '../../../constants/PageInfos';
import { getCustomMetaFor, getCustomMetaKeysFor, renderCustomFieldsFor, addOnFiledRegisterEventListener } from '../../../helpers/customFields';
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
        addOnFiledRegisterEventListener('EntityEdit', this.onFieldRegistered);
        this.setState({ isLoading: true });
        const entityId = this.props.match.params?.id;
        let entityData: TEntityType;

        if (entityId === 'new') {
            this.setState({ entityData: {} as any });
        } else if (entityId) {
            entityData = await this.getEntity(parseInt(entityId));
            this.setState({ entityData });
        }

        if (!entityData) {
            this.setState({ notFound: true });
        }

        this.setState({ isLoading: false });
    }

    private onFieldRegistered = debounce(300, async () => {
        // If some field registered after this page has fetched entity data, we need to
        // re-request data for this field to get its custom meta
        if (!this) return;
        const entityId = this.props.match.params?.id;

        const data = await this.getEntity(parseInt(entityId));
        this.setState(prevState => {
            return {
                entityData: {
                    ...(prevState.entityData ?? {} as any),
                    // Just patch the values that are undefined, but leave the rest
                    // for user input to be untouched
                    customMeta: Object.assign({}, data.customMeta, prevState.entityData?.customMeta),
                }
            }
        })
    })

    private getEntity = async (entityId: number) => {
        let data: TEntityType;
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
                        customMeta (fields: ${JSON.stringify(getCustomMetaKeysFor(this.props.entityType ?? this.props.entityCategory))})
                    }`, `${this.props.entityCategory}AdminPanelFragment`
            );
        } catch (e) {
            console.error(e)
        }
        return data;
    }

    private handleSave = async () => {
        if (!this.state?.entityData) return;
        this.setState({ isSaving: true });
        const entityId = this.props.match.params?.id;

        const inputData: Omit<TEntityType, 'id'> = {
            ...this.props.getInput(),
        }

        inputData.customMeta = Object.assign({}, inputData.customMeta,
            getCustomMetaFor(this.props.entityType ?? this.props.entityCategory));

        if (entityId === 'new') {
            try {
                const newData = await this.props.create(inputData);
                toast.success(`Created ${(this.props.entityType
                    ?? this.props.entityCategory).toLocaleLowerCase()}`);

                this.props.history.push(`${tagPageInfo.baseRoute}/${newData.id}`);

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
            pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute(
                this.props.defaultPageName ?? this.props.entityType ?? this.props.entityCategory,
                { slug: this.state.entityData.slug ?? this.state.entityData.id + '' }
            );
        }

        return (
            <div className={styles.EntityEdit}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <Link to={this.props.entityListRoute}>
                            <IconButton>
                                <ArrowBackIcon style={{ fontSize: '18px' }} />
                            </IconButton>
                        </Link>
                        <p className={commonStyles.pageTitle}>{(this.props.entityLabel ?? this.props.entityType
                            ?? this.props.entityCategory).toLocaleLowerCase()}</p>
                    </div>
                    <div className={styles.headerActions}>
                        {pageFullUrl && (
                            <Tooltip
                                title={`Open ${(this.props.entityType ?? this.props.entityCategory).toLocaleLowerCase()} page in new tab`}
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
                            <Grid item xs={12} >
                                {this.state?.entityData && renderCustomFieldsFor(this.props.entityType
                                    ?? this.props.entityCategory, this.state?.entityData)}
                            </Grid>
                        </Grid>
                    )}
                </div>
            </div >
        )
    }
}

export default withRouter(EntityEdit);
