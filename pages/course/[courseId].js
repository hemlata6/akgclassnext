import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import CourseDetailWrapper from '../../page-components/Course/CourseDetailWrapper';

export default function CourseDetail() {
  const router = useRouter();
  const { courseId } = router.query;

  return (
    <>
      <Head>
        <title>Course Details - AKG Classes</title>
        <meta name="description" content="View course details and enroll" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <CourseDetailWrapper />
      </Layout>
    </>
  );
}
