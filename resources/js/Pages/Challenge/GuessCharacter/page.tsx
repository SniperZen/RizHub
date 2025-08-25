import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import InstructionModal from "../../../Components/InstructionModal";

interface GuessCharacter {
  id: number;
  c_name: string;
  filename: string;
}

interface Props {
  characters: GuessCharacter[];
  kabanata_id: number;
  kabanata_number: number;
  kabanata_title: string;
}

export default function Page({ 
  characters, 
  kabanata_id, 
  kabanata_number, 
  kabanata_title 
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false); // Start as false
  const [showModal, setShowModal] = useState(true); // Show modal initially

  const modalContent = `The system will randomly pick one character for you to protect in the upcoming challenge. They will be trapped inside a failing elevator — pass the challenge to save them before the doors close, but fail, and the elevator will drop with your character inside.

*Ang sistema ay pipili nang sapalaran ng isang karakter na lyong poprotektahan sa paparating na hamon. Siya ay makukulong sa isang bumabagsak na elevator — ipasa ang hamon upang mailigtas siya bago magsara ang pinto, ngunit kung mahigo ka, babagsak ang elevator kasama ang lyong karakter sa loob.*`;

  const startSpinning = () => {
    setShowModal(false);
    setIsSpinning(true);
    
    // Start the spinning animation after modal is closed
    if (characters.length === 0) return;

    let speed = 120;
    let spins = 0;
    let current = 0;

    const targetIndex = Math.floor(Math.random() * characters.length);
    const totalSpinsBeforeStop = characters.length * 3 + targetIndex;

    const spin = () => {
      current = (current + 1) % characters.length;
      setCurrentIndex(current);
      spins++;

      if (spins >= totalSpinsBeforeStop) {
        setIsSpinning(false);

        // ⏳ After 3 seconds, redirect
        setTimeout(() => {
          const finalCharacterId = characters[current].id;
          window.location.href = `/challenge/guessword/${finalCharacterId}/${kabanata_id}`;
        }, 3000);

        return;
      }

      if (spins > characters.length * 2) speed += 30;

      setTimeout(spin, speed);
    };

    spin();
  };

  const visibleCount = 5;
  const half = Math.floor(visibleCount / 2);

  const getVisibleCharacters = () => {
    const result: GuessCharacter[] = [];
    const total = characters.length;
    for (let i = -half; i <= half; i++) {
      const idx = (currentIndex + i + total) % total;
      result.push(characters[idx]);
    }
    return result;
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/Img/Challenge/GuessChar/BG.png')" }}
    >
      {/* Instruction Modal */}
      <InstructionModal
        isOpen={showModal}
        onClose={startSpinning}
        title={`KABANATA ${kabanata_number}: ${kabanata_title}`}
        content={modalContent}
        buttonText="Start Choosing Character"
      />

      {/* Title */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
          KABANATA {kabanata_number}:
        </div>
        <div className="text-white font-bold px-2 py-2 text-2xl">
          {kabanata_title}
        </div>
      </div>

      {/* Icons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <img src="/Img/UI/music_icon.png" alt="music" className="w-12 h-12" />
        <img src="/Img/UI/sound_icon.png" alt="sound" className="w-12 h-12" />
        <img src="/Img/UI/settings_icon.png" alt="settings" className="w-12 h-12" />
      </div>

      {/* Main Content - Only show when not in modal and characters exist */}
      {!showModal && characters.length > 0 && (
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <div className="relative flex flex-col items-center">
            {/* Character Display */}
            <div className="flex items-center justify-center w-[1100px] h-[300px]">
              {isSpinning ? (
                <>
                  <img
                    src="/Img/Challenge/GuessChar/ModalBG2.png"
                    alt="modal background"
                    className="absolute w-[1000px] h-auto"
                  />
                  <div className="flex transition-transform duration-200 ease-out relative mt-[100px]">
                    {[...getVisibleCharacters()]
                      .sort(() => Math.random() - 0.5)
                      .map((char, index) => (
                        <div
                          key={char.id}
                          className="text-center flex-shrink-0 flex flex-col items-center"
                          style={{ width: "140px", margin: "0 16px" }}
                        >
                          <img
                            src={`/Img/LandingPage/character/${char.filename}.png`}
                            alt={char.c_name}
                            className={`w-28 h-36 object-contain ${
                              index === half ? "scale-125" : "opacity-70"
                            } transition-all duration-300`}
                          />
                          <p className="mt-2 font-bold text-black text-2xl">{char.c_name}</p>
                        </div>
                      ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="/Img/Challenge/GuessChar/ModalBG.png"
                    alt="modal"
                    className="w-[550px]"
                  />
                  <div className="flex flex-col items-center justify-center -mt-[300px]">
                    <img
                      src={`/Img/LandingPage/character/${characters[currentIndex].filename}.png`}
                      alt={characters[currentIndex].c_name}
                      className="w-40 h-48 object-contain drop-shadow-lg"
                    />
                    <p className="mt-4 font-black text-3xl">
                      {characters[currentIndex].c_name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}