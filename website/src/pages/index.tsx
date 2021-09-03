import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button } from '@material-ui/core';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import Layout from '@theme/Layout';
import React from 'react';

import { CoverFlowImages } from '../components/CoverFlowImages';
import styles from './index.module.css';


export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Hello from ${siteConfig.title}`}
            description="Description will go into a meta tag in <head />">
            <div className={styles.content}>
                <div className={styles.moon}></div>
                <h1 className={styles.header}><span style={{ display: 'none' }}>C</span><span>romwell CMS</span></h1>
                <p className={styles.subheader}>It&apos;s time for everyone to make blazing-fast websites
                    <WhatshotIcon className={styles.fireIcon} />
                </p>
                <p className={styles.quote}>Cromwell CMS is a fastest e-commerce and blogging platform
                    your customers could ever dream of.</p>
                <div className={styles.mainActions}>
                    <Link href="/docs/overview/intro">
                        <Button
                            variant="contained"
                            className={styles.getStartedBtn}
                        >Get started</Button>
                    </Link>
                    <Button
                        variant="contained"
                        className={styles.examplesBtn}
                    >Examples</Button>
                </div>
                <p className={styles.header2}>Easy to setup and maintain, includes:</p>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            // minWidth: '90px',
                            // height: '90px',
                            backgroundSize: '70%',
                            backgroundImage: 'url("/img/content.svg")'
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>Online store and blogging platform.</p>
                            <p>Manage your products, posts and other content with ease.</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            backgroundImage: 'url("/img/puzzle.svg")',
                            backgroundSize: '68%',
                            // minWidth: '90px',
                            // height: '90px',
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>Powerful admin panel with themes and plugins.</p>
                            <p>Customize your theme, install plugins. WordPress-like user experience.</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            // minWidth: '120px',
                            // height: '120px',
                            // marginLeft: '-50px',
                            backgroundSize: '97%',
                            backgroundImage: 'url("/img/seo.svg")',
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>SEO optimized.</p>
                            <p>Modifiable meta tags for all content and custom pages. Auto-generated Sitemap.</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            backgroundImage: 'url("/img/magic-wand.svg")'
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>Theme editor</p>
                            <p>Fully customize your Theme layout in drag-and-drop Theme editor.</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            backgroundImage: 'url("/img/rocket.svg")',
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>Node.js.</p>
                            <p>Designed to be a better version of PHP web servers,
                                it greatly outperforms backend of well known CMS.</p>
                        </div>
                    </div>
                    <div className={styles.feature}>
                        <div className={styles.featureImg} style={{
                            backgroundImage: 'url("/img/open-source.svg")'
                        }}></div>
                        <div>
                            <p className={styles.featureTitle}>Free and open source</p>
                            <p>Cromwell CMS with default themes and plugins will stay forever free of
                                charge and open source.</p>
                        </div>
                    </div>
                </div>
                <br style={{ height: '20px' }} />
                <h3 className={styles.header3}>Customizable statistics dashboard. System monitor.</h3>
                <p>Move and resize dashboard blocks. Monitor server load.</p>
                <br style={{ height: '20px' }} />
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-dashboard.jpg",
                        "/img/demo-sysusage.png",
                    ]} />
                </div>
                <br style={{ height: '20px' }} />
                <br style={{ height: '20px' }} />
                <h3 className={styles.header3}>Modern block styled text editor.</h3>
                <p>Embed video links or upload images. Manage your media with file manager.</p>
                <br style={{ height: '10px' }} />
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-editor.jpg",
                        "/img/demo-filemanager.png",
                    ]} />
                </div>
                <br style={{ height: '10px' }} />
                <br style={{ height: '10px' }} />
                <h3 className={styles.header3}>Advanced theme editor.</h3>
                <p>Drag and drop block editor. Configure blocks, add plugins, change styles and more.</p>
                <br style={{ height: '10px' }} />
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-theme.jpg",
                        "/img/demo-theme-2.png"
                    ]} />
                </div>
                <br />
                <br />
                <p className={styles.header3} style={{ textAlign: 'center' }}>That and much more!</p>
                <br style={{ height: '10px' }} />
                <div style={{ textAlign: 'center' }}>
                    <Link href="/docs/overview/intro">
                        <Button
                            variant="contained"
                            className={styles.getStartedBtn}
                        >Get started</Button>
                    </Link>
                </div>

                <br />
                <br />
                <br />
            </div>
        </Layout >
    );
}
