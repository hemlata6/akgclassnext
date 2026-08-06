import React, { useState } from 'react';
import { useTheme } from '../../../config/ThemeContext';
import { useAuth } from '../../../config/AuthContext';
import { Icons } from '../../../constants/Icons';

export const AppDownload = () => {
    const { primaryClass, textClass } = useTheme();
    const { institute } = useAuth();
    const [activeTab, setActiveTab] = useState('android');

    const downloadLinks = [
        {
            id: 'android',
            platform: 'Android',
            url: 'https://play.google.com/store/apps/details?id=com.classiolabs.ekatvamacademy&pcampaignid=web_share',
            icon: '/playStoreLogo.jpeg',
            rating: '4.8',
            downloads: '10K+',
            accentBorder: 'border-emerald-400',
        },
        {
            id: 'ios',
            platform: 'iOS',
            url: 'https://apps.apple.com/in/app/vg-study-hub/id6759287172',
            icon: '/appstoreConnectLogo.png',
            rating: '4.9',
            downloads: '5K+',
            accentBorder: 'border-blue-400',
        },
        {
            id: 'windows',
            platform: 'Windows',
            url: 'https://apps.microsoft.com/detail/9PN88P8LD96S?hl=en-us&gl=IN&ocid=pdpshare',
            icon: null,
            iconSvg: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 3.449L9.75 2.1v9.451H0z" fill="#F25022" />
                    <path d="M10.949 2.1L24 0v11.4H10.949z" fill="#7FBA00" />
                    <path d="M0 12.6h9.75V22.05L0 20.699z" fill="#00A4EF" />
                    <path d="M10.949 12.6H24V24l-13.051-1.95z" fill="#FFB900" />
                </svg>
            ),
            rating: '4.6',
            downloads: '2K+',
            accentBorder: 'border-cyan-400',
        },
        {
            id: 'mac',
            platform: 'macOS',
            url: 'https://baseclassio.b-cdn.net/VG%20Study%20Hub.zip',
            icon: '/macLogo.png',
            rating: '4.7',
            downloads: '1K+',
            accentBorder: 'border-slate-400',
        },
    ];

    const activePlatform = downloadLinks.find(l => l.id === activeTab) || downloadLinks[0];

    const handleDownload = (url) => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <section className="relative py-16 md:py-20 overflow-hidden bg-[#111827]">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#0a459a]/15 to-blue-600/8 blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-emerald-600/8 to-teal-500/8 blur-3xl" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

                    {/* Left Content */}
                    <div className="max-w-xl">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#0a459a]/25 bg-[#0a459a]/8 mb-5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-semibold text-slate-300 tracking-wide">Available on All Platforms</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
                            Your Classroom,{' '}
                            <span className="bg-gradient-to-r from-[#0a459a] via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                                Anywhere
                            </span>
                        </h2>

                        <p className="text-sm md:text-base text-slate-400 mb-7 leading-relaxed max-w-lg">
                            Download the <span className="text-white font-semibold">{institute?.institue || 'Rishabh Jain'}</span> app and access 
                            HD lectures, live classes, test series, and offline study — all in your pocket.
                        </p>

                        {/* Platform Pills */}
                        <div className="flex flex-wrap gap-2.5 mb-6">
                            {downloadLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => setActiveTab(link.id)}
                                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 border ${
                                        activeTab === link.id
                                            ? 'bg-[#0a459a] border-[#0a459a] text-white shadow-lg shadow-[#0a459a]/30'
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20'
                                    }`}
                                >
                                    {link.platform}
                                </button>
                            ))}
                        </div>

                        {/* CTA + Stats */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <button
                                onClick={() => handleDownload(activePlatform.url)}
                                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-[#0a459a] to-[#073373] text-white font-bold text-sm rounded-xl shadow-xl shadow-[#0a459a]/30 transition-all duration-300 hover:shadow-[#0a459a]/50 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2.5">
                                    <Icons.Download size={18} />
                                    Download for {activePlatform.platform}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#073373] to-[#0a459a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            {/* <div className="flex items-center gap-5 text-xs text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <Icons.Award size={14} className="text-yellow-500" />
                                    {activePlatform.rating} ★
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Icons.Download size={14} className="text-blue-400" />
                                    {activePlatform.downloads}
                                </span>
                            </div> */}
                        </div>
                    </div>

                    {/* Right - Platform Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 shrink-0">
                        {downloadLinks.map((link) => (
                            <button
                                key={link.id}
                                onClick={() => { setActiveTab(link.id); handleDownload(link.url); }}
                                className={`group relative bg-white/[0.04] hover:bg-white/[0.08] border-2 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl min-w-[110px] sm:min-w-[130px] ${
                                    activeTab === link.id
                                        ? `border-[#0a459a] shadow-[#0a459a]/20`
                                        : 'border-white/[0.06] hover:border-white/[0.14]'
                                }`}
                            >
                                {/* Active indicator dot */}
                                {activeTab === link.id && (
                                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0a459a] shadow-lg shadow-[#0a459a]/50" />
                                )}

                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-2.5 shadow-md group-hover:scale-110 transition-transform duration-300 border border-slate-100`}>
                                    {link.icon ? (
                                        <img src={link.icon} alt={link.platform} className="w-7 h-7 object-contain" />
                                    ) : link.iconSvg}
                                </div>

                                <span className="text-xs font-bold text-slate-200 tracking-tight">{link.platform}</span>
                                <span className="text-[10px] text-slate-500 mt-0.5">{link.rating} ★</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

