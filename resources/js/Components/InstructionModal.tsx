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
          className="absolute bottom-0 right-8 w-[380px] md:w-[440px] z-10"
        />

        <div className="absolute top-4 left-4 flex items-center">
          <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
            {title.split(":")[0]}:
          </div>
          <div className="text-white font-bold px-2 py-2 text-2xl">
            {title.split(":")[1]}
          </div>
        </div>

        {/* Clickable text area */}
        <div 
          onClick={handleButtonClick}
          className="w-full bg-[rgba(52,27,7,0.7)] backdrop-blur-sm absolute bottom-0 p-[50px] z-9 cursor-pointer hover:bg-[rgba(52,27,7,0.8)] transition-colors"
        >
          <div className="max-w-5xl text-white whitespace-pre-line text-md leading-[30px]">
            {displayedText}
          </div>
        </div>
      </div>
    );
};

export default InstructionModal;