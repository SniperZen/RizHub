import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TUTORIAL_STEPS, TUTORIAL_CONFIG, TutorialStep } from './tutorialSteps';

interface TutorialProps {
    isVisible: boolean;
    onComplete: () => void;
    onSkip: () => void;
    startStep?: number;
}

interface ElementPosition {
    top: number;
    left: number;
    width: number;
    height: number;
}

const InteractiveTutorial: React.FC<TutorialProps> = ({
    isVisible,
    onComplete,
    onSkip,
    startStep = 0,
}) => {
    const [currentStep, setCurrentStep] = useState(startStep);
    const [elementPosition, setElementPosition] = useState<ElementPosition | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const overlayRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const step = TUTORIAL_STEPS[currentStep];

    // Get target element position
    const getElementPosition = useCallback(() => {
        if (!step || !isVisible) return;

        let targetElement = document.querySelector(step.targetElement);

        // For center position, don't highlight any specific element
        if (step.position === 'center') {
            setElementPosition(null);
            return;
        }

        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            const padding = step.highlightPadding || 10;

            setElementPosition({
                top: rect.top + window.scrollY - padding,
                left: rect.left + window.scrollX - padding,
                width: rect.width + padding * 2,
                height: rect.height + padding * 2,
            });
        }
    }, [step, isVisible]);

    // Calculate tooltip position based on step position
    const calculateTooltipPosition = useCallback(() => {
        if (!elementPosition || !tooltipRef.current) return;

        const tooltipWidth = tooltipRef.current.offsetWidth || 350;
        const tooltipHeight = tooltipRef.current.offsetHeight || 200;
        const padding = 20;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = 0;
        let left = 0;

        switch (step.position) {
            case 'top':
                top = elementPosition.top - tooltipHeight - padding;
                left = elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2;
                break;
            case 'bottom':
                top = elementPosition.top + elementPosition.height + padding;
                left = elementPosition.left + elementPosition.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                top = elementPosition.top + elementPosition.height / 2 - tooltipHeight / 2;
                left = elementPosition.left - tooltipWidth - padding;
                break;
            case 'right':
                top = elementPosition.top + elementPosition.height / 2 - tooltipHeight / 2;
                left = elementPosition.left + elementPosition.width + padding;
                break;
            case 'center':
                top = viewportHeight / 2 - tooltipHeight / 2;
                left = viewportWidth / 2 - tooltipWidth / 2;
                break;
        }

        // Boundary checks
        if (left < padding) left = padding;
        if (left + tooltipWidth > viewportWidth - padding) left = viewportWidth - tooltipWidth - padding;
        if (top < padding) top = padding;
        if (top + tooltipHeight > viewportHeight - padding) top = viewportHeight - tooltipHeight - padding;

        setTooltipPosition({ top, left });
    }, [elementPosition, step.position]);

    // Update positions on scroll/resize
    useEffect(() => {
        getElementPosition();
        calculateTooltipPosition();

        const handleScroll = () => {
            getElementPosition();
            calculateTooltipPosition();
        };

        const handleResize = () => {
            getElementPosition();
            calculateTooltipPosition();
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [getElementPosition, calculateTooltipPosition, isVisible]);

    // Handle step completion
    const handleNext = async () => {
        if (step.action?.type === 'click' && step.action.target) {
            const targetElement = document.querySelector(step.action.target);
            if (targetElement) {
                (targetElement as HTMLElement).click();
            }
        }

        if (currentStep < TUTORIAL_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isVisible || !step) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 pointer-events-none">
                {/* Semi-transparent overlay */}
                <motion.div
                    ref={overlayRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: TUTORIAL_CONFIG.overlayOpacity }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: TUTORIAL_CONFIG.animationDuration / 1000 }}
                    className="fixed inset-0 bg-black pointer-events-auto"
                    onClick={onSkip}
                />

                {/* Highlighted element spotlight */}
                {elementPosition && step.position !== 'center' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: TUTORIAL_CONFIG.animationDuration / 1000 }}
                        className="absolute bg-transparent pointer-events-none border-2 border-yellow-300 shadow-lg"
                        style={{
                            top: elementPosition.top,
                            left: elementPosition.left,
                            width: elementPosition.width,
                            height: elementPosition.height,
                            borderRadius: TUTORIAL_CONFIG.highlightBorderRadius,
                            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                        }}
                    >
                        {/* Pulsing animation */}
                        <motion.div
                            animate={{ boxShadow: ['0 0 10px rgba(255, 193, 7, 0.5)', '0 0 30px rgba(255, 193, 7, 0.8)', '0 0 10px rgba(255, 193, 7, 0.5)'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0"
                            style={{
                                borderRadius: TUTORIAL_CONFIG.highlightBorderRadius,
                            }}
                        />
                    </motion.div>
                )}

                {/* Tooltip */}
                <motion.div
                    ref={tooltipRef}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: TUTORIAL_CONFIG.animationDuration / 1000 }}
                    className="fixed pointer-events-auto bg-white rounded-lg shadow-2xl p-6 max-w-sm z-50"
                    style={{
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                    }}
                >
                    {/* Step indicator */}
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
                        </span>
                        <button
                            onClick={onSkip}
                            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-amber-900 mb-2">{step.title}</h3>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">{step.description}</p>

                    {/* Action buttons */}
                    <div className="flex gap-3 justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                                currentStep === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
                        >
                            ← Previous
                        </button>

                        {step.skipAllowed && (
                            <button
                                onClick={onSkip}
                                className="px-4 py-2 rounded-lg font-semibold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                            >
                                Skip Tour
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            className="px-4 py-2 rounded-lg font-semibold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                        >
                            {currentStep === TUTORIAL_STEPS.length - 1 ? 'Finish' : 'Next →'}
                        </button>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {TUTORIAL_STEPS.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStep(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentStep ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                                aria-label={`Go to step ${index + 1}`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Arrow pointing to element */}
                {elementPosition && step.position !== 'center' && (
                    <Arrow
                        elementPosition={elementPosition}
                        tooltipPosition={tooltipPosition}
                        position={step.position}
                    />
                )}
            </div>
        </AnimatePresence>
    );
};

interface ArrowProps {
    elementPosition: ElementPosition;
    tooltipPosition: { top: number; left: number };
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const Arrow: React.FC<ArrowProps> = ({ elementPosition, tooltipPosition, position }) => {
    const arrowSize = TUTORIAL_CONFIG.arrowSize;
    let arrowStyle: React.CSSProperties = {
        position: 'fixed',
        width: 0,
        height: 0,
        borderStyle: 'solid',
        zIndex: 49,
    };

    const elementCenterX = elementPosition.left + elementPosition.width / 2;
    const elementCenterY = elementPosition.top + elementPosition.height / 2;
    const tooltipCenterX = tooltipPosition.left + 175; // Approximate tooltip width
    const tooltipCenterY = tooltipPosition.top + 100; // Approximate tooltip height

    switch (position) {
        case 'top':
            arrowStyle.borderWidth = `0 ${arrowSize}px ${arrowSize}px ${arrowSize}px`;
            arrowStyle.borderColor = `transparent transparent white transparent`;
            arrowStyle.left = elementCenterX - arrowSize;
            arrowStyle.top = elementPosition.top - arrowSize - 5;
            break;
        case 'bottom':
            arrowStyle.borderWidth = `${arrowSize}px ${arrowSize}px 0 ${arrowSize}px`;
            arrowStyle.borderColor = `white transparent transparent transparent`;
            arrowStyle.left = elementCenterX - arrowSize;
            arrowStyle.top = elementPosition.top + elementPosition.height + 5;
            break;
        case 'left':
            arrowStyle.borderWidth = `${arrowSize}px ${arrowSize}px ${arrowSize}px 0`;
            arrowStyle.borderColor = `transparent white transparent transparent`;
            arrowStyle.left = elementPosition.left - arrowSize - 5;
            arrowStyle.top = elementCenterY - arrowSize;
            break;
        case 'right':
            arrowStyle.borderWidth = `${arrowSize}px 0 ${arrowSize}px ${arrowSize}px`;
            arrowStyle.borderColor = `transparent transparent transparent white`;
            arrowStyle.left = elementPosition.left + elementPosition.width + 5;
            arrowStyle.top = elementCenterY - arrowSize;
            break;
    }

    return <div style={arrowStyle} className="pointer-events-none" />;
};

export default InteractiveTutorial;
