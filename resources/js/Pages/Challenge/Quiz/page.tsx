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

    // Instruction modals content
    const instructions = [
        {
            title: `KABANATA ${kabanata_number}: ${kabanata_title}`,
            content: `Welcome to the Quiz Challenge! \n\nIn this activity, you'll be tested on your knowledge of this kabanata. You need to achieve a perfect score (5/5) to proceed to the next challenge.`,
            buttonText: "Next",
        },
        {
            title: `HOW TO PLAY`,
            content: `1. Read each question carefully\n2. Drag and drop the correct answer to the drop zone\n3. You have 3 lives - be careful with your answers!\n4. Get all 5 questions right to unlock the next challenge`,
            buttonText: "Next",
        },
        {
            title: `IMPORTANT RULES`,
            content: `⚠️ Perfect score required to proceed\n⚠️ You lose a life for each wrong answer\n⚠️ Game over if you run out of lives\n⚠️ Try again if you don't get all answers correct`,
            buttonText: "Next",
        },
        {
            title: `READY TO START?`,
            content: `Remember: Drag the answer options to the drop zone below each question. Good luck! \n\nHanda ka na ba?`,
            buttonText: "Start Quiz",
        }
    ];

    // Select 5 random quizzes from the list
    useEffect(() => {
        if (quizzes.length > 0) {
            const shuffled = [...quizzes].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, Math.min(5, shuffled.length));
            setSelectedQuizzes(selected);
        }
    }, [quizzes]);

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
        const selected = shuffled.slice(0, Math.min(5, shuffled.length));
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

    const proceedToNextPage = () => {
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
                <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">
                        {isPerfectScore ? "🎉 Perfect Score! 🎉" : "Quiz Completed!"}
                    </h2>
                    <p className="text-lg mb-2">Your final score: {score}/{selectedQuizzes.length}</p>
                    
                    {isPerfectScore ? (
                        <>
                            <p className="text-green-600 font-bold text-lg mb-4">
                                Congratulations! You got all answers correct!
                            </p>
                            <button 
                                onClick={proceedToNextPage} 
                                className="bg-green-500 text-white px-6 py-2 rounded-lg mt-4"
                            >
                                Proceed to Next Page
                            </button>
                        </>
                    ) : (
                        <>
                            {lives <= 0 ? (
                                <p className="text-red-600 font-bold text-lg mb-4">
                                    You ran out of lives!
                                </p>
                            ) : (
                                <p className="text-red-600 font-bold text-lg mb-4">
                                    You need a perfect score (5/5) to proceed.
                                </p>
                            )}
                            <p className="text-gray-600 mb-4">
                                Please try again to get all answers correct.
                            </p>
                            <button 
                                onClick={restartQuiz} 
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4"
                            >
                                Try Again
                            </button>
                        </>
                    )}
                </div>
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
                            <p className="text-xl font-black text-white mb-4">Question {currentQuizIndex + 1}: {currentQuiz.question}</p>
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
                        {/* <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-amber-800">
                                Question {currentQuizIndex + 1} of {selectedQuizzes.length}
                            </span>
                            <span className="text-sm font-medium text-amber-800">
                                Score: {score}/{selectedQuizzes.length}
                            </span>
                        </div> */}
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg text-center shadow-xl max-w-md">
                        {isCorrect ? (
                            <>
                                <p className="text-green-600 font-bold text-xl mb-4">Correct!</p>
                                <p className="mb-4">Good job! Your answer is right.</p>
                                <button 
                                    onClick={nextQuestion}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg"
                                >
                                    {currentQuizIndex < selectedQuizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-red-600 font-bold text-xl mb-4">Incorrect!</p>
                                <p className="mb-2">The correct answer is: {
                                    currentQuiz.correct_answer === 'A' ? currentQuiz.choice_a :
                                    currentQuiz.correct_answer === 'B' ? currentQuiz.choice_b :
                                    currentQuiz.choice_c
                                }</p>
                                <p className="mb-4 text-red-500">You lost a life! {lives - 1} remaining.</p>
                                <div className="flex gap-3 justify-center">
                                    <button 
                                        onClick={tryAgain}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}