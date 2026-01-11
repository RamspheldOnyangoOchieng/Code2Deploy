import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Layout from '../components/layout';
import '../styles/swiper-custom.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageSettings, setPageSettings] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    fetchPageSettings();
    fetchPrograms();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/home/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      console.error('Error fetching home page settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/programs/`);
      if (response.ok) {
        const data = await response.json();
        setPrograms(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const getTechnologies = (techString) => {
    if (!techString) return [];
    return techString.split(',').map(tech => tech.trim());
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 overflow-x-hidden" style={{ backgroundColor: '#0A0F2C' }}>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] xs:min-h-[65vh] sm:min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center items-center overflow-hidden px-3 xs:px-4 sm:px-6 py-8 xs:py-12 sm:py-16 md:py-20 hero-section">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animated-hero-bg" style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=futuristic%20digital%20brain%20with%20neural%20networks%20and%20glowing%20connections%20in%20dark%20blue%20space%20with%20cyan%20and%20electric%20blue%20lighting%20effects%20modern%20tech%20background&width=1440&height=1024&seq=hero-bg-001&orientation=landscape')` }} />
          <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6 xs:gap-8 lg:gap-12 items-center hero-content">
            <div className="w-full lg:w-1/2 text-left hero-text px-1 xs:px-2 sm:px-0">
              <h1 className="mb-4 xs:mb-6 font-extrabold leading-tight text-white hero-title" style={{ fontSize: 'clamp(1.75rem, 6vw, 4.5rem)', lineHeight: '1.1' }}>
                <span className="block">{pageSettings?.hero_title_line1 || 'From'}</span>
                <span className="text-[#30d9fe]">{pageSettings?.hero_title_highlight1 || 'Hello World'}</span>
                <span className="block">{pageSettings?.hero_title_line2 || 'to'}</span>
                <span className="text-[#eec262]">{pageSettings?.hero_title_highlight2 || 'Hello AI'}</span>
              </h1>
              <p className="max-w-xl mb-6 xs:mb-8 text-gray-200 hero-subtitle" style={{ fontSize: 'clamp(0.875rem, 2.5vw, 1.5rem)' }}>
                {pageSettings?.hero_description || 'Empowering African youth with cutting-edge tech skills to build solutions that matter. Join our community of innovators today.'}
              </p>
              <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4">
                <Link to={pageSettings?.hero_button1_link || '/programs'} className="w-full xs:w-auto">
                  <button className="px-4 xs:px-6 py-2.5 xs:py-3 text-sm xs:text-base font-bold rounded-lg bg-[#30d9fe] text-[#03325a] hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap shadow-md w-full">{pageSettings?.hero_button1_text || 'Join a Program'}</button>
                </Link>
                <Link to={pageSettings?.hero_button2_link || '/events'} className="w-full xs:w-auto">
                  <button className="px-4 xs:px-6 py-2.5 xs:py-3 text-sm xs:text-base font-bold rounded-lg bg-[#eec262] text-[#03325a] hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap shadow-md w-full">{pageSettings?.hero_button2_text || 'Upcoming Events'}</button>
                </Link>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-6 xs:mt-8 lg:mt-0 hero-image">
              <div className="w-full max-w-[280px] xs:max-w-xs sm:max-w-md md:max-w-lg h-48 xs:h-60 sm:h-80 md:h-96 relative overflow-hidden rounded-xl xs:rounded-2xl shadow-lg">
                <img
                  src={pageSettings?.hero_image_url || "https://readdy.ai/api/search-image?query=abstract%20digital%20brain%20with%20glowing%20neural%20pathways%20and%20AI%20connections%20floating%20in%20space%20with%20bright%20cyan%20and%20electric%20blue%20colors%20modern%20minimalist%20tech%20illustration&width=600&height=400&seq=hero-img-001&orientation=landscape"}
                  alt="AI Brain Illustration"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Value Proposition */}
        <section className="py-8 xs:py-10 sm:py-14 md:py-20 py-responsive-lg">
          <div className="max-w-screen-xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <h2 className="font-bold text-center mb-6 xs:mb-8 text-[#30d9fe]" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>{pageSettings?.approach_title || 'Our Approach'}</h2>
            <p className="text-center text-gray-300 max-w-3xl mx-auto mb-6 xs:mb-8" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.125rem)' }}>
              {pageSettings?.approach_description || 'Most courses stop at code. We take you further. By the end of our program, you\'ll have:'}
            </p>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-6 sm:gap-8 grid-responsive">
              {[
                {
                  icon: "fas fa-project-diagram",
                  title: "Built 3 Real AI Projects",
                  description: "Hands-on experience with practical applications",
                },
                {
                  icon: "fas fa-rocket",
                  title: "Launched AI-Powered Web Apps",
                  description: "Deploy your creations to the real world",
                },
                {
                  icon: "fas fa-briefcase",
                  title: "Portfolio-Ready Final Project",
                  description: "Showcase your skills to potential employers",
                },
                {
                  icon: "fas fa-cloud-upload-alt",
                  title: "Learned Model Deployment",
                  description: "Master the art of bringing AI to production",
                },
                {
                  icon: "fas fa-certificate",
                  title: "Earned Mentor Certificate",
                  description: "Recognition from experienced industry professionals",
                },
                {
                  icon: "fas fa-chart-line",
                  title: "Go-To-Market Guidance",
                  description: "Business insights for top 5 project performers",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-700 rounded-lg xs:rounded-xl p-4 xs:p-5 sm:p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer text-center card-responsive"
                >
                  <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 mx-auto mb-3 xs:mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00F0FF' }}>
                    <i className={`${item.icon} text-lg xs:text-xl sm:text-2xl`} style={{ color: '#0A0F2C' }}></i>
                  </div>
                  <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-1 xs:mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-xs xs:text-sm sm:text-base">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* What We Do Section */}
        <section className="py-8 xs:py-10 sm:py-14 md:py-20 py-responsive-lg">
          <div className="max-w-screen-xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-6 xs:gap-8">
              <div className="w-full md:w-1/2 md:pr-6 lg:pr-10 mb-6 md:mb-0">
                <h2 className="font-bold mb-4 xs:mb-6 text-[#30d9fe]" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>{pageSettings?.what_we_do_title || 'What We Do'}</h2>
                <ul className="space-y-3 xs:space-y-4">
                  <li className="flex items-start">
                    <div className="bg-[#03325a] p-1.5 xs:p-2 rounded-full mr-3 xs:mr-4 mt-1 flex-shrink-0">
                      <i className="fas fa-laptop-code text-[#30d9fe] text-sm xs:text-base"></i>
                    </div>
                    <div>
                      <h3 className="mb-1 text-[#30d9fe] text-base xs:text-lg sm:text-xl font-bold">Coding Bootcamps</h3>
                      <p className="text-white text-sm xs:text-base">Intensive training programs for beginners and intermediate developers.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#03325a] p-1.5 xs:p-2 rounded-full mr-3 xs:mr-4 mt-1 flex-shrink-0">
                      <i className="fas fa-project-diagram text-[#30d9fe] text-sm xs:text-base"></i>
                    </div>
                    <div>
                      <h3 className="mb-1 text-[#30d9fe] text-base xs:text-lg sm:text-xl font-bold">Project-Based Learning</h3>
                      <p className="text-white text-sm xs:text-base">Hands-on experience building real applications with modern technologies.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#03325a] p-1.5 xs:p-2 rounded-full mr-3 xs:mr-4 mt-1 flex-shrink-0">
                      <i className="fas fa-users text-[#30d9fe] text-sm xs:text-base"></i>
                    </div>
                    <div>
                      <h3 className="mb-1 text-[#30d9fe] text-base xs:text-lg sm:text-xl font-bold">Mentorship Programs</h3>
                      <p className="text-white text-sm xs:text-base">Connect with industry professionals who guide your tech journey.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#03325a] p-1.5 xs:p-2 rounded-full mr-3 xs:mr-4 mt-1 flex-shrink-0">
                      <i className="fas fa-briefcase text-[#30d9fe] text-sm xs:text-base"></i>
                    </div>
                    <div>
                      <h3 className="mb-1 text-[#30d9fe] text-base xs:text-lg sm:text-xl font-bold">Career Development</h3>
                      <p className="text-white text-sm xs:text-base">Resume building, interview preparation, and job placement assistance.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-1/2 rounded-lg xs:rounded-xl mt-4 md:mt-0 overflow-hidden flex justify-center items-center">
                <img
                  src="https://readdy.ai/api/search-image?query=A%20diverse%20group%20of%20young%20African%20students%20collaborating%20on%20coding%20projects%20in%20a%20modern%20tech%20workspace.%20They%20are%20engaged%2C%20smiling%2C%20and%20working%20together%20on%20laptops.%20The%20scene%20shows%20both%20male%20and%20female%20students%20of%20various%20ages%2C%20representing%20the%20diversity%20of%20African%20youth%20in%20technology%20education.%20The%20lighting%20is%20bright%20and%20natural%2C%20creating%20an%20inspiring%20atmosphere&width=600&height=500&seq=2&orientation=landscape"
                  alt="Diverse African youth coding"
                  className="object-cover object-top w-full h-48 xs:h-60 sm:h-80 md:h-96 shadow-lg rounded-lg xs:rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Program Carousel */}
        <section className="py-8 sm:py-14 md:py-20 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-[#03325a]">{pageSettings?.programs_section_title || 'Our Programs'}</h2>
            <div className="-mx-2">
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                  1536: { slidesPerView: 4, spaceBetween: 30 },
                  2560: { slidesPerView: 5, spaceBetween: 40 },
                  3840: { slidesPerView: 6, spaceBetween: 50 },
                }}
                className="program-swiper"
              >
                {programs.length > 0 ? (
                  programs.map((program) => (
                    <SwiperSlide key={program.id}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full transition-transform duration-300 hover:scale-[1.02] flex flex-col">
                        <div className="h-32 sm:h-40 md:h-48 overflow-hidden bg-slate-200">
                          {program.image ? (
                            <img
                              src={program.image}
                              alt={program.title}
                              className="object-cover object-top w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <i className="fas fa-graduation-cap text-4xl"></i>
                            </div>
                          )}
                        </div>
                        <div className="p-4 md:p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">{program.duration}</span>
                            <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">{program.level}</span>
                          </div>
                          <h3 className="text-lg md:text-xl font-bold mb-2 text-[#03325a] line-clamp-1">{program.title}</h3>
                          <p className="mb-3 text-gray-600 text-sm md:text-base line-clamp-2">{program.description}</p>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {getTechnologies(program.technologies).slice(0, 3).map((tech, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">{tech}</span>
                            ))}
                          </div>
                          <Link to={`/programs?search=${encodeURIComponent(program.title)}`} className="mt-auto">
                            <button className="w-full py-2 text-sm md:text-base bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  // Fallback or Loading Placeholder slides could go here
                  <SwiperSlide>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full p-6 text-center text-gray-400">
                      Loading programs...
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
            <div className="mt-8 text-center">
              <Link to="/programs">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#03325a] text-white text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full sm:w-auto">
                  View All Programs
                </button>
              </Link>
            </div>
          </div>
        </section>
        {/* Call to Action */}
        <section className="py-8 xs:py-10 sm:py-14 md:py-20 bg-[#03325a] text-white py-responsive-lg">
          <div className="max-w-screen-xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-bold mb-4 xs:mb-6" style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}>{pageSettings?.cta_title || 'Ready to Start Your Tech Journey?'}</h2>
            <p className="max-w-2xl mx-auto mb-6 xs:mb-8" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
              {pageSettings?.cta_description || 'Join our community of learners and innovators today. Take the first step toward a future in technology.'}
            </p>
            <div className="flex flex-col xs:flex-row flex-wrap justify-center gap-3 xs:gap-4 sm:gap-6">
              <Link to={pageSettings?.cta_button1_link || '/programs'} className="w-full xs:w-auto">
                <button className="px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 bg-[#30d9fe] text-[#03325a] text-sm xs:text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full">
                  {pageSettings?.cta_button1_text || 'Apply Now'}
                </button>
              </Link>
              <Link to={pageSettings?.cta_button2_link || '/contact'} className="w-full xs:w-auto">
                <button className="px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 bg-[#eec262] text-[#03325a] text-sm xs:text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full">
                  {pageSettings?.cta_button2_text || 'Schedule a Call'}
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;