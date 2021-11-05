import { TDBEntity } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Button, Checkbox, FormControlLabel, Grid } from '@mui/material';
import React, { useState } from 'react';

import { LoadingStatus } from '../../../components/loadBox/LoadingStatus';
import { toast } from '../../../components/toast/toast';
import styles from '../Settings.module.scss';

export default function Migration() {
    const [isExporting, setIsExporting] = useState(false);
    const [exportOptions, setExportOptions] = useState<{
        key: TDBEntity; title: string; checked: boolean;
    }[]>([
        { key: 'Product', title: 'Products', checked: true, },
        { key: 'ProductCategory', title: 'Categories', checked: true, },
        { key: 'ProductReview', title: 'Reviews', checked: true, },
        { key: 'Attribute', title: 'Attributes', checked: true, },
        { key: 'Post', title: 'Posts', checked: true, },
        { key: 'Tag', title: 'Tags', checked: true, },
        { key: 'Order', title: 'Orders', checked: true, },
        { key: 'User', title: 'Users', checked: true, },
        { key: 'Plugin', title: 'Plugins', checked: false, },
        { key: 'Theme', title: 'Themes', checked: false, },
        { key: 'CMS', title: 'CMS settings', checked: false, },
    ]);

    const toggleExportOption = (key: string) => {
        setExportOptions(exportOptions.map(option => {
            if (option.key === key) {
                return {
                    ...option,
                    checked: !option.checked,
                }
            }
            return option;
        }))
    }

    const importDB = async () => {
        const input = document.createElement('input');
        input.style.display = 'none';
        input.multiple = true;
        input.type = 'file';
        input.accept = '.xlsx';
        document.body.appendChild(input);

        input.addEventListener("change", async (e: any) => {
            // Get the selected file from the input element
            const files = e.target?.files;
            if (!files) return;

            setIsExporting(true);

            try {
                await getRestApiClient()?.importDB(files);
                toast.success?.('Successfully imported');
            } catch (e) {
                console.error(e);
            }
            input.remove();
            setIsExporting(false);
        });

        input.click();
    }

    const exportDB = async () => {
        setIsExporting(true);
        try {
            await getRestApiClient().exportDB(
                exportOptions.filter(opt => opt.checked).map(opt => opt.key)
            );
        } catch (e) {
            console.error(e)
        }
        setIsExporting(false);
    }


    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <p>Pick tables to export:</p>
                <div className={styles.exportOptions}>
                    {exportOptions.map(option => (
                        <FormControlLabel
                            key={option.key}
                            control={
                                <Checkbox
                                    checked={option.checked}
                                    onChange={() => toggleExportOption(option.key)}
                                    name={option.title}
                                    color="primary"
                                />
                            }
                            label={option.title}
                        />
                    ))}
                </div>
                <Button
                    disabled={isExporting}
                    color="primary"
                    variant="contained"
                    size="small"
                    className={styles.exportBtn}
                    onClick={exportDB}
                >Export to Excel</Button>
                <p style={{ marginTop: '20px' }}>Import from Excel file(s):</p>
                <Button
                    disabled={isExporting}
                    color="primary"
                    variant="contained"
                    className={styles.exportBtn}
                    size="small"
                    onClick={importDB}
                >Import from Excel</Button>
            </Grid>
            <LoadingStatus isActive={isExporting} />
        </Grid>
    )
}
