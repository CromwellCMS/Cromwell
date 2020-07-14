import React from 'react';
import { TCromwellPage } from '@cromwell/core';
import { Link, CTextBlock, CHTMLBlock, CromwellBlock, CContainerBlock, CImageBlock } from '@cromwell/core-frontend';
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
                <CContainerBlock id="main_01" className={styles.advantagesBlockWrapper}>
                    <CContainerBlock id="main_05" className={`${commonStyles.content} ${styles.advantagesBlock}`}>
                        <CContainerBlock id="main_02" className={styles.advantageItem}>
                            <CImageBlock id="main_09" src="/images/free_shipping.png" />
                            <CContainerBlock id="main_11" className={styles.advantageItemText}>
                                <CTextBlock id="main_06">FREE SHIPPING & RETURN</CTextBlock>
                                <CTextBlock id="main_12">Free shipping on all orders over $9.</CTextBlock>
                            </CContainerBlock>
                        </CContainerBlock>
                        <CContainerBlock id="main_03" className={styles.advantageItem}>
                            <CImageBlock id="main_09" src="/images/wallet.png" />
                            <CContainerBlock id="main_13" className={styles.advantageItemText}>
                                <CTextBlock id="main_07">MONEY BACK GUARANTEE</CTextBlock>
                                <CTextBlock id="main_014">100% money back guarantee</CTextBlock>
                            </CContainerBlock>
                        </CContainerBlock>
                        <CContainerBlock id="main_04" className={styles.advantageItem}>
                            <CImageBlock id="main_09" src="/images/technical-support.png" />
                            <CContainerBlock id="main_10" className={styles.advantageItemText}>
                                <CTextBlock id="main_08" >ONLINE SUPPORT 24/7</CTextBlock>
                                <CTextBlock id="main_08" >100% 24/7 online support</CTextBlock>
                            </CContainerBlock>
                        </CContainerBlock>
                    </CContainerBlock>
                </CContainerBlock>
                <div >
                    <div></div>
                </div>
                <div className={styles.IndexPage}>IndexTemp
                HELLO WOORLD1
            <Link href='/pages/some_page'><a>SomePage</a></Link>
                    <CTextBlock id="1">'Custom' Block text 1 </CTextBlock>
                    <div>
                        <h2>Some subtitle</h2>
                    </div>
                    <CHTMLBlock id="2">
                        <div>
                            <p>Custom Block text 2</p>
                        </div>
                    </CHTMLBlock>
                    <CromwellBlock id="5" />
                </div>
            </div>
        </Layout>
    );
}
export default Index;