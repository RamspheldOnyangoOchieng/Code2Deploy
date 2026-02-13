"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";

export function Hero() {
    return (
        <div className="relative isolate overflow-hidden bg-white dark:bg-zinc-950 pt-24">
            {/* Background Gradients */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                    }}
                />
            </div>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:pt-40">
                <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-24 sm:mt-32 lg:mt-16"
                    >
                        <a href="#" className="inline-flex space-x-6">
                            <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                                Newly Launched
                            </span>
                            <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-400">
                                <span>V2.0 is live!</span>
                                <ArrowRight className="h-4 w-4" />
                            </span>
                        </a>
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-10 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl"
                    >
                        Master the Art of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Coding & Deployment</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400"
                    >
                        Accelerate your tech career with expert-led mentorship, hands-on projects, and a community of high-achievers. From Zero to Deployed.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-10 flex items-center gap-x-6"
                    >
                        <button className="rounded-full bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform hover:scale-105 active:scale-95">
                            Explore Programs
                        </button>
                        <button className="text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-200 flex items-center gap-2 group">
                            View Curriculum <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="mt-12 flex items-center gap-4 text-sm text-zinc-500"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-200 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="avatar" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-yellow-500">
                                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                            <span>Join 2,500+ successful students</span>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
                >
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        <div className="-m-2 rounded-xl bg-zinc-900/5 p-2 ring-1 ring-inset ring-zinc-900/10 lg:-m-4 lg:rounded-2xl lg:p-4 dark:bg-white/5 dark:ring-white/10">
                            <div className="rounded-md bg-white dark:bg-zinc-950 shadow-2xl ring-1 ring-zinc-900/10 dark:ring-white/10 overflow-hidden border border-zinc-200 dark:border-zinc-800">
                                <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <div className="mx-auto text-[10px] text-zinc-400 font-mono">localhost:3000/dashboard</div>
                                </div>
                                <div className="p-4 sm:p-8">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                                        <div className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                                        <div className="h-48 col-span-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
