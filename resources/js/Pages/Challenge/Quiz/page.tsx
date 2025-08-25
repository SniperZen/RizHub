import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

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
    quizzes: QuizData[];
}

export default function Quiz({ kabanataId, quizzes }: QuizProps) {
    const [selectedQuizzes, setSelectedQuizzes] = useState<QuizData[]>([]);
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [lives, setLives] = useState(3);
    const [lostHearts, setLostHearts] = useState<number[]>([]);

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
    };

    const checkAnswer = () => {
        if (selectedAnswer && currentQuiz) {
            const correct =
                (selectedAnswer === 'A' && currentQuiz.correct_answer === 'A') ||
                (selectedAnswer === 'B' && currentQuiz.correct_answer === 'B') ||
                (selectedAnswer === 'C' && currentQuiz.correct_answer === 'C');
            
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
                    selected_answer: selectedAnswer,
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
            
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-amber-800 mb-2">QUIZ</h1>
                <p className="text-lg text-gray-600">Kabanata {kabanataId}</p>
                <p className="text-sm text-red-600 font-bold mt-2">
                    ⚠️ Perfect score (5/5) required to proceed
                </p>
            </div>

            {/* Lives Display */}
            <div className="mb-4 flex items-center">
                <span className="text-lg font-bold text-red-600 mr-2">Lives:</span>
                <div className="flex">
                    {Array.from({ length: 3 }).map((_, index) => (
                        lostHearts.includes(index) ? null : (
                            <span 
                                key={index} 
                                className="text-2xl mx-1 text-red-500"
                            >
                                ❤️
                            </span>
                        )
                    ))}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-amber-800">
                        Question {currentQuizIndex + 1} of {selectedQuizzes.length}
                    </span>
                    <span className="text-sm font-medium text-amber-800">
                        Score: {score}/{selectedQuizzes.length}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-amber-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${((currentQuizIndex + 1) / selectedQuizzes.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Question */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 w-full max-w-2xl">
                <p className="text-xl font-semibold text-gray-800 mb-4">{currentQuiz.question}</p>
                <p className="text-lg italic text-gray-600 mb-2">Drag your answer to the box below</p>
            </div>

            {/* Answer Options */}
            <div className="flex flex-wrap justify-center gap-4 mb-6 w-full max-w-2xl">
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

            {/* Drop Zone */}
            <div 
                className="bg-gray-100 border-2 border-dashed border-gray-400 p-8 rounded-lg mb-6 w-full max-w-2xl min-h-32 flex items-center justify-center"
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

            {/* Submit Button */}
            <button 
                onClick={checkAnswer}
                disabled={!selectedAnswer}
                className={`px-8 py-3 rounded-lg text-white font-bold text-lg mb-4 ${!selectedAnswer ? 'bg-gray-400' : 'bg-amber-600 hover:bg-amber-700'}`}
            >
                Submit Answer
            </button>

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