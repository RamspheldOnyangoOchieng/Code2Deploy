"use client";

import { useEffect, useState } from 'react';
import OriginalLayout from '@/components/OriginalLayout';

export default function MentorsPage() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking mentors as I don't see a public mentor list endpoint yet, 
        // but typically this would fetch from /mentors/
        setMentors([
            { id: 1, name: 'Dr. Jane Smith', role: 'Senior AI Engineer', bio: 'Expert in LLMs and Neural Networks with 10+ years experience.', image: null },
            { id: 2, name: 'Eng. John Doe', role: 'Full Stack Architect', bio: 'Built large scale distributed systems for tech giants.', image: null },
            { id: 3, name: 'Sarah Wilson', role: 'UI/UX Design Lead', bio: 'Passionate about creating human-centric digital experiences.', image: null }
        ]);
        setLoading(false);
    }, []);

    return (
        <OriginalLayout>
            <div className="bg-[#03325a] text-white py-20 font-sans">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Our World-Class Mentors</h1>
                    <p className="text-xl text-[#30d9fe] max-w-2xl mx-auto">Learn from industry veterans who have built and deployed global solutions.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 font-sans">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {mentors.map(mentor => (
                        <div key={mentor.id} className="group relative">
                            <div className="bg-slate-900 rounded-[2rem] p-8 pt-20 border border-white/5 shadow-2xl hover:border-[#30d9fe]/30 transition-all">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-[#30d9fe] bg-[#03325a] flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                                    {mentor.name.substring(0, 1)}
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">{mentor.name}</h3>
                                    <p className="text-[#30d9fe] font-bold text-sm uppercase tracking-widest mb-4">{mentor.role}</p>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-8">{mentor.bio}</p>
                                    <div className="flex justify-center gap-4">
                                        <button className="px-6 py-2 bg-white/5 text-white rounded-xl hover:bg-[#30d9fe] hover:text-[#03325a] transition-all font-bold text-sm">View Portfolio</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </OriginalLayout>
    );
}
