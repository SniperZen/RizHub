import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import InstructionModal from '../../../Components/InstructionModal';

interface QuizData {
    id: number;
    kabanata_id: number;
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    correct_answer: string;
}

interface QuizProps {
    kabanataId: number;
    kabanata_number: number;
    kabanata_title: string;
    quizzes: QuizData[];
}

export default function Quiz({ kabanataId, kabanata_number, kabanata_title, quizzes }: QuizProps) {
    const [selectedQuizzes, setSelectedQuizzes] = useState<QuizData[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [lives, setLives] = useState(3);
    const [lostHearts, setLostHearts] = useState<number[]>([]);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [showLockTooltip, setShowLockTooltip] = useState(false);
    const [showGiftTooltip, setShowGiftTooltip] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Instruction modals content
    const instructions = [
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Magaling! Ikaw ay nagtagumpay sa unang pagsubok.`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Ngayon, tingnan natin kung malalagpasan mo ang huling pagsubok...`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Sa pagkakataon na ito, kailangan mong makakuha ng perpektong marka sa 10 tanong para mabuksan mo ang susunod na hamon.`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Handa ka na ba? May tatlong beses na pagkakataon ka lamang para makuha ang perpektong sagot sa 10 tanong.`,
            buttonText: "Start Quiz",
        }
    ];

    // Select 10 random quizzes from the list
    useEffect(() => {
        if (quizzes.length > 0) {
            const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(10, shuffled.length));
            setSelectedQuizzes(selected);
        }
    }, [quizzes]);

    // Handle unlock animation when score reaches 10 (perfect score)
    useEffect(() => {
        if (score === 10 && !isUnlocked) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsUnlocked(true);
                setIsAnimating(false);
            }, 2000);
        }
    }, [score, isUnlocked]);

    const currentQuiz = selectedQuizzes[currentQuizIndex];

    const handleDragStart = (e: React.DragEvent, answer: string) => {
        e.dataTransfer.setData("answer", answer);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const answer = e.dataTransfer.getData("answer");
        setSelectedAnswer(answer);
        
        // Auto-submit when an answer is dropped
        setTimeout(() => {
            checkAnswer(answer);
        }, 100);
    };

    const checkAnswer = (answer: string) => {
        if (currentQuiz) {
            const correct =
                (answer === 'A' && currentQuiz.correct_answer === 'A') ||
                (answer === 'B' && currentQuiz.correct_answer === 'B') ||
                (answer === 'C' && currentQuiz.correct_answer === 'C');
            
            setIsCorrect(correct);
            setShowResult(true);

            const newScore = correct ? score + 1 : score;
            setScore(newScore);

            let newLives = lives;

            if (!correct) {
                newLives = lives - 1;
                setLives(newLives);
                setLostHearts([...lostHearts, 3 - newLives]);
            }

            const isLastQuestion = currentQuizIndex + 1 >= selectedQuizzes.length;
            const perfectScore = newScore === selectedQuizzes.length;

            if (newLives <= 0) {
                setCompleted(true);
                return;
            }

            if (isLastQuestion && perfectScore) {
                // Save progress only when achieving a perfect score
                router.post(route('quiz.saveProgress'), {
                    kabanata_id: kabanataId,
                    quiz_id: currentQuiz.id,
                    selected_answer: answer,
                    score: newScore,
                    question_number: currentQuizIndex + 1,
                    total_questions: selectedQuizzes.length,
                    completed: true,
                    lives_remaining: newLives,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onError: (errors) => {
                        console.error('Failed to save progress:', errors);
                    },
                    onSuccess: () => {
                        console.log('Progress saved successfully');
                        setCompleted(true);
                    }
                });
            }
        }
    };

    const nextQuestion = () => {
        if (lives <= 0) {
            setCompleted(true);
            return;
        }
        
        if (currentQuizIndex < selectedQuizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
            setSelectedAnswer(null);
            setIsCorrect(null);
            setShowResult(false);
        } else {
            setCompleted(true);
        }
    };

    const tryAgain = () => {
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowResult(false);
    };

    const restartQuiz = () => {
        const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(10, shuffled.length));
        setSelectedQuizzes(selected);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowResult(false);
        setScore(0);
        setCompleted(false);
        setLives(3);
        setLostHearts([]);
    };

    const proceedToHomePage = () => {
        const isPerfectScore = score === selectedQuizzes.length;
        
        router.post(route('quiz.complete'), {
            kabanata_id: kabanataId,
            score: score,
            total_questions: selectedQuizzes.length,
            perfect_score: isPerfectScore,
        }, {
            onSuccess: (response) => {
                console.log('Quiz completed successfully', response);
                if (response.props.perfect_score) {
                    console.log('Perfect score achieved! Guessword and video progress updated.');
                }
                router.visit(route('challenge'));
            },
            onError: (errors) => {
                console.error('Failed to complete quiz:', errors);
            }
        });
    };

    const proceedToKabanataPage = () => {
        const isPerfectScore = score === selectedQuizzes.length;
        
        router.post(route('quiz.complete'), {
            kabanata_id: kabanataId,
            score: score,
            total_questions: selectedQuizzes.length,
            perfect_score: isPerfectScore,
        }, {
            onSuccess: (response) => {
                console.log('Quiz completed successfully', response);
                if (isPerfectScore) {
                    console.log('Perfect score achieved!');
                    
                    // Use get instead of visit for client-side navigation
                    router.get(route('challenge', {
                    showVideo: true,
                    kabanataId: kabanataId + 1
                }), {
                    preserveState: true,
                    preserveScroll: true
                });

                } else {
                    router.get(route('challenge'));
                }
            },
            onError: (errors) => {
                console.error('Failed to complete quiz:', errors);
                router.get(route('challenge'));
            }
        });
    };

    // Show instruction modals if not all have been shown yet
    if (instructionIndex < instructions.length) {
        return (
            <InstructionModal
                isOpen={true}
                onClose={() => {
                    if (instructionIndex < instructions.length - 1) {
                        setInstructionIndex(instructionIndex + 1);
                    } else {
                        setInstructionIndex(instructions.length);
                    }
                }}
                title={instructions[instructionIndex].title}
                content={instructions[instructionIndex].content}
                buttonText={instructions[instructionIndex].buttonText}
                bgImage="/Img/Challenge/Quiz/BG.png"
            />
        );
    }

    if (completed) {
        const isPerfectScore = score === selectedQuizzes.length;
        
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-6 bg-cover bg-center" 
                 style={{ backgroundImage: "url('/Img/Challenge/Quiz/BG.png')" }}>
                
                {/* Wooden Frame Modal */}
                <div className="relative w-[600px] bg-transparent">
                    <img
                        src="/Img/Challenge/GuessWord/wooden_frame.png"
                        alt="Wooden Frame"
                        className="w-full h-auto"
                    />

                    {/* Stars at the top */}
                    <div className="absolute top-[50px] left-1/2 -translate-x-1/2 flex gap-4">
                        {isPerfectScore && (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex items-center justify-center
                                            ${i === 1 ? "w-[70px] h-[70px]" : "w-12 h-12"}
                                            ${i === 0 || i === 2 ? "translate-y-[25px]" : ""}
                                        `}
                                    >
                                        {i < 3 ? (
                                            // Filled Star SVG
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

                    {/* Modal Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center top-[140px]">
                        <h2 className="font-erica 
                            text-[48px] leading-[72px] 
                            font-black 
                            text-[#F6D65A] 
                            stroke-text"
                        >
                            {isPerfectScore ? "PERFECT SCORE!" : "QUIZ COMPLETED!"}
                        </h2>
                        
                        <p className="text-white text-lg mb-3">
                            Your final score: {score}/{selectedQuizzes.length}
                        </p>

                        {isPerfectScore ? (
                            <p className="text-white text-lg mb-3">
                                {/* Congratulations! You got all answers correct! */}
                            </p>
                        ) : (
                            <>
                                {lives <= 0 ? (
                                    <p className="text-red-500 text-lg mb-3">
                                        You ran out of lives!
                                    </p>
                                ) : (
                                    <p className="text-red-500 text-lg mb-3">
                                        You need a perfect score (10/10) to proceed.
                                    </p>
                                )}
                            </>
                        )}

                        {/* Gift/Lock Section */}
                        <div className="relative flex items-center justify-center w-32 h-32 my-3">
                            {isPerfectScore ? (
                                <>
                                    <img
                                        src="/Img/Challenge/GuessWord/fireworks.png"
                                        alt="Fireworks"
                                        className="absolute inset-0 w-full h-full animate-pulse"
                                    />
                                    <div 
                                        className="absolute z-10 w-24 h-24 m-auto inset-0 flex items-center justify-center"
                                        onMouseEnter={() => setShowGiftTooltip(true)}
                                        onMouseLeave={() => setShowGiftTooltip(false)}
                                    >
                                        <img
                                            src="/Img/Challenge/GuessWord/gift.png"
                                            alt="Reward Gift"
                                            className="w-full h-full"
                                        />
                                    </div>
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
                            ) : (
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
                                                Kailangan ng perpektong score (10/10) upang mabuksan ang regalo!
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        
                        {showGiftTooltip && isPerfectScore && (
                            <div className="absolute top-52 mt-2 bg-white text-black p-3 rounded-lg shadow-lg z-30 w-64">
                                <p className="text-sm font-semibold text-center">
                                    The image gallery for Kabanata {kabanata_number}: {kabanata_title} has been unlocked!
                                    Please complete the course by proceeding to the next challenge.
                                </p>
                            </div>
                        )}
                        
                        <div className="flex gap-4 mt-[125px]">     
                            {isPerfectScore ? (
                                <>
                                    <button className="rounded-full p-3 relative" onClick={proceedToHomePage}>
                                        <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                    </button>
                                    <button
                                        className="rounded-full p-3 relative"
                                        onClick={proceedToKabanataPage}
                                    >
                                        <img src="/Img/Challenge/GuessWord/next.png" alt="Next" className="w-[60px] h-[60px]" />
                                    </button>
                                </>
                                
                            ) : (
                                <>
                                    <button className="rounded-full p-3 relative" onClick={() => router.get(route('challenge'))}>
                                        <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                    </button>
                                    <button
                                        onClick={restartQuiz}
                                        className="rounded-full p-3 relative"
                                    >
                                        <img src="/Img/Challenge/GuessWord/restart.png" alt="Restart" className="w-[60px] h-[60px]" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <style>{`
                    .stroke-text {
                        -webkit-text-stroke: 5px #D35D28;
                    }
                `}</style>
            </div>
        );
    }

    if (!currentQuiz) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-amber-50">
                <p>Loading quiz...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-start bg-amber-50 p-6 bg-cover bg-center" 
             style={{ backgroundImage: "url('/Img/Challenge/Quiz/BG.png')" }}>
            <div className="absolute top-4 left-4 flex items-center">
                <div className="bg-orange-600 text-white font-bold px-4 py-2 text-2xl">
                    KABANATA {kabanata_number}:
                </div>
                <div className="text-white font-bold px-2 py-2 text-2xl">
                    {kabanata_title}
                </div>
            </div>
            
            <div className='flex flex-col items-center justify-center relative w-[750px] h-[600px] bg-transparent'>
                <img
                    src="/Img/Challenge/Quiz/modalBG.png"
                    alt="Wooden Frame"
                    className="w-full h-auto"
                />
                <div className='absolute top-[20px] left-1/2 -translate-x-1/2 flex flex-col justify-center items-center w-full h-full'>
                    {/* Lives Display */}
                    <div className="absolute top-[45px] mb-4 flex items-center">
                        <div className="flex">
                            {Array.from({ length: 3 }).map((_, index) => (
                                lostHearts.includes(index) ? null : (
                                    <span 
                                        key={index} 
                                        className="text-4xl mx-1 text-red-500"
                                    >
                                        ❤️
                                    </span>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Question */}
                    <div className="absolute top-[95px] p-6 rounded-lg mb-6 w-full max-w-2xl">
                        <div className='width-full text-center'>
                            <p className="text-xl font-black text-white mb-4 mt-2 ml-5 mr-5">{currentQuiz.question}</p>
                        </div>
                    </div>

                    {/* Drop Zone */}
                    <div 
                        className="absolute top-[290px] bg-gray-100 border-2 border-dashed border-gray-400 p-8 rounded-lg mb-6 w-full max-w-md min-h-[40px] flex items-center justify-center"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {selectedAnswer ? (
                            <p className="text-xl font-bold text-amber-800">
                                {selectedAnswer === 'A' && currentQuiz.choice_a}
                                {selectedAnswer === 'B' && currentQuiz.choice_b}
                                {selectedAnswer === 'C' && currentQuiz.choice_c}
                            </p>
                        ) : (
                            <p className="text-gray-500">DROP HERE THE ANSWER</p>
                        )}
                    </div>

                    {/* Answer Options */}
                    <div className=" absolute bottom-[110px] flex flex-wrap justify-center gap-4 mb-6 w-full max-w-2xl">
                        <div 
                            className="bg-amber-200 p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'A')}
                        >
                            <p className="text-lg font-medium">{currentQuiz.choice_a}</p>
                        </div>
                        <div 
                            className="bg-amber-200 p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'B')}
                        >
                            <p className="text-lg font-medium">{currentQuiz.choice_b}</p>
                        </div>
                        <div 
                            className="bg-amber-200 p-4 rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'C')}
                        >
                            <p className="text-lg font-medium">{currentQuiz.choice_c}</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className=" absolute bottom-0 w-full max-w-lg mb-6">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                                className="bg-amber-600 h-2.5 rounded-full transition-all duration-300" 
                                style={{ width: `${((currentQuizIndex + 1) / selectedQuizzes.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Modal */}
            {showResult && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative w-[600px] bg-transparent">
                        {/* Wooden Frame Background */}
                        <img
                            src="/Img/Challenge/GuessWord/wooden_frame.png"
                            alt="Wooden Frame"
                            className="w-full h-auto"
                        />

                        {/* Modal Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center top-[140px]">
                            <h2 className="font-erica 
                                text-[48px] leading-[72px] 
                                font-black 
                                text-[#F6D65A] 
                                stroke-text"
                            >
                                {isCorrect ? "CORRECT!" : "INCORRECT!"}
                            </h2>
                            
                            {isCorrect ? (
                                <p className="text-white text-lg mb-3">Tama ang sagot!</p>
                            ) : (
                                <p className="text-red-500 text-lg mb-3">
                                    Mali ang sagot!
                                    {/* Mali! Ang tamang sagot ay: {
                                        currentQuiz.correct_answer === 'A' ? currentQuiz.choice_a :
                                        currentQuiz.correct_answer === 'B' ? currentQuiz.choice_b :
                                        currentQuiz.choice_c
                                    } */}
                                </p>
                            )}

                            <div className="flex gap-4 mt-[200px]">
                                <button className="rounded-full p-3 relative" onClick={() => router.get(route('challenge'))}>
                                    <img src="/Img/Challenge/GuessWord/home.png" alt="Home" className="w-[60px] h-[60px]" />
                                </button>
                                {isCorrect ? (
                                    <button
                                        onClick={nextQuestion}
                                        className="rounded-full p-3 relative"
                                    >
                                        <img src="/Img/Challenge/GuessWord/next.png" alt="Next" className="w-[60px] h-[60px]" />
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={tryAgain}
                                            className="rounded-full p-3 relative"
                                        >
                                            <img src="/Img/Challenge/GuessWord/restart.png" alt="Try Again" className="w-[60px] h-[60px]" />
                                        </button>
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
            `}</style>
        </div>
    );
}