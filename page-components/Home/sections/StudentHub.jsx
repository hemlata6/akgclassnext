import React from 'react';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING, BRAND_GREEN_CLASS, BRAND_GREEN_HOVER_CLASS } from '../../../constants/Icons';

export const StudentHub = () => {
  const router = useRouter();

  const handleNavigateToResources = () => {
    router.push('/free-resources');
  };

  return (
    <section id="free-resources" className="py-12 bg-slate-50 border-y border-slate-200">
      <div className={LAYOUT_PADDING}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Free Resources</h3>
              <span onClick={handleNavigateToResources} className="text-[10px] text-indigo-600 font-bold uppercase cursor-pointer hover:text-indigo-700 transition-colors">View Library</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { t: "Revision Notes", i: "📄" },
                { t: "Mock Tests", i: "📝" },
                { t: "Courses", i: "📊" },
                { t: "Strategy PDF", i: "📈" }
              ].map((r, i) => (
                <div
                  key={i}
                  onClick={handleNavigateToResources}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer"
                >
                  <span className="text-base">{r.i}</span>
                  <span className="text-xs font-bold text-slate-700">{r.t}</span>
                </div>
              ))}
            </div>
            <button onClick={handleNavigateToResources} className={`w-full ${BRAND_GREEN_CLASS} ${BRAND_GREEN_HOVER_CLASS} text-white py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2`}>
              <Icons.Download /> Download Now
            </button>
          </div>
          <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Demo Lectures</h3>
                <span className="text-[10px] text-emerald-400 font-bold uppercase cursor-pointer">Watch All</span>
              </div>
              <div className="space-y-3 mb-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 items-center group cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={handleNavigateToResources}>
                    <div className="h-10 w-16 bg-slate-800 rounded flex items-center justify-center flex-shrink-0 border border-slate-700 group-hover:border-indigo-500">
                      <Icons.Play />
                    </div>
                    <div>
                      <p className="font-bold text-xs leading-tight group-hover:text-indigo-300">
                        Ind AS 115 - Revenue (Part {i})
                      </p>
                      <p className="text-[10px] text-slate-400">CA Pankaj Aswani • 25k views</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

