import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Footer } from '../components/Shared/SharedComponents';
import { Header } from '../components/Header/Header';
import Network from '../config/Network';
import instId from '../config/instituteId';
import { useAuth } from '@/config/AuthContext';

// --- INLINE SVG ICONS ---
const PhoneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.27 1.11l-2.2 2.2z"/>
  </svg>
);

const HeadsetIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
  </svg>
);

const UsersGroupIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const DiamondDivider = () => (
  <div className="flex items-center justify-center gap-2 my-2 opacity-80">
    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-400"></div>
    <div className="w-1.5 h-1.5 rotate-45 bg-amber-400"></div>
    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-400"></div>
  </div>
);

export default function ContactUsPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        type: '',
        selectedContent: null,
        message: ''
    });
    const [courses, setCourses] = useState([]);
    const [testSeries, setTestSeries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);
    const [errors, setErrors] = useState({});
    const { institute } = useAuth();

    useEffect(() => {
        if (formData.type === 'course') fetchCourses();
    }, [formData.type]);

    useEffect(() => {
        if (formData.type === 'test series') fetchTestSeries();
    }, [formData.type]);

    const fetchCourses = async () => {
        try {
            const response = await Network.getFreeCourseList(instId);
            const coursesList = response?.courses || response || [];
            setCourses(Array.isArray(coursesList) ? coursesList.filter(c => c.active) : []);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
        }
    };

    const fetchTestSeries = async () => {
        try {
            const response = await Network.fetchTestSeries(instId);
            const testSeriesList = response?.testSeries || response || [];
            setTestSeries(Array.isArray(testSeriesList) ? testSeriesList : []);
        } catch (error) {
            console.error('Error fetching test series:', error);
            setTestSeries([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleTypeChange = (e) => {
        setFormData(prev => ({ ...prev, type: e.target.value, selectedContent: null }));
        if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
    };

    const handleContentChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const contentList = formData.type === 'course' ? courses : testSeries;
        const selected = contentList.find(item => item.id === selectedId);
        setFormData(prev => ({ ...prev, selectedContent: selected }));
        if (errors.selectedContent) setErrors(prev => ({ ...prev, selectedContent: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Enter a valid 10-digit number';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email';
        if (!formData.type) newErrors.type = 'Please select a type';
        if (!formData.selectedContent) newErrors.selectedContent = 'Please select an option';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await Network.createLeadFormAPI({
                instId, firstName: formData.firstName, lastName: formData.lastName,
                contact: formData.phone, email: formData.email, campaignId: null,
                contentId: formData.selectedContent?.id, enquiryType: formData.type, message: formData.message
            });
            setShowThankYou(true);
            setFormData({ firstName: '', lastName: '', phone: '', email: '', type: '', selectedContent: null, message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally { setLoading(false); }
    };

    if (showThankYou) {
        return (
            <div className="min-h-screen flex flex-col bg-[#07132b]">
                <Header />
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-xl">
                        <div className="mb-8 relative">
                            <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center relative bg-amber-400/10 border-2 border-amber-400/40">
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-amber-400"></div>
                                <svg className="w-20 h-20 relative z-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 mb-4">Thank You!</h1>
                        <p className="text-xl text-slate-300 mb-3">Your message has been received</p>
                        <p className="text-slate-400 mb-10">We will connect you soon</p>
                        <button onClick={() => { setShowThankYou(false); router.push('/'); }}
                            className="inline-flex items-center gap-3 px-8 py-4 text-slate-950 font-bold rounded-full transition-all shadow-lg hover:shadow-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 active:scale-95">
                            ← Back to Home
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#07132b] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-900 flex flex-col">
            <Header />
            <div className="flex-1">

                {/* ===== HERO BANNER ===== */}
                <section className="relative overflow-hidden bg-gradient-to-b from-[#071738] via-[#091b42] to-[#06112a] pt-12 pb-24 border-b border-amber-500/30">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                        <div className="md:col-span-12 space-y-4 text-center">
                            <h1 className="text-5xl sm:text-7xl font-serif font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 leading-none drop-shadow-md">Contact Us</h1>
                            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 tracking-wide">We're Here to Help You</h2>
                            <DiamondDivider />
                            <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-lg leading-relaxed pt-1 mx-auto">Have questions or need assistance? Reach out to us and our team will get back to you as soon as possible.</p>
                        </div>
                        {/* <div className="md:col-span-5 flex justify-center md:justify-end relative">
                            <div className="relative w-64 sm:w-80 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/40 bg-gradient-to-b from-blue-900 to-slate-900">
                                <img src="https://classioekatvammedia.classiolabs.com/classioekatvam/image/CA%20Rishabhh1782896141188" alt="Faculty Mentor" className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 right-4 bg-[#08152e]/90 backdrop-blur-md border border-amber-400/40 p-2.5 rounded-lg text-center shadow-lg">
                                    <span className="font-serif font-black text-amber-400 text-xs block leading-tight">RJCE</span>
                                    <span className="text-[8px] font-bold text-slate-300 uppercase block tracking-wider mt-0.5">Building Futures<br />Creating Possibilities</span>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </section>

                {/* ===== MAIN CONTENT ===== */}
                <section className="max-w-7xl mx-auto px-4 sm:px-12 -mt-16 relative z-20 pb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* --- LEFT CARD: CONTACT DETAILS --- */}
                        <div className="lg:col-span-4 bg-[#050f26] border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-serif font-extrabold text-xs px-8 py-1.5 rounded-b-xl shadow-md tracking-wider">Our Contact Details</div>
                            <div className="pt-6 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 mt-1"><PhoneIcon className="w-5 h-5" /></div>
                                        <div>
                                            <h3 className="font-serif font-bold text-amber-400 text-base">Sales Enquiry</h3>
                                            <div className="text-slate-200 text-xs sm:text-sm font-extrabold space-y-0.5 mt-1 tracking-wide">
                                                <p>8956524481</p><p>8956524482</p><p>8956524483</p><p>8956524484</p><p>8956524485</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DiamondDivider />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0"><PhoneIcon className="w-5 h-5" /></div>
                                        <div>
                                            <h3 className="font-serif font-bold text-amber-400 text-base">Face-to-Face Enquiry</h3>
                                            <div className="text-slate-200 text-xs sm:text-sm font-extrabold space-y-0.5 mt-1 tracking-wide">
                                                <p>8956688587</p><p>8956688588</p><p>8956688589</p><p>8956688590</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DiamondDivider />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0"><HeadsetIcon className="w-5 h-5" /></div>
                                        <div>
                                            <h3 className="font-serif font-bold text-amber-400 text-base">Support</h3>
                                            <p className="text-slate-200 text-xs sm:text-sm font-extrabold tracking-wide mt-0.5">8421875672</p>
                                        </div>
                                    </div>
                                </div>
                                <DiamondDivider />
                                <div className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-4 flex items-center gap-3 text-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0"><UsersGroupIcon className="w-5 h-5" /></div>
                                    <div>
                                        <h4 className="font-serif font-bold text-amber-400 text-sm">Your Success</h4>
                                        <p className="text-slate-200 text-xs font-serif font-extrabold uppercase tracking-wider">Our Priority</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT CARD: FORM --- */}
                        <div className="lg:col-span-8 bg-slate-100 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-slate-800">
                            <div className="text-center space-y-1 mb-6">
                                <h3 className="text-2xl font-serif font-bold text-[#071738]">Send Us a Message</h3>
                                <DiamondDivider />
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-slate-700 block">First Name <span className="text-rose-500">*</span></label>
                                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter your first name"
                                            className={`w-full bg-white border ${errors.firstName ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors`} />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-slate-700 block">Last Name <span className="text-rose-500">*</span></label>
                                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter your last name"
                                            className={`w-full bg-white border ${errors.lastName ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors`} />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-slate-700 block">Mobile Number <span className="text-rose-500">*</span></label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your mobile number"
                                            className={`w-full bg-white border ${errors.phone ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors`} />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-slate-700 block">Email ID <span className="text-rose-500">*</span></label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address"
                                            className={`w-full bg-white border ${errors.email ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors`} />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-slate-700 block">Type <span className="text-rose-500">*</span></label>
                                    <select name="type" value={formData.type} onChange={handleTypeChange}
                                        className={`w-full bg-white border ${errors.type ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-700 focus:outline-none focus:border-amber-500 transition-colors`}>
                                        <option value="">-- Select Type --</option>
                                        <option value="course">Course</option>
                                        <option value="test series">Test Series</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>
                                {formData.type && (
                                    <div className="space-y-1">
                                        <label className="text-slate-700 block">Select {formData.type === 'course' ? 'Course' : 'Test Series'} <span className="text-rose-500">*</span></label>
                                        <select value={formData.selectedContent?.id || ''} onChange={handleContentChange}
                                            className={`w-full bg-white border ${errors.selectedContent ? 'border-red-400' : 'border-slate-300'} rounded-lg px-3.5 py-2.5 text-slate-700 focus:outline-none focus:border-amber-500 transition-colors`}>
                                            <option value="">-- Select {formData.type === 'course' ? 'Course' : 'Test Series'} --</option>
                                            {(formData.type === 'course' ? courses : testSeries).map(item => (
                                                <option key={item.id} value={item.id}>{item.title || item.name}</option>
                                            ))}
                                        </select>
                                        {errors.selectedContent && <p className="text-red-500 text-xs mt-1">{errors.selectedContent}</p>}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-slate-700 block">Message</label>
                                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us more about your query..." rows="4"
                                        className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"></textarea>
                                </div>
                                <div className="pt-2 text-center">
                                    <button type="submit" disabled={loading}
                                        className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-serif font-black text-xs px-10 py-3 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </section>

            </div>
            <Footer />
        </div>
    );
}
