import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import BookDetailWrapper from '../../page-components/Course/BookDetailWrapper';

export default function BookDetail() {
  const router = useRouter();
  const { bookId } = router.query;

  return (
    <>
      <Head>
        <title>Book Details - ANM Classes</title>
        <meta name="description" content="View book details and purchase" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <BookDetailWrapper />
      </Layout>
    </>
  );
}
