import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout';
import { useToast } from '../contexts/ToastContext';
import authService from '../services/authService';
import paymentService from '../services/paymentService';
import { API_BASE_URL } from '../config/api';

const SKILL_LEVELS = [
    { value: 'beginner', label: 'Beginner - Never coded before' },
    { value: 'basic', label: 'Basic - Know some fundamentals' },
    { value: 'intermediate', label: 'Intermediate - Built some projects' },
    { value: 'advanced', label: 'Advanced - Professional experience' }
];

const AVAILABILITY_OPTIONS = [
    { value: 'fulltime', label: 'Full-time (20+ hours/week)' },
    { value: 'parttime', label: 'Part-time (10-20 hours/week)' },
    { value: 'flexible', label: 'Flexible (5-10 hours/week)' }
];

const ProgramEnrollment = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const location = useLocation();
    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [pricingPlans, setPricingPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Form data
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
        motivation: '',
        agreeToTerms: false
    });

    // Get program from location state or URL params
    useEffect(() => {
        const checkAuth = async () => {
            if (!authService.isAuthenticated()) {
                navigate('/', { state: { showLogin: true, message: 'Please login to enroll in a program' } });
                return;
            }

            // Get user data to pre-fill form
            try {
                const user = await authService.getCurrentUser();
                setFormData(prev => ({
                    ...prev,
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    email: user.email || ''
                }));
            } catch (err) {
                toast.error('Failed to pre-fill user data');
            }
        };

        checkAuth();

        // Get program from location state
        if (location.state?.program) {
            setProgram(location.state.program);
            setLoading(false);
            loadPricingPlans(location.state.program.id);
        } else {
            // Try to get program ID from URL params
            const params = new URLSearchParams(location.search);
            const programId = params.get('programId');
            if (programId) {
                fetchProgram(programId);
            } else {
                setError('No program selected');
                setLoading(false);
            }
        }
    }, [location, navigate]);

    const fetchProgram = async (programId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/programs/${programId}/`);
            if (response.ok) {
                const data = await response.json();
                setProgram(data);
                loadPricingPlans(programId);
            } else {
                setError('Program not found');
            }
        } catch (err) {
            setError('Failed to load program');
        } finally {
            setLoading(false);
        }
    };

    const loadPricingPlans = async (programId) => {
        try {
            const plans = await paymentService.getPricingPlans(programId);
            setPricingPlans(plans.results || plans || []);
            // Auto-select first plan if available
            if (plans.length > 0 || plans.results?.length > 0) {
                setSelectedPlan((plans.results || plans)[0]);
            }
        } catch (err) {
            toast.error('Failed to load pricing plans');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return formData.firstName && formData.lastName && formData.email && formData.phone && formData.country;
            case 2:
                return formData.skillLevel && formData.availability;
            case 3:
                return formData.hasLaptop && formData.hasInternet && formData.agreeToTerms;
            default:
                return false;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            toast.error('Please fill in all required fields');
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => prev - 1);
        setError('');
    };

    const handleScholarshipEnrollment = async () => {
        setSubmitting(true);
        setError('');

        try {
            // Submit enrollment for scholarship program
            const response = await fetch(`${API_BASE_URL}/programs/enroll/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    program_id: program.id,
                    enrollment_details: {
                        skill_level: formData.skillLevel,
                        availability: formData.availability,
                        motivation: formData.motivation,
                        has_laptop: formData.hasLaptop,
                        has_internet: formData.hasInternet
                    }
                })
            });

            if (response.ok) {
                // Redirect to dashboard with success message
                navigate('/learner-dashboard', {
                    state: {
                        enrollmentSuccess: true,
                        programTitle: program.title
                    }
                });
            } else {
                const data = await response.json();
                toast.error(data.detail || 'Failed to enroll. You may already be enrolled.');
            }
        } catch (err) {
            toast.error('Failed to complete enrollment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handlePaidEnrollment = async () => {
        // Navigate to checkout with program and form data
        navigate('/checkout', {
            state: {
                program,
                pricingPlan: selectedPlan,
                enrollmentDetails: {
                    skill_level: formData.skillLevel,
                    availability: formData.availability,
                    motivation: formData.motivation,
                    has_laptop: formData.hasLaptop,
                    has_internet: formData.hasInternet
                },
                billingInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    country: formData.country
                }
            }
        });
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#30d9fe] border-t-transparent"></div>
                </div>
            </Layout>
        );
    }

    if (!program) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Program Selected</h2>
                        <button
                            onClick={() => navigate('/programs')}
                            className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#eec262] transition-all"
                        >
                            Browse Programs
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const isScholarshipProgram = program.scholarship_available;
    const totalSteps = isScholarshipProgram ? 3 : 4; // 4 steps for paid (includes payment)

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#03325a] to-[#0a5a8a] rounded-2xl p-6 md:p-8 text-white mb-8 shadow-xl">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[#30d9fe] text-sm font-medium mb-2">
                                    {isScholarshipProgram ? '🎓 Scholarship Program' : '💼 Paid Program'}
                                </p>
                                <h1 className="text-2xl md:text-3xl font-bold mb-2">{program.title}</h1>
                                <p className="text-gray-300 text-sm">{program.duration} • {program.level}</p>
                            </div>
                            {isScholarshipProgram && (
                                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    FREE
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            {Array.from({ length: totalSteps }, (_, i) => (
                                <div key={i} className="flex items-center">
                                    <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${currentStep > i + 1 ? 'bg-green-500 text-white' :
                                            currentStep === i + 1 ? 'bg-[#30d9fe] text-[#03325a]' :
                                                'bg-gray-200 text-gray-500'}
                  `}>
                                        {currentStep > i + 1 ? '✓' : i + 1}
                                    </div>
                                    {i < totalSteps - 1 && (
                                        <div className={`w-full h-1 mx-2 ${currentStep > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                                            style={{ minWidth: '50px' }} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Personal Info</span>
                            <span>Skills</span>
                            <span>Requirements</span>
                            {!isScholarshipProgram && <span>Payment</span>}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        {/* Step 1: Personal Information */}
                        {currentStep === 1 && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#03325a] mb-6 flex items-center">
                                    <i className="fas fa-user text-[#30d9fe] mr-3"></i>
                                    Personal Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                            placeholder="+254 700 000 000"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                        <select
                                            name="country"
                                            value={formData.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                        >
                                            <option value="">Select your country</option>
                                            <option value="KE">Kenya</option>
                                            <option value="UG">Uganda</option>
                                            <option value="TZ">Tanzania</option>
                                            <option value="RW">Rwanda</option>
                                            <option value="NG">Nigeria</option>
                                            <option value="GH">Ghana</option>
                                            <option value="ZA">South Africa</option>
                                            <option value="ET">Ethiopia</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Skills Assessment */}
                        {currentStep === 2 && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#03325a] mb-6 flex items-center">
                                    <i className="fas fa-chart-line text-[#30d9fe] mr-3"></i>
                                    Skills & Availability
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">What is your current skill level? *</label>
                                        <div className="space-y-3">
                                            {SKILL_LEVELS.map((level) => (
                                                <label key={level.value} className={`
                          flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${formData.skillLevel === level.value
                                                        ? 'border-[#30d9fe] bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        name="skillLevel"
                                                        value={level.value}
                                                        checked={formData.skillLevel === level.value}
                                                        onChange={handleInputChange}
                                                        className="w-5 h-5 text-[#30d9fe]"
                                                    />
                                                    <span className="ml-3 text-gray-700">{level.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">How much time can you dedicate weekly? *</label>
                                        <div className="space-y-3">
                                            {AVAILABILITY_OPTIONS.map((option) => (
                                                <label key={option.value} className={`
                          flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all
                          ${formData.availability === option.value
                                                        ? 'border-[#30d9fe] bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'}
                        `}>
                                                    <input
                                                        type="radio"
                                                        name="availability"
                                                        value={option.value}
                                                        checked={formData.availability === option.value}
                                                        onChange={handleInputChange}
                                                        className="w-5 h-5 text-[#30d9fe]"
                                                    />
                                                    <span className="ml-3 text-gray-700">{option.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join this program? (Optional)</label>
                                        <textarea
                                            name="motivation"
                                            value={formData.motivation}
                                            onChange={handleInputChange}
                                            rows={4}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent"
                                            placeholder="Tell us about your goals and motivation..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Requirements Confirmation */}
                        {currentStep === 3 && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#03325a] mb-6 flex items-center">
                                    <i className="fas fa-clipboard-check text-[#30d9fe] mr-3"></i>
                                    Requirements Confirmation
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Please confirm you meet the following requirements to successfully participate in this program:
                                </p>
                                <div className="space-y-4">
                                    <label className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.hasLaptop ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                  `}>
                                        <input
                                            type="checkbox"
                                            name="hasLaptop"
                                            checked={formData.hasLaptop}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 mt-0.5 text-green-500"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-800">I have access to a laptop or computer</span>
                                            <p className="text-sm text-gray-500">Required for coding exercises and projects</p>
                                        </div>
                                    </label>

                                    <label className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.hasInternet ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                  `}>
                                        <input
                                            type="checkbox"
                                            name="hasInternet"
                                            checked={formData.hasInternet}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 mt-0.5 text-green-500"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-800">I have reliable internet access</span>
                                            <p className="text-sm text-gray-500">Needed for online sessions and resources</p>
                                        </div>
                                    </label>

                                    <label className={`
                    flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${formData.agreeToTerms ? 'border-green-500 bg-green-50' : 'border-gray-200'}
                  `}>
                                        <input
                                            type="checkbox"
                                            name="agreeToTerms"
                                            checked={formData.agreeToTerms}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 mt-0.5 text-green-500"
                                        />
                                        <div className="ml-3">
                                            <span className="font-medium text-gray-800">I agree to the program terms and conditions</span>
                                            <p className="text-sm text-gray-500">Including attendance requirements and code of conduct</p>
                                        </div>
                                    </label>
                                </div>

                                {/* Program Summary */}
                                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                                    <h3 className="font-bold text-[#03325a] mb-4">Enrollment Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Program:</span>
                                            <span className="font-semibold text-gray-800">{program.title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="font-semibold text-gray-800">{program.duration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Level:</span>
                                            <span className="font-semibold text-gray-800">{program.level}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Type:</span>
                                            <span className={`font-semibold ${isScholarshipProgram ? 'text-green-600' : 'text-blue-600'}`}>
                                                {isScholarshipProgram ? 'Scholarship (Free)' : 'Paid Program'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment (only for paid programs) */}
                        {currentStep === 4 && !isScholarshipProgram && (
                            <div>
                                <h2 className="text-2xl font-bold text-[#03325a] mb-6 flex items-center">
                                    <i className="fas fa-credit-card text-[#30d9fe] mr-3"></i>
                                    Payment
                                </h2>

                                {/* Pricing Plan Selection */}
                                {pricingPlans.length > 0 ? (
                                    <div className="space-y-4 mb-6">
                                        <p className="text-gray-600">Select your payment plan:</p>
                                        {pricingPlans.map((plan) => (
                                            <label key={plan.id} className={`
                        flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all
                        ${selectedPlan?.id === plan.id ? 'border-[#30d9fe] bg-blue-50' : 'border-gray-200'}
                      `}>
                                                <div className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="pricingPlan"
                                                        checked={selectedPlan?.id === plan.id}
                                                        onChange={() => setSelectedPlan(plan)}
                                                        className="w-5 h-5 text-[#30d9fe]"
                                                    />
                                                    <div className="ml-3">
                                                        <span className="font-medium text-gray-800">{plan.name}</span>
                                                        {plan.description && (
                                                            <p className="text-sm text-gray-500">{plan.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xl font-bold text-[#03325a]">
                                                    ${plan.price}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg mb-6">
                                        <p className="text-gray-500">No pricing plans available. Please contact support.</p>
                                    </div>
                                )}

                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
                                    <p className="text-yellow-800 text-sm">
                                        <i className="fas fa-info-circle mr-2"></i>
                                        You will be redirected to PayPal to complete your payment securely.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                            {currentStep > 1 ? (
                                <button
                                    onClick={prevStep}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Back
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/programs')}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                >
                                    <i className="fas fa-times mr-2"></i>
                                    Cancel
                                </button>
                            )}

                            {currentStep < totalSteps ? (
                                <button
                                    onClick={nextStep}
                                    disabled={!validateStep(currentStep)}
                                    className="px-6 py-3 bg-[#30d9fe] text-[#03325a] font-semibold rounded-lg hover:bg-[#eec262] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next Step
                                    <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            ) : (
                                isScholarshipProgram ? (
                                    <button
                                        onClick={handleScholarshipEnrollment}
                                        disabled={submitting || !validateStep(3)}
                                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        {submitting ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                                Enrolling...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-check mr-2"></i>
                                                Complete Enrollment
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePaidEnrollment}
                                        disabled={!selectedPlan}
                                        className="px-8 py-3 bg-gradient-to-r from-[#30d9fe] to-blue-500 text-white font-semibold rounded-lg hover:from-[#eec262] hover:to-[#d4a952] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        <i className="fab fa-paypal mr-2"></i>
                                        Proceed to PayPal
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProgramEnrollment;
