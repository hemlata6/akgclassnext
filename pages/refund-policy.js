import Head from 'next/head';
import Layout from '../components/Layout';
import RefundPolicy from '../page-components/Legal/RefundPolicy';
import { useAuth } from '@/config/AuthContext';

export default function Refund() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Refund Policy - ${institute?.institue || "CA Shirish Vyas"}`}</title>
        <meta name="description" content="Read our refund policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <RefundPolicy />
      </Layout>
    </>
  );
}

