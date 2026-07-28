import React from 'react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS, TEXT_GREEN } from '../../../constants/Icons';

export const CounsellingStrip = () => (
  <section className={`py-8 ${BRAND_GREEN_CLASS} text-white`}>
    <div className={LAYOUT_PADDING}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h2 className="text-lg font-bold tracking-tight">Confused about CA preparation?</h2>
          <p className="text-emerald-100 text-xs">Talk to our counselors for a personalized study plan.</p>
        </div>
        <div className="flex gap-3">
          <a href="tel:7703880232" className={`bg-white ${TEXT_GREEN} px-5 py-2 rounded-lg font-bold text-xs shadow hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer`}>
            <Icons.Phone /> Call Now
          </a>
          <a href="https://wa.me/917703880232" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-5 py-2 rounded-lg font-bold text-xs shadow hover:bg-[#20ba5a] transition-all cursor-pointer">
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
);

