import Link from '@docusaurus/Link';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Autocomplete, CircularProgress, Collapse, IconButton, TextField } from '@mui/material';
import Layout from '@theme/Layout';
import compareVersions from 'compare-versions';
import React, { useEffect, useState } from 'react';

import { apiClient } from '../helpers/api-client';
import styles from './latest-frontend-dependencies.module.css';

export default function FrontendDependencies() {
  const [expanded, setExpanded] = React.useState(false);
  const [versionsLoading, setVersionsLoading] = React.useState(false);
  const [cmsVersions, setCmsVersions] = React.useState<string[]>([]);
  const [pickedVersion, setPickedVersion] = React.useState<string | undefined>();
  const [dependencies, setDependencies] = useState<
    {
      name: string;
      version: string;
    }[]
  >([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    (async () => {
      setVersionsLoading(true);
      const versions = (await apiClient.getFrontendDependenciesBindings())
        .filter(compareVersions.validate)
        .sort(compareVersions)
        .reverse();

      setCmsVersions(versions);
      const latest = versions[0];
      setPickedVersion(latest);

      await getDependencies(latest);
    })();
  }, []);

  const getDependencies = async (version: string) => {
    setVersionsLoading(true);
    const deps = await apiClient.getFrontendDependenciesList(version);
    setDependencies(
      Object.keys(deps?.latestVersions ?? {}).map((pckg) => ({
        name: pckg,
        version: (deps?.latestVersions ?? {})[pckg],
      })),
    );
    setVersionsLoading(false);
  };

  const getDepName = (option) => `${option.name}: "${option.version}"`;

  const changeCmsVersion = async (version: string) => {
    setPickedVersion(version);
    setDependencies([]);
    await getDependencies(version);
  };

  return (
    <Layout title="Hello from" description="">
      <div className={styles.content}>
        <h1 className={styles.title}>Latest Frontend dependencies</h1>
        <Link style={{ marginBottom: '25px' }} href="/docs/development/frontend-dependencies">
          Documentation
        </Link>
        <div className={styles.searchBox}>
          <Autocomplete
            id="cms-versions"
            options={cmsVersions ?? ['']}
            value={pickedVersion ?? ''}
            onChange={(event, value) => changeCmsVersion(value)}
            getOptionLabel={(ver) => ver}
            style={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Pick CMS version" variant="outlined" />}
          />
        </div>
        <div className={styles.searchBox}>
          {versionsLoading ? (
            <CircularProgress />
          ) : (
            <Autocomplete
              id="dependencies-versions"
              options={dependencies}
              getOptionLabel={getDepName}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Search dependencies..." variant="outlined" />}
            />
          )}
        </div>
        <div className={styles.listHeader} onClick={handleExpandClick}>
          <h3 className={styles.expandTitle}>Expand all</h3>
          <IconButton>
            <ExpandMoreIcon style={{ transform: expanded ? 'rotate(180deg)' : '' }} />
          </IconButton>
        </div>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {dependencies.map((dep) => {
            return <div key={dep.name}>{getDepName(dep)}</div>;
          })}
        </Collapse>
      </div>
    </Layout>
  );
}
