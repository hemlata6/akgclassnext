import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Icons } from '../../constants/Icons';
import { Footer } from '../../components/Shared/SharedComponents';
import { ShareButtons } from '../../components/Shared/ShareButtons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import Network from '../../config/Network';

export const BlogDetailPage = ({ courseId: propCourseId, parentId: propParentId, slug: propSlug, initialBlogData }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    // Get params from props (for dynamic route) or router.query (for direct access)
    const courseId = propCourseId || router.query.courseId;
    const parentId = propParentId || router.query.parentId;
    const slug = propSlug || router.query.slug;

    const [blog, setBlog] = useState(initialBlogData || null);
    const [loading, setLoading] = useState(!initialBlogData);

    console.log('Blog params:', { courseId, parentId, slug, hasInitialData: !!initialBlogData });
    console.log('blogblogblogblog', blog);

    // Helper function to truncate text to N words
    const truncateToWords = (text, wordLimit = 50) => {
        if (!text) return '';
        // Remove HTML tags
        const plainText = text.replace(/<[^>]*>/g, '');
        const words = plainText.trim().split(/\s+/);
        if (words.length <= wordLimit) return plainText;
        return words.slice(0, wordLimit).join(' ') + '... read more';
    };

    // Slugify helper function for clean URLs
    const slugify = (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    // Decode and slugify the title from URL params
    const normalizedUrlSlug = slugify(slug);

    useEffect(() => {
        // If we already have initial data from SSR, skip API call
        if (initialBlogData) {
            setBlog(initialBlogData);
            setLoading(false);
            return;
        }

        if (slug && courseId && parentId !== undefined) {
            getMergedSchedules();
        }
    }, [slug, courseId, parentId, initialBlogData]);

    const getMergedSchedules = async () => {
        try {
            setLoading(true);
            // Convert parentId: if it's "0" or not provided, use 0, otherwise parse as integer
            const apiParentId = !parentId || parentId === "0" ? 0 : parseInt(parentId);

            let response = await Network.fetchFreePublicScheduleApi(courseId, apiParentId);
            // butter.page.retrieve(fetchFreePublicScheduleApi(cId, apiParentId), "simple-page")
            //     .then(response => {
            //         console.log(response.data);
            //     });
            const blogList = response?.contentList;
            const blogFilter = blogList?.filter(item => item.entityType === 'blog');

            // Find the blog that matches the title
            const matchedBlog = blogFilter?.find(item => {
                const itemSlug = slugify(item.title);
                // Match against the normalized slug, original slug, or exact title
                return itemSlug === normalizedUrlSlug ||
                    itemSlug === slugify(slug) ||
                    item.title === slug ||
                    item.title === decodeURIComponent(slug);
            });

            if (matchedBlog) {
                console.log('matchedBlog', matchedBlog);

                setBlog(matchedBlog);
                // Signal to react-snap that page is ready
                if (window && typeof window !== 'undefined') {
                    window.snapSaveState = () => ({});
                }
            } else {
                console.log('No matching blog found');
                // Optionally redirect to blog list if no match found
                // router.push('/blog');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setLoading(false);
        }
    };

    // Force meta tag update when blog changes
    useEffect(() => {
        if (blog?.title) {
            document.title = `${blog.title}`;
        }
    }, [blog]);

    if (loading || !blog) {
        return (
            <div className="bg-white min-h-screen pb-20 flex items-center justify-center">
                <p className="text-slate-500">Loading blog...</p>
            </div>
        );
    }

    // Format date
    // const formatDate = (dateStr) => {
    //     try {
    //         return new Date(dateStr).toLocaleDateString('en-US', {
    //             month: 'short',
    //             day: 'numeric',
    //             year: 'numeric'
    //         });
    //     } catch {
    //         return 'Recently';
    //     }
    // };

    // Format date
    const formatDate = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch {
            return 'Recently';
        }
    };

    // Get blog image with fallback - checks all possible image properties
    const getBlogImage = () => {
        if (!blog) return 'https://anmclass.netlify.app/logo.png';

        // Helper to fix old CDN URLs
        const fixCdnUrl = (url) => {
            if (!url) return url;
            return url.replace('classiocafinal.in-maa-1.linodeobjects.com', 'classiocafinal.in-maa-1.linodeobjects.com');
        };

        // Check nested blog.thumb first
        if (blog.blog?.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blog.blog.thumb);

        // Check direct properties - fix full URLs if they contain old domain
        if (blog.featured_image) return fixCdnUrl(blog.featured_image);
        if (blog.img) return fixCdnUrl(Endpoints?.mediaBaseUrl + blog.img);
        if (blog.thumb) return fixCdnUrl(Endpoints?.mediaBaseUrl + blog.thumb);
        if (blog.logo) return fixCdnUrl(Endpoints?.mediaBaseUrl + blog.logo);

        // Default fallback
        return 'https://anmclass.netlify.app/logo.png';
    };

    // Get blog description with 50 word limit
    const getMetaDescription = () => {
        const description = blog?.blog?.blog;
        return truncateToWords(description, 50);
    };

    // Get current URL - use router for consistent URL on server and client
    const blogSlug = `${courseId}-${parentId}-${slug}`;
    const currentUrl = `https://anmclass.netlify.app/blog/${blogSlug}`;
    const blogImage = getBlogImage();
    const metaDescription = getMetaDescription();
    const blogTitle = blog.seo_title || blog.title || 'Blog Post';
    const publishedDate = blog?.blog?.createdAt || blog?.createdAt || new Date().toISOString();
    const authorName = blog?.author?.first_name || blog?.author || 'ANM Classes';

    return (
        <>
            <div className="bg-white min-h-screen pb-20">
                <article className="max-w-3xl mx-auto px-4 py-12">
                    <button onClick={() => router.push('/blog')} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-700 mb-6 transition-colors">
                        <Icons.Back /> Back to Blogs
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>
                    <div className="flex items-center justify-between border-y border-slate-100 py-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-100 overflow-hidden">
                                <img src={Endpoints?.mediaBaseUrl + blog?.blog?.thumb} alt="Author" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-900">
                                    {blog.author?.first_name} {blog.author?.last_name}
                                </p>
                                <p className="text-[10px] text-slate-500">
                                    {formatDate(blog.blog?.createdAt)} • 5 min read
                                </p>
                            </div>
                        </div>
                        <ShareButtons
                            title={blog.title}
                            url={currentUrl}
                            description={metaDescription}
                        />
                    </div>
                    {blog?.blog?.thumb && (
                        <img src={Endpoints?.mediaBaseUrl + blog?.blog?.thumb} alt={blog.title} className="w-full h-auto rounded-2xl mb-8 shadow-lg" />
                    )}
                    <div className="prose prose-slate max-w-none prose-p:text-sm prose-p:leading-7 prose-headings:font-bold prose-a:text-emerald-700">
                        <div dangerouslySetInnerHTML={{ __html: blog.blog?.blog }} />
                    </div>
                </article>
                <Footer />
            </div>
        </>
    );
};

export default BlogDetailPage;

