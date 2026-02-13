import Head from 'next/head';
import Layout from '../components/Layout';
import Store from '../page-components/store/Store';

export default function StorePage() {
  return (
    <>
      <Head>
        <title>Store - Next Gen CA</title>
        <meta name="description" content="Browse our collection of courses and books" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Store />
      </Layout>
    </>
  );
}

