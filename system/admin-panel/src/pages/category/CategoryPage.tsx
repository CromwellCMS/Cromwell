import { gql } from '@apollo/client';
import { serviceLocator, TPagedParams, TProductCategory, TProductCategoryInput } from '@cromwell/core';
import { getGraphQLClient } from '@cromwell/core-frontend';
import { Button, IconButton, TextField, Tooltip } from '@material-ui/core';
import { ArrowBack as ArrowBackIcon, OpenInNew as OpenInNewIcon } from '@material-ui/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import Autocomplete from '../../components/autocomplete/Autocomplete';
import ImagePicker from '../../components/imagePicker/ImagePicker';
import { toast } from '../../components/toast/toast';
import { categoryListPageInfo, categoryPageInfo } from '../../constants/PageInfos';
import { getQuillHTML, initQuillEditor } from '../../helpers/quill';
import { Quill as QuillType } from 'quill';
import { store } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './CategoryPage.module.scss';

export default function CategoryPage(props) {
    const { id: categoryId } = useParams<{ id: string }>();
    const client = getGraphQLClient();
    const [notFound, setNotFound] = useState(false);
    const history = useHistory();
    const [category, setCategoryData] = useState<TProductCategory | undefined | null>(null);
    const editorId = 'category-description-editor';
    const quillEditor = useRef<QuillType | null>(null);
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

        const Quill: any = await import('quill');
        quillEditor.current = initQuillEditor(Quill?.default, `#${editorId}`, postContent);
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

    const getInput = (): TProductCategoryInput => ({
        slug: category.slug,
        pageTitle: category.pageTitle,
        pageDescription: category.pageDescription,
        name: category.name,
        mainImage: category.mainImage,
        isEnabled: category.isEnabled,
        description: getQuillHTML(quillEditor.current, `#${editorId}`),
        descriptionDelta: JSON.stringify(quillEditor.current.getContents()),
        parentId: category.parent?.id,
        childIds: category.children?.map(child => child.id),
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

    const themeCategoryPage = store.getState()?.activeTheme?.defaultPages?.category;
    let pageFullUrl;
    if (themeCategoryPage && category) {
        pageFullUrl = serviceLocator.getFrontendUrl() + '/' + themeCategoryPage.replace('[slug]', category.slug ?? category.id ?? '');
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
                    <div style={{ height: '300px' }} id={editorId}></div>
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
