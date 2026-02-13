"use client";

import { useEffect, useState } from 'react';
import OriginalLayout from '@/components/OriginalLayout';
import Link from 'next/link';

export default function ScholarshipsPage() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`)
            .then(res => res.json())
            .then(data => {
                const scholarshipPrograms = (data.results || data).filter((p: any) => p.scholarship_available);
                setPrograms(scholarshipPrograms);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <OriginalLayout>
            <div className="bg-[#03325a] text-white py-20 font-sans">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Scholarship Opportunities</h1>
                    <p className="text-xl text-[#30d9fe] max-w-2xl mx-auto">Empowering talent through fully-funded technical training programs.</p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 font-sans">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent"></div>
                    </div>
                ) : programs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programs.map(program => (
                            <div key={program.id} className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col group hover:-translate-y-2 transition-all duration-300">
                                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 relative">
                                    <div className="absolute top-4 right-4 bg-white/90 px-4 py-1 rounded-full text-xs font-black text-green-600 shadow-lg">100% FREE</div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold text-[#03325a] mb-4 group-hover:text-[#30d9fe] transition-colors">{program.title}</h3>
                                    <p className="text-gray-600 mb-6 flex-1">{program.description}</p>
                                    <Link href={`/enroll/${program.id}`} className="block w-full py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-xl text-center hover:bg-[#eec262] transition-all">
                                        Apply for Scholarship
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-400 font-bold">No scholarships currently available.</p>
                        <Link href="/programs" className="mt-4 inline-block text-[#30d9fe] font-bold">View all programs →</Link>
                    </div>
                )}
            </div>
        </OriginalLayout>
    );
}
