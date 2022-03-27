import { CContainer, CPlugin, CText } from '@cromwell/core-frontend';
import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './Footer.module.scss';

export default function Footer() {
    return (
        <CContainer global className={`${styles.Footer} ${commonStyles.text}`} id="footer_01">
            <CContainer className={commonStyles.content} id="footer_02">
                <CContainer className={styles.aboutSection} id="footer_08">
                    <CContainer className={styles.linksBlock} id="footer_09">
                        <CText className={styles.blockLink} id="footer_12">© Copyright 2021</CText>
                        <CText href="/pages/attribution" className={styles.blockLink} id="footer_31">Attribution</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_22">
                        <CText className={styles.blockHeader} id="footer_23">About us</CText>
                        <CText href="/pages/contacts" className={styles.blockLink} id="footer_27">Contacts</CText>
                        <CText href="/post/join-us" className={styles.blockLink} id="footer_26">Join Us</CText>
                        <CText href="/search" className={styles.blockLink} id="footer_28">Search posts</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_17">
                        <CText className={styles.blockHeader} id="footer_07">Join our newsletter!</CText>
                        <CContainer className={styles.subscribeInputContainer} id="footer_05">
                            <CPlugin id="footer_06_Newsletter" pluginName={"@cromwell/plugin-newsletter"} blockName="Newsletter" />
                        </CContainer>
                    </CContainer>
                </CContainer>
            </CContainer>
        </CContainer>
    );
}
