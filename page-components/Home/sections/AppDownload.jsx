import React from 'react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import { useTheme } from '@/config/ThemeContext';

export const AppDownload = () => {
  const { theme } = useTheme();
  return (
    <section id="app" className="py-10 relative overflow-hidden" style={{ backgroundImage: `linear-gradient(to right, ${theme.primary}15, ${theme.primary}10)` }}>
      <div className={LAYOUT_PADDING}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-black mb-2">Classroom in Your Pocket</h2>
            <p className="text-slate-400 text-sm mb-4 max-w-md">
              Unlimited views, offline downloads, and live chat with CA Pankaj Aswani.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <a
                style={{ borderColor: theme.primary }}
                href="https://play.google.com/store/apps/details?id=com.classiolabs.capankajaswani"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-indigo-600 px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition"
              >
                Google Play
              </a>
              <button className={`bg-white text-indigo-600 border px-4 py-2 border rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition`} style={{ borderColor: theme.primary }}>
                App Store
              </button>
              <button style={{ borderColor: theme.primary }} className="bg-white text-indigo-600 border border-white/20 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-slate-200 transition">
                Window Store
              </button>
            </div>
          </div>

          {/* Device Illustrations */}
          <div className="hidden md:flex items-end gap-4 relative">
            {/* Laptop */}
            <div className="relative">
              <svg width="200" height="140" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Laptop Screen */}
                <rect x="20" y="10" width="160" height="100" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="25" y="15" width="150" height="90" rx="2" fill="#0f172a" />
                {/* Laptop Base */}
                <path d="M 10 110 L 190 110 L 195 120 L 5 120 Z" fill="#334155" stroke="#475569" strokeWidth="2" />
                <rect x="85" y="115" width="30" height="3" rx="1.5" fill="#64748b" />
                {/* Screen Content */}
                <circle cx="100" cy="60" r="15" fill="#10b981" opacity="0.3" />
                <rect x="35" y="75" width="60" height="4" rx="2" fill="#64748b" />
                <rect x="35" y="85" width="40" height="4" rx="2" fill="#64748b" />
              </svg>
            </div>

            {/* Phone */}
            <div className="relative mb-2">
              <svg width="80" height="140" viewBox="0 0 80 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Phone Body */}
                <rect x="10" y="5" width="60" height="130" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                <rect x="15" y="15" width="50" height="100" rx="2" fill="#0f172a" />
                {/* Home Button */}
                <circle cx="40" cy="125" r="6" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                {/* Screen Content */}
                <circle cx="40" cy="50" r="12" fill="#10b981" opacity="0.3" />
                <rect x="20" y="70" width="40" height="3" rx="1.5" fill="#64748b" />
                <rect x="20" y="78" width="30" height="3" rx="1.5" fill="#64748b" />
                <rect x="20" y="86" width="35" height="3" rx="1.5" fill="#64748b" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
};

