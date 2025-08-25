import React, { useState, useRef } from "react";
import StudentLayout from "../../../Layouts/StudentLayout";
import { router, usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

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

interface PageProps extends InertiaPageProps {
  images: PageData[];
}

const ImageGalleryPage: React.FC<PageProps> = ({ images: initialImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { props } = usePage<PageProps>();
  
  const images = props.images || initialImages || [];

  const getImageUrl = (imagePath: string) => {
    
    if (imagePath.startsWith('http')) return imagePath;
    
    if (imagePath.startsWith('/')) return imagePath;

    return `/${imagePath}`;
  };

  const sideNavRef = useRef<HTMLDivElement | null>(null);

  const totalSpreads = Math.max(0, Math.ceil(images.length / 2));
  const lastStartIndex = Math.max(0, (totalSpreads - 1) * 2);

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

  const refreshGallery = () => {
    router.reload({ only: ["images"] });
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

  return (
    <StudentLayout>
      <div
        className="relative min-h-screen bg-cover bg-center flex flex-col items-center"
        style={{ backgroundImage: "url('/Img/Dashboard/ImageGallery/BG.png')" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center w-full p-6">
          <div className="flex items-center space-x-2">
            <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded">
              Riz
            </div>
            <span className="text-xl font-bold text-black">Hub</span>
          </div>
          <div className="flex space-x-4">
            <button className="w-12 h-12 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xl">
              🎵
            </button>
            <button className="w-12 h-12 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xl">
              🔊
            </button>
            <button
              onClick={refreshGallery}
              className="w-12 h-12 rounded-full bg-gradient-to-b from-orange-400 to-orange-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xl"
            >
              ↩
            </button>
          </div>
        </div>

        {/* Progress Indicator
        <div className="w-11/12 max-w-6xl bg-white bg-opacity-90 rounded-lg p-4 mb-4 shadow">
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-green-500 h-4 rounded-full" 
                style={{ width: `${(unlockedCount / images.length) * 100}%` }}
              ></div>
            </div>
            <span className="ml-4 text-sm font-medium">
              {unlockedCount} / {images.length} Unlocked
            </span>
          </div>
        </div> */}

        <div className="flex mt-4 w-11/12 max-w-6xl shadow-2xl overflow-hidden bg-[#fdf6e3] border-8 border-[#6b4226] rounded-lg">
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

        {/* Navigation Arrows (left/right pages) */}
        <div className="flex justify-between w-full px-10 mt-8">
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