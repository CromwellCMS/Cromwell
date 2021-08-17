import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Button } from '@material-ui/core'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import WhatshotIcon from '@material-ui/icons/Whatshot';

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
          your customers could ever dream of</p>
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
        <p className={styles.header2}>Easy to setup and maintain, includes </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              minWidth: '90px',
              height: '90px',
              backgroundImage: 'url(../../static/img/content.svg)'
            }}></div>
            <div>
              <p className={styles.featureTitle}>Online store and blogging platform.</p>
              <p> Manage your products, posts and other content with ease.</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              backgroundImage: 'url(../../static/img/puzzle.svg)',
              minWidth: '90px',
              height: '90px',
            }}></div>
            <div>
              <p className={styles.featureTitle}>Powerful admin panel with themes and plugins.</p>
              <p>Customize your theme, install plugins. WordPress-like user experience.</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              minWidth: '120px',
              height: '120px',
              marginLeft: '-50px',
              backgroundSize: '90%',
              backgroundImage: 'url(../../static/img/seo.svg)',
            }}></div>
            <div>
              <p className={styles.featureTitle}>SEO optimized.</p>
              <p>Modifiable meta tags for all content and custom pages. Auto-generated Sitemap.</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              backgroundImage: 'url(../../static/img/magic-wand.svg)'
            }}></div>
            <div>
              <p className={styles.featureTitle}>Theme editor</p>
              <p>Fully customize your Theme layout in drag-and-drop Theme editor</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              backgroundImage: 'url(../../static/img/rocket.svg)',
            }}></div>
            <div>
              <p className={styles.featureTitle}>Node.js.</p>
              <p>Designed to be a better version of PHP web servers,
                it greatly outperforms backend of well known CMS.</p>
            </div>
          </div>
          <div className={styles.feature}>
            <div className={styles.featureImg} style={{
              backgroundImage: 'url(../../static/img/open-source.svg)'
            }}></div>
            <div>
              <p className={styles.featureTitle}>Free and open source</p>
              <p>Cromwell CMS with default themes and plugins will stay forever free of
                charge and open source under MIT licence</p>
            </div>
          </div>
        </div>
      </div>
    </Layout >
  );
}