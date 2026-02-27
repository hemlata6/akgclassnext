import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/cawallah/cawallahlogo.png" />
        <link rel="apple-touch-icon" href="/cawallah/cawallahlogo.png" />
        
        {/* Open Graph for Social Media Sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CA Wallah - Accounting & Financial Reporting Mastery" />
        <meta property="og:description" content="Master CA Foundation, CA Inter, and CA Final with CA Wallah. Simplified concepts, strong fundamentals, and exam-oriented approach trusted by 200,000+ students." />
        <meta property="og:image" content="/cawallah/cawallahlogo.png" />
        <meta property="og:url" content="https://capankajaswani.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CA Wallah - Accounting & Financial Reporting Mastery" />
        <meta name="twitter:description" content="Master CA Foundation, CA Inter, and CA Final with CA Wallah. Simplified concepts, strong fundamentals, and exam-oriented approach." />
        <meta name="twitter:image" content="/cawallah/cawallahlogo.png" />
        
        {/* General Meta Tags */}
        <meta name="description" content="Learn Accounting & Financial Reporting from CA Wallah. Expert guidance for CA Foundation, Inter, and Final with clarity and mentorship." />
        <meta name="keywords" content="CA Wallah, Chartered Accountant, CA Coaching, Financial Reporting, Accounting, CA Foundation, CA Inter, CA Final" />
        
        {/* Theme Color */}
        {/* <meta name="theme-color" content="#164e33" /> */}
        
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://classiocawallah.classiolabs.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://classiocawallah.classiolabs.com" />
        
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

