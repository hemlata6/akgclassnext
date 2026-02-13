import Head from 'next/head';
import Layout from '../components/Layout';
import MCQTest from '../page-components/FreeResources/McqTest';

export default function McqTestPage() {
  return (
    <>
      <Head>
        <title>MCQ Test - Next Gen CA</title>
        <meta name="description" content="Test your knowledge with MCQ tests" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <MCQTest />
      </Layout>
    </>
  );
}

