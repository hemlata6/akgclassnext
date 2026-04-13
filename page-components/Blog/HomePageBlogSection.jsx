import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../../constants/Icons';
import Network from '../../../config/Network';
import instId from '../../../config/instituteId';
import Endpoints from '../../../config/endpoints';

export const BlogSection = () => {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseId, setCourseId] = useState(null);

    useEffect(() => {
        fetchBlogsForHomepage();
    }, []);

    const fetchBlogsForHomepage = async () => {
        try {
            setLoading(true);
            // First get courses with currentAffair flag
            const coursesResponse = await Network.getFreeCourseList(instId);
            const courses = coursesResponse?.courses || [];
            const blogCourses = courses.filter(course => course?.active === true && course?.currentAffair === true);

            if (blogCourses.length > 0) {
                const firstCourse = blogCourses[0];
                setCourseId(firstCourse.id);

                // Fetch blogs from getCourseContent API
                const body = {
                    "courseId": firstCourse.id,
                    "contentTypes": ["blog"],
                    "page": 0,
                    "pageSize": 4 // Only fetch 4 blogs for homepage
                };

                const response = await Network.fetchAllContentFromCourse(body);
                if (response?.errorCode === 0 && response?.contentList) {
                    const blogList = response.contentList.filter(item => item.entityType === 'blog');
                    setBlogs(blogList.slice(0, 4)); // Ensure max 4 blogs
                }
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const slugify = (str) => {
        if (!str) return '';
        return str.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleBlogClick = (blog) => {
        const titleSlug = slugify(blog.title || '');
        router.push(`/blog/${blog?.id}/${titleSlug}`);
    };

    const handleExploreBlog = () => {
        router.push('/blog');
    };

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-b from-white to-slate-50">
                <div className={LAYOUT_PADDING}>
                    <div className="text-center">
                        <p className="text-slate-500">Loading blogs...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (blogs.length === 0) {
        return null; // Don't show section if no blogs
    }

    return (
        <section className="py-16 bg-gradient-to-b from-white to-slate-50">
            <div className={LAYOUT_PADDING}>
                {/* Section Header */}
                <div className="text-center mb-12">
                    <span className="text-teal-700 font-bold tracking-widest text-xs uppercase mb-2 block">
                        Latest Updates
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Insights & Articles
                    </h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Stay updated with the latest in Financial Reporting, Exam Strategies, and Ind AS Amendments
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {blogs.map((blog, idx) => (
                        <div
                            key={blog.id || idx}
                            onClick={() => handleBlogClick(blog)}
                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-slate-200 group cursor-pointer hover:-translate-y-2"
                        >
                            {/* Blog Image */}
                            <div className="h-48 overflow-hidden relative bg-gradient-to-br from-teal-50 to-slate-100">
                                {(blog.img || blog.thumb || blog.logo) ? (
                                    <img
                                        src={Endpoints.mediaBaseUrl + (blog.img || blog.thumb || blog.logo)}
                                        alt={blog.title || 'Blog'}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <Icons.FileText className="w-12 h-12 text-teal-600 opacity-50" />
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-teal-700/95 backdrop-blur-sm px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
                                    Article
                                </div>
                            </div>

                            {/* Blog Content */}
                            <div className="p-5">
                                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3 font-semibold uppercase tracking-wider">
                                    <span className="flex items-center gap-1.5">
                                        <Icons.Calendar className="w-3.5 h-3.5 text-teal-600" />
                                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        }) : 'Recent'}
                                    </span>
                                </div>

                                <h3 className="font-bold text-base text-slate-900 mb-3 leading-tight group-hover:text-teal-700 transition-colors duration-200 line-clamp-2">
                                    {blog.title || 'Untitled'}
                                </h3>

                                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                                    <div dangerouslySetInnerHTML={{ __html: blog.desc || blog.description || 'Click to read more...' }} />
                                </p>

                                <button className="text-teal-700 font-bold text-xs flex items-center gap-1.5 group/btn hover:text-teal-900 transition-colors">
                                    Read More
                                    <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Explore Blog Button */}
                <div className="text-center">
                    <button
                        onClick={handleExploreBlog}
                        className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 shadow-lg"
                    >
                        Explore All Blogs
                        <Icons.ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};
