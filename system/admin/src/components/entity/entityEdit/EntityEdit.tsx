import { gql } from '@apollo/client';
import {
  getStoreItem,
  resolvePageRoute,
  serviceLocator,
  TBasePageEntity,
  TCustomGraphQlProperty,
} from '@cromwell/core';
import { getCustomMetaFor, getCustomMetaKeysFor } from '@helpers/customFields';
import { Box, Skeleton } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Location, NavigateFunction, Params, useLocation, useNavigate, useParams } from 'react-router-dom';

import { toast } from '../../toast/toast';
import { TBaseEntityFilter, TEntityEditState, TFieldsComponentProps } from '../types';
import { customGraphQlPropertyToFragment } from '../utils';
import { EntityFields } from './components/EntityFields';
import { EntityHeader } from './components/EntityHeader';
import styles from './EntityEdit.module.scss';
import { EntityEditContextProvider, getCachedField } from './helpers';
import { TEntityEditProps } from './type';

class EntityEdit<
  TEntityType extends TBasePageEntity,
  TFilterType extends TBaseEntityFilter,
  TEntityInputType = TEntityType,
> extends React.Component<
  TEntityEditProps<TEntityType, TFilterType, TEntityInputType> & {
    location: Location;
    navigate: NavigateFunction;
    params: Readonly<Params<string>>;
  },
  TEntityEditState<TEntityType>
