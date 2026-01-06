// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageSettings, setPageSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchPageSettings();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/about/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      console.error('Error fetching about page settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-72 sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center" style={{backgroundImage: pageSettings?.hero_image_url ? `url('${pageSettings.hero_image_url}')` : "url('https://readdy.ai/api/search-image?query=Modern%20tech%20office%20environment%20with%20abstract%20geometric%20patterns%20in%20blue%20and%20white.%20Professional%20workspace%20with%20subtle%20technology%20elements%20and%20clean%20minimalist%20design.%20Soft%20lighting%20creating%20an%20inviting%20atmosphere%20perfect%20for%20text%20overlay.%20Contemporary%20corporate%20setting%20with%20innovative%20architectural%20details&width=1440&height=600&seq=301&orientation=landscape')"}}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#03325a] to-transparent">
          <div className="container mx-auto px-4 sm:px-6 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{pageSettings?.hero_title || 'About Code2Deploy'}</h2>
                  <p className="text-base sm:text-lg text-gray-300">{pageSettings?.hero_subtitle || 'Empowering African youth with cutting-edge tech skills'}</p>
                </div>
                <Link to="/" className="inline-flex items-center text-[#30d9fe] hover:text-white transition-colors duration-300 cursor-pointer text-base sm:text-lg">
                  <i className="fas fa-arrow-left mr-2"></i>
                  <span>Back to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="mb-4 sm:mb-6">
                <i className="fas fa-rocket text-3xl sm:text-4xl text-[#30d9fe]"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#03325a] mb-2 sm:mb-4">{pageSettings?.mission_title || 'Our Mission'}</h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{pageSettings?.mission_description || 'To bridge the digital skills gap in Africa by providing world-class technology education and creating pathways to successful careers in the global tech industry.'}</p>
            </div>
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
              <div className="mb-4 sm:mb-6">
                <i className="fas fa-eye text-3xl sm:text-4xl text-[#30d9fe]"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#03325a] mb-2 sm:mb-4">{pageSettings?.vision_title || 'Our Vision'}</h2>
              <p className="text-gray-600 leading-relaxed text-base sm:text-lg">{pageSettings?.vision_description || "To be Africa's leading technology education platform, empowering the next generation of tech leaders and innovators who will drive the continent's digital transformation."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#03325a] text-center mb-8 sm:mb-12">{pageSettings?.journey_title || 'Our Journey'}</h2>
          <div className="flex overflow-x-auto pb-6 sm:pb-8 space-x-4 sm:space-x-8 scrollbar-thin scrollbar-thumb-[#30d9fe]/40 scrollbar-track-gray-200">
            {[
              {
                year: "2020",
                title: "Foundation",
                description: "Code2Deploy was established with a vision to transform tech education in Africa.",
                image: "https://readdy.ai/api/search-image?query=Modern%20startup%20office%20launch%20celebration%20with%20team%20members%20collaborating%20in%20contemporary%20workspace.%20Professional%20environment%20with%20blue%20accent%20lighting%20and%20minimal%20design.%20Technology%20focused%20setting%20with%20computers%20and%20collaboration%20spaces&width=300&height=200&seq=302&orientation=landscape"
              },
              {
                year: "2021",
                title: "First Cohort",
                description: "Successfully launched our first training program with 100 students.",
                image: "https://readdy.ai/api/search-image?query=Diverse%20group%20of%20students%20learning%20coding%20in%20modern%20classroom%20setting%20with%20blue%20accent%20lighting.%20Professional%20educational%20environment%20with%20computers%20and%20interactive%20displays.%20Clean%20minimal%20design%20focused%20on%20learning&width=300&height=200&seq=303&orientation=landscape"
              },
              {
                year: "2022",
                title: "Regional Expansion",
                description: "Expanded operations to 5 African countries, reaching 1000+ students.",
                image: "https://readdy.ai/api/search-image?query=Modern%20office%20expansion%20celebration%20in%20professional%20tech%20environment.%20Multiple%20locations%20connected%20through%20technology%20with%20blue%20accent%20lighting.%20Contemporary%20workspace%20design%20with%20collaborative%20areas&width=300&height=200&seq=304&orientation=landscape"
              },
              {
                year: "2023",
                title: "Industry Partnerships",
                description: "Formed strategic partnerships with leading tech companies.",
                image: "https://readdy.ai/api/search-image?query=Professional%20business%20meeting%20in%20modern%20corporate%20office%20with%20tech%20industry%20leaders.%20Contemporary%20meeting%20room%20with%20blue%20accent%20lighting%20and%20minimal%20design.%20Partnership%20focused%20environment&width=300&height=200&seq=305&orientation=landscape"
              },
              {
                year: "2024",
                title: "Digital Innovation",
                description: "Launched innovative online learning platform and mobile app.",
                image: "https://readdy.ai/api/search-image?query=Modern%20tech%20product%20launch%20event%20in%20contemporary%20office%20space.%20Digital%20displays%20showing%20mobile%20applications%20with%20blue%20accent%20lighting.%20Professional%20environment%20focused%20on%20innovation&width=300&height=200&seq=306&orientation=landscape"
              }
            ].map((milestone, index) => (
              <div key={index} className="flex-none w-64 sm:w-80 bg-white rounded-xl shadow-lg overflow-hidden">
                <img src={milestone.image} alt={milestone.title} className="w-full h-36 sm:h-48 object-cover object-top" />
                <div className="p-4 sm:p-6">
                  <span className="text-[#30d9fe] font-bold text-lg">{milestone.year}</span>
                  <h3 className="text-lg sm:text-xl font-bold text-[#03325a] mt-2 mb-2 sm:mb-3">{milestone.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#03325a] text-center mb-8 sm:mb-12">{pageSettings?.team_title || 'Our Leadership Team'}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Dr. Sarah Okonjo",
                role: "Founder & CEO",
                bio: "Former Google engineer with 15 years of experience in tech education.",
                image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20confident%20African%20female%20tech%20executive%20in%20modern%20office%20setting.%20Clean%20background%20with%20subtle%20blue%20lighting.%20Business%20attire%20and%20welcoming%20expression&width=400&height=400&seq=307&orientation=squarish"
              },
              {
                name: "Michael Adebayo",
                role: "Chief Technology Officer",
                bio: "Tech innovator with extensive experience in software architecture.",
                image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20African%20male%20tech%20leader%20in%20modern%20office%20environment.%20Clean%20background%20with%20subtle%20blue%20lighting.%20Business%20casual%20attire%20and%20friendly%20expression&width=400&height=400&seq=308&orientation=squarish"
              },
              {
                name: "Dr. Amina Hassan",
                role: "Head of Education",
                bio: "EdTech specialist with PhD in Computer Science Education.",
                image: "https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20African%20female%20education%20leader%20in%20modern%20office%20setting.%20Clean%20background%20with%20subtle%20blue%20lighting.%20Professional%20attire%20and%20engaging%20expression&width=400&height=400&seq=309&orientation=squarish"
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
                <div className="h-56 sm:h-80 overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-bold text-[#03325a] mb-1 sm:mb-2">{member.name}</h3>
                  <p className="text-[#30d9fe] font-medium mb-2 sm:mb-3">{member.role}</p>
                  <p className="text-gray-600 mb-2 sm:mb-4 text-sm sm:text-base">{member.bio}</p>
                  <div className="flex space-x-4 mt-auto">
                    <a href="#" className="text-gray-400 hover:text-[#30d9fe] transition-colors duration-300 cursor-pointer">
                      <i className="fab fa-linkedin text-xl"></i>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#30d9fe] transition-colors duration-300 cursor-pointer">
                      <i className="fab fa-twitter text-xl"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-10 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#03325a] text-center mb-8 sm:mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: "fas fa-star",
                title: "Excellence",
                description: "We strive for excellence in everything we do, from curriculum development to student support."
              },
              {
                icon: "fas fa-handshake",
                title: "Collaboration",
                description: "We believe in the power of collaboration and partnership to achieve greater impact."
              },
              {
                icon: "fas fa-lightbulb",
                title: "Innovation",
                description: "We embrace innovation and continuously adapt to evolving technology trends."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-center hover:transform hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 mx-auto mb-4 sm:mb-6 bg-[#30d9fe] bg-opacity-10 rounded-full flex items-center justify-center">
                  <i className={`${value.icon} text-xl sm:text-2xl text-[#30d9fe]`}></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#03325a] mb-2 sm:mb-4">{value.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 sm:py-16 bg-[#03325a]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl sm:max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Join Our Mission to Transform Tech Education in Africa</h2>
            <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">Whether you're a student looking to start your tech journey or an organization interested in partnership opportunities, we'd love to hear from you.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#30d9fe] text-[#03325a] font-medium !rounded-button hover:bg-opacity-90 transition-all duration-300 cursor-pointer whitespace-nowrap w-full sm:w-auto">Join Our Programs</button>
              <button className="px-6 py-3 sm:px-8 sm:py-4 border-2 border-[#30d9fe] text-white font-medium !rounded-button hover:bg-[#30d9fe] hover:text-[#03325a] transition-all duration-300 cursor-pointer whitespace-nowrap w-full sm:w-auto">Partner With Us</button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
