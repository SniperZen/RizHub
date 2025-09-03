import React, { useState, useRef, useEffect } from "react";
import StudentLayout from "../../../Layouts/StudentLayout";
import { router, Link } from "@inertiajs/react";
import AudioControls from "../../../Components/AudioControls";

interface PageData {
  id: number;
  kabanata_id: number;
  title: string;
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

const ImageGalleryPage: React.FC<PageProps> = ({ music, sound, images: initialImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMusic, setCurrentMusic] = useState<number | null>(null);
  const [currentSound, setCurrentSound] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const sideNavRef = useRef<HTMLDivElement | null>(null);

  // Wait for audio settings to load from props
  useEffect(() => {
    if (music !== undefined && sound !== undefined) {
      setCurrentMusic(music);
      setCurrentSound(sound);
      setIsLoading(false);
      
      // Update audio element if it exists
      const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;
      if (bgMusic) {
        bgMusic.volume = (music ?? 50) / 100;
      }
    }
  }, [music, sound]);

  const images = initialImages || [];
  const totalSpreads = Math.max(0, Math.ceil(images.length / 2));
  const lastStartIndex = Math.max(0, (totalSpreads - 1) * 2);

  const handleAudioSettingsChange = (newMusic: number, newSound: number) => {
    setCurrentMusic(newMusic);
    setCurrentSound(newSound);
    
    // Update audio elements
    const bgMusic = document.getElementById("bg-music") as HTMLAudioElement;
    if (bgMusic) {
      bgMusic.volume = newMusic / 100;
    }
  };

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
      const newIndex = currentIndex - 2;
      setCurrentIndex(newIndex);
      requestAnimationFrame(() => {
        document
          .getElementById(`page-btn-${newIndex}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  };

  const goDownOneLevel = () => {
    if (currentIndex < lastStartIndex) {
      const newIndex = currentIndex + 2;
      setCurrentIndex(newIndex);
      requestAnimationFrame(() => {
        document
          .getElementById(`page-btn-${newIndex}`)
          ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      });
    }
  };

  // Function to handle locked content
  const renderLockedContent = (image: PageData) => {
    return (
      <div className="bg-[#fff8dc] border-4 border-green-900 rounded p-4 text-center shadow-inner relative">
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center flex-col z-10 p-4 rounded">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-white font-bold text-lg mb-2">This content is locked</p>
          <p className="text-white text-sm mb-4">
            Score 5 points in Kabanata {image.kabanata_id}'s Guessword game to unlock
          </p>
          <button 
            onClick={() => playGuesswordGame(image.kabanata_id)}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 font-bold"
          >
            Play Guessword Game
          </button>
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
      <div className="bg-[#fff8dc] border-4 border-green-900 rounded p-4 text-center shadow-inner">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-bold">
            {image.category}
          </h4>
          <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Unlocked
          </div>
        </div>
        <img
          src={getImageUrl(image.image_url)}
          alt={image.title}
          className="mx-auto mb-4 w-full h-40 object-cover"
        />
        <h5 className="font-bold italic">
          {image.title}
        </h5>
        <p className="text-sm text-gray-700 mt-2">
          {image.description}
        </p>
        <div className="mt-4 text-sm font-bold">
          {(index + 1).toString().padStart(2, "0")}
        </div>
      </div>
    );
  };

  // Count unlocked images
  const unlockedCount = images.filter(img => img.unlocked).length;

  // Show loading state while audio settings are being loaded
  if (isLoading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading audio settings...</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div
        className="relative min-h-screen bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: "url('/Img/Dashboard/ImageGallery/BG.png')" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4 w-full">
          <div className="relative z-20 flex items-center">
            <img src="/Img/LandingPage/Title.png" alt="RizHub Logo" className="h-[70px] w-auto" />
          </div>
          <AudioControls 
            initialMusic={currentMusic ?? 50}
            initialSound={currentSound ?? 70}
            onSettingsChange={handleAudioSettingsChange}
          />
        </div>

        <div className="flex justify-between w-11/12 max-w-6xl px-10 mt-[20px]">
          <button
            onClick={prevPage}
            disabled={currentIndex === 0}
            className={`px-6 py-2 rounded-lg font-bold ${
              currentIndex === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6b4226] hover:bg-orange-600 text-white"
            }`}
          >
            ←
          </button>
          <button
            onClick={nextPage}
            disabled={currentIndex >= images.length - 2}
            className={`px-6 py-2 rounded-lg font-bold ${
              currentIndex >= images.length - 2
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#6b4226] hover:bg-orange-600 text-white"
            }`}
          >
            →
          </button>
        </div>

        <div className="flex mt-8 w-11/12 max-w-6xl shadow-2xl overflow-hidden bg-[#fdf6e3] border-8 border-[#6b4226] rounded-lg">
          {/* Left Page */}
          <div className="w-1/2 p-6 border-r-4 border-[#6b4226]">
            {images[currentIndex] && (
              <>
                {/* Chapter bar */}
                <div className="bg-[#6b4226] text-white text-center py-2 mb-4 font-semibold relative">
                  <span>
                    KABANATA {images[currentIndex].kabanata_id}:{" "}
                    {images[currentIndex].title.toUpperCase()}
                  </span>
                </div>

                {/* Page content */}
                {!images[currentIndex].unlocked 
                  ? renderLockedContent(images[currentIndex])
                  : renderUnlockedContent(images[currentIndex], currentIndex)
                }
              </>
            )}
          </div>

          {/* Right Page */}
          <div className="w-1/2 p-6">
            {images[currentIndex + 1] && (
              <>
                {/* Chapter bar */}
                <div className="bg-[#6b4226] text-white text-center py-2 mb-4 font-semibold relative">
                  <span>
                    KABANATA {images[currentIndex + 1].kabanata_id}:{" "}
                    {images[currentIndex + 1].title.toUpperCase()}
                  </span>
                </div>

                {/* Page content */}
                {!images[currentIndex + 1].unlocked 
                  ? renderLockedContent(images[currentIndex + 1])
                  : renderUnlockedContent(images[currentIndex + 1], currentIndex + 1)
                }
              </>
            )}
          </div>
        </div>

        <div className="absolute left-4 top-1/3 bg-[#8b5e3c] rounded-lg shadow p-2 flex flex-col items-center max-h-[300px] overflow-hidden">
          {/* Up (one level) */}
          <button
            onClick={goUpOneLevel}
            disabled={currentIndex === 0 || totalSpreads === 0}
            className="w-10 h-10 bg-[#6b4226] text-white rounded mb-2 font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous level"
          >
            ↑
          </button>

          {/* Page Buttons */}
          <div
            id="side-nav"
            ref={sideNavRef}
            className="overflow-y-auto max-h-[220px] scroll-smooth"
          >
            {Array.from({ length: totalSpreads }, (_, i) => i * 2).map(
              (pageIndex) => {
                const isUnlocked = images[pageIndex]?.unlocked;
                return (
                  <button
                    id={`page-btn-${pageIndex}`}
                    key={pageIndex}
                    onClick={() => isUnlocked && goToPage(pageIndex)}
                    className={`w-10 h-10 border-2 border-[#6b4226] rounded mb-2 font-bold block ${
                      currentIndex === pageIndex
                        ? "bg-orange-500 text-white"
                        : isUnlocked 
                          ? "bg-[#fdf6e3] text-[#6b4226] hover:bg-orange-200"
                          : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!isUnlocked}
                    title={!isUnlocked ? "Complete the guessword game to unlock" : ""}
                  >
                    {pageIndex / 2 + 1}
                  </button>
                );
              }
            )}
          </div>

          {/* Down (one level) */}
          <button
            onClick={goDownOneLevel}
            disabled={currentIndex >= lastStartIndex || totalSpreads === 0}
            className="w-10 h-10 bg-[#6b4226] text-white rounded mt-2 font-bold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next level"
          >
            ↓
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
      </div>
    </StudentLayout>
  );
};

export default ImageGalleryPage;