import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import CharacterCard from '@/Components/CharacterCard';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Welcome({ auth }: PageProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <>
            <Head title="Welcome" />

            <div className={`min-h-screen bg-white font-sans ${showLoginModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
                <div
                    className="relative flex flex-col md:flex-row items-center justify-between h-screen bg-orange-50 overflow-hidden px-0 pt-0 pb-0"
                    style={{ background: "url('/Img/LandingPage/Header_BG.png') left top / 100% 100% no-repeat" }}
                >
                    <div className="z-10 flex-1 flex flex-col items-start justify-center max-w-lg">
                        <div className="absolute left-10 top-10">
                            <img src="/Img/LandingPage/Title.png" alt="RizHub Logo" className="h-[120px] w-auto" />
                        </div>
                        <p 
                            className="absolute top-[180px] left-10 font-['Inter'] font-medium text-[22px] leading-[36px] text-[#282725] mt-8 ml-2 mb-0 max-w-2xl text-left"
                            style={{ 
                                lineHeight: '36px', 
                                color: '#282725', 
                                textShadow: '0px 4px 4px rgba(0,0,0,0.25)'
                            }}
                        >
                            Igniting Minds with Rizal’s Legacy! Your ultimate game- <br /> based hub for mastering Noli Me Tangere, crafted to <br />inspire and engage young learners.
                        </p>
                        <div className="absolute left-[350px] top-[365px] flex items-center mt-10 mb-0 ml-2">
                            <button
                                className="w-[340px] h-[90px] bg-orange-500 hover:bg-orange-600 text-white text-4xl font-extrabold rounded-[60px] border-[8px] border-[#C97B3A] shadow-lg flex items-center justify-center drop-shadow-[0_8px_0_#9B4A1B,0_4px_4px_rgba(0,0,0,0.25)]"
                                style={{
                                    filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.25))',
                                    boxShadow: '8px 12px 0px #9B4A1B, 0px 4px 4px rgba(0,0,0,0.25)'
                                }}
                                onClick={() => {
                                    if (auth.user) {
                                        window.location.href = route('dashboard');
                                    } else {
                                        setShowLoginModal(true);
                                    }
                                }}
                            >
                                START
                            </button>
                        </div>
                    </div>
                    <div className="hidden md:block flex-1 relative h-full">
                        <div className="absolute inset-0 z-0 opacity-80" style={{ background: "url('/Img/LandingPage/quiz-cards-bg.png') center center/cover repeat" }} />
                        <div className="relative z-10 text-center mt-2">
                        </div>
                    </div>
                </div>

                {/* Learn Section */}
                <section className="bg-[#F4F2EC] py-12 text-center px-4 border-t-[1px] border-b-[1px] border-[#282725]">
                    <div className='flex flex-row justify-around'>
                        <div>
                            <img src="/Img/LandingPage/square1.png" alt="" className='h-[300px]' />
                        </div>
                        <div className='w-[800px] flex flex-col justify-around items-end gap-4'>
                            <h2 
                                className="font-['Inter'] not-italic font-extrabold text-[45px] leading-[69px] mb-2 text-right"
                                style={{
                                    color: '#FAAB36',
                                    textShadow: '-3px 5px 0px #282725'
                                }}
                            >
                                Learn and ignite your knowledge <br /> of Noli Me Tangere
                            </h2>
                            <p className="text-[#282725] text-right font-['Inter'] text-[22px] leading-[28px]">
                                Grow your understanding of Noli Me Tangere <br /> and be recognized with exciting achievements
                            </p>
                            <Link
                                href={route('login')}
                                className="mt-4 inline-block px-5 py-2 rounded font-semibold w-[300px] text-[18px] text-[#282725] border-2 border-[#282725] shadow-lg hover:bg-orange-600"
                                style={{
                                    background: '#FAAB36',
                                    boxShadow: '-2px 4px 0px #282725',
                                    border: '2px solid #282725',
                                }}
                            >
                                Start Learning »
                            </Link>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="px-6 py-12 bg-white text-center border-b-[1px] border-[#282725]">
                    <div className='flex flex-row items-center justify-around'>
                        <div className='h-auto flex gap-3 flex-col'>
                            <h2 
                                className="font-['Inter'] not-italic font-extrabold text-[45px] leading-[69px] mb-2 text-left"
                                style={{
                                    color: '#FF9500',
                                    textShadow: '-3px 5px 0px #282725'
                                }}
                            >
                                About RizHub</h2>   
                            <p className="text-[#282725] text-left font-['Inter'] font-medium text-[22px] leading-[28px] w-[500px]">
                                RizHub is a web-based, game-integrated learning platform designed to enhance students' understanding of Noli Me Tangere. Whether you're new to the novel or seeking a deeper grasp of its themes and characters, RizHub offers interactive learning tool, engaging quizzes, and immersive gameplay. Join RizHub and experience a new way of learning Rizal’s masterpiece!
                            </p>
                        </div>
                         <div>
                            <img src="/Img/LandingPage/design1.png" alt=""  className='h-[400px]'/>
                        </div>
                   </div>
                </section>

                {/* Characters Section */}
                <section className="bg-gray-50 py-12 px-4 text-center border-b-[1px] border-[#282725]">
                    <h2 className="font-['Inter'] not-italic font-extrabold text-[45px] leading-[69px] mb-10"
                        style={{
                            color: '#249EA0',
                            textShadow: '-3px 5px 0px #282725'
                        }}
                    >Noli Me Tangere Main Characters</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 max-w-5xl mx-auto justify-items-center">
                        <CharacterCard
                            name="Crisostomo Ibarra"
                            detail="Si Crisostomo ay binatang anak ni Don Rafael Ibarra na nag-aral sa Europa. Siya ang kababata at kasintahan ni Maria Clara."
                            imgSrc="/Img/LandingPage/character/char-1.png"
                        />
                        <CharacterCard
                            name="Maria Clara"
                            detail="Si Maria Clara ay mayuming kasintahan ni Crisostomo Ibarra. Siya ang anak ni Donya Pia Alba kay Padre Damaso."
                            imgSrc="/Img/LandingPage/character/char-2.png"
                            
                        />
                        <CharacterCard
                            name="Padre Damaso"
                            detail="Si Padre Damaso ay isang paring Pransiskano na matapos maglingkod nang mahabang panahon sa San Diego ay naipalipat sa ibang parokya. Siya ang tunay na ama ni Maria Clara."
                            imgSrc="/Img/LandingPage/character/char-3.png"
                        />
                        <CharacterCard
                            name="Crispin"
                            detail="Si Crispin ay nakababatang anak ni Sisa. Siya ay isang sakristan at tagatugtog ng kampana sa simbahan ng San Diego."
                            imgSrc="/Img/LandingPage/character/char-4.png"
                        />
                        <CharacterCard
                            name="Sisa"
                            detail="Si Sisa ay ina nina Crispin at Basilio. Siya ay martir na asawa ni Pedro na pabaya at malupit sa kanyang pamilya."
                            imgSrc="/Img/LandingPage/character/char-5.png"
                        />
                        <CharacterCard
                            name="Padre Salvi"
                            detail="Si Padre Salvi ay humalili kay Padre Damaso bilang pari ng San Diego. Siya ay may lihim na pagsinta kay Maria Clara."
                            imgSrc="/Img/LandingPage/character/char-6.png"
                        />
                        <CharacterCard
                            name="Kapitan Heneral"
                            detail="Ang Kapitan Heneral ay ang pinakamakapangyarihan sa Pilipinas. Siya ang lumakad na maalisan ng pagka-ekskomunyon si Ibarra."
                            imgSrc="/Img/LandingPage/character/char-7.png"
                        />
                        <CharacterCard
                            name="Tenyente Guevarra"
                            detail="Si Tenyente Guevarra ay isang matapat na tenyente ng mga guwardiya sibil."
                            imgSrc="/Img/LandingPage/character/char-8.png"
                        />
                    </div>
                </section>

                <section style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}} className='py-5'>
                    <div className='flex flex-row justify-between'>
                        <div>
                            <img src="/Img/LandingPage/square2.png" alt="" className="h-[500px]"/>
                        </div>
                        <div className='flex flex-col items-center justify-center gap-4'>
                           <img src="/Img/LandingPage/jose.png" alt="" className="h-[230px]" />
                           <h2 className="font-['Inter'] font-extrabold text-[40px] w-[500px] leading-[45px]">Lessons inspired by the world of Noli Me Tangere</h2>
                        </div>
                        <div>
                            <img src="/Img/LandingPage/square3.png" alt="" className="h-[300px]" />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-6 text-center">
                    <div className="flex justify-center mt-4">
                        <img src="/Img/LandingPage/fchar.png" alt="Footer Characters" className="h-auto w-full" />
                    </div>
                    <p className="mt-2 text-[#282725] font-['Inter'] font-medium text-[22px] ">© 2025 RizHub. All rights reserved.</p>
                </footer>
            </div>
            <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </>
    );
}

type LoginModalProps = {
    open: boolean;
    onClose: () => void;
};

function LoginModal({ open, onClose }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

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
        terms: false,
    });

    const handleClose = () => {
        loginReset('password');
        regReset('password');
        onClose();
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        loginPost(route('login'), {
            onSuccess: () => {
                loginReset();
                handleClose();
            }
        });
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        regPost(route('register'), {
            onSuccess: () => {
                regReset();
                handleClose();
            }
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
            <div className="fixed top-8 right-12 z-50 flex">
                <button
                    className={`fixed right-[190px] px-12 py-4 rounded-full font-extrabold text-2xl transition-all duration-200 focus:outline-none
                        ${isLogin
                            ? 'bg-[#E26F42] text-white z-[100]'
                            : 'bg-[#5A3416] text-white'
                        }
                    `}
                    style={
                        isLogin
                            ? {}
                            : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
                    }
                    onClick={() => setIsLogin(true)}
                >
                    login
                </button>
                <button
                    className={`fixed right-[60px] px-12 py-4 rounded-full font-extrabold text-2xl transition-all duration-200 focus:outline-none
                        ${!isLogin
                            ? 'bg-[#E26F42] text-white z-[100]'
                            : 'bg-[#5A3416] text-white'
                        }
                    `}
                    style={
                        !isLogin
                            ? {} // No border radius override when active
                            : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                    }
                    onClick={() => setIsLogin(false)}
                >
                    signup
                </button>
            </div>
            <div className="bg-[#FA7816] rounded-2xl shadow-2xl p-6 w-full max-w-md relative flex flex-col items-center">
                {/* Close button */}
                <button
                    className="absolute top-3 left-4 text-white text-xl hover:text-[#5A3416] font-bold"
                    onClick={handleClose}
                    aria-label="Close"
                >✕</button>
                {/* Icon and Title */}
                <div className="flex flex-col items-center mt-2 mb-1">
                    {isLogin && (
                        <img src="/Img/LandingPage/quill.png" alt="Quill Icon" className="w-14 h-14 mb-1" />
                    )}
                    <h2 className="text-white text-2xl font-extrabold mb-4 mt-1 text-center drop-shadow">Welcome!!!</h2>
                </div>
                {/* Forms */}
                {isLogin ? (
                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                        {/* Email */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="login_email"
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={e => setLoginData('email', e.target.value)}
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                placeholder="email"
                                required
                            />
                            <label
                                htmlFor="login_email"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${loginData.email ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                email:
                            </label>
                        </div>
                        {/* Password */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="login_password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={loginData.password}
                                onChange={e => setLoginData('password', e.target.value)}
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                placeholder="password"
                                required
                                style={{ border: '2px solid #fff' }}
                            />
                            <label
                                htmlFor="login_password"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${loginData.password ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                password:
                            </label>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3416] text-lg"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.234.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                            <a href={route('password.request')} className="absolute right-0 bottom-[-22px] text-[#5A3416] text-xs underline hover:text-[#FF9B50]">forgot password</a>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 rounded-full bg-[#5A3416] text-white text-lg font-bold py-2.5 transition-all duration-200 hover:bg-[#3d2410]"
                            disabled={loginProcessing}
                        >
                            login
                        </button>
                        <div className="w-full text-center mt-2">
                            <span className="text-[#5A3416] text-sm">new to rithub? </span>
                            <button
                                type="button"
                                className="text-[#5A3416] underline font-semibold hover:text-[#FF9B50] text-sm"
                                onClick={() => setIsLogin(false)}
                            >Register</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegister} className="w-full flex flex-col items-center">
                        {/* Name */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="reg_name"
                                type="text"
                                name="name"
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                value={regData.name}
                                onChange={e => setRegData('name', e.target.value)}
                                placeholder="name"
                                required
                                style={{ border: '2px solid #fff' }}
                            />
                            <label
                                htmlFor="reg_name"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${regData.name ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                name:
                            </label>
                        </div>
                        {/* Email */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="reg_email"
                                type="email"
                                name="email"
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                value={regData.email}
                                onChange={e => setRegData('email', e.target.value)}
                                placeholder="email"
                                required
                                style={{ border: '2px solid #fff' }}
                            />
                            <label
                                htmlFor="reg_email"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${regData.email ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                email:
                            </label>
                        </div>
                        {/* Password */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="reg_password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={regData.password}
                                onChange={e => setRegData('password', e.target.value)}
                                placeholder="password"
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                required
                                style={{ border: '2px solid #fff' }}
                            />
                            <label
                                htmlFor="reg_password"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${regData.password ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                password:
                            </label>
                        </div>
                        {/* Confirm Password */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="reg_password_confirmation"
                                type={showPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={regData.password_confirmation}
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                onChange={e => setRegData('password_confirmation', e.target.value)}
                                placeholder="confirm password"
                                required
                                style={{ border: '2px solid #fff' }}
                            />
                            <label
                                htmlFor="reg_password_confirmation"
                                className={`
                                    absolute left-6 top-1/2 -translate-y-1/2 text-white text-base mb-1 ml-3 pointer-events-none transition-all duration-200
                                    peer-focus:-top-1 peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                    ${regData.password_confirmation ? '-top-[4px] left-[20px] text-xs text-white' : ''}
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                confirm password:
                            </label>
                        </div>
                        <div className="w-full mb-2 flex items-center justify-center">
                            <input
                                id="terms"
                                type="checkbox"
                                checked={regData.terms ?? false}
                                onChange={e => setRegData('terms', e.target.checked)}
                                required
                                className="mr-2 accent-[#5A3416]" // This sets the check color
                            />

                            <label htmlFor="terms" className="text-[#5A3416] text-sm select-none">
                                I agree to the{' '}
                                <span className="relative group cursor-pointer underline font-semibold">
                                    Terms of Service
                                    <div className="absolute left-0 bottom-6 z-50 hidden group-hover:block w-72 bg-white text-[#282725] text-xs rounded shadow-lg p-4 border border-[#FF9B50]">
                                        {/* Replace with your actual terms */}
                                        <strong>Terms of Service</strong><br />
                                        By using RizHub, you agree to abide by all rules and policies. Do not misuse the platform. See full terms on our website.
                                    </div>
                                </span>
                                {' '}and{' '}
                                <span className="relative group cursor-pointer underline font-semibold">
                                    Privacy Policy
                                    <div className="absolute left-0 bottom-6 z-50 hidden group-hover:block w-72 bg-white text-[#282725] text-xs rounded shadow-lg p-4 border border-[#FF9B50]">
                                        {/* Replace with your actual privacy policy */}
                                        <strong>Privacy Policy</strong><br />
                                        Your information is kept private and secure. We do not share your data with third parties. See full policy on our website.
                                    </div>
                                </span>
                                .
                            </label>
                             <p className='text-red-700'>*</p>
                        </div>
                        <button
                            type="submit"
                            className="w-full mt-4 rounded-full bg-[#5A3416] text-white text-lg font-bold py-2.5 transition-all duration-200 hover:bg-[#3d2410]"
                            disabled={regProcessing}
                        >
                            signup
                        </button>
                        <div className="w-full text-center mt-2">
                            <span className="text-[#5A3416] text-sm">Already have an account? </span>
                            <button
                                type="button"
                                className="text-[#5A3416] underline font-semibold hover:text-[#FF9B50] text-sm"
                                onClick={() => setIsLogin(true)}
                            >Log in</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
