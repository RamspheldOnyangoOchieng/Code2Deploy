"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OriginalLayout from '@/components/OriginalLayout';

export default function ProgramsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [filters, setFilters] = useState({
        duration: '',
        difficulty: '',
        technology: ''
    });
    const [programs, setPrograms] = useState<any[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);

    const clearFilters = () => {
        setSearchTerm('');
        setFilters({
            duration: '',
            difficulty: '',
            technology: ''
        });
    };

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/`);
            if (response.ok) {
                const data = await response.json();
                setPrograms(data.results || data);
                setError(null);
            } else {
                setError('Failed to load programs');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let results = [...programs];
        if (searchTerm) {
            results = results.filter(program =>
                program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (program.technologies && program.technologies.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        if (filters.duration) {
            results = results.filter(program => program.duration === filters.duration);
        }
        if (filters.difficulty) {
            results = results.filter(program => program.level === filters.difficulty);
        }
        if (filters.technology) {
            results = results.filter(program =>
                program.technologies && program.technologies.toLowerCase().includes(filters.technology.toLowerCase())
            );
        }
        setFilteredPrograms(results);
    }, [searchTerm, filters, programs]);

    const getTechnologies = (techString: string) => {
        if (!techString) return [];
        return techString.split(',').map(tech => tech.trim());
    };

    const openModal = (program: any) => {
        setSelectedProgram(program);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProgram(null);
    };

    return (
        <OriginalLayout>
            {/* Page Header */}
            <div className="bg-[#03325a] text-white py-12">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">All Programs</h1>
                            <p className="text-lg text-gray-300">Explore our comprehensive range of tech training programs</p>
                        </div>
                        <div className="mt-8 text-center">
                            <Link href="/">
                                <button className="px-8 py-4 bg-[#30d9fe] hover:bg-[#eec262] text-[#03325a] text-lg font-bold rounded-lg transition-all duration-300">
                                    Back to Home
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <section className="py-8 bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="w-full md:w-1/3 relative">
                            <input
                                type="text"
                                placeholder="Search programs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] text-sm"
                            />
                            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        </div>

                        <div className="flex flex-wrap gap-4 w-full md:w-auto">
                            <select
                                value={filters.duration}
                                onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
                                className="py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#30d9fe] bg-white text-sm"
                            >
                                <option value="">Duration (All)</option>
                                <option value="10 Weeks">10 Weeks</option>
                                <option value="12 Weeks">12 Weeks</option>
                                <option value="14 Weeks">14 Weeks</option>
                                <option value="16 Weeks">16 Weeks</option>
                                <option value="20 Weeks">20 Weeks</option>
                            </select>

                            <select
                                value={filters.difficulty}
                                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                                className="py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#30d9fe] bg-white text-sm"
                            >
                                <option value="">Difficulty (All)</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>

                            <button
                                onClick={clearFilters}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Grid */}
            <section className="py-12 min-h-[600px]">
                <div className="container mx-auto px-4 sm:px-6">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 font-sans">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent mb-4"></div>
                            <p className="text-gray-600 font-medium font-sans">Loading programs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-16">
                            <i className="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                            <h3 className="text-2xl font-bold text-[#03325a] mb-2">{error}</h3>
                            <button onClick={fetchPrograms} className="px-6 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg mt-4">Retry</button>
                        </div>
                    ) : filteredPrograms.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredPrograms.map(program => (
                                <div key={program.id} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl flex flex-col">
                                    <div className="h-48 relative bg-gradient-to-br from-blue-500 to-blue-600">
                                        {program.image ? (
                                            <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-white text-6xl opacity-30">
                                                <i className="fas fa-graduation-cap"></i>
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-[#03325a] text-[#30d9fe] text-xs font-bold px-3 py-1 rounded-full">{program.duration}</span>
                                        </div>
                                        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
                                            <span className="bg-[#eec262] text-[#03325a] text-xs font-bold px-3 py-1 rounded-full">{program.level}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 text-[#03325a]">{program.title}</h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{program.description}</p>
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {getTechnologies(program.technologies).slice(0, 4).map((tech, index) => (
                                                <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{tech}</span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => openModal(program)}
                                            className="w-full py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-colors mt-auto"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                            <h3 className="text-2xl font-bold text-[#03325a] mb-2">No Programs Found</h3>
                            <button onClick={clearFilters} className="px-6 py-2 bg-[#30d9fe] text-[#03325a] rounded-lg mt-4">Clear Filters</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Modal Replicated Exactly */}
            {showModal && selectedProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4 font-sans" onClick={closeModal}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="relative h-64 bg-gradient-to-br from-blue-500 to-blue-600">
                            {selectedProgram.image ? (
                                <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white text-8xl opacity-30">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>
                            )}
                            <button onClick={closeModal} className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center">
                                <i className="fas fa-times text-xl text-gray-700"></i>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedProgram.title}</h2>
                                <div className="flex gap-3">
                                    <span className="bg-[#30d9fe] text-[#03325a] text-sm font-bold px-3 py-1 rounded-full">{selectedProgram.duration}</span>
                                    <span className="bg-[#eec262] text-[#03325a] text-sm font-bold px-3 py-1 rounded-full">{selectedProgram.level}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-[#03325a] mb-3 font-sans">About This Program</h3>
                                <p className="text-gray-700 leading-relaxed font-sans">{selectedProgram.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 font-sans">
                                    <h4 className="font-bold text-[#03325a] mb-3">Duration & Info</h4>
                                    <p className="text-sm">Total Duration: {selectedProgram.duration}</p>
                                    <p className="text-sm">Level: {selectedProgram.level}</p>
                                </div>
                                <div className="bg-green-50 p-5 rounded-xl border border-green-100 font-sans">
                                    <h4 className="font-bold text-[#03325a] mb-3">What You'll Gain</h4>
                                    <ul className="text-sm space-y-1">
                                        <li><i className="fas fa-check text-green-600 mr-2"></i>Hands-on Projects</li>
                                        <li><i className="fas fa-check text-green-600 mr-2"></i>Industry Certificate</li>
                                    </ul>
                                </div>
                            </div>
                            <Link href={`/enroll/${selectedProgram.id}`} className="block w-full py-4 bg-gradient-to-r from-[#30d9fe] to-blue-500 text-white font-bold rounded-xl text-lg shadow-lg text-center">
                                Enroll Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </OriginalLayout>
    );
}
