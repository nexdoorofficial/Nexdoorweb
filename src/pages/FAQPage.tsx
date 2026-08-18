import React, { useState } from 'react';
import { FAQS } from '../data/faqs';
import { ChevronDown, Search } from 'lucide-react';
import { RefundableBanner } from '../components/common/RefundableBanner';

export const FAQPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCat = selectedCat === 'all' || faq.category === selectedCat;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="section-padding">
      <div className="container" style={{ maxWidth: '850px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span className="badge-tag">HELP CENTER & FAQ</span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#03252A', marginTop: '8px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '8px' }}>
            Everything you need to know about NEXDOOR services, booking deposit policy, machinery, and service guarantees.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search questions (e.g. deposit, chemicals, car wash, laundry)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 16px 16px 48px',
              borderRadius: '16px',
              border: '1.5px solid #E2E8F0',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General & Safety' },
            { id: 'booking-payment', label: 'Booking & Refundable Deposit' },
            { id: 'house-cleaning', label: 'House Cleaning' },
            { id: 'car-wash', label: 'Car Wash' },
            { id: 'laundry', label: 'Laundry Care' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: selectedCat === cat.id ? '#007A87' : '#F1F5F9',
                color: selectedCat === cat.id ? '#FFFFFF' : '#475569',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  cursor: 'pointer'
                }}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: '#03252A', fontSize: '1.05rem' }}>
                  <span>{faq.question}</span>
                  <ChevronDown size={20} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', color: '#007A87' }} />
                </div>
                {isOpen && (
                  <div style={{ marginTop: '14px', fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <RefundableBanner variant="full" />
      </div>
    </div>
  );
};
