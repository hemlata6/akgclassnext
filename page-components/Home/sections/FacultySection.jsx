import Endpoints from "@/config/endpoints";
import instId from "@/config/instituteId";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const FacultyAndStatsSection = () => {
    const router = useRouter();

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

    // Handle faculty click
    const handleFacultyRedirect = (faculty) => {
        const fullName = typeof faculty === 'string'
            ? faculty
            : [faculty?.firstName, faculty?.lastName].filter(Boolean).join(' ');

        const facultyName = fullName.toLowerCase().trim().replace(/\s+/g, '-');
        const facultyState = {
            faculty: faculty,
        };

        router.push(
            {
                pathname: '/faculty/[facultyname]',
                query: {
                    facultyname: facultyName,
                    state: JSON.stringify(facultyState),
                },
            },
            `/faculty/${facultyName}`
        );
    };

    return (
        <section className="bg-slate-50">
            {/* Part 2: Faculty Marquee (No Gap from above) */}
            <div className="pt-12 pb-20 overflow-hidden">
                <div className="text-center mb-10 px-4">
                    <span className="text-indigo-600 font-bold tracking-widest text-xs uppercase bg-indigo-50 px-3 py-1 rounded-full shadow-sm">Dream Team</span>
                    <h2 className="text-3xl md:text-3xl font-bold text-slate-900 mt-3">Learn From The Masters</h2>
                </div>

                {/* Infinite Marquee */}
                <div className="relative w-full">

                    {/* ✅ MOBILE VIEW (NO SCROLL) */}
                    <div className="grid grid-cols-2 gap-4 md:hidden px-2">
                        {faculties?.length > 0 &&
                            faculties.map((f, index) => (
                                <div
                                    key={`${f.id}-${index}`}
                                    onClick={() => handleFacultyRedirect(f)}
                                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-md cursor-pointer"
                                >
                                    <div className="relative w-full aspect-[3/4] bg-slate-100">
                                        <img
                                            src={f.profile
                                                ? Endpoints.mediaBaseUrl + f.profile
                                                : f.image}
                                            alt={f.firstName}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Text */}
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <div className="w-8 h-0.5 bg-[#0749A2] rounded-full mb-2"></div>
                                            <h3 className="text-sm font-bold leading-tight text-white">
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
                                        onClick={() => handleFacultyRedirect(f)}
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

                                            <div className="absolute"></div>

                                            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-12">
                                                <div className="w-10 h-1 bg-[#0749A2] rounded-full mb-2"></div>
                                                <h3 className="text-xl font-bold text-white">
                                                    {f.firstName} {f.lastName}
                                                </h3>
                                                {/* 
                                                <p className="text-xs text-indigo-300 font-bold uppercase mt-1">
                                                    {f.designation}
                                                </p>

                                                <p className="text-[10px] text-slate-300 mt-2 line-clamp-2">
                                                    {f.userRole}
                                                </p> */}
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