import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-20 px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">404 - Page Not Found</h1>
            <p className="text-slate-600 mb-8">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-brandGreen text-white px-6 py-3 rounded-lg font-bold hover:bg-brandGreenHover transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}

