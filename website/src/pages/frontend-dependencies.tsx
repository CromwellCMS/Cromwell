import { getCentralServerClient } from '@cromwell/core-frontend';
import { Collapse, IconButton, TextField } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import Layout from '@theme/Layout';
import React, { useEffect, useState } from 'react';

import styles from './frontend-dependencies.module.css';


export default function FrontendDependencies() {
    const client = getCentralServerClient();

    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [dependencies, setDependencies] = useState<{
        name: string;
        version: string;
    }[]>([]);

    useEffect(() => {
        (async () => {
            const deps = await client.getFrontendDependenciesList();
            setDependencies(Object.keys(deps?.latestVersions ?? {}).map(pckg => ({
                name: pckg,
                version: (deps?.latestVersions ?? {})[pckg],
            })))
        })();
    }, []);


    const getDepName = (option) => `${option.name}: "${option.version}"`;

    return (
        <Layout
            title='Hello from'
            description=""
        >
            <div className={styles.content}>
                <h1 className={styles.title}>Latest Frontend dependencies</h1>
                <Autocomplete
                    id="cms-versions"
                    options={dependencies}
                    getOptionLabel={getDepName}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Search..." variant="outlined" />}
                />
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
