import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminContext';
import { BLOG_POSTS } from '../data/blogs';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const adminData = useAdminData();

  const allBlogs = (adminData && adminData.blogs && adminData.blogs.length > 0) ? adminData.blogs : BLOG_POSTS;
  const post = allBlogs.find((p) => p.slug === slug) || allBlogs[0];

  // Dynamic SEO Meta Tags & Google Article JSON-LD Schema Injection
  useEffect(() => {
    if (!post) return;

    // Document Title
    const originalTitle = document.title;
    document.title = `${post.metaTitle || post.title} | NEXDOOR Journal`;

    // Meta Description
    let metaDescTag = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDescTag) {
      metaDescTag = document.createElement('meta');
      metaDescTag.name = 'description';
      document.head.appendChild(metaDescTag);
    }
    const originalMetaDesc = metaDescTag.content;
    metaDescTag.content = post.metaDescription || post.excerpt;

    // Google Article JSON-LD Schema
    const scriptId = 'google-article-schema';
    let schemaScript = document.getElementById(scriptId) as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = scriptId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      image: post.image,
      author: {
        '@type': 'Person',
        name: post.author?.name || 'NEXDOOR Specialist',
        jobTitle: post.author?.role
      },
      publisher: {
        '@type': 'Organization',
        name: 'NEXDOOR',
        logo: {
          '@type': 'ImageObject',
          url: 'https://nexdoor.in/logo.png'
        }
      },
      datePublished: post.publishedAt,
      mainEntityOfPage: post.canonicalUrl || `https://nexdoor.in/blog/${post.slug}`
    };

    schemaScript.textContent = JSON.stringify(schemaData);

    return () => {
      document.title = originalTitle;
      if (metaDescTag) metaDescTag.content = originalMetaDesc;
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, [post]);

  if (!post) return null;

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Link to="/blog" className="btn-outline" style={{ marginBottom: '32px', display: 'inline-flex' }}>
          <ArrowLeft size={16} /> Back to All Articles
        </Link>

        <span className="badge-tag" style={{ marginBottom: '16px' }}>{post.category}</span>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginBottom: '16px', lineHeight: 1.2 }}>
          {post.title}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', fontSize: '0.9rem', color: '#64748B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={post.author?.avatar} alt={post.author?.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <strong style={{ color: '#1B2236', display: 'block' }}>{post.author?.name}</strong>
              <span>{post.author?.role}</span>
            </div>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={16} /> {post.publishedAt}
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={16} /> {post.readTime}
          </div>
        </div>

        <img src={post.image || post.coverImage} alt={post.title} style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '24px', marginBottom: '40px' }} />

        <div style={{ fontSize: '1.05rem', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {post.content}
        </div>

        <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {post.tags.map((t, idx) => (
            <span key={idx} style={{ background: '#F1F5F9', color: '#475569', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
