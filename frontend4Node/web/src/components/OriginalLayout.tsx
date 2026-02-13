"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const OriginalLayout = ({ children }: { children: React.ReactNode }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('home');
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Mock user for now, will integrate with Supabase later
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Set active tab based on current location
        if (pathname === '/') setActiveTab('home');
        else if (pathname === '/programs') setActiveTab('programs');
        else if (pathname === '/events') setActiveTab('events');
        else if (pathname === '/about') setActiveTab('about');
        else if (pathname === '/contact') setActiveTab('contact');
    }, [pathname]);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const getInitials = (user: any) => {
        if (user.first_name && user.last_name) {
            return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
        }
        return user.username ? user.username.substring(0, 2).toUpperCase() : 'U';
    };

    return (
        <div className="min-h-screen font-sans text-gray-800 bg-white flex flex-col overflow-x-hidden">
            {/* Navigation */}
            <nav className="bg-gradient-to-b from-[#0A0F2C] to-[#0A0F2C] fixed top-0 left-0 right-0 z-50 text-white w-full">
                <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center">
                                <img
                                    src="/assets/logo2-clear.png"
                                    alt="Code2Deploy Logo"
                                    className="h-8 sm:h-10 lg:h-12 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden xl:flex items-center justify-center flex-1 px-8">
                            <div className="flex items-center space-x-6 2xl:space-x-10">
                                <Link
                                    href="/programs"
                                    className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${pathname === '/programs' ? 'text-[#30d9fe]' : 'text-white'}`}
                                >
                                    Programs
                                </Link>
                                <Link
                                    href="/events"
                                    className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${pathname === '/events' ? 'text-[#30d9fe]' : 'text-white'}`}
                                >
                                    Events
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${pathname.startsWith('/dashboard') ? 'text-[#30d9fe]' : 'text-white'}`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/about"
                                    className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${pathname === '/about' ? 'text-[#30d9fe]' : 'text-white'}`}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    className={`text-sm 2xl:text-base font-medium hover:text-[#30d9fe] transition-colors duration-300 whitespace-nowrap ${pathname === '/contact' ? 'text-[#30d9fe]' : 'text-white'}`}
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden xl:flex items-center space-x-3 flex-shrink-0">
                            {!user ? (
                                <div className="flex items-center space-x-2">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:text-[#30d9fe] transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 bg-[#30d9fe] text-[#03325a] text-sm font-medium rounded-lg hover:bg-[#eec262] transition-all duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            ) : (
                                <div className="relative">
                                    {/* User dropdown would go here */}
                                </div>
                            )}
                        </div>

                        {/* Hamburger Menu */}
                        <div className="xl:hidden flex-shrink-0">
                            <button
                                onClick={toggleMenu}
                                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
                            >
                                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="xl:hidden mt-4 pb-4">
                            <div className="flex flex-col space-y-1">
                                <Link href="/programs" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg">Programs</Link>
                                <Link href="/events" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg">Events</Link>
                                <Link href="/dashboard" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg">Dashboard</Link>
                                <Link href="/about" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg">About Us</Link>
                                <Link href="/contact" className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg">Contact</Link>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-1 w-full pt-16 sm:pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-[#03325a] text-white py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <img src="/assets/logo2-clear.png" alt="Logo" className="h-10 mb-4" />
                            <p className="text-sm opacity-80">Empowering African youth with the skills to build and deploy technology solutions.</p>
                            <div className="flex space-x-4 mt-6">
                                <a href="#" className="hover:text-[#30d9fe] transition-colors"><i className="fab fa-twitter text-xl"></i></a>
                                <a href="#" className="hover:text-[#30d9fe] transition-colors"><i className="fab fa-facebook text-xl"></i></a>
                                <a href="#" className="hover:text-[#30d9fe] transition-colors"><i className="fab fa-instagram text-xl"></i></a>
                                <a href="#" className="hover:text-[#30d9fe] transition-colors"><i className="fab fa-linkedin text-xl"></i></a>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Programs</h3>
                            <ul className="space-y-2 text-sm opacity-80">
                                <li><Link href="/programs">Web Development</Link></li>
                                <li><Link href="/programs">Data Science</Link></li>
                                <li><Link href="/programs">Mobile Development</Link></li>
                                <li><Link href="/programs">AI & Machine Learning</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Company</h3>
                            <ul className="space-y-2 text-sm opacity-80">
                                <li><Link href="/about">About Us</Link></li>
                                <li><Link href="/about">Our Team</Link></li>
                                <li><Link href="/contact">Careers</Link></li>
                                <li><Link href="/contact">Partners</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm opacity-80">
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-map-marker-alt mt-1 text-[#30d9fe]"></i>
                                    <span>233 Tech Hub Innovation Street, Nairobi, Kenya</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-envelope mt-1 text-[#30d9fe]"></i>
                                    <span>info@code2deploy.com</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <i className="fas fa-phone mt-1 text-[#30d9fe]"></i>
                                    <span>+254 743 864 7890</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm opacity-60">© 2025 Code2Deploy. All rights reserved.</p>
                        <div className="flex gap-6 text-sm opacity-60">
                            <Link href="/contact">Privacy Policy</Link>
                            <Link href="/contact">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default OriginalLayout;
