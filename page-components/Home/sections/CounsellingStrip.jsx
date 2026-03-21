import React from 'react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS, TEXT_GREEN } from '../../../constants/Icons';
import { useAuth } from '@/config/AuthContext';


export const CounsellingStrip = () => {
  const { institute } = useAuth();
  // console.log('institute in counselling strip', institute);
  return (
    <section className={`py-8 ${BRAND_GREEN_CLASS} text-white`}>
      <div className={LAYOUT_PADDING}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <h2 className="text-lg font-bold">Confused about CA preparation?</h2>
            <p className="text-emerald-100 text-xs">Talk to our counselors for a personalized study plan.</p>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${institute?.contact}`} className={`bg-white ${TEXT_GREEN} px-5 py-2 rounded-lg font-bold text-xs shadow hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer`}>
              <Icons.Phone /> Call Now
            </a>
            <a href={`https://wa.me/91${institute?.contact}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-5 py-2 rounded-lg font-bold text-xs shadow hover:bg-[#20ba5a] transition-all cursor-pointer">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
};

