import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  buttonText?: string;
}

const InstructionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  buttonText = "Start Challenge",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setDisplayedText("");
    setIndex(0);

    const text = content;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 30); // typing speed (ms)

    return () => clearInterval(interval);
  }, [isOpen, content]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backgroundImage: "url('/Img/Challenge/GuessChar/BG.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src="/Img/Challenge/GuessChar/commander.png"
        alt="Commander"
        className="absolute bottom-0 right-8 w-[280px] md:w-[320px] z-10"
      />

      <div className="absolute top-4 left-4 flex items-center">
        <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
          {title.split(":")[0]}:
        </div>
        <div className="text-white font-bold px-2 py-2 text-2xl">
          {title.split(":")[1]}
        </div>
      </div>

      <div className="w-full bg-[rgba(52,27,7,0.7)] backdrop-blur-sm absolute bottom-0 p-[50px] z-9">
        <div className="max-w-5xl text-white whitespace-pre-line text-md leading-[30px]">
          {displayedText}
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-12 right-[400px] bg-transparent hover:scale-110 transition-transform"
      >
        <svg
          width="44"
          height="33"
          viewBox="0 0 44 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M35.0519 15.9999L8.84689 29.9413L8.75708 2.22865L35.0519 15.9999Z"
            fill="white"
          />
          <line
            x1="41.5"
            y1="2.13869e-10"
            x2="41.5"
            y2="33"
            stroke="white"
            strokeWidth="5"
          />
        </svg>
      </button>
    </div>
  );
};

export default InstructionModal;
