import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [cooldown, setCooldown] = useState(0);
    const [isCooldownActive, setIsCooldownActive] = useState(false);

    // Check if there's an existing cooldown in localStorage on component mount
    useEffect(() => {
        const savedCooldown = localStorage.getItem('emailVerificationCooldown');
        if (savedCooldown) {
            const cooldownEnd = parseInt(savedCooldown);
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((cooldownEnd - now) / 1000));
            
            if (remaining > 0) {
                setCooldown(remaining);
                setIsCooldownActive(true);
            } else {
                localStorage.removeItem('emailVerificationCooldown');
            }
        }
    }, []);

    // Handle cooldown timer
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isCooldownActive && cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setIsCooldownActive(false);
                        localStorage.removeItem('emailVerificationCooldown');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isCooldownActive, cooldown]);

    // Start cooldown function
    const startCooldown = (seconds: number = 60) => {
        setCooldown(seconds);
        setIsCooldownActive(true);
        
        // Save cooldown end time to localStorage
        const cooldownEnd = Date.now() + (seconds * 1000);
        localStorage.setItem('emailVerificationCooldown', cooldownEnd.toString());
    };

    useEffect(() => {
        if (status === "verification-link-sent") {
            setToastMessage("Naipadala na ang panibagong verification link sa email address na ibinigay mo noong nag-rehistro.");
            setShowToast(true);
            
            // Start cooldown when email is sent
            startCooldown(60);
            
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (isCooldownActive && cooldown > 0) {
            setToastMessage(`Pakihintay ng ${cooldown} segundo bago muling magpadala ng verification email.`);
            setShowToast(true);
            
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
        
        post(route('verification.send'), {
            onSuccess: () => {
                setToastMessage("Naipadala na ang panibagong verification link sa email address na ibinigay mo noong nag-rehistro.");
                setShowToast(true);
                
                // Start cooldown on successful send
                startCooldown(60);

                const timer = setTimeout(() => {
                    setShowToast(false);
                }, 5000);
                return () => clearTimeout(timer);
            }
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/Img/VerificationPage/color-bg.png')" }}
        >
            <Head title="Pagpapatunay ng Email" />

            {/* Toast Notification - Updated to match orange theme */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-fadeIn">
                    <div className="p-4 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 shadow-lg max-w-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {isCooldownActive && cooldown > 0 ? (
                                    <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">
                                    {toastMessage}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="inline-flex text-orange-500 hover:text-orange-700 focus:outline-none"
                                    onClick={() => setShowToast(false)}
                                >
                                    <span className="sr-only">Isara</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Box */}
            <div className="relative z-10 flex max-w-3xl w-full bg-[#FA7816] rounded-2xl shadow-xl overflow-hidden">

                {/* Left Side */}
                <div className="hidden md:flex w-1/2 items-center justify-center relative bg-orange-100">
                    <img
                        src="/Img/LandingPage/character/noli-form.gif"
                        alt="Ilustrasyon ng Login"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex py-40 p-6 text-center">

                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                                    blur-3xl animate-pulse opacity-70 -z-10"></div>

                        <h2 className="text-[#FA7816] text-base md:text-xl font-extrabold drop-shadow-md leading-snug max-w-xs mt-10">
                            Kasama ka na ngayon sa RizHub adventure—matuto, maglaro, at manalo kasama namin!
                        </h2>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full">
                        <div className="text-center mb-8">
                            <div className="mx-auto flex items-center justify-center mb-4">
                                <img
                                    src="\Img\VerificationPage\email-icon.gif"
                                    alt="Email Icon"
                                    className="h-30 w-30 object-contain"
                                />
                            </div>

                            <h2 className="text-2xl font-extrabold text-white mb-2">
                                Patunayan ang Iyong Email
                            </h2>
                            <p className="text-white text-base mb-4">
                                Salamat sa pag-sign up! Bago ka magsimula, pakipatunayan muna ang iyong email address.
                                {isCooldownActive && cooldown > 0 && (
                                    <span className="inline-block ml-1 font-bold animate-pulse">
                                        {cooldown}s
                                    </span>
                                )}
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <button
                                type="submit"
                                disabled={processing || (isCooldownActive && cooldown > 0)}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                                    processing || (isCooldownActive && cooldown > 0) 
                                    ? 'bg-[#5A3416]/70 cursor-not-allowed hover:bg-[#5A3416]/70 border border-[#5A3416]/50' 
                                    : 'bg-[#5A3416] hover:bg-[#3d2410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A3416]'
                                }`}
                            >
                                {processing ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Ipinapadala...
                                    </span>
                                ) : isCooldownActive && cooldown > 0 ? (
                                    `Maghintay...`
                                ) : (
                                    "Ipadala Muli ang Verification Email"
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                    className="text-sm text-gray-200 hover:text-gray-100 transition-colors duration-200"
                                >
                                    Mag-Log Out
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.3s ease-out forwards;
                    }
                `}
            </style>
        </div>
    );
}