import Head from 'next/head';
import Layout from '../components/Layout';
import RefundPolicy from '../page-components/Legal/RefundPolicy';

export default function Refund() {
  return (
    <>
      <Head>
        <title>Refund Policy - AKG Classes</title>
        <meta name="description" content="Read our refund policy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <RefundPolicy />
      </Layout>
    </>
  );
}

