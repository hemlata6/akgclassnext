import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Footer } from '../../components/Shared/SharedComponents';
import { useAuth } from '../../config/AuthContext';
import { HeroSection } from './sections/HeroSection';
import { WhyChooseUs } from './sections/WhyChooseUs';
import { AboutSection } from './sections/AboutSection';
import { CoursesSection } from './sections/CoursesSection';
import { BookStore } from './sections/BookStore';
import { MarathonGallery } from './sections/MarathonGallery';
import { StudentGallery } from './sections/StudentGallery';
import { BlogSection } from './sections/BlogSection';
import { FreeResources } from './sections/FreeResources';
import { StudentSupportSection } from './sections/StudentSupportSection';
import { StudentHub } from './sections/StudentHub';
import { AppDownload } from './sections/AppDownload';
import { CounsellingStrip } from './sections/CounsellingStrip';
import { PromoPopup } from './sections/PromoPopup';
import { PromoBanners } from './sections/PromoBanners';
import FacultyAndStatsSection from './sections/FacultySection';
import ContactSupportSection from './sections/ContactSupportSection';
import { SecondBannerSection } from './sections/secondBannerSection';
import { Headphones, User } from 'lucide-react';

const SOCIAL_PROOF_DATA = [
  { name: 'Kaya from Delhi', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Rahul from Chennai', course: 'CA Inter Audit & SM' },
  { name: 'Priya from Mumbai', course: 'CA Final Advanced Auditing' },
  { name: 'Amit from Pune', course: 'CA Inter Strategic Management' },
  { name: 'Sneha from Bangalore', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Vikas from Kolkata', course: 'Inter Audit Complete Book Set' },
  { name: 'Rohan from Hyderabad', course: 'CA Final Audit Question Bank' },
  { name: 'Neha from Jaipur', course: 'CA Inter Audit & SM' },
  { name: 'Ankit from Surat', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Pooja from Nagpur', course: 'CA Inter Strategic Management' },
  { name: 'Harsh from Ahmedabad', course: 'CA Final Advanced Auditing' },
  { name: 'Divya from Lucknow', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Nitin from Indore', course: 'Inter Audit Complete Book Set' },
  { name: 'Riya from Bhopal', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Arjun from Kochi', course: 'CA Final Audit Question Bank' },
  { name: 'Megha from Patna', course: 'CA Inter Audit & SM' },
  { name: 'Karan from Chandigarh', course: 'CA Final Advanced Auditing' },
  { name: 'Simran from Ludhiana', course: 'CA Inter Strategic Management' },
  { name: 'Aditya from Nashik', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Ishita from Noida', course: 'Inter Audit Complete Book Set' },
  { name: 'Saurabh from Kanpur', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Tanvi from Vadodara', course: 'CA Final Advanced Auditing' },
  { name: 'Yash from Rajkot', course: 'CA Inter Audit & SM' },
  { name: 'Ananya from Mysore', course: 'CA Inter Strategic Management' },
  { name: 'Ritesh from Ranchi', course: 'CA Final Audit Question Bank' },
  { name: 'Sakshi from Bhubaneswar', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Mohit from Gwalior', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Nisha from Dehradun', course: 'Inter Audit Complete Book Set' },
  { name: 'Abhishek from Jabalpur', course: 'CA Final Advanced Auditing' },
  { name: 'Kriti from Amritsar', course: 'CA Inter Audit & SM' },
  { name: 'Ravi from Agra', course: 'CA Inter Strategic Management' },
  { name: 'Shreya from Varanasi', course: 'CA Final Audit Question Bank' },
  { name: 'Deepak from Meerut', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Anjali from Aurangabad', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Siddharth from Coimbatore', course: 'CA Final Advanced Auditing' },
  { name: 'Muskan from Guwahati', course: 'CA Inter Audit & SM' },
  { name: 'Rohit from Siliguri', course: 'CA Inter Strategic Management' },
  { name: 'Payal from Udaipur', course: 'Inter Audit Complete Book Set' },
  { name: 'Manish from Jodhpur', course: 'CA Final Audit Question Bank' },
  { name: 'Khushi from Raipur', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Ayush from Bhilai', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Preeti from Jammu', course: 'CA Final Advanced Auditing' },
  { name: 'Nikhil from Hisar', course: 'CA Inter Audit & SM' },
  { name: 'Tanya from Panipat', course: 'CA Inter Strategic Management' },
  { name: 'Varun from Goa', course: 'CA Final Audit Question Bank' },
  { name: 'Rachna from Trivandrum', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Akash from Salem', course: 'Inter Audit Complete Book Set' },
  { name: 'Bhavna from Tirupati', course: 'CA Final Advanced Auditing' },
  { name: 'Gaurav from Vijayawada', course: 'CA Inter Audit & SM' },
  { name: 'Komal from Madurai', course: 'CA Inter Strategic Management' },
  { name: 'Pratik from Hubli', course: 'CA Inter Audit & Ethics (EOB)' },
  { name: 'Shivani from Belgaum', course: 'CA Final Audit Question Bank' },
  { name: 'Akhil from Mangalore', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Pallavi from Shimla', course: 'CA Final Advanced Auditing' },
  { name: 'Rakesh from Rohtak', course: 'CA Inter Audit & SM' },
  { name: 'Monika from Aligarh', course: 'CA Inter Strategic Management' },
  { name: 'Vivek from Bareilly', course: 'Inter Audit Complete Book Set' },
  { name: 'Sonal from Kota', course: 'CA Final Advanced Audit (EOB)' },
  { name: 'Hemant from Ajmer', course: 'CA Final Audit Question Bank' },
  { name: 'Aarti from Bhavnagar', course: 'CA Inter Audit & Ethics (EOB)' },
];

export default function HomePage() {

  const router = useRouter();
  const { authToken, isAuthenticated } = useAuth();
  const [showPopup, setShowPopup] = React.useState(false);
  const [showMentorshipPopup, setShowMentorshipPopup] = React.useState(false);
  const { institute } = useAuth();
  const [socialProof, setSocialProof] = useState({ phase: 'hidden', data: SOCIAL_PROOF_DATA[0], index: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowMentorshipPopup(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Social proof notification - cycles through entries with fade in/out
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setSocialProof(prev => ({ ...prev, phase: 'visible', data: SOCIAL_PROOF_DATA[prev.index], index: prev.index }));
    }, 5000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (socialProof.phase !== 'visible') return;
    const hideTimer = setTimeout(() => {
      setSocialProof(prev => ({ ...prev, phase: 'hiding' }));
    }, 5000);
    return () => clearTimeout(hideTimer);
  }, [socialProof.phase]);

  useEffect(() => {
    if (socialProof.phase !== 'hiding') return;
    const fadeTimer = setTimeout(() => {
      setSocialProof(prev => ({ ...prev, phase: 'hidden' }));
    }, 500);
    return () => clearTimeout(fadeTimer);
  }, [socialProof.phase]);

  useEffect(() => {
    if (socialProof.phase !== 'hidden') return;
    const nextTimer = setTimeout(() => {
      setSocialProof(prev => {
        const nextIndex = (prev.index + 1) % SOCIAL_PROOF_DATA.length;
        return { phase: 'visible', data: SOCIAL_PROOF_DATA[nextIndex], index: nextIndex };
      });
    }, 10000);
    return () => clearTimeout(nextTimer);
  }, [socialProof.phase]);

  // const handleScrollToCourses = () => {
  //   const element = document.getElementById('fr-courses');
  //   if (element) element.scrollIntoView({ behavior: 'smooth' });
  // };

  return (
    <>
      {/* {showPopup && <PromoPopup onClose={() => setShowPopup(false)} />} */}
      <PromoBanners />
      {/* <HeroSection onExploreClick={handleScrollToCourses} /> */}
      {/* <FacultyAndStatsSection /> */}
      {/* <WhyChooseUs /> */}
      {/* <AboutSection /> */}
      <BookStore />
      <SecondBannerSection />
      <CoursesSection />
      {/* <MarathonGallery /> */}
      <StudentGallery />
      {/* <FreeResources /> */}
      {/* <StudentSupportSection />
      <ContactSupportSection /> */}
      {/* <StudentHub />
      <AppDownload />
      <CounsellingStrip /> */}
      <AppDownload />
      <Footer />

      {/* Social Proof Notification */}
      {socialProof.phase !== 'hidden' && (
        <div className={`fixed bottom-6 left-4 sm:left-6 z-[85] max-w-[300px] sm:max-w-sm transition-all duration-500 ease-in-out ${socialProof.phase === 'visible' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
          }`}>
          <div className="bg-white rounded-2xl shadow-2xl border-l-4 border-l-[#0a459a] border border-slate-200 px-4 py-3.5 flex items-center gap-3 relative overflow-hidden">
            {/* Animated pulse dot */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0a459a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0a459a]"></span>
              </span>
              <span className="text-[8px] font-bold text-[#0a459a] uppercase tracking-wider">Live</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0a459a] to-[#073373] flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-slate-900 leading-tight truncate">{socialProof.data.name}</p>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight truncate">Recently enrolled in <span className="text-[#0a459a] font-bold">{socialProof.data.course}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* Expert Help Button & Popup */}
      {showMentorshipPopup && (
        <div className="hidden md:block fixed bottom-40 right-4 z-[90] w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowMentorshipPopup(false)}
              className="absolute top-2 right-2 bg-slate-200 hover:bg-slate-300 text-slate-500 rounded-full p-0.5 transition-colors z-20"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Rating Logo */}
            {/* <div className="flex justify-center pt-4 pb-1">
              <div className="bg-[#0a459a] text-white font-bold text-lg px-3 py-1 rounded-lg inline-flex items-center gap-1">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                6.9
              </div>
            </div> */}

            <div className="text-center px-4 pb-2 pt-4">
              <h3 className="text-slate-900 text-sm font-extrabold tracking-tight">EXPERT ACADEMIC DESK</h3>
              <p className="text-red-500 font-bold text-[10px] uppercase tracking-wider mt-0.5">DIRECT MENTORSHIP</p>
            </div>

            <div className="px-4 pb-3 text-center">
              <p className="text-slate-700 text-[11px] leading-relaxed font-medium">
                Not sure which batch or faculty to choose?
              </p>
              <p className="text-slate-600 text-[10px] leading-relaxed mt-1">
                Every student's preparation journey is different. Our Expert Desk provides one-on-one guidance to help you select the most suitable course, faculty, and study plan based on your goals and current preparation.
              </p>
              <p className="text-slate-700 text-[10px] font-bold mt-2">Connect with <strong>CA Rishabhh Jainn's</strong> Expert Team and choose your next step with confidence.</p>
            </div>

            <div className="px-4 pb-4">
              <button
                onClick={() => {
                  setShowMentorshipPopup(false);
                  router.push('/contact-us');
                }}
                className="w-full bg-[#0a459a] hover:bg-[#073373] text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg text-xs tracking-wide"
              >
                GET EXPERT GUIDANCE NOW
              </button>
            </div>
            {/* Arrow pointing down to the button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-slate-200 rotate-45"></div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowMentorshipPopup(prev => !prev)}
        className="hidden md:flex text-[10px] fixed z-40 right-4 bottom-28 bg-[#dc2626] hover:bg-[#b91c1c] text-white p-2 rounded-full shadow-xl hover:scale-110 transition-all"
      >
        {/* <Headphones className="w-6 h-6" /> */}
        Expert Help?
      </button>

      <a href={`https://wa.me/${institute?.instituteAppSettingsModals?.contact}`} target="_blank" rel="noopener noreferrer" className="hidden md:flex fixed z-40 right-4 bottom-12 group">
        <div className="bg-[#25D366] text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </a>
    </>
  );
}

