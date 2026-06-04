import Head from 'next/head';
import Layout from '../components/Layout';
import TermsOfUse from '../page-components/Legal/TermsOfUse';
import { useAuth } from '@/config/AuthContext';

export default function Terms() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Terms of Use - ${institute?.institue || "Rishabh Jain"}`}</title>
        <meta name="description" content="Read our terms of use" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <TermsOfUse />
      </Layout>
    </>
  );
}

