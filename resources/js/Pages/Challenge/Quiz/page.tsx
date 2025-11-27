import React, { useState, useEffect, useRef } from 'react';
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
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [lives, setLives] = useState(3);
    const [lostHearts, setLostHearts] = useState<number[]>([]);
    const [instructionIndex, setInstructionIndex] = useState(0);
    const [showLockTooltip, setShowLockTooltip] = useState(false);
    const [showGiftTooltip, setShowGiftTooltip] = useState(false);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Audio refs
    const correctSoundRef = useRef<HTMLAudioElement>(null);
    const wrongSoundRef = useRef<HTMLAudioElement>(null);

    // Instruction modals content - with safety checks
    const instructions = [
        {
            title: `KABANATA ${kabanata_number || ''}: ${kabanata_title || ''}`,
            content: `Magaling! Ikaw ay nagtagumpay sa unang pagsubok.`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number || ''}: ${kabanata_title || ''}`,
            content: `Ngayon, tingnan natin kung malalagpasan mo ang huling pagsubok...`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number || ''}: ${kabanata_title || ''}`,
            content: `Sa pagkakataon na ito, kailangan mong makakuha ng perpektong marka sa 10 tanong para mabuksan mo ang susunod na hamon.`,
            buttonText: "Next",
        },
        {
            title: `KABANATA ${kabanata_number || ''}: ${kabanata_title || ''}`,
            content: `Handa ka na ba? May tatlong beses na pagkakataon ka lamang para makuha ang perpektong sagot sa 10 tanong.`,
            buttonText: "Start Quiz",
        }
    ].filter(instruction => 
        instruction.title && 
        instruction.content && 
        instruction.buttonText
    );

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

    const playSound = async (soundRef: React.RefObject<HTMLAudioElement>) => {
        if (soundRef.current) {
            try {
                soundRef.current.currentTime = 0;
                await soundRef.current.play();
            } catch (error) {
                console.log('Audio play failed:', error);
            }
        }
    };

    const checkAnswer = async (answer: string) => {
        if (currentQuiz) {
            const correct =
                (answer === 'A' && currentQuiz.correct_answer === 'A') ||
                (answer === 'B' && currentQuiz.correct_answer === 'B') ||
                (answer === 'C' && currentQuiz.correct_answer === 'C');
            
            setIsCorrect(correct);

            // Play sound based on correctness without waiting for it to finish
            if (correct) {
                playSound(correctSoundRef);
            } else {
                playSound(wrongSoundRef);
            }

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
            } else {
                // Automatically move to next question after a short delay
                setTimeout(() => {
                    if (currentQuizIndex < selectedQuizzes.length - 1) {
                        setCurrentQuizIndex(currentQuizIndex + 1);
                        setSelectedAnswer(null);
                        setIsCorrect(null);
                    } else {
                        setCompleted(true);
                    }
                }, 1000); // 1 second delay to show feedback
            }
        }
    };

    const restartQuiz = () => {
        const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, Math.min(10, shuffled.length));
        setSelectedQuizzes(selected);
        setCurrentQuizIndex(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
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
        total_score: selectedQuizzes.length, // Changed from total_questions to total_score
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
        total_score: selectedQuizzes.length, // Changed from total_questions to total_score
        perfect_score: isPerfectScore,
    }, {
        onSuccess: (response) => {
            console.log('Quiz completed successfully', response);
            if (isPerfectScore) {
                console.log('Perfect score achieved!');
                
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
        const currentInstruction = instructions[instructionIndex];
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
                title={currentInstruction?.title || ''}
                content={currentInstruction?.content || ''}
                buttonText={currentInstruction?.buttonText || 'Continue'}
                bgImage="/Img/Challenge/Quiz/BG.png"
            />
        );
    }

    if (completed) {
        const isPerfectScore = score === selectedQuizzes.length;
        
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-6 bg-cover bg-center" 
                 style={{ backgroundImage: "url('/Img/Challenge/Quiz/BG.png')" }}>
                
                {/* Audio elements */}
                <audio 
                    ref={correctSoundRef} 
                    src="/Music/plankton-correct.mp3" 
                    preload="auto"
                />
                <audio 
                    ref={wrongSoundRef} 
                    src="/Music/ksiwhatthehellmusic1.mp3" 
                    preload="auto"
                />
                
                {/* Wooden Frame Modal */}
                <div className="relative w-[600px] bg-transparent">
                    <img
                        src="/Img/Challenge/GuessWord/wooden_frame1.png"
                        alt="Wooden Frame"
                        className="w-full h-[500px]"
                    />

                    {/* Modal Content */}
                    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 text-center top-[-3px]">
                        <h2 className=" fixed
                            font-mono
                            mr-5
                            ml-5
                            text-[58px] leading-[72px] 
                            font-black 
                            text-orange-800
                            z-10
                            mb-12
                            -mt-10"
                        >
                            {isPerfectScore ? "PERFECT SCORE!" : "QUIZ COMPLETED"}
                        </h2>
                        
                        <p className="fixed text-lg text-orange-800 mb-3 mt-20">
                            Ikaw ay nakakuha ng markang "{score}/{selectedQuizzes.length}" sa huling hamon.
                        </p>

                        {isPerfectScore ? (
                            <p className="fixed text-white text-base top-15 mr-15 ml-15">
                                {/* Binabati kita, Nakamit mo ang perpektong marka at nabuksan mo ang susunod na kabanata! */}
                            </p>
                        ) : (
                            <>
                                {lives <= 0 ? (
                                    <p className="text-red-500 text-lg mb-3 mt-8">
                                        You ran out of lives!
                                    </p>
                                ) : (
                                    <p className="text-red-500 text-lg mb-3">
                                        You need a perfect score (10/10) to proceed.
                                    </p>
                                )}
                            </>
                        )}
                    
                        
                        <div className="fixed flex gap-4 mt-[380px]">     
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
            
            {/* Audio elements */}
            <audio 
                ref={correctSoundRef} 
                src="/Music/plankton-correct.mp3" 
                preload="auto"
            />
            <audio 
                ref={wrongSoundRef} 
                src="/Music/ksiwhatthehellmusic1.mp3" 
                preload="auto"
            />
            
            <div className="absolute top-4 left-4 flex items-center">
                <div className="bg-orange-600 text-white font-mono font-bold px-4 py-2 text-2xl">
                    Kabanata {kabanata_number}:
                </div>
                <div className="text-white font-bold font-mono px-2 py-2 text-2xl">
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
                            <p className="text-gray-500">DRAG HERE THE ANSWER</p>
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

            <style>{`
                .stroke-text {
                    -webkit-text-stroke: 5px #D35D28;
                }
            `}</style>
        </div>
    );
}