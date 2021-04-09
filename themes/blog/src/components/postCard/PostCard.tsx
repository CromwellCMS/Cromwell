import { TPost, TTag } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import { useMediaQuery, useTheme } from '@material-ui/core';
import { AccountCircle as AccountCircleIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { format } from 'date-fns';
import React, { Component, useEffect, useRef, useState } from 'react';

import styles from './PostCard.module.scss';


export const PostCard = (props?: {
    data?: TPost;
    className?: string;
    onTagClick?: (tag?: TTag) => void;
    coverImage?: boolean;
    imageHeight?: string;
}) => {
    const data = props?.data;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const postLink = `/blog/${data?.slug ?? data?.id}`;
    const avatar = data?.author?.avatar;

    return (
        <div className={clsx(styles.PostCard, styles._onHoverLinkContainer, props?.coverImage && styles.coverImage)}>
            <div className={styles.imageBlock} >
                <Link href={postLink}>
                    <a><img className={styles.image}
                        style={{ height: props?.imageHeight }}
                        src={data?.mainImage ?? undefined} /></a>
                </Link>
            </div>
            {props?.coverImage && (
                <div className={styles.overlay}></div>
            )}
            <div className={styles.caption}>
                <div className={styles.tagsBlock}>
                    {data?.tags?.map(tag => {
                        if (props?.onTagClick) {
                            return (
                                <div onClick={() => props?.onTagClick?.(tag)} className={styles.tag}>{tag?.name}</div>
                            )
                        }
                        return (
                            <Link href={`/tag/${tag.slug}`}>
                                <a className={styles.tag}>{tag?.name}</a>
                            </Link>
                        )
                    })}
                </div>
                <div className={styles.titleBlock}>
                    <Link href={postLink}>
                        <a className={clsx(styles.title, styles._onHoverLink)}>{data?.title}</a>
                    </Link>
                </div>
                {data?.excerpt && (
                    <p className={styles.excerpt}>{data?.excerpt}</p>
                )}
                <PostInfo data={data} />
            </div>
        </div>
    )
}

export const PostInfo = (props: { data?: TPost }) => {
    const { data } = props;
    const avatar = data?.author?.avatar;

    return (
        <div className={styles.authorBlock}>
            {(avatar && avatar !== '') ? (
                <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
            ) : <AccountCircleIcon className={styles.avatar} />}
            <div>
                <p className={styles.authorName} >{data?.author?.fullName}</p>
                <div className={styles.dateAndReadInfo}>
                    <p className={styles.publishDate}>{data?.publishDate ? format(Date.parse(String(data.publishDate)), 'd MMMM yyyy') : ''}</p>
                    {data?.readTime && (
                        <p className={styles.readTime}>{Math.round(parseFloat(data.readTime))} min read</p>
                    )}

                </div>
            </div>
        </div>
    )
}
