import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
      <div className="glass-card" style={{ padding: '48px', maxWidth: '550px', width: '100%', borderRadius: '24px' }}>
        <div style={{ fontSize: '5rem', fontWeight: 800, color: '#007A87', lineHeight: 1 }}>404</div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#03252A', marginTop: '12px', marginBottom: '12px' }}>
          Page Not Found
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '28px' }}>
          Oops! The page you are looking for might have been moved or does not exist.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/book" className="btn-outline">
            Book Service
          </Link>
        </div>
      </div>
    </div>
  );
};
