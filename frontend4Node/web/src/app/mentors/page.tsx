"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Globe, Linkedin, Twitter, Github, Star, Award, MessageSquare, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const EXPERTISE_CATEGORIES = ["All", "Frontend", "Backend", "DevOps", "Cybersecurity", "Blockchain", "AI/ML"];

const MOCK_MENTORS = [
    {
        id: "1",
        name: "Dr. Sarah Chen",
        role: "Senior Cloud Architect",
        company: "Google Cloud",
        bio: "Ex-AWS Lead with over 15 years of experience in distributed systems. Specialist in high-scale Next.js architectures.",
        expertise: ["Frontend", "DevOps", "Cloud Native"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        rating: 4.9,
        reviews: 128,
        experience: "15+ years",
        location: "Stockholm, Sweden",
        links: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
        id: "2",
        name: "Michael Adebayo",
        role: "Full Stack Lead",
        company: "Paystack",
        bio: "Passionate about building scalable fintech solutions. Creator of several open-source React libraries used by thousands.",
        expertise: ["Frontend", "Backend", "Fintech"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
        rating: 5.0,
        reviews: 94,
        experience: "8+ years",
        location: "Lagos, Nigeria",
        links: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
        id: "3",
        name: "Elena Rodriguez",
        role: "Cybersecurity Analyst",
        company: "Snyk",
        bio: "Security-first developer focusing on DevSecOps and secure coding practices for enterprise applications.",
        expertise: ["Cybersecurity", "DevOps"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
        rating: 4.8,
        reviews: 76,
        experience: "10+ years",
        location: "Madrid, Spain",
        links: { linkedin: "#", github: "#", twitter: "#" }
    },
    {
        id: "4",
        name: "James Wilson",
        role: "Blockchain Engineer",
        company: "Polygon",
        bio: "Specializing in Smart Contract security and Layer 2 scaling solutions. Helped launch 20+ DeFi protocols.",
        expertise: ["Blockchain", "Backend"],
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
        rating: 4.9,
        reviews: 112,
        experience: "6+ years",
        location: "London, UK",
        links: { linkedin: "#", github: "#", twitter: "#" }
    }
];

export default function MentorsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");

    const filteredMentors = MOCK_MENTORS.filter(m => {
        const matchesCategory = activeCategory === "All" || m.expertise.includes(activeCategory);
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.role.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            {/* Hero Header */}
            <section className="pt-32 pb-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-6xl"
                        >
                            Learn from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">World's Best</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-xl text-zinc-600 dark:text-zinc-400"
                        >
                            Get personalized 1-on-1 mentorship from industry leaders at Google, Amazon, and top startups.
                        </motion.p>
                    </div>

                    <div className="mt-12 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by name, role, or company..."
                                className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Tabs */}
            <div className="sticky top-[80px] z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {EXPERTISE_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                    activeCategory === cat
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mentors Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredMentors.map((mentor, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={mentor.id}
                                    className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-8 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row gap-8 shadow-sm hover:shadow-xl group"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-zinc-100 dark:border-zinc-800">
                                                <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                                                <Award size={16} />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-1 text-amber-500 font-bold">
                                            <Star size={16} fill="currentColor" />
                                            <span>{mentor.rating}</span>
                                            <span className="text-zinc-400 text-xs font-medium">({mentor.reviews})</span>
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <a href={mentor.links.linkedin} className="text-zinc-400 hover:text-indigo-600 transition-colors"><Linkedin size={18} /></a>
                                            <a href={mentor.links.github} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"><Github size={18} /></a>
                                            <a href={mentor.links.twitter} className="text-zinc-400 hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h2 className="text-2xl font-black text-zinc-900 dark:text-white">{mentor.name}</h2>
                                                <p className="text-indigo-600 font-bold text-sm tracking-wide">{mentor.role}</p>
                                            </div>
                                            <div className="bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg text-xs font-bold text-zinc-500">
                                                {mentor.company}
                                            </div>
                                        </div>

                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 line-clamp-3 italic">
                                            "{mentor.bio}"
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Briefcase size={14} className="text-indigo-500" />
                                                <span className="text-xs font-bold">{mentor.experience}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Globe size={14} className="text-indigo-500" />
                                                <span className="text-xs font-bold truncate">{mentor.location}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-8">
                                            {mentor.expertise.map(exp => (
                                                <span key={exp} className="px-2 py-1 bg-zinc-50 dark:bg-zinc-800/50 text-[10px] font-bold text-zinc-500 uppercase tracking-widest rounded-md">
                                                    {exp}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-[0.98]">
                                                Book Session
                                            </button>
                                            <button className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-400">
                                                <MessageSquare size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Become a Mentor Section */}
            <section className="py-24 bg-white dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-12 overflow-hidden">
                        <div className="relative z-10 text-center max-w-2xl mx-auto text-white">
                            <h2 className="text-4xl font-black mb-6">Want to give back?</h2>
                            <p className="text-indigo-100 text-lg mb-10">Join our elite community of mentors and help shape the next generation of engineers while growing your network.</p>
                            <button className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl">
                                Apply as a Mentor
                            </button>
                        </div>

                        {/* Background elements */}
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
                    </div>
                </div>
            </section>
        </main>
    );
}
