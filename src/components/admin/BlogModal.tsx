import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Search,
  BookOpen,
  User,
  Globe,
  Tag
} from 'lucide-react';
import type { BlogPost } from '../../types';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  onUpdate?: (id: string, updates: Partial<BlogPost>) => void;
  editingPost?: BlogPost | null;
}

const STOCK_FEATURED_IMAGES = [
  { label: 'Deep Cleaning', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
  { label: 'Car Wash', url: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Garment Care', url: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Living Room', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }
];

const STOCK_AUTHOR_AVATARS = [
  { name: 'Dr. Vivek Sharma', avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80' },
  { name: 'Karan Malhotra', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { name: 'Anita Roy', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' }
];

export const BlogModal: React.FC<BlogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onUpdate,
  editingPost
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Home Care');
  const [image, setImage] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [status, setStatus] = useState<'published' | 'draft' | 'archived'>('published');
  const [featured, setFeatured] = useState(false);

  // Author Fields
  const [authorName, setAuthorName] = useState('Dr. Vivek Sharma');
  const [authorRole, setAuthorRole] = useState('Head of Environmental Hygiene');
  const [authorAvatar, setAuthorAvatar] = useState('https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80');

  // Tags Manager
  const [tags, setTags] = useState<string[]>(['Home Care', 'Sanitization']);
  const [tagInput, setTagInput] = useState('');

  // SEO Fields
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState<string[]>(['house cleaning kochi', 'deep sanitization']);
  const [keywordInput, setKeywordInput] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title || '');
      setSlug(editingPost.slug || '');
      setExcerpt(editingPost.excerpt || '');
      setContent(editingPost.content || '');
      setCategory(editingPost.category || 'Home Care');
      setImage(editingPost.image || STOCK_FEATURED_IMAGES[0].url);
      setReadTime(editingPost.readTime || '5 min read');
      setStatus(editingPost.status || 'published');
      setFeatured(!!editingPost.featured);
      setAuthorName(editingPost.author?.name || 'Dr. Vivek Sharma');
      setAuthorRole(editingPost.author?.role || 'Head of Environmental Hygiene');
      setAuthorAvatar(editingPost.author?.avatar || STOCK_AUTHOR_AVATARS[0].avatar);
      setTags(editingPost.tags || ['Home Care']);
      setMetaTitle(editingPost.metaTitle || editingPost.title || '');
      setMetaDescription(editingPost.metaDescription || editingPost.excerpt || '');
      setMetaKeywords(editingPost.metaKeywords || editingPost.tags || []);
      setCanonicalUrl(editingPost.canonicalUrl || `https://nexdoor.in/blog/${editingPost.slug}`);
    } else {
      resetForm();
    }
  }, [editingPost, isOpen]);

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('Home Care');
    setImage(STOCK_FEATURED_IMAGES[0].url);
    setReadTime('5 min read');
    setStatus('published');
    setFeatured(false);
    setAuthorName('Dr. Vivek Sharma');
    setAuthorRole('Head of Environmental Hygiene');
    setAuthorAvatar(STOCK_AUTHOR_AVATARS[0].avatar);
    setTags(['Home Care', 'Deep Sanitization']);
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords(['house cleaning kochi', 'home hygiene']);
    setCanonicalUrl('');
    setActiveTab('content');
  };

  // Auto slugify title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(generatedSlug);

    if (!metaTitle) setMetaTitle(val);
    if (!canonicalUrl) setCanonicalUrl(`https://nexdoor.in/blog/${generatedSlug}`);
  };

  // Image Upload File Handlers
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'avatar') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'cover') setImage(result);
        else setAuthorAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Tag Handlers
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Keyword Handlers
  const handleAddKeyword = () => {
    if (keywordInput.trim() && !metaKeywords.includes(keywordInput.trim())) {
      setMetaKeywords([...metaKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setMetaKeywords(metaKeywords.filter((k) => k !== kwToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const postPayload = {
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: excerpt || title,
      content,
      category,
      author: {
        name: authorName,
        role: authorRole,
        avatar: authorAvatar
      },
      readTime,
      image: image || STOCK_FEATURED_IMAGES[0].url,
      tags,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt || title,
      metaKeywords,
      canonicalUrl: canonicalUrl || `https://nexdoor.in/blog/${slug}`,
      status,
      featured
    };

    if (editingPost && onUpdate) {
      onUpdate(editingPost.id, postPayload);
    } else {
      onSave(postPayload);
    }

    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  // SEO Health Check Score
  const computeSeoScore = () => {
    let score = 0;
    if (title.length >= 20) score += 20;
    if (metaTitle.length >= 30 && metaTitle.length <= 60) score += 25;
    if (metaDescription.length >= 70 && metaDescription.length <= 160) score += 25;
    if (metaKeywords.length >= 2) score += 15;
    if (image) score += 15;
    return score;
  };

  const seoScore = computeSeoScore();

  return (
    <AnimatePresence>
      <div
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '780px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
            maxHeight: '92vh',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Top Gradient Header */}
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
              <div style={{ background: 'linear-gradient(135deg, #007A87, #9BC83B)', color: '#FFF', padding: '8px', borderRadius: '12px', display: 'flex' }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {editingPost ? 'Edit Blog Article' : 'Create SEO-Optimized Article'}
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#CBD5E1', margin: '2px 0 0 0' }}>
                  Publish insights to the website journal and configure Google search metadata
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Tabs Header */}
          <div style={{ display: 'flex', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              style={{
                padding: '14px 20px',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'content' ? '3px solid #007A87' : '3px solid transparent',
                color: activeTab === 'content' ? '#007A87' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={16} /> Article Content & Media
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              style={{
                padding: '14px 20px',
                fontWeight: 800,
                fontSize: '0.88rem',
                border: 'none',
                background: 'transparent',
                borderBottom: activeTab === 'seo' ? '3px solid #007A87' : '3px solid transparent',
                color: activeTab === 'seo' ? '#007A87' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Globe size={16} style={{ color: '#007A87' }} /> SEO Settings & Google SERP Preview
              <span style={{ background: seoScore >= 80 ? '#DCFCE7' : '#FEF3C7', color: seoScore >= 80 ? '#15803D' : '#B45309', padding: '2px 8px', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 900 }}>
                {seoScore}/100
              </span>
            </button>
          </div>

          {/* Form Content Area */}
          <form
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
          >
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* TAB 1: ARTICLE CONTENT & MEDIA */}
              {activeTab === 'content' && (
                <>
                  {/* Article Title */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Article Headline Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Hidden Science of Indoor Air Quality in Kerala Homes"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700, outline: 'none' }}
                    />
                  </div>

                  {/* Category & Slug Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#FFF' }}
                      >
                        <option value="Home Care">Home Care</option>
                        <option value="Auto Detailing">Auto Detailing</option>
                        <option value="Laundry & Garment Care">Laundry & Garment Care</option>
                        <option value="Commercial Hygiene">Commercial Hygiene</option>
                        <option value="Sanitization Guides">Sanitization Guides</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        URL Slug (SEO Permalink) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="science-of-indoor-air-quality"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', color: '#007A87', fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  {/* FEATURED COVER IMAGE WITH FILE UPLOAD FIELD */}
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <ImageIcon size={16} style={{ color: '#007A87' }} /> Featured Cover Image (Upload File or Enter URL) *
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '16px', alignItems: 'center' }}>
                      {/* Image Preview Box */}
                      <div style={{ width: '140px', height: '90px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #CBD5E1', background: '#E2E8F0', position: 'relative' }}>
                        {image ? (
                          <img src={image} alt="Featured Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: '0.75rem' }}>
                            No Image
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {/* File Upload Button */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <label
                            style={{
                              padding: '8px 16px',
                              borderRadius: '10px',
                              background: '#007A87',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Upload size={14} /> Upload Image File
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileUpload(e, 'cover')}
                              style={{ display: 'none' }}
                            />
                          </label>

                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>or paste URL below</span>
                        </div>

                        {/* Image URL Input */}
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none' }}
                        />
                      </div>
                    </div>

                    {/* Stock Presets */}
                    <div style={{ marginTop: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>Or pick a high-res sample image:</span>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {STOCK_FEATURED_IMAGES.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setImage(img.url)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '8px',
                              border: image === img.url ? '1px solid #007A87' : '1px solid #CBD5E1',
                              background: image === img.url ? '#EEF2FF' : '#FFF',
                              color: image === img.url ? '#007A87' : '#475569',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Short Summary Excerpt (Displayed on Article Cards) *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Brief 1-2 sentence teaser summarizing the article..."
                      value={excerpt}
                      onChange={(e) => {
                        setExcerpt(e.target.value);
                        if (!metaDescription) setMetaDescription(e.target.value);
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  {/* Full Article Content Textarea */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Full Article Body Content (Markdown & HTML Supported) *
                    </label>
                    <textarea
                      rows={7}
                      required
                      placeholder="Write your article content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none', lineHeight: 1.5, fontFamily: 'monospace' }}
                    />
                  </div>

                  {/* Author Details with Avatar Upload */}
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <User size={16} style={{ color: '#007A87' }} /> Author Profile & Avatar
                    </label>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>Author Name</span>
                        <input
                          type="text"
                          placeholder="Dr. Vivek Sharma"
                          value={authorName}
                          onChange={(e) => setAuthorName(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>

                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>Author Role / Title</span>
                        <input
                          type="text"
                          placeholder="Head of Environmental Hygiene"
                          value={authorRole}
                          onChange={(e) => setAuthorRole(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={authorAvatar} alt="Avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #CBD5E1' }} />
                      <label style={{ padding: '6px 14px', borderRadius: '8px', background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#007A87', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
                        Upload Avatar File
                        <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, 'avatar')} style={{ display: 'none' }} />
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#64748B' }}>or select author preset:</span>
                      {STOCK_AUTHOR_AVATARS.map((a, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setAuthorName(a.name);
                            setAuthorAvatar(a.avatar);
                          }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                          title={a.name}
                        >
                          <img src={a.avatar} alt={a.name} style={{ width: '28px', height: '28px', borderRadius: '50%', border: authorName === a.name ? '2px solid #007A87' : '1px solid #E2E8F0' }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Article Tags Pill Manager */}
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Tag size={14} style={{ color: '#007A87' }} /> Article Topics & Tags
                    </label>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="Add tag (e.g. Indoor Air Quality)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        style={{ padding: '8px 14px', borderRadius: '8px', background: '#007A87', color: '#FFF', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                      >
                        Add Tag
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {tags.map((t, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: '#EEF2FF',
                            color: '#007A87',
                            border: '1px solid #C7D2FE',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {t}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(t)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Settings Row: Status & Featured */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Publishing Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', background: '#FFF', fontWeight: 700 }}
                      >
                        <option value="published">🟢 Published (Live)</option>
                        <option value="draft">🟡 Draft (Hidden)</option>
                        <option value="archived">📁 Archived</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        Estimated Read Time
                      </label>
                      <input
                        type="text"
                        placeholder="5 min read"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                      <input
                        type="checkbox"
                        id="featuredPostCheck"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#007A87' }}
                      />
                      <label htmlFor="featuredPostCheck" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#03252A', cursor: 'pointer' }}>
                        ⭐ Feature on Homepage
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: SEO SETTINGS & GOOGLE SERP PREVIEW */}
              {activeTab === 'seo' && (
                <>
                  {/* Google SERP Live Snippet Preview Card */}
                  <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Search size={14} style={{ color: '#007A87' }} /> Live Google Search Snippet Preview
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: seoScore >= 80 ? '#15803D' : '#B45309' }}>
                        SEO Health Score: {seoScore}/100
                      </span>
                    </div>

                    {/* Simulated Google Search Result Item */}
                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', fontFamily: 'arial, sans-serif' }}>
                      <div style={{ fontSize: '0.8rem', color: '#202124', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 700 }}>NEXDOOR</span>
                        <span style={{ color: '#5f6368' }}>https://nexdoor.in › blog › {slug || 'article-slug'}</span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', color: '#1a0dab', margin: '0 0 4px 0', fontWeight: 400, cursor: 'pointer', textDecoration: 'none' }}>
                        {metaTitle || title || 'Article Meta Title Placeholder'}
                      </h3>
                      <p style={{ fontSize: '0.875rem', color: '#4d5156', margin: 0, lineHeight: 1.48 }}>
                        {metaDescription || excerpt || 'Enter meta description to optimize Google Search snippets for higher CTR...'}
                      </p>
                    </div>
                  </div>

                  {/* Meta Title Tag Input with Counter */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                        SEO Meta Title Tag (Appears as Google Link) *
                      </label>
                      <span style={{ fontSize: '0.75rem', color: metaTitle.length >= 50 && metaTitle.length <= 60 ? '#15803D' : '#B45309', fontWeight: 700 }}>
                        {metaTitle.length} / 60 chars (Recommended: 50-60)
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Indoor Air Quality Guide | NEXDOOR Deep Cleaning Kochi"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.88rem', outline: 'none', fontWeight: 600 }}
                    />
                  </div>

                  {/* Meta Description Input with Counter */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                        SEO Meta Description (Google Snippet Teaser) *
                      </label>
                      <span style={{ fontSize: '0.75rem', color: metaDescription.length >= 120 && metaDescription.length <= 160 ? '#15803D' : '#B45309', fontWeight: 700 }}>
                        {metaDescription.length} / 160 chars (Recommended: 120-160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Compelling 150-character summary including keywords to maximize click-through rate from Google search results..."
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none' }}
                    />
                  </div>

                  {/* Target Focus Keywords Manager */}
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#007A87', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Tag size={14} style={{ color: '#007A87' }} /> Target Focus Search Keywords
                    </label>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <input
                        type="text"
                        placeholder="Add keyword e.g. house cleaning kochi"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                        style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', outline: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={handleAddKeyword}
                        style={{ padding: '8px 14px', borderRadius: '8px', background: '#007A87', color: '#FFF', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer' }}
                      >
                        Add Keyword
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {metaKeywords.map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            background: '#EFF6FF',
                            color: '#1E40AF',
                            border: '1px solid #BFDBFE',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {kw}
                          <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveKeyword(kw)} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Canonical URL Input */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      Canonical URL Tag (Prevents Duplicate Content Indexing)
                    </label>
                    <input
                      type="url"
                      placeholder="https://nexdoor.in/blog/science-of-indoor-air-quality"
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem', outline: 'none', color: '#475569' }}
                    />
                  </div>
                </>
              )}

            </div>

            {/* Bottom Actions Bar */}
            <div style={{ padding: '16px 24px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {activeTab === 'content' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('seo')}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #007A87', background: '#F0FDFA', color: '#0D9488', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Next: Configure SEO <Globe size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('content')}
                    style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFF', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Back to Content
                  </button>
                )}

                <button
                  type="submit"
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #007A87, #0093A2)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 122, 135, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={16} /> {editingPost ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </div>
          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
