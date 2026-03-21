import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/myeduneed/logo.png" />
        <link rel="apple-touch-icon" href="/myeduneed/logo.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#D4AF37" />
        
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://myeduneedmedia.classiolabs.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://myeduneedmedia.classiolabs.com" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Charset & Compatibility */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Global Meta Tags */}
        <meta name="description" content="Best CA Foundation, Inter, Final Classes in Pune. CA Prashant Sarda is the renowned name in the field of CA Coaching. He is a specialist and expert in subjects like Finance, Business & Economics." />
        <meta name="title" content="Myeduneeds - CA Prashant Sarda Academy" />
        <meta name="keywords" content="CA coaching, CMA coaching, CA exam preparation, professional coaching, accounting courses, MyEduNeeds" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="MyEduNeeds" />
        
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

