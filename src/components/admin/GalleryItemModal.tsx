import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  MapPin,
  Tag,
  Eye,
  EyeOff
} from 'lucide-react';
import type { RecentWork } from '../../types/admin';

interface GalleryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RecentWork, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, updates: Partial<RecentWork>) => void;
  editingItem?: RecentWork | null;
  totalCount: number;
}

const CATEGORY_OPTIONS = [
  'House Cleaning',
  'Car Detailing',
  'Sanitization Care',
  'Upholstery Care',
  'Kitchen Deep Clean',
  'Laundry & Fabric Care',
  'Floor Restoration',
  'Commercial Cleaning'
];

export const GalleryItemModal: React.FC<GalleryItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingItem,
  totalCount
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('House Cleaning');
  const [customCategory, setCustomCategory] = useState('');
  const [location, setLocation] = useState('Kakkanad, Kochi');
  const [image, setImage] = useState('');
  const [highlight, setHighlight] = useState('');
  const [summary, setSummary] = useState('');
  const [status, setStatus] = useState<'active' | 'hidden'>('active');
  const [orderIndex, setOrderIndex] = useState(0);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      if (CATEGORY_OPTIONS.includes(editingItem.category)) {
        setCategory(editingItem.category);
        setCustomCategory('');
      } else {
        setCategory('custom');
        setCustomCategory(editingItem.category);
      }
      setLocation(editingItem.location);
      setImage(editingItem.image);
      setHighlight(editingItem.highlight);
      setSummary(editingItem.summary);
      setStatus(editingItem.status);
      setOrderIndex(editingItem.orderIndex);
    } else {
      setTitle('');
      setCategory('House Cleaning');
      setCustomCategory('');
      setLocation('Kochi, Kerala');
      setImage('');
      setHighlight('');
      setSummary('');
      setStatus('active');
      setOrderIndex(totalCount);
    }
  }, [editingItem, isOpen, totalCount]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'custom' ? (customCategory.trim() || 'General Service') : category;

    if (!image.trim()) {
      alert('Please upload an image or provide an image URL.');
      return;
    }

    const payload: Omit<RecentWork, 'id' | 'createdAt'> = {
      title: title.trim(),
      category: finalCategory,
      location: location.trim(),
      image: image.trim(),
      highlight: highlight.trim(),
      summary: summary.trim(),
      status,
      orderIndex
    };

    if (editingItem && onUpdate) {
      onUpdate(editingItem.id, payload);
    } else {
      onSave(payload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 37, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          overflowY: 'auto'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px 24px',
              background: 'linear-gradient(135deg, #03252A 0%, #004D56 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #007A87, #9BC83B)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFF'
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFF' }}>
                  {editingItem ? 'Edit Recent Work Project' : 'Add New Work to Gallery'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                  Upload work photos, categories, location tags & descriptions
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: '24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Project Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luxury 4 BHK Villa Deep Cleaning & Floor Buffing"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              />
            </div>

            {/* Category & Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Service Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    background: '#FFF'
                  }}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="custom">Custom Category...</option>
                </select>
                {category === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.82rem',
                      marginTop: '6px'
                    }}
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Location / Area *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kakkanad, Kochi"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 34px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                  <MapPin size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                </div>
              </div>
            </div>

            {/* Image Upload & URL input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Work Photo / Image *
              </label>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Paste image URL (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />

                <label
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#03252A',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Live Preview Box */}
              {image ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '160px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1.5px solid #007A87',
                    background: '#03252A'
                  }}
                >
                  <img
                    src={image}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(3, 37, 42, 0.85)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFF',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '8px'
                    }}
                  >
                    Image Preview
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239, 68, 68, 0.9)',
                      border: 'none',
                      color: '#FFF',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    height: '90px',
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94A3B8',
                    fontSize: '0.8rem',
                    gap: '8px'
                  }}
                >
                  <ImageIcon size={20} />
                  <span>No image selected yet. Paste a URL or upload a file.</span>
                </div>
              )}
            </div>

            {/* Highlight Tag & Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Highlight Badge Text
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="e.g. Polished Marble & Buffed"
                    value={highlight}
                    onChange={(e) => setHighlight(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 32px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem'
                    }}
                  />
                  <Tag size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Visibility Status
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setStatus('active')}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: status === 'active' ? '1.5px solid #007A87' : '1px solid #CBD5E1',
                      background: status === 'active' ? '#F0FDFA' : '#FFF',
                      color: status === 'active' ? '#007A87' : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <Eye size={14} /> Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('hidden')}
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: status === 'hidden' ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                      background: status === 'hidden' ? '#FEF2F2' : '#FFF',
                      color: status === 'hidden' ? '#DC2626' : '#64748B',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    <EyeOff size={14} /> Hidden
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Description */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Summary Description
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Restored floor gloss and deep vacuumed multi-level villa with eco chemicals."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            {/* Footer Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #F1F5F9'
              }}
            >
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={{
                  padding: '10px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #007A87, #0093A2)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 122, 135, 0.3)'
                }}
              >
                {editingItem ? 'Save Changes' : 'Add Project to Gallery'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
