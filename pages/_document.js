import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/vghub/cropped-LOGON.jpeg" />
        <link rel="apple-touch-icon" href="/vghub/cropped-LOGON.jpeg" />

        {/* Theme Color */}
        <meta name="theme-color" content="#164e33" />

        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://classiocafinal.in-maa-1.linodeobjects.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://classiocafinal.in-maa-1.linodeobjects.com" />

        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Charset & Compatibility */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Global Site Verification (Add your codes here) */}
        {/* <meta name="google-site-verification" content="your-verification-code" /> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

