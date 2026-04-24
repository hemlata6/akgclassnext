import React from 'react';

const ContactSupportSection = () => {
    const contactCards = [
        {
            id: 1,
            title: "Video Lecture Inquiry",
            contact: "9318492718 / 7703880232"
        },
        {
            id: 2,
            title: "After Sales Support",
            contact: "8882090148"
        },
        {
            id: 3,
            title: "WhatsApp Us On (Available 24 x 7)",
            contact: "9220362206"
        }
    ];

    const handleCall = (phone) => {
        window.location.href = `tel:${phone.split(' / ')[0]}`;
    };

    const handleWhatsApp = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/91${cleanPhone}`, '_blank');
    };

    return (
        <section className="w-full py-12 md:py-16 bg-gradient-to-br from-indigo-50 via-emerald-50/20 to-indigo-100/30">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                        Get In Touch
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Reach out to us for any queries or support
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {contactCards.map((card) => (
                        <div
                            key={card.id}
                            className="flex items-end justify-center group cursor-pointer"
                        >
                            {/* Card Container with stacked effect */}
                            <div className="relative w-full">
                                {/* Top Card */}
                                <div className="relative bg-gradient-to-br from-indigo-50 to-indigo-100 border-2 border-indigo-200 rounded-xl p-6 md:p-7 text-center pt-8 md:pt-10 transition-all duration-300 group-hover:shadow-lg group-hover:border-indigo-300">
                                    <h3 className="text-base md:text-lg font-semibold text-indigo-900">
                                        {card.title}
                                    </h3>
                                </div>

                                {/* Bottom Stacked Bar */}
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                                    <button
                                        onClick={() => {
                                            if (card.id === 3) {
                                                handleWhatsApp(card.contact);
                                            } else {
                                                handleCall(card.contact);
                                            }
                                        }}
                                        className="bg-gradient-to-r from-indigo-700 via-indigo-700 to-indigo-800 hover:from-indigo-800 hover:via-indigo-800 hover:to-indigo-900 text-white font-bold py-2.5 md:py-3 px-5 md:px-7 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 text-xs md:text-sm whitespace-nowrap border-2 border-indigo-600"
                                    >
                                        {card.contact}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-16 text-center">
                    <p className="text-slate-600 text-sm md:text-base">
                        <span className="font-semibold text-indigo-700">📞 Phone:</span> Available Monday - Sunday, 9 AM - 6 PM
                    </p>
                </div>
            </div>
        </section>
    );
};

export default ContactSupportSection;
