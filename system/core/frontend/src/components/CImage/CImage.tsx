import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CImage.module.scss';

type CImageProps = {
    src?: string;
    imgLink?: string;
    alt?: string;
    withEffect?: boolean;
    objectFit?: 'contain' | 'cover';
    width?: number;
    height?: number;
}

export const CImage = (props: CImageProps & TCromwellBlockProps) => {
    const { image, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(data) => {
                const _src = data?.image?.src ?? image?.src ?? props.src;
                const _link = data?.image?.link ?? image?.link ?? props.imgLink;
                const _alt = data?.image?.alt ?? image?.alt ?? props.alt;
                const _withEffect = data?.image?.withEffect ?? image?.withEffect ?? props.withEffect;
                const _objectFit = data?.image?.objectFit ?? image?.objectFit ?? props.objectFit;
                const _width = data?.image?.width ?? image?.width ?? props.width;
                const _height = data?.image?.height ?? image?.height ?? props.height;

                const classes = _withEffect ? styles.CImageHoverEffect : undefined;
                const imgEl = (
                    <img src={_src}
                        alt={_alt}
                        style={{
                            width: _width ? _width + 'px' : '100%',
                            height: _height ? _height + 'px' : undefined,
                            objectFit: _objectFit ?? 'contain'
                        }}
                    />
                )
                const wrapperStyle = {
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                };

                return _link ? (
                    <Link href={_link}><a style={wrapperStyle}
                        className={classes}
                    >{imgEl}</a></Link>
                ) : (
                        <div style={wrapperStyle}
                            className={classes}
                        >{imgEl}</div>
                    )
            }}
        />
    )
}