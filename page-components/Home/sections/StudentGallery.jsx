import React, { useState, useEffect } from "react";
import { LAYOUT_PADDING, Icons } from "../../../constants/Icons";
import Network from "../../../config/Network";
import Endpoints from "../../../config/endpoints";
import instId from "../../../config/instituteId";

export const StudentGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    fetchGallery();
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleResize = () => {
    const width = window.innerWidth;

    if (width < 640) setItemsPerView(1);
    else if (width < 1024) setItemsPerView(2);
    else if (width < 1280) setItemsPerView(3);
    else setItemsPerView(4);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      Math.min(prev + 1, gallery.length - itemsPerView)
    );
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const response = await Network.fetchGalley(instId);

      if (response && Array.isArray(response)) {
        const galleryItems = response.map((imagePath, index) => ({
          id: index,
          img: Endpoints.mediaBaseUrl + imagePath,
        }));

        setGallery(galleryItems);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-white border-t border-slate-200">
      <div className={LAYOUT_PADDING}>

        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl text-green-600 font-bold tracking-widest uppercase">
            Student Testimonials
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-500">
            Loading gallery...
          </div>
        ) : (
          <>
            {/* Slider */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                }}
              >
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="flex-shrink-0 px-2"
                    style={{
                      width: `${100 / itemsPerView}%`,
                    }}
                  >
                    <div className="bg-white shadow-md border border-slate-200 rounded-2xl p-3 hover:shadow-lg transition h-full">

                      {/* Image */}
                      <div className="w-full h-[380px] md:h-[420px] bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                        <img
                          src={item.img}
                          alt="Student testimonial"
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            {gallery.length > itemsPerView && (
              <div className="flex justify-center gap-4 mt-8">

                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    currentIndex === 0
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:scale-110 hover:bg-emerald-700"
                  }`}
                >
                  <Icons.ChevronLeft />
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex >= gallery.length - itemsPerView}
                  className={`bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    currentIndex >= gallery.length - itemsPerView
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:scale-110 hover:bg-emerald-700"
                  }`}
                >
                  <Icons.ChevronRight />
                </button>

              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};