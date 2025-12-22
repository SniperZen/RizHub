import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack?: () => void;
    initialEmail?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onBack, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [isCopied, setIsCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState('');
    const [isBgLoaded, setIsBgLoaded] = useState(false);

    const shareLink = `${window.location.origin}`;

    const handleSendInvite = () => {
        if (!email) {
            setSendError('Mangyaring maglagay ng email address.');
            return;
        }

        setIsSending(true);
        setSendError('');
        setSendSuccess(false);

        router.post(route('student.sendInvite'), { email, shareLink }, {
            preserveScroll: true,
            onSuccess: () => {
                setEmail('');
                setSendSuccess(true);
                setIsSending(false);
            },
            onError: () => {
                setSendError('Failed to send invitation. Please try again.');
                setIsSending(false);
            }
        });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="relative flex flex-col items-center w-full max-w-[900px]">
                {/* Background Image - Responsive */}
                <img
                    src="/Img/Dashboard/modalBG.png"
                    alt="Modal Background"
                    className="w-full h-auto max-h-[80vh] rounded-[40px] min-h-[500px]"
                    onLoad={() => setIsBgLoaded(true)}
                    onError={() => setIsBgLoaded(true)}
                />
                
                {/* Loading Overlay - Only show when image is not loaded */}
                {!isBgLoaded && (
                    <div 
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] z-20 w-full h-full"
                    >
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-[#9A4112] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-[#9A4112] font-bold">Loading...</p>
                        </div>
                    </div>
                )}
                
                {/* Content Container - Only show when image is loaded */}
                {isBgLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col items-center w-full px-4 sm:px-8 md:px-12">
                            <span className="absolute text-white text-4xl sm:text-4xl md:text-3xl lg:text-4xl font-black tracking-wide top-3 sm:top-4 md:top-5 text-center">
                                Share
                            </span>
                            
                            {/* Close Button */}
                            <button
                                className="absolute top-10 sm:top-10 md:top-10 lg:top-10 right-4 sm:right-6 md:right-8 rounded-full w-12 h-12 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[60px] lg:h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                                onClick={onBack || onClose}
                            >
                                <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                            </button>
                            
                            {/* Main Content */}
                            <div className="mt-12 sm:mt-10 md:mt-12 lg:mt-4 w-full max-w-2xl">
                                {/* Email Invitation Section */}
                                <div className="mb-6 sm:mb-8 md:mb-[35px]">
                                    <h3 className="text-[#3D2410] text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">Mag-imbita sa pamamagitan ng Email</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setSendError('');
                                                setSendSuccess(false);
                                            }}
                                            placeholder="I-enter ang email address"
                                            className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB84C] text-base sm:text-lg w-full"
                                        />
                                        <button
                                            onClick={handleSendInvite}
                                            disabled={isSending}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-[#9A4112] text-white font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105 disabled:opacity-70 whitespace-nowrap text-sm sm:text-base"
                                        >
                                            {isSending ? 'Nagpapadala...' : 'Ipadala'}
                                        </button>
                                    </div>
                                    {sendError && (
                                        <p className="text-red-800 text-base mt-2">{sendError}</p>
                                    )}
                                    {sendSuccess && (
                                        <p className="text-green-600 text-sm mt-2">Matagumpay na naipadala ang imbitasyon!</p>
                                    )}
                                </div>
                                
                                {/* Share Link Section */}
                                <div>
                                    <h3 className="text-[#3D2410] text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4">O ibahagi ang link na ito</h3>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                        <div className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-white/80 border-2 border-[#000] text-[#3D2410] rounded-lg overflow-hidden text-sm sm:text-base break-all">
                                            {shareLink}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="px-4 py-2 sm:px-6 sm:py-3 bg-[#9A4112] text-white font-bold border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105 whitespace-nowrap text-sm sm:text-base"
                                        >
                                            {isCopied ? 'Kinopya!' : 'Kopyahin'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareModal;