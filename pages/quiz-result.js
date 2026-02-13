import Head from 'next/head';
import Layout from '../components/Layout';
import Result from '../page-components/FreeResources/ResultPage';

export default function QuizResult() {
  return (
    <>
      <Head>
        <title>Quiz Result - Next Gen CA</title>
        <meta name="description" content="View your quiz results" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Result />
      </Layout>
    </>
  );
}

