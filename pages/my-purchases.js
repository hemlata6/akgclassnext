import Head from 'next/head';
import Layout from '../components/Layout';
import MyPurchases from '../page-components/FreeResources/MyPurchase';

export default function MyPurchasesPage() {
  return (
    <>
      <Head>
        <title>My Purchases - CA Pankaj Aswani</title>
        <meta name="description" content="View your purchased courses and materials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <MyPurchases />
      </Layout>
    </>
  );
}

