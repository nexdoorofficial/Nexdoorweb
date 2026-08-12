import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const FloatingWhatsApp: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const phoneNumber = '919544635707';
  const preFilledMessage = 'Hi NEXDOOR! I would like to inquire about your cleaning services.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(preFilledMessage)}`;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
    >
      {/* Desktop Hover Tooltip Badge */}
      <motion.div
        initial={{ opacity: 0, x: 10, scale: 0.95 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.95
        }}
        transition={{ duration: 0.2 }}
        style={{
          pointerEvents: 'none',
          background: '#1C2677',
          color: '#FFFFFF',
          padding: '8px 14px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(28, 38, 119, 0.25)',
          border: '1px solid rgba(41, 195, 190, 0.3)',
          whiteSpace: 'nowrap'
        }}
        className="whatsapp-tooltip-desktop"
      >
        Chat with NEXDOOR <span style={{ color: '#25D366' }}>● Online</span>
      </motion.div>

      {/* Main Floating WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with NEXDOOR Cleaning Solutions (+91 95446 35707)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(37, 211, 102, 0.45)',
          textDecoration: 'none',
          position: 'relative',
          cursor: 'pointer'
        }}
        className="whatsapp-float-btn"
      >
        {/* SVG WhatsApp Official Logo */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.852 0-3.667-.498-5.253-1.442l-.377-.225-3.903 1.024 1.042-3.805-.247-.393c-1.036-1.648-1.583-3.553-1.583-5.508 0-5.65 4.597-10.247 10.247-10.247 2.737 0 5.31 1.066 7.245 3.002 1.936 1.936 3.001 4.509 3.001 7.246 0 5.652-4.596 10.248-10.247 10.248m0-22.186c-6.581 0-11.936 5.355-11.936 11.938 0 2.102.549 4.155 1.593 5.961l-1.691 6.177 6.321-1.658c1.737.947 3.701 1.446 5.713 1.447h.005c6.579 0 11.934-5.356 11.934-11.938 0-3.188-1.242-6.185-3.498-8.442-2.257-2.257-5.255-3.485-8.441-3.485" />
        </svg>

        {/* Online Status Green Indicator Dot */}
        <span
          style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            background: '#10B981',
            border: '2px solid #FFFFFF'
          }}
        />
      </motion.a>

      <style>{`
        .whatsapp-float-btn::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(37, 211, 102, 0.4);
          z-index: -1;
          animation: whatsappPulse 2s infinite ease-out;
        }

        @keyframes whatsappPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.35);
            opacity: 0;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .whatsapp-tooltip-desktop {
            display: none !important;
          }
          .whatsapp-float-btn {
            width: 52px !important;
            height: 52px !important;
          }
        }
      `}</style>
    </div>
  );
};
