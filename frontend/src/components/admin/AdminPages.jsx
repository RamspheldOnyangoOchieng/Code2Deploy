import React, { useState, useEffect } from 'react';

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
    // Load saved sections from localStorage
    const saved = localStorage.getItem(`page_home_sections`);
    if (saved) {
      setEditForm({ ...editForm, sections: JSON.parse(saved) });
    }
  }, []);

  const handleEditPage = (page) => {
    setSelectedPage(page);
    const saved = localStorage.getItem(`page_${page.id}_sections`);
    setEditForm({
      title: page.name,
      meta_description: '',
      is_active: true,
      sections: saved ? JSON.parse(saved) : []
    });
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
                    <p className="text-gray-300">Manage sections and content</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSavePage}
                      className="bg-[#30d9fe] text-[#03325a] px-6 py-2.5 rounded-lg hover:bg-[#eec262] transition-all font-bold shadow-lg"
                    >
                      💾 Save Page
                    </button>
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
                              const selected = sectionTypes.find(t => t.id === e.target.value);
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
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                    <input
                                      type="url"
                                      value={section.image_url || ''}
                                      onChange={(e) => handleUpdateSection(section.id, { image_url: e.target.value })}
                                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-[#30d9fe] focus:ring-2 focus:ring-[#30d9fe]/20 transition-all"
                                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Background</label>
                                      <input
                                        type="color"
                                        value={section.backgroundColor || '#03325a'}
                                        onChange={(e) => handleUpdateSection(section.id, { backgroundColor: e.target.value })}
                                        className="w-full h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                                      <input
                                        type="color"
                                        value={section.textColor || '#ffffff'}
                                        onChange={(e) => handleUpdateSection(section.id, { textColor: e.target.value })}
                                        className="w-full h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPages;
