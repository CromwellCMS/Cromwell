import { TCromwellPage } from '@cromwell/core';
import { CContainer, CGallery, CImage, CPlugin, CText } from '@cromwell/core-frontend';
import React from 'react';

import Layout from '../components/layout/Layout';
import commonStyles from '../styles/common.module.scss';
import styles from '../styles/pages/Index.module.scss';

const Index: TCromwellPage = (props) => {
    console.log('IndexTheme props', props);

    return (
        <Layout>
            <div className={styles.IndexPage}>
                <CContainer id="main_00">
                    <CGallery id="main_gallery_01" className={styles.mainBannerGallery} />
                </CContainer>
                <CContainer id="main_01" className={styles.advantagesBlockWrapper}>
                    <CContainer id="main_05" className={`${commonStyles.content} ${styles.advantagesBlock}`}>
                        <CContainer id="main_02" className={styles.advantageItem}>
                            <CImage id="main_09" src="/themes/@cromwell/theme-store/free_shipping.png" />
                            <CContainer id="main_11" className={styles.advantageItemText}>
                                <CText id="main_06" className={styles.advantageItemHeader}>FREE SHIPPING & RETURN</CText>
                                <CText id="main_12">Free shipping for orders over $9</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_03" className={styles.advantageItem}>
                            <CImage id="main_33" src="/themes/@cromwell/theme-store/wallet.png" />
                            <CContainer id="main_13" className={styles.advantageItemText}>
                                <CText id="main_07" className={styles.advantageItemHeader}>MONEY BACK GUARANTEE</CText>
                                <CText id="main_014">100% money back guarantee</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_04" className={styles.advantageItem}>
                            <CImage id="main_34" src="/themes/@cromwell/theme-store/technical-support.png" />
                            <CContainer id="main_10" className={styles.advantageItemText}>
                                <CText id="main_08" className={styles.advantageItemHeader} >ONLINE SUPPORT 24/7</CText>
                                <CText id="main_35" >100% 24/7 online support</CText>
                            </CContainer>
                        </CContainer>
                    </CContainer>
                </CContainer>
                <CContainer id="main_20" className={commonStyles.content}>
                    <CContainer id="main_20" className={styles.mainBlock}>
                        <CContainer id="main_21" className={styles.mainSidebar}>
                            <CImage id="main_sidebar_image_1" src="/themes/@cromwell/theme-store/sidebar_banner_1.png" className={styles.sidebarBanner} />
                            {/* <CPlugin id="NewsletterForm_sidebar" pluginName="NewsletterForm" /> */}
                        </CContainer>
                        <CContainer id="main_22" className={styles.mainContent}>
                            <CContainer id="main_23" className={styles.mainSubBanners}>
                                <CImage src="/themes/@cromwell/theme-store/sub_banner_1.jpg" id="main_sub_banner_1" className={styles.mainSubBanner} />
                                <CImage src="/themes/@cromwell/theme-store/sub_banner_2.jpg" id="main_sub_banner_2" className={styles.mainSubBanner} />
                                <CImage src="/themes/@cromwell/theme-store/sub_banner_3.jpg" id="main_sub_banner_3" className={styles.mainSubBanner} />
                            </CContainer>
                            <CContainer id="main_24" className={styles.mainShowcaseWrapper}>
                                <CPlugin id="main_showcase" style={{ height: '440px' }} />
                            </CContainer>
                        </CContainer>
                    </CContainer>
                </CContainer>
            </div>
        </Layout>
    );
}

export default Index;