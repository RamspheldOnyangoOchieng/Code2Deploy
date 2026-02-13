"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code, Shield, Cloud, Star, Users, Globe, Zap, CheckCircle2, Award } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Stats Section */}
      <section className="py-12 border-y border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-white/1">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Graduates", value: "5,000+" },
              { label: "Countries", value: "85+" },
              { label: "Partner Companies", value: "200+" },
              { label: "Avg. Salary Inc.", value: "65%" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">{stat.value}</div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl lg:text-center mb-20">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600 mb-6">Industrial Grade Education</h2>
            <p className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
              Engineering Excellence <br /> <span className="text-zinc-400">Beyond the Basics</span>
            </p>
            <p className="mt-8 text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Most bootcamps teach you how to code. We teach you how to build, scale, and deploy complex systems at a global scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'High-Performance Architecture',
                description: 'Master Next.js 15, Turbopack, and Server Components for blindingly fast interfaces.',
                icon: <Code className="w-8 h-8" />,
                color: "indigo"
              },
              {
                title: 'Enterprise Security',
                description: 'Implement industrial-grade auth with Supabase and secure payment flows with Stripe.',
                icon: <Shield className="w-8 h-8" />,
                color: "emerald"
              },
              {
                title: 'Full-Scale Deployment',
                description: 'Go beyond "hello world". Learn Docker, CI/CD, and scaling on AWS and Vercel.',
                icon: <Cloud className="w-8 h-8" />,
                color: "purple"
              }
            ].map((feature, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                key={feature.title}
                className="group relative bg-zinc-50 dark:bg-white/2 p-10 rounded-[2.5rem] border border-zinc-200 dark:border-white/5 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-600 mb-8`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs Peek */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-tight">Featured Paths</h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">Hand-crafted curriculum for the next generation of tech leaders.</p>
            </div>
            <Link href="/programs" className="inline-flex items-center gap-2 font-bold text-indigo-600 hover:gap-4 transition-all">
              View all programs <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-bold uppercase rounded-full tracking-widest">Advanced</span>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-4 mb-4">SaaS Engineering Masterclass</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm">From architecture to deployment. Build a production-ready SaaS using the same stack top startups use.</p>
                <Link href="/programs/saas-masterclass" className="inline-block py-4 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm">
                  Learn more
                </Link>
              </div>
            </div>
            <div className="group relative bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-[10px] font-bold uppercase rounded-full tracking-widest">Intermediate</span>
                <h3 className="text-3xl font-black text-zinc-900 dark:text-white mt-4 mb-4">Full-Stack Cloud Architecture</h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm">Deep dive into AWS, Docker, and NestJS. Master the infrastructure that powers the modern web.</p>
                <Link href="/programs/cloud-arch" className="inline-block py-4 px-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-bold text-sm">
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-32 bg-white dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
          <div className="flex justify-center gap-1 mb-10">
            {[1, 2, 3, 4, 5].map(star => <Star key={star} size={24} fill="#4f46e5" className="text-indigo-600" />)}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-[1.2] mb-12 italic">
            "The level of technical depth at Code2Deploy is unmatched. I went from a junior dev to a Senior Architect in just 6 months."
          </h2>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 p-1 mb-4">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex" className="w-full h-full rounded-full" />
            </div>
            <div className="font-bold text-lg">Alex Richardson</div>
            <div className="text-zinc-500 text-sm font-medium">Senior Engineer at Vercel</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="relative bg-zinc-900 dark:bg-white rounded-[4rem] p-12 sm:p-24 overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-7xl font-black text-white dark:text-zinc-900 mb-8 leading-tight">
                Stop Learning. <br className="hidden sm:block" /> Start <span className="text-indigo-500">Deploying.</span>
              </h2>
              <p className="text-zinc-400 dark:text-zinc-500 text-xl mb-12 max-w-2xl mx-auto font-medium">
                Enroll in our Spring 2026 cohort. Limited spots available for the personalized mentorship track.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/programs" className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-black transition-all shadow-xl shadow-indigo-600/30">
                  Explore Programs
                </Link>
                <Link href="/contact" className="px-10 py-5 border-2 border-zinc-800 dark:border-zinc-200 text-white dark:text-zinc-900 rounded-3xl font-black transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100">
                  Schedule a Consultation
                </Link>
              </div>
            </div>

            {/* Decorative */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-50 dark:bg-white/1 border-t border-zinc-200 dark:border-zinc-800 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="bg-indigo-600 p-2 rounded-xl text-white">
                  <Zap size={24} />
                </div>
                <span className="font-black text-2xl tracking-tighter">Code2Deploy</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 leading-relaxed">
                Empowering the next generation of world-class software engineers through industrial-grade education and personalized mentorship.
              </p>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin, Globe].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4">
                {["Programs", "Mentors", "Events", "Scholarships"].map(link => (
                  <li key={link}><Link href={`/${link.toLowerCase()}`} className="text-zinc-500 hover:text-indigo-600 transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
              <ul className="space-y-4">
                {["About", "Contact", "Privacy", "Terms"].map(link => (
                  <li key={link}><Link href={`/${link.toLowerCase()}`} className="text-zinc-500 hover:text-indigo-600 transition-colors">{link}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              © 2026 Code2Deploy Academy. Built for the modern engineer.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
