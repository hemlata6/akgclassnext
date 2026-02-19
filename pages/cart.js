import Head from 'next/head';
import Layout from '../components/Layout';
import CartPage from '../page-components/Cart/CartPage';

export default function Cart() {
  return (
    <>
      <Head>
        <title>Shopping Cart - NextGenCA</title>
        <meta name="description" content="Review your cart and proceed to checkout" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <CartPage />
      </Layout>
    </>
  );
}

