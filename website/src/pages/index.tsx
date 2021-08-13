import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <div className={styles.content}>
        <h1 className={styles.header}>Cromwell CMS</h1>
        <p className={styles.subheader}>It&apos;s time for everyone to make blazing-fast websites</p>
        <p className={styles.subheader}>Easy to setup and maintain, Cromwell CMS brings bleeding-edge techs for you and your customers</p>
      </div>
    </Layout>
  );
}