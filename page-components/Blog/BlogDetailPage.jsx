import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { BRAND_GREEN, Icons } from '../../constants/Icons';
import { ShareButtons } from '../../components/Shared/ShareButtons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import Network from '../../config/Network';
import { Avatar } from '@mui/material';
import { PlayCircle, FileText, Clock, BookOpen, Folder, Music } from 'lucide-react';
import LoginModal from '../../components/Auth/LoginModal';
import SignupModal from '../../components/Auth/SignupModal';
import YouTubePlayer from '../FreeResources/YouTubePlayer';

export const BlogDetailPage = ({ blogData, error, cId }) => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { authToken } = useAuth();
    const { slug } = router.query;

    const [blog, setBlog] = useState(blogData || null);
    const [loading, setLoading] = useState(!blogData);
    const [blogAttachment, setBlogAttachment] = useState([]);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedAudio, setSelectedAudio] = useState(null);
    const [showAudioModal, setShowAudioModal] = useState(false);
    const [slides, setSlides] = useState([
        { type: 'image', url: 'https://placehold.co/1280x720/164e33/FFF?text=Live+Classroom+View', title: 'Live Conceptual Classes' },
        { type: 'image', url: 'https://placehold.co/1280x720/0f3824/FFF?text=Ind+AS+Brahmastra+Book', title: 'Best Selling Books' },
        { type: 'image', url: 'https://placehold.co/1280x720/2d3748/FFF?text=All+India+Rankers', title: 'Proven Results' }
    ]);

    // console.log('Blog params:', { cId, slug, hasBlogData: !!blogData });
    // console.log('blogblogblogblog', blog);


    // Helper function to truncate text to N words
    const truncateToWords = (text, wordLimit = 50) => {
        if (!text) return '';
        // Remove HTML tags
        const plainText = text.replace(/<[^>]*>/g, '');
        const words = plainText.trim().split(/\s+/);
        if (words.length <= wordLimit) return plainText;
        return words.slice(0, wordLimit).join(' ') + '... read more';
    };

    useEffect(() => {
        if (blogData) {
            setBlog(blogData);
            setLoading(false);
            return;
        }
        if (cId) {
            fetchBlogDetail();
        }
    }, [cId, blogData]);

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        if (blog?.id) {
            fetchAttachment();
        }
    }, [blog]);

    const fetchBlogDetail = async () => {
        setLoading(true);
        try {
            const response = await Network.fetchBlogDetailApi(cId);
            const blogDetail = response?.content;

            if (response && response.errorCode === 0 && blogDetail?.id) {
                setBlog(blogDetail);
            } else {
                setBlog(null);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching blog:', error);
        }
    };

    const fetchAttachment = async () => {
        try {
            const response = await Network.fetchBlogAttachment(blog?.id);
            if (response && response.contentList && response.contentList.length > 0) {
                setBlogAttachment(response.contentList);
            } else {
                setBlogAttachment([]);
            }
        } catch (error) {
            console.error('Error fetching attachments:', error);
        }
    };

    const fetchBanners = async () => {
        try {
            const instId = require('../../config/instituteId').default;
            const response = await Network.getBannersApi(instId);
            if (response && response.banners && response.banners.length > 0) {
                const activeBanners = response.banners.filter(banner => banner.active && banner?.group === 'blog');
                if (activeBanners.length > 0) {
                    const bannerSlides = activeBanners.map(banner => ({
                        ...banner,
                        type: 'image',
                        url: Endpoints.mediaBaseUrl + banner.banner,
                        title: banner.title || ''
                    }));
                    setSlides(bannerSlides);
                }
            }
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    // Force meta tag update when blog changes
    useEffect(() => {
        if (blog?.title) {
            document.title = `${blog.title}`;
        }
    }, [blog]);

    if (loading) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading blog...</p>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-500 mb-4">Blog not found</p>
                    <button onClick={() => router.push('/blog')} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                        ← Back to Blogs
                    </button>
                </div>
            </div>
        );
    }

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

    // Helper function to strip HTML tags and get plain text
    const stripHtml = (html) => {
        if (!html) return '';
        return html
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim()
            .substring(0, 200); // Limit to 200 characters
    };

    // Share blog function
    const handleShare = async () => {
        const baseUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:5003'
            : 'https://nextgencaacademy.com/';

        const shareUrl = `${baseUrl}/blog/${cId}/${slug}`;

        const shareData = {
            title: blog.seo_title || blog.title || 'Blog Post',
            url: shareUrl
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    // Handle attachment card click
    const handleAttachmentClick = (item) => {
        if (item?.entityType === "blog") {
            const titleSlug = (item.title || item.name || 'blog')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
            router.push(`/blog/${item?.id}/${titleSlug}`);
            return;
        }

        if (item?.entityType === "video") {
            if (!authToken && !isAuthenticated) {
                setShowLoginWarning(true);
                return;
            }
            if (item?.video?.youtubeUrl) {
                setSelectedVideo(item);
                setOpenDialog(true);
            }
            return;
        }

        if (item?.entityType === "audio") {
            if (!authToken && !isAuthenticated) {
                setShowLoginWarning(true);
                return;
            }
            if (item?.audio?.audio) {
                setSelectedAudio(item);
                setShowAudioModal(true);
            }
            return;
        }

        if (item?.entityType === "note") {
            if (!authToken && !isAuthenticated) {
                setShowLoginWarning(true);
                return;
            }
            if (item?.note?.note) {
                window.open(Endpoints.mediaBaseUrl + item?.note?.note, "_blank");
            }
            return;
        }

        if (item?.entityType === "pdf") {
            if (!authToken && !isAuthenticated) {
                setShowLoginWarning(true);
                return;
            }
            if (item?.pdf?.pdf) {
                window.open(Endpoints.mediaBaseUrl + item?.pdf?.pdf, "_blank");
            }
            return;
        }

        if (item?.entityType === "document") {
            if (!authToken && !isAuthenticated) {
                setShowLoginWarning(true);
                return;
            }
            if (item?.document?.document) {
                window.open(Endpoints.mediaBaseUrl + item?.document?.document, "_blank");
            }
            return;
        }
    };

    const handleLoginWarningConfirm = () => {
        setShowLoginModal(true);
        setShowLoginWarning(false);
    };

    const handleLoginWarningCancel = () => {
        setShowLoginWarning(false);
    };

    const handleCloseVideo = () => {
        setOpenDialog(false);
        setSelectedVideo(null);
    };

    // Sanitize blog HTML to remove style tags that might affect the page
    const sanitizeBlogHtml = (html) => {
        if (!html) return '';
        // Remove all <style> tags and their content to prevent global style leaks
        let sanitized = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        // Also remove style attributes that target body, html, or * selector
        sanitized = sanitized.replace(/style="([^"]*(?:body|html|\*)[^"]*)"/gi, '');
        return sanitized;
    };

    return (
        <div className="bg-white">
            <div className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Section - Blog Content */}
                    <article className="lg:w-[65%]">
                        <button onClick={() => router.push('/blog')} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-6 transition-colors">
                            <Icons.Back /> Back to Blogs
                        </button>
                        {blog.categories && blog.categories.length > 0 && (
                            <span className="text-emerald-600 font-bold tracking-widest text-xs uppercase mb-3 block">
                                {blog.categories[0].name}
                            </span>
                        )}
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            {blog.title}
                        </h1>
                        <div className="flex items-center justify-between border-y border-slate-100 py-4 mb-8">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={blog.featured_image ? blog.featured_image : (blog?.blog?.thumb ? Endpoints.mediaBaseUrl + blog.blog.thumb : '')}
                                    alt={blog?.blog?.author || 'Author'}
                                    sx={{ width: 40, height: 40, backgroundColor: BRAND_GREEN }}
                                >
                                    {(blog?.blog?.author || 'A').charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">
                                        {blog?.blog?.author}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        {formatDate(blog?.blog?.updatedAt)} || <span>{blog?.blog?.readTime ? blog?.blog?.readTime : ""}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleShare}
                                    className="p-3 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
                                    title="Share this blog"
                                >
                                    <div className="w-8 h-8" style={{ transform: 'scale(1.5)' }}>
                                        <Icons.Share />
                                    </div>
                                </button>
                            </div>
                        </div>
                        {(blog.featured_image || blog?.blog?.thumb) && (
                            <img
                                src={blog.featured_image || (blog?.blog?.thumb ? Endpoints.mediaBaseUrl + blog.blog.thumb : '')}
                                alt={blog.title}
                                className="w-full h-auto rounded-2xl mb-8 shadow-lg"
                            />
                        )}
                        {(blog.body || blog?.blog?.blog) ? (
                            <div className="prose prose-slate prose-lg max-w-none prose-p:text-base prose-p:leading-relaxed prose-headings:font-bold prose-a:text-emerald-700 prose-img:rounded-xl prose-img:shadow-lg" style={{ contain: 'layout style paint', isolation: 'isolate' }}>
                                <div
                                    className="blog-content"
                                    dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(blog.body || blog?.blog?.blog || '') }}
                                />
                                <style jsx>{`
                                    .blog-content {
                                        all: revert-layer;
                                        margin: 0;
                                        padding: 0;
                                    }
                                    
                                    /* All links should be clickable with pointer cursor - scoped to blog content only */
                                    :global(.prose) a {
                                        cursor: pointer !important;
                                        color: #059669 !important;
                                        transition: all 0.3s ease;
                                        text-decoration: none;
                                    }
                                    
                                    /* Text links - add underline on hover */
                                    :global(.prose) a:hover {
                                        color: #047857 !important;
                                        text-decoration: underline;
                                    }
                                    
                                    /* Image links - special styling */
                                    :global(.prose) a:has(img) {
                                        display: inline-block;
                                        border: none !important;
                                        background: none !important;
                                        text-decoration: none !important;
                                    }
                                    
                                    /* Images within links */
                                    :global(.prose) a img {
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                    }
                                    
                                    /* Image hover effect - no underline for images */
                                    :global(.prose) a:has(img):hover {
                                        text-decoration: none !important;
                                    }
                                    
                                    :global(.prose) a img:hover {
                                        opacity: 0.8;
                                        transform: scale(1.02);
                                    }
                                `}</style>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-slate-500">No content available for this blog.</p>
                                <button onClick={() => router.push('/blog')} className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold">
                                    ← Back to Blogs
                                </button>
                            </div>
                        )}
                    </article>

                    {/* Right Section - Slides */}
                    <aside className="lg:w-[30%] lg:sticky lg:top-32 self-start">
                        <div className="space-y-4">
                            {slides && slides.length > 0 && slides.map((slide, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                    <img
                                        src={slide.url}
                                        alt={slide.title || `Slide ${index + 1}`}
                                        className="w-full h-auto object-cover"
                                    />
                                    {slide.title && (
                                        <div className="p-3 bg-white">
                                            <p className="text-sm font-semibold text-slate-800">{slide.title}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>

                {/* Blog Attachments Section */}
                {blogAttachment && blogAttachment.length > 0 && (
                    <div className="border-t border-slate-200 mt-16 pt-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                            Related Resources
                        </h2>
                        <p className="text-slate-600 mb-6">Explore additional materials and content related to this blog</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {blogAttachment.map((item, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleAttachmentClick(item)}
                                    className="group bg-white border border-slate-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-emerald-300 flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-32 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                                        {item?.thumb ? (
                                            <img
                                                src={Endpoints.mediaBaseUrl + item.thumb}
                                                alt={item?.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                {item?.entityType === "video" ? (
                                                    <PlayCircle className="w-10 h-10 text-blue-600" strokeWidth={1.5} />
                                                ) : item?.entityType === "audio" ? (
                                                    <Music className="w-10 h-10 text-green-600" strokeWidth={1.5} />
                                                ) : item?.entityType === "blog" ? (
                                                    <BookOpen className="w-10 h-10 text-emerald-600" strokeWidth={1.5} />
                                                ) : (
                                                    <FileText className="w-10 h-10 text-slate-600" strokeWidth={1.5} />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-3 flex-grow flex flex-col">
                                        {/* Title */}
                                        <h3 className="text-slate-900 font-semibold text-sm mb-1.5 line-clamp-2 leading-tight group-hover:text-emerald-700 transition-colors">
                                            {item?.title || 'Resource Title'}
                                        </h3>

                                        {/* Date */}
                                        <div className="flex items-center text-slate-500 text-[11px] mb-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            <span>
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : "Recently Added"}
                                            </span>
                                        </div>

                                        {/* Action Link */}
                                        <div className="mt-auto pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:text-emerald-800">
                                                <span>
                                                    {item?.entityType === "video" ? "Watch" :
                                                        item?.entityType === "audio" ? "Listen" :
                                                            item?.entityType === "blog" ? "Read" : "View"}
                                                </span>
                                                <Icons.ChevronRight />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Login Warning Modal */}
            {showLoginWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-6 text-white">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl">🔐</span>
                                </div>
                                <h2 className="text-2xl font-bold mb-2">Login Required</h2>
                                <p className="text-white/90 text-sm">
                                    You need to be logged in to access this content
                                </p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="text-center mb-6">
                                <p className="text-gray-600 text-sm">
                                    Please login or create an account to access this resource and track your progress.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLoginWarningCancel}
                                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleLoginWarningConfirm}
                                    className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Login Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Dialog */}
            {openDialog && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
                    <button
                        onClick={handleCloseVideo}
                        className="absolute top-6 right-6 z-[1300] w-12 h-12 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 font-bold text-2xl"
                    >
                        ✕
                    </button>
                    <div className="w-full h-screen max-w-6xl flex items-center justify-center pt-8 px-4">
                        <div className="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden">
                            <YouTubePlayer videoUrl={selectedVideo?.video?.youtubeUrl} />
                        </div>
                    </div>
                </div>
            )}

            {/* Audio Modal */}
            {showAudioModal && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
                    <button
                        onClick={() => setShowAudioModal(false)}
                        className="absolute top-6 right-6 z-[1300] w-12 h-12 bg-yellow-400 hover:bg-yellow-300 text-black rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 font-bold text-2xl"
                    >
                        ✕
                    </button>
                    <div className="w-full max-w-2xl">
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
                            <div className="flex items-center justify-center mb-6">
                                <Music className="w-16 h-16 text-green-500 opacity-80" />
                            </div>
                            <audio
                                controls
                                className="w-full"
                                style={{
                                    backgroundColor: '#1f2937',
                                    borderRadius: '12px',
                                    outline: 'none'
                                }}
                            >
                                <source src={Endpoints.mediaBaseUrl + selectedAudio?.audio?.audio} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <p className="text-gray-400 text-sm text-center mt-4">
                                {selectedAudio?.audio?.duration && `Duration: ${selectedAudio.audio.duration}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Modal */}
            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSignupClick={() => setShowSignupModal(true)}
            />
            <SignupModal
                isOpen={showSignupModal}
                onClose={() => setShowSignupModal(false)}
                onLoginClick={() => {
                    setShowSignupModal(false);
                    setShowLoginModal(true);
                }}
            />

        </div>
    );
};

export default BlogDetailPage;

