import React, { useEffect, useState } from 'react'
import { Camera, Heart, Star, X, ZoomIn, ChevronLeft, ChevronRight, Users, Award, Briefcase, Phone } from 'lucide-react';
import Endpoints from '@/config/endpoints';
import { useRouter } from 'next/router';
import Network from '@/config/Network';
import instId from '@/config/instituteId';


const EmployeeList = () => {

    const router = useRouter();

    const [employees, setEmployees] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [itemsPerSlide, setItemsPerSlide] = useState(3);

    const fetchEmployeeList = async () => {
        try {
            const response = await Network.fetchEmployee(instId);

            if (response?.errorCode === 0 && response?.employees) {
                const filteredEmployees = response.employees.filter(
                    emp => emp.showInApp === true
                );

                setEmployees(filteredEmployees);
            } else {
                console.log("Failed to fetch employee list:", response?.message || "Unknown error");
            }
        } catch (error) {
            console.log("Error fetching employee list:", error);
        }
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    useEffect(() => {

        const updateItems = () => {
            if (window.innerWidth < 640) {
                setItemsPerSlide(1); // mobile
            } else if (window.innerWidth < 1024) {
                setItemsPerSlide(2); // tablet
            } else {
                setItemsPerSlide(3); // desktop
            }
        };

        updateItems();
        window.addEventListener("resize", updateItems);

        return () =>
            window.removeEventListener("resize", updateItems);

    }, []);


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

    // console.log('employees', employees);

    return (
        <div className="w-full overflow-hidden">
            <section className="py-3 sm:py-3 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Heading */}
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl md:text-2xl text-green-600 font-bold tracking-widest uppercase">
                            Our Expert Faculty
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto font-medium">
                            Learn from industry professionals with proven expertise and dedication
                        </p>
                    </div>

                    <div className="relative">

                        {/* Arrows */}
                        {employees.length > itemsPerSlide && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    disabled={currentPosition === 0}
                                    className={`absolute left-0 sm:-left-8 top-1/2 -translate-y-1/2 z-20 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 p-2
              ${currentPosition === 0
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>

                                <button
                                    onClick={nextSlide}
                                    disabled={currentPosition >= maxPosition}
                                    className={`absolute right-0 sm:-right-8 top-1/2 -translate-y-1/2 z-20 rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 p-2
              ${currentPosition >= maxPosition
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-purple-100 text-purple-600 hover:bg-purple-200"
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </>
                        )}

                        {/* Employee Cards */}
                        <div className="overflow-hidden rounded-xl">

                            <div
                                className="flex transition-transform duration-700"
                                style={{
                                    transform: `translateX(-${currentPosition * (100 / itemsPerSlide)}%)`,
                                }}
                            >
                                {employees.map((employee, index) => (
                                    <div
                                        key={index}
                                        className="flex-shrink-0 px-2"
                                        style={{
                                            width: `${100 / itemsPerSlide}%`
                                        }}
                                    >
                                        <div
                                            onClick={() => handleFaculty(employee.value)}
                                            className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all cursor-pointer h-full"
                                        >

                                            {/* IMAGE */}
                                            <div className="mb-5">
                                                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden">
                                                    <img
                                                        src={Endpoints.mediaBaseUrl + employee.profile}
                                                        alt={employee.name}
                                                        className="w-full h-full object-cover object-top"
                                                    />
                                                </div>
                                            </div>

                                            {/* INFO */}
                                            <h3 className="font-bold text-lg">
                                                {employee.firstName} {employee.lastName}
                                            </h3>

                                            <div className="flex justify-center gap-2 text-blue-600 mt-2">
                                                <Briefcase size={16} />
                                                <p className="text-sm">
                                                    {employee.designation}
                                                </p>
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