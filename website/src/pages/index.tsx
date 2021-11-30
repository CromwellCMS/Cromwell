import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Button } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
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
            <div className={styles.IndexPage}>
                <div className={styles.content}>
                    <div className={styles.moon}></div>
                    <h1 className={styles.header}><span style={{ display: 'none' }}>C</span><span>romwell CMS</span></h1>
                    <p className={styles.subheader}>It&apos;s time for everyone to make blazing-fast websites
                        <WhatshotIcon className={styles.fireIcon} style={{ width: '20px', height: '20px' }} />
                    </p>
                    <p className={styles.quote}>Cromwell CMS is a next-gen e-commerce and blogging
                        platform that unites bleeding-edge web techs in extraordinary user-friendly format.</p>
                    <div className={styles.mainActions}>
                        <Link href="/docs/overview/intro">
                            <Button
                                variant="contained"
                                className={styles.getStartedBtn}
                            >Get started</Button>
                        </Link>
                        <Link href="/docs/overview/intro#examples">
                            <Button
                                variant="contained"
                                className={styles.examplesBtn}
                            >Examples</Button>
                        </Link>
                    </div>

                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>The most advanced visual editor for Next.js apps</h3>
                    <p className={styles.sectionSubHeader}>Install properly crafted themes by frontend developers.
                        Drag and drop theme blocks. Add plugins, change content,
                        styles and more. Make it yours!</p>
                    <br style={{ height: '20px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-theme.jpg",
                        "/img/demo-theme-2.png"
                    ]} />
                </div>

                <div className={styles.content}>
                    <h3 className={styles.header3}>Customizable statistics dashboard. System monitor.</h3>
                    <p>Move and resize dashboard blocks. Monitor server load.</p>
                    <br style={{ height: '20px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-dashboard.jpg",
                        "/img/demo-sysusage.png",
                    ]} />
                </div>
                <div className={styles.content}>
                    <br style={{ height: '20px' }} />
                    <br style={{ height: '20px' }} />
                    <h3 className={styles.header3}>Modern block styled text editor.</h3>
                    <p>Embed video links or upload images. Manage your media with file manager.</p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-editor.jpg",
                        "/img/demo-filemanager.png",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Custom data types</h3>
                    <p>Add custom fields or create new custom entities. Store any kind of data.</p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-custom1.png",
                        "/img/demo-custom2.png",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Good looking default themes</h3>
                    <p>Fully featured free online store and blog out the box.</p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-site1.png",
                        "/img/demo-site2.png",
                        "/img/demo-site3.png",
                        "/img/demo-site4.png",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Developer?</h3>
                    <p>Make plugins that work with themes and can be statically pre-rendered
                        by Next.js. Publish them to the market and let everyone use with a couple of clicks.</p>
                    <br style={{ height: '10px' }} />
                    <img className={styles.demoImage} src="/img/demo-plugins-api.jpg" />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-plugins-api.jpg",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Extend server API</h3>
                    <p>Make plugins to extend server API with the best enterprise-grade
                        TypeScript frameworks: Nest.js, TypeGraphQL and TypeORM</p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-plugins-api.jpg",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Simply make themes by writing JSX code.</h3>
                    <p>Representation can be fully customized by your customers. Yes, these React components
                        will be dragged/dropped/removed/styles in the theme editor!</p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-plugins-api.jpg",
                    ]} />
                </div>


                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <br style={{ height: '10px' }} />
                    <h3 className={styles.header3}>Go headless</h3>
                    <p>Cromwell CMS follows principles of headless CMS. You can
                        make any kind of custom frontend and query our API server with GraphQL.
                    </p>
                    <br style={{ height: '10px' }} />
                </div>
                <div className={styles.screenshots}>
                    <CoverFlowImages images={[
                        "/img/demo-headless.png",
                    ]} />
                </div>

                <div className={styles.content}>
                    <br />
                    <p className={styles.quote}>With Cromwell CMS there is no need to assemble your CMS piece
                        by piece with dozens of different apps and services. Get ones of the best modern web
                        techs designed to work together. In one pack.</p>
                </div>

                <div className={styles.content}>
                    <br style={{ height: '10px' }} />
                    <div style={{ textAlign: 'center' }}>
                        <Link href="/docs/overview/intro">
                            <Button
                                style={{ margin: '0' }}
                                variant="contained"
                                className={styles.getStartedBtn}
                            >Get started</Button>
                        </Link>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>

                <div className={styles.content}>
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
                                backgroundSize: '73%',
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
                                backgroundImage: 'url("/img/open-source.svg")',
                            }}></div>
                            <div>
                                <p className={styles.featureTitle}>Free and open source</p>
                                <p>Cromwell CMS with default themes and plugins will stay forever free of
                                    charge and open source.</p>
                            </div>
                        </div>
                    </div>
                    <br style={{ height: '20px' }} />
                </div>

            </div>
        </Layout >
    );
}
