import { GetServerSideProps } from 'next';
import Network from '../config/Network';
import instId from '../config/instituteId';

// Helper to slugify
const slugify = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

// Get all blogs
async function getAllBlogs() {
  const allBlogs = [];
  
  async function fetchCourseBlogs(courseId, parentId = 0) {
    try {
      const response = await Network.fetchFreePublicScheduleApi(courseId, parentId);
      const contentList = response?.contentList || [];
      
      for (const item of contentList) {
        if (item.entityType === 'blog') {
          allBlogs.push({
            ...item,
            courseId: courseId,
            parentId: parentId,
            slug: `${courseId}-${parentId}-${slugify(item.title)}`
          });
        } else if (item.entityType === 'folder' && !item.drip) {
          await fetchCourseBlogs(courseId, item.id);
        }
      }
    } catch (error) {
      console.error(`Error fetching blogs:`, error);
    }
  }
  
  try {
    const coursesResponse = await Network.getFreeCourseList(instId);
    const courses = coursesResponse?.courses || [];
    const activeCourses = courses.filter(course => course?.active === true);
    
    for (const course of activeCourses) {
      await fetchCourseBlogs(course.id, 0);
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
  }
  
  return allBlogs;
}

function generateSiteMap(blogs) {
  const baseUrl = 'https://lecturedekho.in';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
           xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
           xmlns:xhtml="http://www.w3.org/1999/xhtml"
           xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
           xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
           xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
     <!-- Static Pages -->
     <url>
       <loc>${baseUrl}/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${baseUrl}/blog/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${baseUrl}/store/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/free-resources/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${baseUrl}/cart/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.5</priority>
     </url>
     <url>
       <loc>${baseUrl}/privacy-policy/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${baseUrl}/refund-policy/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${baseUrl}/terms-of-use/</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.3</priority>
     </url>
     <!-- Dynamic Blog Posts -->
     ${blogs
       .map((blog) => {
         return `
     <url>
       <loc>${baseUrl}/blog/${blog.slug}/</loc>
       <lastmod>${blog.createdAt || new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.7</priority>
     </url>`;
       })
       .join('')}
   </urlset>
 `;
}

export const getServerSideProps = async ({ res }) => {
  try {
    // Fetch all blogs
    const blogs = await getAllBlogs();
    
    // Generate sitemap
    const sitemap = generateSiteMap(blogs);

    res.setHeader('Content-Type', 'text/xml');
    // Cache for 1 hour
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
};

export default function Sitemap() {
  // This component will never be rendered
  return null;
}
