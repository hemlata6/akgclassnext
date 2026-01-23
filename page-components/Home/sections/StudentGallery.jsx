import React, { useState, useEffect } from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import Network from '../../../config/Network';
import Endpoints from '../../../config/endpoints';
import instId from '../../../config/instituteId';

export const StudentGallery = () => {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await Network.fetchGalley(instId);
            console.log('Gallery response:', response);
            
            if (response && Array.isArray(response)) {
                // Map the array of image paths to objects with full URLs
                const galleryItems = response.map((imagePath, index) => ({
                    id: index,
                    img: Endpoints.mediaBaseUrl + imagePath,
                    // title: `Student ${index + 1}`,
                    // type: 'PHOTO'
                }));
                setGallery(galleryItems);
            }
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-12 bg-white border-t border-slate-200">
            <div className={LAYOUT_PADDING}>
                <div className="text-center mb-10">
                    <span className="text-green-600 font-bold tracking-widest text-xs uppercase">Hall of Fame</span>
                    <h2 className="text-2xl md:text-2xl font-bold text-slate-900 mt-1">Student Wall of Love</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-slate-500">Loading gallery...</p>
                    </div>
                ) : gallery.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500">No images available</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory px-4 md:px-0 -mx-4 md:mx-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {gallery.map((item) => (
                            <div 
                                key={item.id} 
                                className="snap-center shrink-0 w-[240px] bg-white shadow-md border border-slate-200 rounded-2xl p-3 hover:shadow-lg transition-shadow flex flex-col items-center relative overflow-hidden"
                            >
                                <div className="h-48 w-full bg-slate-100 rounded-xl mb-3 overflow-hidden">
                                    <img 
                                        src={item.img} 
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                                        alt={item.title}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-slate-400">No Image</div>';
                                        }}
                                    />
                                </div>
                                <p className="font-bold text-sm text-slate-900">{item.title}</p>
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1 uppercase font-bold">{item.type}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
