import React from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import { ShieldCheck, Layers, MapPin, Phone, Mail, Calendar, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const router = useRouter();
  const { institute, instituteAppSettingsModals } = useAuth();

  return (
    <footer className="bg-[#111827] text-slate-400 text-xs border-t border-slate-800 tracking-wide">
      {/* Contact Banner */}
      <div className="bg-[#0a459a] py-5 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-white/80 text-xs sm:text-sm font-semibold mb-3 tracking-wide">
            Call for Lecture / Books / Test Series Enquiry:
          </p>

          {/* Mobile: Categorized Grid */}
          <div className="sm:hidden grid grid-cols-1 gap-4 text-center">
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">📞 Sales</p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white font-bold text-sm">
                <a href="tel:8956524481" className="hover:text-white/70 transition-colors">8956524481</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956524482" className="hover:text-white/70 transition-colors">8956524482</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956524483" className="hover:text-white/70 transition-colors">8956524483</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956524484" className="hover:text-white/70 transition-colors">8956524484</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956524485" className="hover:text-white/70 transition-colors">8956524485</a>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">🛠️ Support</p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white font-bold text-sm">
                <a href="tel:8421875672" className="hover:text-white/70 transition-colors">8421875672</a>
              </div>
            </div>
            <div>
              <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-2">🏢 Face-to-Face Enquiry</p>
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-white font-bold text-sm">
                <a href="tel:8956688587" className="hover:text-white/70 transition-colors">8956688587</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956688588" className="hover:text-white/70 transition-colors">8956688588</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956688589" className="hover:text-white/70 transition-colors">8956688589</a>
                <span className="text-white/20">|</span>
                <a href="tel:8956688590" className="hover:text-white/70 transition-colors">8956688590</a>
              </div>
            </div>
          </div>

          {/* Desktop: Single Row with Labels */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-x-1 gap-y-1.5 text-white font-bold text-sm sm:text-base md:text-lg">
            <span className="text-white/60 text-xs font-semibold mr-1">Sales:</span>
            <a href="tel:8956524481" className="px-1.5 hover:text-white/70 transition-colors">8956524481</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956524482" className="px-1.5 hover:text-white/70 transition-colors">8956524482</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956524483" className="px-1.5 hover:text-white/70 transition-colors">8956524483</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956524484" className="px-1.5 hover:text-white/70 transition-colors">8956524484</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956524485" className="px-1.5 hover:text-white/70 transition-colors">8956524485</a>
            <span className="mx-3 text-white/20 hidden md:inline">•</span>
            <span className="text-white/60 text-xs font-semibold mr-1">Support:</span>
            <a href="tel:8421875672" className="px-1.5 hover:text-white/70 transition-colors">8421875672</a>
            <span className="mx-3 text-white/20 hidden md:inline">•</span>
            <span className="text-white/60 text-xs font-semibold mr-1">F2F:</span>
            <a href="tel:8956688587" className="px-1.5 hover:text-white/70 transition-colors">8956688587</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956688588" className="px-1.5 hover:text-white/70 transition-colors">8956688588</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956688589" className="px-1.5 hover:text-white/70 transition-colors">8956688589</a>
            <span className="text-white/20">|</span>
            <a href="tel:8956688590" className="px-1.5 hover:text-white/70 transition-colors">8956688590</a>
          </div>
        </div>
      </div>
      {/* Upper Link Directories Layer Block Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Column 1: Core Corporate Branding Narrative (Span 4) */}
        <div className="lg:col-span-4 space-y-4">
            <div onClick={() => router.push('/')} className="flex items-center gap-2.5 shrink-0 select-none cursor-pointer">
              <div className="bg-[#0a459a] text-white font-black text-base px-2.5 py-1 rounded-lg tracking-tight">RJCE</div>
            <div className="space-y-0.5">
              <h3 className="font-bold tracking-tight text-white text-sm leading-none">
                {institute?.institue ? institute?.institue?.toUpperCase() : "RISHABH JAIN"}
              </h3>
              <span className="text-[8px] uppercase tracking-widest text-slate-400 font-extrabold block font-bold">Commerce Education</span>
            </div>
          </div>
          <p className="text-slate-400 leading-relaxed font-medium">
            {instituteAppSettingsModals?.appBio || "RJCE is a premier commerce education institute dedicated to providing top-notch learning resources and guidance for aspiring professionals."}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-4 text-slate-500 font-bold text-[10px] uppercase">
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500" /> ISO 9001 Certified</span>
            <span className="flex items-center gap-1">🔒 Razorpay Secure Sync</span>
          </div>
        </div>

        {/* Column 2: Product & Course Inventory Links (Span 3) */}
        <div className="lg:col-span-3 space-y-3.5 lg:pl-6">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-[#0a459a]" /> Academic Products
          </h4>
          <ul className="space-y-2.5 font-semibold">
            <li><span onClick={() => router.push('/store?stage=CA-Intermediate')} className="cursor-pointer hover:text-white transition-colors">CA Inter Audit Batches</span></li>
            <li><span onClick={() => router.push('/store?stage=CA-Intermediate')} className="cursor-pointer hover:text-white transition-colors">Strategic Management Classes</span></li>
            <li><span onClick={() => router.push('/store?stage=CA-Intermediate')} className="cursor-pointer hover:text-white transition-colors">CA Inter Combo Lecture Packs</span></li>
            <li><span onClick={() => router.push('/store?stage=CA-Final')} className="cursor-pointer hover:text-white transition-colors">CA Final Advanced Audit Courses</span></li>
            <li><span onClick={() => router.push('/store?stage=CA-Final')} className="cursor-pointer hover:text-white transition-colors">QA Striker & MCQ Master Books</span></li>
            <li><span onClick={() => router.push('/free-resources')} className="cursor-pointer hover:text-white transition-colors text-emerald-400">Free Resources Vault Hub</span></li>
          </ul>
        </div>

        {/* Column 3: General & Statutory Policy Management (Span 2) */}
        <div className="lg:col-span-2 space-y-3.5">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0a459a]" /> Corporate Linkages
          </h4>
          <ul className="space-y-2.5 font-semibold">
            {/* <li><span onClick={() => router.push('/')} className="cursor-pointer hover:text-white transition-colors">About Us Focus</span></li> */}
            {/* <li><span onClick={() => router.push('/download-app')} className="cursor-pointer hover:text-white transition-colors">App Storefront</span></li> */}
            <li><span onClick={() => router.push('/terms-of-use')} className="cursor-pointer hover:text-white transition-colors">Terms & Conditions</span></li>
            <li><span onClick={() => router.push('/refund-policy')} className="cursor-pointer hover:text-white transition-colors">Refund Policy</span></li>
            <li><span onClick={() => router.push('/privacy-policy')} className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span></li>
            <li><span onClick={() => router.push('/download-app')} className="cursor-pointer hover:text-white transition-colors">App Download</span></li>
            <li><span onClick={() => router.push('/contact-us')} className="cursor-pointer hover:text-white transition-colors">Contact Us</span></li>
            {/* <li><span onClick={() => router.push('/contact-us')} className="cursor-pointer hover:text-white transition-colors">Franchise Deck</span></li> */}
          </ul>
        </div>

        {/* Column 4: Contact Directory Coordinates (Span 3) */}
        <div className="lg:col-span-3 space-y-3.5 lg:pl-2">
          <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#0a459a]" /> Help Desk Coordinates
          </h4>
          <ul className="space-y-2.5 font-semibold text-slate-400">
            <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span>{institute?.instituteAppSettingsModals?.contact || "+91 98765 43210"}</span></li>
            <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span className="break-all">{institute?.email || "support@rishabhjain.com"}</span></li>
            <li className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" /> <span className="leading-normal">{institute?.address || "Main F2F Head Center, Pune, Maharashtra, India"}</span></li>
            <li className="flex items-center gap-2 pt-0.5"><Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" /> <span>Mon-Sat (10AM - 6PM)</span></li>
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

