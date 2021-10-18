import { getStoreItem, TPost, TTag } from '@cromwell/core';
import { Link } from '@cromwell/core-frontend';
import clsx from 'clsx';
import { format } from 'date-fns';
import * as NextImage from 'next/image';
import React from 'react';

import { AccountCircleIcon } from '../icons';
import styles from './PostCard.module.scss';

const Image = NextImage.default;

export const PostCard = (props?: {
    data?: TPost;
    className?: string;
    onTagClick?: (tag?: TTag) => void;
    coverImage?: boolean;
    imageHeight?: string;
}) => {
    const data = props?.data;
    const postLink = `/blog/${data?.slug ?? data?.id}`;
    const mainImage = (data?.mainImage ?? '/themes/@cromwell/theme-store/no-photos.png');

    const imageLoader = ({ src, width, quality }: {
        src: string;
        width: number;
        quality?: number;
    }) => {
        const origin = getStoreItem('routeInfo')?.origin;
        if (src.startsWith('/') && origin) src = origin + src;
        return src;
    }

    return (
        <div className={clsx(styles.PostCard, styles._onHoverLinkContainer, props?.coverImage && styles.coverImage)}>
            <div className={styles.imageBlock}
                style={{ height: props?.imageHeight }}
            >
                <Link href={postLink}>
                    <a aria-label={`Post ${data?.title}`}
                        style={{ display: 'flex' }}>
                        <Image
                            alt={data?.title ?? undefined}
                            loader={imageLoader}
                            objectFit="cover"
                            layout="fill"
                            src={mainImage}
                        />
                    </a>
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
                                <div key={tag?.id}
                                    onClick={() => props?.onTagClick?.(tag)}
                                    className={styles.tag}
                                >{tag?.name}</div>
                            )
                        }
                        return (
                            <Link key={tag?.id} href={`/tag/${tag.slug}`}>
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
                    {(data?.readTime && parseInt(data.readTime) !== 0) && (
                        <p className={styles.readTime}>{Math.round(parseFloat(data.readTime))} min read</p>
                    )}
                </div>
            </div>
        </div>
    )
}
