import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Layout from '../components/layout';
import '../styles/swiper-custom.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800" style={{ backgroundColor: '#0A0F2C' }}>
      {/* Hero Section */}
        <section className="relative min-h-[70vh] flex flex-col justify-center items-center overflow-hidden px-2 sm:px-4 py-10 sm:py-20">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 animated-hero-bg" style={{ backgroundImage: `url('https://readdy.ai/api/search-image?query=futuristic%20digital%20brain%20with%20neural%20networks%20and%20glowing%20connections%20in%20dark%20blue%20space%20with%20cyan%20and%20electric%20blue%20lighting%20effects%20modern%20tech%20background&width=1440&height=1024&seq=hero-bg-001&orientation=landscape')` }} />
          <div className="relative z-10 w-full max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-8 items-center">
            <div className="w-full lg:w-1/2 text-left">
                <h1 className="mb-6 font-extrabold leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
                  <span className="block">From</span>
                  <span className="text-[#30d9fe]">Hello World</span>
                  <span className="block">to</span>
                  <span className="text-[#eec262]">Hello AI</span>
              </h1>
                <p className="max-w-xl mb-8 text-base sm:text-xl md:text-2xl text-gray-200">
                  Empowering African youth with cutting-edge tech skills to build solutions that matter.<br className="hidden sm:inline" />
                  <span className="block sm:inline">Join our community of innovators today.</span>
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link to="/programs">
                    <button className="px-6 py-3 text-base font-bold rounded-lg bg-[#30d9fe] text-[#03325a] hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap shadow-md w-full sm:w-auto">Join a Program</button>
                  </Link>
                  <Link to="/events">
                    <button className="px-6 py-3 text-base font-bold rounded-lg bg-[#eec262] text-[#03325a] hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap shadow-md w-full sm:w-auto">Upcoming Events</button>
                  </Link>
                </div>
              </div>
            <div className="w-full lg:w-1/2 flex justify-center items-center mt-8 lg:mt-0">
              <div className="w-full max-w-xs sm:max-w-md md:max-w-lg h-60 sm:h-80 md:h-96 relative overflow-hidden rounded-2xl shadow-lg">
                <img
                  src="https://readdy.ai/api/search-image?query=abstract%20digital%20brain%20with%20glowing%20neural%20pathways%20and%20AI%20connections%20floating%20in%20space%20with%20bright%20cyan%20and%20electric%20blue%20colors%20modern%20minimalist%20tech%20illustration&width=600&height=400&seq=hero-img-001&orientation=landscape"
                  alt="AI Brain Illustration"
                  className="w-full h-full object-cover object-top"
                />
            </div>
          </div>
        </div>
      </section>
      {/* Value Proposition */}
        <section className="py-8 sm:py-14 md:py-20">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-[#30d9fe]">Our Approach</h2>
            <p className="text-base sm:text-lg text-center text-gray-300 max-w-3xl mx-auto mb-8">
              Most courses stop at code. We take you further. By the end of our program, you'll have:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
                  className="bg-slate-700 rounded-xl p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#00F0FF' }}>
                    <i className={`${item.icon} text-2xl`} style={{ color: '#0A0F2C' }}></i>
            </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm sm:text-base">{item.description}</p>
            </div>
              ))}
            </div>
          </div>
        </section>
      {/* What We Do Section */}
        <section className="py-8 sm:py-14 md:py-20">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 md:pr-10 mb-8 md:mb-0">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#30d9fe]">What We Do</h2>
                <ul className="space-y-4">
                <li className="flex items-start">
                    <div className="bg-[#03325a] p-2 rounded-full mr-4 mt-1">
                      <i className="fas fa-laptop-code text-[#30d9fe] text-base"></i>
                  </div>
                  <div>
                      <h3 className="mb-1 text-[#30d9fe] text-lg sm:text-xl font-bold">Coding Bootcamps</h3>
                      <p className="text-white text-base">Intensive training programs for beginners and intermediate developers.</p>
                  </div>
                </li>
                <li className="flex items-start">
                    <div className="bg-[#03325a] p-2 rounded-full mr-4 mt-1">
                      <i className="fas fa-project-diagram text-[#30d9fe] text-base"></i>
                  </div>
                  <div>
                      <h3 className="mb-1 text-[#30d9fe] text-lg sm:text-xl font-bold">Project-Based Learning</h3>
                      <p className="text-white text-base">Hands-on experience building real applications with modern technologies.</p>
                  </div>
                </li>
                <li className="flex items-start">
                    <div className="bg-[#03325a] p-2 rounded-full mr-4 mt-1">
                      <i className="fas fa-users text-[#30d9fe] text-base"></i>
                  </div>
                  <div>
                      <h3 className="mb-1 text-[#30d9fe] text-lg sm:text-xl font-bold">Mentorship Programs</h3>
                      <p className="text-white text-base">Connect with industry professionals who guide your tech journey.</p>
                  </div>
                </li>
                <li className="flex items-start">
                    <div className="bg-[#03325a] p-2 rounded-full mr-4 mt-1">
                      <i className="fas fa-briefcase text-[#30d9fe] text-base"></i>
                  </div>
                  <div>
                      <h3 className="mb-1 text-[#30d9fe] text-lg sm:text-xl font-bold">Career Development</h3>
                      <p className="text-white text-base">Resume building, interview preparation, and job placement assistance.</p>
                  </div>
                </li>
              </ul>
            </div>
              <div className="w-full md:w-1/2 rounded-xl mt-4 md:mt-0 overflow-hidden flex justify-center items-center">
              <img
                src="https://readdy.ai/api/search-image?query=A%20diverse%20group%20of%20young%20African%20students%20collaborating%20on%20coding%20projects%20in%20a%20modern%20tech%20workspace.%20They%20are%20engaged%2C%20smiling%2C%20and%20working%20together%20on%20laptops.%20The%20scene%20shows%20both%20male%20and%20female%20students%20of%20various%20ages%2C%20representing%20the%20diversity%20of%20African%20youth%20in%20technology%20education.%20The%20lighting%20is%20bright%20and%20natural%2C%20creating%20an%20inspiring%20atmosphere&width=600&height=500&seq=2&orientation=landscape"
                alt="Diverse African youth coding"
                  className="object-cover object-top w-full h-60 sm:h-80 md:h-96 shadow-lg rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Program Carousel */}
        <section className="py-8 sm:py-14 md:py-20 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-[#03325a]">Our Programs</h2>
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
            {/* Web Development */}
            <SwiperSlide>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full transition-transform duration-300 hover:scale-[1.02]">
                  <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Modern%20web%20development%20workspace%20with%20code%20on%20screen%2C%20showing%20HTML%2C%20CSS%2C%20and%20JavaScript.%20Clean%2C%20professional%20setup%20with%20a%20minimalist%20design.%20The%20image%20has%20a%20blue-tinted%20tech%20aesthetic%20that%20matches%20the%20websites%20color%20scheme%2C%20with%20clean%20lines%20and%20a%20professional%20look&width=400&height=250&seq=3&orientation=landscape"
                    alt="Web Development"
                      className="object-cover object-top w-full h-full"
                  />
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">12 Weeks</span>
                      <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">Beginner</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[#03325a]">Full-Stack Web Development</h3>
                    <p className="mb-3 text-gray-600 text-sm md:text-base">Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to build complete web applications.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">HTML/CSS</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">JavaScript</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">React</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Node.js</span>
                  </div>
                    <button className="w-full py-2 text-sm md:text-base bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap">View Details</button>
                </div>
              </div>
            </SwiperSlide>
            {/* Data Science */}
            <SwiperSlide>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full transition-transform duration-300 hover:scale-[1.02]">
                  <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Data%20science%20visualization%20with%20charts%2C%20graphs%2C%20and%20Python%20code%20on%20screen.%20The%20image%20shows%20data%20analysis%20in%20progress%20with%20colorful%20data%20visualizations.%20Modern%2C%20clean%20workspace%20with%20a%20professional%20look.%20The%20color%20scheme%20includes%20blues%20that%20match%20the%20websites%20color%20palette%2C%20creating%20a%20cohesive%20visual%20experience&width=400&height=250&seq=4&orientation=landscape"
                    alt="Data Science"
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">16 Weeks</span>
                      <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">Intermediate</span>
                  </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[#03325a]">Data Science & Analytics</h3>
                    <p className="mb-3 text-gray-600 text-sm md:text-base">Master data analysis, visualization, and machine learning with Python and its powerful libraries.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Python</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Pandas</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">NumPy</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Scikit-learn</span>
                  </div>
                    <button className="w-full py-2 text-sm md:text-base bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap">View Details</button>
                </div>
              </div>
            </SwiperSlide>
            {/* Mobile Development */}
            <SwiperSlide>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full transition-transform duration-300 hover:scale-[1.02]">
                  <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Mobile%20app%20development%20workspace%20with%20smartphone%20mockups%20and%20React%20Native%20code%20on%20screen.%20The%20image%20shows%20a%20professional%20development%20environment%20with%20mobile%20UI%20designs%20visible.%20Clean%2C%20modern%20aesthetic%20with%20blue%20tones%20that%20match%20the%20websites%20color%20scheme%2C%20creating%20a%20cohesive%20visual%20experience&width=400&height=250&seq=5&orientation=landscape"
                    alt="Mobile Development"
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">14 Weeks</span>
                      <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">Intermediate</span>
                  </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[#03325a]">Mobile App Development</h3>
                    <p className="mb-3 text-gray-600 text-sm md:text-base">Build cross-platform mobile applications using React Native for iOS and Android devices.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">JavaScript</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">React Native</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Redux</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Firebase</span>
                  </div>
                    <button className="w-full py-2 text-sm md:text-base bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap">View Details</button>
                </div>
              </div>
            </SwiperSlide>
            {/* AI & Machine Learning */}
            <SwiperSlide>
              <div className="bg-white rounded-xl overflow-hidden shadow-lg h-full transition-transform duration-300 hover:scale-[1.02]">
                  <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img
                    src="https://readdy.ai/api/search-image?query=Artificial%20intelligence%20and%20machine%20learning%20workspace%20with%20neural%20network%20visualizations%20and%20Python%20code.%20The%20image%20shows%20AI%20models%20being%20trained%20with%20data%20flowing%20through%20network%20nodes.%20Professional%2C%20clean%20aesthetic%20with%20blue%20tones%20that%20match%20the%20websites%20color%20scheme%2C%20creating%20a%20cohesive%20visual%20experience&width=400&height=250&seq=6&orientation=landscape"
                    alt="AI & Machine Learning"
                    className="object-cover object-top w-full h-full"
                  />
                </div>
                  <div className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">20 Weeks</span>
                      <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">Advanced</span>
                  </div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 text-[#03325a]">AI & Machine Learning</h3>
                    <p className="mb-3 text-gray-600 text-sm md:text-base">Dive deep into artificial intelligence, neural networks, and advanced machine learning algorithms.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Python</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">TensorFlow</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">PyTorch</span>
                      <span className="px-2 py-1 text-xs text-gray-800 bg-gray-100 rounded">Keras</span>
                  </div>
                    <button className="w-full py-2 text-sm md:text-base bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap">View Details</button>
                </div>
              </div>
            </SwiperSlide>
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
        <section className="py-8 sm:py-14 md:py-20 bg-[#03325a] text-white">
          <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Ready to Start Your Tech Journey?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-base sm:text-lg md:text-xl lg:text-2xl">
            Join our community of learners and innovators today. Take the first step toward a future in technology.
          </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#30d9fe] text-[#03325a] text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full sm:w-auto">
              Apply Now
            </button>
              <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#eec262] text-[#03325a] text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full sm:w-auto">
              Schedule a Call
            </button>
          </div>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Home;