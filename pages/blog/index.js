import Head from 'next/head';
import Layout from '../../components/Layout';
import { BlogListPage } from '../../page-components/Blog/BlogPages';

export default function Blog() {
  const siteUrl = 'https://caclassestest.netlify.app/blog/';
  const ogImage = 'logoVG STUDY HUB.png';
  const title = 'VG STUDY HUB | VG STUDY HUB - CA VIVEK GABA';
  const description = 'Get Conceptual Clarity of CA Final IDT - CA VIVEK GABA';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VG STUDY HUB" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@caclass" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content="VG STUDY HUB Blog, Financial Reporting, Ind AS, CA Final, Accounting Standards, Exam Preparation" />
      </Head>
      <Layout>
        <BlogListPage />
      </Layout>
    </>
  );
}

