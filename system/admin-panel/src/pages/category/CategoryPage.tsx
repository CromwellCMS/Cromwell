import { gql } from '@apollo/client';
import { resolvePageRoute, serviceLocator, TPagedParams, TProductCategory, TProductCategoryInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, TextField, Tooltip } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import Autocomplete from '../../components/autocomplete/Autocomplete';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { categoryListPageInfo, categoryPageInfo } from '../../constants/PageInfos';
import { getEditorData, getEditorHtml, initTextEditor } from '../../helpers/editor/editor';
import commonStyles from '../../styles/common.module.scss';
import styles from './CategoryPage.module.scss';

export default function CategoryPage(props) {
    const { id: categoryId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const history = useHistory();
    const [category, setCategoryData] = useState<TProductCategory | undefined | null>(null);
    const editorId = 'category-description-editor';
    const [parentCategory, setParentCategory] = useState<TProductCategory | null>(null);

    const urlParams = new URLSearchParams(props?.location?.search);
    const parentIdParam = urlParams.get('parentId');

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
                        pageDescription
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

        } catch (e) { console.error(e) }

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
        let categoryData;
        if (categoryId && categoryId !== 'new') {
            try {
                categoryData = await getProductCategory(categoryId);
            } catch (e) {
                console.error(e);
            }
            if (categoryData?.id) {
                setCategoryData(categoryData);
            } else setNotFound(true);

            if (categoryData?.parent?.id) {
                getParentCategory(categoryData?.parent?.id);
            }

        } else if (categoryId === 'new') {
            setCategoryData({} as any);
        }

        if (parentIdParam) {
            getParentCategory(parentIdParam);
        }

        let postContent;
        try {
            if (categoryData?.descriptionDelta)
                postContent = JSON.parse(categoryData.descriptionDelta);
        } catch (e) {
            console.error(e);
        }

        await initTextEditor({
            htmlId: editorId,
            data: postContent,
            placeholder: 'Category description...',
        });
    }

    useEffect(() => {
        init();
    }, []);

    const handleInputChange = (prop: keyof TProductCategory, val: any) => {
        if (category) {
            setCategoryData(prevCat => {
                const cat = Object.assign({}, prevCat);
                (cat[prop] as any) = val;
                return cat;
            });
        }
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
        if (data && category && data.id === category.id) return;

        setCategoryData(prevCat => {
            const cat = Object.assign({}, prevCat);
            cat.parent = data ?? undefined;
            return cat;
        });
    }

    const getInput = async (): Promise<TProductCategoryInput> => ({
        slug: category.slug,
        pageTitle: category.pageTitle,
        pageDescription: category.pageDescription,
        name: category.name,
        mainImage: category.mainImage,
        isEnabled: category.isEnabled,
        description: await getEditorHtml(editorId),
        descriptionDelta: JSON.stringify(await getEditorData(editorId)),
        parentId: category.parent?.id,
    });

    const handleSave = async () => {
        setIsSaving(true);
        const inputData: TProductCategoryInput = await getInput();

        if (categoryId === 'new') {
            try {
                const newData = await client?.createProductCategory(inputData);
                toast.success('Created category!');
                history.push(`${categoryPageInfo.baseRoute}/${newData.id}`)

                const categoryData = await getProductCategory(newData.id);
                if (categoryData?.id) {
                    setCategoryData(categoryData);
                }

            } catch (e) {
                toast.error('Failed to create category');
                console.error(e)
            }

        } else if (category?.id) {
            try {
                await client?.updateProductCategory(category.id, inputData);
                const categoryData = await getProductCategory(category.id);
                if (categoryData?.id) {
                    setCategoryData(categoryData);
                }
                toast.success('Saved!');
            } catch (e) {
                toast.error('Failed to save');
                console.error(e)
            }
        }
        setIsSaving(false);
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

    let pageFullUrl;
    if (category) {
        pageFullUrl = serviceLocator.getFrontendUrl() + resolvePageRoute('category', { slug: category.slug ?? category.id });
    }

    return (
        <div className={styles.CategoryPage}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link to={categoryListPageInfo.route}>
                        <IconButton
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <p className={commonStyles.pageTitle}>category</p>
                </div>
                <div className={styles.headerActions}>
                    {pageFullUrl && (
                        <Tooltip title="Open category page in new tab">
                            <IconButton
                                style={{ marginRight: '10px' }}
                                className={styles.openPageBtn}
                                aria-label="open"
                                onClick={() => { window.open(pageFullUrl, '_blank'); }}
                            >
                                <OpenInNewIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Button variant="contained" color="primary"
                        className={styles.saveBtn}
                        size="small"
                        disabled={isSaving}
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
                    getOptionLabel={(data) => `${data.name} (id: ${data.id}${data?.parent?.id ? `; parent id: ${data.parent.id}` : ''})`}
                    getOptionValue={(data) => data.name}
                    fullWidth
                    className={styles.textField}
                    defaultValue={parentCategory}
                    label={"Parent category"}
                />
                <ImagePicker
                    placeholder="No image"
                    onChange={(val) => {
                        handleInputChange('mainImage', val)
                    }}
                    value={category?.mainImage}
                    className={styles.imageBox}
                    showRemove
                />
                <div className={styles.descriptionEditor}>
                    <div id={editorId}></div>
                </div>
                <TextField label="Page URL"
                    value={category?.slug || ''}
                    fullWidth
                    className={styles.textField}
                    helperText={pageFullUrl}
                    onChange={(e) => { handleInputChange('slug', e.target.value) }}
                />
                <TextField label="Meta title"
                    value={category?.pageTitle || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('pageTitle', e.target.value) }}
                />
                <TextField label="Meta description"
                    value={category?.pageDescription || ''}
                    fullWidth
                    className={styles.textField}
                    onChange={(e) => { handleInputChange('pageDescription', e.target.value) }}
                />
            </div>
        </div>
    );
}
