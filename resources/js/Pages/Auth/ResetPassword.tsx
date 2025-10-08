import { useEffect, useState, FormEventHandler } from "react";
import { Head, useForm, Link } from "@inertiajs/react";

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("password.store"), {
        onSuccess: () => {
            setToastMessage("Your password has been reset successfully!");
            setShowToast(true);

            // Show toast for a short moment, then redirect to dashboard
            setTimeout(() => {
                window.location.href = "/Dashboard"; // 👈 redirects user
            }, 2000);
        },
    });
};
    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/Img/VerificationPage/color-bg.png')" }}
        >
            <Head title="Reset Password" />

            {/* ✅ Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-fadeIn">
                    <div className="p-4 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 shadow-lg max-w-sm">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-orange-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 
                                        7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 
                                        0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium">{toastMessage}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 flex">
                                <button
                                    className="inline-flex text-orange-500 hover:text-orange-700 focus:outline-none"
                                    onClick={() => setShowToast(false)}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 
                                            8.586l4.293-4.293a1 1 0 111.414 
                                            1.414L11.414 10l4.293 
                                            4.293a1 1 0 01-1.414 
                                            1.414L10 11.414l-4.293 
                                            4.293a1 1 0 01-1.414-1.414L8.586 
                                            10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Form box */}
            <div className="relative z-10 flex max-w-3xl w-full bg-[#FA7816] rounded-2xl shadow-xl overflow-hidden">
                {/* Left Illustration */}
                <div className="hidden md:flex w-1/2 items-center justify-center relative bg-orange-100">
                    <img
                        src="/Img/LandingPage/character/noli-form.gif"
                        alt="Reset Illustration"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-center p-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                            blur-3xl animate-pulse opacity-70 -z-10"></div>

                        <h2 className="text-[#FA7816] text-lg md:text-2xl font-extrabold drop-shadow-md leading-snug max-w-xs">
                            Set your new password and get back to your adventure!
                        </h2>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-8">
                            <div className="mx-auto flex items-center justify-center mb-4">
                                <img
                                    src="/Img/LandingPage/Login/quill.png"
                                    alt="Reset Password Icon"
                                    className="h-28 w-28 object-contain"
                                />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-2">
                                Create New Password
                            </h2>
                            <p className="text-white">
                                Enter your new password below to regain access to your account.
                            </p>
                        </div>

                        {/* ✅ Password Reset Form */}
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 
                                    placeholder-gray-500 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-orange-500"
                                    placeholder="Email address"
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full px-4 rounded-md border border-gray-300 
                                    placeholder-gray-500 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-orange-500"
                                    placeholder="New Password"
                                    onChange={(e) => setData("password", e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className={`mt-1 block w-full px-4 py-3 rounded-md border 
                                    ${data.password_confirmation && data.password !== data.password_confirmation
                                            ? "border-red-500 bg-red-100"
                                            : "border-gray-300"}
                                    placeholder-gray-500 focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-orange-500 transition-all`}
                                    placeholder="Confirm Password"
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    required
                                />
                            </div>

<button
    type="submit"
    disabled={processing}
    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md 
    shadow-sm text-sm font-medium text-white bg-[#5A3416] 
    hover:bg-[#3d2410] focus:outline-none focus:ring-2 
    focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 
    transition-colors duration-200"
>
    {processing ? "Resetting..." : "Reset Password"}
</button>


                            <div className="text-center">
                                <Link
                                    href={route("welcome")}
                                    className="text-sm text-gray-200 hover:text-gray-100 transition-colors duration-200"
                                >
                                    Back to Login
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
