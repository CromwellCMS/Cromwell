import { gql } from '@apollo/client';
import { getStoreItem, resolvePageRoute, serviceLocator, TBasePageEntity } from '@cromwell/core';
import { ChevronLeftIcon } from '@heroicons/react/outline';
import { OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import { Grid, Skeleton, Tooltip } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import clsx from 'clsx';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import {
  getCheckboxField,
  getColorField,
  getCustomField,
  getCustomMetaFor,
  getCustomMetaKeysFor,
  getDatepickerField,
  getGalleryField,
  getImageField,
  getSelectField,
  getSimpleTextField,
  getTextEditorField,
  RenderCustomFields,
  TFieldDefaultComponent,
} from '../../../helpers/customFields';
import commonStyles from '../../../styles/common.module.scss';
import { IconButton } from '../../buttons/IconButton';
import { TextButton } from '../../buttons/TextButton';
import { AutocompleteInput } from '../../inputs/AutocompleteInput';
import { customGraphQlPropertyToFragment } from '../utils';
import { TextInput } from '../../inputs/TextInput/TextInput';
import { toast } from '../../toast/toast';
import { TBaseEntityFilter, TEditField, TEntityEditState, TEntityPageProps, TFieldsComponentProps } from '../types';
import styles from './EntityEdit.module.scss';
import { InputField } from './InputField';


type TEntityEditProps<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  = TEntityPageProps<TEntityType, TFilterType> & RouteComponentProps<{ id: string }> & {
    fields?: TEditField<TEntityType>[];
    onSave?: (entity: Omit<TEntityType, "id">) => Promise<Omit<TEntityType, "id">>;
    classes?: {
      content?: string;
    };
  };

class EntityEdit<TEntityType extends TBasePageEntity, TFilterType extends TBaseEntityFilter>
  extends React.Component<TEntityEditProps<TEntityType, TFilterType>, TEntityEditState<TEntityType>> {

  private prevRoute: string;

  componentDidMount() {
    this.init();
  }

  private init = async () => {
    if (!this.props.match) {
      console.error('this.props.match in not defined, you must provide "react-router" props for entity to be displayed');
      return;
    }
    this.prevRoute = (this.props.history.location.state as any)?.prevRoute;
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

    const fields = this.props.fields ?? [];

    const entityProperties = [...new Set([
      'id', this.props.entityType && 'entityType', 'createDate', 'updateDate',
      ...(!this.props.disableMeta ? [
        'slug', 'isEnabled', 'pageTitle', 'pageDescription', 'meta { \nkeywords \n}'
      ] : []),
      ...(fields.filter(field => !field.customGraphQlFragment && !field.customGraphQlProperty
        && !field.onlyOnCreate).map(field => field.key)),
    ])].filter(Boolean);

    const customFragments = fields.map(field => field.customGraphQlFragment).filter(Boolean);
    const customProperties = customGraphQlPropertyToFragment(fields.map(c => c.customGraphQlProperty).filter(Boolean));
    const metaKeys = getCustomMetaKeysFor(this.props.entityType ?? this.props.entityCategory);

    try {
      data = await this.props.getById(entityId,
        gql`
          fragment ${this.props.entityCategory}AdminPanelFragment on ${this.props.entityCategory} {
            ${customFragments.join('\n')}
            ${entityProperties.join('\n')}
            ${customProperties}
            ${metaKeys?.length ? `customMeta (keys: ${JSON.stringify(metaKeys)})` : ''}
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
    if (!entityData) {
      console.warn('handleSave: !entityData')
      return;
    }

    let inputData: Omit<TEntityType, 'id'> = {
      slug: entityData.slug,
      pageTitle: entityData.pageTitle,
      pageDescription: entityData.pageDescription,
      meta: entityData.meta && {
        keywords: entityData.meta.keywords,
      },
      ...Object.assign({}, ...(await Promise.all((this.props?.fields?.map(async field => {
        const cached = this.getCachedField(field);
        const value = (await cached?.saveData?.()) ?? cached?.value;

        if (field?.saveValue) return await field.saveValue(value);
        return {
          [field.key]: value,
        }
      }) ?? [])))),
      ...(this.props.getInput?.() ?? {} as Omit<TEntityType, "id">),
    }

    for (const field of (this.props?.fields ?? [])) {
      if (field.required && (inputData[field.key] === null
        || inputData[field.key] === undefined || inputData[field.key] === '')) {
        if (field.onlyOnCreate && this.state?.entityData?.id) {
          // Update
        } else {
          console.warn('handleSave: invalid field: ', field)
          return;
        }
      }
    }

    const entityId = this.props.match?.params?.id;

    inputData.customMeta = Object.assign({}, inputData.customMeta,
      await getCustomMetaFor(this.props.entityType ?? this.props.entityCategory));

    if (this.props.onSave) {
      inputData = await this.props.onSave(inputData);
      if (!inputData) {
        console.warn('No data was returned from `onSave` prop')
        return;
      }
    }

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

  private getIdFromField = (field: TEditField<TEntityType>) => {
    return `${this.props.entityCategory}_${field.key}`;
  }

  private getCachedField = (field: TEditField<TEntityType>): {
    component: TFieldDefaultComponent;
    saveData: () => string | Promise<string>;
    value?: any;
  } | undefined => {
    if (field.type === 'Simple text') {
      return getSimpleTextField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Currency') {
      return getSimpleTextField({
        simpleTextType: 'currency',
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Text editor') {
      return getTextEditorField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Select') {
      return getSelectField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Image') {
      return getImageField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Gallery') {
      return getGalleryField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Color') {
      return getColorField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Checkbox') {
      return getCheckboxField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Date') {
      return getDatepickerField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'Datetime') {
      return getDatepickerField({
        dateType: 'datetime',
        ...field,
        id: this.getIdFromField(field),
      });
    }
    if (field.type === 'custom') {
      return getCustomField({
        ...field,
        id: this.getIdFromField(field),
      });
    }
  }

  public goBack = () => {
    if (this.prevRoute) this.props.history.push(this.prevRoute);
    else if (this.props.entityListRoute) this.props.history.push(this.props.entityListRoute);
    else this.props.history.goBack();
  }

  render() {
    const { entityType, entityCategory, entityLabel, classes = {}, customElements } = this.props;
    const { entityData, notFound, isLoading, isSaving } = this.state ?? {};

    if (notFound) {
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
    if (entityData) {
      const pageName = this.props.defaultPageName ?? this.props.entityType ?? this.props.entityCategory;
      if (getStoreItem('defaultPages')?.[pageName]) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute(pageName,
          { slug: entityData.slug ?? entityData.id + '' }
        );
      }
    }

    const elementProps: TFieldsComponentProps<TEntityType> = {
      ...(this.state ?? {}),
      refetchMeta: this.refetchMeta,
      onSave: this.handleSave,
    }

    return (
      <div className={styles.EntityEdit}>
        <ElevationScroll>
          <AppBar position="sticky" color="transparent" elevation={0}>
            <div className={styles.headerLeft}>
              <IconButton
                onClick={this.goBack}
                className="mr-2"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600 hover:text-indigo:-400" />
              </IconButton>
              <p className={styles.pageTitle}>{(entityLabel ?? entityType ?? entityCategory)}</p>
            </div>
            {customElements?.getEntityHeaderCenter?.(elementProps)}
            <div className={styles.headerActions}>
              {pageFullUrl && (
                <Tooltip
                  title={`Open ${(entityType ?? entityCategory).toLocaleLowerCase()} in the new tab`}
                >
                  <IconButton
                    className={clsx(styles.openPageBtn, 'w-9 h-9')}
                    aria-label="open"
                    onClick={() => { window.open(pageFullUrl, '_blank'); }}
                  >
                    <OpenInNewIcon style={{ width: '100%', height: '100%' }} />
                  </IconButton>
                </Tooltip>
              )}
              <div className={commonStyles.center}>
                <TextButton
                  className={styles.saveBtn}
                  disabled={isSaving}
                  onClick={this.handleSave}
                >Save</TextButton>
              </div>
            </div>
          </AppBar>
        </ElevationScroll>

        <div className={clsx(styles.content, classes.content)}>
          {isLoading && (
            Array(8).fill(1).map((it, index) => (
              <Skeleton style={{ marginBottom: '10px' }} key={index} height={"50px"} />
            ))
          )}
          {!isLoading && (<>
            {(entityData && customElements?.getEntityFields?.(elementProps))
              || (entityData && !!this.props?.fields?.length && (
                <Grid container spacing={3}>
                  {this.props.fields.map(field => {
                    const fieldCache = this.getCachedField(field);
                    return (
                      <InputField
                        key={field.key}
                        fieldCache={fieldCache}
                        field={field}
                        canValidate={this.state?.canValidate}
                        entityData={entityData}
                      />
                    )
                  })}
                  <Grid item xs={12}></Grid>
                </Grid>
              ))}
            {entityData && this.props.renderFields?.(entityData)}
            {entityData &&
              !!getCustomMetaKeysFor(entityType ?? entityCategory).length && (
                <Grid container spacing={3}>
                  <Grid item xs={12} >
                    <RenderCustomFields
                      entityType={entityType ?? entityCategory}
                      entityData={entityData}
                      refetchMeta={this.refetchMeta}
                    />
                  </Grid>
                </Grid>
              )}
            {!this.props.disableMeta && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextInput label="Page URL"
                    value={entityData?.slug ?? ''}
                    className={styles.defaultField}
                    onChange={(e) => { this.handleInputChange('slug', e.target.value) }}
                    description={pageFullUrl}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Meta title"
                    value={entityData?.pageTitle ?? ''}
                    className={styles.defaultField}
                    onChange={(e) => { this.handleInputChange('pageTitle', e.target.value) }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput label="Meta description"
                    value={entityData?.pageDescription ?? ''}
                    className={styles.defaultField}
                    onChange={(e) => { this.handleInputChange('pageDescription', e.target.value) }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <AutocompleteInput
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
                    label="Meta keywords"
                    tooltip="Press ENTER to add"
                  />
                </Grid>
              </Grid>
            )}
          </>)}
        </div>
      </div >
    )
  }
}

export default withRouter(EntityEdit);

function ElevationScroll(props) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: document.getElementById('main-scroll-container'),
  });

  const bgStyle = 'bg-gray-100 bg-opacity-60 w-fudropll back-filter backdrop-blur-lg';

  return React.cloneElement(props.children, {
    className: trigger ? clsx(styles.header, styles.headerElevated, bgStyle) : clsx(styles.header, bgStyle),
  });
}
