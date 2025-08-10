import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  backgroundImage?: string;
  showCloseButton?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  backgroundImage = "url('/Img/Dashboard/modalBG.png')",
  showCloseButton = true,
  header,
  footer
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div 
        className={`relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] p-8 flex flex-col ${sizeClasses[size]} w-full ${className}`}
        style={{ 
          backgroundImage,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          maxHeight: '90vh'
        }}
      >
        {header || (
          <div className="flex justify-between items-center mb-4">
            {title && (
              <h2 className="text-white text-4xl font-black tracking-wide">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                className="rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                onClick={onClose}
                aria-label="Close"
              >
                <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
              </button>
            )}
          </div>
        )}

        <div className="overflow-y-auto flex-1">
          {children}
        </div>

        {footer && (
          <div className="mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;