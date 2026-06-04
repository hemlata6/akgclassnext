import Head from 'next/head';
import Layout from '../components/Layout';
import Result from '../page-components/FreeResources/ResultPage';
import { Footer } from '../components/Shared/SharedComponents';
import { useAuth } from '@/config/AuthContext';

export default function QuizResult() {
  const { institute } = useAuth();
  return (
    <>
      <Head>
        <title>{`Quiz Result - ${institute?.institue || "Rishabh Jain"}`}</title>
        <meta name="description" content="View your quiz results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Result />
      </Layout>
    </>
  );
}

