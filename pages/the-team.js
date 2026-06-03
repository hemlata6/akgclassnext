import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Endpoints from '@/config/endpoints'
import instId from '@/config/instituteId'
import { Footer } from '../components/Shared/SharedComponents'

export default function TheTeam() {
    const [faculties, setFaculties] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFaculties()
    }, [])

    const fetchFaculties = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${Endpoints.baseURL}admin/employee/fetch-public-employee/${instId}`)
            const data = await response.json()
            if (data?.status && Array.isArray(data.employees) && data.employees.length > 0) {
                setFaculties(data.employees)
            } else {
                setFaculties([
                    {
                        id: 1,
                        firstName: 'CA Vipul',
                        lastName: 'Dhall',
                        designation: 'Director & Lead Faculty',
                        image: 'https://placehold.co/300x400/312e81/FFF?text=VD',
                        domains: [{ name: 'Accounts & Finance' }],
                        address: 'Hyderabad, Telangana'
                    },
                    {
                        id: 2,
                        firstName: 'CS Neha',
                        lastName: 'Gupta',
                        designation: 'Senior Faculty',
                        image: 'https://placehold.co/300x400/831843/FFF?text=NG',
                        domains: [{ name: 'Corporate Law' }],
                        address: 'Hyderabad, Telangana'
                    },
                    {
                        id: 3,
                        firstName: 'CMA Rahul',
                        lastName: 'Sen',
                        designation: 'Subject Expert',
                        image: 'https://placehold.co/300x400/1e3a8a/FFF?text=RS',
                        domains: [{ name: 'Costing & FM' }],
                        address: 'Hyderabad, Telangana'
                    }
                ])
            }
        } catch (error) {
            console.error('Error fetching faculties:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Head>
                <title>The Team</title>
                <meta name="description" content="Meet the RCA faculty and team" />
            </Head>

            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 text-amber-600 text-2xl mb-3">🎓</div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#2f3350]">Our Faculty</h1>
                        <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Meet our faculty and their areas of expertise — experienced educators shaping future Chartered Accountants.</p>
                    </div>

                    {loading ? (
                        <p className="text-center text-slate-500">Loading team members…</p>
                    ) : faculties.length === 0 ? (
                        <p className="text-center text-slate-500">No team members found.</p>
                    ) : (
                        <div className="space-y-6">
                            {faculties.map((f) => (
                                <div key={f.id} className="flex flex-col items-center gap-6 bg-white border border-slate-100 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="text-center">
                                        <img
                                            src={Endpoints.mediaBaseUrl + f.profile}
                                            alt={`${f.firstName || ''} ${f.lastName || ''}`}
                                            className="w-36 md:w-50 h-full object-cover rounded-full shadow-md mx-auto"
                                            loading="lazy"
                                        />
                                        <h2 className="text-2xl font-semibold text-slate-900 text-center">{[f.firstName, f.lastName].filter(Boolean).join(' ')}</h2>
                                        {Array.isArray(f.domains) && f.domains.length > 0 && (
                                            <p className="text-sm text-slate-600 mt-2 text-center">Subject: <span className="inline-block bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{f.domains.map(d => d.name).join(', ')}</span></p>
                                        )}
                                        {/* { (f.description || f.about || f.bio) ? ( */}
                                            <div className="text-sm text-slate-600 mt-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: f.address}} />
                                        {/* ) : (
                                            <p className="text-sm text-slate-600 mt-3">{f.address || 'Address not available'}</p>
                                        ) } */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </Layout>
        </>
    )
}
