import React, { createContext, useContext, useState, useId } from 'react';
import { motion, AnimatePresence, type Transition } from 'framer-motion';
import { X } from 'lucide-react';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  transition?: Transition;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | undefined>(undefined);

const useMorphingDialog = () => {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error('useMorphingDialog must be used within a MorphingDialog provider');
  }
  return context;
};

export interface MorphingDialogProps {
  children: React.ReactNode;
  transition?: Transition;
}

export const MorphingDialog: React.FC<MorphingDialogProps> = ({ children, transition }) => {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();

  const defaultTransition: Transition = transition || {
    type: 'spring',
    stiffness: 240,
    damping: 24
  };

  return (
    <MorphingDialogContext.Provider value={{ isOpen, setIsOpen, uniqueId, transition: defaultTransition }}>
      {children}
    </MorphingDialogContext.Provider>
  );
};

export interface MorphingDialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MorphingDialogTrigger: React.FC<MorphingDialogTriggerProps> = ({ children, className, style }) => {
  const { setIsOpen } = useMorphingDialog();

  return (
    <div
      onClick={() => setIsOpen(true)}
      className={className}
      style={{ cursor: 'pointer', ...style }}
    >
      {children}
    </div>
  );
};

export interface MorphingDialogContainerProps {
  children: React.ReactNode;
}

export const MorphingDialogContainer: React.FC<MorphingDialogContainerProps> = ({ children }) => {
  const { isOpen, setIsOpen } = useMorphingDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          />
          {children}
        </div>
      )}
    </AnimatePresence>
  );
};

export interface MorphingDialogContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MorphingDialogContent: React.FC<MorphingDialogContentProps> = ({ children, className, style }) => {
  const { transition } = useMorphingDialog();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 15 }}
      transition={transition}
      className={className}
      style={{
        position: 'relative',
        zIndex: 100000,
        width: 'calc(100vw - 32px)',
        maxWidth: '480px',
        maxHeight: '80vh',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {children}
    </motion.div>
  );
};

export interface MorphingDialogTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MorphingDialogTitle: React.FC<MorphingDialogTitleProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={{ fontWeight: 800, color: '#1C2677', fontSize: '1.15rem', paddingRight: '28px', ...style }}>
      {children}
    </div>
  );
};

export interface MorphingDialogSubtitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const MorphingDialogSubtitle: React.FC<MorphingDialogSubtitleProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '4px', ...style }}>
      {children}
    </div>
  );
};

export interface MorphingDialogImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export const MorphingDialogImage: React.FC<MorphingDialogImageProps> = ({ src, alt, className, style }) => {
  return <img src={src} alt={alt} className={className} style={{ objectFit: 'cover', ...style }} />;
};

export const MorphingDialogClose: React.FC<{ className?: string }> = () => {
  const { setIsOpen } = useMorphingDialog();

  return (
    <button
      onClick={() => setIsOpen(false)}
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: '#F1F5F9',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#475569',
        cursor: 'pointer',
        zIndex: 10
      }}
    >
      <X size={16} />
    </button>
  );
};
