import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import InstructionModal from "../../../Components/InstructionModal";
import PauseModal from "../../../Components/PauseModal";
import StudentLayout from "../../../Layouts/StudentLayout";

interface GuessWordData {
    id: number;
    question: string;
    answer: string;
}

interface GuessWordProps {
    character: {
        id: number;
        c_name: string;
        filename: string;
    };
    questions: GuessWordData[];
    kabanataId: number;
    kabanata_number: number;
    kabanata_title: string;
    music: number;
    sound: number;
}

export default function GuessWord({ character, questions, kabanataId, kabanata_number, kabanata_title, music: initialMusic, sound: initialSound }: GuessWordProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentGuess, setCurrentGuess] = useState<string[]>([]);
    const [showModal, setShowModal] = useState<null | "correct" | "wrong" | "timesup" | "finished">(null);
    const isGameOver = showModal === "timesup" || showModal === "finished";
    const [score, setScore] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [gameActive, setGameActive] = useState(true); 
    const [successMessage, setSuccessMessage] = useState("");
    const [finishMessage, setFinishMessage] = useState("");
    const [showLockTooltip, setShowLockTooltip] = useState(false);
    const [showGiftTooltip, setShowGiftTooltip] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [penalty, setPenalty] = useState<null | number>(null);
    const [answerStatus, setAnswerStatus] = useState<"idle" | "correct" | "wrong">("idle");
    const [hasProcessedCorrect, setHasProcessedCorrect] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [musicVolume, setMusicVolume] = useState(initialMusic);
    const [soundVolume, setSoundVolume] = useState(initialSound);
    const bgMusicRef = useRef<HTMLAudioElement>(null);
    const correctSoundRef = useRef<HTMLAudioElement>(null);
    const wrongSoundRef = useRef<HTMLAudioElement>(null);
    const clickSoundRef = useRef<HTMLAudioElement>(null);
    const backspaceSoundRef = useRef<HTMLAudioElement>(null);
    const finishSoundRef = useRef<HTMLAudioElement>(null);
    const gameOverSoundRef = useRef<HTMLAudioElement>(null);
    

    const totalTime = 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    const currentQ = questions[currentIndex];
    const isCorrect = currentGuess.join("") === currentQ.answer;
    
    const shouldAutoFill = (char: string) => {
        return /[^A-Za-z0-9]/.test(char);
    };

    useEffect(() => {
        const initialGuess = currentQ.answer.split("").map(char => {
            return shouldAutoFill(char) ? char : "";
        });
        setCurrentGuess(initialGuess);
        setHasProcessedCorrect(false); // Reset when question changes
        setAnswerStatus("idle"); // Reset answer status
    }, [currentQ]);

    const togglePause = () => {
        setIsPaused(!isPaused);
        setGameActive(isPaused);
    };

    useEffect(() => {
        if (isPaused && timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [isPaused]);

    useEffect(() => {
        if (bgMusicRef.current) {
        bgMusicRef.current.volume = musicVolume / 100;
        }
        
        [correctSoundRef, wrongSoundRef, clickSoundRef, backspaceSoundRef, finishSoundRef, gameOverSoundRef].forEach(ref => {
        if (ref.current) {
            ref.current.volume = soundVolume / 100;
        }
        });
    }, [musicVolume, soundVolume]);

    useEffect(() => {
        if (instructionIndex >= instructions.length && bgMusicRef.current) {
        bgMusicRef.current.play().catch(error => {
            console.log("Autoplay prevented:", error);
        });
        }
    }, [instructionIndex]);

    const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
        if (soundRef.current && soundVolume > 0) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(error => {
            console.log("Sound play prevented:", error);
        });
        }
    };

    const saveVolumeSettings = (music: number, sound: number) => {
        router.post(route("student.updateSettings"), {
        music,
        sound,
        }, {
        preserveState: true,
        onSuccess: () => {
            // Settings saved successfully
        }
        });
    };

    useEffect(() => {
        if (hasProcessedCorrect) return;

        const allFilled = currentQ.answer.split("").every((char, i) =>
            shouldAutoFill(char) || (currentGuess[i] && currentGuess[i] !== "")
        );

        if (allFilled) {
            checkAnswer();
        }
    }, [currentGuess, hasProcessedCorrect]);

    useEffect(() => {
        if (score === 5 && !isUnlocked) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsUnlocked(true);
                setIsAnimating(false);
            }, 2000);
        }
    }, [score, isUnlocked]);

    useEffect(() => {
        if (instructionIndex < instructions.length) return;
        if (!gameActive || isGameOver) return;
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = +(prev - 0.05).toFixed(2);
                if (newTime <= 0) {
                    clearInterval(timerRef.current!);
                    setShowModal("timesup");
                    setGameActive(false);
                    // Play fail sound when timeout occurs
                    playSound(gameOverSoundRef);
                    return 0;
                }
                return newTime;
            });
        }, 50);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [gameActive, isGameOver, instructionIndex]); 

    useEffect(() => {
        if (!gameActive) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();

            if (key === "BACKSPACE") {
                e.preventDefault();
                removeLetter();
            } else if (key === "ENTER") {
                checkAnswer();
            } else if (/^[A-Z]$/.test(key)) {
                addLetter(key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, currentQ.answer, isCorrect, gameActive]);

    const getFillColor = () => {
        if (timeLeft <= 2) return "red";
        if (timeLeft <= 5) return "yellow";
        return "limegreen";
    };

    const addLetter = (letter: string) => {
        if (!gameActive) return;
        playSound(clickSoundRef);
        let nextEmptyIndex = -1;
        for (let i = 0; i < currentQ.answer.length; i++) {
            if (!currentGuess[i] && !shouldAutoFill(currentQ.answer[i])) {
                nextEmptyIndex = i;
                break;
            }
        }
        
        if (nextEmptyIndex !== -1) {
            const newGuess = [...currentGuess];
            newGuess[nextEmptyIndex] = letter;
            setCurrentGuess(newGuess);
        }
    };

    const removeLetter = () => {
        if (!gameActive) return;
        playSound(backspaceSoundRef);

        let lastFilledIndex = -1;
        for (let i = currentGuess.length - 1; i >= 0; i--) {
            if (currentGuess[i] && !shouldAutoFill(currentQ.answer[i])) {
                lastFilledIndex = i;
                break;
            }
        }
        
        if (lastFilledIndex !== -1) {
            const newGuess = [...currentGuess];
            newGuess[lastFilledIndex] = "";
            setCurrentGuess(newGuess);
        }
    };

    const checkAnswer = () => {
        const allFilled = currentQ.answer.split("").every((char, i) =>
            shouldAutoFill(char) || (currentGuess[i] && currentGuess[i] !== "")
        );
        if (!allFilled) return;

        if (!gameActive || hasProcessedCorrect) return;

        if (isCorrect) {
            setHasProcessedCorrect(true);
            playSound(correctSoundRef);
            setAnswerStatus("correct");
            setGameActive(false);

            setScore((prevScore) => {
                const newScore = prevScore + 1;
                const isGameFinished = currentIndex + 1 >= questions.length;

                router.post(route("guessword.saveProgress"), {
                    character_id: character.id,
                    kabanata_id: kabanataId,
                    question_id: currentQ.id,
                    current_index: currentIndex,
                    completed: isGameFinished,
                    total_score: newScore,
                    is_correct: true,
                });

                if (isGameFinished) {
                    setFinishMessage(finishMessages[newScore] || "GAME FINISHED!");
                    setShowModal("finished");
                    
                    // Play fail sound for 0-2 stars (score 0-2), otherwise play winner sound
                    const stars = calculateStars(newScore);
                    if (stars <= 0) { // 0 stars (score 0-2)
                        playSound(gameOverSoundRef); // fail.mp3
                    } else {
                        playSound(finishSoundRef); // winner.mp3
                    }
                } else {
                    // ✅ move to next question after delay
                    setTimeout(() => {
                        setCurrentIndex((prev) => prev + 1); 
                        setAnswerStatus("idle");
                        setGameActive(true);
                        setHasProcessedCorrect(false);
                    }, 1000);
                }

                return newScore;
            });
        } else {
            setAnswerStatus("wrong");
            playSound(wrongSoundRef);
            
            // Save wrong answer progress
            router.post(route("guessword.saveProgress"), {
                character_id: character.id,
                kabanata_id: kabanataId,
                question_id: currentQ.id,
                current_index: currentIndex,
                completed: false,
                total_score: score,
                is_correct: false,
            });

            setTimeLeft((prev) => Math.max(prev - 5, 0));
            setPenalty(-5);
            
            // FIXED: Move to next question after penalty
            setTimeout(() => {
                setPenalty(null);
                const isGameFinished = currentIndex + 1 >= questions.length;
                
                if (isGameFinished) {
                    setFinishMessage(finishMessages[score] || "GAME FINISHED!");
                    setShowModal("finished");
                    
                    // Play fail sound for 0-2 stars (score 0-2), otherwise play winner sound
                    const stars = calculateStars(score);
                    if (stars <= 0) { // 0 stars (score 0-2)
                        playSound(gameOverSoundRef); // fail.mp3
                    } else {
                        playSound(finishSoundRef); // winner.mp3
                    }
                } else {
                    // Move to next question even if wrong
                    setCurrentIndex((prev) => prev + 1);
                    setAnswerStatus("idle");
                    setGameActive(true);
                }
            }, 1000);
        }
    };

    const fillHeight = (timeLeft / totalTime) * 100;

    const calculateStars = (points: number) => {
        if (points >= 5) return 3;
        if (points === 4) return 2;
        if (points === 3) return 1;
        return 0;
    };

    const handleProceed = () => {
        router.visit(route("challenge.quiz", { kabanataId, kabanata_number, kabanata_title }));
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setCurrentGuess([]);
        setShowModal(null);
        setScore(0);
        setTimeLeft(totalTime);
        setGameActive(true);
        setAnswerStatus("idle");
        setHasProcessedCorrect(false);
        setPenalty(null);
        
        // Clear any timer
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if(isPaused){
            setIsPaused(!isPaused);
        }
        
        // Reset the guess for the first question
        const initialGuess = questions[0].answer.split("").map(char => {
            return shouldAutoFill(char) ? char : "";
        });
        setCurrentGuess(initialGuess);
    };

    useEffect(() => {
        if (bgMusicRef.current) {
        bgMusicRef.current.volume = musicVolume / 100;
        }
        
        [correctSoundRef, wrongSoundRef, clickSoundRef, backspaceSoundRef, finishSoundRef, gameOverSoundRef].forEach(ref => {
        if (ref.current) {
            ref.current.volume = soundVolume / 100;
        }
        });
    }, [musicVolume, soundVolume]);

    const handleVolumeSettingsChange = (music: number, sound: number) => {
        setMusicVolume(music);
        setSoundVolume(sound);
        saveVolumeSettings(music, sound);
    };
    

    const instructions = [
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Ikaw ay inaatasang sagutan ang mga nakapaloob na tanong....`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Ang iyong bayani ay hindi mo na maililigtas kapag ikaw ay maubusan ng oras....`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Ikaw ay mayroon lamang animnapung segundo para sagutan ang limang katanungan....`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Tandaan, ako'y laging nakamasid - saiyo nakasalalay ang kaligtasan ng karaker.`,
            buttonText: "Start Challenge",
        },
    ];

    const keyboardLayout = [
        ["Q","W","E","Z","R","T","Y","U"],
        ["A","S","D","F","H","J","K"],
        ["G","X","C","V","B","N"],
        ["O","P","M","L","I"]
    ];

    const finishMessages: Record<number, string> = {
        0: "TRAIN HARDER!",
        1: "GOOD TRY!",
        2: "YOU DID IT!",
        3: "AMAZING WORK!",
        4: "EXCELLENT JOB!",
        5: "MISSION COMPLETE!"
    };

    const stars = calculateStars(score);

    const handleVolumeChange = (music: number, sound: number) => {
        setMusicVolume(music);
        setSoundVolume(sound);
        saveVolumeSettings(music, sound);
    };


    // Rest of the JSX remains exactly the same...
    return (
        <StudentLayout
            musicVolume={musicVolume}
            soundVolume={soundVolume}
            onVolumeChange={handleVolumeChange}
        >
        {instructionIndex < instructions.length ? (
            <InstructionModal
                isOpen={true}
                onClose={() => {
                    if (instructionIndex < instructions.length - 1) {
                        setInstructionIndex(instructionIndex + 1);
                    } else {
                        setInstructionIndex(instructions.length);
                        localStorage.setItem("guessWordStarted", "true");
                    }
                }}
                title={instructions[instructionIndex].title}
                content={instructions[instructionIndex].content}
                buttonText={instructions[instructionIndex].buttonText}
                bgImage="/Img/Challenge/GuessChar/BG1.png"
            />
        ) : (
            <>
            {/* Audio elements */}
            {/* <audio 
                ref={bgMusicRef} 
                id="bg-music" 
                loop
                src="/audio/guessword-bg-music.mp3" 
            /> */}
            <audio 
                ref={correctSoundRef} 
                src="/Music/plankton-correct.mp3" 
            />
            <audio 
                ref={wrongSoundRef} 
                src="/Music/ksiwhatthehellmusic1.mp3" 
            />
            <audio 
                ref={clickSoundRef} 
                src="/Music/typingsound.mp3" 
            />
            <audio 
                ref={backspaceSoundRef} 
                src="/Music/backspace.wav" 
            />
            <audio 
                ref={finishSoundRef} 
                src="/Music/winner.mp3" 
            />
            <audio 
                ref={gameOverSoundRef} 
                src="/Music/fail.mp3" 
            />
                <div className="absolute top-[140px] lg:top-[140px] right-[485px] lg:right-[485px] flex flex-col items-center gap-[30px]">
                    <div className="relative w-20 h-20 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-black overflow-hidden shadow-lg">
                            <div
                                className="absolute bottom-0 w-full origin-bottom transition-transform duration-300 ease-linear will-change-transform"
                                style={{
                                    height: `${fillHeight}%`,
                                    background: getFillColor(),
                                    backgroundImage: "linear-gradient(to top, rgba(255,255,255,0.3), transparent)",
                                }}
                            />
                            <div
                                className="absolute top-0 left-0 w-full h-full rounded-full"
                                style={{
                                    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), transparent 60%)",
                                }}
                            />
                        </div>
                        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold drop-shadow-md">
                            {Math.ceil(timeLeft)}
                        </span>
                        {penalty && (
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-600 font-bold text-lg animate-bounce">
                                {penalty}s
                            </span>
                        )}
                    </div>
                </div>
                <div
                    className="h-screen flex flex-col items-start justify-end bg-amber-50 p-6 bg-cover bg-center overflow-hidden"
                    style={{
                        backgroundImage: `url('/Img/LandingPage/character/${character.filename}1.png')`,
                    }}
                >
                    {/* Mobile and Tablet Background (hidden on desktop) */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center md:block lg:hidden"
                        style={{
                            backgroundImage: `url('/Img/LandingPage/character/${character.filename}-sw.png')`,
                        }}
                    />
                    
                    {/* Content */}
                    <div className="relative z-10 w-full">
                        {/* Rest of your existing content remains the same */}
                        <div className="flex flex-row justify-between overflow-hidden">
                            <div className="flex flex-row overflow-hidden">
                                <div className="bg-orange-600 text-white font-mono font-bold px-4 py-2 text-2xl overflow-hidden">
                                    Kabanata {kabanata_number}:
                                </div>
                                <div className="text-white font-bold font-mono px-2 py-2 text-2xl overflow-hidden">
                                    {kabanata_title}
                                </div>
                            </div>
                            <button
                                onClick={togglePause}
                                className="absolute top-6 right-4 p-2 bg-amber-700 rounded-full hover:bg-amber-600 transition-colors overflow-hidden"
                                title="Pause Game"
                            >
                                <svg 
                                    className="w-6 h-6 text-white" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                        </div>
                    <div className="flex flex-col lg:ml-16 lg:scale-90 items-center justify-start p-6 overflow-hidden">
                        <div className="relative w-[550px] h-[250px] flex items-center justify-center">
                            <img
                                src="/Img/Challenge/GuessWord/modalBG.png"
                                alt="Wooden Background"
                                className="absolute inset-0 w-full h-full object-contain z-0"
                            />
                            <div className="relative z-10 flex bottom-[10px] flex-col font-mono font-bold items-center text-center px-5">
                                <span className="text-white text-xl mt-3 font-bold">
                                    {currentIndex + 1}/{questions.length}
                                </span>
                                <p className="text-white italic mt-5 text-base font-bold ml-5 mr-5 leading-relaxed">
                                    {currentQ.question}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center font-mono justify-center gap-[2px] mt-8 w-full max-w-6xl">
                            <div
                                className={`flex-1 text-5xl mx-1 text-center font-black 
                                ${answerStatus === "correct" ? "text-green-400" : answerStatus === "wrong" ? "text-red-500 shake" : "text-white"}`}
                            >
                                <div className="inline-flex flex-block  font-mono justify-center gap-x-2 gap-y-0">
                                    {currentQ.answer.split("").map((char, i) => {
                                        if (char === " ") return <span key={i} className="inline-block w-2 mx-2"></span>;
                                        if (shouldAutoFill(char)) {
                                            return <span key={i} className="inline-block w-2 text-center mx-2">{char}</span>;
                                        } else {
                                            return currentGuess[i] ? (
                                                <span key={i} className="inline-block w-2 text-center mx-2">{currentGuess[i]}</span>
                                            ) : (
                                                <span key={i} className="inline-block w-2  font-mono text-center text-white mx-2 text-4xl">_</span>
                                            );
                                        }
                                    })}
                                </div>
                            </div>
                            <div className="flex flex-row gap-3">
                                <button
                                    className="h-12 w-12 flex items-center justify-center 
                                            rounded-[12px] text-white font-bold text-lg
                                            bg-gradient-to-b from-[#FF6A00] to-[#D5703A]
                                            shadow-[4px_6px_0_#B97B4B]
                                            border-2 border-[#E6B07B]
                                            active:translate-y-1 disabled:opacity-50"
                                    onClick={removeLetter}
                                    disabled={!gameActive}
                                >
                                    ⌫
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-3 mt-10">
                            {keyboardLayout.map((row, rowIndex) => (
                                <div key={rowIndex} className="flex gap-3">
                                    {row.map((letter, index) => (
                                        <button
                                            key={index}
                                            className="relative text-white rounded-full h-12 w-12 flex items-center justify-center shadow-md active:translate-y-1 disabled:opacity-50"
                                            onClick={() => addLetter(letter)}
                                            disabled={!gameActive}
                                        >
                                            <img
                                                src="/Img/Challenge/GuessWord/button.png"
                                                alt="Wooden Button"
                                                className="w-full h-auto absolute inset-0 z-0"
                                            />
                                            <span className="z-10 font-bold text-lg">{letter}</span>
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
</div>
                      {showModal && (
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                                <div className="relative w-[600px] bg-transparent">
                                    <img
                                        src="/Img/Challenge/GuessWord/wooden_frame1.png"
                                        alt="Wooden Frame"
                                        className="w-full h-auto"
                                    />
                                    <div className="absolute top-[-30px] ml-3 left-1/2 -translate-x-1/2 flex">
                                    {(showModal === "finished") && (
                                        <>
                                            {[...Array(3)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`flex items-center justify-center
                                                        ${i === 1 ? "w-[170px] h-[170px]" : "w-32 h-32"}
                                                        ${i === 0 || i === 2 ? "translate-y-[50px]" : ""}
                                                    `}
                                                >
                                                    {i < stars ? (
                                                        <img
                                                            src="/Img/Challenge/GuessWord/star-color.png"
                                                            alt="Colored Star"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="/Img/Challenge/GuessWord/star-nocolor.png"
                                                            alt="Empty Star"
                                                            className="w-full h-full object-contain"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                <h2 className="
                                    font-mono
                                    mr-2
                                    ml-2
                                    text-[55px] leading-[72px] 
                                    font-bold 
                                    text-orange-800
                                    text-shadow
                                    z-10"
                                >
                                    {showModal === "correct" && successMessage}
                                    {showModal === "wrong" && "TRY AGAIN"}
                                    {showModal === "timesup" && "TIME'S UP!"}
                                    {showModal === "finished" && (finishMessages[score] || "GAME FINISHED!")}
                                </h2>
                                {showModal === "correct" && (
                                <p className="text-white mr-5 ml-5 font-mono text-lg mb-3">Tama ang sagot!</p>
                                )}
                                {showModal === "wrong" && (
                                <p className="text-red-500 mr-5 ml-5 font-mono text-lg mb-3">Mali! Subukan muli.</p>
                                )}
                                    <p className="text-red-800 mr-5 ml-5 font-mono text-base font-semibold">
                                        {(showModal === "timesup" || showModal === "finished") && (
                                            <>
                                                {stars === 0 && (
                                                    <span>
                                                        Kailangan mong makakuha ng kahit isang bituin upang magpatuloy.
                                                    </span>
                                                )}
                                            </>
                                         )}
                                    </p> 
                                
                                <div className="relative flex items-center justify-center w-32 h-32 z-10">
                                    {showModal === "finished" && (
                                        <>
                                            {/* Background Glow + Fireworks Animation */}
                                            <img
                                                src="/Img/Challenge/GuessWord/fireworks.png"
                                                alt="Fireworks"
                                                className="absolute inset-0 w-full h-full object-cover opacity-70 animate-pulse"
                                            />

                                            {/* Gift Box (Visible when unlocked) */}
                                            <div
                                                className="absolute inset-0 flex items-center justify-center"
                                                onMouseEnter={() => score >= 5 && setShowGiftTooltip(true)}
                                                onMouseLeave={() => setShowGiftTooltip(false)}
                                            >
                                                <img
                                                    src="/Img/Challenge/GuessWord/gift.png"
                                                    alt="Reward Gift"
                                                    className={`w-24 h-24 transition-all duration-500 ${
                                                        score >= 5 ? "scale-110 hover:scale-125 drop-shadow-xl" : "opacity-50"
                                                    }`}
                                                />
                                            </div>

                                {/* Locked Overlay */}
                                {score < 5 ? (
                                <>
                                <div className="absolute inset-0 backdrop-blur-sm rounded-2xl z-20 flex flex-col items-center justify-center transition-all duration-500">
                                <div className="relative flex items-center justify-center">
                                    {/* Soft Glowing Background Pulse */}
                                    <div className="absolute w-20 h-20 rounded-full animate-[pulseGlow_3s_ease-in-out_infinite]"></div>

                                <img
                                src="/Img/Challenge/GuessWord/locked1.png"
                                alt="Locked Icon"
                                className="w-[95px] h-[95px] object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-transform duration-500 hover:scale-110"
                                onMouseEnter={() => setShowLockTooltip(true)}
                                onMouseLeave={() => setShowLockTooltip(false)}
                                />


                                </div>

                                </div>

                                {/* Tooltip */}
                                {showLockTooltip && (
                                <div className="absolute bottom-[-60px] bg-white/90 text-black p-3 rounded-lg z-30 w-64 text-center animate-fadeIn">
                                    <p className="text-sm font-semibold">
                                    Kailangan ng perpektong score (5/5) upang mabuksan ang regalo!
                                    </p>
                                </div>
                                )}
                                </>
                                ) : null}

                                                <>
                                                    {/* No animation for unlocked state - gift is visible without additional animations */}
                                                </>

                                        </>
                                    )}
                                </div>
                            
                                    {showGiftTooltip && isUnlocked && (
                                    <div 
                                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-orange-600 p-4 rounded-xl shadow-2xl z-50 w-45"
                                    style={{ animation: 'none' }}
                                    >
                                            {/* Collected Image Display */}
                                            <div className="flex flex-col items-center">
                                                <img 
                                                src={`/Img/Dashboard/ImageGallery/K${kabanata_number}.png`}
                                                alt={`Kabanata ${kabanata_number} Collected Image`}
                                                className="w-full h-40 object-contain rounded-lg mb-3"
                                                />
                                                <div className="text-center">
                                                    <p className="text-base font-semibold text-white mb-1">
                                                        Kabanata {kabanata_number}: {kabanata_title}
                                                    </p>
                                                    <p className="text-base text-gray-100">
                                                        Larawan na na-kolekta mo!
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Arrow pointing to gift */}
                                            <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-orange-600"></div>
                                        </div>
                                    )}
                                
                                <div className="fixed flex gap-8 bottom-[145px] sm:bottom-[125px] md:bottom-[128px] lg:bottom-[130px]">
                                {/* {showModal === "correct" && (
                                    <>
                                        <button className="rounded-full p-3 relative" onClick={() => router.get(route('challenge'))}>
                                            <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                        </button>
                                        <button
                                            onClick={nextQuestion}
                                            className="rounded-full p-3 relative"
                                        >
                                            <img src="/Img/Challenge/GuessWord/next.png" alt="Next" className="w-[60px] h-[60px]" />
                                        </button>
                                    </>
                                )}

                                {showModal === "wrong" && (
                                    <>
                                    <button className="rounded-full p-3 relative" onClick={() => router.get(route('challenge'))}>
                                        <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                    </button>
                                    <button
                                        onClick={() => {
                                        setShowModal(null);
                                        setGameActive(true);
                                        }}
                                        className="rounded-full p-3 relative"
                                    >
                                        <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
                                    </button>
                                    <button
                                        onClick={nextQuestion}
                                        className="rounded-full p-3 relative"
                                    >
                                        <img src="/Img/Challenge/GuessWord/skip.png" alt="Skip" className="w-[60px] h-[60px]" />
                                    </button>
                                    </>
                                )} */}

                                {(showModal === "timesup" || showModal === "finished") && (
                                    <>
                                            <button className="rounded-full relative z-20" onClick={() => router.get(route('challenge'))}>
                                                <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                            </button>
                                            <button className="rounded-full relative z-20"onClick={handleRestart}>
                                                <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
                                            </button>
                                            {stars > 0 && (
                                                <button className="rounded-full relative z-20"
                                                onClick={handleProceed}>
                                                    <img src="/Img/Challenge/GuessWord/next.png" alt="Next" className="w-[60px] h-[60px]" />
                                                </button>
                                            )}
                                    </>
                                )}
                                </div>
                            </div>
                            </div>
                        </div>
                        )}

                        <style>{`
                            .stroke-text {
                                -webkit-text-stroke: 5px #D35D28;
                            }
                            @keyframes floatUp {
                                0% { opacity: 1; transform: translateY(0) scale(1); }
                                100% { opacity: 0; transform: translateY(-20px) scale(1.2); }
                            }
                            .animate-bounce {
                                animation: floatUp 1s ease forwards;
                            }
                            .shake {
                                animation: shake 0.3s;
                            }
                            @keyframes shake {
                                0% { transform: translateX(0); }
                                25% { transform: translateX(-5px); }
                                50% { transform: translateX(5px); }
                                75% { transform: translateX(-5px); }
                                100% { transform: translateX(0); }
                            }
                        `}</style>
                    </div>
            
                {/* <PauseModal
                    isOpen={isPaused}
                    onResume={togglePause}
                    onRestart={handleRestart}
                    onHome={() => router.get(route('challenge'))}
                    initialMusic={musicVolume}
                    initialSound={soundVolume}
                    onMusicChange={(volume) => {
                    setMusicVolume(volume);
                    saveVolumeSettings(volume, soundVolume);
                    }}
                    onSoundChange={(volume) => {
                    setSoundVolume(volume);
                    saveVolumeSettings(musicVolume, volume);
                    }}
                    onVolumeSettingsChange={handleVolumeSettingsChange}
                /> */}
            </>
        )}
        </StudentLayout>
    );
}