import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { Icons, LAYOUT_PADDING } from '../constants/Icons';
import Network from '../config/Network';
import instId from '../config/instituteId';

function ContactUsPageContent() {
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

    // Fetch courses when type is selected as "course"
    useEffect(() => {
        if (formData.type === 'course') {
            fetchCourses();
        }
    }, [formData.type]);

    // Fetch test series when type is selected as "test series"
    useEffect(() => {
        if (formData.type === 'test series') {
            fetchTestSeries();
        }
    }, [formData.type]);

    const fetchCourses = async () => {
        try {
            const response = await Network.getFreeCourseList(instId);
            const coursesList = response?.courses || response || [];
            // Ensure coursesList is an array before filtering
            const activeCourses = Array.isArray(coursesList) ? coursesList.filter(c => c.active) : [];
            setCourses(activeCourses);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
        }
    };

    const fetchTestSeries = async () => {
        try {
            const response = await Network.fetchTestSeries(instId);
            const testSeriesList = response?.testSeries || response || [];
            // Ensure testSeriesList is an array
            setTestSeries(Array.isArray(testSeriesList) ? testSeriesList : []);
        } catch (error) {
            console.error('Error fetching test series:', error);
            setTestSeries([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTypeChange = (e) => {
        setFormData(prev => ({
            ...prev,
            type: e.target.value,
            selectedContent: null
        }));
        if (errors.type) {
            setErrors(prev => ({ ...prev, type: '' }));
        }
    };

    const handleContentChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const contentList = formData.type === 'course' ? courses : testSeries;
        const selected = contentList.find(item => item.id === selectedId);

        setFormData(prev => ({
            ...prev,
            selectedContent: selected
        }));
        if (errors.selectedContent) {
            setErrors(prev => ({ ...prev, selectedContent: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.type) newErrors.type = 'Please select a type';
        if (!formData.selectedContent) newErrors.selectedContent = 'Please select an option';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const body = {
                instId: instId,
                firstName: formData.firstName,
                lastName: formData.lastName,
                contact: formData.phone,
                email: formData.email,
                campaignId: null,
                contentId: formData.selectedContent?.id,
                enquiryType: formData.type,
                message: formData.message
            };

            await Network.createLeadFormAPI(body);
            setShowThankYou(true);

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                type: '',
                selectedContent: null,
                message: ''
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (showThankYou) {
        return (
            <div className="bg-white min-h-screen flex flex-col">
                <div className="flex-1 flex items-center justify-center py-20 px-4">
                    <div className="text-center max-w-xl">
                        <div className="mb-8 relative">
                            <div className="w-40 h-40 mx-auto rounded-full flex items-center justify-center relative" style={{backgroundColor: '#e8f3ee'}} >
                                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{backgroundColor: '#154734'}}></div>
                                <svg className="w-20 h-20 relative z-10" style={{color: '#154734'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-slate-900 mb-4">Thank You!</h1>
                        <p className="text-xl text-slate-600 mb-3">Your message has been received</p>
                        <p className="text-slate-500 mb-10">We will connect you soon</p>
                        <button
                            onClick={() => {
                                setShowThankYou(false);
                                router.push('/');
                            }}
                            className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                            style={{backgroundColor: '#154734'}}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#0d3221'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#154734'}
                        >
                            <Icons.Back />
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <div className="flex-1">
                <div className={`py-16 ${LAYOUT_PADDING}`}>
                    {/* Header */}
                    <div className="text-center mb-12">
                        <button
                            onClick={() => router.push('/')}
                            className="inline-flex items-center gap-2 text-slate-600 mb-8 font-semibold transition-colors"
                            onMouseEnter={(e) => e.target.style.color = '#154734'}
                            onMouseLeave={(e) => e.target.style.color = ''}
                        >
                            <Icons.Back /> Back to Home
                        </button>
                        <h1 className="text-5xl font-bold text-slate-900 mb-4">Get In Touch</h1>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We'd love to hear from you, please drop us a line if you've any query related to our program and courses.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info Cards */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: '#e8f3ee'}}>
                                    <Icons.Phone />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Call Us</h3>
                                <p className="text-slate-600 text-sm mb-2">Mon-Sat from 10am to 7pm</p>
                                <a href="tel:9465829512" className="font-semibold" style={{color: '#154734'}}
                                   onMouseEnter={(e) => e.target.style.color = '#0d3221'}
                                   onMouseLeave={(e) => e.target.style.color = '#154734'}>
                                    9465829512
                                </a>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{backgroundColor: '#e8f3ee'}}>
                                    <Icons.Mail />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Email Us</h3>
                                <p className="text-slate-600 text-sm mb-2">Our friendly team is here</p>
                                <a href="mailto:nextgencaacademy1@gmail.com" className="font-semibold" style={{color: '#154734'}}
                                   onMouseEnter={(e) => e.target.style.color = '#0d3221'}
                                   onMouseLeave={(e) => e.target.style.color = '#154734'}>
                                    nextgencaacademy1@gmail.com
                                </a>
                            </div>

                            <div className="rounded-2xl p-6 shadow-md text-white" style={{backgroundColor: '#154734'}}>
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                                    <Icons.BookOpen />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Office</h3>
                                <p className="text-sm" style={{color: '#e8f3ee'}}>
                                    LUDHIANA, India
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            First Name <span style={{color: '#154734'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            placeholder="John"
                                            className={`w-full px-4 py-3 border ${errors.firstName ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                            style={{'--tw-ring-color': '#154734'}}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                            onBlur={(e) => e.target.style.boxShadow = ''}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-xs mt-1.5">{errors.firstName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Last Name <span style={{color: '#154734'}}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            placeholder="Doe"
                                            className={`w-full px-4 py-3 border ${errors.lastName ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                            onBlur={(e) => e.target.style.boxShadow = ''}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-xs mt-1.5">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone <span style={{color: '#154734'}}>*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210"
                                            className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                            onBlur={(e) => e.target.style.boxShadow = ''}
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email <span style={{color: '#154734'}}>*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                            className={`w-full px-4 py-3 border ${errors.email ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                            onBlur={(e) => e.target.style.boxShadow = ''}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Type <span style={{color: '#154734'}}>*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleTypeChange}
                                        className={`w-full px-4 py-3 border ${errors.type ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white cursor-pointer transition-all`}
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                        onBlur={(e) => e.target.style.boxShadow = ''}
                                    >
                                        <option value="">-- Select Your Type --</option>
                                        <option value="course">Course</option>
                                        <option value="test series">Test Series</option>
                                    </select>
                                    {errors.type && <p className="text-red-500 text-xs mt-1.5">{errors.type}</p>}
                                </div>

                                {formData.type && (
                                    <div className="mb-5 animate-in slide-in-from-top duration-300">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Select {formData.type === 'course' ? 'Course' : 'Test Series'} <span style={{color: '#154734'}}>*</span>
                                        </label>
                                        <select
                                            value={formData.selectedContent?.id || ''}
                                            onChange={handleContentChange}
                                            className={`w-full px-4 py-3 border ${errors.selectedContent ? 'border-red-400' : 'border-slate-300'} rounded-lg focus:outline-none focus:ring-2 focus:border-transparent bg-white cursor-pointer transition-all`}
                                            onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                            onBlur={(e) => e.target.style.boxShadow = ''}
                                        >
                                            <option value="">-- Select {formData.type === 'course' ? 'Course' : 'Test Series'} --</option>
                                            {(formData.type === 'course' ? courses : testSeries).map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.title || item.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedContent && <p className="text-red-500 text-xs mt-1.5">{errors.selectedContent}</p>}
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Tell us more about your query..."
                                        rows="4"
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all"
                                        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #154734'}
                                        onBlur={(e) => e.target.style.boxShadow = ''}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    style={{backgroundColor: loading ? '#154734' : '#154734'}}
                                    onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0d3221')}
                                    onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#154734')}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Submit Message
                                            <Icons.ChevronRight />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ContactUsPage() {
    return (
        <>
            <Head>
                <title>Contact Us - NextGenCA</title>
                <meta name="description" content="Get in touch with NextGenCA" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Layout>
                <ContactUsPageContent />
            </Layout>
        </>
    );
}
