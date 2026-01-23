import Head from 'next/head';
import Layout from '../components/Layout';
import TermsOfUse from '../page-components/Legal/TermsOfUse';

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Use - AKG Classes</title>
        <meta name="description" content="Read our terms of use" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <TermsOfUse />
      </Layout>
    </>
  );
}

