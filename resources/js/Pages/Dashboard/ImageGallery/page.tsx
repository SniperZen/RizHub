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
  if (!isOpen) return null;

  const unlockedCount = unlockedImages.length;
  const completionPercentage = Math.round((unlockedCount / totalImages) * 100);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <img
          src="/Img/Challenge/vidModal.png"
          alt="Gallery Modal"
          className="w-full h-auto"
        />
        
        <div className="absolute inset-0 flex flex-col justify-start items-center text-center px-10 pt-28 pb-10 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <h2 className="font-black-han-sans font-black text-4xl text-[#95512C] mb-2">
              Image Collection
            </h2>
            <p className="text-xl text-[#B26D42] font-semibold">
              {unlockedCount} of {totalImages} Unlocked ({completionPercentage}%)
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mb-8">
            <div className="w-full h-6 bg-gray-300 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full max-h-96 overflow-y-auto p-4">
            {Array.from({ length: totalImages }, (_, index) => {
              const kabanataNumber = index + 1;
              const image = unlockedImages.find(img => img.kabanata_id === kabanataNumber);
              const isUnlocked = !!image;
              
              return (
                <div 
                  key={kabanataNumber}
                  className={`flex flex-col items-center p-3 rounded-lg transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-b from-orange-100 to-yellow-100 border-2 border-orange-300 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-200 border-2 border-gray-300 opacity-60'
                  }`}
                >
                  {/* Kabanata Number */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    isUnlocked 
                      ? 'bg-gradient-to-b from-orange-400 to-yellow-400 text-white' 
                      : 'bg-gray-400 text-gray-600'
                  }`}>
                    <span className="font-bold text-sm">{kabanataNumber}</span>
                  </div>
                  
                  {/* Image or Lock Icon */}
                  <div className="w-20 h-20 flex items-center justify-center mb-2">
                    {isUnlocked ? (
                      <img 
                        src={image.image_url.startsWith('http') ? image.image_url : `/${image.image_url}`}
                        alt={image.title}
                        className="w-full h-full object-cover rounded-lg border-2 border-orange-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 rounded-lg flex items-center justify-center border-2 border-gray-400">
                        <svg 
                          className="w-8 h-8 text-gray-500" 
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
                      <p className="text-xs text-gray-600 truncate max-w-[80px]">
                        {image.title}
                      </p>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`mt-2 px-2 py-1 rounded-full text-xs font-bold ${
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
          <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-orange-100 border border-orange-300 rounded-lg p-3">
              <p className="text-2xl font-bold text-orange-600">{unlockedCount}</p>
              <p className="text-sm text-orange-800">Unlocked</p>
            </div>
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
              <p className="text-2xl font-bold text-gray-600">{totalImages - unlockedCount}</p>
              <p className="text-sm text-gray-800">Locked</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="mt-6 w-auto h-[50px] px-8 rounded-[40px] bg-gradient-to-b from-[#FF7E47] to-[#B26D42] shadow-[4px_8px_0_#B97B4B] border-4 border-[#E6B07B] text-white text-xl font-extrabold relative transition hover:scale-105"
          >
            Close Gallery
            <span className="absolute top-2 w-3 h-3 bg-white/80 rounded-full"></span>
            <span className="absolute top-6 right-6 w-2 h-2 bg-white/60 rounded-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

const ImageGalleryPage: React.FC<PageProps> = ({ images: initialImages, music, sound }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
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
      setCurrentIndex((i) => i + 2);
    }
  };

  const prevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 2);
    }
  };

  const goToPage = (index: number) => {
    if (index >= 0 && index <= images.length - 2 && index % 2 === 0) {
      setCurrentIndex(index);
      requestAnimationFrame(() => {
        document
          .getElementById(`page-btn-${index}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  };

  const playGuesswordGame = (kabanataId: number) => {
    router.get(route('guessword.play', { kabanata: kabanataId }));
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

  // Function to handle locked content
  const renderLockedContent = (image: PageData) => {
    return (
      <div className="bg-[#fff8dc] border-4 border-[#6b4226] rounded p-4 text-center shadow-inner relative">
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center flex-col z-10 p-4 rounded">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-white font-bold text-lg mb-2">This content is locked</p>
          <p className="text-white text-sm mb-4">
            Score 5 points in Kabanata {image.kabanata_id}'s Guessword game to unlock
          </p>
          {/* <button 
            onClick={() => playGuesswordGame(image.kabanata_id)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-bold"
          >
            Play Guessword Game
          </button> */}
        </div>
        <h4 className="text-lg font-bold mb-2">
          {image.category}
        </h4>
        <div className="mx-auto mb-4 w-full h-40 bg-gray-300 flex items-center justify-center">
          <span className="text-gray-500">Locked Image</span>
        </div>
        <h5 className="font-bold italic">
          {image.title}
        </h5>
        <p className="text-sm text-gray-700 mt-2">
          Content locked. Complete the guessword game to view.
        </p>
        <div className="mt-4 text-sm font-bold">
          {(images.findIndex(img => img.id === image.id) + 1).toString().padStart(2, "0")}
        </div>
      </div>
    );
  };

  // Function to render unlocked content
  const renderUnlockedContent = (image: PageData, index: number) => {
    return (
      <div className="bg-[#fff8dc] border-4 border-[#6b4226] rounded p-4 text-center shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold">
            {image.category}
          </h4>
          <div className="bg-[#6b4226] text-white text-xs px-2 py-1 rounded-full">
            Unlocked
          </div>
        </div>
        <img
          src={getImageUrl(image.image_url)}
          alt={image.title}
          className="mx-auto mb-4 w-full h-40 object-cover"
        />
        <h5 className="font-bold italic">
          {image.title_description}
        </h5>
        <p className="text-sm text-gray-700 mt-2">
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
        {/* Header with Gallery Button */}
        <div className="flex items-center justify-between w-full px-8 py-4 relative z-40">
          {/* Gallery Collection Button */}
          <button
            onClick={() => setShowGalleryModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-b from-orange-400 to-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-orange-300 ml-4"
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
            <span className="font-bold">
              Collection: {unlockedCount}/{images.length}
            </span>
          </button>

          {/* Audio Controls - Right Side */}
          <div className="mr-4">
            <AudioControls 
              initialMusic={music}
              initialSound={sound}
              onSettingsChange={(newMusic, newSound) => {
                // Handle audio settings change if needed
                console.log("Audio settings changed:", newMusic, newSound);
              }}
            />
          </div>
        </div>

        {/* RizHub Challenge Header - Positioned above book with smooth heartbeat effect */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 w-full flex justify-center z-30 pointer-events-none"
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
          `}
        </style>

        {/* Updated Back Button with Image and Sound
        <div className="absolute left-5 top-5 transform z-50">
          <button
            onClick={handleBackToDashboard}
            onMouseEnter={() => playSound("/sounds/button-hover.mp3", volume)}
            className="bg-transparent transition hover:scale-105 flex items-center justify-center"
            aria-label="Back to Dashboard"
            title="Back to Dashboard"
            style={{
              animation: "contentHeartbeat 5s ease-in-out infinite"
            }}
          >
            <img 
              src="/Img/Dashboard/back.png" 
              alt="Back to Dashboard" 
              className="w-14 h-14 object-contain"
            />
          </button>
        </div> */}

        {/* Fixed Book Container - No scrolling */}
        <div className="relative flex w-11/12 max-w-6xl h-[87.5vh] min-h-[550px] max-h-[740px] overflow-hidden z-10">
          {/* Background image with heartbeat effect */}
          <img 
            src="/Img/Dashboard/book-bg1.png"
            alt="Background" 
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{
              animation: "bookHeartbeat 5s ease-in-out infinite"
            }}
          />

          {/* Content Container with heartbeat effect */}
          <div 
            className="absolute w-full h-full z-50 flex"
            style={{
              animation: "contentHeartbeat 5s ease-in-out infinite"
            }}
          >
            {/* Left Page Content */}
            <div className="w-1/2 p-6 flex flex-col">
              {images[currentIndex] && (
                <div className="flex flex-col items-center ml-20 mt-3">
                  {/* Chapter bar with left navigation button */}
                  <div className="flex items-center justify-center w-4/5 max-w-sm mb-2 mt-4 z-40 relative">
                    <button
                      onClick={prevPage}
                      disabled={currentIndex === 0}
                      className={`px-4 py-2 rounded-l-lg font-bold text-lg flex-shrink-0 mr-2 z-50 relative ${
                        currentIndex === 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#6b4226] hover:bg-orange-600 text-white"
                      }`}
                    >
                      ←
                    </button>
                    <div className="bg-[#6b4226] text-white text-center py-2 font-semibold flex-1 z-40 relative">
                      <span className="text-base">
                        KABANATA {images[currentIndex].kabanata_id}:{" "}
                        {images[currentIndex].title.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-12 bg-[#6b4226] rounded-r-lg flex-shrink-0 z-40 relative"></div>
                  </div>

                  {/* Page content - Centered and Larger */}
                  <div className="w-4/5 max-w-lg flex flex-col justify-start items-center text-center scale-90 z-30 relative">
                    {!images[currentIndex].unlocked 
                      ? renderLockedContent(images[currentIndex])
                      : renderUnlockedContent(images[currentIndex], currentIndex)
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Right Page Content */}
            <div className="w-1/2 p-6 flex flex-col">
              {images[currentIndex + 1] && (
                <div className="flex flex-col items-center mr-20 mt-3">
                  {/* Chapter bar with right navigation button */}
                  <div className="flex items-center justify-center w-4/5 max-w-sm mb-2 mt-4 z-40 relative">
                    <div className="w-12 bg-[#6b4226] rounded-l-lg flex-shrink-0 z-40 relative"></div>
                    <div className="bg-[#6b4226] text-white text-center py-2 font-semibold flex-1 z-40 relative">
                      <span className="text-base">
                        KABANATA {images[currentIndex + 1].kabanata_id}:{" "}
                        {images[currentIndex + 1].title.toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={currentIndex >= images.length - 2}
                      className={`px-4 py-2 rounded-r-lg font-bold text-lg flex-shrink-0 ml-2 z-50 relative ${
                        currentIndex >= images.length - 2
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#6b4226] hover:bg-orange-600 text-white"
                      }`}
                    >
                      →
                    </button>
                  </div>

                  {/* Page content - Centered and Larger */}
                  <div className="w-4/5 max-w-lg flex flex-col justify-start items-center text-center scale-90 z-30 relative">
                    {!images[currentIndex + 1].unlocked 
                      ? renderLockedContent(images[currentIndex + 1])
                      : renderUnlockedContent(images[currentIndex + 1], currentIndex + 1)
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Horizontal Page Navigation - Chunked Paging */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#8b5e3c] rounded-lg shadow-lg p-3 flex items-center space-x-2 max-w-[80%] z-50">
            {/* Left Navigation Button */}
            <button
              onClick={() => setPageGroup((prev) => Math.max(prev - 1, 0))}
              disabled={pageGroup === 0}
              className="w-8 h-8 bg-[#6b4226] text-white rounded font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
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
                      className={`w-8 h-8 border-2 border-[#6b4226] rounded font-bold flex-shrink-0 ${
                        currentIndex === pageIndex
                          ? "bg-orange-500 text-white"
                          : isUnlocked 
                            ? "bg-[#fdf6e3] text-[#6b4226] hover:bg-orange-200"
                            : "bg-gray-400 text-gray-600 cursor-not-allowed"
                      }`}
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
              className="w-8 h-8 bg-[#6b4226] text-white rounded font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              aria-label="Next group"
            >
              →
            </button>
          </div>
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