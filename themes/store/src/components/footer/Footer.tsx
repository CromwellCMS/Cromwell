import { CContainer, CHTML, CText, CPlugin } from '@cromwell/core-frontend';
import { Button, InputBase } from '@material-ui/core';
import React from 'react';

import commonStyles from '../../styles/common.module.scss';
import styles from './Footer.module.scss';

export const Footer = () => {
    return (
        <CContainer className={`${styles.Footer} ${commonStyles.text}`} id="footer_01">
            <CContainer className={commonStyles.content} id="footer_02">
                <CContainer className={styles.subscribe} id="footer_03">
                    <CContainer className={styles.subscribeText} id="footer_04">
                        <CText className={styles.subscribeTitle} id="footer_06">Subscribe newsletter</CText>
                        <CText id="footer_07">Don't miss our special offers and sales!</CText>
                    </CContainer>
                    <CContainer className={styles.subscribeInputContainer} id="footer_05">
                        <CPlugin id="footer_06_Newsletter" pluginName={"@cromwell/plugin-newsletter"} />
                    </CContainer>
                </CContainer>
                <CContainer className={styles.linksSection} id="footer_08">
                    <CContainer className={styles.linksBlock} id="footer_09">
                        <CText className={styles.blockHeader} id="footer_10">Contact infromation</CText>
                        <CText className={styles.blockSubHeader} id="footer_11">Address</CText>
                        <CText className={styles.blockLink} id="footer_12">123 Street, City, Canada</CText>
                        <CText className={styles.blockSubHeader} id="footer_13">Phone</CText>
                        <CText className={styles.blockLink} id="footer_14">+1 (234) 567-89-00</CText>
                        <CText className={styles.blockSubHeader} id="footer_15">Email</CText>
                        <CText className={styles.blockLink} id="footer_16">sales@example.com</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_17">
                        <CText className={styles.blockHeader} id="footer_18">Support</CText>
                        <CText className={styles.blockLink} id="footer_19">Shipping and Delivery</CText>
                        <CText className={styles.blockLink} id="footer_20">Returns</CText>
                        <CText className={styles.blockLink} id="footer_21">Gift cards</CText>
                    </CContainer>
                    <CContainer className={styles.linksBlock} id="footer_22">
                        <CText className={styles.blockHeader} id="footer_23">About us</CText>
                        <CText className={styles.blockLink} id="footer_24">Shipping and Delivery</CText>
                        <CText className={styles.blockLink} id="footer_25">Returns</CText>
                        <CText className={styles.blockLink} id="footer_26">News</CText>
                    </CContainer>
                </CContainer>
            </CContainer>
        </CContainer>
    );
}
