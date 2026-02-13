"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OriginalLayout from '@/components/OriginalLayout';

export default function ContactPage() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        reason: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'sponsor') {
            setFormData(prev => ({
                ...prev,
                subject: 'Partnership Inquiry - Sponsor',
                reason: 'sponsor',
                message: 'I am interested in becoming a sponsor for Code2Deploy programs and events.'
            }));
        } else if (type === 'education-partner') {
            setFormData(prev => ({
                ...prev,
                subject: 'Partnership Inquiry - Education & Training Partner',
                reason: 'education',
                message: 'I am interested in becoming an education and training partner with Code2Deploy.'
            }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setFormSubmitted(true);
                setFormData({ name: '', email: '', subject: '', reason: '', message: '' });
            }
        } catch (error) {
            console.error('Submission failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <OriginalLayout>
            <div className="min-h-screen bg-[#03325a] text-white flex flex-col py-20 px-4 md:px-0">
                <header className="text-center mb-16 container mx-auto">
                    <h1 className="text-[#30d9fe] text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">Get in Touch</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">Whether you're ready to enroll, curious about our programs, or just want to say hi — drop us a line!</p>
                </header>

                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col-reverse lg:flex-row gap-8">
                        {/* Form */}
                        <div className="lg:w-3/5 bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-2xl">
                            {formSubmitted ? (
                                <div className="text-center py-20 animate-fade-in">
                                    <div className="text-[#30d9fe] text-6xl mb-6"><i className="fas fa-check-circle"></i></div>
                                    <h2 className="text-3xl font-bold mb-4 font-sans">Message Sent!</h2>
                                    <p className="text-lg opacity-80 mb-8 font-sans">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                    <button onClick={() => setFormSubmitted(false)} className="text-[#30d9fe] font-bold underline">Send another message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2 font-sans">Full Name *</label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-[#03325a] border-2 border-white/10 focus:border-[#30d9fe] outline-none transition-all font-sans"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2 font-sans">Email Address *</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg bg-[#03325a] border-2 border-white/10 focus:border-[#30d9fe] outline-none transition-all font-sans"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 font-sans">Subject</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg bg-[#03325a] border-2 border-white/10 focus:border-[#30d9fe] outline-none transition-all font-sans"
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 font-sans">Message *</label>
                                        <textarea
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-lg bg-[#03325a] border-2 border-white/10 focus:border-[#30d9fe] outline-none transition-all font-sans"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <button
                                        disabled={loading}
                                        className="w-full py-4 bg-gradient-to-r from-[#30d9fe] to-blue-500 text-[#03325a] font-bold rounded-lg hover:shadow-lg transition-all"
                                    >
                                        {loading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Info */}
                        <div className="lg:w-2/5 space-y-6">
                            <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-8 text-[#30d9fe] font-sans">Ping Our Network</h3>
                                <div className="space-y-8">
                                    <div className="flex gap-4">
                                        <i className="fas fa-map-marker-alt text-[#30d9fe] text-xl mt-1"></i>
                                        <div>
                                            <h4 className="font-bold font-sans">Visit Us</h4>
                                            <p className="text-sm opacity-80 font-sans">123 Tech Hub, Innovation Street, Nairobi, Kenya</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <i className="fas fa-envelope text-[#30d9fe] text-xl mt-1"></i>
                                        <div>
                                            <h4 className="font-bold font-sans">Email Us</h4>
                                            <p className="text-sm opacity-80 font-sans">info@code2deploy.com</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <i className="fas fa-phone text-[#30d9fe] text-xl mt-1"></i>
                                        <div>
                                            <h4 className="font-bold font-sans">Call Us</h4>
                                            <p className="text-sm opacity-80 font-sans">+254 743 864 7890</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900/60 p-8 rounded-2xl border border-white/10 shadow-2xl">
                                <h3 className="text-2xl font-bold mb-6 text-[#30d9fe] font-sans">Quick Links</h3>
                                <div className="flex flex-col gap-4">
                                    <Link href="/programs" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all font-sans">
                                        <span>View Programs</span>
                                        <i className="fas fa-chevron-right text-[#30d9fe] text-xs"></i>
                                    </Link>
                                    <Link href="/events" className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all font-sans">
                                        <span>Upcoming Events</span>
                                        <i className="fas fa-chevron-right text-[#30d9fe] text-xs"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OriginalLayout>
    );
}
