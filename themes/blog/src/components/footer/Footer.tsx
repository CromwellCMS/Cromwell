import { CContainer, CPlugin, CText } from '@cromwell/core-frontend';
import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <CContainer className={`${styles.Footer} ${commonStyles.text}`} id="footer_01">
            <CContainer className={commonStyles.content} id="footer_02">
                <CContainer className={styles.aboutSection} id="footer_08">
                    <CContainer className={styles.linksBlock} id="footer_09">
                        <CText className={styles.blockLink} id="footer_12">© Copyright 2021</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_22">
                        <CText className={styles.blockHeader} id="footer_23">About us</CText>
                        <CText className={styles.blockLink} id="footer_26">News</CText>
                        <CText className={styles.blockLink} id="footer_26">Contacts</CText>
                        <CText className={styles.blockLink} id="footer_26">CromwellCMS</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_17">
                        <CText className={styles.blockHeader} id="footer_07">Join our newsletter!</CText>
                        <CContainer className={styles.subscribeInputContainer} id="footer_05">
                            <CPlugin id="footer_06_Newsletter" pluginName={"@cromwell/plugin-newsletter"} />
                        </CContainer>
                    </CContainer>
                </CContainer>
            </CContainer>
        </CContainer>
    );
}
