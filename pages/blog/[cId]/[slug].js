import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { BlogDetailPage } from '../../../page-components/Blog/BlogDetailPage';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';

export default function BlogDetail({ blogData, error }) {
    const router = useRouter();
    const { cId, slug } = router.query;

    // Prepare SEO data
    const truncateToWords = (text, wordLimit = 50) => {
        if (!text) return '';
        const plainText = text.replace(/<[^>]*>/g, '');
        const words = plainText.trim().split(/\s+/);
        if (words.length <= wordLimit) return plainText;
        return words.slice(0, wordLimit).join(' ') + '...';
    };


    const getBlogImage = () => {
        if (!blogData) return 'https://vgstudyhub.netlify.app/logo.png';

        // Helper to fix old CDN URLs
        const fixCdnUrl = (url) => {
            if (!url) return url;
            return url.replace('classiocafinal.in-maa-1.linodeobjects.com', 'classiocafinal.in-maa-1.linodeobjects.com');
        };

        // Check for blog.thumb first (nested structure)
        if (blogData.blog?.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.blog.thumb);
        // Check direct properties
        if (blogData.featured_image) return fixCdnUrl(blogData.featured_image);
        if (blogData.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.thumb);
        if (blogData.summary_image) return fixCdnUrl(blogData.summary_image);
        if (blogData.logo) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.logo);
        if (blogData.img) return fixCdnUrl(Endpoints?.mediaBaseUrl + blogData.img);

        return 'https://vgstudyhub.netlify.app/logo.png';
    };

    const blogImage = getBlogImage();
    const blogTitle = blogData?.title || blogData?.blog?.title || 'Blog Post';
    const blogDescription = truncateToWords(
        blogData?.blog?.blog ||
        'Read our latest blog post',
        50
    );
    const blogUrl = `https://vgstudyhub.netlify.app/blog/${cId}/${slug}`;

    return (
        <>
            <Head>
                <title>{blogTitle} | Fast Education Blog</title>
                <meta name="description" content={blogDescription} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="article" />
                <meta property="og:url" content={blogUrl} />
                <meta property="og:title" content={blogTitle} />
                <meta property="og:description" content={blogDescription} />
                <meta property="og:image" content={blogImage} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={blogUrl} />
                <meta name="twitter:title" content={blogTitle} />
                <meta name="twitter:description" content={blogDescription} />
                <meta name="twitter:image" content={blogImage} />

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={blogUrl} />

                {/* Article specific */}
                {blogData?.blog?.author && (
                    <meta property="article:author" content={blogData.blog.author} />
                )}
                {blogData?.blog?.updatedAt && (
                    <meta property="article:published_time" content={blogData.blog.updatedAt} />
                )}
            </Head>

            <Layout>
                <BlogDetailPage blogData={blogData} error={error} cId={cId} />
            </Layout>
        </>
    );
}

export async function getServerSideProps(context) {
    const { cId, slug } = context.params;

    try {
        // Fetch blog data using the cId
        const response = await Network.fetchBlogDetailApi(cId);
        const blogDetail = response?.content;

        if (response && response.errorCode === 0 && blogDetail?.id) {
            return {
                props: {
                    blogData: blogDetail,
                    error: null
                }
            };
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
