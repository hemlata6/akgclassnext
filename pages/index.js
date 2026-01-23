import Head from 'next/head';
import Layout from '../components/Layout';
import HomePage from '../page-components/Home/HomePage';

export default function Home() {
  return (
    <>
      <Head>
        <title>CA Final FR Courses & Materials</title>
        <meta name="description" content="Best CA Final Financial Reporting courses and materials by industry experts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
}

