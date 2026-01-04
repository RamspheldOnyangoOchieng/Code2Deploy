import React, { useState, useEffect } from 'react';
import authService from '../../services/authService';

const AdminPages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    is_active: true,
    layout: 'default',
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
    background_color: '#03325a',
    text_color: '#ffffff',
    order: 0,
    data: {}
  });

  const pageTypes = [
    { id: 'home', name: 'Home Page', slug: '/', icon: '🏠' },
    { id: 'about', name: 'About Page', slug: '/about', icon: '📖' },
    { id: 'programs', name: 'Programs Page', slug: '/programs', icon: '📚' },
    { id: 'events', name: 'Events Page', slug: '/events', icon: '🎫' },
    { id: 'contact', name: 'Contact Page', slug: '/contact', icon: '📧' }
  ];

  const sectionTypes = [
    { id: 'hero', name: 'Hero Section', icon: '🎯', description: 'Main banner with title, subtitle, and CTA' },
    { id: 'about', name: 'About Section', icon: '💡', description: 'About/Mission section' },
    { id: 'stats', name: 'Statistics Section', icon: '📊', description: 'Display key metrics and numbers' },
    { id: 'programs', name: 'Programs Grid', icon: '📚', description: 'Featured programs showcase' },
    { id: 'events', name: 'Events Section', icon: '🎫', description: 'Upcoming events display' },
    { id: 'testimonials', name: 'Testimonials', icon: '💬', description: 'Success stories and reviews' },
    { id: 'team', name: 'Team Section', icon: '👥', description: 'Team members showcase' },
    { id: 'partners', name: 'Partners/Sponsors', icon: '🤝', description: 'Partner logos and links' },
    { id: 'cta', name: 'Call to Action', icon: '📢', description: 'Action-focused section' },
    { id: 'features', name: 'Features Grid', icon: '⭐', description: 'Key features/benefits' },
    { id: 'gallery', name: 'Gallery', icon: '🖼️', description: 'Image gallery' },
    { id: 'faq', name: 'FAQ Section', icon: '❓', description: 'Frequently asked questions' },
    { id: 'newsletter', name: 'Newsletter Signup', icon: '📧', description: 'Email subscription form' },
    { id: 'contact', name: 'Contact Form', icon: '📝', description: 'Contact information and form' }
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      // For now, we'll use the predefined page types
      // In a real implementation, this would fetch from your backend
      setPages(pageTypes);
    } catch (err) {
      setError('Error fetching pages');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPage = (page) => {
    setSelectedPage(page);
    // Load page content from localStorage or backend
    const savedContent = localStorage.getItem(`page_${page.id}`) || '';
    setEditForm({
      title: page.name,
      slug: page.slug,
      content: savedContent,
      meta_description: '',
      is_active: true,
      layout: 'default',
      sections: JSON.parse(localStorage.getItem(`page_sections_${page.id}`) || '[]')
    });
    setShowEditModal(true);
  };

  const handleSavePage = async () => {
    try {
      // Save to localStorage for now, in production this would save to backend
      localStorage.setItem(`page_${selectedPage.id}`, editForm.content);
      localStorage.setItem(`page_sections_${selectedPage.id}`, JSON.stringify(editForm.sections));
      setShowEditModal(false);
      // Show success message
      alert('Page saved successfully!');
    } catch (err) {
      setError('Error saving page');
    }
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
    // Reset form
    setCurrentSection({
      type: 'hero',
      title: '',
      subtitle: '',
      content: '',
      buttonText: '',
      buttonLink: '',
      image_url: '',
      background_color: '#03325a',
      text_color: '#ffffff',
      order: 0,
      data: {}
    });
  };

  const handleRemoveSection = (sectionId) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.filter(section => section.id !== sectionId)
    });
  };

  const handleUpdateSection = (sectionId, updatedSection) => {
    setEditForm({
      ...editForm,
      sections: editForm.sections.map(section => 
        section.id === sectionId ? updatedSection : section
      )
    });
  };

  const renderSectionEditor = (section) => (
    <div key={section.id} className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">
          {sectionTypes.find(st => st.id === section.type)?.icon} {sectionTypes.find(st => st.id === section.type)?.name}
        </h4>
        <button
          onClick={() => handleRemoveSection(section.id)}
          className="text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleUpdateSection(section.id, { ...section, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={section.type}
            onChange={(e) => handleUpdateSection(section.id, { ...section, type: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          >
            {sectionTypes.map(type => (
              <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
          <textarea
            value={section.content}
            onChange={(e) => handleUpdateSection(section.id, { ...section, content: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input
            type="url"
            value={section.image_url}
            onChange={(e) => handleUpdateSection(section.id, { ...section, image_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
          <input
            type="color"
            value={section.background_color}
            onChange={(e) => handleUpdateSection(section.id, { ...section, background_color: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
          <input
            type="color"
            value={section.text_color}
            onChange={(e) => handleUpdateSection(section.id, { ...section, text_color: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
          <input
            type="number"
            value={section.order}
            onChange={(e) => handleUpdateSection(section.id, { ...section, order: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
          />
        </div>
      </div>
    </div>
  );

  const renderPagePreview = () => (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{editForm.title}</h2>
        <p className="text-gray-600 mt-2">{editForm.meta_description}</p>
      </div>
      
      <div className="p-6">
        {editForm.sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <div
              key={section.id}
              className="mb-8 p-6 rounded-lg"
              style={{
                backgroundColor: section.background_color,
                color: section.text_color
              }}
            >
              <div className="max-w-4xl mx-auto">
                {section.title && (
                  <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                )}
                {section.content && (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: section.content }} />
                )}
                {section.image_url && (
                  <img
                    src={section.image_url}
                    alt={section.title}
                    className="w-full h-64 object-cover rounded-lg mt-4"
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Pages Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            👁️ Preview
          </button>
        </div>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30d9fe]"></div>
          </div>
        ) : error ? (
          <div className="col-span-full p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{page.name}</h3>
                <span className="text-sm text-gray-500">{page.slug}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Active
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditPage(page)}
                  className="flex-1 bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#00b8d4] transition-colors"
                >
                  Edit Page
                </button>
                <button
                  onClick={() => window.open(page.slug, '_blank')}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Page Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit {selectedPage?.name}</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    👁️ Preview
                  </button>
                  <button
                    onClick={handleSavePage}
                    className="bg-[#30d9fe] text-white px-4 py-2 rounded-lg hover:bg-[#00b8d4] transition-colors"
                  >
                    Save Page
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Page Settings */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Page Settings</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                        <textarea
                          value={editForm.meta_description}
                          onChange={(e) => setEditForm({...editForm, meta_description: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                        <select
                          value={editForm.layout}
                          onChange={(e) => setEditForm({...editForm, layout: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        >
                          <option value="default">Default Layout</option>
                          <option value="full-width">Full Width</option>
                          <option value="sidebar">With Sidebar</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm({...editForm, is_active: e.target.checked})}
                          className="h-4 w-4 text-[#30d9fe] focus:ring-[#30d9fe] border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Active</label>
                      </div>
                    </div>
                  </div>

                  {/* Add New Section */}
                  <div className="bg-gray-50 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-4">Add New Section</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Type</label>
                        <select
                          value={currentSection.type}
                          onChange={(e) => setCurrentSection({...currentSection, type: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        >
                          {sectionTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                        <input
                          type="text"
                          value={currentSection.title}
                          onChange={(e) => setCurrentSection({...currentSection, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#30d9fe]"
                        />
                      </div>
                      
                      <button
                        onClick={handleAddSection}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        + Add Section
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sections Editor */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-4">Page Sections</h4>
                  
                  {editForm.sections.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No sections added yet. Add your first section using the form on the left.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {editForm.sections
                        .sort((a, b) => a.order - b.order)
                        .map(renderSectionEditor)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Page Preview</h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {renderPagePreview()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPages; 