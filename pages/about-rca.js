import Head from 'next/head'
import Layout from '../components/Layout'
import { Footer } from '../components/Shared/SharedComponents'
import React from 'react'
import FacultyAndStatsSection from '@/page-components/Home/sections/FacultySection'

export default function AboutRCA() {
    return (
        <>
            <Head>
                <title>About RCA</title>
                <meta name="description" content="About RCA - Who we are and why choose RCA" />
            </Head>
            <Layout>
                <div className="max-w-7xl mx-auto px-4 py-12 text-lg md:text-xl">
                    <div>
                        <div className="mb-6">
                            <h1 className="text-5xl md:text-4xl font-extrabold text-[#2f3350]">Who We Are?</h1>
                            <div className="mt-6 flex items-start gap-6">
                                <div className="w-1 md:w-1.5 bg-amber-400 rounded h-16 mt-1"></div>
                                <p className="text-[#2f3350] mt-2 text-2xl md:text-xl leading-relaxed tracking-wide max-w-4xl">
                                    We are here to guide you through all that it takes to prefix ‘CA’ to your name. We look forward to a bright career for you and aim at providing you the best teaching facilities.
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none text-lg leading-relaxed tracking-wide space-y-6">
                            <p>
                                RCA is founded with an insight to raise the CA coaching standards in Hyderabad by providing intensive and focused learning at all levels in the CA curriculum Viz., CPT, IPCC, and Final.
                            </p>

                            <p>
                                At RCA, teaching each subject is a well-planned activity. Our faculties are drawn from a combination of industry and academic pool. Each one with their vast knowledge and experience has proven to be the best in his/her respective subjects.
                            </p>

                            <p>
                                We condemn obsolete education and hence our entire faculty is equipped with modern teaching methods. We intend that our students build self-confidence, grit, and dedication to excel in the CA examinations leading to their early emergence as professional Chartered Accountants. We aspire to excel in our work and do complete justice to the responsibility that comes with starting an Academy thus creating leaders for tomorrow.
                            </p>

                            <p>
                                When students are given an opportunity to redirect their lives through positive, alternate educational programs, everyone benefits. At RCA, along with CA coaching, we also aim at providing transformational education through our “Chalk & Talk” sessions to ensure that each student is shaped upon the personality front by imparting different types of learning during the course of the student’s association with the Academy.
                            </p>

                            <p>
                                This diverse program of guest lectures by leading personalities will provide insights into the challenges faced by students which will allow them to quickly bring into being in an atmosphere where success is expected and celebrated.
                            </p>
                        </div>

                        <div className="mt-10">
                            <div className="bg-white border border-slate-100 rounded-lg p-6 shadow-sm">
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Why RCA?</h2>
                                <ul className="space-y-4 text-slate-700 list-disc list-inside text-lg md:text-xl">
                                    <li>Prime focus on concept clarity and principles with practical examples.</li>
                                    <li>High-quality interactive teaching by professional and expert faculties.</li>
                                    <li>Effective knowledge transmission and doubt clarification.</li>
                                    <li>A disciplined and purposive method of study.</li>
                                    <li>Convenient batch timing to ensure self-study along with classes.</li>
                                    <li>Classroom sessions based on exam expectations with memory mapping techniques.</li>
                                    <li>Regular cumulative revisions in the class to complete the subject thoroughly.</li>
                                    <li>Periodical tests during the batch and Mock tests after batch completion with proper evaluation of answer sheets to assess student's performance.</li>
                                    <li>Motivational support, continuous guidance, and a stress-free atmosphere.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                </div>
                <FacultyAndStatsSection />
                <Footer />
            </Layout>
        </>
    )
}
