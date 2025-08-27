import React, { useState } from 'react';
import { router } from '@inertiajs/react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialEmail?: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, initialEmail = '' }) => {
    const [email, setEmail] = useState(initialEmail);
    const [isCopied, setIsCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(false);
    const [sendError, setSendError] = useState('');

    const shareLink = `${window.location.origin}`;

    const handleSendInvite = () => {
        if (!email) {
            setSendError('Please enter an email address');
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div 
                className="relative bg-gradient-to-b from-[#F9E3B0] to-[#E6C48B] rounded-[40px] px-12 pb-16 pt-5 flex flex-col items-center min-w-[700px] h-auto"
                style={{ 
                    backgroundImage: "url('/Img/Dashboard/modalBG.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >
                <div className="flex flex-col items-center w-full px-[80px]">
                    <span className="absolute text-white text-4xl font-black tracking-wide bottom-190">Share</span>
                    <button
                        className="absolute top-7 right-9 rounded-full w-[60px] h-[60px] flex items-center justify-center shadow-lg transition hover:scale-110"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <img src="/Img/Dashboard/X.png" alt="X" className="w-full h-auto" />
                    </button>
                    
                    <div className="mt-20 mb-8 w-full max-w-md">
                        {/* Email Invitation Section */}
                        <div className="mb-[35px] relative">
                            <h3 className="text-[#3D2410] text-2xl font-bold mb-4">Invite via Email</h3>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setSendError('');
                                        setSendSuccess(false);
                                    }}
                                    placeholder="Enter email address"
                                    className="flex-1 px-4 py-2 bg-white/80 border-2 border-[#000] text-[#3D2410] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB84C]"
                                />
                                <button
                                    onClick={handleSendInvite}
                                    disabled={isSending}
                                    className="px-4 py-2 bg-[#9A4112] text-white font-bold rounded-lg border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105 disabled:opacity-70"
                                >
                                    {isSending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                            {sendError && (
                                <p className="absolute text-red-500 text-sm mt-[5px]">{sendError}</p>
                            )}
                            {sendSuccess && (
                                <p className="absolute text-green-600 text-sm mt-2">Invitation sent successfully!</p>
                            )}
                        </div>
                        
                        {/* Share Link Section */}
                        <div>
                            <h3 className="text-[#3D2410] text-2xl font-bold mb-4">Or share this link</h3>
                            <div className="flex gap-2">
                                <div className="flex-1 px-4 py-2 bg-white/80 border-2 border-[#000] text-[#3D2410] rounded-lg overflow-hidden whitespace-nowrap overflow-ellipsis">
                                    {shareLink}
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-[#9A4112] text-white font-bold rounded-lg border-2 border-[#282725] shadow-[-2px_4px_0px_#282725] transition hover:scale-105"
                                >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;