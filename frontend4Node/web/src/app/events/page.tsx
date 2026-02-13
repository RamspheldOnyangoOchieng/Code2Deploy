"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import OriginalLayout from '@/components/OriginalLayout';

export default function EventsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [events, setEvents] = useState<any[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/`);
            if (response.ok) {
                const data = await response.json();
                const eventsArray = Array.isArray(data) ? data : (data.results || []);
                setEvents(eventsArray);
                setFilteredEvents(eventsArray);
            }
        } catch (error) {
            console.error('Failed to load events');
        } finally {
            setLoading(false);
        }
    };

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
        return days;
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        const dateStr = date.toISOString().split('T')[0];
        setFilteredEvents(events.filter(e => e.date === dateStr));
    };

    return (
        <OriginalLayout>
            <div className="bg-[#03325a] text-white py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">Upcoming Events</h1>
                            <p className="text-lg text-gray-300">Discover workshops, webinars, and tech meetups</p>
                        </div>
                        <Link href="/">
                            <button className="px-8 py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all">Back to Home</button>
                        </Link>
                    </div>
                </div>
            </div>

            <section className="py-12 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Calendar */}
                        <div className="bg-white rounded-xl shadow-lg p-6 font-sans">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#03325a]">Event Calendar</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                        <i className="fas fa-chevron-left text-gray-500"></i>
                                    </button>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                        <i className="fas fa-chevron-right text-gray-500"></i>
                                    </button>
                                </div>
                            </div>
                            <h4 className="text-center font-bold text-gray-700 mb-4">
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h4>
                            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-gray-400 mb-2">
                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                                {generateCalendarDays().map((date, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => date && handleDateClick(date)}
                                        className={`aspect-square flex items-center justify-center rounded-full text-sm cursor-pointer transition-all ${!date ? '' : 'hover:bg-gray-100'} ${date && selectedDate?.toDateString() === date.toDateString() ? 'bg-[#03325a] text-white shadow-lg' : ''}`}
                                    >
                                        {date?.getDate()}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* List */}
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-200 font-sans outline-none focus:ring-2 focus:ring-[#30d9fe]"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"></i>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredEvents.map(event => (
                                    <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-all">
                                        <div className="h-48 relative">
                                            {event.image && <img src={event.image} className="w-full h-full object-cover" />}
                                            <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">{event.category}</div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-[#03325a] mb-2">{event.title}</h3>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <span className="flex items-center gap-1"><i className="far fa-calendar"></i> {event.date}</span>
                                                <span className="flex items-center gap-1"><i className="far fa-clock"></i> {event.time}</span>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-6 line-clamp-2">{event.description}</p>
                                            <button className="mt-auto w-full py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-opacity-90 transition-all shadow-md">Register Now</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </OriginalLayout>
    );
}
