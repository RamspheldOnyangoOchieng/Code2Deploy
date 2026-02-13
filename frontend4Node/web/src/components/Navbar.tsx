"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Rocket, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
    { name: "Programs", href: "/programs" },
    { name: "Mentors", href: "/mentors" },
    { name: "Events", href: "/events" },
    { name: "Scholarships", href: "/scholarships" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
                                <Rocket size={20} />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
                                Code2Deploy
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-bold transition-all hover:text-indigo-600 dark:hover:text-indigo-400 relative py-1",
                                    pathname === item.href
                                        ? "text-indigo-600 dark:text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full"
                                        : "text-zinc-500 dark:text-zinc-400"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-4">
                        <Link
                            href="/login"
                            className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-indigo-600 px-4 transition-colors"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 py-2.5 text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-zinc-600 dark:text-zinc-400 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="lg:hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-4 pt-4 pb-8 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    "block px-4 py-3 rounded-xl text-base font-bold transition-all",
                                    pathname === item.href
                                        ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-6 grid grid-cols-2 gap-4">
                            <Link
                                href="/login"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-bold text-zinc-700 dark:text-zinc-300"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/20"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
