import React, { useState } from 'react';
import { useTheme } from '../config/ThemeContext';
import { Icons } from '../constants/Icons';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Shared/SharedComponents';
import { StickyMobileFooter } from '../components/Header/Header';
import { useAuth } from '@/config/AuthContext';

const DownloadAppPage = () => {
    const { theme, primaryClass } = useTheme();
    const [hoveredCard, setHoveredCard] = useState(null);
    const { institute } = useAuth();

    const downloadLinks = [
        {
            id: 'android',
            name: 'Google Play Store',
            platform: 'Android',
            description: 'Download for Android devices',
            url: 'https://play.google.com/store/apps/details?id=com.classiolabs.vgstudyhub',
            icon: (
                <img src="/playStoreLogo.jpeg" alt="Google Play Store" className="w-20 h-20 object-contain" />
            ),
            color: 'from-green-50 to-emerald-50',
            accentColor: '#34C759'
        },
        {
            id: 'ios',
            name: 'App Store',
            platform: 'iOS',
            description: 'Download for iPhone & iPad',
            url: 'https://apps.apple.com/in/app/vg-study-hub/id6759287172',
            icon: (
                <img src="/appstoreConnectLogo.png" alt="App Store" className="w-20 h-20 object-contain" />
            ),
            color: 'from-blue-50 to-indigo-50',
            accentColor: '#0071E3'
        },
        {
            id: 'windows',
            name: 'Microsoft Store',
            platform: 'Windows',
            description: 'Download for Windows PC',
            url: 'https://apps.microsoft.com/detail/9PD9K0L5XGD5?hl=en-us&gl=IN&ocid=pdpshare',
            icon: (
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 3.449L9.75 2.1v9.451H0z" fill="#F25022" />
                    <path d="M10.949 2.1L24 0v11.4H10.949z" fill="#7FBA00" />
                    <path d="M0 12.6h9.75V22.05L0 20.699z" fill="#00A4EF" />
                    <path d="M10.949 12.6H24V24l-13.051-1.95z" fill="#FFB900" />
                </svg>
            ),
            color: 'from-cyan-50 to-blue-50',
            accentColor: '#00A4EF'
        },
        {
            id: 'mac',
            name: 'Mac Direct Download',
            platform: 'macOS',
            description: 'Download for Mac',
            url: 'https://baseclassio.b-cdn.net/VG%20Study%20Hub.zip',
            icon: (
                <img src="/macLogo.png" alt="Mac Direct Download" className="w-20 h-20 object-contain" />
            ),
            color: 'from-gray-50 to-slate-50',
            accentColor: '#000000'
        }
    ];

    const handleDownload = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <>
            <Header cartCount={0} />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 py-12 md:py-24">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center justify-center w-24 h-24 ${primaryClass} rounded-full mb-6 shadow-2xl`}>
                            <Icons.Download size={48} className="text-white" />
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">
                            Get {institute?.institue ? institute?.institue : "Rishabh Jain"}
                        </h1>

                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
                            Download our powerful app to access all CA courses, interactive lectures, live chat support, offline study materials, and more — designed for your success on the go.
                        </p>

                        <div className="flex flex-wrap gap-6 justify-center text-slate-700 font-semibold">
                            <div className="flex items-center gap-2">
                                <Icons.Check size={20} className="text-emerald-600" />
                                <span>Free Download</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icons.Check size={20} className="text-emerald-600" />
                                <span>All Platforms</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Icons.Check size={20} className="text-emerald-600" />
                                <span>Instant Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Download Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {downloadLinks.map((link) => (
                            <div
                                key={link.id}
                                className={`bg-white rounded-2xl border-2 border-slate-200 cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:border-[#0a459a]/40 overflow-hidden group`}
                                onMouseEnter={() => setHoveredCard(link.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => handleDownload(link.url)}
                            >
                                {/* Gradient Background */}
                                <div className={`h-1.5 bg-gradient-to-r from-[#0a459a] to-[#073373]`}></div>

                                <div className="p-8 flex flex-col items-center text-center h-full">
                                    {/* Icon Container */}
                                    <div className={`w-24 h-24 flex items-center justify-center mb-6 rounded-2xl bg-gradient-to-br ${link.color} transition-all duration-300 group-hover:shadow-lg`}>
                                        <div className="text-slate-700 group-hover:scale-110 transition-transform duration-300">
                                            {link.icon}
                                        </div>
                                    </div>

                                    {/* Store Name */}
                                    <h3 className="font-bold text-slate-900 text-lg mb-1">{link.name}</h3>

                                    {/* Platform Badge */}
                                    <span className={`inline-block mb-4 text-xs font-semibold px-3 py-1 rounded-full ${primaryClass} bg-opacity-10 text-[#0a459a]`}>
                                        {link.platform}
                                    </span>

                                    {/* Description */}
                                    <p className="text-slate-500 text-sm font-medium mb-6 flex-grow">{link.description}</p>

                                    {/* Download Button */}
                                    <button
                                        onClick={() => handleDownload(link.url)}
                                        className={`w-full bg-gradient-to-r from-[#0a459a] to-[#073373] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:from-[#073373] hover:to-[#05214c] active:scale-95 transform hover:scale-105`}
                                    >
                                        {hoveredCard === link.id ? 'Start Download' : 'Download Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>



                    {/* Footer CTA */}
                    <div className="text-center mt-16 space-y-3">
                        <p className="text-lg text-slate-700 font-semibold">Classroom in Your Pocket</p>
                        <p className="text-slate-500">Study Anywhere, Anytime — Available on All Major Platforms</p>
                        <div className="flex justify-center gap-2 text-xs text-slate-400">
                            <span>✓ Free Download</span>
                            <span>•</span>
                            <span>✓ No Ads</span>
                            <span>•</span>
                            <span>✓ Instant Updates</span>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <StickyMobileFooter cartCount={0} />
        </>
    );
};

export default DownloadAppPage;
