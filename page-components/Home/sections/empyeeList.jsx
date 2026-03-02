import React, { useEffect, useState } from 'react'
import { Camera, Heart, Star, X, ZoomIn, ChevronLeft, ChevronRight, Users, Award, Briefcase, Phone } from 'lucide-react';
import Endpoints from '@/config/endpoints';
import { useRouter } from 'next/router';


const EmployeeList = () => {

    const router = useRouter();
    const [employees, setEmployees] = useState([{
        value: "Sachin Raheja",
        name: "CA Sachin Raheja",
        subtitle: "GST & Economics Mentor",
        image: "/nextgen/sachin-website-pic.jpg",
        description:
            "A Chartered Accountant in first sitting at just 21 years of age, CA Sachin Raheja represents clarity, discipline, and smart strategy. He secured exemptions in GST in both CA Inter and CA Final, reflecting deep conceptual strength and exam mastery.",
        journey:
            "With 1.5+ years of GST experience at EY, he combines practical exposure with academic precision. He is also the author of a concise 26-page GST Revision Book for CA/CMA Inter, designed to simplify complex provisions into exam-focused clarity.",
        otherDes: "Passionate about teaching, his mission is simple: To help students build strong fundamentals, think analytically, and achieve success early — just like he did.",
        highlights: [
            "Complete PYQ, RTP & MTP Coverage",
            "Concept Clarity with Strong Application & Logic",
            "Practical Insights from Professional Experience",
            "Consistent Mentorship for Confidence & Clarity"
        ]
    },
    {
        value: "Manas Arora",
        name: "CA Manas Arora",
        subtitle: "GST & Economics Mentor",
        image: "/nextgen/manas.png",
        description:
            "He is May-23 qualified Chartered Accountant with AIR-47. He has 2 years of post qualification experience at HSBC as a Global Corporate Banker. He has done his Industrial training from Hindalco Industries Limited. He cleared both groups of CA Inter in November 2019 with 7 exemption out of 8 subjects and cleared CA Foundation with AIR-44 in November 2018. He was invited by ICAI branches of Mumbai and Pune and has delivered Leactures on various public forums.",
        journey:
            "He has been teaching Advanced Accounts and Financial Management to CA Inter Students. ",
        otherDes: "CA Manas Arora is of the view that today’s classroom students will be tomorrow’s board meeting attendees, so he teaches with the real life example and practical scenarios which he Learnt during his Banking Job.",
        highlights: [
            "Complete PYQ, RTP & MTP Coverage",
            "Concept Clarity with Strong Application & Logic",
            "Practical Insights from Professional Experience",
            "Consistent Mentorship for Confidence & Clarity"
        ]
    },
    {
        value: "Tejinder Pal Singh",
        name: "CA Tejinder Pal Singh",
        subtitle: "Law Faculty | CA Foundation & CA Inter",
        image: "/nextgen/talwinder.jpeg",
        description:
            "CA Tejinder Pal Singh is a Chartered Accountant known for his strong academic record and disciplined approach to excellence. He secured exemptions in all subjects at the CA Final level and was ranked among the Top 3 in Ludhiana — reflecting his conceptual strength and exam-focused preparation.",
        journey:
            "With 3 years of post-qualification experience at a reputed CA firm and at HDFC Bank, he brings valuable practical exposure to the classroom. His professional background enables him to bridge the gap between theory and real-world application, helping students understand not just the “what” of law, but also the “why” and “how.”",
        otherDes: "His teaching philosophy is simple — make Law easy to understand, practical to relate to, and strategic to score in.",
        highlights: [
            "Learn Law with Logic.",
            "Write with Precision.",
            "Succeed with Confidence."
        ]
    }
    ]);
    const [currentPosition, setCurrentPosition] = useState(0);

    const itemsPerSlide = 3;
    const maxPosition = Math.max(0, employees.length - itemsPerSlide);

    const nextSlide = () => {
        setCurrentPosition((prev) => {
            const newPosition = prev + 1;
            return newPosition > maxPosition ? maxPosition : newPosition;
        });
    };

    const prevSlide = () => {
        setCurrentPosition((prev) => {
            const newPosition = prev - 1;
            return newPosition < 0 ? 0 : newPosition;
        });
    };

    const handleFaculty = (faculty) => {
        let facultyName = faculty.toLowerCase().replace(/\s+/g, '-');
        router.push(`/faculty/${facultyName}`);
    };

    console.log('employees', employees);

    return (
        <div className="w-full">
            <section className="py-3 sm:py-3 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl md:text-2xl text-green-600 font-bold tracking-widest uppercase">  Our Expert Faculty</h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
                            Learn from industry professionals with proven expertise and dedication
                        </p>
                    </div>

                    <div className="relative">
                        {employees.length > itemsPerSlide && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    disabled={currentPosition === 0}
                                    className={`absolute -left-6 sm:-left-8 top-1/2 transform -translate-y-1/2 z-20 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 p-2 sm:p-1 ${currentPosition === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    disabled={currentPosition >= maxPosition}
                                    className={`absolute -right-6 sm:-right-8 top-1/2 transform -translate-y-1/2 z-20 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 p-2 sm:p-1 ${currentPosition >= maxPosition
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}

                        {/* Employee Cards */}
                        <div className="overflow-hidden rounded-xl px-6 sm:px-8">
                            <div
                                className="flex gap-4 transition-transform duration-700 ease-in-out"
                                style={{ transform: `translateX(-${currentPosition * (100 / itemsPerSlide)}%)` }}
                            >
                                {employees.map((employee, index) => (
                                    <div key={index} className="group flex-shrink-0 w-1/3 px-2 sm:px-0">
                                        <div
                                            onClick={() => handleFaculty(employee.value)}
                                            className="bg-white rounded-xl p-4 sm:p-6 text-center shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 cursor-pointer hover:-translate-y-2 overflow-hidden group h-full"
                                        >
                                            {/* Background Glow Effect */}
                                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-100 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                                            {/* Profile Image */}
                                            <div className="relative mb-4 sm:mb-5 z-10">
                                                <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-200 via-purple-200 to-blue-200 p-1 shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110">
                                                    <div className="w-full rounded-full overflow-hidden bg-white">
                                                        {employee.image ? (
                                                            <img
                                                                src={employee.image}
                                                                alt={`${employee.name}`}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-4xl">
                                                                {employee.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Employee Info */}
                                            <div className="space-y-2.5 z-10 relative">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                                                    {employee.name}
                                                </h3>

                                                <div className="flex items-center justify-center gap-1.5 text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                                                    <Briefcase className="w-4 h-4" />
                                                    <p className="font-semibold text-sm line-clamp-1">
                                                        {employee.subtitle || 'Faculty'}
                                                    </p>
                                                </div>

                                                {/* Course Count */}
                                                {employee.courseIds && employee.courseIds.length > 0 && (
                                                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-xs font-bold rounded-full mt-2 border border-blue-100 group-hover:border-purple-200 transition-all duration-300">
                                                        <span className="font-semibold">{employee.courseIds.length}</span> Course{employee.courseIds.length > 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmployeeList