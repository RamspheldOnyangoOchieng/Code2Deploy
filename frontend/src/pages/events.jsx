// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/layout';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const Events = () => {
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    topic: '',
    dateRange: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [pageSettings, setPageSettings] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchPageSettings();
  }, []);

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/events/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      toast.error('Failed to load page settings');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      type: '',
      location: '',
      topic: '',
      dateRange: '',
    });
    setSelectedDate(null);
  };

  // Calendar navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Filter events by the selected date
    const dateStr = date.toISOString().split('T')[0];
    setFilters({
      ...filters,
      dateRange: dateStr,
    });
  };

  // Generate calendar days
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push(date);
    }

    return days;
  };

  // Sample events data
  const events = [
    {
      id: 1,
      title: "Web Development Workshop",
      date: "2025-05-30",
      time: "10:00 AM - 2:00 PM",
      format: "In-person",
      description: "Learn modern web development techniques with React and Node.js in this hands-on workshop.",
      location: "Tech Hub, Lagos",
      topics: ["React", "Node.js", "Frontend"],
      speaker: "Sarah Johnson",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=Professional%2520tech%2520workshop%2520with%2520diverse%2520participants%2520collaborating%2520at%2520workstations%2520with%2520computers.%2520The%2520room%2520has%2520modern%2520design%2520with%2520blue%2520accent%2520lighting%2520and%2520tech%2520company%2520branding.%2520Participants%2520are%2520engaged%2520in%2520coding%2520activities%2520with%2520instructors%2520providing%2520guidance.%2520Clean%2520professional%2520environment%2520with%2520minimal%2520distractions&width=400&height=225&seq=201&orientation=landscape"
    },
    {
      id: 2,
      title: "Data Science Fundamentals Webinar",
      date: "2025-06-05",
      time: "3:00 PM - 5:00 PM",
      format: "Online",
      description: "Introduction to data analysis, visualization, and machine learning concepts for beginners.",
      location: "Zoom",
      topics: ["Python", "Data Analysis", "Machine Learning"],
      speaker: "Dr. Michael Chen",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=Professional%2520online%2520webinar%2520session%2520with%2520data%2520visualization%2520charts%2520and%2520graphs%2520displayed%2520on%2520screen.%2520The%2520presenter%2520is%2520explaining%2520data%2520science%2520concepts%2520with%2520Python%2520code%2520examples.%2520Clean%2520professional%2520virtual%2520environment%2520with%2520blue%2520color%2520scheme%2520matching%2520the%2520website.%2520Multiple%2520participants%2520visible%2520in%2520video%2520conference%2520layout&width=400&height=225&seq=202&orientation=landscape"
    },
    {
      id: 3,
      title: "AI & Machine Learning Meetup",
      date: "2025-06-12",
      time: "6:00 PM - 8:30 PM",
      format: "In-person",
      description: "Network with AI professionals and learn about the latest advancements in machine learning.",
      location: "Innovation Center, Accra",
      topics: ["AI", "Deep Learning", "Neural Networks"],
      speaker: "Prof. Ada Okonkwo",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=Professional%2520tech%2520meetup%2520with%2520diverse%2520audience%2520in%2520a%2520modern%2520conference%2520room%2520with%2520blue%2520accent%2520lighting.%2520A%2520presenter%2520is%2520showing%2520AI%2520neural%2520network%2520visualizations%2520on%2520a%2520large%2520screen.%2520Attendees%2520are%2520engaged%2520in%2520discussion%2520about%2520machine%2520learning%2520concepts.%2520Clean%2520professional%2520environment%2520with%2520tech%2520company%2520branding&width=400&height=225&seq=203&orientation=landscape"
    },
    {
      id: 4,
      title: "Mobile App Development Bootcamp",
      date: "2025-06-15",
      time: "9:00 AM - 5:00 PM",
      format: "In-person",
      description: "Intensive one-day bootcamp on building cross-platform mobile applications with React Native.",
      location: "Code Hub, Nairobi",
      topics: ["React Native", "Mobile", "JavaScript"],
      speaker: "James Mwangi",
      status: "Limited Spots",
      image: "https://readdy.ai/api/search-image?query=Intensive%2520coding%2520bootcamp%2520with%2520diverse%2520participants%2520working%2520on%2520mobile%2520app%2520development.%2520Instructors%2520are%2520helping%2520students%2520with%2520React%2520Native%2520code%2520on%2520their%2520laptops.%2520The%2520space%2520is%2520modern%2520with%2520blue%2520accent%2520lighting%2520and%2520tech%2520company%2520branding.%2520Mobile%2520devices%2520are%2520being%2520used%2520for%2520testing%2520applications&width=400&height=225&seq=204&orientation=landscape"
    },
    {
      id: 5,
      title: "Cloud Computing Essentials Webinar",
      date: "2025-06-20",
      time: "2:00 PM - 4:00 PM",
      format: "Online",
      description: "Learn the fundamentals of cloud infrastructure, deployment, and management.",
      location: "Google Meet",
      topics: ["AWS", "Azure", "DevOps"],
      speaker: "Fatima Al-Hassan",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=Professional%2520cloud%2520computing%2520webinar%2520with%2520presenter%2520explaining%2520cloud%2520architecture%2520diagrams.%2520The%2520screen%2520shows%2520AWS%2520and%2520Azure%2520service%2520comparisons%2520with%2520deployment%2520examples.%2520Multiple%2520participants%2520are%2520visible%2520in%2520the%2520virtual%2520meeting%2520interface.%2520Clean%2520professional%2520environment%2520with%2520blue%2520color%2520scheme%2520matching%2520the%2520website&width=400&height=225&seq=205&orientation=landscape"
    },
    {
      id: 6,
      title: "Cybersecurity Best Practices Workshop",
      date: "2025-06-25",
      time: "10:00 AM - 3:00 PM",
      format: "In-person",
      description: "Hands-on workshop covering essential cybersecurity practices for developers and IT professionals.",
      location: "Tech Center, Cape Town",
      topics: ["Security", "Ethical Hacking", "Network Security"],
      speaker: "David Ndlovu",
      status: "Almost Full",
      image: "https://readdy.ai/api/search-image?query=Cybersecurity%2520workshop%2520with%2520professionals%2520analyzing%2520security%2520threats%2520on%2520computer%2520screens.%2520The%2520room%2520has%2520modern%2520design%2520with%2520blue%2520accent%2520lighting%2520and%2520network%2520security%2520visualizations%2520on%2520displays.%2520Instructors%2520are%2520demonstrating%2520ethical%2520hacking%2520techniques%2520to%2520diverse%2520participants.%2520Professional%2520environment%2520with%2520security%2520company%2520branding&width=400&height=225&seq=206&orientation=landscape"
    },
    {
      id: 7,
      title: "Blockchain Development Introduction",
      date: "2025-07-02",
      time: "1:00 PM - 4:00 PM",
      format: "Online",
      description: "Introduction to blockchain technology and smart contract development on Ethereum.",
      location: "Zoom",
      topics: ["Blockchain", "Ethereum", "Smart Contracts"],
      speaker: "Emmanuel Osei",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=Professional%2520blockchain%2520development%2520webinar%2520with%2520presenter%2520explaining%2520blockchain%2520architecture%2520and%2520smart%2520contract%2520code.%2520The%2520screen%2520shows%2520Ethereum%2520development%2520environment%2520with%2520code%2520examples.%2520Multiple%2520participants%2520are%2520visible%2520in%2520the%2520virtual%2520meeting%2520interface.%2520Clean%2520professional%2520environment%2520with%2520blue%2520color%2520scheme&width=400&height=225&seq=207&orientation=landscape"
    },
    {
      id: 8,
      title: "UI/UX Design Principles Meetup",
      date: "2025-07-10",
      time: "5:30 PM - 7:30 PM",
      format: "In-person",
      description: "Discussion on modern UI/UX design principles and practices for creating exceptional user experiences.",
      location: "Design Studio, Lagos",
      topics: ["UI/UX", "Design", "User Research"],
      speaker: "Amina Diallo",
      status: "Available",
      image: "https://readdy.ai/api/search-image?query=UI%2520UX%2520design%2520meetup%2520with%2520professionals%2520discussing%2520interface%2520designs%2520displayed%2520on%2520large%2520screens.%2520The%2520space%2520is%2520modern%2520with%2520blue%2520accent%2520lighting%2520and%2520design%2520company%2520branding.%2520Participants%2520are%2520reviewing%2520wireframes%2520and%2520prototypes%2520while%2520the%2520presenter%2520explains%2520design%2520principles.%2520Creative%2520professional%2520environment&width=400&height=225&seq=208&orientation=landscape"
    },
    {
      id: 9,
      title: "DevOps Pipeline Automation Workshop",
      date: "2025-07-15",
      time: "9:00 AM - 4:00 PM",
      format: "In-person",
      description: "Learn to build and optimize CI/CD pipelines for efficient software delivery and deployment.",
      location: "Tech Park, Johannesburg",
      topics: ["DevOps", "CI/CD", "Docker"],
      speaker: "Thomas Mbeki",
      status: "Limited Spots",
      image: "https://readdy.ai/api/search-image?query=DevOps%2520workshop%2520with%2520professionals%2520working%2520on%2520CI%2520CD%2520pipeline%2520configurations.%2520The%2520room%2520has%2520modern%2520design%2520with%2520blue%2520accent%2520lighting%2520and%2520multiple%2520screens%2520showing%2520Docker%2520containers%2520and%2520deployment%2520workflows.%2520Instructors%2520are%2520helping%2520diverse%2520participants%2520with%2520automation%2520scripts.%2520Professional%2520tech%2520environment&width=400&height=225&seq=209&orientation=landscape"
    }
  ];

  // Filter events based on search term and filters
  useEffect(() => {
    let results = [...events];

    if (searchTerm) {
      results = results.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.topics.some((topic) => topic.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.type) {
      results = results.filter(event => {
        if (filters.type === 'Workshops') return event.title.includes('Workshop') || event.title.includes('Bootcamp');
        if (filters.type === 'Webinars') return event.format === 'Online';
        if (filters.type === 'Meetups') return event.title.includes('Meetup');
        return true;
      });
    }

    if (filters.location) {
      results = results.filter(event => event.format.toLowerCase() === filters.location.toLowerCase());
    }

    if (filters.topic) {
      results = results.filter(event =>
        event.topics.some((topic) => topic.toLowerCase() === filters.topic.toLowerCase())
      );
    }

    if (filters.dateRange) {
      results = results.filter(event => event.date === filters.dateRange);
    }

    setFilteredEvents(results);
  }, [searchTerm, filters]);

  // Initialize filtered events on component mount
  useEffect(() => {
    setFilteredEvents(events);
  }, []);

  // Get event dates for calendar highlighting
  const eventDates = events.map(event => new Date(event.date));

  // Check if a date has events
  const hasEvents = (date) => {
    return eventDates.some(eventDate =>
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="bg-[#03325a] text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{pageSettings?.hero_title || 'Upcoming Events'}</h1>
              <p className="text-base sm:text-lg text-gray-300">{pageSettings?.hero_subtitle || 'Discover workshops, webinars, and tech meetups to enhance your skills'}</p>
              {pageSettings?.hero_description && (
                <p className="text-sm text-gray-400 mt-2">{pageSettings.hero_description}</p>
              )}
            </div>
            <div className="mt-8 text-center">
              <Link to="/">
                <button className="px-6 py-3 sm:px-8 sm:py-4 bg-[#03325a] text-white text-base sm:text-lg font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap w-full sm:w-auto">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar and Filter Section */}
      <section className="py-6 sm:py-8 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full max-w-md mx-auto lg:mx-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[#03325a]">Event Calendar</h3>
                <div className="flex space-x-2">
                  <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#30d9fe]">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#30d9fe]">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
              <h4 className="text-center font-medium text-gray-700 mb-4">
                {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
              </h4>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                  <div key={index} className="text-xs sm:text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((date, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center text-xs sm:text-sm rounded-full cursor-pointer ${!date ? 'text-gray-300' : 'hover:bg-gray-100'} ${date && selectedDate && date.toDateString() === selectedDate.toDateString() ? 'bg-[#03325a] text-white hover:bg-[#03325a]' : ''} ${date && hasEvents(date) ? 'font-bold' : ''}`}
                    onClick={() => date && handleDateClick(date)}
                  >
                    {date ? (
                      <div className="relative">
                        <span>{date.getDate()}</span>
                        {hasEvents(date) && (
                          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-1 h-1 rounded-full bg-[#30d9fe]"></span>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
              {selectedDate && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-[#03325a] text-sm sm:text-base">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  <div className="mt-2">
                    {filteredEvents.length > 0 ? (
                      <p className="text-xs sm:text-sm text-gray-600">{filteredEvents.length} event(s) scheduled</p>
                    ) : (
                      <p className="text-xs sm:text-sm text-gray-600">No events scheduled</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Filter Section */}
            <div className="lg:col-span-2 w-full">
              <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#03325a] mb-4">Find Events</h3>
                {/* Search Bar */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2 sm:py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent text-sm"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4">
                  {/* Event Type Filter */}
                  <div className="relative">
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="appearance-none w-full py-2 sm:py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent bg-white text-sm cursor-pointer"
                    >
                      <option value="">Event Type (All)</option>
                      <option value="Workshops">Workshops</option>
                      <option value="Webinars">Webinars</option>
                      <option value="Meetups">Meetups</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                  {/* Location Filter */}
                  <div className="relative">
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="appearance-none w-full py-2 sm:py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent bg-white text-sm cursor-pointer"
                    >
                      <option value="">Location (All)</option>
                      <option value="Online">Online</option>
                      <option value="In-person">In-person</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                  {/* Topic Filter */}
                  <div className="relative">
                    <select
                      value={filters.topic}
                      onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
                      className="appearance-none w-full py-2 sm:py-3 px-4 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent bg-white text-sm cursor-pointer"
                    >
                      <option value="">Topic (All)</option>
                      <option value="React">React</option>
                      <option value="Python">Python</option>
                      <option value="AI">AI</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Blockchain">Blockchain</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="Security">Security</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <i className="fas fa-chevron-down text-xs"></i>
                    </div>
                  </div>
                  {/* Clear Filters Button */}
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 sm:py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 text-sm font-medium !rounded-button cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Clear Filters
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-600 gap-2">
                  <p>{filteredEvents.length} events found</p>
                  {selectedDate && (
                    <div className="flex items-center">
                      <span>Filtered by date: </span>
                      <span className="ml-1 font-medium">{selectedDate.toLocaleDateString()}</span>
                      <button
                        onClick={() => { setSelectedDate(null); setFilters({ ...filters, dateRange: '' }); }}
                        className="ml-2 text-[#03325a] hover:text-[#30d9fe] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-8 sm:py-12 min-h-[600px]">
        <div className="container mx-auto px-4 sm:px-6">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col">
                  <div className="h-40 sm:h-48 overflow-hidden relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute top-0 left-0 m-2 sm:m-3">
                      <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full ${event.format === 'Online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {event.format}
                      </span>
                    </div>
                    <div className="absolute top-0 right-0 m-2 sm:m-3">
                      <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full ${event.status === 'Available' ? 'bg-green-100 text-green-800' :
                          event.status === 'Limited Spots' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-[#03325a]">{event.title}</h3>
                    <div className="flex items-center mb-2 sm:mb-3 text-gray-600 text-xs sm:text-sm">
                      <i className="far fa-calendar-alt mr-2 text-[#30d9fe]"></i>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center mb-2 sm:mb-4 text-gray-600 text-xs sm:text-sm">
                      <i className="fas fa-map-marker-alt mr-2 text-[#30d9fe]"></i>
                      <span>{event.location}</span>
                    </div>
                    <p className="text-gray-600 mb-2 sm:mb-4 line-clamp-2 text-xs sm:text-sm">{event.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2 sm:mb-4">
                      {event.topics.map((topic, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{topic}</span>
                      ))}
                    </div>
                    <div className="flex items-center mb-2 sm:mb-4 text-gray-600 text-xs sm:text-sm">
                      <i className="fas fa-user-tie mr-2 text-[#30d9fe]"></i>
                      <span>Presented by: <span className="font-medium">{event.speaker}</span></span>
                    </div>
                    <button className="w-full py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap mt-auto text-xs sm:text-base">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="text-center mb-6">
                <i className="fas fa-calendar-times text-5xl sm:text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl sm:text-2xl font-bold text-[#03325a] mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">{pageSettings?.no_events_message || "We couldn't find any events matching your search criteria."}</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-[#30d9fe] text-[#03325a] font-medium rounded-lg hover:bg-opacity-90 transition-all duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Events;
