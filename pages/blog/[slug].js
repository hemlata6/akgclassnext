import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { BlogDetailPage } from '../../page-components/Blog/BlogDetailPage';
import Network from '../../config/Network';
import Endpoints from '../../config/endpoints';
import instId from '../../config/instituteId';

export default function BlogDetail({ blogData, error }) {
  const router = useRouter();
  const { slug } = router.query;

  // Parse slug to get courseId, parentId, actualSlug
  let courseId, parentId, actualSlug;
  
  if (slug && slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      courseId = parts[0];
      parentId = parts[1];
      actualSlug = parts.slice(2).join('-');
    } else {
      actualSlug = slug;
    }
  } else {
    actualSlug = slug;
  }

  // Prepare SEO data
  const truncateToWords = (text, wordLimit = 50) => {
    if (!text) return '';
    const plainText = text.replace(/<[^>]*>/g, '');
    const words = plainText.trim().split(/\s+/);
    if (words.length <= wordLimit) return plainText;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const getBlogImage = () => {
    if (!blogData) return 'https://akgclass.netlify.app/logo.png';
    
    // Helper to fix old CDN URLs
    const fixCdnUrl = (url) => {
      if (!url) return url;
      return url.replace('classiocafinal.in-maa-1.linodeobjects.com', 'classiocafinal.in-maa-1.linodeobjects.com');
    };
    
    // Check for blog.thumb first (nested structure)
    if (blogData.blog?.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.blog.thumb);
    // Check direct properties
    if (blogData.featured_image) return fixCdnUrl(blogData.featured_image);
    if (blogData.img) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.img);
    if (blogData.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.thumb);
    if (blogData.logo) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.logo);
    // Default fallback
    return 'https://akgclass.netlify.app/logo.png';
  };

  const getBlogContent = () => {
    if (!blogData) return '';
    return blogData.blog?.blog || blogData.body || blogData.desc || blogData.description || blogData.summary || '';
  };

  const blogTitle = blogData?.seo_title || blogData?.title || 'Blog Post - AKG Classes';
  const blogDescription = blogData ? truncateToWords(
    blogData.meta_description || blogData.summary || blogData.desc || blogData.description || getBlogContent(),
    30
  ) : 'Read insightful articles on Financial Reporting, Ind AS, and Exam Strategies at AKG Classes';
  const blogImage = getBlogImage();
  const currentUrl = `https://akgclass.netlify.app/blog/${slug}/`;
  const publishedDate = blogData?.blog?.createdAt || blogData?.published || blogData?.createdAt || new Date().toISOString();
  const authorName = blogData?.author?.first_name || blogData?.author || 'AKG Classes';

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogData?.title || blogTitle,
    "description": blogDescription,
    "image": blogImage,
    "datePublished": publishedDate,
    "dateModified": publishedDate,
    "author": {
      "@type": "Person",
      "name": authorName
    },
    "publisher": {
      "@type": "Organization",
      "name": "AKG Classes",
      "logo": {
        "@type": "ImageObject",
        "url": "https://akgclass.netlify.app/logo.png"
      }
    }
  };

  return (
    <>
      <Head>
        <title>{blogTitle}</title>
        <meta name="description" content={blogDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />

        {/* Open Graph - Facebook/LinkedIn */}
        <meta property="og:title" content={blogTitle} />
        <meta property="og:description" content={blogDescription} />
        <meta property="og:image" content={blogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={blogTitle} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="AKG Classes" />
        <meta property="og:locale" content="en_US" />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:modified_time" content={publishedDate} />
        <meta property="article:author" content={authorName} />
        <meta property="article:section" content="Education" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blogTitle} />
        <meta name="twitter:description" content={blogDescription} />
        <meta name="twitter:image" content={blogImage} />
        <meta name="twitter:image:alt" content={blogTitle} />
        <meta name="twitter:creator" content="@akgclasses" />
        <meta name="twitter:site" content="@akgclasses" />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="keywords" content="AKG Classes, Financial Reporting, Ind AS, CA Final, Exam Preparation" />

        {/* JSON-LD Structured Data */}
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} 
        />
      </Head>
      <Layout>
        <BlogDetailPage 
          courseId={courseId} 
          parentId={parentId} 
          slug={actualSlug}
          initialBlogData={blogData}
        />
      </Layout>
    </>
  );
}

// Fetch blog data dynamically on each request (SSR)
// Changed from getStaticProps to getServerSideProps for dynamic content
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { res } = context;

  // Set cache headers for better performance
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  );

  // Parse slug
  let courseId, parentId, actualSlug;
  
  if (slug && slug.includes('-')) {
    const parts = slug.split('-');
    if (parts.length >= 3 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      courseId = parts[0];
      parentId = parts[1];
      actualSlug = parts.slice(2).join('-');
    } else {
      actualSlug = slug;
    }
  } else {
    actualSlug = slug;
  }

  try {
    // Fetch blog data from API if courseId and parentId exist
    if (courseId && parentId !== undefined) {
      const apiParentId = !parentId || parentId === "0" ? 0 : parseInt(parentId);
      const response = await Network.fetchFreePublicScheduleApi(courseId, apiParentId);
      const blogList = response?.contentList;
      const blogFilter = blogList?.filter(item => item.entityType === 'blog');

      // Find matching blog
      const slugify = (str) => {
        if (!str) return '';
        return str.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      };

      const normalizedUrlSlug = slugify(actualSlug);
      const matchedBlog = blogFilter?.find(item => {
        const itemSlug = slugify(item.title);
        return itemSlug === normalizedUrlSlug ||
               itemSlug === slugify(actualSlug) ||
               item.title === actualSlug ||
               item.title === decodeURIComponent(actualSlug);
      });

      if (matchedBlog) {
        return {
          props: {
            blogData: matchedBlog,
            error: null
          }
        };
      }
    }

    // Return 404 if blog not found
    return {
      notFound: true
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      props: {
        blogData: null,
        error: error.message
      }
    };
  }
}
