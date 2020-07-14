import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link, CText, CHTML, CromwellBlock, CContainer, CImage } from '@cromwell/core-frontend';
import Layout from '../components/layout/Layout';
// @ts-ignore
import styles from '../styles/pages/Index.module.scss';
// @ts-ignore
import commonStyles from '../styles/common.module.scss';

const Index: TCromwellPage = (props) => {
    console.log('IndexTheme props', props);

    return (
        <Layout>
            <div className={styles.IndexPage}>
                <CContainer id="main_01" className={styles.advantagesBlockWrapper}>
                    <CContainer id="main_05" className={`${commonStyles.content} ${styles.advantagesBlock}`}>
                        <CContainer id="main_02" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/free_shipping.png" />
                            <CContainer id="main_11" className={styles.advantageItemText}>
                                <CText id="main_06">FREE SHIPPING & RETURN</CText>
                                <CText id="main_12">Free shipping on all orders over $9.</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_03" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/wallet.png" />
                            <CContainer id="main_13" className={styles.advantageItemText}>
                                <CText id="main_07">MONEY BACK GUARANTEE</CText>
                                <CText id="main_014">100% money back guarantee</CText>
                            </CContainer>
                        </CContainer>
                        <CContainer id="main_04" className={styles.advantageItem}>
                            <CImage id="main_09" src="/images/technical-support.png" />
                            <CContainer id="main_10" className={styles.advantageItemText}>
                                <CText id="main_08" >ONLINE SUPPORT 24/7</CText>
                                <CText id="main_08" >100% 24/7 online support</CText>
                            </CContainer>
                        </CContainer>
                    </CContainer>
                </CContainer>
                <div >
                    <div></div>
                </div>
                <div className={styles.IndexPage}>IndexTemp
                HELLO WOORLD1
            <Link href='/pages/some_page'><a>SomePage</a></Link>
                    <CText id="1">'Custom' Block text 1 </CText>
                    <div>
                        <h2>Some subtitle</h2>
                    </div>
                    <CHTML id="2">
                        <div>
                            <p>Custom Block text 2</p>
                        </div>
                    </CHTML>
                    <CromwellBlock id="5" />
                </div>
            </div>
        </Layout>
    );
}
export default Index;