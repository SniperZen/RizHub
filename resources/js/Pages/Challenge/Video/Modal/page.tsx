import React from "react";
import Button from '@/Components/Button';

interface PreVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  showSkipOption?: boolean;
  onSkip?: () => void;
}

const PreVideoModal: React.FC<PreVideoModalProps> = ({
  isOpen,
  onClose,
  onProceed,
  showSkipOption = false,
  onSkip,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Backdrop with fade-in animation */}
      <div 
        className="absolute inset-0 bg-black/70"
        style={{
          animation: 'fadeIn 0.3s ease-out forwards'
        }}
      ></div>
      
      {/* Modal background image - appears first */}
      <div 
        className="relative w-full max-w-2xl opacity-0"
        style={{
          animation: 'scaleIn 0.4s ease-out forwards, fadeIn 0.4s ease-out forwards',
          transformOrigin: 'center'
        }}
      >
        <img
          src="/Img/Challenge/vidModal.png"
          alt="Wooden Modal"
          className="w-full h-auto"
        />
      </div>
      
      {/* Text content container - appears after background image is fully visible */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative w-full max-w-2xl flex flex-col justify-center items-center text-center px-8 opacity-0"
             style={{
                 animation: 'fadeIn 0.5s ease-out 0.4s both'
             }}>
          
          {/* Text appears after background image */}
          <p 
            className="font-black-han-sans font-black text-sm sm:text-sm md:text-xl lg:text-3xl leading-[20px] md:leading-[30px] lg:leading-[30px] text-center text-[#95512C] relative top-[10px] lg:top-[40px] opacity-0"
            style={{
              animation: 'fadeIn 0.5s ease-out 0.6s both'
            }}
          >
            Sa pagpapatuloy mo, awtomatikong magpe-play ang isang video na may kaugnayan sa pagsusulit. Manood nang mabuti at maghanda para sa pagsusulit.
          </p>

          {/* Buttons appear after text */}
          <div className="flex gap-2 sm:gap-2 md:gap-6 lg:gap-6 mt-[35px] sm:mt-20 md:mt-24 lg:mt-24  relative top-[40px] sm:top-[50px] md:top-[50px] lg:top-[50px] opacity-0"
               style={{
                 animation: 'fadeIn 0.5s ease-out 0.8s both'
               }}>
            {showSkipOption && (
              <Button
                className="w-auto h-[35px] md:h-[50px] lg:h-[60px] px-2 md:px-2 lg:px-6 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-sm md:text-xl lg:text-2xl font-extrabold relative transition hover:scale-105"
                soundHover="/sounds/button-hover.mp3"
                soundClick="/Music/Sound.mp3"
                onClick={onSkip}
              >
                Laktawan
              </Button>
            )}
            <Button
              className="w-auto h-[35px] md:h-[50px] lg:h-[60px] px-2 md:px-6 lg:px-6 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-sm md:text-xl  lg:text-2xl font-extrabold relative transition hover:scale-105"
              soundHover="/sounds/button-hover.mp3"
              soundClick="/Music/Sound.mp3"
              onClick={onClose}
            >
              Mamaya
            </Button>

            <Button
              className="w-auto h-[35px] md:h-[50px] lg:h-[60px] px-2 md:px-6 lg:px-6 rounded-[40px] bg-gradient-to-b from-[#FFA500] to-[#D76D00] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-sm md:text-xl lg:text-2xl font-extrabold relative transition hover:scale-105"
              soundHover="/sounds/button-hover.mp3"
              soundClick="/Music/Sound.mp3"
              onClick={onProceed}
            >
              Magpatuloy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreVideoModal;