"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import OriginalLayout from '@/components/OriginalLayout';

// Import swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home() {
  const router = useRouter();
  const [pageSettings, setPageSettings] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageSettings();
    fetchPrograms();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/page-settings/home/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      console.error('Failed to load home page settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.results || data);
      }
    } catch (error) {
      console.error('Failed to load programs');
    }
  };

  const getTechnologies = (techString: string) => {
    if (!techString) return [];
    return techString.split(',').map(tech => tech.trim());
  };

  return (
    <OriginalLayout>
      <div className="min-h-screen bg-[#0A0F2C]">
        {/* Hero Section Replicated Exactly */}
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden px-4 md:px-6 py-20">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=futuristic%20digital%20brain%20with%20neural%20networks%20and%20glowing%20connections%20in%20dark%20blue%20space%20with%20cyan%20and%20electric%20blue%20lighting%20effects%20modern%20tech%20background&width=1440&height=1024&seq=hero-bg-001&orientation=landscape')` }} />
          <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
            <div className="w-full lg:w-1/2 text-left">
              <h1 className="mb-6 font-extrabold leading-tight text-white" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
                <span className="block">{pageSettings?.hero_title_line1 || 'From'}</span>
                <span className="text-[#30d9fe]">{pageSettings?.hero_title_highlight1 || 'Hello World'}</span>
                <span className="block">{pageSettings?.hero_title_line2 || 'to'}</span>
                <span className="text-[#eec262]">{pageSettings?.hero_title_highlight2 || 'Hello AI'}</span>
              </h1>
              <p className="max-w-xl mb-8 text-gray-200 text-lg md:text-xl">
                {pageSettings?.hero_description || 'Empowering African youth with cutting-edge tech skills to build solutions that matter. Join our community of innovators today.'}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/programs">
                  <button className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90 transition-all">Join a Program</button>
                </Link>
                <Link href="/events">
                  <button className="px-8 py-3 bg-[#eec262] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90 transition-all">Upcoming Events</button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="w-full max-w-lg h-64 md:h-96 relative overflow-hidden rounded-2xl shadow-lg border border-white/10">
                <img
                  src={pageSettings?.hero_image_url || "https://readdy.ai/api/search-image?query=abstract%20digital%20brain%20with%20glowing%20neural%20pathways%20and%20AI%20connections%20floating%20in%20space%20with%20bright%20cyan%20and%20electric%20blue%20colors%20modern%20minimalist%20tech%20illustration&width=600&height=400&seq=hero-img-001&orientation=landscape"}
                  alt="AI Illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-[#30d9fe]">Our Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: "fas fa-project-diagram", title: "Built 3 Real AI Projects", description: "Hands-on experience with practical applications" },
                { icon: "fas fa-rocket", title: "Launched AI-Powered Web Apps", description: "Deploy your creations to the real world" },
                { icon: "fas fa-briefcase", title: "Portfolio-Ready Project", description: "Showcase your skills to potential employers" }
              ].map((item, i) => (
                <div key={i} className="bg-slate-800/50 p-8 rounded-2xl text-center border border-white/5">
                  <div className="w-16 h-16 bg-[#30d9fe] rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className={`${item.icon} text-2xl text-[#03325a]`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="py-20 bg-gray-50 px-4">
          <div className="max-w-screen-xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-[#03325a]">Our Programs</h2>
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {programs.map((program) => (
                <SwiperSlide key={program.id}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-md h-full flex flex-col border border-gray-100">
                    <div className="h-48 bg-slate-100">
                      {program.image && <img src={program.image} className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between mb-3">
                        <span className="text-xs font-bold bg-[#03325a] text-[#30d9fe] px-3 py-1 rounded-full">{program.duration}</span>
                        <span className="text-xs font-bold bg-[#eec262] text-[#03325a] px-3 py-1 rounded-full">{program.level}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#03325a] mb-2">{program.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
                      <button onClick={() => router.push('/programs')} className="mt-auto w-full py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg transition-colors hover:bg-opacity-90">
                        View Details
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="text-center mt-8">
              <Link href="/programs" className="inline-block px-12 py-4 bg-[#03325a] text-white font-bold rounded-lg">View All Programs</Link>
            </div>
          </div>
        </section>
        {/* Stats Section */}
        <section className="py-20 bg-[#0A0F2C] border-t border-white/5">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Satisfied Students", value: "20,000+" },
                { label: "Course Enrollments", value: "35,000+" },
                { label: "Expert Instructors", value: "150+" },
                { label: "Community Events", value: "500+" }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-5xl font-black text-[#30d9fe] mb-2">{stat.value}</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black text-center mb-16 text-[#03325a]">What Our Learners Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { name: "Faith W.", role: "Full Stack Developer", text: "Code2Deploy transformed my career. The hands-on AI projects were exactly what I needed to land my dream job." },
                { name: "Samuel O.", role: "Data Scientist", text: "The mentorship program is world-class. I learned more in 12 weeks than I did in 2 years of self-study." },
                { name: "Mercy A.", role: "UI/UX Designer", text: "High-quality content, amazing community, and real-world results. I highly recommend Code2Deploy to everyone." }
              ].map((t, i) => (
                <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
                  <div className="text-[#eec262] mb-4">★★★★★</div>
                  <p className="text-gray-700 italic mb-6">"{t.text}"</p>
                  <div className="font-black text-[#03325a]">{t.name}</div>
                  <div className="text-sm font-bold text-[#30d9fe]">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gradient-to-br from-[#03325a] via-[#0A0F2C] to-[#30d9fe]/20 rounded-[3rem] p-12 text-center border border-[#30d9fe]/30 shadow-[0_0_50px_rgba(48,217,254,0.1)]">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Ready to Deploy Your Future?</h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Join thousands of African developers building the next generation of technology.</p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link href="/register">
                  <button className="px-12 py-4 bg-[#30d9fe] text-[#03325a] font-black rounded-2xl hover:bg-[#eec262] transition-all transform hover:scale-105 shadow-2xl shadow-[#30d9fe]/20">Get Started Now</button>
                </Link>
                <Link href="/contact">
                  <button className="px-12 py-4 border-2 border-white/20 text-white font-black rounded-2xl hover:bg-white/5 transition-all">Talk to an Advisor</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </OriginalLayout>
  );
}
