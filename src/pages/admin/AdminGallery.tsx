import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Plus,
  Search,
  Sliders,
  Clock,
  MapPin,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Save,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { GalleryItemModal } from '../../components/admin/GalleryItemModal';
import type { RecentWork, GallerySettings } from '../../types/admin';

export const AdminGallery: React.FC = () => {
  const {
    recentWorks,
    gallerySettings,
    addRecentWork,
    updateRecentWork,
    deleteRecentWork,
    toggleRecentWorkStatus,
    reorderRecentWorks,
    updateGallerySettings,
    resetGallerySettings
  } = useAdminData();

  // Search & Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RecentWork | null>(null);

  // Settings State for local form
  const [settingsForm, setSettingsForm] = useState<GallerySettings>(gallerySettings);

  // Sync settings when context updates
  React.useEffect(() => {
    setSettingsForm(gallerySettings);
  }, [gallerySettings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateGallerySettings(settingsForm);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...recentWorks];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    reorderRecentWorks(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === recentWorks.length - 1) return;
    const newItems = [...recentWorks];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    reorderRecentWorks(newItems);
  };

  // Filtered Items
  const filteredWorks = recentWorks.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(recentWorks.map((item) => item.category)));
  const activeCount = recentWorks.filter((item) => item.status === 'active').length;

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(0, 122, 135, 0.10)',
                color: '#007A87',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 800
              }}
            >
              <Sparkles size={13} /> PORTFOLIO & RECENT WORKS
            </span>
            <span
              style={{
                background: '#ECFDF5',
                color: '#047857',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {activeCount} of {recentWorks.length} Active
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#03252A', margin: 0 }}>
            Recent Works Gallery Manager
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '4px 0 0 0' }}>
            Manage recent work showcases, upload high-detail photos, and configure automated slide timings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all gallery items and slide timings back to factory defaults?')) {
                resetGallerySettings();
              }
            }}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} /> Reset Defaults
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #007A87, #0093A2)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 122, 135, 0.25)'
            }}
          >
            <Plus size={16} /> Add New Project
          </button>
        </div>
      </div>

      {/* Global Slider Settings Configuration Card */}
      <form
        onSubmit={handleSaveSettings}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 122, 135, 0.12)',
                color: '#007A87',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#03252A', margin: 0 }}>
                Carousel Timing & Section Display Settings
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                Control automated rotation intervals, headlines, and behavior on the public home page.
              </p>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#007A87',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Save size={14} /> Save Slide Settings
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Automatic Slide Timing */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 800, color: '#03252A', marginBottom: '8px' }}>
              <Clock size={15} style={{ color: '#007A87' }} /> Automatic Slide Interval (Seconds)
            </label>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 12px 0' }}>
              Time each project photo stays visible before transitioning to the next.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <input
                type="range"
                min={2}
                max={15}
                step={1}
                value={settingsForm.slideIntervalSeconds}
                onChange={(e) => setSettingsForm({ ...settingsForm, slideIntervalSeconds: Number(e.target.value) })}
                style={{ flex: 1, accentColor: '#007A87', cursor: 'pointer' }}
              />
              <span
                style={{
                  background: '#007A87',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  minWidth: '50px',
                  textAlign: 'center'
                }}
              >
                {settingsForm.slideIntervalSeconds}s
              </span>
            </div>

            {/* Quick preset buttons */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[2, 3, 4, 5, 6, 8, 10].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, slideIntervalSeconds: sec })}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: settingsForm.slideIntervalSeconds === sec ? '1.5px solid #007A87' : '1px solid #CBD5E1',
                    background: settingsForm.slideIntervalSeconds === sec ? '#E0F2F1' : '#FFFFFF',
                    color: settingsForm.slideIntervalSeconds === sec ? '#007A87' : '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Play & Behavior Toggles */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#03252A', marginBottom: '8px' }}>
                Carousel Behavior
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Auto Play Switch */}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block' }}>
                      Auto-Slide Rotation
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Automatically rotate to next project
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.autoPlay}
                    onChange={(e) => setSettingsForm({ ...settingsForm, autoPlay: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#007A87', cursor: 'pointer' }}
                  />
                </label>

                {/* Pause On Hover Switch */}
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', display: 'block' }}>
                      Pause on Hover / Touch
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Freeze timer when user inspects photo
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsForm.pauseOnHover}
                    onChange={(e) => setSettingsForm({ ...settingsForm, pauseOnHover: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#007A87', cursor: 'pointer' }}
                  />
                </label>
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#007A87', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Real-time instant sync with homepage
            </div>
          </div>

          {/* Section Copywriting */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#03252A', marginBottom: '8px' }}>
              Section Headline & Text
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="Headline (e.g. See Our Recent Works in Action)"
                value={settingsForm.headline}
                onChange={(e) => setSettingsForm({ ...settingsForm, headline: e.target.value })}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 600 }}
              />
              <input
                type="text"
                placeholder="Badge Tag (e.g. OUR RECENT WORKS)"
                value={settingsForm.badgeText}
                onChange={(e) => setSettingsForm({ ...settingsForm, badgeText: e.target.value })}
                style={{ width: '100%', padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem' }}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 320px' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
            <input
              type="text"
              placeholder="Search projects by title, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                background: '#FFFFFF'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '0.88rem',
              background: '#FFFFFF',
              color: '#334155'
            }}
          >
            <option value="all">All Categories ({recentWorks.length})</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
          Showing {filteredWorks.length} of {recentWorks.length} projects
        </span>
      </div>

      {/* Projects Grid */}
      {filteredWorks.length === 0 ? (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '2px dashed #CBD5E1',
            padding: '60px 20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#F1F5F9',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}
          >
            <ImageIcon size={28} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#03252A', margin: '0 0 6px 0' }}>
            No gallery projects found
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 20px 0' }}>
            {searchQuery || categoryFilter !== 'all'
              ? 'Try changing your search keywords or category filter.'
              : 'Add your first project showcase to display on the website gallery.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setIsModalOpen(true);
            }}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: 'none',
              background: '#007A87',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            + Add Project Now
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredWorks.map((work, index) => {
            const isFirst = index === 0;
            const isLast = index === recentWorks.length - 1;

            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  border: work.status === 'active' ? '1px solid #E2E8F0' : '1px dashed #CBD5E1',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: work.status === 'active' ? 1 : 0.65
                }}
              >
                {/* Photo Preview Container */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', background: '#03252A' }}>
                  <img
                    src={work.image}
                    alt={work.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Category Chip */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(3, 37, 42, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#9BC83B' }} />
                    {work.category}
                  </div>

                  {/* Status Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: work.status === 'active' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(100, 116, 139, 0.95)',
                      color: '#FFFFFF',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '4px 9px',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {work.status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span>{work.status === 'active' ? 'Published' : 'Hidden'}</span>
                  </div>

                  {/* Highlight pill */}
                  {work.highlight && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '12px',
                        background: 'rgba(0, 122, 135, 0.85)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFF',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '8px'
                      }}
                    >
                      {work.highlight}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: '#007A87',
                          background: '#E0F2F1',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <MapPin size={11} style={{ color: '#007A87' }} />
                        {work.location}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#03252A', margin: '0 0 6px 0', lineHeight: 1.3 }}>
                      {work.title}
                    </h3>

                    {work.summary && (
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                        {work.summary}
                      </p>
                    )}
                  </div>

                  {/* Card Controls Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '16px',
                      paddingTop: '12px',
                      borderTop: '1px solid #F1F5F9'
                    }}
                  >
                    {/* Reorder Buttons */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(index)}
                        title="Move Up in order"
                        style={{
                          background: '#F1F5F9',
                          border: 'none',
                          color: isFirst ? '#CBD5E1' : '#475569',
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          cursor: isFirst ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveDown(index)}
                        title="Move Down in order"
                        style={{
                          background: '#F1F5F9',
                          border: 'none',
                          color: isLast ? '#CBD5E1' : '#475569',
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          cursor: isLast ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => toggleRecentWorkStatus(work.id)}
                        title={work.status === 'active' ? 'Hide from public site' : 'Publish on public site'}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: work.status === 'active' ? '#475569' : '#007A87',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {work.status === 'active' ? 'Hide' : 'Publish'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem(work);
                          setIsModalOpen(true);
                        }}
                        title="Edit Project"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          background: '#FFFFFF',
                          color: '#007A87',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete project "${work.title}" from gallery?`)) {
                            deleteRecentWork(work.id);
                          }
                        }}
                        title="Delete Project"
                        style={{
                          padding: '5px 8px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#FEE2E2',
                          color: '#DC2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <GalleryItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSave={addRecentWork}
        onUpdate={updateRecentWork}
        editingItem={editingItem}
        totalCount={recentWorks.length}
      />
    </div>
  );
};
