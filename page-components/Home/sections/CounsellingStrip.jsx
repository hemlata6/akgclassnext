import React from 'react';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS, TEXT_GREEN } from '../../../constants/Icons';

export const CounsellingStrip = () => (
  <section className={`py-8 ${BRAND_GREEN_CLASS} text-white`}>
    <div className={LAYOUT_PADDING}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <h2 className="text-lg font-bold">Confused about CA preparation?</h2>
          <p className="text-emerald-100 text-xs">Talk to our counselors for a personalized study plan.</p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-end">
          <a href="tel:+918949190985" className={`bg-white ${TEXT_GREEN} px-4 py-2 rounded-lg font-bold text-xs shadow hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap`}>
            <Icons.Phone size={16} /> Call Now
          </a>
          <a href="https://wa.me/918949190985" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold text-xs shadow hover:bg-[#20ba5a] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.868 1.168c-1.53.766-2.888 1.804-3.897 3.057-1.023 1.282-1.756 2.738-2.091 4.288-.169.805-.245 1.620-.245 2.433 0 .852.055 1.702.167 2.540.112.838.331 1.652.655 2.429.968 2.37 2.85 4.346 5.193 5.348 1.142.507 2.372.767 3.648.767 1.272 0 2.505-.26 3.648-.767 2.343-.999 4.225-2.975 5.193-5.348.324-.777.543-1.591.655-2.429.112-.838.167-1.688.167-2.54 0-.813-.076-1.628-.245-2.433-.335-1.55-.974-3.006-1.897-4.288-1.009-1.253-2.367-2.291-3.897-3.057-1.52-.76-3.145-1.168-4.868-1.168h-.004z"/></svg>
            WhatsApp
          </a>
          <a href="https://youtube.com/@capankajaswaniair10" target="_blank" rel="noopener noreferrer" className="bg-[#FF0000] text-white px-4 py-2 rounded-lg font-bold text-xs shadow hover:bg-[#cc0000] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            YouTube
          </a>
          <a href="https://www.instagram.com/pankajaswani_0109?igsh=MWVwcjBhbGt5ZmFhNw==" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-[#f1306c] to-[#fd1d1d] text-white p-2 rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center cursor-pointer" title="Instagram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/></svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] text-white p-2 rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center cursor-pointer" title="Facebook">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/pankaj52/" target="_blank" rel="noopener noreferrer" className="bg-[#0A66C2] text-white p-2 rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center cursor-pointer" title="LinkedIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.436-.103.25-.129.599-.129.948v5.421h-3.554s.05-8.736 0-9.646h3.554v1.364c.43-.664 1.198-1.61 2.996-1.61 2.176 0 3.807 1.470 3.807 4.631v5.261zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.707 0-.951.77-1.708 1.971-1.708 1.200 0 1.913.757 1.937 1.708 0 .949-.745 1.707-1.993 1.707zm1.946 11.597H3.392V9.009h3.891v11.443zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
          </a>
          <a href="https://t.me/capankajinter" target="_blank" rel="noopener noreferrer" className="bg-[#0088cc] text-white p-2 rounded-lg shadow hover:shadow-lg transition-all flex items-center justify-center cursor-pointer" title="Telegram">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.82-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.336-.375-.123l-6.869 4.332-2.97-.924c-.642-.203-.658-.642.136-.954l11.566-4.461c.542-.203 1.016.131.854.949z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </section>
);

