import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import CharacterCard from '@/Components/CharacterCard';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import TermsOfServiceModal  from '../Pages/Login/TermsOfServiceModal'
import PrivacyPolicyModal   from '../Pages/Login/PrivacyPolicyModal'

export default function Welcome({ auth }: PageProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    
    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
        if (!auth.user && params.get("login") === "1") {
            setShowLoginModal(true);
        }
    }, [auth.user]);


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
                    >
                        Noli Me Tangere Main Characters
                    </h2>

                    <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
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
                            detail="Si Padre Salvi ay humalili kay Padre Damaso bilang pari ng San Diego. 
Siya ay may lihim na pagsinta kay Maria Clara."
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
            <LoginModal 
                open={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
                setShowTermsModal={setShowTermsModal} 
                setShowPrivacyModal={setShowPrivacyModal} 
             />
             <TermsOfServiceModal 
                open={showTermsModal} 
                onClose={() => setShowTermsModal(false)} 
            />
            <PrivacyPolicyModal 
                open={showPrivacyModal} 
                onClose={() => setShowPrivacyModal(false)} 
            />
        </>
    );
}

type LoginModalProps = {
    open: boolean;
    onClose: () => void;
    setShowTermsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setShowPrivacyModal: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoginModal({ open, onClose, setShowTermsModal, setShowPrivacyModal}: LoginModalProps) {
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
                            ? {}
                            : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                    }
                    onClick={() => setIsLogin(false)}
                >
                    signup
                </button>
            </div>
            <div className="bg-[#FA7816] rounded-2xl shadow-2xl p-6 w-full max-w-md relative flex flex-col items-center">
                <button
                    className="absolute top-3 left-4 text-white text-xl hover:text-[#5A3416] font-bold"
                    onClick={handleClose}
                    aria-label="Close"
                >✕</button>
                <div className="flex flex-col items-center mt-2 mb-1">
                    {isLogin && (
                        <img src="/Img/LandingPage/Login/quill.png" alt="Quill Icon" className="w-14 h-14 mb-1" />
                    )}
                    <h2 className="text-white text-2xl font-extrabold mb-4 mt-1 text-center drop-shadow">Welcome!!!</h2>
                </div>
                {isLogin ? (
                    <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
                        {/* Email */}
                        <div className="w-full mb-3 relative">
                            <input
                                id="login_email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={loginData.email}
                                onChange={e => setLoginData('email', e.target.value)}
                                className="peer w-full rounded-full px-5 py-2.5 text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                placeholder="email"
                                required
                            />
                            <label
                                htmlFor="login_email"
                                className={`
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${loginData.email
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${loginData.password
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
                                `}
                                style={{
                                    background: '#FA7816',
                                    padding: '0 6px',
                                    borderRadius: '8px',
                                }}
                            >
                                password:
                            </label>
                            {loginData.password && (
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3416] text-lg"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[16px] w-[16px]">
                                            <g clip-path="url(#clip0_502_2)">
                                            <path d="M10.6657 4.31697C10.252 3.63943 9.73003 3.03421 9.12067 2.52535L10.404 1.24201C10.4875 1.15557 10.5337 1.0398 10.5326 0.919622C10.5316 0.799448 10.4834 0.684492 10.3984 0.599514C10.3134 0.514535 10.1985 0.466333 10.0783 0.465288C9.95814 0.464244 9.84237 0.510441 9.75592 0.593931L8.3603 1.99139C7.49514 1.47752 6.50607 1.20969 5.49984 1.21681C2.6623 1.21681 1.0453 3.15922 0.333965 4.31697C0.114207 4.67241 -0.00219727 5.08204 -0.00219727 5.49993C-0.00219727 5.91782 0.114207 6.32745 0.333965 6.68289C0.747729 7.36043 1.26965 7.96565 1.87901 8.47451L0.595674 9.75785C0.551898 9.80013 0.516981 9.8507 0.492961 9.90662C0.46894 9.96254 0.456296 10.0227 0.455767 10.0835C0.455238 10.1444 0.466835 10.2047 0.48988 10.2611C0.512926 10.3174 0.546959 10.3686 0.589993 10.4116C0.633027 10.4546 0.684201 10.4887 0.740528 10.5117C0.796856 10.5348 0.857209 10.5464 0.918066 10.5458C0.978923 10.5453 1.03907 10.5327 1.09498 10.5086C1.1509 10.4846 1.20148 10.4497 1.24376 10.4059L2.64259 9.0071C3.50667 9.52089 4.49456 9.78918 5.49984 9.78306C8.33738 9.78306 9.95438 7.84064 10.6657 6.68289C10.8855 6.32745 11.0019 5.91782 11.0019 5.49993C11.0019 5.08204 10.8855 4.67241 10.6657 4.31697V4.31697ZM1.11497 6.20301C0.984403 5.99174 0.915247 5.74829 0.915247 5.49993C0.915247 5.25157 0.984403 5.00812 1.11497 4.79685C1.72638 3.8041 3.10826 2.13347 5.49984 2.13347C6.2608 2.12921 7.01107 2.31261 7.68426 2.66743L6.76163 3.59006C6.3216 3.29792 5.79405 3.16701 5.26849 3.21956C4.74293 3.27211 4.25174 3.50487 3.87826 3.87835C3.50478 4.25183 3.27202 4.74302 3.21947 5.26858C3.16692 5.79414 3.29782 6.32169 3.58997 6.76172L2.53122 7.82047C1.9698 7.36659 1.49072 6.81945 1.11497 6.20301V6.20301ZM6.87484 5.49993C6.87484 5.8646 6.72998 6.21434 6.47211 6.4722C6.21425 6.73007 5.86451 6.87493 5.49984 6.87493C5.29566 6.87414 5.09431 6.82713 4.91088 6.73743L6.73734 4.91097C6.82704 5.0944 6.87405 5.29575 6.87484 5.49993V5.49993ZM4.12484 5.49993C4.12484 5.13526 4.26971 4.78552 4.52757 4.52766C4.78543 4.2698 5.13517 4.12493 5.49984 4.12493C5.70402 4.12572 5.90537 4.17273 6.0888 4.26243L4.26234 6.08889C4.17264 5.90546 4.12563 5.70411 4.12484 5.49993ZM9.88472 6.20301C9.2733 7.19576 7.89142 8.86639 5.49984 8.86639C4.73888 8.87065 3.98861 8.68726 3.31542 8.33243L4.23805 7.40981C4.67808 7.70195 5.20563 7.83285 5.73119 7.7803C6.25675 7.72775 6.74794 7.49499 7.12142 7.12151C7.4949 6.74803 7.72766 6.25684 7.78021 5.73128C7.83276 5.20572 7.70186 4.67817 7.40972 4.23814L8.46847 3.17939C9.02988 3.63327 9.50896 4.18041 9.88472 4.79685C10.0153 5.00812 10.0844 5.25157 10.0844 5.49993C10.0844 5.74829 10.0153 5.99174 9.88472 6.20301V6.20301Z" fill="#5A3416"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_502_2">
                                            <rect width="11" height="11" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    ) : (
                                        <svg className="h-[16px] w-[16px]" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_504_12)">
                                            <path d="M10.6657 4.31696C9.95484 3.15921 8.33784 1.2168 5.49984 1.2168C2.66184 1.2168 1.04484 3.15921 0.333965 4.31696C0.114207 4.6724 -0.00219727 5.08203 -0.00219727 5.49992C-0.00219727 5.91781 0.114207 6.32744 0.333965 6.68288C1.04484 7.84063 2.66184 9.78305 5.49984 9.78305C8.33784 9.78305 9.95484 7.84063 10.6657 6.68288C10.8855 6.32744 11.0019 5.91781 11.0019 5.49992C11.0019 5.08203 10.8855 4.6724 10.6657 4.31696V4.31696ZM9.88426 6.20301C9.27376 7.19576 7.89188 8.86638 5.49984 8.86638C3.1078 8.86638 1.72592 7.19576 1.11542 6.20301C0.984861 5.99173 0.915705 5.74828 0.915705 5.49992C0.915705 5.25156 0.984861 5.00811 1.11542 4.79684C1.72592 3.80409 3.1078 2.13346 5.49984 2.13346C7.89188 2.13346 9.27376 3.80226 9.88426 4.79684C10.0148 5.00811 10.084 5.25156 10.084 5.49992C10.084 5.74828 10.0148 5.99173 9.88426 6.20301V6.20301Z" fill="#5A3416"/>
                                            <path d="M5.49992 3.20825C5.04667 3.20825 4.6036 3.34266 4.22674 3.59447C3.84988 3.84628 3.55615 4.20419 3.3827 4.62294C3.20924 5.04168 3.16386 5.50246 3.25229 5.947C3.34071 6.39154 3.55897 6.79988 3.87947 7.12037C4.19996 7.44087 4.6083 7.65913 5.05284 7.74755C5.49738 7.83598 5.95815 7.79059 6.3769 7.61714C6.79565 7.44369 7.15356 7.14996 7.40537 6.7731C7.65718 6.39624 7.79159 5.95317 7.79159 5.49992C7.79086 4.89235 7.54918 4.30988 7.11957 3.88027C6.68996 3.45066 6.10748 3.20898 5.49992 3.20825V3.20825ZM5.49992 6.87492C5.22797 6.87492 4.96213 6.79428 4.73601 6.64319C4.50989 6.4921 4.33366 6.27736 4.22959 6.02611C4.12551 5.77486 4.09829 5.49839 4.15134 5.23167C4.20439 4.96495 4.33535 4.71994 4.52765 4.52765C4.71994 4.33535 4.96495 4.20439 5.23167 4.15134C5.49839 4.09828 5.77486 4.12551 6.02611 4.22958C6.27736 4.33365 6.4921 4.50989 6.64319 4.73601C6.79428 4.96213 6.87492 5.22797 6.87492 5.49992C6.87492 5.86459 6.73005 6.21433 6.47219 6.47219C6.21433 6.73005 5.86459 6.87492 5.49992 6.87492Z" fill="#5A3416"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_504_12">
                                            <rect width="11" height="11" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    )}
                                </button>
                            )}
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
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${regData.name
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${regData.email
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${regData.password
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                    absolute left-6 text-white text-base pointer-events-none transition-all duration-200
                                    ${regData.password_confirmation
                                        ? "-top-2 left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                className="mr-2 accent-[#5A3416]"
                            />

                            <label htmlFor="terms" className="text-[#5A3416] text-sm select-none">
                                I agree to the{' '}
                                <button
                                type="button"
                                className="underline font-semibold hover:text-[#FF9B50]"
                                onClick={() => setShowTermsModal(true)}
                                >
                                Terms of Service
                                </button>
                                {' '}and{' '}
                                <button
                                type="button"
                                className="underline font-semibold hover:text-[#FF9B50]"
                                onClick={() => setShowPrivacyModal(true)}
                                >
                                Privacy Policy
                                </button>
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
