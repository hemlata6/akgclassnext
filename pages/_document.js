import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/nextgen/nextgenlogo.png" />
        <link rel="apple-touch-icon" href="/nextgen/nextgenlogo.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#164e33" />
        
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://classionextgenmedia.classiolabs.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://classionextgenmedia.classiolabs.com" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Charset & Compatibility */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Global Meta Tags */}
        <meta name="description" content="NextGenCA Academy is a comprehensive digital learning platform providing simplified lectures, structured study materials, and exam-focused preparation for CA and CMA aspirants, helping students achieve conceptual clarity and success in professional exams." />
        <meta name="title" content="NextGenCA Academy | Professional Coaching for CA & CMA" />
        <meta name="keywords" content="CA coaching, CMA coaching, CA exam preparation, professional coaching, accounting courses, NextGenCA Academy" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="NextGenCA Academy" />
        
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

