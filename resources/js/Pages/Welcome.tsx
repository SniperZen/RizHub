import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import CharacterCard from '@/Components/CharacterCard';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import TermsOfServiceModal from '../Pages/Login/TermsOfServiceModal';
import PrivacyPolicyModal from '../Pages/Login/PrivacyPolicyModal';
import { motion, AnimatePresence, Easing} from "framer-motion";


// Preload background images
const preloadImages = () => {
  const imageUrls = [
    '/Img/LandingPage/noli-bg.png',
    '/Img/LandingPage/Header-BG2.png',
    '/Img/LandingPage/lp-books.png',
    '/Img/LandingPage/Header_BG.png',
    '/Img/LandingPage/quiz-cards-bg.png'
  ];
  
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Animation variants for consistent transitions - USE ARRAY FORMAT with 'as const'
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94] as const, // Use array with 'as const'
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: [0.25, 0.46, 0.45, 0.94] as const // Use array with 'as const'
    }
  }
};



// Custom hook for scroll-triggered animations with re-trigger on scroll up
const useScrollAnimation = (ref: React.RefObject<HTMLElement>, threshold = 0.15) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger animation when element enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // Only hide when scrolling up past the element
          if (entry.boundingClientRect.top > 0) {
            setIsVisible(false);
          }
        }
      },
      { 
        threshold,
        rootMargin: "-50px 0px -50px 0px" // Adjust margins for better triggering
      }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold]);
  
  return isVisible;
};

