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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="relative w-full max-w-2xl">
        <img
          src="/Img/Challenge/vidModal.png"
          alt="Wooden Modal"
          className="w-full h-auto"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
<p className="font-black-han-sans font-black text-2xl sm:text-2xl md:text-2xl lg:text-3xl leading-[30px] text-center text-[#95512C] relative top-[40px] lg:top-[40px]">
          Sa pagpapatuloy mo, awtomatikong magpe-play ang isang video na may kaugnayan sa pagsusulit. Manood nang mabuti at maghanda para sa pagsusulit.
          </p>

          <div className="flex gap-6 mt-24 relative top-[10px] lg:top-[30px]">
            {showSkipOption && (
              <Button
                  className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onSkip}
                >
                  Skip
              </Button>
              )}
              <Button
                  className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onClose}
                >
                  Later
              </Button>

              <Button
                  className="w-auto h-[50px] lg:h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FFA500] to-[#D76D00] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-xl lg:text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onProceed}
                >
                  Proceed
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreVideoModal;
