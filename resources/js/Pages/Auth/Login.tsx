import { useState, useEffect, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Login form state
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {
                // Success message would typically be handled by the backend
            },
            onError: (errors) => {
                if (errors.email || errors.password) {
                    setToastMessage("Invalid credentials. Please try again.");
                    setShowToast(true);
                    const timer = setTimeout(() => {
                        setShowToast(false);
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            }
        });
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/Img/VerificationPage/color-bg.png')" }}
        >
            <Head title="Login" />

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
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />

                    {/* Centered Text Overlay */}
                    <div className="absolute inset-0 flex py-40 p-6 text-center">
                        {/* Smooth glowing background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                                        blur-3xl animate-pulse opacity-70 -z-10"></div>

                        <h2 className="text-[#FA7816] text-lg md:text-2xl font-extrabold drop-shadow-md leading-snug max-w-xs mt-10">
                            Maligayang Pagbabalik! Maghanda sa paglalakbay.
                        </h2>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            {/* Custom Login Icon */}
                            <div className="mx-auto flex items-center justify-center mb-4">
                                <img
                                    src="/Img/LandingPage/Login/quill.png"
                                    alt="Login Icon"
                                    className="h-15 w-14 object-contain"
                                />
                            </div>

                            <h2 className="text-3xl font-extrabold text-white mb-2">
                                Maligayang Pag-login!
                            </h2>
                            <p className="text-white">
                                I-enter ang iyong account sa ibaba.
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

                            <div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                    placeholder="Password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <div className="text-red-100 mt-2 text-sm">{errors.password}</div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-white hover:text-gray-200 transition-colors duration-200"
                                >
                                    Forgot password?
                                </Link>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#5A3416] hover:bg-[#3d2410] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 transition-colors duration-200"
                                >
                                    {processing ? "Maghintay..." : "Magpatuloy"}
                                </button>
                            </div>
                        </form>

                        <div className="text-center mt-6">
                            <Link
                                href={route("welcome")}
                                className="text-sm text-gray-200 hover:text-gray-100 transition-colors duration-200"
                            >
                                Bumalik
                            </Link>
                        </div>
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
