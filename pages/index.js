import Head from 'next/head';
import Layout from '../components/Layout';
import HomePage from '../page-components/Home/HomePage';

export default function Home() {
  const siteUrl = 'https://caclassestest.netlify.app/';
  const ogImage = 'https://storage.googleapis.com/stepfly-partners-v1-prod.appspot.com/caclass/adminUploads/ca class-logo-circle-white.webp';
  const title = 'iWision | iWision - CA Vipul Dhall';
  const description = 'Get Conceptual Clarity of CA Final IDT - CA Vipul Dhall';
  const keywords = 'CA Final, Financial Reporting, Ind AS, CA FR Courses, iWision, CA Final Preparation, Accounting Standards, FR Video Lectures, CA Study Material';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "iWision",
    "description": description,
    "url": siteUrl,
    "logo": ogImage,
    "sameAs": [
      "https://twitter.com/caclass",
      "https://facebook.com/caclass",
      "https://linkedin.com/company/caclass"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"]
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="iWision" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@caclass" />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <meta name="author" content="iWision" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <Layout>
        <HomePage />
      </Layout>
    </>
  );
}

