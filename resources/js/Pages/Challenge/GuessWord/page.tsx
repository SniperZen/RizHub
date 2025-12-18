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
    const [isPaused, setIsPaused] = useState(false);
    const [musicVolume, setMusicVolume] = useState(initialMusic);
    const [soundVolume, setSoundVolume] = useState(initialSound);
    
    // Audio refs
    const bgMusicRef = useRef<HTMLAudioElement>(null);
    const correctSoundRef = useRef<HTMLAudioElement>(null);
    const wrongSoundRef = useRef<HTMLAudioElement>(null);
    const clickSoundRef = useRef<HTMLAudioElement>(null);
    const backspaceSoundRef = useRef<HTMLAudioElement>(null);
    const finishSoundRef = useRef<HTMLAudioElement>(null);
    const gameOverSoundRef = useRef<HTMLAudioElement>(null);
    
    // Critical refs to prevent double execution
    const isProcessingRef = useRef(false);
    const lastAutoCheckRef = useRef(0);
    const hasAnsweredRef = useRef(false);
    
    // Add this ref to track initial questions and prevent unwanted changes
    const initialQuestionsRef = useRef<GuessWordData[]>(questions);

    const totalTime = 60;
    const [timeLeft, setTimeLeft] = useState(totalTime);

    // FIXED: Use initialQuestionsRef to prevent stale references and unwanted changes
    const currentQ = initialQuestionsRef.current[currentIndex];
    
    const shouldAutoFill = (char: string) => {
        return /[^A-Za-z0-9]/.test(char);
    };

    // Initialize guess for current question - FIXED VERSION
    useEffect(() => {
        // Add bounds checking
        if (currentIndex >= initialQuestionsRef.current.length) {
            console.log(`🚫 Current index ${currentIndex} out of bounds`);
            return;
        }

        const question = initialQuestionsRef.current[currentIndex];
        
        const initialGuess = question.answer.split("").map(char => {
            return shouldAutoFill(char) ? char : "";
        });
        setCurrentGuess(initialGuess);
        setAnswerStatus("idle");
        isProcessingRef.current = false;
        hasAnsweredRef.current = false;
        
        console.log(`Initialized question ${currentIndex}: ${question.question}`);
        console.log(`Question ID: ${question.id}, Total questions: ${initialQuestionsRef.current.length}`);
    }, [currentIndex]);

    const togglePause = () => {
        setIsPaused(!isPaused);
        setGameActive(isPaused);
    };

    useEffect(() => {
        if (isPaused && timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [isPaused]);

    // Audio volume management
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
        });
    };

    // FIXED AUTO-CHECK: More conservative approach
    useEffect(() => {
        if (isProcessingRef.current || hasAnsweredRef.current || answerStatus !== "idle" || !gameActive) {
            return;
        }

        // Add bounds checking
        if (currentIndex >= initialQuestionsRef.current.length) {
            return;
        }

        const currentQ = initialQuestionsRef.current[currentIndex];

        // Don't auto-check if we just reset the guess (all empty except auto-fill chars)
        const isEmptyGuess = currentGuess.every((char, i) => 
            shouldAutoFill(currentQ.answer[i]) || char === ""
        );
        
        if (isEmptyGuess) {
            return;
        }

        const allFilled = currentQ.answer.split("").every((char, i) =>
            shouldAutoFill(char) || (currentGuess[i] && currentGuess[i] !== "")
        );

        if (allFilled) {
            const now = Date.now();
            if (now - lastAutoCheckRef.current < 1500) {
                return;
            }
            lastAutoCheckRef.current = now;

            console.log(`Auto-check triggered for question ${currentIndex}`);
            
            const timer = setTimeout(() => {
                if (gameActive && !isProcessingRef.current && !hasAnsweredRef.current && answerStatus === "idle") {
                    checkAnswer("auto");
                }
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [currentGuess, answerStatus, gameActive, currentIndex]);

    // Timer effect
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

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

    // Keyboard event handler
    useEffect(() => {
        if (!gameActive || isProcessingRef.current || hasAnsweredRef.current) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();

            if (key === "BACKSPACE") {
                e.preventDefault();
                removeLetter();
            } else if (key === "ENTER") {
                e.preventDefault();
                if (!isProcessingRef.current && !hasAnsweredRef.current && gameActive) {
                    checkAnswer("manual");
                }
            } else if (/^[A-Z]$/.test(key)) {
                addLetter(key);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentGuess, currentQ, gameActive, isProcessingRef.current, hasAnsweredRef.current]);

    const getFillColor = () => {
        if (timeLeft <= 2) return "red";
        if (timeLeft <= 5) return "yellow";
        return "limegreen";
    };

    const addLetter = (letter: string) => {
        if (!gameActive || hasAnsweredRef.current) return;
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
        if (!gameActive || hasAnsweredRef.current) return;
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

const checkAnswer = async (source = "manual") => {
    console.log(`=== CHECK ANSWER CALLED ===`);
    console.log(`Source: ${source}, Current Index: ${currentIndex}, Processing: ${isProcessingRef.current}, Answered: ${hasAnsweredRef.current}`);
    
    // Add bounds checking
    if (currentIndex >= initialQuestionsRef.current.length) {
        console.log(`🚫 BLOCKED - Current index out of bounds`);
        return;
    }

    const currentQ = initialQuestionsRef.current[currentIndex];
    console.log(`Current Question: ${currentQ.question}, Question ID: ${currentQ.id}`);

    // Multiple protection layers
    if (isProcessingRef.current || hasAnsweredRef.current || !gameActive) {
        console.log(`🚫 BLOCKED - Already processing or answered`);
        return;
    }

    const allFilled = currentQ.answer.split("").every((char, i) =>
        shouldAutoFill(char) || (currentGuess[i] && currentGuess[i] !== "")
    );
    
    if (!allFilled) {
        console.log(`🚫 BLOCKED - Not all filled`);
        return;
    }

    // Set ALL processing flags IMMEDIATELY
    isProcessingRef.current = true;
    hasAnsweredRef.current = true;
    setGameActive(false);

    const userAnswer = currentGuess.join("");
    const isAnswerCorrect = userAnswer === currentQ.answer;

    console.log(`User answer: "${userAnswer}", Correct answer: "${currentQ.answer}", Is correct: ${isAnswerCorrect}`);

    try {
        if (isAnswerCorrect) {
            // CORRECT ANSWER - Move to next question
            console.log(`✅ CORRECT ANSWER - Processing...`);
            playSound(correctSoundRef);
            setAnswerStatus("correct");

            const newScore = score + 1;
            const isGameFinished = currentIndex + 1 >= initialQuestionsRef.current.length;

            console.log(`New score: ${newScore}, Game finished: ${isGameFinished}`);

            // Save progress
            await router.post(route("guessword.saveProgress"), {
                character_id: character.id,
                kabanata_id: kabanataId,
                question_id: currentQ.id,
                current_index: currentIndex,
                completed: isGameFinished,
                total_score: newScore,
                is_correct: true,
            }, {
                preserveState: true,
                preserveScroll: true,
            });

            if (isGameFinished) {
                // GAME FINISHED
                console.log(`🎮 GAME FINISHED - Showing finished modal`);
                setFinishMessage(finishMessages[newScore] || "GAME FINISHED!");
                setShowModal("finished");
                setScore(newScore);
                
                const stars = calculateStars(newScore);
                if (stars <= 0) {
                    playSound(gameOverSoundRef);
                } else {
                    playSound(finishSoundRef);
                }
            } else {
                // MOVE TO NEXT QUESTION after delay
                console.log(`➡️ MOVING to next question from ${currentIndex} to ${currentIndex + 1}`);
                setTimeout(() => {
                    setCurrentIndex(prev => {
                        const newIndex = prev + 1;
                        console.log(`🔀 SETTING new index: ${newIndex}`);
                        return newIndex;
                    });
                    setScore(newScore);
                    setAnswerStatus("idle");
                    setGameActive(true);
                    isProcessingRef.current = false;
                    hasAnsweredRef.current = false;
                    lastAutoCheckRef.current = 0;
                    console.log(`🔄 RESET flags for next question`);
                }, 1500);
            }
        } else {
            // WRONG ANSWER - Move to NEXT question (CHANGED)
            console.log(`❌ WRONG ANSWER - Moving to next question from ${currentIndex}`);
            console.log(`Current question ID: ${currentQ.id}, Question: ${currentQ.question}`);
            setAnswerStatus("wrong");
            playSound(wrongSoundRef);
            
            // Save progress for wrong attempt
            await router.post(route("guessword.saveProgress"), {
                character_id: character.id,
                kabanata_id: kabanataId,
                question_id: currentQ.id,
                current_index: currentIndex + 1, // Move to next index (CHANGED)
                completed: currentIndex + 1 >= initialQuestionsRef.current.length, // Check if next is last (CHANGED)
                total_score: score, // Don't increment score
                is_correct: false,
            }, {
                preserveState: true,
                preserveScroll: true,
            });

            // Apply penalty and MOVE to next question (CHANGED)
            setTimeLeft((prev) => Math.max(prev - 5, 0));
            setPenalty(-5);

            // Automatically clear penalty after 3 seconds
            setTimeout(() => {
                setPenalty(null);
            }, 1500);

            const isGameFinished = currentIndex + 1 >= initialQuestionsRef.current.length;

            if (isGameFinished) {
                // GAME FINISHED after wrong answer (CHANGED)
                console.log(`🎮 GAME FINISHED after wrong answer - Showing finished modal`);
                setFinishMessage(finishMessages[score] || "GAME FINISHED!");
                setShowModal("finished");
                
                const stars = calculateStars(score);
                if (stars <= 0) {
                    playSound(gameOverSoundRef);
                } else {
                    playSound(finishSoundRef);
                }
            } else {
                // MOVE TO NEXT QUESTION after delay (CHANGED)
                console.log(`➡️ MOVING to next question from ${currentIndex} to ${currentIndex + 1} after wrong answer`);
                setTimeout(() => {
                    setCurrentIndex(prev => {
                        const newIndex = prev + 1;
                        console.log(`🔀 SETTING new index after wrong: ${newIndex}`);
                        return newIndex;
                    });
                    setAnswerStatus("idle");
                    setGameActive(true);
                    isProcessingRef.current = false;
                    hasAnsweredRef.current = false;
                    lastAutoCheckRef.current = 0;
                    console.log(`🔄 RESET flags for next question after wrong answer`);
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Error in checkAnswer:', error);
        // Reset flags on error - DON'T move to next question
        isProcessingRef.current = false;
        hasAnsweredRef.current = false;
        setGameActive(true);
        setAnswerStatus("idle");
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
        console.log(`🔄 RESTARTING GAME`);
        setCurrentIndex(0);
        setCurrentGuess([]);
        setShowModal(null);
        setScore(0);
        setTimeLeft(totalTime);
        setGameActive(true);
        setAnswerStatus("idle");
        setPenalty(null);
        isProcessingRef.current = false;
        hasAnsweredRef.current = false;
        lastAutoCheckRef.current = 0;
        
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if(isPaused){
            setIsPaused(!isPaused);
        }
        
        const initialGuess = initialQuestionsRef.current[0].answer.split("").map(char => {
            return shouldAutoFill(char) ? char : "";
        });
        setCurrentGuess(initialGuess);
    };

    // Gift unlock effect
    useEffect(() => {
        if (score === 5 && !isUnlocked) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsUnlocked(true);
                setIsAnimating(false);
            }, 2000);
        }
    }, [score, isUnlocked]);

    const handleVolumeChange = (music: number, sound: number) => {
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
        0: "PAGBUTIHIN PA!",
        1: "SALAMAT SA PAGSUSUBOK!",
        2: "YEHEY! NAKAYA MO!",
        3: "ANG GALING GALING!",
        4: "NAGAWA MO!",
        5: "TAGUMPAY SA MISYON!"
    };

    const stars = calculateStars(score);

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
                    <audio ref={correctSoundRef} src="/Music/plankton-correct.mp3" />
                    <audio ref={wrongSoundRef} src="/Music/ksiwhatthehellmusic1.mp3" />
                    <audio ref={clickSoundRef} src="/Music/typingsound.mp3" />
                    <audio ref={backspaceSoundRef} src="/Music/backspace.wav" />
                    <audio ref={finishSoundRef} src="/Music/winner.mp3" />
                    <audio ref={gameOverSoundRef} src="/Music/fail.mp3" />

                    {/* Timer Display */}
                    <div className="fixed top-[220px] sm:top-[220px] md:top-[220px] left-1/2 transform -translate-x-1/2 lg:top-[140px] lg:right-[545px] lg:left-auto lg:transform-none flex flex-col items-center gap-[30px] z-50">
                        <div className="relative w-12 h-12 lg:w-20 lg:h-20 mb-4">
                            <div className="absolute inset-0 rounded-full border-2 lg:border-4 border-black overflow-hidden shadow-lg">
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
                            <span className="absolute inset-0 flex items-center justify-center text-sm lg:text-xl font-bold drop-shadow-md text-white">
                                {Math.ceil(timeLeft)}
                            </span>
                            {penalty && (
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-red-600 font-bold text-lg animate-bounce">
                                    {penalty}s
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Main Game Content */}
                    <div
                        className="h-screen flex flex-col items-start justify-end bg-amber-50 p-6 bg-cover bg-center overflow-hidden"
                        style={{
                            backgroundImage: `url('/Img/LandingPage/character/${character.filename}1.png')`,
                        }}
                    >
                        {/* Mobile and Tablet Background */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center md:block lg:hidden"
                            style={{
                                backgroundImage: `url('/Img/LandingPage/character/${character.filename}-sw.png')`,
                            }}
                        />
                        
                        {/* Content */}
                        <div className=" relative z-10 w-full">
                            <div className=" fixed flex flex-row justify-between overflow-hidden top-5">
                                <div className="flex flex-row overflow-hidden">
                                    <div className="bg-orange-600 text-white font-mono font-bold px-2 md:px-2 lg:px-4 md:py-2 lg:py-2 py-2 text-xl md:text-xl lg:text-2xl overflow-hidden">
                                        Kabanata {kabanata_number}:
                                    </div>
                                    <div className="text-white font-bold font-mono px-2 md:px-2 lg:px-2 py-2 md:py-2 lg:py-2 text-xl md:text-xl lg:text-2xl overflow-hidden">
                                        {kabanata_title}
                                    </div>
                                </div>
                                <button
                                    onClick={togglePause}
                                    className="fixed top-6 right-10 p-2 bg-amber-700 rounded-full hover:bg-amber-600 transition-colors overflow-hidden"
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

                        <div className="fixed flex flex-col lg:ml-16 bottom-0 items-center justify-center p-6 overflow-hidden scale-75 md:scale-75 lg:scale-90 z-100 lg:ml-16 lg:justify-start mb-[-90px] sm:mb-[-120px] md:mb-[-100px] lg:mt-10 lg:mb-10 left-1/2 transform -translate-x-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 md:left-1/2 md:transform md:-translate-x-1/2 lg:left-auto lg:transform-none">
                            {/* Question Display */}
                            <div className="relative w-[550px] md:w-[550px] lg:w-[550px] h-[250px] md:h-[250px] lg:h-[250px] mb-[350px] sm:mb-[350px] md:mb-[360px] lg:mb-[5px] flex items-center justify-center">
                                <img
                                    src="/Img/Challenge/GuessWord/modalBG.png"
                                    alt="Wooden Background"
                                    className="absolute inset-0 w-full h-full object-contain z-0"
                                />
                                <div className="relative z-10 flex bottom-[10px] flex-col font-mono font-bold items-center text-center px-5">
                                    <span className="text-white text-xl mt-3 font-bold">
                                        {currentIndex + 1}/{initialQuestionsRef.current.length}
                                    </span>
                                    <p className="text-white mt-5 text-base font-mono ml-5 mr-5 leading-relaxed">
                                        {currentQ.question}
                                    </p>
                                </div>
                            </div>

                            {/* Answer Input */}
                            <div className="flex items-center font-mono justify-center gap-[2px] mt-3 lg:mt-8 md:mt-3 w-full max-w-6xl">
                                <div
                                    className={`flex-1 text-5xl mx-1 text-center font-black 
                                    ${answerStatus === "correct" ? "text-green-400" : answerStatus === "wrong" ? "text-red-500 shake" : "text-white"}`}
                                >
                                    <div className="inline-flex flex-block font-mono justify-center gap-x-2 gap-y-0">
                                        {currentQ.answer.split("").map((char, i) => {
                                            if (char === " ") return <span key={i} className="inline-block w-2 mx-2"></span>;
                                            if (shouldAutoFill(char)) {
                                                return <span key={i} className="inline-block w-2 text-center mx-2">{char}</span>;
                                            } else {
                                                return currentGuess[i] ? (
                                                    <span key={i} className="inline-block w-2 text-center mx-2">{currentGuess[i]}</span>
                                                ) : (
                                                    <span key={i} className="inline-block w-2 font-mono text-center text-white mx-2 text-4xl">_</span>
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
                                        disabled={!gameActive || hasAnsweredRef.current}
                                    >
                                        ⌫
                                    </button>
                                </div>
                            </div>

                            {/* Keyboard */}
                            <div className="flex flex-col items-center gap-3 mt-8">
                                {keyboardLayout.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex gap-3">
                                        {row.map((letter, index) => (
                                            <button
                                                key={index}
                                                className="relative text-white rounded-full h-12 w-12 flex items-center justify-center shadow-md active:translate-y-1 disabled:opacity-50"
                                                onClick={() => addLetter(letter)}
                                                disabled={!gameActive || hasAnsweredRef.current}
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

                        {/* Result Modal */}
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

                                        {/* Action Buttons */}
                                        <div className="fixed flex gap-8 bottom-[105px]">
                                            {(showModal === "timesup" || showModal === "finished") && (
                                                <>
                                                    <button className="rounded-full relative z-20" onClick={() => router.get(route('challenge'))}>
                                                        <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                                    </button>
                                                    <button className="rounded-full relative z-20" onClick={handleRestart}>
                                                        <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
                                                    </button>
                                                    {stars > 0 && (
                                                        <button className="rounded-full relative z-20" onClick={handleProceed}>
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
                </>
            )}
        </StudentLayout>
    );
}