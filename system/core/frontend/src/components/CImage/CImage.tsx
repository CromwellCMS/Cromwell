import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CromwellBlock } from '../CromwellBlock/CromwellBlock';
import { Link } from '../Link/Link';
import styles from './CImage.module.scss';


export const CImage = (props: TCromwellBlockProps) => {
    const { image, ...rest } = props;
    return (
        <CromwellBlock {...rest} type='image'
            content={(data) => {
                const _src = data?.image?.src ?? image?.src;
                const _link = data?.image?.link ?? image?.link;
                const _alt = data?.image?.alt ?? image?.alt;
                const _withEffect = data?.image?.withEffect ?? image?.withEffect;

                const classes = _withEffect ? styles.CImageHoverEffect : undefined;
                const imgEl = (
                    <img src={_src}
                        alt={_alt}
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
