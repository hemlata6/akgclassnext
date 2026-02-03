import Head from 'next/head';
import Layout from '../components/Layout';
import MyPurchases from '../page-components/FreeResources/MyPurchase';
import { Footer } from '../components/Shared/SharedComponents';

export default function MyPurchasesPage() {
  return (
    <>
      <Head>
        <title>My Purchases - iWision</title>
        <meta name="description" content="View your purchased courses and materials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <MyPurchases />
      </Layout>
    </>
  );
}

