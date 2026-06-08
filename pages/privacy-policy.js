import Head from 'next/head';
import Layout from '../components/Layout';
import PrivacyPolicy from '../page-components/Legal/PrivacyPolicy';
import { useAuth } from '@/config/AuthContext';

export default function Privacy() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Privacy Policy - ${institute?.institue || "CA Shirish Vyas"}`}</title>
        <meta name="description" content="Read our privacy policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <PrivacyPolicy />
      </Layout>
    </>
  );
}

