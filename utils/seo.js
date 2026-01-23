// Utility functions for SEO meta tags generation

/**
 * Truncate text to specified word limit
 * @param {string} text - Text to truncate
 * @param {number} wordLimit - Maximum number of words
 * @returns {string} Truncated text
 */
export const truncateToWords = (text, wordLimit = 30) => {
  if (!text) return '';
  // Remove HTML tags
  const plainText = text.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/);
  if (words.length <= wordLimit) return plainText;
  return words.slice(0, wordLimit).join(' ') + '...';
};

/**
 * Generate URL-friendly slug from string
 * @param {string} str - String to slugify
 * @returns {string} Slugified string
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Generate meta tags for a page
 * @param {Object} options - Meta tag options
 * @returns {Object} Meta tags object
 */
export const generateMetaTags = (options) => {
  const {
    title = 'AKG Classes',
    description = 'Expert coaching for CA Final - Financial Reporting & Ind AS',
    image = 'https://lecturedekho.in/logo.png',
    url = 'https://lecturedekho.in',
    type = 'website',
    publishedTime = null,
    modifiedTime = null,
    author = 'AKG Classes',
    keywords = 'AKG Classes, CA Final, Financial Reporting, Ind AS',
  } = options;

  return {
    title,
    description,
    canonical: url,
    openGraph: {
      type,
      url,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      site_name: 'AKG Classes',
      locale: 'en_US',
      ...(publishedTime && { article: { published_time: publishedTime } }),
      ...(modifiedTime && { article: { modified_time: modifiedTime } }),
      ...(author && { article: { author } }),
    },
    twitter: {
      card: 'summary_large_image',
      site: '@akgclasses',
      creator: '@akgclasses',
      title,
      description,
      image,
      imageAlt: title,
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: keywords,
      },
      {
        name: 'author',
        content: author,
      },
      {
        name: 'robots',
        content: 'index, follow, max-image-preview:large',
      },
    ],
  };
};

/**
 * Generate JSON-LD structured data for blog post
 * @param {Object} blog - Blog post data
 * @param {string} url - Blog post URL
 * @returns {Object} JSON-LD structured data
 */
export const generateBlogStructuredData = (blog, url) => {
  const {
    title = '',
    description = '',
    image = 'https://lecturedekho.in/logo.png',
    publishedDate = new Date().toISOString(),
    modifiedDate = new Date().toISOString(),
    author = 'AKG Classes',
  } = blog;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: truncateToWords(description, 50),
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'AKG Classes',
      url: 'https://lecturedekho.in',
      logo: {
        '@type': 'ImageObject',
        url: 'https://lecturedekho.in/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
};

/**
 * Generate JSON-LD structured data for organization
 * @returns {Object} JSON-LD structured data
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'AKG Classes',
    url: 'https://lecturedekho.in',
    logo: 'https://lecturedekho.in/logo.png',
    description: 'Expert coaching for CA Final - Financial Reporting & Ind AS by AKG Sir',
    sameAs: [
      // Add your social media URLs
      'https://www.facebook.com/akgclasses',
      'https://www.twitter.com/akgclasses',
      'https://www.linkedin.com/company/akgclasses',
      'https://www.youtube.com/akgclasses',
      'https://www.instagram.com/akgclasses',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@lecturedekho.in',
    },
  };
};

/**
 * Generate breadcrumb structured data
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @returns {Object} JSON-LD structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

/**
 * Extract image URL from blog data with fallback
 * @param {Object} blog - Blog post data
 * @param {string} baseUrl - Base URL for media
 * @returns {string} Image URL
 */
export const getBlogImage = (blog, baseUrl = '') => {
  if (!blog) return 'https://lecturedekho.in/logo.png';
  
  // Helper to fix old CDN URLs
  const fixCdnUrl = (url) => {
    if (!url) return url;
    return url.replace('classiopsacad.in-maa-1.linodeobjects.com', 'classiocafinal.in-maa-1.linodeobjects.com');
  };
  
  // Check nested blog.thumb
  if (blog.blog?.thumb) return fixCdnUrl(baseUrl + blog.blog.thumb);
  
  // Check direct properties
  if (blog.featured_image) return fixCdnUrl(blog.featured_image);
  if (blog.img) return fixCdnUrl(baseUrl + blog.img);
  if (blog.thumb) return fixCdnUrl(baseUrl + blog.thumb);
  if (blog.logo) return fixCdnUrl(baseUrl + blog.logo);
  
  // Default fallback
  return 'https://lecturedekho.in/logo.png';
};

/**
 * Extract blog content/description
 * @param {Object} blog - Blog post data
 * @returns {string} Blog content
 */
export const getBlogContent = (blog) => {
  if (!blog) return '';
  return (
    blog.blog?.blog ||
    blog.body ||
    blog.content ||
    blog.desc ||
    blog.description ||
    blog.summary ||
    ''
  );
};

/**
 * Format date to ISO string
 * @param {string|Date} date - Date to format
 * @returns {string} ISO formatted date
 */
export const formatDate = (date) => {
  try {
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
};

/**
 * Validate and sanitize meta description
 * @param {string} description - Description to validate
 * @param {number} maxLength - Maximum length (default 160)
 * @returns {string} Sanitized description
 */
export const sanitizeMetaDescription = (description, maxLength = 160) => {
  if (!description) return '';
  
  // Remove HTML tags
  const plainText = description.replace(/<[^>]*>/g, '');
  
  // Trim and truncate
  const trimmed = plainText.trim();
  if (trimmed.length <= maxLength) return trimmed;
  
  return trimmed.substring(0, maxLength - 3) + '...';
};

/**
 * Generate unique page title
 * @param {string} pageTitle - Page specific title
 * @param {string} siteName - Site name (default: AKG Classes)
 * @returns {string} Complete page title
 */
export const generatePageTitle = (pageTitle, siteName = 'AKG Classes') => {
  if (!pageTitle) return siteName;
  return `${pageTitle} | ${siteName}`;
};

export default {
  truncateToWords,
  slugify,
  generateMetaTags,
  generateBlogStructuredData,
  generateOrganizationStructuredData,
  generateBreadcrumbStructuredData,
  getBlogImage,
  getBlogContent,
  formatDate,
  sanitizeMetaDescription,
  generatePageTitle,
};
