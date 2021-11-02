import { EDBEntity, getStoreItem } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../components/entity/entityTable/EntityTable';
import { PageInfo, SidebarLinkType } from '../constants/PageInfos';

export type TAdminCustomEntity = {
    key: string;
    columns: TCustomEntityColumn[];
    listLabel: string;
    entityLabel?: string;
    route?: string;
    icon?: string
}

export type TCustomEntityColumn = {
    label: string;
    property: string;
    meta?: boolean;
    type?: 'text' | 'image' | 'currency';
    width?: number;
    minWidth?: number;
    maxWidth?: number;
}

const customEntities: Record<string, TAdminCustomEntity> = {};

export const registerCustomEntity = (options: TAdminCustomEntity) => {
    customEntities[options.key] = options;
    getStoreItem('forceUpdatePage')?.();
}

export const getCustomEntityPages = (): PageInfo[] => {
    const pages: PageInfo[] = [];

    Object.values(customEntities).forEach((entity) => {
        const ListComp = () => {
            const client = getGraphQLClient();
            return (
                <EntityTable
                    entityCategory={EDBEntity.CustomEntity}
                    entityType={entity.key}
                    columns={entity.columns}
                    listLabel={entity.listLabel}
                    entityLabel={entity.entityLabel}
                    deleteOne={client.deleteCustomEntity}
                    deleteMany={client.deleteManyCustomEntities}
                    deleteManyFiltered={client.deleteManyFilteredCustomEntities}
                    getManyFiltered={client.getFilteredCustomEntities}
                />
            )
        }
        pages.push({
            name: entity.key,
            route: '/' + entity.key + '-list',
            component: ListComp,
            roles: ['administrator', 'guest', 'author'],
        })
    });
    return pages;
}

export const getCustomEntitySidebarLinks = (): SidebarLinkType[] => {
    const links: SidebarLinkType[] = [];

    Object.values(customEntities).forEach((entity) => {
        links.push({
            id: entity.key,
            title: entity.listLabel,
            route: '/' + entity.key + '-list',
            icon: entity.icon,
            roles: ['administrator', 'guest', 'author'],
        })
    });
    return links;
}

// registerCustomEntity({
//     key: 'custom-1',
//     listLabel: 'Custom Tests',
//     entityLabel: 'Test',
//     columns: [{
//         property: 'id',
//         label: 'id',
//     }],
// })