import Head from 'next/head';
import Layout from '../components/Layout';
import MCQTest from '../page-components/FreeResources/McqTest';
import { Footer } from '../components/Shared/SharedComponents';

export default function McqTestPage() {
  return (
    <>
      <Head>
        <title>MCQ Test - Rahuls CA Academy</title>
        <meta name="description" content="Test your knowledge with MCQ tests" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <MCQTest />
      </Layout>
    </>
  );
}

