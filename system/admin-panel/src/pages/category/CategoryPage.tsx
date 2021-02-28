import { gql } from '@apollo/client';
import { TProductCategory } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { IconButton, MenuItem, TextField } from '@material-ui/core';
import { HighlightOffOutlined, Wallpaper as WallpaperIcon } from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { getFileManager } from '../../components/fileManager/helpers';
import { initQuillEditor } from '../../helpers/quill';
import styles from './CategoryPage.module.scss';


export default function CategoryPage() {
    const { id: categoryId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const forceUpdate = useForceUpdate();
    const history = useHistory();
    const categoryRef = useRef<TProductCategory | null>(null);
    const category: TProductCategory | undefined = categoryRef.current;
    const editorId = 'category-description-editor';
    const quillEditor = useRef<Quill | null>(null);

    const setCategoryData = (data: TProductCategory) => {
        categoryRef.current = data;
    }

    const getProductCategoryById = async () => {
        if (categoryId && categoryId !== 'new') {

            let category: TProductCategory | undefined;
            try {
                category = await client?.getProductCategoryById(categoryId, gql`
                    fragment AdminPanelProductCategoryFragment on ProductCategory {
                        id
                        slug
                        createDate
                        updateDate
                        isEnabled
                        pageTitle
                        name
                        mainImage
                        description
                        children {
                            id
                            slug
                        }
                        parent {
                            id
                            slug
                        }
                    }`, 'AdminPanelProductCategoryFragment'
                );

            } catch (e) { console.log(e) }

            if (category?.id) {
                setCategoryData(category);
                forceUpdate();
            }
            else setNotFound(true);


        } else if (categoryId === 'new') {
            setCategoryData({} as any);
            forceUpdate();
        }

    }

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await getProductCategoryById();
        quillEditor.current = initQuillEditor(`#${editorId}`, categoryRef.current.descriptionDelta);
    }

    const handleInputChange = (prop: keyof TProductCategory, val: any) => {
        if (category) {
            const cat = Object.assign({}, category);
            (cat[prop] as any) = val;
            setCategoryData(cat);
            forceUpdate();
        }
    }

    const handleChangeImage = async () => {
        const photoPath = await getFileManager()?.getPhoto();
        if (photoPath) {
            const cat = Object.assign({}, category);
            cat.mainImage = photoPath;
            setCategoryData(cat);
            forceUpdate();
        }
    }

    const handleClearImage = async () => {
        const cat = Object.assign({}, category);
        cat.mainImage = undefined;
        setCategoryData(cat);
        forceUpdate();
    }

    if (notFound) {
        return (
            <div className={styles.CategoryPage}>
                <div className={styles.notFoundPage}>
                    <p className={styles.notFoundText}>Category not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.CategoryPage}>
            <div className={styles.fields}>
                <TextField label="Name"
                    value={category?.name || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('name', e.target.value) }}
                />
                <div className={styles.imageBox}
                    onClick={handleChangeImage}
                >
                    <MenuItem style={{ padding: '0', borderRadius: '7px' }}>
                        {category?.mainImage ? (
                            <div
                                style={{ backgroundImage: `url(${category?.mainImage})` }}
                                className={styles.mainImage}></div>
                        ) : (
                                <WallpaperIcon
                                    style={{ opacity: '0.7' }}
                                />
                            )}
                    </MenuItem>
                    <p style={{ margin: '10px' }}>{category?.mainImage ?? <span style={{ opacity: '0.7' }}>No image</span>}</p>
                    {category?.mainImage && (
                        <IconButton onClick={(e) => { e.stopPropagation(); handleClearImage(); }}>
                            <HighlightOffOutlined />
                        </IconButton>
                    )}
                </div>
                <div className={styles.descriptionEditor}>
                    <div style={{ height: '300px' }} id={editorId}></div>
                </div>
                <TextField label="Page slug (SEO URL)"
                    value={category?.slug || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('slug', e.target.value) }}
                />
                <TextField label="Meta title (SEO)"
                    value={category?.pageTitle || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('pageTitle', e.target.value) }}
                />
                <TextField label="Meta description (SEO)"
                    value={category?.pageDescription || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('pageDescription', e.target.value) }}
                />
            </div>
        </div>
    );
}

function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue(value => ++value);
}
