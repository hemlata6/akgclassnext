import Head from 'next/head';
import Layout from '../components/Layout';
import MCQTest from '../page-components/FreeResources/McqTest';
import { Footer } from '../components/Shared/SharedComponents';
import { useAuth } from '@/config/AuthContext';

export default function McqTestPage() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`MCQ Test - ${institute?.institue || "CA Shirish Vyas"}`}</title>
        <meta name="description" content="Test your knowledge with MCQ tests" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <MCQTest />
      </Layout>
    </>
  );
}

