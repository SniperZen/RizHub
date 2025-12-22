import React from 'react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div 
        className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-1 pb-6 pt-5 flex flex-col items-center min-w-[500px] h-auto"
        style={{ 
          backgroundImage: "url('/Img/Dashboard/modalBG.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Header Layer - Top Section */}
        <div className="absolute bottom-[219px] left-0 right-0 h-25 flex items-center justify-center z-20">
          <span className="text-white text-2xl font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Logout
          </span>
        </div>
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-8 rounded-full w-[50px] h-[60px] flex items-center justify-center transition hover:scale-110 z-50"
          onClick={onClose}
        >
          <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
        </button>
        
        {/* Body Layer - Content Section */}
        <div className="relative flex flex-col items-center w-full px-[60px] mt-5 z-40">
          <div className="mt-3 mb-8 w-full max-w-md">
            {/* Message */}
            <div className="mb-[35px] text-center">
              <p className="fix text-[#3D2410] text-2xl font-bold mt-153">
               Sigurado ka ba na gusto mong
              </p> <p className="fix text-[#3D2410] text-2xl font-bold mt-153">mag-logout?</p>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-center gap-6 mb-25">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-1.5 bg-[#F8E193] mb-25 text-[#282725] text-lg font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
              >
                Kanselahin
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-5 py-1.5 bg-[#9A4112] text-white text-lg font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
              >
                Magpatuloy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}