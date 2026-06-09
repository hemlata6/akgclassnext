import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Icons } from '../constants/Icons';
import { useAuth } from '@/config/AuthContext';
import { Footer } from '@/components/Shared/SharedComponents';

export default function AboutUs() {
    const { institute } = useAuth();

    const features = [
        {
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                </svg>
            ),
            title: 'Relentless',
            subtitle: 'Motivation',
        },
        {
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
            ),
            title: 'Systematic, Well-planned,',
            subtitle: 'and Focused Guidance',
        },
        {
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
                </svg>
            ),
            title: 'Mindset to',
            subtitle: 'Succeed',
        },
        {
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            ),
            title: 'Quick Memorization Techniques, Shortcuts,',
            subtitle: 'and a Unique System of Notes',
        },
    ];

    return (
        <>
            <Head>
                <title>{`About Us - ${institute?.institue || 'CA Shirish Vyas'}`}</title>
                <meta name="description" content="Learn about CA Shirish Vyas - AIR 42 (1997), mentor to over 1 Lakh students for CA Inter/Final Direct Tax with 27+ years of teaching expertise." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <div className="bg-white min-h-screen">
                    {/* ===================== HERO SECTION ===================== */}
                    <section className="relative overflow-hidden bg-gradient-to-br from-[#191a45] via-[#1e2a5a] to-[#132b5b] py-20 md:py-28">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-indigo-400 blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
                        </div>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                {/* Left Content */}
                                <div className="text-center lg:text-left">
                                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm font-medium mb-6 border border-white/10">
                                        About Us
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                                        About{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">
                                            CA Shirish Vyas
                                        </span>
                                    </h1>
                                    <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-6 mx-auto lg:mx-0"></div>
                                    <p className="text-amber-300/90 font-semibold text-lg mb-6">
                                        AIR 42 - 1997 | Mentored over 1 Lakh+ Students for CA Inter/Final Direct Tax
                                    </p>
                                    <p className="text-white/80 leading-relaxed text-base md:text-lg max-w-xl">
                                        CA Shirish Vyas has been a pioneer in teaching industry taking CA classes in Mumbai for the last 27 years. He is the force behind Prime Vision Professional Education, an education institute founded by him for CA aspirants who want to ace their exams and fulfill their dream of becoming a CA.
                                    </p>
                                </div>
                                {/* Right Image */}
                                <div className="flex justify-center lg:justify-end">
                                    <div className="relative">
                                        <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/30 to-yellow-500/30 rounded-2xl blur-xl"></div>
                                        <img
                                            src="https://cashirishvyas.com/wp-content/uploads/2023/06/ca-shirish-vyas-956x1024.jpg"
                                            alt="CA Shirish Vyas"
                                            className="relative w-72 md:w-80 h-auto rounded-2xl shadow-2xl object-cover border-2 border-white/10"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===================== ABOUT DETAILS SECTION ===================== */}
                    <section className="py-16 md:py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="max-w-4xl mx-auto">
                                <p className="text-slate-700 text-base md:text-lg leading-relaxed mb-6">
                                    At Prime Vision Professional Education, we look at the holistic growth of our CA students by providing what we believe is the best CA coaching in Mumbai. With our unique teaching methodology - CA Shirish Vyas's chosen catchphrases and well-known colour coded notes, our students are equipped with the right skills to learn everything that they need for conceptual understanding within the classroom itself.
                                </p>
                                <p className="text-slate-700 text-base md:text-lg leading-relaxed">
                                    Once they have understood the concept, all they need to do is reinforce the concept through revision. That's the way to ace the CA exams!
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ===================== DIRECT TAX EXPERT SECTION ===================== */}
                    <section className="py-16 md:py-20 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div className="order-2 lg:order-1">
                                    <div className="relative inline-block">
                                        <img
                                            src="https://cashirishvyas.com/wp-content/uploads/2023/06/ca-shirish-vyas-956x1024.jpg"
                                            alt="CA Shirish Vyas - Direct Tax Expert"
                                            className="w-full max-w-md mx-auto lg:mx-0 rounded-2xl shadow-lg"
                                        />
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                        CA SHIRISH VYAS
                                    </h2>
                                    <p className="text-indigo-600 font-semibold text-lg mb-6 uppercase tracking-wide">
                                        The Direct Tax Expert
                                    </p>
                                    <div className="w-16 h-1 bg-indigo-600 rounded-full mb-6"></div>
                                    <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                                        Known specifically for his expertise in teaching Direct Tax for 27 years, CA Shirish Vyas has been an inspiration to thousands of students over the years. His name has become synonymous with 'CA Inter/Final Direct Tax'. Clarity, motivation, and constant revision are things all his students will attest to. He is known for helping students become so well-versed in the subject of Direct Tax that all they need to do on the last day is simply revise a few hours before the day of the exam.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===================== FEATURES / SUPPORT SECTION ===================== */}
                    <section className="py-16 md:py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-14">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                                    How CA Shirish Vyas Supports You
                                </h2>
                                <p className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">
                                    In Your Chartered Accountancy Journey
                                </p>
                                <div className="w-16 h-1 bg-indigo-600 rounded-full mx-auto mt-4"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white border border-slate-200 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 hover:border-indigo-200"
                                    >
                                        <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            {feature.icon}
                                        </div>
                                        <h5 className="text-lg font-bold text-slate-900 leading-tight">
                                            {feature.title}
                                            {feature.subtitle && (
                                                <>
                                                    <br />
                                                    <span className="text-indigo-600">{feature.subtitle}</span>
                                                </>
                                            )}
                                        </h5>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ===================== MESSAGE FROM THE DIRECTOR ===================== */}
                    <section className="py-16 md:py-20 bg-slate-50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                                    Message from the Director
                                </h2>
                                <div className="w-16 h-1 bg-indigo-600 rounded-full mx-auto"></div>
                            </div>

                            <div className="max-w-4xl mx-auto">
                                <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-slate-200">
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="flex-1">
                                            <p className="text-slate-700 leading-relaxed mb-5">
                                                Thank you for the trust you have shown in my teaching and in Prime Vision Professional Education. Our endeavour has always been to be able to support CA students in their journey of becoming successful Chartered Accountants and I have personally always done so through my teaching, mentorship, and guidance.
                                            </p>
                                            <p className="text-slate-700 leading-relaxed mb-5">
                                                In the past, we have been known to provide the best CA coaching in Mumbai (India) and we have now expanded our footprint so that the benefit of our teaching may reach every student in the country. To become a CA, you don't need just the desire, but the determination to put in the hard work. Enrolling in CA classes is just one part, you need to play your part too. And we can work together to achieve this goal!
                                            </p>
                                            <p className="text-slate-700 leading-relaxed mb-5">
                                                Keep your target in mind, and we will help you on the path to achieving that target. By putting in the effort, you will be able to see that your worries will turn into strength and courage, you will be clear in your concepts, and ultimately, you will achieve the success you desire.
                                            </p>
                                            <p className="text-slate-800 font-semibold text-lg mb-6">
                                                Remember – <span className="text-indigo-600 italic">&ldquo;Do Your Best and God will do the Rest.&rdquo;</span>
                                            </p>
                                            <div className="mt-6 pt-6 border-t border-slate-100">
                                                <img
                                                    src="https://cashirishvyas.com/wp-content/uploads/2023/06/shirish-vyas-sign-img.png.webp"
                                                    alt="CA Shirish Vyas Signature"
                                                    className="h-16 object-contain mb-2"
                                                />
                                                <p className="font-bold text-slate-900 text-lg">CA Shirish Vyas</p>
                                                <p className="text-slate-500 text-sm">Director, Prime Vision Professional Education</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
            <Footer />
        </>
    );
}
