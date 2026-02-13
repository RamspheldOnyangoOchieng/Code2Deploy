"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import OriginalLayout from '@/components/OriginalLayout';

export default function AboutPage() {
    const [pageSettings, setPageSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPageSettings();
    }, []);

    const fetchPageSettings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/page-settings/about/`);
            if (response.ok) {
                const data = await response.json();
                setPageSettings(data);
            }
        } catch (error) {
            console.error('Failed to load about page settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <OriginalLayout>
            {/* Hero Section Replicated Exactly */}
            <div className="relative h-[300px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: pageSettings?.hero_image_url ? `url('${pageSettings.hero_image_url}')` : "url('https://readdy.ai/api/search-image?query=Modern%20tech%20office%20environment%20with%20abstract%20geometric%20patterns%20in%20blue%20and%20white.%20Professional%20workspace%20with%20subtle%20technology%20elements%20and%20clean%20minimalist%20design.%20Soft%20lighting%20creating%20an%20inviting%20atmosphere%20perfect%20for%20text%20overlay.%20Contemporary%20corporate%20setting%20with%20innovative%20architectural%20details&width=1440&height=600&seq=301&orientation=landscape')" }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#03325a] to-transparent">
                    <div className="container mx-auto px-4 md:px-6 h-full flex items-center">
                        <div className="max-w-2xl text-white">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-bold mb-2">{pageSettings?.hero_title || 'About Code2Deploy'}</h2>
                                    <p className="text-lg text-gray-300">{pageSettings?.hero_subtitle || 'Empowering African youth with cutting-edge tech skills'}</p>
                                </div>
                                <Link href="/" className="inline-flex items-center text-[#30d9fe] hover:text-white transition-colors">
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    <span>Back to Home</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-gray-50 font-sans">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                            <div className="mb-6">
                                <i className="fas fa-rocket text-4xl text-[#30d9fe]"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-[#03325a] mb-4">Our Mission</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To bridge the digital skills gap in Africa by providing world-class technology education and creating pathways to successful careers in the global tech industry.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
                            <div className="mb-6">
                                <i className="fas fa-eye text-4xl text-[#30d9fe]"></i>
                            </div>
                            <h2 className="text-3xl font-bold text-[#03325a] mb-4">Our Vision</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                To be Africa's leading technology education platform, empowering the next generation of tech leaders and innovators who will drive the continent's digital transformation.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 md:px-6">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#03325a] text-center mb-16">Our Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: "fas fa-star", title: "Excellence", description: "We strive for excellence in everything we do, from curriculum development to student support." },
                            { icon: "fas fa-handshake", title: "Collaboration", description: "We believe in the power of collaboration and partnership to achieve greater impact." },
                            { icon: "fas fa-lightbulb", title: "Innovation", description: "We embrace innovation and continuously adapt to evolving technology trends." }
                        ].map((value, idx) => (
                            <div key={idx} className="text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm transition-transform hover:-translate-y-2">
                                <div className="w-16 h-16 mx-auto mb-6 bg-[#30d9fe]/10 rounded-full flex items-center justify-center">
                                    <i className={`${value.icon} text-2xl text-[#30d9fe]`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-[#03325a] mb-4">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-[#03325a] text-white">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Tech Journey?</h2>
                    <p className="text-gray-300 text-lg mb-10">Whether you're a student looking to start your tech journey or an organization interested in partnership opportunities, we'd love to hear from you.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/programs" className="px-10 py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90">Join Our Programs</Link>
                        <Link href="/contact" className="px-10 py-4 border-2 border-[#30d9fe] text-white font-bold rounded-lg hover:bg-[#30d9fe] hover:text-[#03325a]">Partner With Us</Link>
                    </div>
                </div>
            </section>
        </OriginalLayout>
    );
}
