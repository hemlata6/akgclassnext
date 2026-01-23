import Head from 'next/head';
import Layout from '../components/Layout';
import FreeResourcesPage from '../page-components/FreeResources/FreeResourcesPage';

export default function FreeResources() {
  return (
    <>
      <Head>
        <title>Free Resources - AKG Classes</title>
        <meta name="description" content="Access free study materials and resources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <FreeResourcesPage />
      </Layout>
    </>
  );
}

