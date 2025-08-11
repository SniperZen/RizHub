import React, { useEffect, useState } from "react";

interface GuessCharacter {
  id: number;
  c_name: string;
  filename: string;
}

interface Props {
  characters: GuessCharacter[];
}

export default function Page({ characters }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    if (characters.length === 0) return;

    let speed = 150;
    let spins = 0;
    let current = 0;

    // Pick a random target index
    const targetIndex = Math.floor(Math.random() * characters.length);
    // Add a few extra spins before stopping so it feels natural
    const totalSpinsBeforeStop = characters.length * 3 + targetIndex; 

    const spin = () => {
        current = (current + 1) % characters.length;
        setCurrentIndex(current);
        spins++;

        if (spins >= totalSpinsBeforeStop) {
        setIsSpinning(false);
        return;
        }

        if (spins > characters.length * 2) speed += 30; // slow down after 2 rounds

        setTimeout(spin, speed);
    };

    spin();
    }, [characters]);


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
      {/* Title */}
      <div className="absolute top-4 left-4 flex items-center">
        <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
          KABANATA 1:
        </div>
        <div className="text-white font-bold px-2 py-2 text-2xl">
          ISANG SALUSALO
        </div>
      </div>

      {/* Icons */}
      <div className="absolute top-4 right-4 flex gap-4">
        <img src="/Img/UI/music_icon.png" alt="music" className="w-12 h-12" />
        <img src="/Img/UI/sound_icon.png" alt="sound" className="w-12 h-12" />
        <img
          src="/Img/UI/settings_icon.png"
          alt="settings"
          className="w-12 h-12"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <div className="relative flex flex-col items-center">
          {/* Character Display */}
          <div className="flex items-center justify-center w-[1100px] h-[300px]">
            {isSpinning ? (
              <>
                {/* One big background for the spinning section */}
                <img
                  src="/Img/Challenge/GuessChar/ModalBG2.png"
                  alt="modal background"
                  className="absolute w-[1000px] h-auto"
                />
                <div className="flex transition-transform duration-200 ease-out relative mt-[100px]">
                  {[...getVisibleCharacters()]
                    .sort(() => Math.random() - 0.5) // shuffle
                    .map((char, index) => (
                        <div
                        key={char.id}
                        className="text-center flex-shrink-0 flex flex-col items-center"
                        style={{ width: "140px", margin: "0 16px" }}
                        >
                        <img
                            src={`/Img/LandingPage/character/${char.filename}`}
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
                    src={`/Img/LandingPage/character/${characters[currentIndex].filename}`}
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
    </div>
  );
}
