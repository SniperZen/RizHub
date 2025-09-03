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
  const [index, setIndex] = useState(0);
  const [isTextComplete, setIsTextComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setDisplayedText("");
    setIndex(0);
    setIsTextComplete(false);

    const text = content;
    let i = 0;
    
    intervalRef.current = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      setIndex(i);
      
      if (i >= text.length) {
        setIsTextComplete(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 30);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, content]);

  const handleButtonClick = () => {
    if (!isTextComplete) {
      // Complete the text immediately
      setDisplayedText(content);
      setIsTextComplete(true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      // Close the modal
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
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
        onClick={handleButtonClick}
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
            y1="0"
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