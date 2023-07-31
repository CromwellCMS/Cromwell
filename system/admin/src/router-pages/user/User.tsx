import { EDBEntity, TRole, TUser, TUserFilter, TUpdateUser } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import EntityEdit from '../../components/entity/entityEdit/EntityEdit';
import { userListPageInfo, userPageInfo } from '../../constants/PageInfos';
import { parseAddress } from '../../helpers/addressParser';

export default function UserPage() {
  const client = getGraphQLClient();
  const [roles, setRoles] = useState<TRole[]>([]);

  const init = async () => {
    try {
      const roles = await getGraphQLClient().getRoles({ pagedParams: { pageSize: 1000 } });
      setRoles(roles?.elements ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <EntityEdit<TUser, TUserFilter, TUpdateUser>
      entityCategory={EDBEntity.User}
      entityListRoute={userListPageInfo.route}
      entityBaseRoute={userPageInfo.baseRoute}
      listLabel="Users"
      entityLabel="User"
      getById={client.getUserById}
      update={client.updateUser}
      create={client.createUser}
      deleteOne={client.deleteUser}
      fields={[
        {
          key: 'fullName',
          type: 'Simple text',
          label: 'Full name',
          required: true,
          width: { sm: 6 },
        },
        {
          key: 'avatar',
          type: 'Image',
          label: 'Avatar',
          width: { sm: 6 },
        },
        {
          key: 'email',
          type: 'Simple text',
          label: 'Email',
          required: true,
          width: { sm: 6 },
        },
        {
          key: 'password',
          type: 'Simple text',
          label: 'Password',
          simpleTextType: 'password',
          required: true,
          onlyOnCreate: true,
          width: { sm: 6 },
        },
        {
          key: 'roles',
          type: 'Select',
          label: 'Role',
          required: true,
          customGraphQlFragment: `roles {
              name
              permissions
              title
          }`,
          options: roles.map((role) => ({ label: role.title ?? role.name, value: role.name })),
          saveValue: (name) => ({
            roles: name && [name],
          }),
          getInitialValue: (roles: TRole[]) => roles?.[0]?.name,
          width: { sm: 6 },
        },
        {
          key: 'bio',
          type: 'Simple text',
          label: 'Bio',
          simpleTextType: 'textarea',
        },
        {
          key: 'address',
          type: 'Simple text',
          label: 'Address',
          component: ({ value, onChange }) => {
            // Support old and new address format
            const { addressString, addressJson } = parseAddress(value);

            if (addressJson)
              return (
                <>
                  {Object.entries<any>(addressJson).map(([fieldKey, value]) => {
                    return (
                      <Grid item xs={12} sm={6} key={fieldKey}>
                        <TextField
                          label={fieldKey}
                          value={value || ''}
                          fullWidth
                          variant="standard"
                          style={{ margin: '10px 0' }}
                          onChange={(e) => {
                            const newVal = e.target.value;
                            onChange(
                              JSON.stringify({
                                ...addressJson,
                                [fieldKey]: newVal,
                              }),
                            );
                          }}
                        />
                      </Grid>
                    );
                  })}
                </>
              );

            return (
              <TextField
                label="Address"
                value={addressString || ''}
                fullWidth
                variant="standard"
                style={{ margin: '10px 0' }}
                onChange={(e) => {
                  onChange(e.target.value);
                }}
              />
            );
          },
        },
        {
          key: 'phone',
          type: 'Simple text',
          label: 'Phone',
          width: { sm: 6 },
        },
      ]}
    />
  );
}
