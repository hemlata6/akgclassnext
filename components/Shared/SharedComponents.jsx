import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';
import instId from '@/config/instituteId';
import Network from '@/config/Network';

export const Footer = () => {
  const router = useRouter();
  const { institute } = useAuth();

  const handleCourseClick = (examStage) => {
    const isMobile = sessionStorage.getItem('isMobile');
    const token = sessionStorage.getItem('token');

    sessionStorage.setItem('storeNavigationState', JSON.stringify({
      source: 'footer',
      selectedDomainName: 'CA',
      selectedExamStageName: examStage,
      isMobile: isMobile ? true : false,
      token: token || null
    }));
    router.push('/store');
  };

  const [domains, setDomains] = React.useState([]);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await Network.fetchDomain(instId);
      const availableDomains = response?.domains || [];
      setDomains(availableDomains);
    } catch (error) {
      console.error('Error fetching domains:', error);
    }
  };

  return (
    /* Themed background setup using dark brand navy coordinates instead of raw slate black */
    <footer className="bg-[#191a45] text-slate-300 pt-10 pb-24 md:pb-10 border-t border-[#121333]">
      <div className={LAYOUT_PADDING}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">

          <div className="col-span-2 md:col-span-1">
            <div
              onClick={() => window.location.href = "/"}
              className="text-white font-bold text-lg mb-2 flex items-center gap-2 cursor-pointer p-1 bg-white"
            >
              <img src="/logo.png" alt="Next Gen CA Logo" className="h-[2.5rem] object-contain" />
            </div>
            <p className="text-slate-400 leading-relaxed">
              Right from CA Foundation to CA Finals, CA Shirish Vyas excels in his role as a teacher but he also ensures that his students know how to deal with the ups and downs of this CA Journey. Our aim is to provide the best CA coaching for young CA Aspirants.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 tracking-wide">Courses</h4>
            <ul className="space-y-2">
              {domains?.map((domain) => (
                <li
                  key={domain.id}
                  onClick={() => {
                    let navigationData = {
                      source: 'header',
                      selectedDomainName: domain.name,
                      productType: 'lecture'
                    };

                    if (domain.parentId === 0) {
                      navigationData.selectedDomainId = domain.id;
                      if (domain.child?.length > 0) {
                        navigationData.selectedExamStageId = domain.child[0].id;
                      }
                    } else {
                      navigationData.selectedDomainId = domain.parentId;
                      navigationData.selectedExamStageId = domain.id;
                    }

                    sessionStorage.setItem('storeNavigationState', JSON.stringify(navigationData));
                    router.push('/store');
                  }}
                  /* Hover links now transition cleanly to your teal accent accent color */
                  className="cursor-pointer hover:text-[#00a896] transition-colors"
                >
                  {domain.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 tracking-wide">Important Links</h4>
            <ul className="space-y-2">
              <li
                onClick={() => router.push('/about-us')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                About Us
              </li>
              <li
                onClick={() => router.push('https://www.icai.org/')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                ICAI
              </li>
              <li
                onClick={() => router.push('https://www.icmai.in/Home/Index')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                ICMAI
              </li>
              <li
                onClick={() => router.push('https://www.accaglobal.com/in/en.html')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                ACCA
              </li>
              <li
                onClick={() => router.push('https://www.cpaaustralia.com.au/become-a-cpa?gclsrc=aw.ds&gad_source=1&gad_campaignid=20343277106&gclid=CjwKCAiAqprNBhB6EiwAMe3yhtopC_PkAX-7OPlz6utIBAdNW2g4uBZswV_WknxxbgU-HEOt-W8D9RoCRpsQAvD_BwE')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                CPA Australia
              </li>
              <li
                onClick={() => router.push('https://www.cfainstitute.org/')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                CFA
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 tracking-wide">Legal</h4>
            <ul className="space-y-2">
              <li
                onClick={() => router.push('/privacy-policy')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                Privacy Policy
              </li>
              <li
                onClick={() => router.push('/terms-of-use')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                Terms of Use
              </li>
              <li
                onClick={() => router.push('/refund-policy')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                Refund Policy
              </li>
              <li
                onClick={() => router.push('/contact-us')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                Contact us
              </li>
              <li
                onClick={() => router.push('/download-app')}
                className="cursor-pointer hover:text-[#00a896] transition-colors"
              >
                Download App
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 tracking-wide">Contact</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="leading-relaxed">
                <span className="text-white font-medium block mb-0.5">Call Matrix:</span>
                {institute?.instituteAppSettingsModals?.contact || "+91 99304 33999 | +91 99304 22999 || +91 85910 89800 | +91 85915 15899"}
              </li>
              <li className="break-all">
                <span className="text-white font-medium block mb-0.5">Email Support:</span>
                {institute?.email || "cashirishvyasonline@gmail.com"}
              </li>
              <li className="leading-relaxed">
                <span className="text-white font-medium block mb-0.5">Campus Desk:</span>
                {institute?.address || 'B Wing, 1st Floor, Bhakti Apt, Opp. Jain Temple, Jambhali Galli, Near Moksh Plaza, Borivali West, Mumbai – 400092.'}
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-[#121333] mt-8 pt-6 text-center text-[10px] text-slate-500">
          © 2026 {institute?.institue ? institute?.institue : "CA Shirish Vyas"} Education. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export const SuccessNotification = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-[#313381] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#00a896]/20">
        <div className="bg-white/20 p-1 rounded-full"><Icons.Check className="w-4 h-4 text-white" /></div>
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
        alt="CA Shirish Vyas Logo"
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
      {/* Spinner indicators dynamically matched to primary corporate color variables */}
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#313381',
        borderRadius: '50%',
        animation: 'loaderBounce 1s infinite'
      }}></div>
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#313381',
        borderRadius: '50%',
        animation: 'loaderBounce 1s infinite',
        animationDelay: '0.1s'
      }}></div>
      <div style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#313381',
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