import Head from 'next/head';
import Layout from '../components/Layout';
import FreeResourcesPage from '../page-components/FreeResources/FreeResourcesPage';
import { Footer } from '../components/Shared/SharedComponents';
import { useAuth } from '@/config/AuthContext';

export default function FreeResources() {
    const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Free Resources - ${institute?.institue || "CA Shirish Vyas"}`}</title>
        <meta name="description" content="Access free study materials and resources" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <FreeResourcesPage />
      </Layout>
    </>
  );
}

