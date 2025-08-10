import { useState, useEffect, FormEventHandler } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    // Login form state
    const { data: loginData, setData: setLoginData, post: loginPost, processing: loginProcessing, errors: loginErrors, reset: loginReset } = useForm({
        email: '',
        password: '',
    });

    // Register form state
    const { data: regData, setData: setRegData, post: regPost, processing: regProcessing, errors: regErrors, reset: regReset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            loginReset('password');
            regReset('password', 'password_confirmation');
        };
    }, []);

    const handleLogin: FormEventHandler = (e) => {
        e.preventDefault();
        loginPost(route('login'));
    };

    const handleRegister: FormEventHandler = (e) => {
        e.preventDefault();
        regPost(route('register'));
    };

    return (
        <GuestLayout>
            <Head title={isLogin ? "Login" : "Register"} />

            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 rounded-l ${isLogin ? 'bg-orange-500 text-white' : 'bg-orange-200'}`}
                    onClick={() => setIsLogin(true)}
                    type="button"
                >
                    Login
                </button>
                <button
                    className={`px-4 py-2 rounded-r ${!isLogin ? 'bg-orange-500 text-white' : 'bg-orange-200'}`}
                    onClick={() => setIsLogin(false)}
                    type="button"
                >
                    Register
                </button>
            </div>

            {isLogin ? (
                <form onSubmit={handleLogin}>
                    <div>
                        <InputLabel htmlFor="login_email" value="Email" />
                        <TextInput
                            id="login_email"
                            type="email"
                            name="email"
                            value={loginData.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={e => setLoginData('email', e.target.value)}
                            required
                        />
                        <InputError message={loginErrors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="login_password" value="Password" />
                        <TextInput
                            id="login_password"
                            type="password"
                            name="password"
                            value={loginData.password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={e => setLoginData('password', e.target.value)}
                            required
                        />
                        <InputError message={loginErrors.password} className="mt-2" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <Link href={route('password.request')} className="text-sm text-gray-600 hover:text-gray-900">
                            Forgot password?
                        </Link>
                        <PrimaryButton className="ms-4" disabled={loginProcessing}>
                            Login
                        </PrimaryButton>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleRegister}>
                    <div>
                        <InputLabel htmlFor="reg_name" value="Name" />
                        <TextInput
                            id="reg_name"
                            name="name"
                            value={regData.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused={true}
                            onChange={e => setRegData('name', e.target.value)}
                            required
                        />
                        <InputError message={regErrors.name} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="reg_email" value="Email" />
                        <TextInput
                            id="reg_email"
                            type="email"
                            name="email"
                            value={regData.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={e => setRegData('email', e.target.value)}
                            required
                        />
                        <InputError message={regErrors.email} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="reg_password" value="Password" />
                        <TextInput
                            id="reg_password"
                            type="password"
                            name="password"
                            value={regData.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={e => setRegData('password', e.target.value)}
                            required
                        />
                        <InputError message={regErrors.password} className="mt-2" />
                    </div>
                    <div className="mt-4">
                        <InputLabel htmlFor="reg_password_confirmation" value="Confirm Password" />
                        <TextInput
                            id="reg_password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={regData.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={e => setRegData('password_confirmation', e.target.value)}
                            required
                        />
                        <InputError message={regErrors.password_confirmation} className="mt-2" />
                    </div>
                    <div className="flex items-center justify-end mt-4">
                        <PrimaryButton className="ms-4" disabled={regProcessing}>
                            Register
                        </PrimaryButton>
                    </div>
                </form>
            )}
        </GuestLayout>
    );
}