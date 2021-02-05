import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CImage.module.scss';

type CImageProps = { src?: string; imgLink?: string; withEffect?: boolean } & TCromwellBlockProps;

export const CImage = (props: CImageProps) => {
    const { src, imgLink, withEffect, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(data) => {
                const _src = data?.image?.src ?? src;
                const _link = data?.image?.link ?? imgLink;
                const _withEffect = data?.image?.withEffect ?? withEffect;

                const classes = _withEffect ? styles.CImageHoverEffect : undefined;
                const imgEl = (
                    <img src={_src}
                        style={{
                            width: '100%',
                            objectFit: 'contain'
                        }}
                    />
                )
                const wrapperStyle = {
                    display: 'flex',
                    width: '100%'
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
