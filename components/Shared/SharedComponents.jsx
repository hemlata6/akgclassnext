import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import { ShieldCheck, Layers, MapPin, Phone, Mail, Calendar, Clock, ExternalLink } from 'lucide-react';
import { Facebook, Instagram, LinkedIn, Telegram, YouTube } from '@mui/icons-material';

export const Footer = () => {
  const router = useRouter();
  const { institute, instituteAppSettingsModals } = useAuth();


  return (
    <footer className="w-full overflow-x-hidden bg-[#111827] text-slate-400 text-xs border-t border-slate-800 tracking-wide">
      {/* Contact Banner */}
      
      {/* Upper Link Directories Layer Block Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 grid !grid-cols-1 sm:!grid-cols-2 md:!grid-cols-12 !gap-8">
        {/* Column 1: Core Corporate Branding Narrative (Span 4) */}
        <div className="md:col-span-4 space-y-4 min-w-0">
          <div onClick={() => router.push('/')} className="flex items-center gap-2.5 shrink-0 select-none cursor-pointer">
            <div className="bg-[#0a459a] text-white font-black text-base px-2.5 py-1 rounded-lg tracking-tight">RJCE</div>
            <div className="space-y-0.5">
              <h3 className="font-bold tracking-tight text-white text-sm leading-none">
                {institute?.institue ? institute?.institue?.toUpperCase() : "RISHABH JAIN"}
              </h3>
              <span className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold block font-bold">Commerce Education</span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed font-medium break-words">
            Rishabhh Jainn Commerce Education Is The Best CA Inter & Final Institute In Pune Which Works With Students To Shine In These Examinations And Achieves Their Career And Life Goals.
          </p>
          <div className="pt-1">
            <span className="inline-flex items-center gap-1 text-[#0a459a] bg-[#0a459a]/10 border border-[#0a459a]/20 px-3 py-1.5 rounded-full font-bold text-xs tracking-wide">
              #AuditMaestro
            </span>
          </div>
          <div className="pt-2 flex flex-wrap items-center gap-3">

            {/* Facebook */}
            <a
              href="https://in.linkedin.com/in/rishabhh-jainn-13b8a355"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1877F2] shadow-lg shadow-blue-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            >
              <LinkedIn className="w-5 h-5 text-white" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/rjrishabh/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] shadow-lg shadow-pink-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            >
              <Instagram className="w-5 h-5 text-white" />
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@CARishabhhJainnRJ"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#FF0000] shadow-lg shadow-red-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            >
              <YouTube className="w-5 h-5 text-white" />
            </a>

            {/* Telegram */}
            <a
              href="https://t.me/CARishabhJain"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#229ED9] shadow-lg shadow-cyan-500/30 hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            >
              <Telegram className="w-5 h-5 text-white" />
            </a>

          </div>
        </div>

        {/* Column 2: Contact Directory Coordinates (Span 3) */}
        <div className="md:col-span-3 space-y-3.5 md:pl-2 min-w-0">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0a459a]" /> Contact Us
          </h4>
          <ul className="space-y-2.5 font-semibold text-slate-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed break-words">
                Office No. 71, 2nd Floor,<br />
                Kumar Prestige Point,<br />
                Bajirao Rd, Opp. Chinchechi Talim,<br />
                Shukrawar Peth, Pune,<br />
                Maharashtra 411002
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a href="mailto:support@rishabhjain.com" className="break-all hover:text-white transition-colors">support@rishabhjain.com</a>
            </li>
            {/* <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a href="tel:8421875672" className="break-all hover:text-white transition-colors">8421875672 (Support)</a>
            </li> */}
            <li className="flex items-center gap-2 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Mon - Sat (10:00 AM - 6:00 PM)</span>
            </li>
          </ul>
        </div>

        {/* Column 3: General & Statutory Policy Management (Span 2) */}
        <div className="md:col-span-2 space-y-3.5 min-w-0">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0a459a]" /> Corporate Linkages
          </h4>
          <ul className="space-y-2.5 font-semibold">
            <li><span onClick={() => router.push('/terms-of-use')} className="cursor-pointer hover:text-white transition-colors">Terms & Conditions</span></li>
            <li><span onClick={() => router.push('/refund-policy')} className="cursor-pointer hover:text-white transition-colors">Refund Policy</span></li>
            <li><span onClick={() => router.push('/privacy-policy')} className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span></li>
            <li><span onClick={() => router.push('/download-app')} className="cursor-pointer hover:text-white transition-colors">App Download</span></li>
            <li><span onClick={() => router.push('/contact-us')} className="cursor-pointer hover:text-white transition-colors">Contact Us</span></li>
          </ul>
        </div>

        {/* Column 4: Academia Links (Span 3) */}
        <div className="md:col-span-3 space-y-3.5 md:pl-2 min-w-0">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#0a459a]" /> Academia
          </h4>
          <ul className="space-y-2.5 font-semibold">
            <li><span onClick={() => router.push('/blog')} className="cursor-pointer hover:text-white transition-colors">Blog</span></li>
            <li><span onClick={() => router.push('/')} className="cursor-pointer hover:text-white transition-colors">Become Franchise Partner</span></li>
            <li><span onClick={() => router.push('/free-resources')} className="cursor-pointer hover:text-white transition-colors">Free Resources</span></li>
            <li><span onClick={() => router.push('/store?productType=lecture')} className="cursor-pointer hover:text-white transition-colors">Video Lectures</span></li>
            <li><span onClick={() => router.push('/store?productType=books')} className="cursor-pointer hover:text-white transition-colors">Book Hub</span></li>
          </ul>
        </div>
      </div>

      {/* Lower Disclaimer Copyright Segment */}
      <div className="border-t border-slate-800 py-6 text-center text-[11px] font-semibold text-slate-500 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
          <p>© {new Date().getFullYear()} {institute?.institue || "Rishabh Jain Commerce Education (RJCE)"} Pvt Ltd.</p>
          {/* <span className="hidden sm:inline text-slate-700">|</span> */}
          {/* <p>CIN: U80902MH2023PTC402159</p> */}
        </div>
        {/* <p className="flex items-center gap-1">Platform Infrastructure Architecture Mapped Perfectly <ExternalLink className="w-3 h-3" /></p> */}
      </div>
    </footer>
  );
};

