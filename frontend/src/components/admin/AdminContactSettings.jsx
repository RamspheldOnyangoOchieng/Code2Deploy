import React, { useState, useEffect } from 'react';
import AuthService from '../../services/authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const AdminContactSettings = () => {
  const [contactSettings, setContactSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [editForm, setEditForm] = useState({
    general: {
      title: 'Get in Touch',
      subtitle: "We'd love to hear from you",
      description: "Whether you're ready to enroll, curious about our programs, or just want to say hi — drop us a line!",
      default_subject: '',
      default_message: '',
      button_text: 'Send Message',
      is_active: true
    },
    sponsor: {
      title: 'Become a Sponsor',
      subtitle: 'Partner with us to empower African youth in tech',
      description: 'Join us in our mission to transform African youth through technology education. Your sponsorship will help provide scholarships, resources, and opportunities for aspiring developers.',
      default_subject: 'Partnership Inquiry - Sponsor',
      default_message: 'I am interested in becoming a sponsor for Code2Deploy programs and events.',
      button_text: 'Submit Sponsorship Inquiry',
      is_active: true
    },
    education: {
      title: 'Become an Education & Training Partner',
      subtitle: 'Collaborate with us to expand tech education across Africa',
      description: 'Partner with Code2Deploy to deliver world-class technology education. Together, we can create innovative learning programs, share resources, and empower the next generation of African developers.',
      default_subject: 'Partnership Inquiry - Education & Training Partner',
      default_message: 'I am interested in becoming an education and training partner with Code2Deploy.',
      button_text: 'Submit Partnership Inquiry',
      is_active: true
    }
  });

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

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      setLoading(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contact-settings/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setContactSettings(data);
        
        // Update form with fetched data
        const newForm = { ...editForm };
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
              is_active: setting.is_active
            };
          }
        });
        setEditForm(newForm);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSettings = async () => {
    try {
      setSaving(true);
      const token = AuthService.getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/contact-settings/initialize/`, {
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
      setSaving(false);
    }
  };

  const handleSave = async (contactType) => {
    try {
      setSaving(true);
      const token = AuthService.getToken();
      const formData = editForm[contactType];
      
      // Check if this setting already exists
      const existingSetting = contactSettings.find(s => s.contact_type === contactType);
      
      let response;
      if (existingSetting) {
        // Update existing
        response = await fetch(`${API_BASE_URL}/api/admin/contact-settings/${existingSetting.id}/`, {
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
        // Create new
        response = await fetch(`${API_BASE_URL}/api/admin/contact-settings/`, {
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
      setSaving(false);
    }
  };

  const handleInputChange = (contactType, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [contactType]: {
        ...prev[contactType],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
        <span className="ml-3 text-gray-600">Loading contact settings...</span>
      </div>
    );
  }

  const currentType = contactTypes.find(t => t.id === activeTab);
  const currentForm = editForm[activeTab];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#03325a] mb-2">Contact Page Settings</h2>
          <p className="text-gray-600">Manage content for different contact page types</p>
        </div>
        <button
          onClick={initializeSettings}
          disabled={saving}
          className="px-4 py-2 bg-[#03325a] text-white rounded-lg hover:bg-[#044e7c] transition-colors disabled:opacity-50"
        >
          {saving ? 'Initializing...' : '🔄 Initialize Defaults'}
        </button>
      </div>

      {/* Contact Type Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id)}
            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              activeTab === type.id
                ? 'border-[#30d9fe] bg-gradient-to-br from-[#03325a] to-[#044e7c] text-white shadow-lg'
                : 'border-gray-200 bg-white hover:border-[#30d9fe]/50 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{type.icon}</span>
              <div>
                <h3 className={`font-bold ${activeTab === type.id ? 'text-white' : 'text-gray-900'}`}>
                  {type.name}
                </h3>
                <p className={`text-sm ${activeTab === type.id ? 'text-gray-200' : 'text-gray-500'}`}>
                  {type.description}
                </p>
              </div>
            </div>
            {contactSettings.find(s => s.contact_type === type.id) ? (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === type.id ? 'bg-green-400/20 text-green-200' : 'bg-green-100 text-green-600'
              }`}>
                ✓ Configured
              </span>
            ) : (
              <span className={`text-xs px-2 py-1 rounded-full ${
                activeTab === type.id ? 'bg-yellow-400/20 text-yellow-200' : 'bg-yellow-100 text-yellow-600'
              }`}>
                ○ Using Defaults
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden">
        {/* Form Header */}
        <div className={`bg-gradient-to-r ${currentType?.color} p-6`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{currentType?.icon}</span>
            <div>
              <h3 className="text-2xl font-bold text-white">{currentType?.name}</h3>
              <p className="text-white/80">{currentType?.description}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Preview Section */}
          <div className="bg-gradient-to-br from-[#03325a] via-[#044e7c] to-[#30d9fe]/10 rounded-xl p-6 text-white">
            <h4 className="text-sm font-medium text-[#30d9fe] mb-4">📺 Live Preview</h4>
            <div className="text-center">
              <h2 className="text-[#30d9fe] text-2xl md:text-3xl font-bold mb-2">{currentForm.title}</h2>
              <p className="text-lg mb-2">{currentForm.subtitle}</p>
              <p className="text-sm opacity-80 max-w-xl mx-auto">{currentForm.description}</p>
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
                onChange={(e) => handleInputChange(activeTab, 'title', e.target.value)}
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
                onChange={(e) => handleInputChange(activeTab, 'subtitle', e.target.value)}
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
                onChange={(e) => handleInputChange(activeTab, 'description', e.target.value)}
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
                onChange={(e) => handleInputChange(activeTab, 'default_subject', e.target.value)}
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
                onChange={(e) => handleInputChange(activeTab, 'button_text', e.target.value)}
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
                onChange={(e) => handleInputChange(activeTab, 'default_message', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
                placeholder="Default message text for the form"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`is_active_${activeTab}`}
                checked={currentForm.is_active}
                onChange={(e) => handleInputChange(activeTab, 'is_active', e.target.checked)}
                className="h-5 w-5 text-[#30d9fe] rounded border-gray-300 focus:ring-[#30d9fe]"
              />
              <label htmlFor={`is_active_${activeTab}`} className="text-sm font-semibold text-gray-700">
                Page Active (Visible to users)
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={() => handleSave(activeTab)}
              disabled={saving}
              className="px-8 py-3 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#eec262] transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="animate-spin inline-block mr-2">⏳</span> Saving...
                </>
              ) : (
                <>💾 Save {currentType?.name} Settings</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
          <span>💡</span> How it works
        </h4>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• <strong>General Contact:</strong> Shown when users click the "Contact" link in navigation</li>
          <li>• <strong>Partner as Sponsor:</strong> Shown when users click the "Partner as Sponsor" button</li>
          <li>• <strong>Education & Training Partner:</strong> Shown when users click the "Education & Training Partner" button</li>
          <li>• Each type can have its own title, description, and pre-filled form values</li>
          <li>• Changes are reflected immediately on the public website after saving</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminContactSettings;
