import { gql } from '@apollo/client';
import { getStoreItem, resolvePageRoute, serviceLocator, TBasePageEntity, TCustomFieldType } from '@cromwell/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Autocomplete as MuiAutocomplete, Button, Grid, IconButton, Skeleton, TextField, Tooltip } from '@mui/material';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import {
  getCheckboxField,
  getColorField,
  getCustomField,
  getCustomMetaFor,
  getGalleryField,
  getImageField,
  getSelectField,
  getSimpleTextField,
  getTextEditorField,
  getCustomMetaKeysFor,
  RenderCustomFields,
  TFieldDefaultComponent,
} from '../../../helpers/customFields';
import commonStyles from '../../../styles/common.module.scss';
import { toast } from '../../toast/toast';
import { TBaseEntityFilter, TEntityPageProps } from '../types';
import styles from './EntityEdit.module.scss';

type TEditField = {
  key: string;
  type: TCustomFieldType | 'custom';
  label?: string;
  tooltip?: string;
  component?: React.ComponentType<{
    value: any;
    onChange: (value: any) => void;
  }>;
  customGraphQlFragment?: string;
  saveValue?: (value: any) => any;
  required?: boolean;
}


type TEntityEditProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  = TEntityPageProps<TEntityType, TFilterType> & RouteComponentProps<{ id: string }> & {
    fields?: TEditField[];
  };

class EntityEdit<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  extends React.Component<TEntityEditProps<TEntityType, TFilterType>, {
    entityData?: TEntityType;
    isLoading: boolean;
    notFound: boolean;
    isSaving: boolean;
    canValidate: boolean;
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
    const entityProperties = [...new Set([
      'id', 'slug', 'isEnabled', this.props.entityType && 'entityType', 'createDate',
      'updateDate', 'pageTitle', 'pageDescription',
      ...((this.props.fields ?? [])
        .filter(field => !field.customGraphQlFragment).map(field => field.key)),
    ])].filter(Boolean);

    const customFragments = (this.props.fields ?? []).filter(field => field.customGraphQlFragment)
      .map(field => field.customGraphQlFragment);

    try {
      data = await this.props.getById(entityId,
        gql`
          fragment ${this.props.entityCategory}AdminPanelFragment on ${this.props.entityCategory} {
            ${customFragments.join('\n')}
            ${entityProperties.join('\n')}
            meta {
              keywords
            }
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
    if (!this.props.create) {
      console.error('this.props.create in not defined, you must provide "create" prop for entity to be saved');
      return;
    }
    if (!this.props.update) {
      console.error('this.props.update in not defined, you must provide "update" prop for entity to be saved');
      return;
    }
    if (!this.props.history) {
      console.error('this.props.history in not defined, you must provide "react-router" props for entity to be saved');
      return;
    }

    this.setState({ canValidate: true });

    const entityData = this.state?.entityData;
    if (!entityData) return;

    const inputData: Omit<TEntityType, 'id'> = {
      slug: entityData.slug,
      pageTitle: entityData.pageTitle,
      pageDescription: entityData.pageDescription,
      meta: entityData.meta && {
        keywords: entityData.meta.keywords,
      },
      ...Object.assign({}, ...(await Promise.all((this.props?.fields?.map(async field => {
        const value = this.getCachedField(field)?.value;
        return {
          [field.key]: await field?.saveValue?.(value) ?? value,
        }
      }) ?? [])))),
      ...(this.props.getInput?.() ?? {} as Omit<TEntityType, "id">),
    }

    for (const field of (this.props?.fields ?? [])) {
      if (field.required && (inputData[field.key] === null
        || inputData[field.key] === undefined || inputData[field.key] === '')) return;
    }

    const entityId = this.props.match?.params?.id;

    inputData.customMeta = Object.assign({}, inputData.customMeta,
      await getCustomMetaFor(this.props.entityType ?? this.props.entityCategory));

    this.setState({ isSaving: true });

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
    this.setState({ isSaving: false, canValidate: false });
  }

  private getIdFromField = (field: TEditField) => {
    return `${this.props.entityCategory}_${field.key}`;
  }

  private getCachedField = (field: TEditField): {
    component: TFieldDefaultComponent;
    saveData: () => string | Promise<string>;
    value?: any;
  } | undefined => {
    if (field.type === 'Simple text') {
      return getSimpleTextField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Text editor') {
      return getTextEditorField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Select') {
      return getSelectField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Image') {
      return getImageField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Gallery') {
      return getGalleryField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Color') {
      return getColorField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'Checkbox') {
      return getCheckboxField({
        id: this.getIdFromField(field),
        label: field.label,
      });
    }
    if (field.type === 'custom') {
      return getCustomField({
        id: this.getIdFromField(field),
        component: field.component,
      });
    }
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
              {this.state?.entityData && this.props?.fields?.map(field => {
                const fieldCache = this.getCachedField(field);
                const Component: TFieldDefaultComponent | undefined = fieldCache?.component;
                const error = field.required && (fieldCache?.value === null
                  || fieldCache?.value === undefined || fieldCache?.value === '')

                if (!Component) return null;
                return (
                  <Grid item xs={12} key={field.key}>
                    <Component entity={entityData}
                      initialValue={entityData[field.key]}
                      canValidate={this.state?.canValidate}
                      error={error}
                    />
                    {field?.tooltip && (
                      <Tooltip title={field?.tooltip}>
                        <InfoOutlinedIcon />
                      </Tooltip>
                    )}
                  </Grid>
                )
              })}
              {this.state?.entityData && this.props.renderFields?.(this.state.entityData)}
              {this.state?.entityData &&
                !!getCustomMetaKeysFor(this.props.entityType ?? this.props.entityCategory).length && (
                  <Grid item xs={12} >
                    <RenderCustomFields
                      entityType={this.props.entityType ?? this.props.entityCategory}
                      entityData={this.state?.entityData}
                      refetchMeta={this.refetchMeta}
                    />
                  </Grid>
                )}
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
