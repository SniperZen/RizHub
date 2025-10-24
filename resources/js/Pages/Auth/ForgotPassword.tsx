import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (status) {
            setToastMessage(status);
            setShowToast(true);
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => {
                setToastMessage("If that email address is in our database, we've sent you an email with instructions to reset your password.");
                setShowToast(true);
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
            <Head title="Forgot Password" />

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-fadeIn">
                    <div className="p-4 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 shadow-lg max-w-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
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
                                    <span className="sr-only">Close</span>
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form box with left + right sections */}
            <div className="relative z-10 flex max-w-3xl w-full bg-[#FA7816] rounded-2xl shadow-xl overflow-hidden">

                {/* Left Side Image + Text */}
                <div className="hidden md:flex w-1/2 items-center justify-center relative bg-orange-100">
                    <img
                        src="/Img/LandingPage/character/noli-form.gif"
                        alt="Forgot Password Illustration"
                        className="w-full h-full object-cover"
                    />

                    {/* Centered Text Overlay */}
                    <div className="absolute inset-0 flex py-40 p-6 text-center">
                        {/* Smooth glowing background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                                        blur-3xl animate-pulse opacity-70 -z-10"></div>

                        <h2 className="text-[#FA7816] text-lg md:text-2xl font-extrabold drop-shadow-md leading-snug max-w-xs mt-10">
                            Huwag kang mag-alala! Tutulungan ka naming makabalik sa iyong talaan kaagad.
                        </h2>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            {/* Custom Lock Icon */}
                            <div className="mx-auto flex items-center justify-center mb-4">
                                <img
                                    src="\Img\VerificationPage\email-icon.gif" // You might want to create/use a lock icon GIF
                                    alt="Password Reset Icon"
                                    className="h-30 w-30 object-contain"
                                />
                            </div>

                            <h2 className="text-3xl font-extrabold text-white mb-2">
                                I-reset ng Password
                            </h2>
                            <p className="text-white">
                                I-enter ang iyong email address upang mabalik ang iyong account.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    placeholder="Email address"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                />
                                {errors.email && (
                                    <div className="text-red-100 mt-2 text-sm">{errors.email}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5A3416] hover:bg-[#3d2410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 transition-colors duration-200"
                            >
                                {processing ? "Sending..." : "Ipadala ang link"}
                            </button>

                            <div className="text-center">
                                <Link
                                    href={route("welcome")}
                                    className="text-sm text-gray-200 hover:text-gray-100 transition-colors duration-200"
                                >
                                    Bumalik
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Add CSS animation for the toast */}
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
