import { gql } from '@apollo/client';
import { TPagedParams, TProductCategory, TProductCategoryInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, MenuItem, TextField } from '@material-ui/core';
import { HighlightOffOutlined, Wallpaper as WallpaperIcon } from '@material-ui/icons';
import Quill from 'quill';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Autocomplete from '../../components/autocomplete/Autocomplete';
import { getFileManager } from '../../components/fileManager/helpers';
import { toast } from '../../components/toast/toast';
import { categoryPageInfo } from '../../constants/PageInfos';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import styles from './CategoryPage.module.scss';

export default function CategoryPage() {
    const { id: categoryId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const forceUpdate = useForceUpdate();
    const history = useHistory();
    const categoryRef = useRef<TProductCategory | null>(null);
    let category: TProductCategory | undefined = categoryRef.current;
    const editorId = 'category-description-editor';
    const quillEditor = useRef<Quill | null>(null);
    const [parentCategory, setParentCategory] = useState<TProductCategory | null>(null);

    const urlParams = new URLSearchParams(window.location.search);
    const parentIdParam = urlParams.get('parentId');

    const setCategoryData = (data: TProductCategory) => {
        if (!categoryRef.current) {
            categoryRef.current = data;
            category = data;
        }
        else Object.keys(data).forEach(key => { categoryRef.current[key] = data[key] });
    }

    const getProductCategory = async (id: string) => {
        let categoryData: TProductCategory | undefined;
        try {
            categoryData = await client?.getProductCategoryById(id,
                gql`
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
                        descriptionDelta
                        children {
                            id
                            slug
                        }
                        parent {
                            id
                            slug
                        }
                    }`,
                'AdminPanelProductCategoryFragment'
            );

        } catch (e) { console.log(e) }

        return categoryData;
    }

    const getParentCategory = async (parentId) => {
        try {
            const parent = await client.getProductCategoryById(parentId);
            if (parent) {
                setParentCategory(parent);
                handleParentCategoryChange(parent);
            }
        } catch (e) {
            console.error(e)
        }
    }

    const init = async () => {
        if (categoryId && categoryId !== 'new') {
            const categoryData = await getProductCategory(categoryId);
            if (categoryData?.id) {
                setCategoryData(categoryData);
                forceUpdate();
            } else setNotFound(true);

            if (categoryData?.parent?.id) {
                getParentCategory(categoryData?.parent?.id);
            }

        } else if (categoryId === 'new') {
            setCategoryData({} as any);
            forceUpdate();
        }

        if (parentIdParam) {
            getParentCategory(parentIdParam);
        }

        let postContent;
        try {
            if (categoryRef.current?.descriptionDelta)
                postContent = JSON.parse(categoryRef.current.descriptionDelta);
        } catch (e) {
            console.error(e);
        }

        quillEditor.current = initQuillEditor(`#${editorId}`, postContent);
    }

    useEffect(() => {
        init();
    }, []);

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

    const handleSearchRequest = async (text: string, params: TPagedParams<TProductCategory>) => {
        return client?.getFilteredProductCategories({
            filterParams: {
                nameSearch: text
            },
            pagedParams: params
        });
    }

    const handleParentCategoryChange = (data: TProductCategory | null) => {
        const cat = Object.assign({}, category);
        cat.parent = data ?? undefined;
        setCategoryData(cat);
    }

    const getInput = (): TProductCategoryInput => ({
        slug: categoryRef.current.slug,
        pageTitle: categoryRef.current.pageTitle,
        pageDescription: categoryRef.current.pageDescription,
        name: categoryRef.current.name,
        mainImage: categoryRef.current.mainImage,
        isEnabled: categoryRef.current.isEnabled,
        description: getQuillHTML(quillEditor.current, `#${editorId}`),
        descriptionDelta: JSON.stringify(quillEditor.current.getContents()),
        parentId: categoryRef.current.parent?.id,
        childIds: categoryRef.current.children?.map(child => child.id),
    });

    const handleSave = async () => {
        const inputData: TProductCategoryInput = getInput();

        if (categoryId === 'new') {
            try {
                const newData = await client?.createProductCategory(inputData);
                toast.success('Created category!');
                history.push(`${categoryPageInfo.baseRoute}/${newData.id}`)

                const categoryData = await getProductCategory(newData.id);
                if (categoryData?.id) {
                    setCategoryData(categoryData);
                    forceUpdate();
                }

            } catch (e) {
                toast.error('Falied to create category');
                console.error(e)
            }

        } else if (category?.id) {
            try {
                await client?.updateProductCategory(category.id, inputData);
                const categoryData = await getProductCategory(category.id);
                if (categoryData?.id) {
                    setCategoryData(categoryData);
                    forceUpdate();
                }
                toast.success('Saved!');
            } catch (e) {
                toast.error('Falied to save');
                console.error(e)
            }
        }

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
            <div className={styles.header}>
                <div></div>
                <div className={styles.headerActions}>
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        onClick={handleSave}>
                        Save</Button>
                </div>
            </div>
            <div className={styles.fields}>
                <TextField label="Name"
                    value={category?.name || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('name', e.target.value) }}
                />
                <Autocomplete<TProductCategory>
                    loader={handleSearchRequest}
                    onSelect={handleParentCategoryChange}
                    getOptionLabel={(data) => `${data.name} (id: ${data.id};${data?.parent?.id ? ` parent id: ${data.parent.id};` : ''})`}
                    getOptionValue={(data) => data.name}
                    fullWidth
                    className={styles.textField}
                    defaultValue={parentCategory}
                    label={"Parent category"}
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
