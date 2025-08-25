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
          <p className="font-black-han-sans font-black text-3xl leading-[30px] text-center text-[#95512C] mt-28">
            Once you continue, a video will automatically play, related to the
            assessment. Focus on the video, then prepare for the Guess the Word
            Challenge!
          </p>

          <div className="flex gap-6 mt-24">
            {showSkipOption && (
              <Button
                  className="w-auto h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-gray-300 to-gray-500 shadow-[4px_8px_0_#888] border-4 border-gray-400 text-black text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onSkip}
                >
                  Skip
                  <span className="absolute top-3 w-4 h-4 bg-white/80 rounded-full"></span>
                  <span className="absolute top-7 right-8 w-[10px] h-[10px] bg-white/60 rounded-full"></span>
              </Button>
              )}
              <Button
                  className="w-auto h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onClose}
                >
                  Later
                  <span className="absolute top-3 w-4 h-4 bg-white/80 rounded-full"></span>
                  <span className="absolute top-7 right-8 w-[10px] h-[10px] bg-white/60 rounded-full"></span>
              </Button>

              <Button
                  className="w-auto h-[60px] px-6 rounded-[40px] bg-gradient-to-b from-[#FFA500] to-[#D76D00] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-3xl font-extrabold relative transition hover:scale-105"
                  soundHover="/sounds/button-hover.mp3"
                  soundClick="/Music/Sound.mp3"
                  onClick={onProceed}
                >
                  Proceed
                  <span className="absolute top-3 w-4 h-4 bg-white/80 rounded-full"></span>
                  <span className="absolute top-7 right-8 w-[10px] h-[10px] bg-white/60 rounded-full"></span>
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreVideoModal;
