import React, { useState, useEffect } from 'react';
import AuthService from '../../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminPages = () => {
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: 'Home',
    meta_description: '',
    is_active: true,
    sections: []
  });
  const [currentSection, setCurrentSection] = useState({
    type: 'hero',
    title: '',
    subtitle: '',
    content: '',
    buttonText: '',
    buttonLink: '',
    image_url: '',
    backgroundColor: '#03325a',
    textColor: '#ffffff',
    order: 0
  });

  // Contact Settings State
  const [contactSettings, setContactSettings] = useState([]);
  const [activeContactTab, setActiveContactTab] = useState('general');
  const [contactEditForm, setContactEditForm] = useState({
    general: {
      title: 'Get in Touch',
      subtitle: "We'd love to hear from you",
      description: "Whether you're ready to enroll, curious about our programs, or just want to say hi — drop us a line!",
      default_subject: '',
      default_message: '',
      button_text: 'Send Message',
      contact_info_title: 'Ping Our Network',
      visit_label: 'Visit Us',
      visit_address: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
      email_label: 'Email Us',
      primary_email: 'info@code2deploy.com',
      secondary_email: 'support@code2deploy.com',
      phone_label: 'Call Us',
      phone_number: '+254 743 864 7890',
      phone_hours: 'Mon-Fri: 9AM-6PM WAT',
      is_active: true
    },
    sponsor: {
      title: 'Become a Sponsor',
      subtitle: 'Partner with us to empower African youth in tech',
      description: 'Join us in our mission to transform African youth through technology education. Your sponsorship will help provide scholarships, resources, and opportunities for aspiring developers.',
      default_subject: 'Partnership Inquiry - Sponsor',
      default_message: 'I am interested in becoming a sponsor for Code2Deploy programs and events.',
      button_text: 'Submit Sponsorship Inquiry',
      contact_info_title: 'Ping Our Network',
      visit_label: 'Visit Us',
      visit_address: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
      email_label: 'Email Us',
      primary_email: 'info@code2deploy.com',
      secondary_email: 'support@code2deploy.com',
      phone_label: 'Call Us',
      phone_number: '+254 743 864 7890',
      phone_hours: 'Mon-Fri: 9AM-6PM WAT',
      is_active: true
    },
    education: {
      title: 'Become an Education & Training Partner',
      subtitle: 'Collaborate with us to expand tech education across Africa',
      description: 'Partner with Code2Deploy to deliver world-class technology education. Together, we can create innovative learning programs, share resources, and empower the next generation of African developers.',
      default_subject: 'Partnership Inquiry - Education & Training Partner',
      default_message: 'I am interested in becoming an education and training partner with Code2Deploy.',
      button_text: 'Submit Partnership Inquiry',
      contact_info_title: 'Ping Our Network',
      visit_label: 'Visit Us',
      visit_address: '123 Tech Hub, Innovation Street\nLagos, Nigeria',
      email_label: 'Email Us',
      primary_email: 'info@code2deploy.com',
      secondary_email: 'support@code2deploy.com',
      phone_label: 'Call Us',
      phone_number: '+254 743 864 7890',
      phone_hours: 'Mon-Fri: 9AM-6PM WAT',
      is_active: true
    }
  });
  const [loadingContact, setLoadingContact] = useState(false);
  const [savingContact, setSavingContact] = useState(false);

  // Page Settings State for Home, About, Programs, Events
  const [pageSettings, setPageSettings] = useState({
    home: {
      hero_title_line1: 'From',
      hero_title_highlight1: 'Hello World',
      hero_title_line2: 'to',
      hero_title_highlight2: 'Hello AI',
      hero_description: 'Empowering African youth with cutting-edge tech skills to build solutions that matter. Join our community of innovators today.',
      hero_button1_text: 'Join a Program',
      hero_button1_link: '/programs',
      hero_button2_text: 'Upcoming Events',
      hero_button2_link: '/events',
      hero_image_url: '',
      approach_title: 'Our Approach',
      approach_description: "Most courses stop at code. We take you further. By the end of our program, you'll have:",
      what_we_do_title: 'What We Do',
      is_active: true
    },
    about: {
      hero_title: 'About Code2Deploy',
      hero_subtitle: 'Empowering African youth with cutting-edge tech skills',
      hero_image_url: '',
      mission_title: 'Our Mission',
      mission_description: 'To bridge the digital skills gap in Africa by providing world-class technology education and creating pathways to successful careers in the global tech industry.',
      vision_title: 'Our Vision',
      vision_description: "To be Africa's leading technology education platform, empowering the next generation of tech leaders and innovators who will drive the continent's digital transformation.",
      journey_title: 'Our Journey',
      team_title: 'Our Leadership Team',
      is_active: true
    },
    programs: {
      hero_title: 'Our Programs',
      hero_subtitle: 'Discover world-class technology programs designed for African youth',
      hero_description: 'From beginner to advanced, our programs are designed to take you from where you are to where you want to be in tech.',
      programs_section_title: 'Available Programs',
      no_programs_message: 'No programs available at the moment. Check back soon!',
      cta_title: 'Ready to Start Your Journey?',
      cta_description: 'Join thousands of students who have transformed their careers through our programs.',
      cta_button_text: 'Apply Now',
      is_active: true
    },
    events: {
      hero_title: 'Upcoming Events',
      hero_subtitle: 'Join us for exciting tech events, workshops, and networking opportunities',
      hero_description: 'Stay connected with the Code2Deploy community through our events.',
      events_section_title: 'All Events',
      no_events_message: 'No upcoming events at the moment. Check back soon!',
      cta_title: 'Want to Host an Event?',
      cta_description: 'Partner with us to bring tech events to your community.',
      cta_button_text: 'Contact Us',
      cta_button_link: '/contact',
      is_active: true
    }
  });
  const [loadingPageSettings, setLoadingPageSettings] = useState(false);
  const [savingPageSettings, setSavingPageSettings] = useState(false);

  const contactTypes = [
    { 
      id: 'general', 
      name: 'General Contact', 
      icon: '📧',
      description: 'Default contact page when users click "Contact"',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'sponsor', 
      name: 'Partner as Sponsor', 
      icon: '💰',
      description: 'Contact page for "Partner as Sponsor" button',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'education', 
      name: 'Education & Training Partner', 
      icon: '🎓',
      description: 'Contact page for "Education & Training Partner" button',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const pages = [
    { id: 'home', name: 'Home Page', slug: '/', icon: '🏠' },
    { id: 'about', name: 'About Page', slug: '/about', icon: '📖' },
    { id: 'programs', name: 'Programs Page', slug: '/programs', icon: '📚' },
    { id: 'events', name: 'Events Page', slug: '/events', icon: '🎫' },
    { id: 'contact', name: 'Contact Page', slug: '/contact', icon: '📧' }
  ];

  const sectionTypes = [
    { id: 'hero', name: 'Hero Banner', icon: '🎯', desc: 'Main banner with title and CTA' },
    { id: 'about', name: 'About/Mission', icon: '💡', desc: 'Organization mission' },
    { id: 'stats', name: 'Statistics', icon: '📊', desc: 'Key metrics display' },
    { id: 'programs', name: 'Programs Showcase', icon: '📚', desc: 'Featured programs' },
    { id: 'events', name: 'Events Display', icon: '🎫', desc: 'Upcoming events' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬', desc: 'User testimonials' },
    { id: 'team', name: 'Team Members', icon: '👥', desc: 'Team showcase' },
    { id: 'partners', name: 'Partners/Sponsors', icon: '🤝', desc: 'Partner logos' },
    { id: 'features', name: 'Features Grid', icon: '⭐', desc: 'Key features' },
    { id: 'cta', name: 'Call to Action', icon: '📢', desc: 'Action button' },
    { id: 'faq', name: 'FAQ', icon: '❓', desc: 'Frequently asked' },
    { id: 'newsletter', name: 'Newsletter', icon: '📧', desc: 'Email signup' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem(`page_home_sections`);
    if (saved) {
      setEditForm({ ...editForm, sections: JSON.parse(saved) });
    }
  }, []);

  // Fetch Contact Settings
  const fetchContactSettings = async () => {
    try {
      setLoadingContact(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/contact-settings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContactSettings(data);
        
        const newForm = { ...contactEditForm };
        data.forEach(setting => {
          if (newForm[setting.contact_type]) {
            newForm[setting.contact_type] = {
              id: setting.id,
              title: setting.title,
              subtitle: setting.subtitle,
              description: setting.description,
              default_subject: setting.default_subject || '',
              default_message: setting.default_message || '',
              button_text: setting.button_text || 'Send Message',
              contact_info_title: setting.contact_info_title || 'Ping Our Network',
              visit_label: setting.visit_label || 'Visit Us',
              visit_address: setting.visit_address || '123 Tech Hub, Innovation Street\nLagos, Nigeria',
              email_label: setting.email_label || 'Email Us',
              primary_email: setting.primary_email || 'info@code2deploy.com',
              secondary_email: setting.secondary_email || '',
              phone_label: setting.phone_label || 'Call Us',
              phone_number: setting.phone_number || '+254 743 864 7890',
              phone_hours: setting.phone_hours || 'Mon-Fri: 9AM-6PM WAT',
              is_active: setting.is_active
            };
          }
        });
        setContactEditForm(newForm);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setLoadingContact(false);
    }
  };

  const initializeContactSettings = async () => {
    try {
      setSavingContact(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/contact-settings/initialize/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        fetchContactSettings();
      } else {
        alert('❌ Failed to initialize settings');
      }
    } catch (error) {
      console.error('Error initializing settings:', error);
      alert('❌ Error initializing settings');
    } finally {
      setSavingContact(false);
    }
  };

  const handleSaveContactSettings = async (contactType) => {
    try {
      setSavingContact(true);
      const token = AuthService.getToken();
      const formData = contactEditForm[contactType];
      
      const existingSetting = contactSettings.find(s => s.contact_type === contactType);
      
      let response;
      if (existingSetting) {
        response = await fetch(`${API_BASE_URL}/admin/contact-settings/${existingSetting.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            contact_type: contactType
          })
        });
      } else {
        response = await fetch(`${API_BASE_URL}/admin/contact-settings/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            contact_type: contactType
          })
        });
      }

      if (response.ok) {
        alert(`✅ ${contactTypes.find(t => t.id === contactType)?.name} settings saved successfully!`);
        fetchContactSettings();
      } else {
        const error = await response.json();
        alert(`❌ Error: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('❌ Error saving settings');
    } finally {
      setSavingContact(false);
    }
  };

  const handleContactInputChange = (contactType, field, value) => {
    setContactEditForm(prev => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        [field]: value
      }
    }));
  };

  // Fetch Page Settings (Home, About, Programs, Events)
  const fetchPageSettings = async (pageType) => {
    try {
      setLoadingPageSettings(true);
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/${pageType}/`);
      
      if (response.ok) {
        const data = await response.json();
        setPageSettings(prev => ({
          ...prev,
          [pageType]: { ...prev[pageType], ...data }
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${pageType} page settings:`, error);
    } finally {
      setLoadingPageSettings(false);
    }
  };

  const handleSavePageSettings = async (pageType) => {
    try {
      setSavingPageSettings(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/${pageType}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageSettings[pageType])
      });

      if (response.ok) {
        alert(`✅ ${pageType.charAt(0).toUpperCase() + pageType.slice(1)} page settings saved successfully!`);
      } else {
        const error = await response.json();
        alert(`❌ Error: ${JSON.stringify(error)}`);
      }
    } catch (error) {
      console.error(`Error saving ${pageType} page settings:`, error);
      alert('❌ Error saving page settings');
    } finally {
      setSavingPageSettings(false);
    }
  };

  const handlePageSettingsChange = (pageType, field, value) => {
    setPageSettings(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value
      }
    }));
  };

  const initializeAllPageSettings = async () => {
    try {
      setSavingPageSettings(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/page-settings/initialize/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ ${data.message}`);
        // Refresh the current page settings
        if (selectedPage && ['home', 'about', 'programs', 'events'].includes(selectedPage.id)) {
          fetchPageSettings(selectedPage.id);
        }
      } else {
        alert('❌ Failed to initialize page settings');
      }
    } catch (error) {
      console.error('Error initializing page settings:', error);
      alert('❌ Error initializing page settings');
    } finally {
      setSavingPageSettings(false);
    }
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    
    if (page.id === 'contact') {
      fetchContactSettings();
    } else if (['home', 'about', 'programs', 'events'].includes(page.id)) {
      fetchPageSettings(page.id);
    } else {
      const saved = localStorage.getItem(`page_${page.id}_sections`);
      setEditForm({
        title: page.name,
        meta_description: '',
        is_active: true,
        sections: saved ? JSON.parse(saved) : []
      });
    }
    setShowEditModal(true);
  };

  const handleSavePage = () => {
    localStorage.setItem(`page_${selectedPage.id}_sections`, JSON.stringify(editForm.sections));
    alert('✅ Page saved successfully!');
    setShowEditModal(false);
  };

  const handleAddSection = () => {
    const newSection = {
      ...currentSection,
      id: Date.now(),
      order: editForm.sections.length
    };
    setEditForm({
      ...editForm,
      sections: [...editForm.sections, newSection]
    });
    setCurrentSection({
      type: 'hero',
      title: '',
      subtitle: '',
      content: '',
      buttonText: '',
      buttonLink: '',
      image_url: '',
      backgroundColor: '#03325a',
      textColor: '#ffffff',
      order: 0
    });
  };

  const handleRemoveSection = (id) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.filter(s => s.id !== id)
    });
  };

  const handleUpdateSection = (id, updates) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.map(s => s.id === id ? { ...s, ...updates } : s)
    });
  };

  const moveSection = (id, direction) => {
    const index = editForm.sections.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === editForm.sections.length - 1)) return;
    
    const newSections = [...editForm.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    newSections.forEach((s, i) => s.order = i);
    
    setEditForm({ ...editForm, sections: newSections });
  };

  // Render Contact Page Editor
  const renderContactPageEditor = () => {
    const currentType = contactTypes.find(t => t.id === activeContactTab);
    const currentForm = contactEditForm[activeContactTab];

    return (
      <div className="space-y-6">
        {/* Contact Type Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {contactTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveContactTab(type.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                activeContactTab === type.id
                  ? 'border-[#30d9fe] bg-gradient-to-br from-[#03325a] to-[#044e7c] text-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-[#30d9fe]/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{type.icon}</span>
                <div>
                  <h3 className={`font-bold ${activeContactTab === type.id ? 'text-white' : 'text-gray-900'}`}>
                    {type.name}
                  </h3>
                  <p className={`text-xs ${activeContactTab === type.id ? 'text-gray-200' : 'text-gray-500'}`}>
                    {type.description}
                  </p>
                </div>
              </div>
              {contactSettings.find(s => s.contact_type === type.id) ? (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeContactTab === type.id ? 'bg-green-400/20 text-green-200' : 'bg-green-100 text-green-600'
                }`}>
                  ✓ Configured
                </span>
              ) : (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeContactTab === type.id ? 'bg-yellow-400/20 text-yellow-200' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  ○ Using Defaults
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-br from-[#03325a] via-[#044e7c] to-[#30d9fe]/10 rounded-xl p-6 text-white">
          <h4 className="text-sm font-medium text-[#30d9fe] mb-4">📺 Live Preview</h4>
          <div className="text-center">
            <h2 className="text-[#30d9fe] text-2xl md:text-3xl font-bold mb-2">{currentForm.title}</h2>
            <p className="text-lg mb-2">{currentForm.subtitle}</p>
            <p className="text-sm opacity-80 max-w-xl mx-auto">{currentForm.description}</p>
            <button className="mt-4 px-6 py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg">
              {currentForm.button_text}
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              value={currentForm.title}
              onChange={(e) => handleContactInputChange(activeContactTab, 'title', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="e.g., Get in Touch"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subtitle *
            </label>
            <input
              type="text"
              value={currentForm.subtitle}
              onChange={(e) => handleContactInputChange(activeContactTab, 'subtitle', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="e.g., We'd love to hear from you"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={currentForm.description}
              onChange={(e) => handleContactInputChange(activeContactTab, 'description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="Detailed description text shown to visitors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pre-filled Subject (Optional)
            </label>
            <input
              type="text"
              value={currentForm.default_subject}
              onChange={(e) => handleContactInputChange(activeContactTab, 'default_subject', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="e.g., Partnership Inquiry"
            />
            <p className="text-xs text-gray-500 mt-1">This will be pre-filled in the contact form</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Submit Button Text
            </label>
            <input
              type="text"
              value={currentForm.button_text}
              onChange={(e) => handleContactInputChange(activeContactTab, 'button_text', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="e.g., Send Message"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pre-filled Message (Optional)
            </label>
            <textarea
              value={currentForm.default_message}
              onChange={(e) => handleContactInputChange(activeContactTab, 'default_message', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
              placeholder="Default message text for the form"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id={`is_active_${activeContactTab}`}
              checked={currentForm.is_active}
              onChange={(e) => handleContactInputChange(activeContactTab, 'is_active', e.target.checked)}
              className="h-5 w-5 text-[#30d9fe] rounded border-gray-300 focus:ring-[#30d9fe]"
            />
            <label htmlFor={`is_active_${activeContactTab}`} className="text-sm font-semibold text-gray-700">
              Page Active (Visible to users)
            </label>
          </div>
        </div>

        {/* Contact Info Section - Ping Our Network */}
        <div className="bg-gradient-to-r from-[#03325a]/10 to-[#30d9fe]/10 rounded-xl p-6 border-2 border-[#30d9fe]/30">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📍</span> Ping Our Network - Contact Info Section
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            This section appears on the right side of the contact page with your address, email, and phone information.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Section Title
              </label>
              <input
                type="text"
                value={currentForm.contact_info_title || 'Ping Our Network'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'contact_info_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="e.g., Ping Our Network"
              />
            </div>

            {/* Visit Us Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Address Label
              </label>
              <input
                type="text"
                value={currentForm.visit_label || 'Visit Us'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'visit_label', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="e.g., Visit Us"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Address
              </label>
              <textarea
                value={currentForm.visit_address || '123 Tech Hub, Innovation Street\nLagos, Nigeria'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'visit_address', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="123 Tech Hub, Innovation Street&#10;Lagos, Nigeria"
              />
            </div>

            {/* Email Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Email Label
              </label>
              <input
                type="text"
                value={currentForm.email_label || 'Email Us'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'email_label', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="e.g., Email Us"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Primary Email
              </label>
              <input
                type="email"
                value={currentForm.primary_email || 'info@code2deploy.com'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'primary_email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="info@code2deploy.com"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📧 Secondary Email (Optional)
              </label>
              <input
                type="email"
                value={currentForm.secondary_email || ''}
                onChange={(e) => handleContactInputChange(activeContactTab, 'secondary_email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="support@code2deploy.com"
              />
            </div>

            {/* Phone Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📞 Phone Label
              </label>
              <input
                type="text"
                value={currentForm.phone_label || 'Call Us'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'phone_label', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="e.g., Call Us"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📞 Phone Number
              </label>
              <input
                type="text"
                value={currentForm.phone_number || '+254 743 864 7890'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'phone_number', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="+254 743 864 7890"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📞 Business Hours
              </label>
              <input
                type="text"
                value={currentForm.phone_hours || 'Mon-Fri: 9AM-6PM WAT'}
                onChange={(e) => handleContactInputChange(activeContactTab, 'phone_hours', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="Mon-Fri: 9AM-6PM WAT"
              />
            </div>
          </div>

          {/* Live Preview for Contact Info */}
          <div className="mt-6 bg-[#03325a]/80 rounded-xl p-4 text-white">
            <h5 className="text-sm font-medium text-[#30d9fe] mb-3">📺 Live Preview</h5>
            <h3 className="text-lg font-bold text-[#30d9fe] mb-4">{currentForm.contact_info_title || 'Ping Our Network'}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-[#30d9fe]">📍</span>
                <div>
                  <p className="font-semibold">{currentForm.visit_label || 'Visit Us'}</p>
                  <p className="opacity-80 whitespace-pre-line">{currentForm.visit_address || '123 Tech Hub, Innovation Street\nLagos, Nigeria'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#30d9fe]">📧</span>
                <div>
                  <p className="font-semibold">{currentForm.email_label || 'Email Us'}</p>
                  <p className="opacity-80">{currentForm.primary_email || 'info@code2deploy.com'}</p>
                  {currentForm.secondary_email && <p className="opacity-80">{currentForm.secondary_email}</p>}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#30d9fe]">📞</span>
                <div>
                  <p className="font-semibold">{currentForm.phone_label || 'Call Us'}</p>
                  <p className="opacity-80">{currentForm.phone_number || '+254 743 864 7890'}</p>
                  <p className="opacity-80">{currentForm.phone_hours || 'Mon-Fri: 9AM-6PM WAT'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSaveContactSettings(activeContactTab)}
            disabled={savingContact}
            className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {savingContact ? (
              <>
                <span className="animate-spin inline-block mr-2">⏳</span> Saving...
              </>
            ) : (
              <>💾 Save {currentType?.name} Settings</>
            )}
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <span>💡</span> How it works
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>General Contact:</strong> Shown when users click the "Contact" link</li>
            <li>• <strong>Partner as Sponsor:</strong> Shown when users click the "Partner as Sponsor" button</li>
            <li>• <strong>Education Partner:</strong> Shown when users click the "Education & Training Partner" button</li>
          </ul>
        </div>
      </div>
    );
  };

  // Render Home Page Editor
  const renderHomePageEditor = () => {
    const settings = pageSettings.home;
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🎯</span> Hero Section
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title Line 1</label>
              <input
                type="text"
                value={settings.hero_title_line1}
                onChange={(e) => handlePageSettingsChange('home', 'hero_title_line1', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Highlighted Text 1 (Cyan)</label>
              <input
                type="text"
                value={settings.hero_title_highlight1}
                onChange={(e) => handlePageSettingsChange('home', 'hero_title_highlight1', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title Line 2</label>
              <input
                type="text"
                value={settings.hero_title_line2}
                onChange={(e) => handlePageSettingsChange('home', 'hero_title_line2', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Highlighted Text 2 (Gold)</label>
              <input
                type="text"
                value={settings.hero_title_highlight2}
                onChange={(e) => handlePageSettingsChange('home', 'hero_title_highlight2', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Description</label>
              <textarea
                value={settings.hero_description}
                onChange={(e) => handlePageSettingsChange('home', 'hero_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Text</label>
              <input
                type="text"
                value={settings.hero_button1_text}
                onChange={(e) => handlePageSettingsChange('home', 'hero_button1_text', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Link</label>
              <input
                type="text"
                value={settings.hero_button1_link}
                onChange={(e) => handlePageSettingsChange('home', 'hero_button1_link', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Text</label>
              <input
                type="text"
                value={settings.hero_button2_text}
                onChange={(e) => handlePageSettingsChange('home', 'hero_button2_text', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Link</label>
              <input
                type="text"
                value={settings.hero_button2_link}
                onChange={(e) => handlePageSettingsChange('home', 'hero_button2_link', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-6 bg-[#0A0F2C] rounded-xl p-6 text-white">
            <h5 className="text-sm font-medium text-[#30d9fe] mb-3">📺 Live Preview</h5>
            <h1 className="text-2xl font-bold">
              <span className="block">{settings.hero_title_line1}</span>
              <span className="text-[#30d9fe]">{settings.hero_title_highlight1}</span>
              <span className="block">{settings.hero_title_line2}</span>
              <span className="text-[#eec262]">{settings.hero_title_highlight2}</span>
            </h1>
            <p className="mt-3 text-gray-300 text-sm">{settings.hero_description}</p>
            <div className="mt-4 flex gap-3">
              <button className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg text-sm">{settings.hero_button1_text}</button>
              <button className="px-4 py-2 bg-[#eec262] text-[#03325a] font-bold rounded-lg text-sm">{settings.hero_button2_text}</button>
            </div>
          </div>
        </div>

        {/* Our Approach Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>💡</span> Our Approach Section
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.approach_title}
                onChange={(e) => handlePageSettingsChange('home', 'approach_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Description</label>
              <textarea
                value={settings.approach_description}
                onChange={(e) => handlePageSettingsChange('home', 'approach_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🚀</span> What We Do Section
          </h4>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={settings.what_we_do_title}
              onChange={(e) => handlePageSettingsChange('home', 'what_we_do_title', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {/* Programs Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📚</span> Programs Section
          </h4>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={settings.programs_section_title}
              onChange={(e) => handlePageSettingsChange('home', 'programs_section_title', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📢</span> Call to Action Section
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
              <input
                type="text"
                value={settings.cta_title}
                onChange={(e) => handlePageSettingsChange('home', 'cta_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
              <textarea
                value={settings.cta_description}
                onChange={(e) => handlePageSettingsChange('home', 'cta_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Text</label>
                <input
                  type="text"
                  value={settings.cta_button1_text}
                  onChange={(e) => handlePageSettingsChange('home', 'cta_button1_text', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 1 Link</label>
                <input
                  type="text"
                  value={settings.cta_button1_link}
                  onChange={(e) => handlePageSettingsChange('home', 'cta_button1_link', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Text</label>
                <input
                  type="text"
                  value={settings.cta_button2_text}
                  onChange={(e) => handlePageSettingsChange('home', 'cta_button2_text', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Button 2 Link</label>
                <input
                  type="text"
                  value={settings.cta_button2_link}
                  onChange={(e) => handlePageSettingsChange('home', 'cta_button2_link', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                  style={{ color: '#111827', backgroundColor: '#ffffff' }}
                />
              </div>
            </div>
          </div>

          {/* CTA Live Preview */}
          <div className="mt-6 bg-[#03325a] rounded-xl p-6 text-white text-center">
            <h5 className="text-sm font-medium text-[#30d9fe] mb-3">📺 CTA Preview</h5>
            <h2 className="text-xl font-bold mb-3">{settings.cta_title}</h2>
            <p className="text-gray-300 text-sm mb-4">{settings.cta_description}</p>
            <div className="flex justify-center gap-3">
              <button className="px-4 py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg text-sm">{settings.cta_button1_text}</button>
              <button className="px-4 py-2 bg-[#eec262] text-[#03325a] font-bold rounded-lg text-sm">{settings.cta_button2_text}</button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSavePageSettings('home')}
            disabled={savingPageSettings}
            className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg disabled:opacity-50"
          >
            {savingPageSettings ? '⏳ Saving...' : '💾 Save Home Page Settings'}
          </button>
        </div>
      </div>
    );
  };

  // Render About Page Editor
  const renderAboutPageEditor = () => {
    const settings = pageSettings.about;
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🎯</span> Hero Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => handlePageSettingsChange('about', 'hero_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => handlePageSettingsChange('about', 'hero_subtitle', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🚀</span> Mission Section
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mission Title</label>
              <input
                type="text"
                value={settings.mission_title}
                onChange={(e) => handlePageSettingsChange('about', 'mission_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mission Description</label>
              <textarea
                value={settings.mission_description}
                onChange={(e) => handlePageSettingsChange('about', 'mission_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Vision Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>👁️</span> Vision Section
          </h4>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vision Title</label>
              <input
                type="text"
                value={settings.vision_title}
                onChange={(e) => handlePageSettingsChange('about', 'vision_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Vision Description</label>
              <textarea
                value={settings.vision_description}
                onChange={(e) => handlePageSettingsChange('about', 'vision_description', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Other Sections */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📋</span> Other Section Titles
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Journey Section Title</label>
              <input
                type="text"
                value={settings.journey_title}
                onChange={(e) => handlePageSettingsChange('about', 'journey_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Team Section Title</label>
              <input
                type="text"
                value={settings.team_title}
                onChange={(e) => handlePageSettingsChange('about', 'team_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSavePageSettings('about')}
            disabled={savingPageSettings}
            className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg disabled:opacity-50"
          >
            {savingPageSettings ? '⏳ Saving...' : '💾 Save About Page Settings'}
          </button>
        </div>
      </div>
    );
  };

  // Render Programs Page Editor
  const renderProgramsPageEditor = () => {
    const settings = pageSettings.programs;
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🎯</span> Hero Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => handlePageSettingsChange('programs', 'hero_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => handlePageSettingsChange('programs', 'hero_subtitle', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={settings.hero_description}
                onChange={(e) => handlePageSettingsChange('programs', 'hero_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Programs Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📚</span> Programs Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.programs_section_title}
                onChange={(e) => handlePageSettingsChange('programs', 'programs_section_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">No Programs Message</label>
              <input
                type="text"
                value={settings.no_programs_message}
                onChange={(e) => handlePageSettingsChange('programs', 'no_programs_message', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📢</span> Call to Action Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
              <input
                type="text"
                value={settings.cta_title}
                onChange={(e) => handlePageSettingsChange('programs', 'cta_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={settings.cta_button_text}
                onChange={(e) => handlePageSettingsChange('programs', 'cta_button_text', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
              <textarea
                value={settings.cta_description}
                onChange={(e) => handlePageSettingsChange('programs', 'cta_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSavePageSettings('programs')}
            disabled={savingPageSettings}
            className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg disabled:opacity-50"
          >
            {savingPageSettings ? '⏳ Saving...' : '💾 Save Programs Page Settings'}
          </button>
        </div>
      </div>
    );
  };

  // Render Events Page Editor
  const renderEventsPageEditor = () => {
    const settings = pageSettings.events;
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🎯</span> Hero Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => handlePageSettingsChange('events', 'hero_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => handlePageSettingsChange('events', 'hero_subtitle', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={settings.hero_description}
                onChange={(e) => handlePageSettingsChange('events', 'hero_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>🎫</span> Events Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={settings.events_section_title}
                onChange={(e) => handlePageSettingsChange('events', 'events_section_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">No Events Message</label>
              <input
                type="text"
                value={settings.no_events_message}
                onChange={(e) => handlePageSettingsChange('events', 'no_events_message', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
          <h4 className="text-lg font-bold text-[#03325a] mb-4 flex items-center gap-2">
            <span>📢</span> Call to Action Section
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Title</label>
              <input
                type="text"
                value={settings.cta_title}
                onChange={(e) => handlePageSettingsChange('events', 'cta_title', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={settings.cta_button_text}
                onChange={(e) => handlePageSettingsChange('events', 'cta_button_text', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Button Link</label>
              <input
                type="text"
                value={settings.cta_button_link}
                onChange={(e) => handlePageSettingsChange('events', 'cta_button_link', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">CTA Description</label>
              <textarea
                value={settings.cta_description}
                onChange={(e) => handlePageSettingsChange('events', 'cta_description', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => handleSavePageSettings('events')}
            disabled={savingPageSettings}
            className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg disabled:opacity-50"
          >
            {savingPageSettings ? '⏳ Saving...' : '💾 Save Events Page Settings'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-[#03325a] mb-2">Pages Management</h2>
        <p className="text-gray-600">Edit and manage website pages and content</p>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {pages.map((page) => (
          <div key={page.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-2 border-gray-200 p-6 hover:shadow-xl hover:border-[#30d9fe] transition-all duration-300 cursor-pointer group">
            <div className="text-center">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">{page.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{page.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{page.slug}</p>
              <button
                onClick={() => handleEditPage(page)}
                className="w-full bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#03325a] transition-colors font-semibold"
              >
                Edit Page
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 py-8">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#03325a] to-[#0A0F2C] p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">Edit {selectedPage?.name}</h3>
                    <p className="text-gray-300">
                      {selectedPage?.id === 'contact' 
                        ? 'Manage contact page content for different contact types'
                        : 'Manage sections and content'
                      }
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    {selectedPage?.id === 'contact' ? (
                      <button
                        onClick={initializeContactSettings}
                        disabled={savingContact}
                        className="bg-white/20 text-white px-4 py-2.5 rounded-lg hover:bg-white/30 transition-all font-semibold"
                      >
                        🔄 Initialize Defaults
                      </button>
                    ) : ['home', 'about', 'programs', 'events'].includes(selectedPage?.id) ? (
                      <button
                        onClick={initializeAllPageSettings}
                        disabled={savingPageSettings}
                        className="bg-white/20 text-white px-4 py-2.5 rounded-lg hover:bg-white/30 transition-all font-semibold"
                      >
                        🔄 Initialize Defaults
                      </button>
                    ) : (
                      <button
                        onClick={handleSavePage}
                        className="bg-[#30d9fe] text-[#03325a] px-6 py-2.5 rounded-lg hover:bg-[#eec262] transition-all font-bold shadow-lg"
                      >
                        💾 Save Page
                      </button>
                    )}
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="bg-white/20 text-white px-6 py-2.5 rounded-lg hover:bg-white/30 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8">
                {selectedPage?.id === 'contact' ? (
                  loadingContact ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
                      <span className="ml-3 text-gray-600">Loading contact settings...</span>
                    </div>
                  ) : (
                    renderContactPageEditor()
                  )
                ) : selectedPage?.id === 'home' ? (
                  loadingPageSettings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
                      <span className="ml-3 text-gray-600">Loading home page settings...</span>
                    </div>
                  ) : (
                    renderHomePageEditor()
                  )
                ) : selectedPage?.id === 'about' ? (
                  loadingPageSettings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
                      <span className="ml-3 text-gray-600">Loading about page settings...</span>
                    </div>
                  ) : (
                    renderAboutPageEditor()
                  )
                ) : selectedPage?.id === 'programs' ? (
                  loadingPageSettings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
                      <span className="ml-3 text-gray-600">Loading programs page settings...</span>
                    </div>
                  ) : (
                    renderProgramsPageEditor()
                  )
                ) : selectedPage?.id === 'events' ? (
                  loadingPageSettings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
                      <span className="ml-3 text-gray-600">Loading events page settings...</span>
                    </div>
                  ) : (
                    renderEventsPageEditor()
                  )
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Add Section */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Page Settings */}
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                        <h4 className="font-bold text-[#03325a] mb-4 text-lg flex items-center">
                          <span className="text-2xl mr-2">⚙️</span> Page Settings
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Page Title</label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                              style={{ color: '#111827', backgroundColor: '#ffffff' }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
                            <textarea
                              value={editForm.meta_description}
                              onChange={(e) => setEditForm({...editForm, meta_description: e.target.value})}
                              rows={3}
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                              style={{ color: '#111827', backgroundColor: '#ffffff' }}
                            />
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={editForm.is_active}
                              onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                              className="h-5 w-5 text-[#30d9fe] rounded border-gray-300 focus:ring-[#30d9fe]"
                            />
                            <label className="ml-3 text-sm font-semibold text-gray-700">Page Active</label>
                          </div>
                        </div>
                      </div>

                      {/* Add New Section */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                        <h4 className="font-bold text-[#03325a] mb-4 text-lg flex items-center">
                          <span className="text-2xl mr-2">➕</span> Add Section
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Type</label>
                            <select
                              value={currentSection.type}
                              onChange={(e) => {
                                setCurrentSection({...currentSection, type: e.target.value});
                              }}
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                              style={{ color: '#111827', backgroundColor: '#ffffff' }}
                            >
                              {sectionTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                  {type.icon} {type.name}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {sectionTypes.find(t => t.id === currentSection.type)?.desc}
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
                            <input
                              type="text"
                              value={currentSection.title}
                              onChange={(e) => setCurrentSection({...currentSection, title: e.target.value})}
                              placeholder="e.g., Welcome to Code2Deploy"
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                              style={{ color: '#111827', backgroundColor: '#ffffff' }}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle (Optional)</label>
                            <input
                              type="text"
                              value={currentSection.subtitle}
                              onChange={(e) => setCurrentSection({...currentSection, subtitle: e.target.value})}
                              placeholder="e.g., Empowering African Youth"
                              className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                              style={{ color: '#111827', backgroundColor: '#ffffff' }}
                            />
                          </div>
                          
                          <button
                            onClick={handleAddSection}
                            disabled={!currentSection.title}
                            className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ➕ Add Section
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Content - Sections List */}
                    <div className="lg:col-span-2">
                      <h4 className="font-bold text-[#03325a] mb-6 text-2xl flex items-center">
                        <span className="text-3xl mr-3">📄</span> Page Sections ({editForm.sections.length})
                      </h4>
                      
                      {editForm.sections.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                          <div className="text-6xl mb-4">📝</div>
                          <p className="text-xl text-gray-500 font-medium">No sections added yet</p>
                          <p className="text-gray-400 mt-2">Add your first section using the form on the left</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {editForm.sections
                            .sort((a, b) => a.order - b.order)
                            .map((section, index) => (
                              <div key={section.id} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-[#30d9fe] transition-all">
                                {/* Section Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-t-xl border-b-2 border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-2xl">
                                        {sectionTypes.find(t => t.id === section.type)?.icon}
                                      </span>
                                      <div>
                                        <h5 className="font-bold text-gray-900">
                                          {sectionTypes.find(t => t.id === section.type)?.name}
                                        </h5>
                                        <p className="text-sm text-gray-500">{section.title || 'Untitled'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => moveSection(section.id, 'up')}
                                        disabled={index === 0}
                                        className="p-2 bg-white rounded-lg hover:bg-blue-50 border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Move Up"
                                      >
                                        ⬆️
                                      </button>
                                      <button
                                        onClick={() => moveSection(section.id, 'down')}
                                        disabled={index === editForm.sections.length - 1}
                                        className="p-2 bg-white rounded-lg hover:bg-blue-50 border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title="Move Down"
                                      >
                                        ⬇️
                                      </button>
                                      <button
                                        onClick={() => handleRemoveSection(section.id)}
                                        className="p-2 bg-white rounded-lg hover:bg-red-50 border border-gray-300 text-red-600 transition-all"
                                        title="Delete Section"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Section Content */}
                                <div className="p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                                      <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                                      <input
                                        type="text"
                                        value={section.subtitle || ''}
                                        onChange={(e) => handleUpdateSection(section.id, { subtitle: e.target.value })}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                      />
                                    </div>
                                    <div className="md:col-span-2">
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                                      <textarea
                                        value={section.content || ''}
                                        onChange={(e) => handleUpdateSection(section.id, { content: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Button Text</label>
                                      <input
                                        type="text"
                                        value={section.buttonText || ''}
                                        onChange={(e) => handleUpdateSection(section.id, { buttonText: e.target.value })}
                                        placeholder="e.g., Learn More"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Button Link</label>
                                      <input
                                        type="text"
                                        value={section.buttonLink || ''}
                                        onChange={(e) => handleUpdateSection(section.id, { buttonLink: e.target.value })}
                                        placeholder="/programs"
                                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
