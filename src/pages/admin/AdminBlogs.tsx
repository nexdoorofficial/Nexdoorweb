import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Globe,
  Eye,
  Trash2,
  Edit,
  ExternalLink
} from 'lucide-react';
import { useAdminData } from '../../context/AdminContext';
import { BlogModal } from '../../components/admin/BlogModal';
import type { BlogPost } from '../../types';

export const AdminBlogs: React.FC = () => {
  const { blogs, addBlogPost, updateBlogPost, deleteBlogPost, toggleBlogStatus } = useAdminData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const totalArticles = blogs.length;
  const publishedCount = blogs.filter((b) => b.status === 'published').length;
  const draftCount = blogs.filter((b) => b.status === 'draft').length;
  const totalViews = blogs.reduce((sum, b) => sum + (b.viewsCount || 0), 0);

  const filteredBlogs = blogs.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterCategory !== 'all' && b.category !== filterCategory) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;

    return true;
  });

  const handleOpenAddModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: BlogPost) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={22} style={{ color: '#007A87' }} /> SEO Blog Journal Management
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '2px 0 0 0' }}>
            Manage website articles, configure Google Search SERP metadata, and upload cover images
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #007A87, #0093A2)',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.88rem',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 122, 135, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} /> Create New Article
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Total Articles</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A' }}>{totalArticles}</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', marginBottom: '4px' }}>Published (Live)</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803D' }}>{publishedCount}</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', marginBottom: '4px' }}>Draft Articles</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#B45309' }}>{draftCount}</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '18px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#007A87', textTransform: 'uppercase', marginBottom: '4px' }}>Total Article Views</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#007A87' }}>{totalViews.toLocaleString()}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderRadius: '18px', border: '1px solid #E2E8F0', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '8px 14px', minWidth: '260px', flex: 1 }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="Search articles by title, slug, tag, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem' }}
          />
        </div>

        {/* Status & Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F8FAFC', color: '#475569', fontWeight: 700, fontSize: '0.8rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Statuses</option>
            <option value="published">🟢 Published Only</option>
            <option value="draft">🟡 Drafts Only</option>
          </select>

          {[
            { id: 'all', label: 'All Categories' },
            { id: 'Home Care', label: 'Home Care' },
            { id: 'Auto Detailing', label: 'Auto Detailing' },
            { id: 'Laundry & Garment Care', label: 'Laundry Care' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setFilterCategory(c.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: filterCategory === c.id ? 'none' : '1px solid #E2E8F0',
                background: filterCategory === c.id ? '#007A87' : '#F8FAFC',
                color: filterCategory === c.id ? '#FFFFFF' : '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Classic Data Table View */}
      <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '14px 18px' }}>Cover Image</th>
                <th style={{ padding: '14px 18px' }}>Article Details & SEO Slug</th>
                <th style={{ padding: '14px 18px' }}>Category</th>
                <th style={{ padding: '14px 18px' }}>Author</th>
                <th style={{ padding: '14px 18px' }}>Views & Date</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((post) => (
                <tr
                  key={post.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFC')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
                >
                  {/* Thumbnail Image */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ width: '64px', height: '48px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #CBD5E1', background: '#E2E8F0' }}>
                      <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </td>

                  {/* Title & SEO Slug */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem', marginBottom: '2px' }}>
                      {post.title} {post.featured && <span style={{ color: '#F59E0B' }} title="Featured on Homepage">⭐</span>}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={12} style={{ color: '#007A87' }} /> /blog/{post.slug}
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ background: '#EEF2FF', color: '#007A87', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>
                      {post.category}
                    </span>
                  </td>

                  {/* Author */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={post.author?.avatar} alt={post.author?.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.82rem' }}>{post.author?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{post.author?.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Views & Date */}
                  <td style={{ padding: '14px 18px', color: '#64748B', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} style={{ color: '#007A87' }} /> {(post.viewsCount || 0).toLocaleString()} views
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{post.publishedAt}</div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => toggleBlogStatus(post.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        border: 'none',
                        background: post.status === 'published' ? '#DCFCE7' : '#FEF3C7',
                        color: post.status === 'published' ? '#15803D' : '#B45309',
                        cursor: 'pointer'
                      }}
                      title="Click to toggle Published / Draft status"
                    >
                      {post.status === 'published' ? '🟢 Published' : '🟡 Draft'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ padding: '6px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', color: '#475569', display: 'inline-flex' }}
                        title="View Live Page"
                      >
                        <ExternalLink size={14} />
                      </a>

                      <button
                        onClick={() => handleOpenEditModal(post)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#007A87',
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Edit size={14} /> Edit & SEO
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Delete blog article "${post.title}"?`)) {
                            deleteBlogPost(post.id);
                          }
                        }}
                        style={{ background: '#FEE2E2', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#DC2626' }}
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBlogs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <BookOpen size={36} style={{ color: '#94A3B8', marginBottom: '8px' }} />
            <p style={{ margin: 0, fontWeight: 700 }}>No blog articles match your current filter.</p>
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addBlogPost}
        onUpdate={updateBlogPost}
        editingPost={editingPost}
      />
    </div>
  );
};