> {
  private prevRoute: string;

  componentDidMount() {
    this.init();
  }

  private init = async () => {
    this.prevRoute = (this.props.location.state as any)?.prevRoute;
    this.setState({ isLoading: true });
    const entityId = this.props.params?.id;
    let entityData: TEntityType | undefined;

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
  };

  private refetchMeta = async () => {
    const entityId = this.props.params?.id;
    if (!entityId) return;
    const data = await this.getEntity(parseInt(entityId));
    return data?.customMeta;
  };

  private getEntity = async (entityId: number) => {
    let data: TEntityType | undefined;
    if (!this.props.getById) {
      console.error('this.props.getById in not defined, you must provide "getById" prop for entity to be displayed');
      return;
    }

    const fields = this.props.fields ?? [];

    const entityProperties = [
      ...new Set([
        'id',
        this.props.entityType && 'entityType',
        'createDate',
        'updateDate',
        ...(!this.props.disableMeta
          ? ['slug', 'isEnabled', 'pageTitle', 'pageDescription', 'meta { \nkeywords \n}']
          : []),
        ...fields
          .filter((field) => !field.customGraphQlFragment && !field.customGraphQlProperty && !field.onlyOnCreate)
          .map((field) => field.key),
      ]),
    ].filter(Boolean);

    const customFragments = fields.map((field) => field.customGraphQlFragment).filter(Boolean);
    const customProperties = customGraphQlPropertyToFragment(
      fields.map((c) => c.customGraphQlProperty).filter(Boolean) as TCustomGraphQlProperty[],
    );
    const metaKeys = getCustomMetaKeysFor(this.props.entityType ?? this.props.entityCategory);

    try {
      data = await this.props.getById(
        entityId,
        gql`
          fragment ${this.props.entityCategory}AdminPanelFragment on ${this.props.entityCategory} {
            ${customFragments.join('\n')}
            ${entityProperties.join('\n')}
            ${customProperties}
            ${metaKeys?.length ? `customMeta (keys: ${JSON.stringify(metaKeys)})` : ''}
          }`,
        `${this.props.entityCategory}AdminPanelFragment`,
      );
    } catch (e) {
      console.error(e);
    }
    return data;
  };

  private handleInputChange = (key: keyof TEntityType, val: any) => {
    this.setState((prev) => {
      return {
        entityData: {
          ...(prev?.entityData ?? ({} as any)),
          [key]: val,
        },
      };
    });
  };

  private getInputData = async () => {
    const entityData = this.state?.entityData;
    if (!entityData) {
      console.warn('handleSave: !entityData');
      return;
    }

    let inputData: Omit<TEntityType, 'id'> = {
      slug: entityData.slug,
      pageTitle: entityData.pageTitle,
      pageDescription: entityData.pageDescription,
      meta: entityData.meta && {
        keywords: entityData.meta.keywords,
      },
      ...Object.assign(
        {},
        ...(await Promise.all(
          this.props?.fields?.map(async (field) => {
            const cached = getCachedField(field, this.props.entityCategory);
            const value = (await cached?.saveData?.()) ?? cached?.value;

            if (field?.saveValue) return await field.saveValue(value);
            return {
              [field.key]: value,
            };
          }) ?? [],
        )),
      ),
      ...(this.props.getInput?.() ?? ({} as Omit<TEntityType, 'id'>)),
    };

    for (const field of this.props?.fields ?? []) {
      if (
        field.required &&
        (inputData[field.key] === null || inputData[field.key] === undefined || inputData[field.key] === '')
      ) {
        if (field.onlyOnCreate && this.state?.entityData?.id) {
          // Update
        } else {
          console.warn('handleSave: invalid field: ', field);
        }
      }
    }

    inputData.customMeta = Object.assign(
      {},
      inputData.customMeta,
      await getCustomMetaFor(this.props.entityType ?? this.props.entityCategory),
    );

    if (this.props.onSave) {
      inputData = await this.props.onSave(inputData);
      if (!inputData) {
        console.warn('No data was returned from `onSave` prop');
        return;
      }
    }

    return inputData;
  };

  private handleSave = async () => {
    if (!this.props.create) {
      console.error('this.props.create in not defined, you must provide "create" prop for entity to be saved');
      return;
    }
    if (!this.props.update) {
      console.error('this.props.update in not defined, you must provide "update" prop for entity to be saved');
      return;
    }

    this.setState({ canValidate: true });

    const entityId = this.props.params?.id;
    const inputData = await this.getInputData();
    if (!inputData) return;

    this.setState({ isSaving: true });

    if (entityId === 'new') {
      try {
        const newData = await this.props.create(inputData as TEntityInputType);
        toast.success(`Created ${(this.props.entityType ?? this.props.entityCategory).toLocaleLowerCase()}`);

        this.props.navigate(`${this.props.entityBaseRoute}/${newData.id}`, { replace: true });

        const updatedData = await this.getEntity(newData.id);
        this.setState({ entityData: updatedData });
      } catch (e) {
        toast.error(`Failed to create ${(this.props.entityType ?? this.props.entityCategory).toLocaleLowerCase()}`);
        console.error(e);
      }
    } else {
      if (!entityId) {
        toast.error('Failed to save: no entity id');
      } else {
        try {
          await this.props.update(parseInt(entityId), inputData as TEntityInputType);
          const updatedData = await this.getEntity(parseInt(entityId));
          this.setState({ entityData: updatedData });
          toast.success('Saved!');
        } catch (e) {
          toast.error('Failed to save');
          console.error(e);
        }
      }
    }
    this.setState({ isSaving: false, canValidate: false });
  };

  public goBack = () => {
    if (this.prevRoute) this.props.navigate(this.prevRoute);
    else if (this.props.entityListRoute) this.props.navigate(this.props.entityListRoute);
    else this.props.navigate(-1);
  };

  render() {
    const { entityData, notFound, isLoading } = this.state ?? {};

    if (notFound) {
      return (
        <div className={styles.EntityEdit}>
          <div className={styles.notFoundPage}>
            <p className={styles.notFoundText}>{this.props.entityType ?? this.props.entityCategory} not found</p>
          </div>
        </div>
      );
    }

    let frontendUrl;
    if (entityData) {
      const pageName = this.props.defaultPageName ?? this.props.entityType ?? this.props.entityCategory;
      if (getStoreItem('defaultPages')?.[pageName]) {
        frontendUrl =
          serviceLocator.getFrontendUrl() + resolvePageRoute(pageName, { slug: entityData.slug ?? entityData.id + '' });
      }
    }

    const elementProps: TFieldsComponentProps<TEntityType> = {
      ...(this.state ?? {}),
      refetchMeta: this.refetchMeta,
      onSave: this.handleSave,
      goBack: this.goBack,
      handleInputChange: this.handleInputChange,
      getInputData: this.getInputData,
      frontendUrl,
    };

    return (
      <EntityEditContextProvider value={{ pageProps: this.props, fieldProps: elementProps }}>
        <Box className={styles.EntityEdit}>
          <EntityHeader />
          {isLoading && (
            <Box className={clsx(styles.fields)}>
              {Array(8)
                .fill(1)
                .map((it, index) => (
                  <Skeleton style={{ marginBottom: '10px' }} key={index} height={'50px'} />
                ))}
            </Box>
          )}
          <EntityFields />
        </Box>
      </EntityEditContextProvider>
    );
  }
}

export default function ComponentWithRouterProp<
  TEntityType extends TBasePageEntity,
  TFilterType extends TBaseEntityFilter,
  TEntityInputType = TEntityType,
>(props: TEntityEditProps<TEntityType, TFilterType, TEntityInputType>) {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  return <EntityEdit {...props} location={location} navigate={navigate} params={params} />;
}