export const SuccessNotification = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-indigo-800 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
        <div className="bg-white/20 p-1 rounded-full"><Icons.Check /></div>
        <div><h4 className="font-bold text-sm">Added to Cart!</h4></div>
      </div>
    </div>
  );
};

export const Loader = () => (
  <div style={{
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0',
    padding: '0'
  }}>
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem'
    }}>
      <img
        src="https://storage.googleapis.com/stepfly-partners-v1-prod.appspot.com/caclass/adminUploads/caclass-logo-circle-white.webp"
        alt="Rishabh Jain Logo"
        style={{
          height: '96px',
          width: 'auto',
          objectFit: 'contain',
          animation: 'loaderPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = 'none';
        }}
      />
    </div>
    <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#164e33',
        borderRadius: '50%',
        animation: 'loaderBounce 1s infinite'
      }}></div>
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#164e33',
        borderRadius: '50%',
        animation: 'loaderBounce 1s infinite',
        animationDelay: '0.1s'
      }}></div>
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#164e33',
        borderRadius: '50%',
        animation: 'loaderBounce 1s infinite',
        animationDelay: '0.2s'
      }}></div>
    </div>
    <style>{`
      @keyframes loaderPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      @keyframes loaderBounce {
        0%, 100% { 
          transform: translateY(0); 
          animation-timing-function: cubic-bezier(0.8, 0, 1, 1); 
        }
        50% { 
          transform: translateY(-10px); 
          animation-timing-function: cubic-bezier(0, 0, 0.2, 1); 
        }
      }
    `}</style>
  </div>
);

