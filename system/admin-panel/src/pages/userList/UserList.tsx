import { EDBEntity, TUser, TUserFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { userListPageInfo, userPageInfo } from '../../constants/PageInfos';
import { userRoles } from '../../constants/roles';
import { getTooltipValueView, getValueView } from '../../helpers/addressParser';
import { baseEntityColumns } from '../../helpers/customEntities';


const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TUser, TUserFilter>>;

export default function UserTable() {
    const client = getGraphQLClient();

    return (
        <EntityTableComp
            entityCategory={EDBEntity.User}
            entityListRoute={userListPageInfo.route}
            entityBaseRoute={userPageInfo.baseRoute}
            listLabel="Users"
            entityLabel="User"
            nameProperty="fullName"
            getManyFiltered={client.getFilteredUsers}
            deleteOne={client.deleteUser}
            deleteMany={client.deleteManyUsers}
            deleteManyFiltered={client.deleteManyFilteredUsers}
            columns={[
                {
                    name: 'avatar',
                    label: 'Avatar',
                    type: 'Image',
                    visible: true,
                    getValueView: (value) => (
                        <div style={{
                            height: '40px',
                            width: '40px',
                            borderRadius: '100%',
                            backgroundPosition: 'center',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${value})`,
                        }}></div>
                    )
                },
                {
                    name: 'fullName',
                    label: 'Name',
                    type: 'Simple text',
                    visible: true,
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'Simple text',
                    visible: true,
                },
                {
                    name: 'role',
                    label: 'Role',
                    type: 'Simple text',
                    exactSearch: true,
                    searchOptions: userRoles.map(role => ({
                        value: role,
                        label: role,
                    })),
                    visible: true,
                },
                ...baseEntityColumns.map(col => {
                    if (col.name === 'createDate') return { ...col, visible: true }
                    return { ...col, visible: false }
                }),
                {
                    name: 'phone',
                    label: 'Phone',
                    type: 'Simple text',
                    visible: false,
                },
                {
                    name: 'address',
                    label: 'Address',
                    type: 'Simple text',
                    visible: false,
                    getValueView: getValueView,
                    getTooltipValueView: getTooltipValueView,
                },
            ]}
        />
    )
}
