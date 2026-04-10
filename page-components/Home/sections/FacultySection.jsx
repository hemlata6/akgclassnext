import Endpoints from "@/config/endpoints";
import instId from "@/config/instituteId";
import { useEffect, useState } from "react";

const FacultyAndStatsSection = () => {

    const [faculties, setFaculties] = useState([]);

    // console.log('faculties', faculties);
    useEffect(() => {
        fetchFaculties();
    }, [])

    const fetchFaculties = async () => {
        try {
            const response = await fetch(`${Endpoints.baseURL}admin/employee/fetch-public-employee/${instId}`);
            const data = await response.json();
            if (data.status && data.employees?.length > 0) {
                setFaculties(data.employees);
            } else {
                setFaculties([
                    {
                        id: 1,
                        firstName: "CA Vipul",
                        lastName: "Dhall",
                        designation: "Director & Lead Faculty",
                        image: "https://placehold.co/300x400/312e81/FFF?text=VD",
                        domains: [{ name: "Accounts & Finance" }]
                    },
                    {
                        id: 2,
                        firstName: "CS Neha",
                        lastName: "Gupta",
                        designation: "Senior Faculty",
                        image: 'https://placehold.co/300x400/831843/FFF?text=NG',
                        domains: [{ name: "Corporate Law" }]
                    },
                    {
                        id: 3,
                        firstName: "CMA Rahul",
                        lastName: "Sen",
                        designation: "Subject Expert",
                        image: 'https://placehold.co/300x400/1e3a8a/FFF?text=RS',
                        domains: [{ name: "Costing & FM" }]
                    },
                    {
                        id: 4,
                        firstName: "CA Amit",
                        lastName: "Jain",
                        designation: "Tax Guru",
                        image: "https://placehold.co/300x400/0f766e/FFF?text=AJ",
                        domains: [{ name: "Direct Taxation" }]
                    },
                    {
                        id: 5,
                        firstName: "Prof. Priya",
                        lastName: "Singh",
                        designation: "Senior Faculty",
                        image: "https://placehold.co/300x400/7c2d12/FFF?text=PS",
                        domains: [{ name: "Audit & Assurance" }]
                    }
                ])
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
        }
    };

    // const FACULTY_DATA = [
    //     {
    //         id: 1,
    //         firstName: "CA Vipul",
    //         lastName: "Dhall",
    //         designation: "Director & Lead Faculty",
    //         profile: "https://placehold.co/300x400/312e81/FFF?text=VD",
    //         domains: [{ name: "Accounts & Finance" }]
    //     },
    //     {
    //         id: 2,
    //         firstName: "CS Neha",
    //         lastName: "Gupta",
    //         designation: "Senior Faculty",
    //         profile: 'https://placehold.co/300x400/831843/FFF?text=NG',
    //         domains: [{ name: "Corporate Law" }]
    //     },
    //     {
    //         id: 3,
    //         firstName: "CMA Rahul",
    //         lastName: "Sen",
    //         designation: "Subject Expert",
    //         profile: 'https://placehold.co/300x400/1e3a8a/FFF?text=RS',
    //         domains: [{ name: "Costing & FM" }]
    //     },
    //     {
    //         id: 4,
    //         firstName: "CA Amit",
    //         lastName: "Jain",
    //         designation: "Tax Guru",
    //         profile: "https://placehold.co/300x400/0f766e/FFF?text=AJ",
    //         domains: [{ name: "Direct Taxation" }]
    //     },
    //     {
    //         id: 5,
    //         firstName: "Prof. Priya",
    //         lastName: "Singh",
    //         designation: "Senior Faculty",
    //         profile: "https://placehold.co/300x400/7c2d12/FFF?text=PS",
    //         domains: [{ name: "Audit & Assurance" }]
    //     }
    // ];


    // const FACULTY_DATA = [
    //     { id: 1, firstName: "CA Vipul Dhall", subject: "Accounts & Finance", role: "Director & Lead Faculty", img: "https://placehold.co/300x400/312e81/FFF?text=VD", bio: "AIR 43, Ex-PwC & Airtel. The conceptual master of Financial Reporting." },
    //     { id: 2, firstName: "CS Neha Gupta", subject: "Corporate Law", role: "Senior Faculty", img: "https://placehold.co/300x400/831843/FFF?text=NG", bio: "Company Secretary with 8 years of experience in NCLT matters." },
    //     { id: 3, firstName: "CMA Rahul Sen", subject: "Costing & FM", role: "Subject Expert", img: "https://placehold.co/300x400/1e3a8a/FFF?text=RS", bio: "All India Ranker in CMA. Expert in practical costing techniques." },
    //     { id: 4, firstName: "CA Amit Jain", subject: "Direct Taxation", role: "Tax Guru", img: "https://placehold.co/300x400/0f766e/FFF?text=AJ", bio: "Practicing CA with deep insights into Income Tax amendments." },
    //     { id: 5, firstName: "Prof. Priya Singh", subject: "Audit & Assurance", role: "Senior Faculty", img: "https://placehold.co/300x400/7c2d12/FFF?text=PS", bio: "Ex-Big 4 Auditor bringing real audit scenarios to the classroom." },
    // ];

    return (
        <section className="bg-slate-50">

            {/* Part 1: Tagline & Stats */}
            <div className="py-16 text-center border-b border-slate-200/60 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        India ke Best Faculty! <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Hum nahi, Humara RESULT bolta hai.</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                        {[{ l: "50000+", s: "Students" }, { l: "180K+", s: "Youtube Subscribers" }, { l: "40+", s: "Courses" }, { l: "5", s: "Renowned Faculty" }].map((s, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-3xl font-black text-slate-800">{s.l}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.s}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Part 2: Faculty Marquee (No Gap from above) */}
            <div className="pt-12 pb-20 overflow-hidden">
                <div className="text-center mb-10 px-4">
                    <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full shadow-sm">Dream Team</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3">Learn From The Masters</h2>
                </div>

                {/* Infinite Marquee */}
                <div className="relative w-full">

                    {/* ✅ MOBILE VIEW (NO SCROLL) */}
                    <div className="grid grid-cols-2 gap-4 md:hidden px-2">
                        {faculties?.length > 0 &&
                            faculties.map((f, index) => (
                                <div
                                    key={`${f.id}-${index}`}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md"
                                >
                                    <div className="relative w-full aspect-[3/4] bg-slate-100">
                                        <img
                                            src={f.profile
                                                ? Endpoints.mediaBaseUrl + f.profile
                                                : f.image}
                                            alt={f.firstName}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                                        {/* Text */}
                                        <div className="absolute bottom-0 left-0 p-3 text-white w-full">
                                            <h3 className="text-sm font-bold leading-tight">
                                                {f.firstName} {f.lastName}
                                            </h3>

                                            <p className="text-[10px] text-indigo-300 font-bold uppercase">
                                                {f.designation}
                                            </p>

                                            <p className="text-[9px] text-slate-300 line-clamp-2">
                                                {f.userRole}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* ✅ DESKTOP VIEW (SCROLLING MARQUEE) */}
                    <div className="hidden md:block overflow-hidden">
                        <div className="flex w-max animate-marquee-infinite group hover:[animation-play-state:paused]">

                            {faculties?.length > 0 &&
                                [...faculties, ...faculties].map((f, index) => (
                                    <div
                                        key={`${f.id}-${index}`}
                                        className="w-72 md:w-80 mx-4 flex-shrink-0 bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="relative w-full aspect-[3/4] bg-slate-100">
                                            <img
                                                src={f.profile
                                                    ? Endpoints.mediaBaseUrl + f.profile
                                                    : f.image}
                                                alt={f.firstName}
                                                className="w-full h-full object-cover"
                                            />

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90"></div>

                                            <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                                                <h3 className="text-xl font-bold">
                                                    {f.firstName} {f.lastName}
                                                </h3>

                                                <p className="text-xs text-indigo-300 font-bold uppercase mt-1">
                                                    {f.designation}
                                                </p>

                                                <p className="text-[10px] text-slate-300 mt-2 line-clamp-2">
                                                    {f.userRole}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                        </div>
                    </div>

                </div>
            </div>

            {/* CSS for Marquee */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-infinite {
                    animation: scroll 40s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default FacultyAndStatsSection;