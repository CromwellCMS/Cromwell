import { TCromwellBlockProps } from '@cromwell/core';
import React from 'react';

import { CBlock } from '../CBlock/CBlock';
import { Link } from '../Link/Link';
import styles from './CImage.module.scss';

type CImageProps = {
    src?: string;
    imgLink?: string;
    alt?: string;
    withEffect?: boolean;
    objectFit?: 'contain' | 'cover';
    width?: number | string;
    height?: number | string;
} & TCromwellBlockProps;

export class CImage extends React.Component<CImageProps> {
    render() {
        const props = this.props;
        const { image, ...rest } = props;

        return (
            <CBlock {...rest} type='image'
                content={(data, blockRef, setContentInstance, setClasses) => {
                    setContentInstance(this);

                    const _src = data?.image?.src ?? image?.src ?? props.src;
                    const _link = data?.image?.link ?? image?.link ?? props.imgLink;
                    const _alt = data?.image?.alt ?? image?.alt ?? props.alt;
                    const _objectFit = data?.image?.objectFit ?? image?.objectFit ?? props.objectFit;
                    const _width = data?.image?.width ?? image?.width ?? props.width;
                    const _height = data?.image?.height ?? image?.height ?? props.height;
                    const _withEffect = data?.image?.withEffect ?? image?.withEffect ?? props.withEffect;
                    if (_withEffect && typeof setClasses === 'function') setClasses(styles.CImageHoverEffect);

                    const imgEl = (
                        <img src={_src}
                            alt={_alt}
                            style={{
                                width: _width ? typeof _width === 'number' ? _width + 'px' : _width : '100%',
                                height: _height ? typeof _height === 'number' ? _height + 'px' : _height : undefined,
                                objectFit: _objectFit ?? 'contain'
                            }}
                        />
                    );

                    return _link ? (
                        <Link href={_link}>{imgEl}</Link>
                    ) : imgEl;
                }}
            />
        )
    }
}