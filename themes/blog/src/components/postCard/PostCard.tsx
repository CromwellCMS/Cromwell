import { TPost, TTag } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { Component, useEffect, useRef, useState } from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './PostCard.module.scss';


export const PostCard = (props?: {
    data?: TPost;
    className?: string;
    onTagClick?: (tag?: TTag) => void;
}) => {
    const data = props?.data;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const postLink = `/blog/${data?.slug ?? data?.id}`;
    const avatar = data?.author?.avatar;

    return (
        <div className={clsx(styles.PostCard, commonStyles.onHoverLinkContainer)}>
            <div className={styles.imageBlock}
            // style={{ height: isMobile ? 'auto' : imageHeigth }}
            >
                <Link href={postLink}>
                    <a><img className={styles.image} src={data?.mainImage ?? undefined} /></a>
                </Link>
            </div>
            <div className={styles.caption}>
                <div className={styles.tagsBlock}>
                    {data?.tags?.map(tag => {
                        return (
                            <div onClick={() => props?.onTagClick?.(tag)} className={styles.tag}>{tag?.name}</div>
                        )
                    })}
                </div>
                <div className={styles.titleBlock}>
                    <Link href={postLink}>
                        <a className={clsx(styles.title, commonStyles.onHoverLink)}>{data?.title}</a>
                    </Link>
                </div>
                {data?.excerpt && (
                    <p className={styles.excerpt}>{data?.excerpt}</p>
                )}
                <div className={styles.authorBlock}>
                    <div>
                        {(avatar && avatar !== '') ? (
                            <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
                        ) : <AccountCircleIcon className={styles.avatar} />}
                    </div>
                    <div>
                        <p className={styles.authorName} >{data?.author?.fullName}</p>
                        <p className={styles.publishDate}>{data?.publishDate ? format(Date.parse(String(data.publishDate)), 'd MMMM yyyy') : ''}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
