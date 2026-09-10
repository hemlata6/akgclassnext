import React from 'react';
import { FileText, PlayCircle, CheckCircle, Download } from 'lucide-react';
import { LAYOUT_PADDING } from '../../../constants/Icons';
import { useAuth } from '@/config/AuthContext';

const FREE_RESOURCES = [
    { title: 'Important Notes & MCQs', type: 'PDF' },
    { title: 'Revision Videos & Marathon Classes', type: 'Video' },
    { title: 'Mock Test Series & Guidance', type: 'Test' },
    { title: 'Chapter-wise Practice Questions', type: 'PDF' }
];

export const FreeResources = () => {

    const { institute } = useAuth();

    const handleNavigate = () => {
        window.location.href = '/free-resources';
    };

    return (
        <section id="free-resources-section" className="py-6 bg-slate-50 border-t border-slate-200">
            <div className={LAYOUT_PADDING}>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div>
                        <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">Study Material</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Free Resources</h2>
                        <div className="space-y-3">
                            {FREE_RESOURCES.map((res, i) => (
                                <div
                                    onClick={handleNavigate}
                                    key={i} className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between hover:border-slate-400 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 text-emerald-700">
                                            {res.type === 'PDF' && <FileText />}
                                            {res.type === 'Video' && <PlayCircle />}
                                            {res.type === 'Test' && <CheckCircle />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-slate-600">{res.title}</h4>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">{res.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                                        <Download />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 md:p-8 text-center md:text-left relative overflow-hidden text-white shadow-2xl shadow-slate-900/20 sticky top-24">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Study on the Go!</h2>
                            <p className="text-slate-400 text-sm mb-4 max-w-xs mx-auto md:mx-0">Download the {institute?.institue ? institute?.institue : "CA Shirish Vyas"} App for offline viewing, live classes, and unlimited access to study materials.</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.classiolabs.cashriva"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-md"
                                >
                                    <Download /> Google Play
                                </a>
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-colors shadow-md"
                                >
                                    <Download /> App Store
                                </a>
                                <a
                                    href="https://apps.microsoft.com/detail/9PN6381N9DCM?hl=en-us&gl=IN&ocid=pdpshare"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-white/20 transition-colors shadow-md"
                                >
                                    <Download /> Window Store
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
