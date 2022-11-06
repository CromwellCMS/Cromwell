import { TPost, TTag } from '@cromwell/core';
import { Link, useAppPropsContext } from '@cromwell/core-frontend';
import clsx from 'clsx';
import { format } from 'date-fns';
import Image from 'next/image';
import React from 'react';

import { AccountCircleIcon } from '../icons';
import styles from './PostCard.module.scss';

export const PostCard = (props?: {
  data?: TPost;
  className?: string;
  onTagClick?: (tag?: TTag) => void;
  coverImage?: boolean;
  imageHeight?: string;
}) => {
  const data = props?.data;
  const postLink = `/post/${data?.slug ?? data?.id}`;
  const mainImage = data?.mainImage ?? '/themes/@cromwell/theme-blog/no-photos.png';
  const pageContext = useAppPropsContext();

  const imageLoader = ({ src }: { src: string; width: number; quality?: number }) => {
    const origin = pageContext.routeInfo?.origin;
    if (src.startsWith('/') && origin) src = origin + src;
    return src;
  };

  return (
    <div className={clsx(styles.PostCard, styles._onHoverLinkContainer, props?.coverImage && styles.coverImage)}>
      <div className={styles.imageBlock} style={{ height: props?.imageHeight }}>
        <Link href={postLink} aria-label={`Post ${data?.title}`} style={{ display: 'flex' }}>
          {Image && (
            <Image
              alt={data?.title ?? undefined}
              unoptimized
              loader={imageLoader}
              objectFit="cover"
              layout="fill"
              src={mainImage}
            />
          )}
        </Link>
      </div>
      {props?.coverImage && <div className={styles.overlay}></div>}
      <div className={styles.caption}>
        <div className={styles.tagsBlock}>
          {data?.tags?.map((tag) => {
            if (props?.onTagClick) {
              return (
                <div key={tag?.id} onClick={() => props?.onTagClick?.(tag)} className={styles.tag}>
                  {tag?.name}
                </div>
              );
            }
            return (
              <Link key={tag?.id} href={`/tag/${tag.slug}`} className={styles.tag}>
                {tag?.name}
              </Link>
            );
          })}
        </div>
        <div className={styles.titleBlock}>
          <Link href={postLink} className={clsx(styles.title, styles._onHoverLink)}>
            {data?.title}
          </Link>
        </div>
        {data?.excerpt && <p className={styles.excerpt}>{data?.excerpt}</p>}
        <PostInfo data={data} />
      </div>
    </div>
  );
};

export const PostInfo = (props: { data?: TPost }) => {
  const { data } = props;
  const avatar = data?.author?.avatar;

  return (
    <div className={styles.authorBlock}>
      {avatar ? (
        <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
      ) : (
        <AccountCircleIcon className={styles.avatar} />
      )}
      <div>
        <p className={styles.authorName}>{data?.author?.fullName}</p>
        <div className={styles.dateAndReadInfo}>
          <p className={styles.publishDate}>
            {data?.publishDate ? format(Date.parse(String(data.publishDate)), 'd MMMM yyyy') : ''}
          </p>
          {data?.readTime && parseInt(data.readTime) !== 0 && (
            <p className={styles.readTime}>{Math.round(parseFloat(data.readTime))} min read</p>
          )}
        </div>
      </div>
    </div>
  );
};
