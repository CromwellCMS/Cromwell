import { EDBEntity, TRole, TUser, TUserFilter } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import React, { useEffect, useState } from 'react';

import EntityTable from '../../components/entity/entityTable/EntityTable';
import { TEntityPageProps } from '../../components/entity/types';
import { userListPageInfo, userPageInfo } from '../../constants/PageInfos';
import { getTooltipValueView, getValueView } from '../../helpers/addressParser';
import { baseEntityColumns } from '../../helpers/customEntities';

const ellipsisStyle: React.CSSProperties = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}
const EntityTableComp = EntityTable as React.ComponentType<TEntityPageProps<TUser, TUserFilter>>;

export default function UserTable() {
    const client = getGraphQLClient();
    const [roles, setRoles] = useState<TRole[]>([]);

    const init = async () => {
        try {
            const roles = await getGraphQLClient().getRoles({ pageSize: 10000 });
            setRoles(roles?.elements ?? []);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        init();
    }, []);

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
                    name: 'roles',
                    label: 'Role',
                    type: 'Simple text',
                    exactSearch: true,
                    customGraphQlFragment: 'roles {\n id\n name\n title\n }\n',
                    getValueView: (value: TRole[]) => <p style={ellipsisStyle}>{value?.map(r => r.title).join(', ')}</p>,
                    searchOptions: roles.map(role => ({
                        value: role.name,
                        label: role.title,
                    })),
                    applyFilter: (value: string, filter: any) => {
                        (filter as TUserFilter).roles = [value].filter(Boolean);
                        return filter;
                    },
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
