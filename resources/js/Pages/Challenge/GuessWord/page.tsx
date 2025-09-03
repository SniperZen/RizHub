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

        if (currentGuess.length > 0 && currentGuess.every((char, i) => 
            char !== "" || shouldAutoFill(currentQ.answer[i])
        )) {
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
        if (!gameActive || hasProcessedCorrect) return;

        if (isCorrect) {
            playSound(correctSoundRef);
            setHasProcessedCorrect(true);
            setAnswerStatus("correct");
            setGameActive(false);

            setScore((prevScore) => {
                const newScore = prevScore + 1;
                const isGameFinished = currentIndex + 1 >= questions.length;

                router.post(route("guessword.saveProgress"), {
                    character_id: character.id,
                    kabanata_id: kabanataId,
                    question_id: currentQ.id,
                    current_index: currentIndex + 1,
                    completed: isGameFinished,
                    total_score: newScore,
                    is_correct: true,
                });

                if (isGameFinished) {
                    setFinishMessage(finishMessages[newScore] || "GAME FINISHED!");
                    setShowModal("finished");
                    playSound(finishSoundRef);
                } else {
                    // ✅ move to next question
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
            // router.post(route("guessword.saveProgress"), {
            //     character_id: character.id,
            //     kabanata_id: kabanataId,
            //     question_id: currentQ.id,
            //     current_index: currentIndex,
            //     completed: false,
            //     total_score: score,
            //     is_correct: false,
            // });

            setTimeLeft((prev) => Math.max(prev - 5, 0));
            setPenalty(-5);
            setTimeout(() => setPenalty(null), 1000);

            // shake then reset
            setTimeout(() => {
                setAnswerStatus("idle");
                setCurrentGuess(currentQ.answer.split("").map(char => shouldAutoFill(char) ? char : ""));
                setGameActive(true); 
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
            content: `The story begins here... \n\nAng kwento ay nagsisimula dito...`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Something happens... \n\nMay nangyayari...`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `The system warns you... \n\nAng sistema ay nagbababala...`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Get ready for the challenge! \n\nMaghanda sa hamon!`,
            buttonText: "Start Challenge",
        },
    ];

    const keyboardLayout = [
        ["Q","W","E","Z","R","T","Y","U"],
        ["A","S","D","F","H","J","K"],
        ["G","X","C","V","B","N"],
        ["O","P","M","L","I"]
    ];

    // const successMessages = [
    //     "NICE ONE!",
    //     "GOOD JOB!",
    //     "YOU'RE GREAT!",
    //     "WELL DONE!",
    //     "AMAZING!",
    //     "KEEP IT UP!",
    // ];

    const finishMessages: Record<number, string> = {
        0: "TRAIN HARDER!",
        1: "GOOD TRY!",
        2: "YOU DID It!",
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
                bgImage="/Img/Challenge/GuessChar/BG.png"
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
                src="/Music/over.wav" 
            />
                <div className="absolute top-[200px] right-[440px] flex flex-col items-center gap-[30px]">
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
                    className="min-h-screen flex flex-col items-start justify-end bg-amber-50 p-6 bg-cover bg-center"
                    style={{
                    backgroundImage: `url('/Img/LandingPage/character/${character.filename}1.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    }}
                >
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-row">
                            <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
                                KABANATA {kabanata_number}:
                            </div>
                            <div className="text-white font-bold px-2 py-2 text-2xl">
                                {kabanata_title}
                            </div>
                        </div>
                        <button
                            onClick={togglePause}
                            className="absolute top-4 right-4 p-2 bg-amber-700 rounded-full hover:bg-amber-600 transition-colors"
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
                    <div className="flex flex-col items-center justify-start p-6">
                        <div className="relative w-[550px] h-[250px] flex items-center justify-center">
                            <img
                                src="/Img/Challenge/GuessWord/modalBG.png"
                                alt="Wooden Background"
                                className="absolute inset-0 w-full h-full object-contain z-0"
                            />
                            <div className="relative z-10 flex flex-col items-center text-center px-8">
                                <span className="text-white text-lg font-semibold">
                                    {currentIndex + 1}/{questions.length}
                                </span>
                                <p className="text-white italic mt-3 font-bold leading-relaxed">
                                    {currentQ.question}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-[5px] mt-8 w-full max-w-xl">
                            <div
                            className={`flex-1 text-5xl tracking-widest font-mono text-center font-black 
                            ${answerStatus === "correct" ? "text-green-400" : answerStatus === "wrong" ? "text-red-500 shake" : "text-white"}`}
                            >
                                {currentQ.answer.split("").map((char, i) => {
                                    if (char === " ") return "\u00A0";
                                    if (shouldAutoFill(char)) {
                                        return char;
                                    } else {
                                        return currentGuess[i] ? currentGuess[i] : "_";
                                    }
                                }).join(" ")}
                            </div>
                            <div className="flex flex-row gap-3">
                                <button
                                    className="h-12 w-24 flex items-center justify-center 
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

                        {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="relative w-[600px] bg-transparent">
                            <img
                                src="/Img/Challenge/GuessWord/wooden_frame.png"
                                alt="Wooden Frame"
                                className="w-full h-auto"
                            />
                                <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex gap-4">
                                {(showModal === "finished") && (
                                    <>
                                        {[...Array(3)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-center
                                                ${i === 1 ? "w-[70px] h-[70px]" : "w-12 h-12"}
                                                ${i === 0 || i === 2 ? "translate-y-[25px]" : ""}
                                            `}
                                        >
                                            {i < stars ? (
                                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feOffset dy="2" in="SourceAlpha" result="off" />
                                                    <feGaussianBlur stdDeviation="2" in="off" result="blur" />
                                                    <feColorMatrix
                                                    type="matrix"
                                                    values="0 0 0 0 0
                                                            0 0 0 0 0
                                                            0 0 0 0 0
                                                            0 0 0 .35 0"
                                                    in="blur"
                                                    />
                                                    <feMerge>
                                                    <feMergeNode />
                                                    <feMergeNode in="SourceGraphic" />
                                                    </feMerge>
                                                </filter>
                                                <linearGradient id="gold" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="#FFE682" />
                                                    <stop offset="45%" stopColor="#FFC837" />
                                                    <stop offset="100%" stopColor="#FF9F0F" />
                                                </linearGradient>
                                                <radialGradient id="gloss" cx="30%" cy="30%" r="70%">
                                                    <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
                                                    <stop offset="60%" stopColor="rgba(255,255,255,0.0)" />
                                                </radialGradient>
                                                </defs>
                                                <polygon
                                                points="32,5 39,22 58,24 44,37 48,56 32,46 16,56 20,37 6,24 25,22"
                                                fill="url(#gold)"
                                                stroke="#A66300"
                                                strokeWidth="2.5"
                                                strokeLinejoin="round"
                                                filter="url(#ds)"
                                                />
                                                <polygon
                                                points="32,5 39,22 58,24 44,37 48,56 32,46 16,56 20,37 6,24 25,22"
                                                fill="url(#gloss)"
                                                />
                                            </svg>
                                            ) : (
                                            <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                                                <polygon
                                                points="32,5 39,22 58,24 44,37 48,56 32,46 16,56 20,37 6,24 25,22"
                                                fill="none"
                                                stroke="#C7A15A"
                                                strokeWidth="3"
                                                strokeLinejoin="round"
                                                />
                                            </svg>
                                            )}
                                        </div>
                                        ))}
                                    </>
                                )}
                                </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center top-[140px]">
                                <h2 className="font-erica 
                                    text-[58px] leading-[72px] 
                                    font-bold 
                                    text-[#F6D65A] 
                                    stroke-text"
                                >
                                    {showModal === "correct" && successMessage}
                                    {showModal === "wrong" && "TRY AGAIN"}
                                    {showModal === "timesup" && "TIME'S UP!"}
                                    {showModal === "finished" && (finishMessages[score] || "GAME FINISHED!")}
                                </h2>
                                {showModal === "correct" && (
                                <p className="text-white text-lg mb-3">Tama ang sagot!</p>
                                )}
                                {showModal === "wrong" && (
                                <p className="text-red-500 text-lg mb-3">Mali! Subukan muli.</p>
                                )}
                                    <p className="text-red-500 font-semibold">
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
                                
                               <div className="relative flex items-center justify-center w-32 h-32 my-3">
                                    {(showModal === "finished") && (
                                        <>
                                        <img
                                            src="/Img/Challenge/GuessWord/fireworks.png"
                                            alt="Fireworks"
                                            className="absolute inset-0 w-full h-full animate-pulse"
                                        />
                                        <div 
                                            className="absolute z-10 w-24 h-24 m-auto inset-0 flex items-center justify-center"
                                            onMouseEnter={() => score >= 5 && setShowGiftTooltip(true)}
                                            onMouseLeave={() => setShowGiftTooltip(false)}
                                        >
                                            <img
                                                src="/Img/Challenge/GuessWord/gift.png"
                                                alt="Reward Gift"
                                                className="w-full h-full"
                                            />
                                        </div>
                                        {score < 5 ? (
                                            <>
                                                <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg z-20 flex items-center justify-center">
                                                    <svg
                                                        width="64"
                                                        height="64"
                                                        viewBox="0 0 64 64"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-16 h-16"
                                                        onMouseEnter={() => setShowLockTooltip(true)}
                                                        onMouseLeave={() => setShowLockTooltip(false)}
                                                        >
                                                        <defs>
                                                            <pattern id="woodTexture" patternUnits="userSpaceOnUse" width="100" height="20" patternTransform="rotate(30)">
                                                                <rect width="100" height="20" fill="#8B4513" />
                                                                <path d="M0,10 Q20,5 40,10 T80,10 T120,10 T160,10" stroke="#A0522D" strokeWidth="2" fill="none" />
                                                                <path d="M0,15 Q20,10 40,15 T80,15 T120,15 T160,15" stroke="#A0522D" strokeWidth="1" fill="none" />
                                                            </pattern>
                                                            <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                                <stop offset="0%" stopColor="#d4d4d4" />
                                                                <stop offset="50%" stopColor="#f8f8f8" />
                                                                <stop offset="100%" stopColor="#d4d4d4" />
                                                            </linearGradient>
                                                            <filter id="dropshadow" height="130%">
                                                                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                                                                <feOffset dx="2" dy="2" result="offsetblur" />
                                                                <feComponentTransfer>
                                                                    <feFuncA type="linear" slope="0.5" />
                                                                </feComponentTransfer>
                                                                <feMerge> 
                                                                    <feMergeNode />
                                                                    <feMergeNode in="SourceGraphic" />
                                                                </feMerge>
                                                            </filter>
                                                        </defs>
                                                        <rect x="12" y="20" width="40" height="30" rx="5" fill="url(#woodTexture)" filter="url(#dropshadow)" />
                                                        <path
                                                            d="M20,20 C20,10 44,10 44,20"
                                                            stroke="url(#metalGradient)"
                                                            strokeWidth="12"
                                                            fill="none"
                                                            strokeLinecap="round"
                                                        />
                                                        <circle cx="32" cy="35" r="5" fill="#333" />
                                                        <rect x="30" y="35" width="4" height="12" rx="1" fill="#333" />
                                                        <path d="M17,25 Q27,23 32,35 Q37,23 47,25" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                                                    </svg>
                                                </div>
                                                {showLockTooltip && (
                                                    <div className="absolute top-full mt-2 bg-white text-black p-3 rounded-lg shadow-lg z-30 w-64">
                                                        <p className="text-sm font-semibold">
                                                            Kailangan ng perpektong score (5/5) upang mabuksan ang regalo!
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {isAnimating && (
                                                    <div className="absolute inset-0 flex items-center justify-center z-30">
                                                        <circle cx="50%" cy="50%" r="15" stroke="#FFD700" strokeWidth="2" fill="none" strokeDasharray="5,2">
                                                            <animate attributeName="r" from="8" to="20" dur="2s" fill="freeze" />
                                                            <animate attributeName="opacity" from="1" to="0" dur="2s" fill="freeze" />
                                                        </circle>
                                                        <circle cx="50%" cy="50%" r="10" stroke="#FFD700" strokeWidth="2" fill="none">
                                                            <animate attributeName="r" from="5" to="15" dur="2s" fill="freeze" />
                                                            <animate attributeName="opacity" from="1" to="0" dur="2s" fill="freeze" />
                                                        </circle>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        </>
                                    )}
                                </div>
                                
                                {showGiftTooltip && isUnlocked && (
                                    <div className="absolute top-52 mt-2 bg-white text-black p-3 rounded-lg shadow-lg z-30 w-64">
                                        <p className="text-sm font-semibold text-center">
                                            The image gallery for Kabanata {kabanata_number}: {kabanata_title} has been unlocked!
                                            Please complete the course by proceeding to the next challenge.
                                        </p>
                                    </div>
                                )}
                                
                                <div className="flex gap-4 mt-[125px]">
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
                                            <button className="rounded-full p-3 relative" onClick={() => router.get(route('challenge'))}>
                                                <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                            </button>
                                            <button className="rounded-full p-3 relative"onClick={handleRestart}>
                                                <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
                                            </button>
                                            {stars > 0 && (
                                                <button className="rounded-full p-3 relative"
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
                </div>
                <PauseModal
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
                />
            </>
        )}
        </StudentLayout>
    );
}