import { getStoreItem } from '@cromwell/core';
import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import Modal from '../modal/Modal';
import styles from './CmsInfo.module.scss';

export default function CmsInfo(props: { open: boolean; onClose: () => any }) {
  const settings = getStoreItem('cmsSettings');
  return (
    <Modal open={props.open} blurSelector="#root" className={commonStyles.center} onClose={props.onClose}>
      <div className={styles.cmsInfo}>
        <h4 className={styles.cmsInfoHeader}>System packages</h4>
        {Object.entries(settings?.cmsInfo?.packages ?? {})
          .sort((a, b) => (a[0] < b[0] ? -1 : 1))
          .map((pckg) => (
            <p key={pckg[0]}>
              {pckg[0]}: {pckg[1]}
            </p>
          ))}
        <h4 className={styles.cmsInfoHeader} style={{ marginTop: '20px' }}>
          Attribution
        </h4>
        <div id="icons_attribution" className={styles.iconsCredits}>
          Icons made by
          <a href="http://www.freepik.com/" title="Freepik">
            Freepik
          </a>{' '}
          ,
          <a href="https://icon54.com/" title="Pixel perfect">
            {' '}
            Pixel perfect
          </a>{' '}
          ,
          <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">
            Smashicons
          </a>{' '}
          ,
          <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">
            Good Ware
          </a>
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            {' '}
            www.flaticon.com
          </a>
        </div>
      </div>
    </Modal>
  );
}
