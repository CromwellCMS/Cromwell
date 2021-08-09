import { getCentralServerClient } from '@cromwell/core-frontend';
import { Collapse, IconButton, TextField } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import Layout from '@theme/Layout';
import React, { useEffect, useState } from 'react';
import compareVersions from 'compare-versions';

import styles from './latest-frontend-dependencies.module.css';


export default function FrontendDependencies() {
    const client = getCentralServerClient();

    const [expanded, setExpanded] = React.useState(false);
    const [cmsVersions, setCmsVersions] = React.useState<string[]>([]);
    const [pickedVersion, setPickedVersion] = React.useState<string | undefined>();
    const [dependencies, setDependencies] = useState<{
        name: string;
        version: string;
    }[]>([]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        (async () => {
            const versions = (await client.getFrontendDependenciesBindings())
                .filter(compareVersions.validate)
                .sort(compareVersions).reverse();

            setCmsVersions(versions);
            const latest = versions[0];
            setPickedVersion(latest);

            await getDependencies(latest);
        })();
    }, []);


    const getDependencies = async (version: string) => {
        const deps = await client.getFrontendDependenciesList(version);
        setDependencies(Object.keys(deps?.latestVersions ?? {}).map(pckg => ({
            name: pckg,
            version: (deps?.latestVersions ?? {})[pckg],
        })))
    }

    const getDepName = (option) => `${option.name}: "${option.version}"`;

    const changeCmsVersion = async (version: string) => {
        setPickedVersion(version);
        setDependencies([]);
        await getDependencies(version);
    }

    return (
        <Layout
            title='Hello from'
            description=""
        >
            <div className={styles.content}>
                <h1 className={styles.title}>Latest Frontend dependencies</h1>
                <div className={styles.searchBox} >
                    <Autocomplete
                        id="cms-versions"
                        options={cmsVersions ?? ['']}
                        value={pickedVersion ?? ''}
                        onChange={(event, value) => changeCmsVersion(value)}
                        getOptionLabel={ver => ver}
                        style={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Pick CMS version"
                                variant="outlined"
                            />}
                    />
                </div>
                <div className={styles.searchBox}>
                    <Autocomplete
                        id="dependencies-versions"
                        options={dependencies}
                        getOptionLabel={getDepName}
                        style={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Search dependencies..."
                                variant="outlined"
                            />}
                    />
                </div>
                <div className={styles.listHeader} onClick={handleExpandClick}>
                    <h3 className={styles.expandTitle}>Expand all</h3>
                    <IconButton >
                        <ExpandMoreIcon
                            style={{ transform: expanded ? 'rotate(180deg)' : '' }}
                        />
                    </IconButton>
                </div>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    {dependencies.map(dep => {
                        return (
                            <div key={dep.name}>{getDepName(dep)}</div>
                        )
                    })}
                </Collapse>

            </div>
        </Layout>
    )
}
