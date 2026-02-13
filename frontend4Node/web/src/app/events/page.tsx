"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, MapPin, Users, Video, Filter, Search, ChevronLeft, ChevronRight, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Workshops", "Webinars", "Meetups", "Bootcamps"];

const MOCK_EVENTS = [
    {
        id: "1",
        title: "V2.0 Launch Event: Scaling with Next.js",
        description: "Join our senior engineering team as we dive deep into the architecture of our modern SaaS stack.",
        date: "2026-03-15",
        time: "10:00 AM - 12:00 PM",
        location: "Online",
        category: "Webinar",
        speaker: "Michael Adebayo",
        image: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?w=800&q=80",
        attendees: 450,
        price: 0
    },
    {
        id: "2",
        title: "Lagos Tech Mixer 2026",
        description: "Connect with fellow developers and industry leaders in an afternoon of networking and innovation.",
        date: "2026-03-22",
        time: "4:00 PM - 8:00 PM",
        location: "Tech Plaza, Victoria Island",
        category: "Meetup",
        speaker: "Community Leaders",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        attendees: 120,
        price: 15
    }
];

export default function EventsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("All");

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            <section className="pt-32 pb-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
                                Global Tech Events
                            </h1>
                            <p className="mt-4 text-xl text-zinc-600 dark:text-zinc-400">
                                Join our workshops, webinars, and meetups to stay ahead of the curve.
                            </p>
                        </div>

                        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1.5 rounded-2xl">
                            {CATEGORIES.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setActiveTab(c)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                        activeTab === c
                                            ? "bg-white dark:bg-zinc-700 text-indigo-600 dark:text-white shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300"
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search for events, speakers, or topics..."
                            className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {MOCK_EVENTS.map((event, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={event.id}
                                className="group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/50 transition-all flex flex-col sm:flex-row h-full"
                            >
                                <div className="sm:w-2/5 h-64 sm:h-auto relative overflow-hidden">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 sm:hidden" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-4">
                                            <div className="flex items-center gap-1.5 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg">
                                                <CalendarIcon size={14} className="text-indigo-600" />
                                                <span className="font-bold">{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                            {event.location === "Online" ? (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg">
                                                    <Video size={14} /> Online
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-amber-600 font-bold bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-lg">
                                                    <MapPin size={14} /> {event.location.split(',')[0]}
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors">
                                            {event.title}
                                        </h2>
                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm line-clamp-2 mb-6">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(j => (
                                                        <div key={j} className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-100 overflow-hidden">
                                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Event${j + i * 5}`} alt="avatar" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-zinc-400 font-medium">+{event.attendees} attending</span>
                                            </div>
                                            <span className="text-lg font-black text-zinc-900 dark:text-white">
                                                {event.price === 0 ? "FREE" : `$${event.price}`}
                                            </span>
                                        </div>

                                        <button className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-[0.98]">
                                            Register Interest
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured CTA */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-zinc-900 rounded-[3rem] p-12 sm:p-20 relative overflow-hidden border border-white/5">
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-indigo-400 font-bold mb-6 text-sm uppercase tracking-[0.2em]">
                                <Zap size={18} /> Limited Opportunity
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                                2026 Winter <span className="text-indigo-500 text-6xl block sm:inline">Bootcamp</span>
                            </h2>
                            <p className="text-xl text-zinc-400 mb-10 max-w-md">The most intensive full-stack engineering program in the region. Only 20 spots left.</p>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20">
                                    Apply Today
                                </button>
                                <div className="flex items-center gap-3 text-white px-6">
                                    <div className="flex flex-col">
                                        <span className="text-xs uppercase text-zinc-500">Starts in</span>
                                        <span className="font-bold">12 Days</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 h-full">
                            <div className="space-y-4">
                                <div className="h-40 bg-white/5 rounded-3xl border border-white/10" />
                                <div className="h-64 bg-indigo-600/20 rounded-3xl border border-indigo-500/30" />
                            </div>
                            <div className="pt-12 space-y-4">
                                <div className="h-64 bg-white/5 rounded-3xl border border-white/10" />
                                <div className="h-40 bg-purple-600/20 rounded-3xl border border-purple-500/30" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                </div>
            </section>
        </main>
    );
}
