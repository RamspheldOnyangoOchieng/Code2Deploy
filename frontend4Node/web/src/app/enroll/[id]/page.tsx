"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/OriginalLayout';

export default function EnrollPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: '',
        skillLevel: '',
        availability: '',
        hasLaptop: false,
        hasInternet: false,
        agreeToTerms: false
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 py-12 font-sans">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="bg-[#03325a] rounded-2xl p-8 text-white mb-8 shadow-2xl">
                        <h1 className="text-3xl font-bold mb-2">Program Enrollment</h1>
                        <p className="text-gray-300">Complete the form below to secure your spot.</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-12 relative px-4 text-xs font-bold text-gray-400">
                        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#30d9fe]' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-[#30d9fe] bg-[#30d9fe] text-[#03325a]' : 'border-gray-200'}`}>1</div>
                            <span>Personal</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#30d9fe]' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-[#30d9fe] bg-[#30d9fe] text-[#03325a]' : 'border-gray-200'}`}>2</div>
                            <span>Skills</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-[#30d9fe]' : ''}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-[#30d9fe] bg-[#30d9fe] text-[#03325a]' : 'border-gray-200'}`}>3</div>
                            <span>Confirm</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-[#03325a] mb-8">Personal Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="First Name" value={formData.firstName} onChange={(v: string) => setFormData({ ...formData, firstName: v })} />
                                    <Input label="Last Name" value={formData.lastName} onChange={(v: string) => setFormData({ ...formData, lastName: v })} />
                                    <Input label="Email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                                    <Input label="Phone" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                                </div>
                                <div className="flex justify-end pt-8">
                                    <button onClick={nextStep} className="px-10 py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all">Next Step</button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-[#03325a] mb-8">Skills & Availability</h2>
                                <div className="space-y-4">
                                    <label className="block font-bold text-gray-700">Skill Level</label>
                                    <select className="w-full px-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#30d9fe]" value={formData.skillLevel} onChange={e => setFormData({ ...formData, skillLevel: e.target.value })}>
                                        <option value="">Select Level</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="flex justify-between pt-8">
                                    <button onClick={prevStep} className="px-10 py-4 text-gray-500 font-bold border border-gray-200 rounded-xl">Back</button>
                                    <button onClick={nextStep} className="px-10 py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-xl shadow-lg">Next Step</button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-[#03325a] mb-8">Final Confirmation</h2>
                                <div className="space-y-4">
                                    <Checkbox label="I have a laptop" checked={formData.hasLaptop} onChange={(v: boolean) => setFormData({ ...formData, hasLaptop: v })} />
                                    <Checkbox label="I have reliable internet" checked={formData.hasInternet} onChange={(v: boolean) => setFormData({ ...formData, hasInternet: v })} />
                                    <Checkbox label="I agree to the terms" checked={formData.agreeToTerms} onChange={(v: boolean) => setFormData({ ...formData, agreeToTerms: v })} />
                                </div>
                                <div className="flex justify-between pt-8">
                                    <button onClick={prevStep} className="px-10 py-4 text-gray-500 font-bold border border-gray-200 rounded-xl">Back</button>
                                    <button onClick={() => router.push('/checkout/' + params.id)} className="px-10 py-4 bg-[#30d9fe] text-[#03325a] font-bold rounded-xl shadow-lg">Proceed to Payment</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function Input({ label, value, onChange }: any) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-600">{label}</label>
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-[#30d9fe] transition-all"
            />
        </div>
    );
}

function Checkbox({ label, checked, onChange }: any) {
    return (
        <label className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-5 h-5 accent-[#30d9fe]" />
            <span className="font-bold text-gray-700">{label}</span>
        </label>
    );
}
