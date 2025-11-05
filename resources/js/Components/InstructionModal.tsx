import React, { useEffect, useState, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  buttonText?: string;
  bgImage?: string;
}

const InstructionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  buttonText = "Start Challenge",
  bgImage,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const timerRef = useRef<number | null>(null);
  const safeContentRef = useRef<string>(""); // New: Ref to store safe content
  const posRef = useRef<number>(0);

  // Safely get title parts to avoid errors
  const getTitleParts = () => {
    if (!title) return { part1: "Kabanata", part2: "" };
    
    const parts = title.split(":");
    if (parts.length === 1) {
      return { part1: parts[0], part2: "" };
    }
    return { part1: parts[0], part2: parts.slice(1).join(":") };
  };

  useEffect(() => {
    // clear any previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isOpen) {
      // reset state when modal closed
      safeContentRef.current = "";
      posRef.current = 0;
      setDisplayedText("");
      setIsTextComplete(false);
      return;
    }

    // normalize content to avoid "undefined"
    safeContentRef.current = (content ?? "") as string;
    setDisplayedText("");
    posRef.current = 0;
    setIsTextComplete(false);

    // if empty content, mark complete
    if (!safeContentRef.current.trim()) {
      setDisplayedText(safeContentRef.current);
      setIsTextComplete(true);
      return;
    }

    const typeNext = () => {
      const pos = posRef.current;
      const text = safeContentRef.current;
      if (pos < text.length) {
        setDisplayedText((prev) => prev + text.charAt(pos));
        posRef.current = pos + 1;
        timerRef.current = window.setTimeout(typeNext, 30);
      } else {
        setIsTextComplete(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    timerRef.current = window.setTimeout(typeNext, 30);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isOpen, content]);

  const handleButtonClick = () => {
    if (!isTextComplete) {
      // immediately finish typing using safe content
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setDisplayedText(safeContentRef.current ?? "");
      posRef.current = (safeContentRef.current ?? "").length;
      setIsTextComplete(true);
    } else {
      // Close the modal
      onClose();
    }
  };

  // Handle click outside to prevent accidental progression
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      return; // Don't do anything when clicking the background
    }
  };

  const titleParts = getTitleParts();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
      style={
        bgImage
          ? {
              backgroundImage: `url('${bgImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : { backgroundColor: "rgba(0,0,0,0.7)" }
      }
    >
      <img
        src="/Img/Challenge/GuessChar/commander.png"
        alt="Commander"
        className="absolute bottom-0 right-8 w-[380px] md:w-[440px] z-10"
      />

      {/* Title Section */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="bg-orange-600 font-mono text-white font-bold px-4 py-2 text-2xl">
          {titleParts.part1}:
        </div>
        <div className="text-white font-mono font-bold px-2 py-2 text-2xl">
          {titleParts.part2}
        </div>
      </div>

      {/* Clickable text area - Fixed to prevent text cutting */}
      <div 
        onClick={handleButtonClick}
        className="w-full bg-[rgba(52,27,7,0.7)] backdrop-blur-sm absolute bottom-0 p-8 z-9 cursor-pointer hover:bg-[rgba(52,27,7,0.8)] transition-colors"
        style={{ minHeight: "150px" }}
      >
        <div className="max-w-5xl text-white whitespace-pre-line text-md leading-relaxed break-words">
          {displayedText}
          {!isTextComplete && (
            <span className="ml-1 animate-pulse">|</span>
          )}
        </div>
        
        {/* Progress indicator */}
        {isTextComplete && (
          <div className="text-center mt-4 text-yellow-300 font-semibold animate-pulse">
            Click anywhere to continue...
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructionModal;
