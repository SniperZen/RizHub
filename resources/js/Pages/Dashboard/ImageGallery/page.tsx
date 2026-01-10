import React, { useState, useRef, useEffect } from "react";
import StudentLayout from "../../../Layouts/StudentLayout";
import { router, Link } from "@inertiajs/react";
import AudioControls from "../../../Components/AudioControls";

// Sound playing function
const playSound = (soundPath: string, volume: number = 70) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = volume / 100;
    audio.play().catch(error => {
      console.log("Sound play failed:", error);
    });
  } catch (error) {
    console.log("Sound error:", error);
  }
};

interface PageData {
  id: number;
  kabanata_id: number;
  title: string;
  title_description: string;
  description: string;
  image_url: string;
  category: string;
  unlocked: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  images: PageData[];
  music: number;
  sound: number;
}

// Gallery Modal Component
interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedImages: PageData[];
  totalImages: number;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  unlockedImages, 
  totalImages 
}) => {
  const [isBgLoaded, setIsBgLoaded] = useState(false);
  
  if (!isOpen) return null;

  const unlockedCount = unlockedImages.length;
  const completionPercentage = Math.round((unlockedCount / totalImages) * 100);

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
    <div className="relative flex flex-col items-center w-full max-w-[900px]">
      {/* Background Image - Responsive */}
      <img
        src="/Img/Dashboard/modalBG.png"
        alt="Modal Background"
        className="w-full h-auto max-h-[80vh] rounded-[40px] min-h-[500px]"
        onLoad={() => setIsBgLoaded(true)}
        onError={() => setIsBgLoaded(true)}
      />
      
      {/* Loading Overlay - Only show when image is not loaded */}
      {!isBgLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] z-20 w-full h-full"
        >
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-[#9A4112] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[#9A4112] font-bold">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Close Button - MOVED OUTSIDE the pointer-events-none container */}
      {isBgLoaded && (
        <button
          className="absolute top-12 md:top-12 lg:top-15 right-4 md:right-8 lg:right-6 rounded-full w-[55px] h-12 md:w-[60px] md:h-12 lg:w-[60px] lg:h-12 flex items-center justify-center shadow-lg transition hover:scale-110 z-50"
          onClick={onClose}
          aria-label="Close"
        >
          <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
        </button>
      )}
      
      {/* Content Container - Only show when image is loaded */}
      {isBgLoaded && (
        <div className="absolute inset-0 flex flex-col justify-start items-center text-center px-4 md:px-8 lg:px-12 pb-4 md:pb-8 lg:pb-5 pt-4 md:pt-3 lg:pt-2 overflow-y-auto pointer-events-none">
          {/* Header */}
          <div className="mb-2 md:mb-2 lg:mb-2 lg:bottom-[90px] pointer-events-auto">
            <h2 className="font-black-han-sans mb-2 md:mb-3 font-black text-3xl md:text-4xl lg:text-4xl text-white">
              Image Collection
            </h2>
            <p className="text-xl md:text-xl lg:text-lg mb-1 mt-10 md:mb-2 lg:mt-12 text-[#D27641] font-semibold">
              {unlockedCount} of {totalImages} Unlocked ({completionPercentage}%)
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xs md:max-w-sm lg:max-w-md mt-2 md:mt-1 pb-2 pointer-events-auto">
            <div className="w-full h-4 md:h-5 lg:h-5 bg-gray-300 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-3 w-full max-h-80 md:max-h-72 lg:max-h-80 overflow-y-auto p-3 md:p-4 lg:p-4 mt-3 md:mt-4 pointer-events-auto">
            {Array.from({ length: totalImages }, (_, index) => {
              const kabanataNumber = index + 1;
              const image = unlockedImages.find(img => img.kabanata_id === kabanataNumber);
              const isUnlocked = !!image;
              
              return (
                <div 
                  key={kabanataNumber}
                  className={`flex flex-col items-center p-2 md:p-3 lg:p-2 rounded-lg transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-b from-orange-100 to-yellow-100 border-2 border-orange-300 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200 border-2 border-gray-300 opacity-60'
                  }`}
                >
                  {/* Kabanata Number */}
                  <div className={`w-8 h-8 md:w-9 md:h-9 lg:w-8 lg:h-8 rounded-full flex items-center justify-center mb-1 md:mb-2 lg:mb-1 ${
                    isUnlocked 
                      ? 'bg-gradient-to-b from-orange-400 to-yellow-400 text-white' 
                      : 'bg-gray-400 text-gray-600'
                  }`}>
                    <span className="font-bold text-xs md:text-sm lg:text-xs">{kabanataNumber}</span>
                  </div>
                  
                  {/* Image or Lock Icon */}
                  <div className="w-12 h-12 md:w-16 md:h-16 lg:w-14 lg:h-14 flex items-center justify-center mb-1 md:mb-2 lg:mb-1">
                    {isUnlocked ? (
                      <img 
                        src={image.image_url.startsWith('http') ? image.image_url : `/${image.image_url}`}
                        alt={image.title}
                        className="w-full h-full object-cover rounded-lg border-2 border-orange-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center border-2 border-gray-400">
                        <svg 
                          className="w-4 h-4 md:w-6 md:h-6 lg:w-5 lg:h-5 text-gray-500" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Title */}
                  <div className="text-center">
                    <p className={`text-xs font-semibold mb-1 ${
                      isUnlocked ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      Kabanata {kabanataNumber}
                    </p>
                    {isUnlocked && (
                      <p className="text-xs text-gray-600 truncate max-w-[60px] md:max-w-[70px] lg:max-w-[60px]">
                        {image.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`mt-2 md:mt-3 lg:mt-2 px-1 py-0.5 md:px-2 md:py-1 lg:px-1 lg:py-0.5 rounded-full text-xs font-bold ${
                    isUnlocked 
                      ? 'bg-green-100 text-green-800 border border-green-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}>
                    {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="mt-3 md:mt-4 lg:mt-3 grid mb-4 md:mb-5 lg:mb-4 grid-cols-2 gap-3 md:gap-4 lg:gap-3 w-full max-w-xs md:max-w-sm pointer-events-auto">
            <div className="bg-orange-100 border border-orange-300 rounded-md p-2 md:p-3 lg:p-2">
              <p className="text-base md:text-lg lg:text-base font-bold text-orange-600">{unlockedCount}</p>
              <p className="text-xs text-orange-800">Unlocked</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-md p-2 md:p-3 lg:p-2">
              <p className="text-base md:text-lg lg:text-base font-bold text-gray-600">{totalImages - unlockedCount}</p>
              <p className="text-xs text-gray-800">Locked</p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

const ImageGalleryPage: React.FC<PageProps> = ({ images: initialImages, music, sound }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [isFading, setIsFading] = useState(false); // New state for fade effect
  const sideNavRef = useRef<HTMLDivElement | null>(null);

  const images = initialImages || [];
  const totalSpreads = Math.max(0, Math.ceil(images.length / 2));
  const lastStartIndex = Math.max(0, (totalSpreads - 1) * 2);

  // Use the sound prop for volume
  const volume = sound || 70;

  // Get unlocked images for the gallery
  const unlockedImages = images.filter(img => img.unlocked);

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const nextPage = () => {
    if (currentIndex < images.length - 2) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((i) => i + 2);
        setIsFading(false);
      }, 300); // Match this duration with CSS transition duration
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((i) => i - 2);
        setIsFading(false);
      }, 300); // Match this duration with CSS transition duration
    }
  };

  const goToPage = (index: number) => {
    if (index >= 0 && index <= images.length - 2 && index % 2 === 0) {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsFading(false);
        requestAnimationFrame(() => {
          document
            .getElementById(`page-btn-${index}`)
            ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
      }, 300);
    }
  };

  const playGuesswordGame = (kabanataId: number, kabanataHash?: string) => {
    const param = kabanataHash ?? kabanataId;
    router.get(route('guessword.play', { kabanata: param }));
  };

  const goUpOneLevel = () => {
    if (currentIndex >= 2) {
      setCurrentIndex(currentIndex - 2);
    }
  };

  const goDownOneLevel = () => {
    if (currentIndex < lastStartIndex) {
      setCurrentIndex(currentIndex + 2);
    }
  };

  // Add state for easy adjustments
  const [headerTop, setHeaderTop] = useState(-130); // initial Y offset (px)
  const [headerHeight, setHeaderHeight] = useState(450); // initial height (px)

  const [pageGroup, setPageGroup] = useState(0);

  // Handle back to dashboard with sound
  const handleBackToDashboard = () => {
    playSound("/Music/Sound.mp3", volume);
    // Add a small delay to allow sound to play before navigation
    setTimeout(() => {
      router.get(route('dashboard'));
    }, 100);
  };

    // Function to handle locked content - BLURRY VERSION
    const renderLockedContent = (image: PageData) => {
      return (
        <div className="bg-transparent border-none rounded p-4 -mt-3 text-center w-full max-w-[400px] min-h-[330px] flex flex-col relative">
          {/* Lock Status Badge */}
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-bold text-[#3b2b1a]">
              {image.category}
            </h4>
            <div className="bg-red-500/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              Locked
            </div>
          </div>

          {/* Blurry Image Container */}
          <div className="flex justify-center items-center h-44 w-full mb-2 overflow-hidden rounded-lg relative">
            <img
              src={getImageUrl(image.image_url)}
              alt={image.title}
              className="object-contain max-h-full max-w-full drop-shadow-md filter blur-md opacity-70"
            />
          {/* Lock Icon Overlay with Hover Panel */}
          <div className="absolute inset-0 flex items-center justify-center group">
            <div className="relative rounded-full p-3 flex flex-col items-center">
          <style>
          {`
          @keyframes goldPulse {
            0%, 100% {
              transform: scale(1);
              filter: drop-shadow(0 0 8px rgba(212,168,95,0.6)) brightness(1);
            }
            50% {
              transform: scale(1.08);
              filter: drop-shadow(0 0 20px rgba(255, 157, 0, 0.9)) brightness(1.2);
            }
          }
          `}
          </style>

          <div className="group relative flex items-center justify-center">
            <img
              src="/Img/Challenge/GuessWord/locked1.png"
              alt="Locked"
              className="w-[125px] h-[125px] object-contain 
                        animate-[goldPulse_2.5s_ease-in-out_infinite]
                        transition-transform duration-300"
            />
          </div>
        {/* Hidden Hover Panel */}
        <div
          className="absolute left-1/2 top-10 mt-2 -translate-x-1/2 
                    bg-[#FFFFFF]/80 text-black text-sm text-center 
                    px-4 py-3 rounded-lg shadow-lg opacity-0 scale-90 
                    group-hover:opacity-100 group-hover:scale-100 
                    transition-all duration-300 w-[320px]"
        >
          Score 5 points in Kabanata {image.kabanata_id}'s Guessword game to unlock
        </div>
      </div>
    </div>
    </div>

      {/* Blurry Text Content */}
      <h5 className="font-bold italic text-[#3b2b1a] mb-2">
        {image.title_description}
      </h5>
      
      <div className="relative">
        <p className="text-[black] font-poppins text-sm overflow-y-auto break-words max-h-[80px] bg-transparent filter blur-sm opacity-60">
          {image.description}
        </p>
      </div>
    </div>
  );
};

// Function to render unlocked content
const renderUnlockedContent = (image: PageData, index: number) => {
  return (
    <div className="bg-transparent border-none rounded p-4 -mt-3 text-center w-full max-w-[400px] min-h-[330px] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold text-[#3b2b1a]">
          {image.category}
        </h4>
        <div className="bg-[#6b4226]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
          Unlocked
        </div>
      </div>

      <div className="flex justify-center items-center h-44 w-full mb-2 overflow-hidden rounded-lg">
        <img
          src={getImageUrl(image.image_url)}
          alt={image.title}
          className="object-contain max-h-full max-w-full drop-shadow-md"
        />
      </div>

      <h5 className="font-bold italic text-[#3b2b1a]">
        {image.title_description}
      </h5>
      <p className="text-[black] font-poppins text-sm mt-2 overflow-y-auto break-words max-h-[80px] bg-transparent">
        {image.description}
      </p>
    </div>
  );
};

  // Count unlocked images
  const unlockedCount = images.filter(img => img.unlocked).length;

  return (
    <StudentLayout>
      <div
        className="relative min-h-screen bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: "url('/Img/Dashboard/BG1.png')" }} 
      >
        {/* Header with Gallery Button and Audio Controls - FIXED */}
        <div className="flex items-center justify-between w-full px-4 md:px-5 py-4 relative z-40">
          {/* Left side - Empty on mobile, Gallery button on desktop */}
          <div className="flex-1">
            {/* Gallery Collection Button - Desktop Only */}
<button
    onClick={() => setShowGalleryModal(true)}
    className="hidden w-[330px] xs:w-[340px] sm:w-[305px] md:w-[150px] lg:w-[150px] md:flex items-center space-x-1 xs:space-x-2 bg-gradient-to-b from-orange-400 to-orange-600 text-white px-3 xs:px-4 py-2 xs:py-2.5 md:px-4 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
    <svg 
        className="w-4 h-4 xs:w-[245px] xs:h-3" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 4v16M4 9h16" 
        />
    </svg>
    <span className="font-bold text-xs xs:text-sm md:text-[13px] truncate">
        Collection: {unlockedCount}/{images.length}
    </span>
</button>
          </div>

          {/* Right side - Audio Controls and Back Button */}
          <div className="flex items-center space-x-2 md:space-x-4">
          {/* Back to Dashboard Button - Using image like HelpPage, hidden on desktop */}
          <button
            onClick={handleBackToDashboard}
            onMouseEnter={() => playSound("/sounds/button-hover.mp3", volume)}
            className="flex md:hidden bg-transparent transition hover:scale-105 flex items-center justify-center"
          >
            <img 
              src="/Img/Dashboard/back.png" 
              alt="Back to Dashboard" 
              className="w-12 h-12 object-contain"
            />
          </button>

            {/* Audio Controls - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block md:mr-4">
              <AudioControls 
                initialMusic={music}
                initialSound={sound}
                onSettingsChange={(newMusic, newSound) => {
                  console.log("Audio settings changed:", newMusic, newSound);
                }}
              />
            </div>
          </div>
        </div>

        {/* RizHub Challenge Header - Positioned above book with smooth heartbeat effect */}
        <div
          className="absolute left-1/2 transform mt-4 -translate-x-1/2 w-full flex justify-center z-30 pointer-events-none overflow-hidden"
          style={{ top: `${headerTop}px` }}
        >
          <img 
            src="\Img\Dashboard\t-bg3.png" 
            alt="RizHub Challenge" 
            style={{ 
              height: `${headerHeight}px`, 
              width: "auto", 
              opacity: 0.9,
              animation: "smoothHeartbeat 4s ease-in-out infinite"
            }}
          />
        </div>

        <style>
          {`
            @keyframes smoothHeartbeat {
              0% { 
                transform: translateY(-6px) scale(1);
                filter: brightness(1);
              }
              15% { 
                transform: translateY(-6px) scale(1.03);
                filter: brightness(1.1);
              }
              30% { 
                transform: translateY(-6px) scale(1);
                filter: brightness(1);
              }
              45% { 
                transform: translateY(-6px) scale(1.02);
                filter: brightness(1.05);
              }
              60% { 
                transform: translateY(-6px) scale(1);
                filter: brightness(1);
              }
              100% { 
                transform: translateY(-6px) scale(1);
                filter: brightness(1);
              }
            }

            @keyframes bookHeartbeat {
              0% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              20% { 
                transform: scale(1.005);
                filter: brightness(1.02) contrast(1.01);
              }
              40% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              60% { 
                transform: scale(1.003);
                filter: brightness(1.01) contrast(1.005);
              }
              80% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              100% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
            }

            @keyframes contentHeartbeat {
              0% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              20% { 
                transform: scale(1.002);
                filter: brightness(1.01) contrast(1.005);
              }
              40% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              60% { 
                transform: scale(1.001);
                filter: brightness(1.005) contrast(1.002);
              }
              80% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
              100% { 
                transform: scale(1);
                filter: brightness(1) contrast(1);
              }
            }

            /* Alternative more subtle heartbeat */
            @keyframes gentleHeartbeat {
              0% { 
                transform: translateY(-6px) scale(1);
                opacity: 0.9;
              }
              25% { 
                transform: translateY(-6px) scale(1.02);
                opacity: 0.95;
              }
              50% { 
                transform: translateY(-6px) scale(1);
                opacity: 0.9;
              }
              75% { 
                transform: translateY(-6px) scale(1.015);
                opacity: 0.92;
              }
              100% { 
                transform: translateY(-6px) scale(1);
                opacity: 0.9;
              }
            }

            /* Pulsing glow effect */
            @keyframes pulseGlow {
              0% {
                transform: translateY(-6px) scale(1);
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
              }
              50% {
                transform: translateY(-6px) scale(1.02);
                filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.6));
              }
              100% {
                transform: translateY(-6px) scale(1);
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
              }
            }

            /* Fade transition for page content */
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .fade-transition {
              transition: all 0.3s ease-in-out;
            }

            .page-fade-enter {
              opacity: 0;
              transform: translateY(10px);
            }

            .page-fade-enter-active {
              opacity: 1;
              transform: translateY(0);
              transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }

            .page-fade-exit {
              opacity: 1;
              transform: translateY(0);
            }

            .page-fade-exit-active {
              opacity: 0;
              transform: translateY(-10px);
              transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }

            /* Arrow button animations */
            @keyframes arrowClick {
              0% { transform: translateY(-50%) scale(1); }
              50% { transform: translateY(-50%) scale(0.9); }
              100% { transform: translateY(-50%) scale(1); }
            }

            .arrow-click-animation {
              animation: arrowClick 0.3s ease-in-out;
            }
          `}
        </style>

        {/* Fixed Book Container - No scrolling */}
        <div className="relative flex w-11/12 max-w-6xl h-[87.5vh] min-h-[560px] -top-18 max-h-[750px] overflow-hidden z-10">
          {/* Background images with responsive switching - NO FADING */}
          <img 
            src="/Img/Dashboard/book-bg1.png"
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 hidden lg:block"
          />
          
          {/* Mobile background image - Now visible in laptop view */}
          <img 
            src="/Img/LandingPage/formobile.png"
            alt="Background Mobile" 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover pointer-events-none z-0 block lg:hidden md:max-w-xl overflow-hidden"
          />

          {/* Left Arrow - outside left side vertically centered */}
          <button
            onClick={prevPage}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-l-lg font-bold text-2xl z-[9999] pointer-events-auto transition-all duration-300 ${
              currentIndex === 0
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-[#6b4226] hover:bg-orange-600 text-white shadow-lg hover:shadow-xl active:scale-95 overflow-hidden"
            }`}
            style={{
              animation: isFading ? "arrowClick 0.3s ease-in-out" : "none"
            }}
          >
            {"<"}
          </button>

          {/* Right Arrow - outside right side vertically centered */}
          <button
            onClick={nextPage}
            disabled={currentIndex >= images.length - 2}
            className={`absolute right-0 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-r-lg font-bold text-2xl z-[9999] pointer-events-auto transition-all duration-300 ${
              currentIndex >= images.length - 2
                ? "bg-gray-400 opacity-60"
                : "bg-[#6b4226] hover:bg-orange-600 text-white shadow-lg hover:shadow-xl active:scale-95 overflow-hidden"
            }`}
            style={{
              animation: isFading ? "arrowClick 0.3s ease-in-out" : "none"
            }}
          >
            {">"}
          </button>

          {/* Content Container with fade transition ONLY - backgrounds removed from here */}
          <div 
            className={`absolute inset-0 z-50 flex fade-transition overflow-hidden ${
              isFading ? 'page-fade-exit-active' : 'page-fade-enter-active'
            }`}
            style={{
              animation: "contentHeartbeat 5s ease-in-out infinite",
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(-10px)' : 'translateY(0)'
            }}
          >
            {/* Mobile View - Single Centered Content - Now applies to lg and below */}
            <div className="block lg:hidden w-full h-full p-6 flex flex-col items-center justify-center overflow-hidden">
              {/* For mobile, we need to calculate the correct kabanata index */}
              {images[Math.floor(currentIndex / 2)] && (
                <div className="flex flex-col items-center w-full max-w-md h-full overflow-y-auto overflow-x-hidden">
                  {/* Chapter bar - centered for mobile */}
                  <div className="flex items-center justify-center w-full max-w-sm mb-4 mt-10 pt-10 z-40 relative min-h-[80px]">
                    <div className="bg-transparent text-[#6b4226] text-center py-3 font-semibold flex-1 z-40 relative min-h-[60px] flex items-center justify-center">
                      <span className="text-lg px-2 break-words whitespace-normal leading-tight">
                        KABANATA {images[Math.floor(currentIndex / 2)].kabanata_id}:{" "}
                        {images[Math.floor(currentIndex / 2)].title.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Decorative Divider */}
                  <div className="relative flex justify-center items-center w-full max-w-sm mb-4">
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                  </div>

                  {/* Page content - Centered for mobile with scroll if needed */}
                  <div className="w-full max-w-lg flex-1 flex flex-col justify-start items-center text-center z-30 relative overflow-y-auto overflow-x-hidden pb-4">
                    {!images[Math.floor(currentIndex / 2)].unlocked
                      ? renderLockedContent(images[Math.floor(currentIndex / 2)])
                      : renderUnlockedContent(images[Math.floor(currentIndex / 2)], Math.floor(currentIndex / 2))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop View - Two Column Layout - Now only for screens larger than lg */}
            <div className="hidden lg:flex w-full h-full overflow-hidden">
              {/* Left Page Content */}
              <div className="w-1/2 h-full p-6 flex flex-col left-[10px] ml-12 pl-10 overflow-hidden">
                {images[currentIndex] && (
                  <div className="flex flex-col items-center h-full ml-4 overflow-y-auto overflow-x-hidden">
                    {/* Chapter bar with left navigation button */}
                    <div className="flex items-center justify-center w-4/5 max-w-sm mb-2 mt-8 z-40 relative min-h-[80px]">
                      <div className="bg-transparent text-[#6b4226] text-center left-[18px] py-2 font-semibold flex-1 z-40 relative min-h-[60px] flex items-center justify-center">
                        <span className="text-lg px-2 break-words whitespace-normal leading-tight">
                          KABANATA {images[currentIndex].kabanata_id}:{" "}
                          {images[currentIndex].title.toUpperCase()}
                        </span>
                      </div>
                      <div className="w-12 bg-[#6b4226] rounded-r-lg flex-shrink-0 z-40 relative"></div>
                    </div>

                    {/* Decorative Divider */}
                    <div className="relative flex justify-center items-center w-4/5 max-w-sm">
                      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                    </div>

                    {/* Page content - Centered and Larger */}
                    <div className="w-4/5 max-w-lg flex-1 flex flex-col justify-start items-center text-center scale-90 z-30 relative overflow-y-auto overflow-x-hidden pb-4">
                      {!images[currentIndex].unlocked
                        ? renderLockedContent(images[currentIndex])
                        : renderUnlockedContent(images[currentIndex], currentIndex)}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Page Content */}
              <div className="w-1/2 h-full p-6 flex flex-col right-[10px] mr-12 pr-14 overflow-hidden">
                {images[currentIndex + 1] && (
                  <div className="flex flex-col items-center h-full mr-4 overflow-y-auto overflow-x-hidden">
                    {/* Chapter bar with right navigation button */}
                    <div className="flex items-center justify-center w-4/5 max-w-sm mb-2 mt-8 z-40 relative min-h-[80px]">
                      <div className="w-12 bg-[#6b4226] rounded-l-lg flex-shrink-0 z-40 relative"></div>
                      <div className="bg-transparent text-[#6b4226] text-center right-[18px] py-2 font-semibold flex-1 z-40 relative min-h-[60px] flex items-center justify-center">
                        <span className="text-lg px-2 break-words whitespace-normal leading-tight">
                          KABANATA {images[currentIndex + 1].kabanata_id}:{" "}
                          {images[currentIndex + 1].title.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Decorative Divider */}
                    <div className="relative flex justify-center items-center w-4/5 max-w-sm">
                      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#d4a85f] to-transparent"></div>
                    </div>

                    {/* Page content - Centered and Larger */}
                    <div className="w-4/5 max-w-lg flex-1 flex flex-col justify-start items-center text-center scale-90 z-30 relative overflow-y-auto overflow-x-hidden pb-4">
                      {!images[currentIndex + 1].unlocked
                        ? renderLockedContent(images[currentIndex + 1])
                        : renderUnlockedContent(images[currentIndex + 1], currentIndex + 1)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Collection Button - Bottom Center - Now applies to lg and below */}
        <button
          onClick={() => setShowGalleryModal(true)}
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-gradient-to-b from-orange-400 to-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 z-50 block md:hidden"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 4v16M4 9h16" 
            />
          </svg>
          <span className="font-bold w-[130px] xs:w-[130px] sm:w-[130px] md:w-[150px] lg:w-[150px]">
            Collection: {unlockedCount}/{images.length}
          </span>
        </button>

        {/* Horizontal Page Navigation - Chunked Paging - HIDDEN ON MOBILE AND LG */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#8b5e3c] rounded-lg shadow-lg p-3 flex items-center space-x-2 max-w-[80%] z-50 overflow-hidden hidden lg:flex">
          {/* Left Navigation Button */}
          <button
            onClick={() => setPageGroup((prev) => Math.max(prev - 1, 0))}
            disabled={pageGroup === 0}
            className="w-8 h-8 bg-[#6b4226] text-white rounded font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Previous group"
          >
            ←
          </button>

          {/* Number Buttons */}
          <div className="flex flex-nowrap space-x-2 py-1 px-2">
            {Array.from({ length: totalSpreads }, (_, i) => i * 2)
              .slice(pageGroup * 10, pageGroup * 10 + 10) // show only 10 at a time
              .map((pageIndex) => {
                const isUnlocked = images[pageIndex]?.unlocked;
                return (
                  <button
                    id={`page-btn-${pageIndex}`}
                    key={pageIndex}
                    onClick={() => isUnlocked && goToPage(pageIndex)}
                    className={`w-8 h-8 border-2 border-[#6b4226] rounded font-bold flex-shrink-0 transition-all duration-300 ${
                      currentIndex === pageIndex
                        ? "bg-orange-500 text-white scale-105"
                        : isUnlocked 
                          ? "bg-[#fdf6e3] text-[#6b4226] hover:bg-orange-200 hover:scale-105"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    } active:scale-95`}
                    disabled={!isUnlocked}
                    title={!isUnlocked ? "Complete the guessword game to unlock" : `Page ${pageIndex / 2 + 1}`}
                  >
                    {pageIndex / 2 + 1}
                  </button>
                );
              })}
          </div>

          {/* Right Navigation Button */}
          <button
            onClick={() => setPageGroup((prev) => prev + 1)}
            disabled={(pageGroup + 1) * 10 >= totalSpreads}
            className="w-8 h-8 bg-[#6b4226] text-white rounded font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Next group"
          >
            →
          </button>
        </div>
        
        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🖼️</div>
            <h4 className="text-xl font-semibold text-gray-600 mb-2">
              No images available
            </h4>
            <p className="text-gray-500">
              Complete guessword games to unlock images.
            </p>
          </div>
        )}

        {/* Gallery Modal */}
        <GalleryModal 
          isOpen={showGalleryModal}
          onClose={() => setShowGalleryModal(false)}
          unlockedImages={unlockedImages}
          totalImages={images.length}
        />
      </div>
    </StudentLayout>
  );
};

export default ImageGalleryPage;