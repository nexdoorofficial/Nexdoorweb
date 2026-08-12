import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminContext';
import { BLOG_POSTS } from '../data/blogs';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

export const BlogPage: React.FC = () => {
  const adminData = useAdminData();
  const allBlogs = (adminData && adminData.blogs && adminData.blogs.length > 0) ? adminData.blogs : BLOG_POSTS;
  const publishedBlogs = allBlogs.filter((b) => b.status === 'published' || !b.status);

  return (
    <div className="section-padding">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px auto' }}>
          <span className="badge-tag"><BookOpen size={14} /> KNOWLEDGE BASE & INSIGHTS</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1C2677', marginTop: '8px' }}>
            NEXDOOR Cleaning Journal
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
            Expert guides on indoor air quality, luxury car paint preservation, and garment textile longevity.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          {publishedBlogs.map((post) => (
            <div key={post.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <img src={post.image || post.coverImage} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="badge-tag" style={{ fontSize: '0.75rem' }}>{post.category}</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> {post.readTime}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C2677', marginBottom: '10px', lineHeight: 1.4 }}>
                    <Link to={`/blog/${post.slug}`} style={{ color: 'inherit' }}>{post.title}</Link>
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: '#64748B' }}>
                    <img src={post.author.avatar} alt={post.author.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, color: '#1B2236' }}>{post.author.name}</div>
                      <div>{post.publishedAt}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 28px 28px 28px' }}>
                <Link to={`/blog/${post.slug}`} className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Read Article <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
