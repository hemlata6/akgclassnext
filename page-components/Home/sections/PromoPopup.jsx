import React from 'react';
import { useRouter } from 'next/router';
import { BRAND_GREEN, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../../constants/Icons';

export const PromoPopup = ({ onClose }) => {
  const router = useRouter();
  return (
  <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 bg-slate-900/70 backdrop-blur-sm transition-all duration-300 animate-in fade-in zoom-in">
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full relative">
      <button onClick={onClose} className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors z-20">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className={`relative h-40 ${BRAND_GREEN_CLASS} flex items-center justify-center`}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="text-center text-white z-10 p-6">
          <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block shadow-md">
            New Batch Alert
          </span>
          <h3 className="text-2xl font-bold">CA Final FR Live</h3>
          <p className="text-emerald-100 text-sm mt-1">Enroll early for hardcopy books.</p>
        </div>
      </div>
      <div className="p-5 text-center space-y-4">
        <p className="text-slate-600 text-sm">Master Ind AS with CA Vipul Dhal. Conceptual clarity guaranteed.</p>
        <button
          onClick={() => {
            onClose();
            router.push('/course/fr-live');
          }}
          className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg`}
        >
          View Course Details
        </button>
      </div>
    </div>
  </div>
  );
};

