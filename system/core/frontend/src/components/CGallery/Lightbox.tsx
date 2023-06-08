import React, { Component } from 'react';
import ImageLightbox from 'react-image-lightbox';

import styles from './CGallery.module.scss';

/** @internal */
type Props = {
  getState: (setOpen: (open: boolean, index: number) => void) => void;
  images?: string[];
};

export class Lightbox extends Component<
  Props,
  {
    isOpen: boolean;
    photoIndex: number;
    images?: string[];
  }
> {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
    this.props.getState(this.setOpen);
  }

  setOpen = (open: boolean, index: number, images?: string[]) => {
    this.setState({ isOpen: open, photoIndex: index, images });
  };

  render() {
    const { photoIndex, isOpen } = this.state;
    const images = this.state.images ?? this.props.images ?? [];
    this.props.getState(this.setOpen);

    return (
      <>
        {isOpen && (
          <ImageLightbox
            reactModalProps={{
              overlayClassName: styles.modal,
            }}
            reactModalStyle={{ zIndex: 5000 }}
            mainSrc={images[photoIndex]}
            nextSrc={images.length > 1 ? images[(photoIndex + 1) % images.length] : undefined}
            prevSrc={images.length > 1 ? images[(photoIndex + images.length - 1) % images.length] : undefined}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </>
    );
  }
}
