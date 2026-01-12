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
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageSettings();
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/events/events/`);
      if (response.ok) {
        const data = await response.json();
        // Backend returns an array or an object with results? 
        // Based on ListCreateAPIView it should be an array (unless paginated)
        // AdminEvents.jsx suggests it might be data.events if it was custom, 
        // but EventListCreateView is standard generics.
        const eventsArray = Array.isArray(data) ? data : (data.results || []);

        // Transform topics from comma-separated string to array for frontend
        const transformedEvents = eventsArray.map(event => ({
          ...event,
          topics: event.topics ? event.topics.split(',').map(t => t.trim()) : []
        }));

        setEvents(transformedEvents);
        setFilteredEvents(transformedEvents);
      }
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const fetchPageSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/events/`);
      if (response.ok) {
        const data = await response.json();
        setPageSettings(data);
      }
    } catch (error) {
      // toast.error('Failed to load page settings');
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
    setFilteredEvents(events);
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
        if (filters.type === 'Workshops') return event.category === 'Workshop' || event.title.includes('Workshop') || event.title.includes('Bootcamp');
        if (filters.type === 'Webinars') return event.format === 'Online' || event.category === 'Webinar';
        if (filters.type === 'Meetups') return event.category === 'Meetup' || event.title.includes('Meetup');
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
  }, [searchTerm, filters, events]);

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
