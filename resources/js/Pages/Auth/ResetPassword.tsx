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
    const [showMatchMessage, setShowMatchMessage] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    // Track live password checks
    const [passwordChecks, setPasswordChecks] = useState({
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false,
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    // Handle live password validation
    useEffect(() => {
        const pass = data.password;
        setPasswordChecks({
            hasUppercase: /[A-Z]/.test(pass),
            hasLowercase: /[a-z]/.test(pass),
            hasNumber: /\d/.test(pass),
            hasSpecialChar: /[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass),
            hasMinLength: pass.length >= 8,
        });
    }, [data.password]);

    // Match message toggle
    useEffect(() => {
        if (data.password_confirmation) {
            setShowMatchMessage(true);
            const timer = setTimeout(() => setShowMatchMessage(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [data.password, data.password_confirmation]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const allValid = Object.values(passwordChecks).every(Boolean);
        if (!allValid) {
            setToastMessage("Password does not meet all requirements!");
            setShowToast(true);
            return;
        }

        if (data.password !== data.password_confirmation) {
            setToastMessage("Passwords do not match!");
            setShowToast(true);
            return;
        }

        post(route("password.store"), {
            onSuccess: () => {
                setToastMessage("Your password has been reset successfully!");
                setShowToast(true);
                // Redirect to welcome page instead of dashboard
                setTimeout(() => window.location.href = route("Welcome"), 2000);
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
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Password Requirements - Styled like the image */}
            {isPasswordFocused && (
                <div className="fixed right-8 top-1/2 transform -translate-y-1/2 w-72 z-50">
                    <div className="relative p-6 bg-white rounded-lg shadow-xl border border-gray-200">
                        
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Password</h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Password must meet the following criteria:
                            </p>
                        </div>
                        
                        <ul className="space-y-3">
                            <li className={`flex items-start ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-gray-600'}`}>
                                <span className={`mr-3 mt-0.5 flex-shrink-0 ${passwordChecks.hasUppercase ? 'text-green-500' : 'text-gray-400'}`}>
                                    {passwordChecks.hasUppercase ? '✓' : '•'}
                                </span>
                                <span className="text-sm">Contain at least one uppercase letter (A-Z)</span>
                            </li>
                            <li className={`flex items-start ${passwordChecks.hasLowercase ? 'text-green-600' : 'text-gray-600'}`}>
                                <span className={`mr-3 mt-0.5 flex-shrink-0 ${passwordChecks.hasLowercase ? 'text-green-500' : 'text-gray-400'}`}>
                                    {passwordChecks.hasLowercase ? '✓' : '•'}
                                </span>
                                <span className="text-sm">Contain at least one lowercase letter (a-z)</span>
                            </li>
                            <li className={`flex items-start ${passwordChecks.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                                <span className={`mr-3 mt-0.5 flex-shrink-0 ${passwordChecks.hasNumber ? 'text-green-500' : 'text-gray-400'}`}>
                                    {passwordChecks.hasNumber ? '✓' : '•'}
                                </span>
                                <span className="text-sm">Contain at least one number (0-9)</span>
                            </li>
                            <li className={`flex items-start ${passwordChecks.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                                <span className={`mr-3 mt-0.5 flex-shrink-0 ${passwordChecks.hasSpecialChar ? 'text-green-500' : 'text-gray-400'}`}>
                                    {passwordChecks.hasSpecialChar ? '✓' : '•'}
                                </span>
                                <span className="text-sm">
                                    Contain at least one special character (~!@#$%^&*()_+`-=\|[]&#123;&#125;;':",./&lt;&gt;?)
                                </span>
                            </li>
                            <li className={`flex items-start ${passwordChecks.hasMinLength ? 'text-green-600' : 'text-gray-600'}`}>
                                <span className={`mr-3 mt-0.5 flex-shrink-0 ${passwordChecks.hasMinLength ? 'text-green-500' : 'text-gray-400'}`}>
                                    {passwordChecks.hasMinLength ? '✓' : '•'}
                                </span>
                                <span className="text-sm">Be at least 8 characters long</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ✅ Main Form Container */}
            <div className="relative z-10 flex max-w-4xl w-full">
                {/* ✅ Form Box */}
                <div className="flex max-w-3xl w-full bg-[#FA7816] rounded-2xl shadow-xl overflow-hidden">
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
                                Mag-reset ng bagong password upang mabalik ang iyong account!
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
                                    Bagong Password
                                </h2>
                                <p className="text-white">
                                    I-enter ang bagong Password sa ibaba at i-access ang iyong account.
                                </p>
                            </div>

                            {/* ✅ Password Reset Form */}
                            <form onSubmit={submit} className="space-y-5">
                                {/* Email */}
                                <div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        onChange={(e) => setData("email", e.target.value)}
                                        className="mt-1 block w-full px-4 py-3 rounded-md border border-gray-300 
                                        placeholder-gray-500 focus:outline-none focus:ring-2 
                                        focus:ring-offset-2 focus:ring-orange-500"
                                        placeholder="Email address"
                                        required
                                        autoFocus
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData("password", e.target.value)}
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => setIsPasswordFocused(false)}
                                        placeholder="New Password"
                                        required
                                        className={`mt-1 block w-full px-4 py-3 rounded-md border-2 font-semibold transition-all
                                            ${
                                                data.password_confirmation
                                                    ? data.password === data.password_confirmation
                                                        ? "border-green-500 bg-green-100"
                                                        : "border-red-500 bg-red-100"
                                                    : "border-gray-300"
                                            } placeholder-gray-500 focus:outline-none focus:ring-2 
                                            focus:ring-offset-2 focus:ring-orange-500`}
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        onChange={(e) => setData("password_confirmation", e.target.value)}
                                        placeholder="Confirm Password"
                                        required
                                        className={`mt-1 block w-full px-4 py-3 rounded-md border-2 font-semibold transition-all
                                            ${
                                                data.password_confirmation
                                                    ? data.password === data.password_confirmation
                                                        ? "border-green-500 bg-green-100"
                                                        : "border-red-500 bg-red-100"
                                                    : "border-gray-300"
                                            } placeholder-gray-500 focus:outline-none focus:ring-2 
                                            focus:ring-offset-2 focus:ring-orange-500`}
                                    />
                                    {showMatchMessage && (
                                        <p
                                            className={`text-xs mt-1 font-semibold ${
                                                data.password === data.password_confirmation
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {data.password === data.password_confirmation
                                                ? "Passwords match!"
                                                : "Passwords do not match!"}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full 
                                    shadow-sm text-sm font-medium text-white bg-[#5A3416] 
                                    hover:bg-[#3d2410] focus:outline-none focus:ring-2 
                                    focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-75 
                                    transition-colors duration-200"
                                >
                                    {processing ? "Resetting..." : "I-reset ang Password"}
                                </button>

                                <div className="text-center">
                                    <Link
                                        href={route("welcome")}
                                        className="text-sm text-gray-200 hover:text-gray-100 transition-colors duration-200"
                                    >
                                        Bumalik sa Login
                                    </Link>
                                </div>
                            </form>
                        </div>
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
