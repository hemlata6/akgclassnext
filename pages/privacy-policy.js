import Head from 'next/head';
import Layout from '../components/Layout';
import PrivacyPolicy from '../page-components/Legal/PrivacyPolicy';

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - MyEduNeeds</title>
        <meta name="description" content="Read our privacy policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <PrivacyPolicy />
      </Layout>
    </>
  );
}

