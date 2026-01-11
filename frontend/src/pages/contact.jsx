// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    reason: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState({
    name: false,
    email: false,
    message: false
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formFocused, setFormFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false
  });

  const [contactSettings, setContactSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Fetch contact settings from API
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const type = searchParams.get('type');
        let contactType = 'general';

        if (type === 'sponsor') {
          contactType = 'sponsor';
        } else if (type === 'education' || type === 'education-partner') {
          contactType = 'education';
        }

        const response = await fetch(`${API_BASE_URL}/admin/contact-settings/type/${contactType}/`);

        if (response.ok) {
          const data = await response.json();
          setContactSettings(data);

          // Pre-fill form with default values from settings
          if (data.default_subject || data.default_message) {
            setFormData(prev => ({
              ...prev,
              subject: data.default_subject || prev.subject,
              message: data.default_message || prev.message,
              reason: contactType
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching contact settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchContactSettings();
  }, [searchParams]);

  // Legacy fallback - Remove this after settings are migrated
  useEffect(() => {
    if (!loadingSettings && !contactSettings) {
      const type = searchParams.get('type');
      if (type === 'sponsor') {
        setFormData(prev => ({
          ...prev,
          subject: 'Partnership Inquiry - Sponsor',
          reason: 'sponsor',
          message: 'I am interested in becoming a sponsor for Code2Deploy programs and events.'
        }));
      } else if (type === 'education' || type === 'education-partner') {
        setFormData(prev => ({
          ...prev,
          subject: 'Partnership Inquiry - Education & Training Partner',
          reason: 'education',
          message: 'I am interested in becoming an education and training partner with Code2Deploy.'
        }));
      }
    }
  }, [searchParams, loadingSettings, contactSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputFocus = (field) => {
    setFormFocused(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const handleInputBlur = (field) => {
    setFormFocused(prev => ({
      ...prev,
      [field]: formData[field] !== ''
    }));
  };

  const validateForm = () => {
    const errors = {
      name: formData.name.trim() === '',
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
      message: formData.message.trim() === ''
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/contact/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            contact_type: formData.reason || 'general',
            // Phone is not in the form state but model has it, could add it if needed
          }),
        });

        if (response.ok) {
          setFormSubmitted(true);

          setTimeout(() => {
            setFormSubmitted(false);
            setFormData({
              name: '',
              email: '',
              subject: '',
              reason: '',
              message: ''
            });
            setFormFocused({
              name: false,
              email: false,
              subject: false,
              message: false
            });
          }, 5000);
        } else {
          console.error('Failed to submit contact form');
          // Could add error handling UI here
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
      }
    }
  };

  const getContactTypeInfo = () => {
    // Use settings from API if available
    if (contactSettings) {
      return {
        title: contactSettings.title,
        subtitle: contactSettings.subtitle,
        description: contactSettings.description,
        buttonText: contactSettings.button_text || 'Send Message',
        contactInfoTitle: contactSettings.contact_info_title || 'Ping Our Network',
        visitLabel: contactSettings.visit_label || 'Visit Us',
        visitAddress: contactSettings.visit_address || '123 Tech Hub, Innovation Street\nNairobi, Kenya',
        emailLabel: contactSettings.email_label || 'Email Us',
        primaryEmail: contactSettings.primary_email || 'info@code2deploy.com',
        secondaryEmail: contactSettings.secondary_email || '',
        phoneLabel: contactSettings.phone_label || 'Call Us',
        phoneNumber: contactSettings.phone_number || '+254 743 864 7890',
        phoneHours: contactSettings.phone_hours || 'Mon-Fri: 9AM-6PM WAT'
      };
    }

    // Fallback to hardcoded values if API settings not available
    const type = searchParams.get('type');
    if (type === 'sponsor') {
      return {
        title: 'Become a Sponsor',
        subtitle: 'Partner with us to empower African youth in tech',
        description: 'Join us in our mission to transform African youth through technology education. Your sponsorship will help provide scholarships, resources, and opportunities for aspiring developers.',
        buttonText: 'Submit Sponsorship Inquiry',
        contactInfoTitle: 'Ping Our Network',
        visitLabel: 'Visit Us',
        visitAddress: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
        emailLabel: 'Email Us',
        primaryEmail: 'info@code2deploy.com',
        secondaryEmail: 'support@code2deploy.com',
        phoneLabel: 'Call Us',
        phoneNumber: '+254 743 864 7890',
        phoneHours: 'Mon-Fri: 9AM-6PM WAT'
      };
    } else if (type === 'education' || type === 'education-partner') {
      return {
        title: 'Become an Education & Training Partner',
        subtitle: 'Collaborate with us to expand tech education across Africa',
        description: 'Partner with Code2Deploy to deliver world-class technology education. Together, we can create innovative learning programs, share resources, and empower the next generation of African developers.',
        buttonText: 'Submit Partnership Inquiry',
        contactInfoTitle: 'Ping Our Network',
        visitLabel: 'Visit Us',
        visitAddress: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
        emailLabel: 'Email Us',
        primaryEmail: 'info@code2deploy.com',
        secondaryEmail: 'support@code2deploy.com',
        phoneLabel: 'Call Us',
        phoneNumber: '+254 743 864 7890',
        phoneHours: 'Mon-Fri: 9AM-6PM WAT'
      };
    }
    return {
      title: 'Get in Touch',
      subtitle: 'We\'d love to hear from you',
      description: 'Whether you\'re ready to enroll, curious about our programs, or just want to say hi — drop us a line!',
      buttonText: 'Send Message',
      contactInfoTitle: 'Ping Our Network',
      visitLabel: 'Visit Us',
      visitAddress: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
      emailLabel: 'Email Us',
      primaryEmail: 'info@code2deploy.com',
      secondaryEmail: 'support@code2deploy.com',
      phoneLabel: 'Call Us',
      phoneNumber: '+254 743 864 7890',
      phoneHours: 'Mon-Fri: 9AM-6PM WAT'
    };
  };

  const contactInfo = getContactTypeInfo();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#03325a] via-[#044e7c] to-[#30d9fe]/10 text-white flex flex-col">
        <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16 flex-1 flex flex-col">
          <header className="text-center mb-10 sm:mb-16 px-2">
            <h1 className="text-[#30d9fe] text-2xl sm:text-5xl font-bold mb-4 animate-pulse drop-shadow-lg">{contactInfo.title}</h1>
            <p className="text-base sm:text-xl max-w-2xl mx-auto">{contactInfo.subtitle}</p>
            <p className="text-sm sm:text-base max-w-2xl mx-auto mt-4 opacity-90">{contactInfo.description}</p>
          </header>
          <div className="flex flex-col-reverse lg:flex-row gap-6 sm:gap-10 max-w-6xl mx-auto w-full">
            {/* Left Panel - Contact Form */}
            <div className="lg:w-3/5 w-full bg-[#03325a]/60 p-3 sm:p-8 rounded-2xl border border-[#30d9fe]/20 shadow-lg transition-all duration-300">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16 text-center animate-fade-in" aria-live="polite">
                  <div className="text-[#30d9fe] text-5xl sm:text-6xl mb-4">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">Message Sent Successfully!</h2>
                  <p className="text-lg opacity-90 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-[#30d9fe] text-2xl mb-2">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <p className="text-sm">Email Sent</p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#30d9fe] text-2xl mb-2">
                        <i className="fas fa-clock"></i>
                      </div>
                      <p className="text-sm">24h Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-[#30d9fe] text-2xl mb-2">
                        <i className="fas fa-user-check"></i>
                      </div>
                      <p className="text-sm">Personal Reply</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('name')}
                        onBlur={() => handleInputBlur('name')}
                        className={`w-full px-4 py-3 rounded-lg bg-[#03325a]/80 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] ${formFocused.name || formData.name ? 'border-[#30d9fe]' : 'border-[#30d9fe]/30'
                          } ${formErrors.name ? 'border-red-400' : ''}`}
                        placeholder="Your full name"
                      />
                      {formErrors.name && <p className="text-red-400 text-sm mt-1">Name is required</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => handleInputFocus('email')}
                        onBlur={() => handleInputBlur('email')}
                        className={`w-full px-4 py-3 rounded-lg bg-[#03325a]/80 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] ${formFocused.email || formData.email ? 'border-[#30d9fe]' : 'border-[#30d9fe]/30'
                          } ${formErrors.email ? 'border-red-400' : ''}`}
                        placeholder="your.email@example.com"
                      />
                      {formErrors.email && <p className="text-red-400 text-sm mt-1">Valid email is required</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('subject')}
                      onBlur={() => handleInputBlur('subject')}
                      className={`w-full px-4 py-3 rounded-lg bg-[#03325a]/80 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] ${formFocused.subject || formData.subject ? 'border-[#30d9fe]' : 'border-[#30d9fe]/30'
                        }`}
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium mb-2">Reason for Contact</label>
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-[#03325a]/80 border-2 border-[#30d9fe]/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-[#30d9fe]"
                    >
                      <option value="">Select a reason</option>
                      <option value="general">General Inquiry</option>
                      <option value="programs">Program Information</option>
                      <option value="enrollment">Enrollment Questions</option>
                      <option value="sponsor">Sponsorship Opportunity</option>
                      <option value="education">Education Partnership</option>
                      <option value="careers">Career Opportunities</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      onFocus={() => handleInputFocus('message')}
                      onBlur={() => handleInputBlur('message')}
                      rows={6}
                      className={`w-full px-4 py-3 rounded-lg bg-[#03325a]/80 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] resize-none ${formFocused.message || formData.message ? 'border-[#30d9fe]' : 'border-[#30d9fe]/30'
                        } ${formErrors.message ? 'border-red-400' : ''}`}
                      placeholder="Tell us more about your inquiry..."
                    />
                    {formErrors.message && <p className="text-red-400 text-sm mt-1">Message is required</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#30d9fe] to-[#00b8d4] text-[#03325a] font-bold py-4 px-8 rounded-lg hover:from-[#00b8d4] hover:to-[#30d9fe] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:ring-offset-2 focus:ring-offset-[#03325a] shadow-lg"
                  >
                    <i className="fas fa-paper-plane mr-2"></i>
                    {contactInfo.buttonText}
                  </button>
                </form>
              )}
            </div>

            {/* Right Panel - Contact Information */}
            <div className="lg:w-2/5 w-full space-y-6">
              <div className="bg-[#03325a]/60 p-6 sm:p-8 rounded-2xl border border-[#30d9fe]/20 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#30d9fe]">{contactInfo.contactInfoTitle}</h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-[#30d9fe] text-xl mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{contactInfo.visitLabel}</h4>
                      <p className="text-sm opacity-90 whitespace-pre-line">{contactInfo.visitAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-[#30d9fe] text-xl mt-1">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{contactInfo.emailLabel}</h4>
                      <p className="text-sm opacity-90">{contactInfo.primaryEmail}</p>
                      {contactInfo.secondaryEmail && <p className="text-sm opacity-90">{contactInfo.secondaryEmail}</p>}
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="text-[#30d9fe] text-xl mt-1">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{contactInfo.phoneLabel}</h4>
                      <p className="text-sm opacity-90">{contactInfo.phoneNumber}</p>
                      <p className="text-sm opacity-90">{contactInfo.phoneHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#03325a]/60 p-6 sm:p-8 rounded-2xl border border-[#30d9fe]/20 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#30d9fe]">Quick Links</h3>
                <div className="space-y-4">
                  <Link to="/programs" className="flex items-center justify-between p-3 rounded-lg bg-[#03325a]/40 hover:bg-[#03325a]/60 transition-all duration-300 group">
                    <div className="flex items-center space-x-3">
                      <div className="text-[#30d9fe] group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                      <span>View Programs</span>
                    </div>
                    <i className="fas fa-chevron-right text-[#30d9fe] group-hover:translate-x-1 transition-transform duration-300"></i>
                  </Link>

                  <Link to="/events" className="flex items-center justify-between p-3 rounded-lg bg-[#03325a]/40 hover:bg-[#03325a]/60 transition-all duration-300 group">
                    <div className="flex items-center space-x-3">
                      <div className="text-[#30d9fe] group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <span>Upcoming Events</span>
                    </div>
                    <i className="fas fa-chevron-right text-[#30d9fe] group-hover:translate-x-1 transition-transform duration-300"></i>
                  </Link>

                  <Link to="/about" className="flex items-center justify-between p-3 rounded-lg bg-[#03325a]/40 hover:bg-[#03325a]/60 transition-all duration-300 group">
                    <div className="flex items-center space-x-3">
                      <div className="text-[#30d9fe] group-hover:scale-110 transition-transform duration-300">
                        <i className="fas fa-users"></i>
                      </div>
                      <span>About Our Team</span>
                    </div>
                    <i className="fas fa-chevron-right text-[#30d9fe] group-hover:translate-x-1 transition-transform duration-300"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
