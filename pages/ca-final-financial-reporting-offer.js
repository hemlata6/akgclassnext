import React from 'react';
import Head from 'next/head';
import {
    Check, X, BookOpen, Clock, Download, Users, Phone, Star,
    MapPin, Calendar, ArrowRight, Award, Zap, Briefcase, Layout as LayoutIcon,
    MessageCircle, PenTool, Video, TrendingUp, Book, PlayCircle, MessageCircleQuestion, Eye, Youtube, Instagram, Send, Globe,
} from 'lucide-react';

export default function CAFinalFROfferPage() {
    return (
        <>
            <Head>
                <title>CA Final FR Course - Financial Reporting by CA Pankaj Aswani | CA Pankaj Aswani</title>
                <meta name="description" content="Master CA Final Financial Reporting with 100% LIVE batch by CA Pankaj Aswani (AIR 43). Concept clarity, Test Series, Mentorship & 24x7 Doubt Support included." />
                <meta property="og:title" content="CA Final FR Course - Master Financial Reporting" />
                <meta property="og:description" content="Learn FR from CA Pankaj Aswani - AIR 43. 100% LIVE Batch with 280 hours, Test Series & Career Mentorship." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://caclasses.in/ca-final-financial-reporting-offer" />
            </Head>

            <FRCoursePage />
        </>
    );
}

