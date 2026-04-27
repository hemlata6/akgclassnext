import React from 'react';

const ContactSupportSection = () => {
    const phoneNumbers = [
        "9318492718",
        "7703880232",
        "8882090148",
        "9220362206"
    ];

    const handleCall = (phone) => {
        window.location.href = `tel:${phone}`;
    };

    return (
        <>
            <style>{`
                @keyframes zoomPulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.15);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
                
                .hover-zoom-pulse:hover {
                    animation: zoomPulse 0.6s ease-in-out infinite;
                }
            `}</style>
            <section className="w-full bg-blue-600 py-4 md:py-5">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-center flex-wrap gap-6 md:gap-8 text-white text-center">
                        <span className="font-bold text-sm md:text-base">
                            Call for Lecture / Books / Test Series Enquiry:
                        </span>
                        {phoneNumbers.map((phone, index) => (
                            <React.Fragment key={index}>
                                <button
                                    onClick={() => handleCall(phone)}
                                    className="font-bold text-sm md:text-base hover:underline transition-all duration-300 hover-zoom-pulse"
                                >
                                    {phone}
                                </button>
                                {index < phoneNumbers.length - 1 && (
                                    <span className="text-white">|</span>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactSupportSection;
