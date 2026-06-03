import Head from 'next/head';
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import Network from '../config/Network';
import Endpoints from '../config/endpoints';
import instId from '../config/instituteId';
import { Footer } from '@/components/Shared/SharedComponents';

export default function HallOfFame() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedImage]);

  return (
    <>
      <Head>
        <title>Hall of Fame</title>
        <meta name="description" content="Hall of Fame - Student gallery" />
      </Head>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 justify-center">
              <span className="text-2xl">🎁</span>
              <h1 className="text-3xl font-semibold">Hall of Fame</h1>
            </div>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Celebrating our top students and their achievements — browse the Hall of Fame.</p>
          </div>

          {loading && (
            <div className="text-center py-8">Loading gallery...</div>
          )}

          {!loading && gallery.length === 0 && (
            <div className="text-center py-8">No images found.</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item.img)}
                className="w-full h-full bg-gray-100 overflow-hidden rounded shadow-sm flex items-center justify-center focus:outline-none"
              >
                <img
                  src={item.img}
                  alt={`hall-of-fame-${item.id}`}
                  loading="lazy"
                  className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                />
              </button>
            ))}
          </div>

          {selectedImage && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedImage(null);
              }}
            >
              <div className="relative w-full h-full max-w-[1400px] max-h-[90vh]">
                <button
                  onClick={() => setSelectedImage(null)}
                  aria-label="Close"
                  className="absolute z-50 right-2 top-2 bg-white/90 rounded-full p-2"
                >
                  ✕
                </button>
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-full object-contain rounded"
                />
              </div>
            </div>
          )}
        </div>
        <Footer />
      </Layout>
    </>
  );
}
