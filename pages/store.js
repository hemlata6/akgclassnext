import Head from 'next/head';
import Layout from '../components/Layout';
import Store from '../page-components/store/Store';
import { useAuth } from '@/config/AuthContext';

export default function StorePage() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Store - ${institute?.institue || "Rishabh Jain"}`}</title>
        <meta name="description" content="Browse our collection of courses and books" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Store />
      </Layout>
    </>
  );
}

