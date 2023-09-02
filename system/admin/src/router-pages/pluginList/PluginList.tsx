import { IconButton } from '@components/buttons/IconButton';
import EntityTable from '@components/entity/entityTable/EntityTable';
import { TBaseEntityFilter } from '@components/entity/types';
import { askConfirmation } from '@components/modal';
import { toast } from '@components/toast';
import { pluginPageInfo } from '@constants/PageInfos';
import { EDBEntity, TPackageCromwellConfig, TPluginEntity } from '@cromwell/core';
import { getGraphQLClient, getRestApiClient } from '@cromwell/core-frontend';
import { CogIcon, FolderPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { Box, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type TPlugin = {
  id: number;
  package: TPackageCromwellConfig;
  entity?: TPluginEntity;
};

export default function PluginList() {
  const graphQLClient = getGraphQLClient();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const pluginsResolver = React.useRef<(plugins: TPlugin[]) => any>();
  const pluginsPromise = React.useRef<Promise<TPlugin[]>>(
    new Promise((done) => {
      pluginsResolver.current = done;
    }),
  );

  const getPlugins = async (): Promise<TPlugin[] | undefined> => {
    try {
      const [pluginPackages, pluginEntities] = await Promise.all([
        // Read node_modules and get packages
        getRestApiClient().getPluginList(),
        // Get info from DB
        graphQLClient.getAllEntities('Plugin', graphQLClient.PluginFragment, 'PluginFragment'),
      ]);

      return pluginPackages
        ?.map((pckg) => {
          const pluginEntity = (pluginEntities as TPluginEntity[])?.find((ent) => ent.name === pckg.name);

          return {
            id: `?pluginName=${pckg.name}` as any, // for router
            package: pckg,
            entity: pluginEntity,
          };
        })
        .sort((a, b) => {
          if (!a.entity?.createDate || !b.entity?.createDate) return 0;
          return new Date(b.entity.createDate).getTime() - new Date(a.entity.createDate).getTime();
        });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getPlugins()
      .then(pluginsResolver.current)
      .catch((error) => {
        console.error(error);
        pluginsResolver.current?.([]);
      });
  }, []);

  const reloadPlugins = () => {
    pluginsPromise.current = new Promise((done) => {
      getPlugins()
        .then((plugins) => done(plugins ?? []))
        .catch((error) => {
          console.error(error);
          done([]);
        });
    });
    return pluginsPromise.current;
  };

  const handleActivatePlugin = async (pluginName?: string) => {
    if (isPageLoading) return;
    setIsPageLoading(true);
    let success = false;
    try {
      success = await getRestApiClient()?.activatePlugin(pluginName!);
      await this.getPluginList();
    } catch (e) {
      console.error(e);
    }
    await reloadPlugins();
    setIsPageLoading(false);

    if (success) {
      toast.success('Plugin installed');
    } else {
      toast.error('Failed to install plugin');
    }
  };

  const handleDeletePlugin = (info: TPackageCromwellConfig) => async () => {
    const positive = await askConfirmation({
      title: `Delete plugin ${info.title ?? info.name}?`,
    });
    if (!positive) return;

    const pluginName = info.name;
    setIsPageLoading(true);

    try {
      await getRestApiClient().deletePlugin(pluginName!);

      toast.info('Plugin deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete plugin');
    }

    await reloadPlugins();
    setIsPageLoading(false);
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      {isPageLoading && (
        <div className="flex flex-row h-full w-full top-0 left-0 z-30 absolute backdrop-filter backdrop-blur-md items-center">
          <ArrowPathIcon className="bg-white rounded-full mx-auto h-16 p-2 animate-spin fill-indigo-600 w-16 self-center" />
        </div>
      )}
      {!isPageLoading && (
        <EntityTable<TPlugin, TBaseEntityFilter>
          entityCategory={EDBEntity.Plugin}
          listLabel="Plugins"
          entityLabel="Plugin"
          hideDelete
          getMany={async () => {
            const plugins = await pluginsPromise.current;
            return {
              pagedMeta: {
                pageNumber: 1,
                pageSize: plugins.length,
                totalPages: 1,
                totalElements: plugins.length,
              },
              elements: plugins,
            };
          }}
          columns={[
            {
              name: 'Icon',
              label: 'Icon',
              type: 'Image',
              visible: true,
              disableSearch: true,
              disableSort: true,
              disableTooltip: true,
              getValueView: (value: string, plugin: TPlugin) => {
                const pluginIcon = plugin?.package?.icon;
                return (
                  <Box
                    sx={{
                      maxWidth: '42px',
                      minWidth: '42px',
                      width: '100%',
                      height: '50px',
                      padding: '8px 0',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        borderRadius: '10px',
                      }}
                      style={{
                        borderRadius: '0px',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundImage: pluginIcon ? `url("data:image/png;base64,${pluginIcon}")` : '',
                      }}
                    ></Box>
                  </Box>
                );
              },
            },
            {
              name: 'title',
              label: 'Title',
              type: 'Simple text',
              visible: true,
              disableSearch: true,
              disableSort: true,
              getValueView: (value: string, plugin: TPlugin) => {
                return plugin?.package?.title;
              },
              getTooltipValueView: (value: string, plugin: TPlugin) => {
                return plugin?.package?.title;
              },
            },
            {
              name: 'package',
              label: 'Package',
              type: 'Simple text',
              visible: true,
              disableSearch: true,
              disableSort: true,
              getValueView: (value: string, plugin: TPlugin) => {
                return plugin?.package?.name;
              },
              getTooltipValueView: (value: string, plugin: TPlugin) => {
                return plugin?.package?.name;
              },
            },
            {
              name: 'version',
              label: 'Version',
              type: 'Simple text',
              visible: true,
              disableSearch: true,
              disableSort: true,
              disableTooltip: true,
              getValueView: (value: string, plugin: TPlugin) => {
                return (
                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: '#666',
                    }}
                  >
                    {plugin?.package?.version}
                  </Typography>
                );
              },
            },
          ]}
          customElements={{
            getItemCustomActions: ({ data }) => {
              if (data.entity?.isUpdating) {
                return (
                  <div className="flex flex-row h-full w-full top-0 left-0 z-30 absolute backdrop-filter backdrop-blur-md items-center">
                    <ArrowPathIcon className="bg-white rounded-full mx-auto h-10 p-2 animate-spin fill-indigo-600 w-10 self-center" />
                  </div>
                );
              }
              return (
                <Box sx={{ display: 'flex' }}>
                  {!data.entity?.isInstalled && (
                    <Tooltip title="Install plugin">
                      <IconButton onClick={() => handleActivatePlugin(data.package?.name)}>
                        <FolderPlusIcon className="h-4 w-4 text-gray-300" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {data.entity?.isInstalled && data.entity?.hasAdminBundle && (
                    <Link to={`${pluginPageInfo.route}?pluginName=${data.package?.name}`}>
                      <IconButton className="ml-0">
                        <CogIcon className="h-4 w-4 text-gray-300" />
                      </IconButton>
                    </Link>
                  )}
                  <IconButton onClick={handleDeletePlugin(data.package)} className="ml-0">
                    <TrashIcon aria-label="delete" className="h-4 text-gray-300 w-4" />
                  </IconButton>
                </Box>
              );
            },
          }}
        />
      )}
    </Box>
  );
}
