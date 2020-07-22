import React from 'react';
import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { TCromwellBlockData } from '@cromwell/core';
import { Link } from '../Link/Link';
//@ts-ignore
import styles from './CImage.module.scss';

export const CImage = (props: { id: string, className?: string, src?: string, link?: string, withEffect?: boolean }) => {
    const { src, link, withEffect, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(data) => {
                const _src = (data && data.image && data.image.src) ? data.image.src : src;
                const _link = (data && data.image && data.image.link) ? data.image.link : link;
                const _withEffect = (data && data.image && data.image.withEffect) ? data.image.withEffect : withEffect;

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