function FRCoursePage() {
    return (
        <div className="w-full h-full bg-[#020617] pt-0">
            <div className="min-h-screen bg-[#020617] font-sans text-gray-300 selection:bg-green-500 selection:text-white pb-20 md:pb-0">

                {/* --- TOP BANNER --- */}
                <div className="bg-[#154734] text-white py-2 px-3 text-center text-xs font-medium sticky top-0 z-50 border-b border-green-800 shadow-xl">
                    <div className="flex flex-col md:flex-row justify-center items-center gap-1 md:gap-6">
                        <div className="flex items-center gap-2">
                            <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold animate-pulse">
                                REGISTRATIONS OPEN
                            </span>
                            <span>LIVE Batch starts : <strong>16 March 2026 </strong></span>
                        </div>
                        <span className="hidden md:inline text-white/30">|</span>
                        <span className="text-[10px] md:text-xs opacity-90">
                            Eary Discount Offer promocode <code className="font-mono bg-white/10 px-1 rounded border border-white/20">CAFINAL</code> = <strong>Flat ₹500 OFF on REGULAR Batch</strong>
                        </span>
                    </div>
                </div>

                {/* --- HERO SECTION --- */}
                <section className="relative pt-8 pb-12 md:pt-16 md:pb-24 overflow-hidden">
                    <div className="absolute top-20 right-0 w-64 h-64 bg-green-900/20 rounded-full blur-[80px]"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">

                            {/* Text Content */}
                            <div className="text-center lg:text-left order-2 lg:order-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 md:mb-6 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                                    <span className="text-green-400 font-bold text-xs tracking-widest uppercase">CA Classes by CA Pankaj Aswani</span>
                                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                    <span className="text-gray-400 text-xs font-medium">CA Final FR</span>
                                </div>

                                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-3 md:mb-6">
                                    Master FR with <br className="hidden lg:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                        Concept Clarity
                                    </span>
                                </h1>

                                <p className="text-base md:text-xl font-medium text-white mb-2">
                                    100% LIVE BATCH
                                </p>
                                <p className="text-sm md:text-lg text-gray-400 mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
                                    Taught by <strong>CA Pankaj Aswani (AIR 43)</strong>.<br className="md:hidden" /> Ex-PwC (Big 4) & Ex-Bharti Airtel Ltd. (Manager).
                                </p>

                                <div className="flex flex-col gap-3 justify-center lg:justify-start">
                                    <a
                                        href="#pricing"
                                        className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3.5 text-base md:text-lg font-bold text-white bg-[#154734] rounded-xl hover:bg-green-700 transition-all border border-green-800 shadow-lg shadow-green-900/20"
                                    >
                                        Enroll Now
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </a>
                                </div>
                            </div>

                            {/* Hero Image Card */}
                            <div className="relative mx-auto w-64 md:w-full max-w-xs lg:max-w-sm order-1 lg:order-2">
                                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] p-2 shadow-2xl border border-gray-700">
                                    <div className="aspect-[3/4] bg-[#020617] rounded-[1.5rem] overflow-hidden relative">

                                        {/* Mentor Image */}
                                        <img
                                            src="CA Pankaj Aswani.jpeg"
                                            alt="CA Pankaj Aswani - AIR 43 CA Final Rank Holder"
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Floating Badge */}
                                        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 bg-gray-900/90 backdrop-blur-md p-1.5 md:p-3 rounded-xl border border-gray-700 shadow-xl text-center">
                                            <p className="text-green-400 font-black text-xs md:text-lg leading-tight"> CA Pankaj Aswani</p>
                                            <p className="text-green-400 font-black text-xs md:text-lg leading-tight">AIR 43</p>
                                            <p className="text-[7px] md:text-[9px] uppercase text-gray-400 font-bold mt-0.5">CA Final Rank Holder</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- MENTOR'S JOURNEY (GRID VIEW - NO SCROLL) --- */}
                <section className="py-12 md:py-16 bg-[#0b1221]">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-10 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">My Journey</h2>
                            <p className="text-gray-400 text-xs md:text-sm mt-2">From Academic Excellence to Leading Educator</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

                            <JourneyGridCard
                                year="Graduation"
                                title="B.Com (Hons)"
                                org="Hindu College, Delhi University"
                                desc="Graduated from one of India's top colleges"
                                icon={<Award className="w-5 h-5" />}
                            />

                            <JourneyGridCard
                                year="CA Articleship"
                                title="Big 4 Experience"
                                org="PwC & IBA"
                                desc="Practical exposure in Audit & GST"
                                icon={<Briefcase className="w-5 h-5" />}
                            />
                            <JourneyGridCard
                                year="CA Final"
                                title="All India Rank 43"
                                org="Cleared in First Attempt"
                                desc="Secured multiple exemptions"
                                icon={<Star className="w-5 h-5" />}
                            />

                            <JourneyGridCard
                                year="Work Experience"
                                title="Young Leader"
                                org="Bharti Airtel Ltd."
                                desc="Managed Business finance  for 2 years"
                                icon={<LayoutIcon className="w-5 h-5" />}
                            />

                            <JourneyGridCard
                                year="CA Educator"
                                title="6+ Years of Teaching CA Students"
                                org="2 Lakh+ Students Taught & Mentored"
                                desc="Providing guidance across India"
                                icon={<Users className="w-5 h-5" />}
                            />
                            <JourneyGridCard
                                year="My Students' Top Score"
                                title="Marks in Accounting subject"
                                org={<span>CA Foundation <span className="text-yellow-400 font-bold">97 Marks</span></span>}
                                desc={<span>CA Intermediate <span className="text-yellow-400 font-bold">92 Marks</span></span>}
                                icon={<TrendingUp className="w-5 h-5" />}
                            />

                        </div>
                    </div>
                </section>

                {/* --- COURSE HIGHLIGHTS --- */}
                <section className="py-12 md:py-16 bg-black text-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">

                            <div>
                                <h2 className="text-2xl md:text-4xl font-bold mb-2"> FR Course Highlights</h2>
                                <p className="text-gray-400 text-sm md:text-base mb-6 md:mb-8">Designed for 100% Conceptual Clarity</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    <HighlightPoint icon={<Zap />} title="LIVE Batch" desc="with 100% recorded backup" />
                                    <HighlightPoint icon={<BookOpen />} title="Coverage of SM, PYQ, RTP, MTP" desc="300+ questions solved in class" />
                                    <HighlightPoint icon={<Book />} title="3 Hardcopy of Books" desc="Concept, Practice & MCQ Books" />
                                    <HighlightPoint icon={<Eye />} title="1.8 Views" desc="Highest in the industry" />
                                    <HighlightPoint icon={<PlayCircle />} title="90 Lectures" desc="Covering full syllabus concepts + Questions" />
                                    <HighlightPoint icon={<Clock />} title="280 Hours" desc="Total Batch Duration" />
                                    <HighlightPoint icon={<PenTool />} title="Test Series included" desc="MCQ Cased study + Self evaluated tests" />
                                    <HighlightPoint icon={<MessageCircleQuestion />} title="24x7 Doubt Support" desc="via Call/ Whatsapp/ Telegram" />
                                    <HighlightPoint icon={<Users />} title="Hinglish" desc="Course Language" />
                                    <HighlightPoint icon={<Download />} title="Offline Video Download" desc="Allowed on our Applications" />

                                </div>
                            </div>

                            <div className="relative mt-8 lg:mt-0">
                                <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
                                <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                    <iframe
                                        className="w-full h-64 md:h-80"
                                        src="https://www.youtube.com/embed/hQG88L8nt1w"
                                        title="FR Course Feature Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* --- BOOKS SECTION (Smaller Cards) --- */}
                <section className="py-12 md:py-16 bg-[#0f172a]">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">CA Pankaj Aswani FR Books</h2>
                            <p className="text-gray-400 text-xs md:text-sm mt-2">Hardcopy delivered to your doorstep</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                            <BookCard
                                title="Concept Book"
                                desc="Handwritten Notes by CA Pankaj Aswani"
                                tags={["Multi-Colored Book"]}
                                image="2.png"
                            />
                            <BookCard
                                title="Practice Manual"
                                desc="PYQ, RTP, MTP Questions Clubbed topic-wise"
                                tags={["ICAI Suggested Answers included"]}
                                highlight={true}
                                image="1.png"
                            />
                            <BookCard
                                title="MCQ Compiler"
                                desc="Case studies based questions"
                                tags={["As per ICAI's New Syllabus"]}
                                image="3.png"
                            />
                        </div>

                        <div className="mt-8 md:mt-10 max-w-3xl mx-auto">
                            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                                <iframe
                                    className="w-full h-64 md:h-80"
                                    src="https://www.youtube.com/embed/lt-DwW-MQQ8"
                                    title="FR Books Showcase Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- DETAILED SUPPORT SECTIONS --- */}
                <section className="py-12 md:py-16 bg-[#020617] space-y-12 md:space-y-16">

                    {/* 1. TEST SERIES */}
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="bg-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            <div className="md:w-1/3 flex justify-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-red-900/20 rounded-full flex items-center justify-center text-red-500 border border-red-900/50">
                                    <PenTool className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                            </div>
                            <div className="md:w-2/3 text-center md:text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Test Series</h3>
                                <p className="text-sm md:text-base text-gray-400 mb-6">Rigorous testing mechanism included with FR course.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-left">
                                    <DetailBox title="Case Study Based MCQ Tests" desc="Instant AI Evaluation & Suggested Answers available after Test Submission" />
                                    <DetailBox title="Self-Evaluated Tests" desc="Question Papers as per ICAI latest exam pattern with Suggested Answers" />

                                    <DetailBox title="Faculty Evaluated Tests" desc="Available as Add-on feature at the time of Batch enrollment" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. DOUBT PORTAL */}
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="bg-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800 flex flex-col md:flex-row-reverse items-center gap-6 md:gap-8">
                            <div className="md:w-1/3 flex justify-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-blue-900/20 rounded-full flex items-center justify-center text-blue-500 border border-blue-900/50">
                                    <MessageCircle className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                            </div>
                            <div className="md:w-2/3 text-center md:text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Doubt Support</h3>
                                <p className="text-sm md:text-base text-gray-400 mb-6">We resolve every query</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-left">
                                    <DetailBox title="Live Doubt Sessions" desc="Interactive sessions conducted over Zoom / G-meet" />
                                    <DetailBox title="Private Telegram Group" desc="Dedicated group of enrolled CA Final students" />
                                    <DetailBox title="WhatsApp Support" desc="Send doubts on +91-9310226047" />
                                    <DetailBox title="Call Support" desc="Schedule a doubt call with CA Pankaj Aswani" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. MENTORSHIP */}
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="bg-gray-900 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                            <div className="md:w-1/3 flex justify-center">
                                <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-900/20 rounded-full flex items-center justify-center text-yellow-500 border border-yellow-900/50">
                                    <Briefcase className="w-8 h-8 md:w-10 md:h-10" />
                                </div>
                            </div>
                            <div className="md:w-2/3 text-center md:text-left">
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Career Mentorship Included with FR batch</h3>
                                <p className="text-sm md:text-base text-gray-400 mb-6">Pathway to a successful career</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                                    {["Articleship Guide", "Placement Prep", "Resume Building", "Interview Skills", "Time Mgmt", "Job vs Practice"].map((tag, i) => (
                                        <span key={i} className="bg-black border border-gray-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                </section>

                {/* --- PRICING (Comparison Table) --- */}
                <section id="pricing" className="py-12 md:py-16 bg-[#0b1221]">
                    <div className="max-w-5xl mx-auto px-4">
                        <div className="text-center mb-8 md:mb-10">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Compare Batches</h2>
                            <p className="text-gray-500 text-sm mt-2">Choose what suits you</p>
                        </div>

                        {/* DESKTOP TABLE */}
                        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-800 bg-[#020617]">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-900 text-gray-200 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Features</th>
                                        <th className="px-6 py-4 text-center text-green-400 bg-green-900/10 border-b-2 border-green-600">Regular Batch</th>
                                        <th className="px-6 py-4 text-center">Exam Oriented</th>
                                        <th className="px-6 py-4 text-center">Practice Batch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    <TableRow label="Concepts" regular={true} exam={true} practice={false} />
                                    <TableRow label="Live classes" regular={true} exam={false} practice={false} />
                                    <TableRow label="Recorded classes" regular={true} exam={true} practice={true} />
                                    <TableRow label="ICAI Module Questions" regular={true} exam={true} practice={false} />
                                    <TableRow label="PYQ / RTP / MTP Questions" regular={true} exam={false} practice={true} />

                                    <TableRow label="Concept Book" regular={true} exam={true} practice={false} />
                                    <TableRow label="Practice Manual & MCQ Compiler" regular={true} exam={false} practice={true} />

                                    <TableRow label="Test Series" regular={true} exam={false} practice={false} />
                                    <TableRow label="Mentorship" regular={true} exam={false} practice={false} />
                                </tbody>
                                <tfoot className="bg-gray-900">
                                    <tr>
                                        <td className="px-6 py-4 font-bold text-white">Course Duration</td>
                                        <td className="px-6 py-4 text-center text-xm font-bold text-green-400">280 Hours</td>
                                        <td className="px-6 py-4 text-center text-xm font-bold text-white">220 Hours</td>
                                        <td className="px-6 py-4 text-center text-xm font-bold text-white">80 Hours</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-bold text-white">Course Price (for 1 Year validity)</td>
                                        <td className="px-6 py-4 text-center text-xl font-bold text-green-400">₹8,999</td>
                                        <td className="px-6 py-4 text-center text-xl font-bold text-white">₹5,999</td>
                                        <td className="px-6 py-4 text-center text-xl font-bold text-white">₹4,999</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-bold text-white"></td>
                                        <td className="px-6 py-4 text-center">
                                            <a href="https://caclasses.in/course/3400" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 bg-[#154734] hover:bg-green-700 text-white font-bold text-lg rounded-lg transition-all border border-green-800 shadow-lg">
                                                Enroll Now
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <a href="https://caclasses.in/course/3406" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-lg transition-all border border-gray-700 shadow-lg">
                                                Enroll Now
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <a href="https://caclasses.in/course/3409" target="_blank" rel="noreferrer" className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-lg rounded-lg transition-all border border-gray-700 shadow-lg">
                                                Enroll Now
                                            </a>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* MOBILE COMPACT CARDS */}
                        <div className="md:hidden space-y-4">
                            <MobilePriceCard title="Regular Batch" price="8,999" rec={true} features={[true, true, true, true, true, true, true, true, true]} url="https://caclasses.in/course/3400" />
                            <MobilePriceCard title="Exam Oriented" price="5,999" features={[true, false, true, true, false, true, false, false, false]} url="https://caclasses.in/course/3406" />
                            <MobilePriceCard title="Practice Batch" price="4,999" features={[false, false, true, false, true, false, true, false, false]} url="https://caclasses.in/course/3409" />
                        </div>

                    </div>
                </section>

                {/* --- FOOTER --- */}
                <footer className="bg-black text-white pt-12 pb-28 md:pb-10 border-t border-gray-900 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                        <h2 className="text-xl md:text-2xl font-bold mb-2 tracking-tight">CA Classes by CA Pankaj Aswani</h2>
                        <p className="text-gray-500 text-sm italic mb-8 max-w-md mx-auto">
                            "Together, we can achieve your career goals."
                        </p>

                        {/* Official Social Media Logos */}
                        <div className="flex justify-center gap-8 mb-10 items-center">

                            {/* YouTube - Official SVG */}
                            <a href="https://youtube.com/@CA Pankaj Aswani" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="#FF0000">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>

                            {/* Instagram - Official SVG */}
                            <a href="https://www.instagram.com/vipul.dhall1/" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#instaGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                                    <defs>
                                        <linearGradient id="instaGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#f09433" />
                                            <stop offset="25%" stopColor="#e6683c" />
                                            <stop offset="50%" stopColor="#dc2743" />
                                            <stop offset="75%" stopColor="#cc2366" />
                                            <stop offset="100%" stopColor="#bc1888" />
                                        </linearGradient>
                                    </defs>
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </a>

                            {/* Telegram - Official SVG */}
                            <a href="https://t.me/CAVipuldhall" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="#229ED9">
                                    <path d="M11.944 0C5.356 0 0 5.356 0 11.944c0 6.589 5.356 11.944 11.944 11.944 6.589 0 11.944-5.355 11.944-11.944C23.888 5.356 18.533 0 11.944 0zm5.787 8.356c-.161 1.696-.867 5.867-1.228 7.794-.152.816-.453 1.09-.744 1.117-.633.058-1.113-.418-1.725-.82-.958-.629-1.501-1.02-2.431-1.633-1.074-.707-.378-1.096.234-1.733.161-.166 2.956-2.71 3.011-2.943.007-.03.013-.141-.053-.2-.066-.059-.163-.04-.233-.024-.099.022-1.682 1.07-4.747 3.137-.449.31-.855.462-1.217.455-.399-.008-1.167-.225-1.738-.41-.7-.228-1.257-.349-1.209-.738.025-.203.306-.411.841-.624 3.303-1.439 5.505-2.389 6.608-2.651 3.155-1.106 3.812-1.298 4.24-.106z" />
                                </svg>
                            </a>
                        </div>

                        {/* Contact Chips */}
                        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 font-medium">
                            <a href="https://caclasses.in" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800 hover:border-gray-500 transition-all">
                                <Globe size={14} className="text-green-500" />
                                <span>caclasses.in</span>
                            </a>
                            <a href="tel:+919310226047" className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full border border-gray-800 hover:border-gray-500 transition-all">
                                <Phone size={14} className="text-green-500" />
                                <span>+91 93102 26047</span>
                            </a>
                        </div>

                        {/* Bottom Legal Section */}
                        <div className="border-t border-gray-900 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 tracking-widest uppercase">
                            <p>© 2026 CA Pankaj Aswani. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a href="https://caclasses.in/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="https://caclasses.in/terms-of-use" className="hover:text-white transition-colors">Terms of Service</a>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Sticky Button */}
                    <a
                        href="https://wa.me/919310226047?text=Hi%20CA Pankaj Aswani%2C%20I%20have%20a%20doubt%20regarding%20CA%20classes."
                        target="_blank"
                        rel="noreferrer"
                        className="fixed bottom-20 md:bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl z-50 hover:bg-[#128C7E] transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                    >
                        <MessageCircle size={32} fill="currentColor" />
                    </a>
                </footer>

                {/* --- MOBILE STICKY BOTTOM BAR --- */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-gray-800 p-3 z-50 flex items-center justify-between shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-green-400 font-bold uppercase">Valid till 16th March</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-white">Enroll Now</span>
                        </div>
                    </div>
                    <a href="#pricing" className="bg-[#154734] text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg border border-green-700">
                        View Plans
                    </a>
                </div>

            </div>
        </div>
    );
}

/* --- SUB COMPONENTS --- */

function JourneyGridCard({ year, title, org, desc, icon }) {
    return (
        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-center hover:border-gray-700 transition-colors">
            <div className="w-10 h-10 bg-green-900/30 text-green-400 rounded-full flex items-center justify-center mb-3 mx-auto border border-green-900/50">
                {icon}
            </div>
            <span className="text-xs font-bold text-green-400 block mb-1">{year}</span>
            <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
            <p className="text-xs font-medium text-gray-400 mb-1">{org}</p>
            <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">{desc}</p>
        </div>
    );
}

function HighlightPoint({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-1 text-green-500">{icon}</div>
            <div>
                <h4 className="text-white font-bold text-sm">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
            </div>
        </div>
    );
}

function BookCard({ title, desc, tags, highlight, image }) {
    return (
        <div className={`bg-[#020617] border rounded-xl p-3 flex flex-col items-center text-center max-w-sm mx-auto w-full ${highlight ? 'border-green-600 shadow-[0_0_20px_rgba(22,163,74,0.1)]' : 'border-gray-800'}`}>
            {/* Book Cover Image */}
            <div className="w-full aspect-[3/4] bg-gray-900 rounded-lg mb-3 overflow-hidden border border-gray-800">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <h3 className="text-sm md:text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-[10px] md:text-sm text-gray-400 mb-3 leading-tight">{desc}</p>
            <div className="flex gap-1 md:gap-2 mt-auto flex-wrap justify-center">
                {tags.map((tag, i) => (
                    <span key={i} className="text-[9px] md:text-[10px] px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded">{tag}</span>
                ))}
            </div>
        </div>
    )
}

function DetailBox({ title, desc }) {
    return (
        <div className="bg-black/40 p-2 md:p-3 rounded-lg border border-white/5">
            <p className="text-green-400 font-bold text-xs mb-1">{title}</p>
            <p className="text-gray-400 text-xs">{desc}</p>
        </div>
    )
}

function TableRow({ label, regular, exam, practice }) {
    return (
        <tr className="hover:bg-gray-800/50 transition-colors">
            <td className="px-6 py-3 font-medium text-white">{label}</td>
            <td className="px-6 py-3 text-center bg-green-900/5">{regular ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}</td>
            <td className="px-6 py-3 text-center">{exam ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}</td>
            <td className="px-6 py-3 text-center">{practice ? <Check className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-gray-600 mx-auto" />}</td>
        </tr>
    )
}

function MobilePriceCard({ title, price, features, rec, url }) {
    const featureList = ["Concepts", "Live classes", "Recorded classes", "ICAI Module Questions", "PYQ / RTP / MTP Questions", "Concept Book", "Practice Manual & MCQ Compiler", "Test Series", "Mentorship"];

    return (
        <div className={`p-4 md:p-6 rounded-2xl border ${rec ? 'border-green-600 bg-green-900/10' : 'border-gray-800 bg-gray-900'}`}>
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-white">{title}</h3>
                {rec && <span className="text-[10px] font-bold bg-green-600 text-white px-2 py-0.5 rounded">BEST</span>}
            </div>
            <p className="text-xl font-black text-white mb-4">₹{price}</p>
            <div className="space-y-2 mb-4">
                {features.map((isActive, i) => (
                    <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-400">{featureList[i]}</span>
                        {isActive ? <Check className="w-3.5 h-3.5 text-green-500" /> : <X className="w-3.5 h-3.5 text-gray-700" />}
                    </div>
                ))}
            </div>
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className={`block w-full text-center px-4 py-3 font-bold text-sm rounded-lg transition-all shadow-lg ${rec
                        ? 'bg-[#154734] hover:bg-green-700 text-white border border-green-800'
                        : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700'
                    }`}
            >
                Enroll Now
            </a>
        </div>
    )
}
