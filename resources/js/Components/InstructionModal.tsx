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
  const safeContentRef = useRef<string>("");
  const posRef = useRef<number>(0);

  // Split title for formatting
  const getTitleParts = () => {
    if (!title) return { part1: "Kabanata", part2: "" };
    const parts = title.split(":");
    return { part1: parts[0], part2: parts.slice(1).join(":") };
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!isOpen) {
      safeContentRef.current = "";
      posRef.current = 0;
      setDisplayedText("");
      setIsTextComplete(false);
      return;
    }

    safeContentRef.current = (content ?? "") as string;
    setDisplayedText("");
    posRef.current = 0;
    setIsTextComplete(false);

    if (!safeContentRef.current.trim()) {
      setDisplayedText(safeContentRef.current);
      setIsTextComplete(true);
      return;
    }

    const typeNext = () => {
      const text = safeContentRef.current;
      const pos = posRef.current;
      if (pos < text.length) {
        setDisplayedText((prev) => prev + text.charAt(pos));
        posRef.current = pos + 1;
        timerRef.current = window.setTimeout(typeNext, 25);
      } else {
        setIsTextComplete(true);
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      }
    };

    timerRef.current = window.setTimeout(typeNext, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen, content]);

  const handleButtonClick = () => {
    if (!isTextComplete) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setDisplayedText(safeContentRef.current);
      posRef.current = (safeContentRef.current ?? "").length;
      setIsTextComplete(true);
    } else {
      onClose();
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return;
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
        className="absolute bottom-0 right-8 w-[380px] md:w-[440px] z-10 hidden xl:block"
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

      {/* Smooth Typing Text */}
      <div
        onClick={handleButtonClick}
        className="w-full bg-[rgba(52,27,7,0.7)] backdrop-blur-sm absolute bottom-0 p-8 z-9 cursor-pointer hover:bg-[rgba(52,27,7,0.8)] transition-colors"
        style={{ minHeight: "150px" }}
      >
        <div
          className="max-w-5xl text-white whitespace-pre-line text-md leading-relaxed break-words"
          style={{
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          {displayedText.split("").map((char, i) => (
            <span
              key={i}
              style={{
                opacity: 0,
                animation: `fadeIn 0.10s forwards`,
                animationDelay: `${i * 0.0}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>

        {/* Only shows after animation completes */}
        {isTextComplete && (
          <div
            className="text-center mt-4 text-orange-300 font-semibold animate-pulse"
            style={{
              opacity: isTextComplete ? 1 : 0,
              transition: "opacity 0.5s ease-in",
            }}
          >
            Pindutin para magpatuloy...
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InstructionModal;