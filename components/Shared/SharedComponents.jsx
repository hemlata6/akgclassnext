import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../../constants/Icons';
import { useAuth } from '../../config/AuthContext';
import Endpoints from '../../config/endpoints';

export const Footer = () => {
  const router = useRouter();
  const { institute } = useAuth();
  // console.log('institute', institute?.logo);

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

  console.log('institute', institute);



  return (
    <footer className="bg-slate-950 text-slate-500 pt-10 pb-24 md:pb-10 border-t border-slate-900">
      <div className={LAYOUT_PADDING}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          <div className="col-span-2 md:col-span-1">
            <div className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              {/* <div className="h-10 w-10 bg-indigo-700 rounded flex items-center justify-center text-[10px]">
                <img src={institute?.logo !== null ? Endpoints?.mediaBaseUrl + institute?.logo : "/logo.png"} alt={institute?.institue ? institute?.institue : "logo"} className="h-full w-full object-contain" />
              </div> */}
              {"NextGen CA"}
            </div>
            <p>NextGenCA is a one-stop solution for CA Aspirants to get quality CA education at affordable prices.
              Founded by 1st Attempt CAs, aiming to convert the fear of multiple attempts into a mindset of “Learn Smart, Clear Fast”</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Courses</h4>
            <ul className="space-y-1.5">
              <li
                onClick={() => handleCourseClick('CA Foundation')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                CA Foundation
              </li>
              <li
                onClick={() => handleCourseClick('CA Inter')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                CA Inter
              </li>
              <li
                onClick={() => handleCourseClick('CA Final')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                CA Final
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Legal</h4>
            <ul className="space-y-1.5">
              <li
                onClick={() => router.push('/privacy-policy')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                Privacy Policy
              </li>
              <li
                onClick={() => router.push('/terms-of-use')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                Terms of Use
              </li>
              <li
                onClick={() => router.push('/refund-policy')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                Refund Policy
              </li>
              <li
                onClick={() => router.push('/contact-us')}
                className="cursor-pointer hover:text-emerald-400 transition-colors"
              >
                Contact us
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Important Link</h4>
            <ul className="space-y-1.5">
              <li
                // onClick={() => router.push('/privacy-policy')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.icai.org/' target='_blank' rel='noopener noreferrer'>
                  ICAI
                </a>
              </li>
              <li
                // onClick={() => router.push('/terms-of-use')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.icsi.edu/home/' target='_blank' rel='noopener noreferrer'>
                  ICSI
                </a>
              </li>
              <li
                // onClick={() => router.push('/refund-policy')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.icmai.in/icmai/' target='_blank' rel='noopener noreferrer'>
                  ICMAI
                </a>
              </li>
              <li
                // onClick={() => router.push('/contact-us')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.accaglobal.com/in/en.html' target='_blank' rel='noopener noreferrer'>
                  ACCA
                </a>
              </li>
              <li
                // onClick={() => router.push('/contact-us')}
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.cpaaustralia.com.au/become-a-cpa?gclsrc=aw.ds&gad_source=1&gad_campaignid=20343277106&gclid=CjwKCAiAqprNBhB6EiwAMe3yhtopC_PkAX-7OPlz6utIBAdNW2g4uBZswV_WknxxbgU-HEOt-W8D9RoCRpsQAvD_BwE' target='_blank' rel='noopener noreferrer'>
                  CPA Australia
                </a>
              </li>
              <li
                className="cursor-pointer hover:text-indigo-400 transition-colors"
              >
                <a href='https://www.cfainstitute.org/' target='_blank' rel='noopener noreferrer'>
                  CFA
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3">Contact</h4>
            <ul className="space-y-1.5">
              <li>Call: +91 9465829512</li>
              <li>nextgencaacademy1@gmail.com</li>
              <li>LUDHIANA</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900 mt-8 pt-6 text-center text-[10px]">
          © 2026 NextGenCA Education. All rights reserved.
          <div>Tech partner <a href="https://www.classiolabs.com" target="_blank" rel="noopener noreferrer" style={{ color: '#ffc107' }} className="font-semibold hover:underline">Classio Labs</a> </div>
        </div>
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
        alt="ca class Logo"
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

