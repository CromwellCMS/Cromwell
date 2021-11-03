import { EDBEntity, getStoreItem, TCustomEntity, TCustomEntityFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityEdit from '../components/entity/entityEdit/EntityEdit';
import EntityTable from '../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../components/entity/types';
import { TPageInfo, TSidebarLinkType } from '../constants/PageInfos';

export type TAdminCustomEntity = {
    entityType: string;
    columns: TCustomEntityColumn[];
    listLabel: string;
    entityLabel?: string;
    route?: string;
    icon?: string
}

export type TCustomEntityColumn = {
    label: string;
    name: string;
    meta?: boolean;
    type?: 'text' | 'image' | 'currency';
    width?: number;
    minWidth?: number;
    maxWidth?: number;
}

const customEntities: Record<string, TAdminCustomEntity> = {};

export const registerCustomEntity = (options: TAdminCustomEntity) => {
    customEntities[options.entityType] = options;
    getStoreItem('forceUpdatePage')?.();
}

export const getCustomEntities = (): TAdminCustomEntity[] => {
    return Object.values(customEntities);
}

// PagesInfo for react-router
export const getCustomEntityPages = (): TPageInfo[] => {
    const pages: TPageInfo[] = [];

    Object.values(customEntities).forEach((entity) => {

        const entityListRoute = '/' + entity.entityType + '-list';
        const entityBaseRoute = '/' + entity.entityType

        const client = getGraphQLClient();
        const entityPageProps: TEntityPageProps<TCustomEntity, TCustomEntityFilter> = {
            entityCategory: EDBEntity.CustomEntity,
            entityBaseRoute,
            entityListRoute,
            entityType: entity.entityType,
            columns: entity.columns,
            listLabel: entity.listLabel,
            entityLabel: entity.entityLabel,
            renderFields: () => <></>,
            getInput: () => ({ entityType: entity.entityType }),
            getById: client.getCustomEntityById,
            deleteOne: client.deleteCustomEntity,
            deleteMany: client.deleteManyCustomEntities,
            deleteManyFiltered: client.deleteManyFilteredCustomEntities,
            getManyFiltered: client.getFilteredCustomEntities,
            update: client.updateCustomEntity,
            create: client.createCustomEntity,
        }

        const ListComp = () => {
            return (
                <EntityTable
                    {...entityPageProps}
                />
            )
        }
        pages.push({
            name: entity.entityType,
            route: entityListRoute,
            component: ListComp,
            roles: ['administrator', 'guest', 'author'],
        });

        const EntityComp = () => {
            return (
                <EntityEdit
                    {...entityPageProps}
                />
            )
        }
        pages.push({
            name: entity.entityType,
            route: entityBaseRoute + '/:id',
            component: EntityComp,
            roles: ['administrator', 'guest', 'author'],
        });
    });
    return pages;
}

// Links for sidebar
export const getCustomEntitySidebarLinks = (): TSidebarLinkType[] => {
    const links: TSidebarLinkType[] = [];

    Object.values(customEntities).forEach((entity) => {
        links.push({
            id: entity.entityType,
            title: entity.listLabel,
            route: '/' + entity.entityType + '-list',
            icon: entity.icon,
            roles: ['administrator', 'guest', 'author'],
        })
    });
    return links;
}
