        import React, { useEffect, useState } from "react";
        import { router } from "@inertiajs/react";
        import InstructionModal from "../../../Components/InstructionModal";
        import StudentLayout from "../../../Layouts/StudentLayout";

        interface GuessCharacter {
          id: number;
          c_name: string;
          filename: string;
        }

        interface Props {
          characters: GuessCharacter[];
          kabanata_id: number;
          kabanataHash?: string;
          kabanata_number: number;
          kabanata_title: string;
        }

        export default function Page({ 
          characters, 
          kabanata_id, 
          kabanata_number, 
          kabanata_title,
          kabanataHash,
        }: Props) {
          const [currentIndex, setCurrentIndex] = useState(0);
          const [isSpinning, setIsSpinning] = useState(false); // Start as false
          const [showModal, setShowModal] = useState(true); // Show modal initially

          const modalContent = `Random na pipili ang system ng karakter na ililigtas mo. Siya ay nasa loob ng isang kulungan — tapusin ang hamon para mailigtas, pero kapag nabigo, hindi mo maililigtas ang karakter.`;
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
                  const kabanataParam = (typeof (kabanataHash) !== 'undefined' && kabanataHash) ? kabanataHash : kabanata_id;
                  router.visit(`/challenge/guessword/${finalCharacterId}/${kabanataParam}`);
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
            <StudentLayout>
              <div
                className="relative w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: "url('/Img/Challenge/GuessChar/BG1.png')" }}
              >
                {/* Instruction Modal */}
                <InstructionModal
                  isOpen={showModal}
                  onClose={startSpinning}
                  title={`Kabanata ${kabanata_number}: ${kabanata_title}`}
                  content={modalContent}
                  buttonText="Start Choosing Character"
                />

        {/* Title */}
        <div className="absolute top-4 left-4 flex items-center">
          <div className="bg-orange-600 text-white font-bold font-mono px-4 py-2 text-base sm:text-base md:text-xl lg:text-2xl">
            Kabanata {kabanata_number}:
          </div>
          <div className="text-white font-bold font-mono px-2 py-2 text-base sm:text-base md:text-xl lg:text-2xl">
            {kabanata_title}
          </div>
        </div>


{!showModal && characters.length > 0 && (
  <div className="flex flex-col items-center justify-center h-full gap-8 overflow-hidden">
    <div className="relative flex flex-col items-center">
      {/* Character Display */}
      <div className="flex items-center justify-center w-[1100px] h-[300px]">
        {isSpinning ? (
          <>
            <img
            src="/Img/Challenge/GuessChar/ModalBG.png"
            alt="modal"
            className="absolute w-[370px] h-[450px] lg:w-[600px] mx-auto lg:h-[450px] lg:w-auto block lg:hidden"
            />

            <img
              src="/Img/Challenge/GuessChar/ModalBG2.png"
              alt="modal background"
              className="absolute md:w-[800px] lg:w-[1000px] h-auto hidden lg:block"
            />
            
            {/* Title header positioned at the top of the background */}
            <div className="absolute bottom-[300px] lg:bottom-[296px] left-0 right-6 py-4 z-10">
              <h1 className="text-white text-xl lg:text-3xl font-bold text-center">
                Mangyaring iligtas...
              </h1>
            </div>
            
            <div className="flex transition-transform duration-200 ease-out relative mt-[100px]">
              {[...getVisibleCharacters()]
                .sort(() => Math.random() - 0.5)
                .slice(0, window.innerWidth < 1024 ? 3 : 5) // 3 for mobile/tablet, 5 for desktop
                .map((char, index, array) => {
                  const half = Math.floor(array.length / 2);
                  return (
                    <div
                      key={char.id}
                      className="text-center flex-shrink-0 flex flex-col items-center"
                      style={{ 
                        width: window.innerWidth < 1024 ? "100px" : "140px", 
                        margin: window.innerWidth < 1024 ? "0 4px" : "0 16px" 
                      }}
                    >
                      <img
                        src={`/Img/LandingPage/character/${char.filename}.png`}
                        alt={char.c_name}
                        className={`${window.innerWidth < 1024 ? "w-[125px] h-[130px]" : "w-[125px] h-[120px]"} object-contain ${
                          index === half ? "scale-125" : "opacity-70"
                        } transition-all duration-300`}
                      />
                      <p className="mt-10 lg:mt-4 font-black text-sm lg:text-xl">{char.c_name}</p>
                    </div>
                  );
                })}
            </div>
           </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src="/Img/Challenge/GuessChar/ModalBG.png"
                      alt="modal"
                      className=" object-contain w-[370px] h-[450px] lg:w-[600px] mx-auto lg:h-[450px] lg:w-auto"
                    />
                      {/* Title header positioned at the top of the background */}
                      <div className="absolute bottom-[190px] lg:bottom-[270px] left-0 right-6 py-4 z-10">
                        <h1 className="text-white text-xl lg:text-3xl font-bold text-center">
                          Ang isang ito!
                        </h1>
                      </div>
                    <div className="flex flex-col items-center justify-center -mt-[275px] lg:-mt-[300px]">
                      <img
                        src={`/Img/LandingPage/character/${characters[currentIndex].filename}.png`}
                        alt={characters[currentIndex].c_name}
                        className="w-[125px] h-[145px] lg:w-40 lg:h-48 object-contain drop-shadow-lg"
                      />
                      <p className="lg:mt-4 font-black text-lg lg:text-2xl">
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
    </StudentLayout>
  );
}