// Professional Image Slider Component
const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const images = [
    "/Img/LandingPage/char-noli.png",
    "/Img/LandingPage/character/char-1.png",
    "/Img/LandingPage/character/char-2.png",
    "/Img/LandingPage/character/char-3.png",
    "/Img/LandingPage/character/char-9.png"
  ];
  
  const transitionSpeeds = [4000, 3500, 3000, 4500, 4000];

  // Preload slider images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = images.map(src => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true); // Continue even if some images fail
      }
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (imagesLoaded) {
      startSlideshow();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [imagesLoaded, currentImageIndex]);

  const startSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, transitionSpeeds[currentImageIndex]);
  };

  if (!imagesLoaded) {
    return (
      <div className="relative w-full h-full flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      <div className="relative flex justify-center items-center w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute flex justify-center items-center w-full h-full"
          >
            <img
              src={images[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="object-contain max-w-full max-h-full"
              style={{ 
                filter: 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.25))'
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Animated Section Component with improved triggering
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isVisible = useScrollAnimation(ref);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  
  useEffect(() => {
    if (isVisible && !hasBeenVisible) {
      setHasBeenVisible(true);
    }
  }, [isVisible, hasBeenVisible]);
  
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isVisible || hasBeenVisible ? "visible" : "hidden"}
      variants={sectionVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Animated Item Component with subtle scale effect
const AnimatedItem = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Welcome({ auth }: PageProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imagesPreloaded, setImagesPreloaded] = useState(false);

    // Preload all images on component mount
    useEffect(() => {
      preloadImages();
      
      // Add a small delay to ensure smooth initial animation
      setTimeout(() => {
        setImagesPreloaded(true);
      }, 300);
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
        }, 3000); // Slightly slower for better UX
        
        return () => clearInterval(interval);
        }
    }, []);

    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      if (!auth.user && params.get("login") === "1") {
          setShowLoginModal(true);
      }
    }, [auth.user]);

    if (!imagesPreloaded) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 border-4 border-t-orange-500 border-r-transparent border-b-orange-500 border-l-transparent rounded-full animate-spin"
          ></motion.div>
        </div>
      );
    }
    

    return (
        <>
            <Head title="Welcome" />
            
            <div className={`min-h-screen font-sans ${showLoginModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
            {/* Hero Section - Always visible without scroll trigger */}
                    <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="
                        relative sm:h-[100vh] lg:h-[90px]
                        transition-transform flex flex-col md:flex-row
                        items-center justify-between min-h-screen
                        bg-orange-50 overflow-hidden px-4 md:px-0 pt-0 pb-0

                        /* Background for below 1024px (no noli-bg.png) */
                        bg-[url('/Img/LandingPage/Header-BG2.png'),url('/Img/LandingPage/icon-lp3.png'),url('/Img/LandingPage/lp-books1.png'),url('/Img/LandingPage/Header_BG.png')]
                        bg-left-top bg-cover bg-no-repeat

                        /* Background for 1024px and above (adds noli-bg.png) */
                        xl:bg-[url('/Img/LandingPage/noli-bg.png'),url('/Img/LandingPage/Header-BG2.png'),url('/Img/LandingPage/icon-lp3.png'),url('/Img/LandingPage/lp-books1.png'),url('/Img/LandingPage/Header_BG.png')]
                    "
                    >
                {/* The ImageSlider component */}
                <motion.div 
                className="absolute w-full h-full flex justify-center items-center"
                variants={itemVariants}
                transition={{ delay: 0.2 }}
                >
                {/* Hidden below lg, visible only on lg (1024px+) */}
                <div
                    className="hidden xl:block relative h-48 md:h-56 lg:h-64 overflow-hidden"
                    style={{ 
                    width: '100%', 
                    maxWidth: '1900px',
                    height: '570px',
                    left: '400px',
                    bottom: '70px',
                    maxHeight: '70vh'
                    }}
                >
                    <ImageSlider />
                </div>
                </motion.div>
                  
                  <div className="z-10 w-full md:flex-1 flex flex-col items-center md:items-start justify-center max-w-lg mx-auto md:mx-0 md:pl-10">
                    <motion.div 
                        className="mt-5 md:mt-5 absolute left-5 top-5  md:mb-15 md:left-10 md:top-5 lg:top-5 xl:top-5"
                        variants={itemVariants}
                        transition={{ delay: 0.1 }}
                    >
                        <img 
                            src="/Img/LandingPage/Title.png" 
                            alt="RizHub Logo" 
                            className="h-[80px] md:h-[90px] lg:h-[100px] transition-transform duration-300 hover:scale-105" 
                        />
                    </motion.div>
                      <motion.div 
                        className="absolute left-[4%] top-[150px] md:top-[160px] lg:top-[170px] xl:top-[170px] max-w-md text-center"
                        variants={itemVariants}
                        transition={{ delay: 0.3 }}
                      >
                            <p className="text-left font-['mono'] font-medium text-2xl md:text-2xl lg:text-2xl xl:text-2xl leading-8 lg:leading-10 text-[#282725]"
                          >
                             Magsimula sa paglalakbay ng diwa ni Rizal!<br/>
                             Damhin ang saya at aral ng Noli Me Tangere<br/>
                             sa isang kakaibang paglalakbay ng pagkatuto!
                          </p>
                        </motion.div>
                        <motion.div
                        className="absolute left-50 top-[370px] sm:left-[350px] sm:top-[370px] lg:top-[270px] xl:top-[280px] flex items-center mt-8 md:mt-8 mb-0 md:ml-2 z-50"
                        variants={itemVariants}
                        transition={{ delay: 0.4 }}
                        >
                        <motion.button
                        className="
                            absolute
                            w-[160px] md:w-[180px] lg:w-[220px] lg:top-[10px] lg:left-[-20px]
                            h-[50px] bottom-[60px] md:h-[60px] lg:h-[70px] lg:w-[210px]
                            bg-orange-500 hover:bg-orange-600 text-white 
                            text-2xl sm:text-2xl md:text-2xl lg:text-3xl font-extrabold
                            rounded-[50px] border-4 md:border-[6px] lg:border-[5px] border-[#C97B3A]
                            flex items-center justify-center
                            md:left-[-5px] md:bottom-[50px] xl:bottom-[30px]
                            z-50
"
                        style={{
                            boxShadow: '4px 6px 0px #402d22ff, 0px 2px 4px rgba(0,0,0,0.25)',
                            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.25))',
                        }}
                        onClick={() => setShowLoginModal(true)}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: '6px 8px 0px #9B4A1B, 0px 4px 8px rgba(0,0,0,0.3)',
                        }}
                        whileTap={{ scale: 0.98 }}
                        >
                        START
                        </motion.button>

                        </motion.div>

                  </div>
                  <motion.div 
                    className="hidden md:block flex-1 relative h-full"
                    variants={itemVariants}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="absolute inset-0 z-0 opacity-80" style={{ background: "url('/Img/LandingPage/quiz-cards-bg.png') center center/cover repeat" }} />
                  </motion.div>
                </motion.div>

                {/* About Section */}
                <AnimatedSection className="px-4 md:px-2 py-2 md:py-2 lg:px-2 lg:py-2 bg-[#F4F2EC] text-center border-b-[1px] border-t-[1px] border-[#282725]">
                    <div className='flex flex-col md:flex-row items-center justify-around mt-3'>
                        <AnimatedItem className='h-auto flex gap-3 flex-col order-2 md:order-1 mb-6 md:mb-6' delay={0.1}>
                            <h2 
                                className="font-['Inter'] not-italic font-extrabold text-4xl md:text-4xl lg:text-[55px] leading-[1.2] md:leading-[1.3] lg:leading-[69px] mb-2 text-center md:text-left"
                                style={{
                                    color: '#FF9500',
                                    textShadow: '-2px 3px 0px #282725'
                                }}
                            >
                                Tungkol sa RizHub
                            </h2>   
                            <p className="text-[#282725] text-justify font-['Inter'] font-medium text-base md:text-lg lg:text-[22px] leading-6 lg:leading-[28px] w-full md:w-[400px] lg:w-[500px]">
                            Ang RizHub ay isang makabagong kasangkapan sa pag-aaral, na inihandog upang higit na
                            mapalalim at mapagaan ang pag-unawa ng mga mag-aaral sa dakilang akda ni Rizal na
                            Noli Me Tangere. Kung ikaw ay unang tutuntong sa daigdig ng nobelang ito, o nais
                            mong higit pang makilala ang mga kaisipang nakapaloob dito — narito ang RizHub
                            upang maging gabay mo. Taglay nito ang mga masiglang animasyon, kawili-wiling
                            pagsusulit, at nakaaaliw na laruan ng isipan. Tuklasin ang RizHub at damhin ang isang
                            bagong paraan ng pag-aaral — isang paglalakbay sa diwa, damdamin, at talino ng ating
                            bayani.
                            </p>
                        <div className="flex justify-center lg:justify-start  md:justify-start">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link
                              href={route('login')}
                              className="mt-4 inline-block px-5 py-2 rounded font-semibold w-[250px] md:w-[280px] lg:w-[300px] text-base md:text-[18px] text-[#282725] border-2 border-[#282725] hover:bg-orange-600"
                              style={{
                              background: '#FAAB36',
                              boxShadow: '-2px 4px 0px #282725',
                              border: '2px solid #282725',
                              }}
                          >
                              Magsimula ng Pag-aaral »
                          </Link>
                        </motion.div>
                        </div>
                        
                        </AnimatedItem>
                        
                        <AnimatedItem className="order-1 md:order-2" delay={0.2}>
                        <motion.img 
                            src="/Img/LandingPage/design1.png" 
                            alt="RizHub Illustration"  
                            className="h-[200px] md:h-[320px] lg:h-[420px] transition-transform duration-300 hover:scale-90 drop-shadow-[0_10px_15px_rgba(0,0,0,0.25)]"
                            whileHover={{ rotate: 2 }}
                        />
                        </AnimatedItem>
                   </div>
                </AnimatedSection>

                {/* Characters Section */}
                <AnimatedSection className="bg-gray-50 py-5 md:py-5 lg:pb-10 px-10 lg:px-10 text-center border-b-[1px] border-[#282725]">
                    <AnimatedItem delay={0.1}>
                      <h2 
                        className="font-['Inter'] not-italic font-extrabold text-3xl md:text-4xl lg:text-[55px] leading-[1.2] md:leading-[1.3] lg:leading-[69px] mb-6 md:mb-12"
                        style={{
                            color: '#249EA0',
                            textShadow: '-2px 3px 0px #282725'
                        }}
                      >
                          Pangunahing Tauhan sa Noli Me Tangere
                      </h2>
                    </AnimatedItem>

                    {/* Desktop Grid View (hidden on mobile/tablet) */}
                    <AnimatedItem className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 xl:gap-10 max-w-6xl mx-auto" delay={0.2}>
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
                    </AnimatedItem>

                    {/* Mobile/Tablet Carousel (visible on mobile/tablet) */}
                    <AnimatedItem className="lg:hidden relative overflow-hidden max-w-2xl md:max-w-3xl mx-auto" delay={0.3}>
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {/* Slide 1 */}
                            <div className="w-full flex-shrink-0 px-4 flex justify-center">
                                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 min-w-2xl md:max-w-xl">
                                    <CharacterCard
                                    name="Crisostomo Ibarra"
                                    detail="Si Crisostomo ay binatang anak ni Don Rafael Ibarra na nag-aral sa Europa. Siya ang kababata at kasintahan ni Maria Clara."
                                    imgSrc="/Img/LandingPage/character/char-1.png"
                                    compact={true}
                                    />
                                    <CharacterCard
                                    name="Maria Clara"
                                    detail="Si Maria Clara ay mayuming kasintahan ni Crisostomo Ibarra. Siya ang anak ni Donya Pia Alba kay Padre Damaso."
                                    imgSrc="/Img/LandingPage/character/char-2.png"
                                    compact={true}
                                    />
                                    <CharacterCard
                                    name="Padre Damaso"
                                    detail="Si Padre Damaso ay isang paring Pransiskano ..."
                                    imgSrc="/Img/LandingPage/character/char-3.png"
                                    compact={true}
                                    />
                                </div>
                            </div>

                            {/* Slide 2 */}
                            <div className="w-full flex-shrink-0 px-4 flex justify-center">
                                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-md md:max-w-lg">
                                    <CharacterCard
                                    name="Crispin"
                                    detail="Si Crispin ay nakababatang anak ni Sisa..."
                                    imgSrc="/Img/LandingPage/character/char-4.png"
                                    compact={true}
                                    />
                                    <CharacterCard
                                    name="Sisa"
                                    detail="Si Sisa ay ina nina Crispin at Basilio..."
                                    imgSrc="/Img/LandingPage/character/char-5.png"
                                    compact={true}
                                    />
                                    <CharacterCard
                                    name="Padre Salvi"
                                    detail="Si Padre Salvi ay humalili kay Padre Damaso..."
                                    imgSrc="/Img/LandingPage/character/char-6.png"
                                    compact={true}
                                    />
                                </div>
                            </div>

                            {/* Slide 3 */}
                            <div className="w-full flex-shrink-0 px-4 flex justify-center">
                                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 max-w-md md:max-w-lg">
                                    <CharacterCard
                                    name="Kapitan Heneral"
                                    detail="Ang Kapitan Heneral ay ang pinakamakapangyarihan..."
                                    imgSrc="/Img/LandingPage/character/char-7.png"
                                    compact={true}
                                    />
                                    <CharacterCard
                                    name="Tenyente Guevarra"
                                    detail="Si Tenyente Guevarra ay isang matapat na tenyente..."
                                    imgSrc="/Img/LandingPage/character/char-8.png"
                                    compact={true}
                                    />
                                </div>
                            </div>
                        </div>       
                        {/* Navigation Dots */}
                        <div className="flex justify-center mt-6 space-x-2">
                        {[0, 1, 2].map((index) => (
                            <motion.button
                            key={index}
                            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                                currentSlide === index ? 'bg-[#249EA0]' : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            />
                        ))}
                        </div>
                        
                        {/* Navigation Arrows */}
                        <motion.button
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))}
                        aria-label="Previous slide"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        >
                        <svg className="w-5 h-5 text-[#249EA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        </motion.button>
                        <motion.button
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                        onClick={() => setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))}
                        aria-label="Next slide"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        >
                        <svg className="w-5 h-5 text-[#249EA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        </motion.button>
                    </AnimatedItem>
                </AnimatedSection>
                
                  <AnimatedSection className='py-5 px-15'  delay={0.1}>
                    <div className="flex flex-row justify-between items-center pb-5 gap-5 border-b-[1px] border-[#282725] ">
                      <AnimatedItem className="md:order-1" delay={0.2}>
                        <motion.img 
                          src="/Img/LandingPage/square2.png" 
                          alt="" 
                          className="h-[300px] md:h-[400px] lg:h-[500px] transition-transform duration-300 hover:scale-105"
                          whileHover={{ rotate: -2 }}
                        />
                      </AnimatedItem>
                        <AnimatedItem className='flex flex-col items-center justify-center -ml-10 gap-4 order-1 md:order-2' delay={0.3}>
                           <h2 className="font-['Inter'] font-extrabold text-2xl md:text-3xl lg:text-[40px] mb-15 w-full md:w-[400px] lg:w-[500px] leading-[1.2] md:leading-[1.5] text-center">In Honor of Dr. José P. Rizal</h2>
                           <motion.img 
                             src="/Img/LandingPage/jose.png" 
                             alt="" 
                             className="h-[150px] md:h-[200px] lg:h-[230px] transition-transform duration-300 hover:scale-105"
                             whileHover={{ y: -5 }}
                           />
                            <p className="text-[#3d3b3a] mt-2 text-sm md:text-base lg:text-xl font-['Inter'] italic max-w-2xl mx-auto text-center leading-relaxed">
                            “Noli Me Tangere” — ang dakilang akdang nagmulat sa kamalayan ng sambayanang Pilipino.
                            Ang RizHub ay handog bilang pagpupugay sa kanyang katalinuhan, kabayanihan, at walang-hanggang inspirasyon sa edukasyon at bayan.
                            </p>
                        </AnimatedItem>
                        <AnimatedItem className="order-3" delay={0.4}>
                            <motion.img 
                              src="/Img/LandingPage/square3.png" 
                              alt="" 
                              className="h-[200px] md:h-[250px] lg:h-[400px] transition-transform duration-300 hover:scale-105"
                              whileHover={{ rotate: 2 }}
                            />
                        </AnimatedItem>
                    </div>
                </AnimatedSection>
                {/* Footer */}
                <AnimatedSection className="py-3 bg-white text-center px-3  overflow-hidden" delay={0.1}>
                    <AnimatedItem className="flex justify-center mt-4" delay={0.2}>
                        <motion.img 
                            src="/Img/LandingPage/fchar.png" 
                            alt="Footer Characters" 
                            className="h-auto w-full max-w-7xl transition-transform duration-300 hover:scale-105"
                            whileHover={{ y: -5 }}
                        />
                    </AnimatedItem>

                    {/* Divider Line */}
                    <div className="w-full h-px bg-[#d1c7b5]/60 mt-8 mb-4"></div>

                    {/* Copyright */} 
                    <AnimatedItem className='overflow-hidden' delay={0.4}>
                        <p className="text-[#5b4a3b] font-['Inter'] font-medium text-sm md:text-base overflow-hidden">
                            © 2025 RizHub. All Rights Reserved.
                            | Developed with pride by the Occidental Mindoro State College |  Background music by 
                            <a 
                                href="https://www.youtube.com/@BensoundMusic" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#d63636] hover:underline ml-1"
                            >
                                Bensound
                            </a>.
                        </p>      
                        <p className="text-[#5b4a3b] font-['Inter'] font-medium text-sm md:text-base">
                            Inspired by
                            <a
                            href="http://www.youtube.com/@CEFilipinoKlasiks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#d63636] hover:underline font-semibold ml-1"
                            >
                            @CEFilipinoKlasiks – Animated Filipino Classics
                            </a>.
                        </p>
                    </AnimatedItem>
                                        {/* Social Media Links */}
                    <AnimatedItem className="flex justify-center space-x-6 mt-2" delay={0.3}>
                        {/* Phone */}
                        <motion.a 
                            href="tel:+639088110896"
                            className="text-[#282725] hover:text-[#34A853] transition-colors duration-300"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
                            </svg>
                        </motion.a>

                        {/* Email */}
                        <motion.a 
                            href="mailto:kdesinfo@cebookshop.com"
                            className="text-[#282725] hover:text-[#EA4335] transition-colors duration-300"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                            </svg>
                        </motion.a>

                        {/* Instagram */}
                        <motion.a 
                            href="https://www.instagram.com/kdesdigital?utm_source=ig_web_button_share_sheet&igsh=MWl4Nm9nYWV3c3NkOA=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#282725] hover:text-[#E4405F] transition-colors duration-300"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </motion.a>

                        {/* YouTube */}
                        <motion.a 
                            href="http://www.youtube.com/@CEFilipinoKlasiks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#282725] hover:text-[#FF0000] transition-colors duration-300"
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <svg className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                            </svg>
                        </motion.a>
                    </AnimatedItem>
                </AnimatedSection>
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

function LoginModal({ open, onClose, setShowTermsModal, setShowPrivacyModal }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showMatchMessage, setShowMatchMessage] = useState(false);
    const [registrationError, setRegistrationError] = useState<string | null>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

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

    // Move the useEffect inside the component
    useEffect(() => {
        if (regData.password_confirmation) {
            setShowMatchMessage(true);
            const timer = setTimeout(() => setShowMatchMessage(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [regData.password, regData.password_confirmation]);

    // Auto-hide error messages after 5 seconds
    useEffect(() => {
        if (loginError) {
            const timer = setTimeout(() => {
                setLoginError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loginError]);

    useEffect(() => {
        if (registrationError) {
            const timer = setTimeout(() => {
                setRegistrationError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [registrationError]);

    useEffect(() => {
        if (loginSuccess) {
            const timer = setTimeout(() => {
                setLoginSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [loginSuccess]);

    // Password validation checks
    const passwordChecks = {
        hasUppercase: /[A-Z]/.test(regData.password),
        hasLowercase: /[a-z]/.test(regData.password),
        hasNumber: /[0-9]/.test(regData.password),
        hasSpecialChar: /[~!@#\$%\^&\*\(\)\-_\+=\|\\\{\}\[\]:;"'<>,\.\?\/]/.test(regData.password),
        hasMinLength: regData.password.length >= 8
    };

    const handleClose = () => {
        loginReset('password');
        regReset('password');
        setIsPasswordFocused(false);
        setRegistrationError(null);
        setLoginError(null);
        setLoginSuccess(null);
        onClose();
    };

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);
        setLoginSuccess(null);
        
        loginPost(route('login'), {
            onSuccess: () => {
                setLoginSuccess('Login successful! Redirecting...');
                loginReset();
                setTimeout(() => {
                    handleClose();
                }, 1000);
            },
            onError: (errors) => {
                console.log('Login errors:', errors);
                
                // Handle different types of login errors
                if (errors.email || errors.password) {
                    setLoginError('Invalid email or password. Please try again.');
                } else if (errors.message?.includes('throttle')) {
                    setLoginError('Too many login attempts. Please try again later.');
                } else if (errors.message) {
                    setLoginError(errors.message);
                } else {
                    setLoginError('An unexpected error occurred. Please try again.');
                }
            }
        });
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setRegistrationError(null);
      
        // Client-side validation
        if (!regData.terms) {
            setRegistrationError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        if (regData.password !== regData.password_confirmation) {
            setRegistrationError('Passwords do not match');
            return;
        }

        // Check password requirements
        if (!passwordChecks.hasUppercase || 
            !passwordChecks.hasLowercase || 
            !passwordChecks.hasNumber || 
            !passwordChecks.hasSpecialChar || 
            !passwordChecks.hasMinLength) {
            setRegistrationError('Password does not meet all requirements');
            return;
        }

        regPost(route('register'), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Registration successful');
                regReset();
                handleClose();
                
                // Redirect to VerifyEmail page
                window.location.href = route('verification.notice');
            },
            onError: (errors) => {
                console.log('Registration errors:', errors);
                if (errors.email) {
                    setRegistrationError(errors.email);
                } else if (errors.password) {
                    setRegistrationError(errors.password);
                } else if (errors.name) {
                    setRegistrationError(errors.name);
                } else {
                    setRegistrationError('Registration failed. Please try again.');
                }
            },
            onFinish: () => {
                console.log('Registration request finished');
            }
        });
    };

    // Reset errors when switching between login/register
    useEffect(() => {
        setRegistrationError(null);
        setLoginError(null);
        setLoginSuccess(null);
    }, [isLogin]);

    // Clear errors when user starts typing in login form
    const handleLoginDataChange = (field: 'email' | 'password', value: string) => {
        setLoginData(field, value);
        if (loginError) {
            setLoginError(null);
        }
        if (loginSuccess) {
            setLoginSuccess(null);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
            {/* Toast Notifications - Top Right Corner */}
            <div className="absolute top-4 right-4 z-90 space-y-2 max-w-sm">
                {/* Login Error Toast */}
                {loginError && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{loginError}</span>
                        </div>
                    </motion.div>
                )}

                {/* Registration Error Toast */}
                {registrationError && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{registrationError}</span>
                        </div>
                    </motion.div>
                )}

                {/* Login Success Toast */}
                {loginSuccess && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg"
                    >
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{loginSuccess}</span>
                        </div>
                    </motion.div>
                )}
            </div>
            {/* MAIN MODAL CONTAINER */}
            <div className="w-full max-w-3xl mx-auto flex rounded-2xl z-70 overflow-hidden shadow-2xl relative">
                {(loginProcessing || regProcessing) && (
                    <div className="absolute inset-0 flex items-center pb-[70px] justify-center z-50 rounded-2xl bg-white">
                        <div className="text-center relative">
                            <img 
                                src="/Img/LandingPage/loading.gif" 
                                alt="Loading..." 
                                className="w-[590px] h-[490px] mx-auto rounded-2xl object-cover"
                                loading="eager"
                            />
                            <div className="absolute bottom-[65px] left-0 right-0">
                                <p className="text-orange-700 font-bold text-xl px-6 py-3 rounded-lg">
                                    {loginProcessing ? "Logging in..." : "Creating account..."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Left Side Image */}
                <div className="hidden md:flex w-1/2 bg-orange-100 items-center justify-center relative">
                    <img
                        src="\Img\LandingPage\character\noli-form.gif"
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Centered Text Overlay */}
                    <div className="absolute inset-0 flex py-40 mt-10 block p-6 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                                        blur-3xl animate-pulse opacity-70 -z-10"></div>

                        <h2 className="text-[#FA7816] text-xl md:text-xl font-extrabold drop-shadow-md leading-snug max-w-4xl">
                            {isLogin ? (
                                "Magandang araw! Handa ka na bang ipagpatuloy ang iyong paglalakbay?"
                            ) : (
                                "Humanda! Sa RizHub, ang pag-aaral ay isang kakaibang paglalakbay!"
                            )}
                        </h2>
                    </div>
                </div>
            
                {/* Right Side Form */}
                <div className="bg-[#FA7816] w-full md:w-1/2 p-4 md:p-4 relative flex flex-col items-center justify-center">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-3 md:top-3 md:right-4 text-white text-xl hover:text-[#5A3416] font-bold z-10"
                        onClick={handleClose}
                        aria-label="Close"
                    >✕</button>
                    
                    <div className="w-full flex flex-col items-center">
                        {isLogin && (
                            <img
                            src="/Img/LandingPage/Login/quill.png"
                            alt="Quill Icon"
                            className="w-[90px] h-[90px] lg:w-15 lg:h-15 mt-6 mb-1"
                            />
                        )}
                        <h2 className="text-white text-xl md:text-2xl font-extrabold mb-3 md:mb-5 mt-6 text-center drop-shadow">Welcome!!!</h2>
                    </div>

                    {/* FORMS CONTAINER */}
                    <div className="w-full flex flex-col items-center relative">
                        {isLogin ? (
                            <form onSubmit={handleLogin} className="w-full max-w-md">
                                {/* Email */}
                                <div className="w-full mb-5 relative">
                                    <input
                                        id="login_email"
                                        type="email"
                                        name="email"
                                        autoComplete="off"
                                        value={loginData.email}
                                        onChange={e => handleLoginDataChange('email', e.target.value)}
                                        className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-base md:text-base border-2 border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                        placeholder="email"
                                        required
                                    />
                                    <label
                                        htmlFor="login_email"
                                        className={`
                                            absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                            ${loginData.email 
                                                ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                            }
                                        `}
                                        style={{
                                            transform: loginData.email ? 'none' : 'translateY(-50%)'
                                        }}
                                    >
                                        Email:
                                    </label>
                                </div>

                                {/* Password */}
                                <div className="w-full mb-5 relative">
                                    <input
                                        id="login_password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={loginData.password}
                                        onChange={e => handleLoginDataChange('password', e.target.value)}
                                        className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-base md:text-base border-2 border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                        placeholder="password"
                                        required
                                    />
                                    <label
                                        htmlFor="login_password"
                                        className={`
                                            absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                            ${loginData.password 
                                                ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                            }
                                        `}
                                        style={{
                                            transform: loginData.password ? 'none' : 'translateY(-50%)'
                                        }}
                                    >
                                        Password:
                                    </label>

                                    {loginData.password && (
                                        <button
                                            type="button"
                                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3416] text-sm md:text-lg hide-edge-reveal  ${
                                                !loginData.password ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                            onClick={() => loginData.password && setShowPassword(!showPassword)}
                                            disabled={!loginData.password}
                                            tabIndex={-1}
                                            
                                            >
                                            {showPassword ? (
                                                <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]">
                                                {/* Hide icon SVG */}
                                                <g>
                                                    <path d="M10.6657 4.31697C10.252 3.63943 9.73003 3.03421 9.12067 2.52535L10.404 1.24201C10.4875 1.15557 10.5337 1.0398 10.5326 0.919622C10.5316 0.799448 10.4834 0.684492 10.3984 0.599514C10.3134 0.514535 10.1985 0.466333 10.0783 0.465288C9.95814 0.464244 9.84237 0.510441 9.75592 0.593931L8.3603 1.99139C7.49514 1.47752 6.50607 1.20969 5.49984 1.21681C2.66230 1.21681 1.04530 3.15922 0.333965 4.31697C0.114207 4.67241 -0.00219727 5.08204 -0.00219727 5.49993C-0.00219727 5.91782 0.114207 6.32745 0.333965 6.68289C0.747729 7.36043 1.26965 7.96565 1.87901 8.47451L0.595674 9.75785C0.551898 9.80013 0.516981 9.8507 0.492961 9.90662C0.468940 9.96254 0.456296 10.0227 0.455767 10.0835C0.455238 10.1444 0.466835 10.2047 0.489880 10.2611C0.512926 10.3174 0.546959 10.3686 0.589993 10.4116C0.633027 10.4546 0.684201 10.4887 0.740528 10.5117C0.796856 10.5348 0.857209 10.5464 0.918066 10.5458C0.978923 10.5453 1.03907 10.5327 1.09498 10.5086C1.15090 10.4846 1.20148 10.4497 1.24376 10.4059L2.64259 9.0071C3.50667 9.52089 4.49456 9.78918 5.49984 9.78306C8.33738 9.78306 9.95438 7.84064 10.6657 6.68289C10.8855 6.32745 11.0019 5.91782 11.0019 5.49993C11.0019 5.08204 10.8855 4.67241 10.6657 4.31697V4.31697ZM1.11497 6.20301C0.984403 5.99174 0.915247 5.74829 0.915247 5.49993C0.915247 5.25157 0.984403 5.00812 1.11497 4.79685C1.72638 3.8041 3.10826 2.13347 5.49984 2.13347C6.26080 2.12921 7.01107 2.31261 7.68426 2.66743L6.76163 3.59006C6.32160 3.29792 5.79405 3.16701 5.26849 3.21956C4.74293 3.27211 4.25174 3.50487 3.87826 3.87835C3.50478 4.25183 3.27202 4.74302 3.21947 5.26858C3.16692 5.79414 3.29782 6.32169 3.58997 6.76172L2.53122 7.82047C1.96980 7.36659 1.49072 6.81945 1.11497 6.20301V6.20301ZM6.87484 5.49993C6.87484 5.86460 6.72998 6.21434 6.47211 6.47220C6.21425 6.73007 5.86451 6.87493 5.49984 6.87493C5.29566 6.87414 5.09431 6.82713 4.91088 6.73743L6.73734 4.91097C6.82704 5.09440 6.87405 5.29575 6.87484 5.49993V5.49993ZM4.12484 5.49993C4.12484 5.13526 4.26971 4.78552 4.52757 4.52766C4.78543 4.26980 5.13517 4.12493 5.49984 4.12493C5.70402 4.12572 5.90537 4.17273 6.08880 4.26243L4.26234 6.08889C4.17264 5.90546 4.12563 5.70411 4.12484 5.49993ZM9.88472 6.20301C9.27330 7.19576 7.89142 8.86639 5.49984 8.86639C4.73888 8.87065 3.98861 8.68726 3.31542 8.33243L4.23805 7.40981C4.67808 7.70195 5.20563 7.83285 5.73119 7.78030C6.25675 7.72775 6.74794 7.49499 7.12142 7.12151C7.49490 6.74803 7.72766 6.25684 7.78021 5.73128C7.83276 5.20572 7.70186 4.67817 7.40972 4.23814L8.46847 3.17939C9.02988 3.63327 9.50896 4.18041 9.88472 4.79685C10.0153 5.00812 10.0844 5.25157 10.0844 5.49993C10.0844 5.74829 10.0153 5.99174 9.88472 6.20301V6.20301Z" fill="#5A3416"/>
                                                </g>
                                                </svg>
                                            ) : (
                                                <svg className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                {/* Show icon SVG */}
                                                <path d="M5.5 3.66797C4.49167 3.66797 3.66667 4.49297 3.66667 5.5013C3.66667 6.50964 4.49167 7.33464 5.5 7.33464C6.50833 7.33464 7.33333 6.50964 7.33333 5.5013C7.33333 4.49297 6.50833 3.66797 5.5 3.66797ZM5.5 8.16797C4.02917 8.16797 2.83333 6.97214 2.83333 5.5013C2.83333 4.03047 4.02917 2.83464 5.5 2.83464C6.97083 2.83464 8.16667 4.03047 8.16667 5.5013C8.16667 6.97214 6.97083 8.16797 5.5 8.16797ZM5.5 1.66797C3 1.66797 0.833333 3.16797 0 5.5013C0.833333 7.83464 3 9.33464 5.5 9.33464C8 9.33464 10.1667 7.83464 11 5.5013C10.1667 3.16797 8 1.66797 5.5 1.66797Z" fill="#5A3416"/>
                                                </svg>
                                            )}
                                            </button>
                                    )}
                                    <a href={route('password.request')} className="absolute right-0 bottom-[-22px] text-[#000000] text-base underline hover:text-[#5A3416] -mb-3 block text-right">Forgot Password</a>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-8 rounded-full bg-[#5A3416] text-white text-base md:text-lg font-bold py-2 md:py-2.5 transition-all duration-200 hover:bg-[#3d2410] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loginProcessing}
                                >
                                    Login
                                </button>

                                <div className="w-full text-center mt-2">
                                    <span className="text-[#000000] text-6xxl">New to RizHub? </span>
                                    <button
                                        type="button"
                                        className="text-[#000000] underline font-semibold hover:text-[#5A3416] text-6xxl"
                                        onClick={() => setIsLogin(false)}
                                    >
                                         Register
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="w-full flex flex-col items-center">
                                {/* Name */}
                                <div className="w-full mb-5 relative">
                                    <input
                                        id="reg_name"
                                        type="text"
                                        name="name"
                                        className="peer w-full rounded-full px-4 py-2 md:px-5 md:py-2.5 text-base md:text-base border-2 border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                        value={regData.name}
                                        onChange={e => setRegData('name', e.target.value)}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        placeholder="name"
                                        required
                                        style={{ border: '2px solid #fff' }}
                                    />
                                    <label
                                        htmlFor="reg_name"
                                        className={`
                                            absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                            ${regData.name 
                                                ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                            }
                                        `}
                                        style={{
                                            transform: regData.name ? 'none' : 'translateY(-50%)'
                                        }}
                                    >
                                        Name:
                                    </label>
                                </div>
                                
                                {/* Email */}
                                <div className="w-full mb-5 relative">
                                    <input
                                        id="reg_email"
                                        type="email"
                                        name="email"
                                        className="peer w-full rounded-full px-4 py-2 md:px-5 md:py-2.5 text-base md:text-base border-2 border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                                        value={regData.email}
                                        onChange={e => setRegData('email', e.target.value)}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        placeholder="email"
                                        required
                                        style={{ border: '2px solid #fff' }}
                                    />
                                    <label
                                        htmlFor="reg_email"
                                        className={`
                                            absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                            ${regData.email 
                                                ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                            }
                                        `}
                                        style={{
                                            transform: regData.email ? 'none' : 'translateY(-50%)'
                                        }}
                                    >
                                        Email:
                                    </label>
                                </div>                     
                                
                                {/* Password */}
                                <div className="w-full mb-5 relative">
                                    <div className="relative">
                                        <input
                                            id="reg_password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={regData.password}
                                            onChange={(e) => setRegData('password', e.target.value)}
                                            onFocus={() => setIsPasswordFocused(true)}
                                            placeholder="password"
                                            required
                                            className={`peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-base md:text-base border-2 outline-none focus:ring-0 focus:shadow-none font-semibold 
                                                ${
                                                    regData.password_confirmation
                                                    ? regData.password === regData.password_confirmation
                                                        ? "border-orange-500 bg-orange-100"
                                                        : "border-red-500 bg-red-100"
                                                    : "border-white bg-[#FA7816]"
                                                } text-[#5A3416] placeholder-transparent`}
                                        />
                                        <label
                                            htmlFor="reg_password"
                                            className={`
                                                absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                                ${regData.password 
                                                    ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                    : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                                }
                                            `}
                                            style={{
                                                transform: regData.password ? 'none' : 'translateY(-50%)'
                                            }}
                                        >
                                            Password:
                                        </label>
                                    </div>
                                </div>
                                
                                {/* Confirm Password */}
                                <div className="w-full relative">
                                    <input
                                        id="reg_password_confirmation"
                                        type={showPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={regData.password_confirmation}
                                        onChange={(e) => setRegData('password_confirmation', e.target.value)}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        placeholder="confirm password"
                                        required
                                        className={`peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-base md:text-base border-2 outline-none focus:ring-0 focus:shadow-none font-semibold 
                                            ${
                                                regData.password_confirmation
                                                ? regData.password === regData.password_confirmation
                                                    ? "border-orange-500 bg-orange-100"
                                                    : "border-red-500 bg-red-100"
                                                : "border-white  bg-[#FA7816]"
                                            } text-[#5A3416] placeholder-transparent`}
                                    />
                                    <label
                                        htmlFor="reg_password_confirmation"
                                        className={`
                                            absolute left-4 md:left-5 text-white text-base font-semibold pointer-events-none transition-all duration-200 z-10
                                            ${regData.password_confirmation 
                                                ? "-top-2.5 text-base bg-[#FA7816] px-2.5 rounded-full" 
                                                : "top-1/2 -translate-y-1/2 peer-focus:-top-1 peer-focus:text-base peer-focus:bg-[#FA7816] peer-focus:px-2.5 peer-focus:rounded-full"
                                            }
                                        `}
                                        style={{
                                            transform: regData.password_confirmation ? 'none' : 'translateY(-50%)'
                                        }}
                                    >
                                        Confirm Password:
                                    </label>
                                    
                                    {/* Matching Indicator Message */}
                                    {showMatchMessage && (
                                        <p
                                            className={`text-xs mt-1 text-base font-semibold ${
                                                regData.password === regData.password_confirmation
                                                ? "text-white"
                                                : "text-black"
                                            }`}
                                        >
                                            {regData.password === regData.password_confirmation
                                                ? "Passwords match!"
                                                : "Passwords do not match!"}
                                        </p>
                                    )}
                                </div>
                                
                                <div className="w-full mb-2 flex items-center justify-center">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        checked={regData.terms ?? false}
                                        onChange={e => setRegData('terms', e.target.checked)}
                                        onFocus={() => setIsPasswordFocused(false)}
                                        required
                                        className="mr-2 accent-[#5A3416]"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="flex items-center justify-center text-[#000000] text-10xxl md:text-10xxl mt-6 select-none"
                                    >
                                        <span>
                                        By registering, you agree to our{' '}
                                        <button
                                            type="button"
                                            className="underline font-semibold hover:text-[#FF9B50]"
                                            onClick={() => setShowTermsModal(true)}
                                        >
                                            Terms of Service
                                        </button>{' '}
                                        and{' '}
                                        <button
                                            type="button"
                                            className="underline font-semibold hover:text-[#FF9B50]"
                                            onClick={() => setShowPrivacyModal(true)}
                                        >
                                           Privacy Policy.
                                        </button>
                                        .
                                    </span>

                                        <span className="text-red-700 ml-1">*</span>
                                    </label>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full mt-4 rounded-full bg-[#5A3416] text-white text-base md:text-lg font-bold py-2 md:py-2.5 transition-all duration-200 hover:bg-[#3d2410] disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={regProcessing}
                                >
                                    Signup
                                </button>
                                
                                <div className="w-full text-center mt-2">
                                    <span className="text-[000000] text-4xxl">Already have an account? </span>
                                    <button
                                        type="button"
                                        className="text-[#000000] underline font-semibold hover:text-[#5A3416] text-sm"
                                        onClick={() => setIsLogin(true)}
                                    >
                                        Log in
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            
            {/* PASSWORD REQUIREMENTS - POSITIONED AS OVERLAY OUTSIDE THE MAIN MODAL */}
            {isPasswordFocused && !isLogin && (
                <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-64 z-80">
                    <div className="relative p-4 bg-white rounded-xl shadow-2xl border-2 border-white">
                        <p className="text-[#5A3416] text-3xxl font-bold mb-3">Password must contain:</p>
                        <ul className="text-2xxl space-y-2">
                            <li className={`flex items-center ${passwordChecks.hasUppercase ? 'text-orange-600' : 'text-[#5A3416]'}`}>
                                <span className="mr-2 font-bold">{passwordChecks.hasUppercase ? '✓' : '✗'}</span>
                                At least one uppercase letter (A-Z)
                            </li>
                            <li className={`flex items-center ${passwordChecks.hasLowercase ? 'text-orange-600' : 'text-[#5A3416]'}`}>
                                <span className="mr-2 font-bold">{passwordChecks.hasLowercase ? '✓' : '✗'}</span>
                                At least one lowercase letter (a-z)
                            </li>
                            <li className={`flex items-center ${passwordChecks.hasNumber ? 'text-orange-600' : 'text-[#5A3416]'}`}>
                                <span className="mr-2 font-bold">{passwordChecks.hasNumber ? '✓' : '✗'}</span>
                                At least one number (0-9)
                            </li>
                            <li className={`flex items-center ${passwordChecks.hasSpecialChar ? 'text-orange-600' : 'text-[#5A3416]'}`}>
                                <span className="mr-2 font-bold">{passwordChecks.hasSpecialChar ? '✓' : '✗'}</span>
                                At least one special character
                            </li>
                            <li className={`flex items-center ${passwordChecks.hasMinLength ? 'text-orange-600' : 'text-[#5A3416]'}`}>
                                <span className="mr-2 font-bold">{passwordChecks.hasMinLength ? '✓' : '✗'}</span>
                                At least 8 characters long
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}