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
            
            <div className={`min-h-screen bg-white font-sans ${showLoginModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
                {/* Hero Section - Always visible without scroll trigger */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={sectionVariants}
                  className="relative flex flex-col md:flex-row items-center justify-between min-h-screen bg-orange-50 overflow-hidden px-4 md:px-0 pt-0 pb-0"
                  style={{
                    background: `
                      url('/Img/LandingPage/noli-bg.png') left top / cover no-repeat,
                      url('/Img/LandingPage/Header-BG2.png') left top / cover no-repeat,
                      url('/Img/LandingPage/lp-books.png') left top / cover no-repeat,
                      url('/Img/LandingPage/Header_BG.png') left top / cover no-repeat
                    `
                  }}
                >
                  {/* The ImageSlider component */}
                  <motion.div 
                    className="absolute w-full h-full flex justify-center items-center"
                    variants={itemVariants}
                    transition={{ delay: 0.2 }}
                  >
                   <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden" style={{ 
                      width: '100%', 
                      maxWidth: '1900px',
                      height: '570px',
                      left: '400px',
                      bottom: '50px',
                      maxHeight: '70vh'
                    }}>
                      <ImageSlider />
                    </div>
                  </motion.div>
                  
                  <div className="z-10 w-full md:flex-1 flex flex-col items-center md:items-start justify-center max-w-lg mx-auto md:mx-0 md:pl-10">
                      <motion.div 
                        className="mt-10 md:mt-0 md:absolute md:left-10 md:top-10"
                        variants={itemVariants}
                        transition={{ delay: 0.1 }}
                      >
                          <img 
                              src="/Img/LandingPage/Title.png" 
                              alt="RizHub Logo" 
                              className="h-[50px] md:h-[70px] lg:h-[100px] transition-transform duration-300 hover:scale-105" 
                          />
                      </motion.div>
                      <motion.div 
                        className="absolute left-[4%] top-[140px] lg:top-[180px] max-w-md text-center"
                        variants={itemVariants}
                        transition={{ delay: 0.3 }}
                      >
                            <p className="text-left font-['Inter'] font-medium text-lg md:text-xl lg:text-2xl leading-8 lg:leading-10 text-[#282725]"
                              style={{ 
                                  textShadow: '0px 4px 4px rgba(0,0,0,0.25)'
                              }}
                          >
                              Igniting Minds with Rizal's Legacy! Your ultimate game-based hub 
                              for mastering Noli Me Tangere, crafted to inspire and engage 
                              young learners.
                          </p>
                        </motion.div>
                      <motion.div 
                        className="mt-8 md:absolute md:left-10 lg:left-[350px] md:top-[280px] lg:top-[365px] flex items-center md:mt-10 mb-0 md:ml-2"
                        variants={itemVariants}
                        transition={{ delay: 0.4 }}
                      >
                        <motion.button
                        className="w-[220px] md:w-[260px] lg:w-[250px] h-[60px] md:h-[70px] lg:h-[80px] 
                                    bg-orange-500 hover:bg-orange-600 text-white fontfamily: 
                                    text-xl md:text-2xl lg:text-3xl font-extrabold 
                                    rounded-[50px] border-4 md:border-[6px] lg:border-[8px] border-[#C97B3A] 
                                    flex items-center justify-center"
                        style={{
                            boxShadow: '4px 6px 0px #9B4A1B, 0px 2px 4px rgba(0,0,0,0.25)',
                            filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.25))'
                        }}
                        onClick={() => setShowLoginModal(true)}
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: '6px 8px 0px #9B4A1B, 0px 4px 8px rgba(0,0,0,0.3)'
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

                {/* Learn Section */}
                <AnimatedSection className="bg-[#F4F2EC] py-8 md:py-12 text-center px-4 border-t-[1px] border-b-[1px] border-[#282725]">
                    <div className="flex flex-col md:flex-row justify-around items-center">
                        
                        {/* Image hidden on mobile, shown on md+ */}
                        <AnimatedItem className="mb-6 md:mb-0 flex md:block hidden md:flex" delay={0.1}>
                        <img 
                            src="/Img/LandingPage/square1.png" 
                            alt="" 
                            className="h-[200px] md:h-[250px] lg:h-[300px] transition-transform duration-300 hover:scale-105" 
                        />
                        </AnimatedItem>

                        <AnimatedItem className="w-full md:w-auto lg:w-[800px] flex flex-col justify-around items-center md:items-end gap-4" delay={0.2}>
                        <h2 
                            className="font-['Inter'] not-italic font-extrabold text-3xl md:text-4xl lg:text-[45px] leading-[1.2] md:leading-[1.3] lg:leading-[69px] mb-2 text-center md:text-right"
                            style={{
                            color: '#FAAB36',
                            textShadow: '-2px 3px 0px #282725'
                            }}
                        >
                            Learn and ignite your knowledge <br /> of Noli Me Tangere
                        </h2>
                        <p className="text-[#282725] text-center md:text-right font-['Inter'] text-base md:text-lg lg:text-[22px] leading-6 lg:leading-[28px]">
                            Grow your understanding of Noli Me Tangere <br /> and be recognized with exciting achievements
                        </p>
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
                              Start Learning »
                          </Link>
                        </motion.div>
                        </AnimatedItem>
                    </div>
                </AnimatedSection>

                {/* About Section */}
                <AnimatedSection className="px-4 md:px-6 py-8 md:py-12 bg-white text-center border-b-[1px] border-[#282725]">
                    <div className='flex flex-col md:flex-row items-center justify-around'>
                        <AnimatedItem className='h-auto flex gap-3 flex-col order-2 md:order-1 mb-6 md:mb-0' delay={0.1}>
                            <h2 
                                className="font-['Inter'] not-italic font-extrabold text-3xl md:text-4xl lg:text-[45px] leading-[1.2] md:leading-[1.3] lg:leading-[69px] mb-2 text-center md:text-left"
                                style={{
                                    color: '#FF9500',
                                    textShadow: '-2px 3px 0px #282725'
                                }}
                            >
                                About RizHub
                            </h2>   
                            <p className="text-[#282725] text-center md:text-left font-['Inter'] font-medium text-base md:text-lg lg:text-[22px] leading-6 lg:leading-[28px] w-full md:w-[400px] lg:w-[500px]">
                                RizHub is a web-based, game-integrated learning platform designed to enhance students' understanding of Noli Me Tangere. Whether you're new to the novel or seeking a deeper grasp of its themes and characters, RizHub offers interactive learning tool, engaging quizzes, and immersive gameplay. Join RizHub and experience a new way of learning Rizal's masterpiece!
                            </p>
                        </AnimatedItem>
                         <AnimatedItem className="order-1 md:order-2" delay={0.2}>
                            <motion.img 
                              src="/Img/LandingPage/design1.png" 
                              alt=""  
                              className='h-[250px] md:h-[350px] lg:h-[400px] transition-transform duration-300 hover:scale-105'
                              whileHover={{ rotate: 2 }}
                            />
                        </AnimatedItem>
                   </div>
                </AnimatedSection>

                {/* Characters Section */}
                <AnimatedSection className="bg-gray-50 py-8 md:py-12 px-4 text-center border-b-[1px] border-[#282725]">
                    <AnimatedItem delay={0.1}>
                      <h2 
                        className="font-['Inter'] not-italic font-extrabold text-3xl md:text-4xl lg:text-[45px] leading-[1.2] md:leading-[1.3] lg:leading-[69px] mb-6 md:mb-10"
                        style={{
                            color: '#249EA0',
                            textShadow: '-2px 3px 0px #282725'
                        }}
                      >
                          Noli Me Tangere Main Characters
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
                  <AnimatedSection className='py-5 px-4' delay={0.1}>
                    <div 
                      style={{boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'}} 
                      className='flex flex-row justify-between items-center gap-5'
                    >
                      <AnimatedItem className="md:order-1" delay={0.2}>
                        <motion.img 
                          src="/Img/LandingPage/square2.png" 
                          alt="" 
                          className="h-[300px] md:h-[400px] lg:h-[500px] transition-transform duration-300 hover:scale-105"
                          whileHover={{ rotate: -2 }}
                        />
                      </AnimatedItem>
                        <AnimatedItem className='flex flex-col items-center justify-center gap-4 order-1 md:order-2 mb-6 md:mb-0' delay={0.3}>
                           <motion.img 
                             src="/Img/LandingPage/jose.png" 
                             alt="" 
                             className="h-[150px] md:h-[200px] lg:h-[230px] transition-transform duration-300 hover:scale-105"
                             whileHover={{ y: -5 }}
                           />
                           <h2 className="font-['Inter'] font-extrabold text-2xl md:text-3xl lg:text-[40px] w-full md:w-[400px] lg:w-[500px] leading-[1.2] md:leading-[1.3] text-center">Lessons inspired by the world of Noli Me Tangere</h2>
                        </AnimatedItem>
                        <AnimatedItem className="order-3" delay={0.4}>
                            <motion.img 
                              src="/Img/LandingPage/square3.png" 
                              alt="" 
                              className="h-[200px] md:h-[250px] lg:h-[300px] transition-transform duration-300 hover:scale-105"
                              whileHover={{ rotate: 2 }}
                            />
                        </AnimatedItem>
                    </div>
                </AnimatedSection>

                {/* Footer */}
                <AnimatedSection className="py-6 text-center px-4" delay={0.1}>
                    <AnimatedItem className="flex justify-center mt-4" delay={0.2}>
                        <motion.img 
                          src="/Img/LandingPage/fchar.png" 
                          alt="Footer Characters" 
                          className="h-auto w-full max-w-4xl transition-transform duration-300 hover:scale-105"
                          whileHover={{ y: -5 }}
                        />
                    </AnimatedItem>
                    <AnimatedItem className="mt-2 text-[#282725] font-['Inter'] font-medium text-base md:text-lg lg:text-[22px]" delay={0.3}>
                      © 2025 RizHub. All rights reserved.
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

    // Add these state declarations INSIDE the LoginModal component
    const [showMatchMessage, setShowMatchMessage] = useState(false);

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
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm p-4">
    {/* Login/Signup Toggle Buttons */}
    <div className="absolute top-6 right-6 bg-[#5F290E] rounded-full flex">
        <button
            className={`px-10 py-3 md:px-12 md:py-4 rounded-full font-extrabold text-lg md:text-xl lg:text-2xl transition-all duration-200 focus:outline-none flex-1
                ${isLogin ? 'bg-[#E26F42] text-white z-[100]' : 'bg-transparent text-white'}
            `}
            style={isLogin ? {} : { borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            onClick={() => setIsLogin(true)}
        >
            access
        </button>
        <button
            className={`px-6 py-3 md:px-12 md:py-4 rounded-full font-extrabold text-lg md:text-xl lg:text-2xl transition-all duration-200 focus:outline-none flex-1
                ${!isLogin ? 'bg-[#E26F42] text-white z-[100]' : 'bg-transparent text-white'}
            `}
            style={!isLogin ? {} : { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            onClick={() => setIsLogin(false)}
        >
            join
        </button>
    </div>
    
    {/* MAIN MODAL CONTAINER */}
    <div className="w-full max-w-2xl mx-auto flex rounded-2xl z-70 overflow-hidden shadow-2xl relative">
        {/* Left Side Image */}
        <div className="hidden md:flex w-1/2 bg-orange-100 items-center justify-center relative">
            <img
                src="\Img\LandingPage\character\noli-form.gif"
                alt="Login Illustration"
                className="w-full h-full object-cover"
            />
            
            {/* Centered Text Overlay */}
            <div className="absolute inset-0 flex py-40 p-6 text-center">
                {/* Smooth glowing background */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-orange-500/20 to-orange-700/30 
                                blur-3xl animate-pulse opacity-70 -z-10"></div>

                <h2 className="text-[#FA7816] text-xl md:text-2Sxl font-extrabold drop-shadow-md leading-snug max-w-2xl">
                    {isLogin ? (
                        "Hello! Ready to continue your adventure?"
                    ) : (
                        "Get ready to learn, play, and win—because in RizHub, education becomes an adventure!"
                    )}
                </h2>
            </div>
        </div>
    
    {/* Right Side Form */}
    <div className="bg-[#FA7816] w-full md:w-1/2 p-4 md:p-4 relative flex flex-col items-center justify-center">
        {/* Close Button */}
        <button
            className="absolute top-2 right-3 md:top-3 md:right-4 text-white text-xl hover:text-[#5A3416] font-bold"
            onClick={handleClose}
            aria-label="Close"
        >✕</button>
        
        <div className="w-full flex flex-col items-center">
            {isLogin && (
                <img src="/Img/LandingPage/Login/quill.png" alt="Quill Icon" className="w-10 h-10 md:w-14 md:h-14 mb-1" />
            )}
            <h2 className="text-white text-xl md:text-2xl font-extrabold mb-3 md:mb-4 mt-1 text-center drop-shadow">Welcome!!!</h2>
        </div>

        {/* FORMS CONTAINER */}
        <div className="w-full flex flex-col items-center relative">
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
                            className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                            placeholder="email"
                            required
                        />
                        <label
                            htmlFor="login_email"
                            className={`
                                absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
                                ${loginData.email
                                    ? "-top-2 left-4 md:left-5 text-xs text-white"
                                    : "top-1/2 -translate-y-1/2"
                                }
                                peer-focus:-top-[4.5px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                            className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
                            placeholder="password"
                            required
                            style={{ border: '2px solid #fff' }}
                        />
                        <label
                            htmlFor="login_password"
                            className={`
                                absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
                                ${loginData.password
                                    ? "-top-2 left-4 md:left-5 text-xs text-white"
                                    : "top-1/2 -translate-y-1/2"
                                }
                                peer-focus:-top-[4.5px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A3416] text-sm md:text-lg"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]">
                                        <g clipPath="url(#clip0_502_2)">
                                        <path d="M10.6657 4.31697C10.252 3.63943 9.73003 3.03421 9.12067 2.52535L10.404 1.24201C10.4875 1.15557 10.5337 1.0398 10.5326 0.919622C10.5316 0.799448 10.4834 0.684492 10.3984 0.599514C10.3134 0.514535 10.1985 0.466333 10.0783 0.465288C9.95814 0.464244 9.84237 0.510441 9.75592 0.593931L8.3603 1.99139C7.49514 1.47752 6.50607 1.20969 5.49984 1.21681C2.66230 1.21681 1.04530 3.15922 0.333965 4.31697C0.114207 4.67241 -0.00219727 5.08204 -0.00219727 5.49993C-0.00219727 5.91782 0.114207 6.32745 0.333965 6.68289C0.747729 7.36043 1.26965 7.96565 1.87901 8.47451L0.595674 9.75785C0.551898 9.80013 0.516981 9.8507 0.492961 9.90662C0.468940 9.96254 0.456296 10.0227 0.455767 10.0835C0.455238 10.1444 0.466835 10.2047 0.489880 10.2611C0.512926 10.3174 0.546959 10.3686 0.589993 10.4116C0.633027 10.4546 0.684201 10.4887 0.740528 10.5117C0.796856 10.5348 0.857209 10.5464 0.918066 10.5458C0.978923 10.5453 1.03907 10.5327 1.09498 10.5086C1.15090 10.4846 1.20148 10.4497 1.24376 10.4059L2.64259 9.0071C3.50667 9.52089 4.49456 9.78918 5.49984 9.78306C8.33738 9.78306 9.95438 7.84064 10.6657 6.68289C10.8855 6.32745 11.0019 5.91782 11.0019 5.49993C11.0019 5.08204 10.8855 4.67241 10.6657 4.31697V4.31697ZM1.11497 6.20301C0.984403 5.99174 0.915247 5.74829 0.915247 5.49993C0.915247 5.25157 0.984403 5.00812 1.11497 4.79685C1.72638 3.8041 3.10826 2.13347 5.49984 2.13347C6.26080 2.12921 7.01107 2.31261 7.68426 2.66743L6.76163 3.59006C6.32160 3.29792 5.79405 3.16701 5.26849 3.21956C4.74293 3.27211 4.25174 3.50487 3.87826 3.87835C3.50478 4.25183 3.27202 4.74302 3.21947 5.26858C3.16692 5.79414 3.29782 6.32169 3.58997 6.76172L2.53122 7.82047C1.96980 7.36659 1.49072 6.81945 1.11497 6.20301V6.20301ZM6.87484 5.49993C6.87484 5.86460 6.72998 6.21434 6.47211 6.47220C6.21425 6.73007 5.86451 6.87493 5.49984 6.87493C5.29566 6.87414 5.09431 6.82713 4.91088 6.73743L6.73734 4.91097C6.82704 5.09440 6.87405 5.29575 6.87484 5.49993V5.49993ZM4.12484 5.49993C4.12484 5.13526 4.26971 4.78552 4.52757 4.52766C4.78543 4.26980 5.13517 4.12493 5.49984 4.12493C5.70402 4.12572 5.90537 4.17273 6.08880 4.26243L4.26234 6.08889C4.17264 5.90546 4.12563 5.70411 4.12484 5.49993ZM9.88472 6.20301C9.27330 7.19576 7.89142 8.86639 5.49984 8.86639C4.73888 8.87065 3.98861 8.68726 3.31542 8.33243L4.23805 7.40981C4.67808 7.70195 5.20563 7.83285 5.73119 7.78030C6.25675 7.72775 6.74794 7.49499 7.12142 7.12151C7.49490 6.74803 7.72766 6.25684 7.78021 5.73128C7.83276 5.20572 7.70186 4.67817 7.40972 4.23814L8.46847 3.17939C9.02988 3.63327 9.50896 4.18041 9.88472 4.79685C10.0153 5.00812 10.0844 5.25157 10.0844 5.49993C10.0844 5.74829 10.0153 5.99174 9.88472 6.20301V6.20301Z" fill="#5A3416"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_502_2">
                                        <rect width="11" height="11" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                ) : (
                                    <svg className="h-[14px] w-[14px] md:h-[16px] md:w-[16px]" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clipPath="url(#clip0_504_12)">
                                        <path d="M10.6657 4.31696C9.95484 3.15921 8.33784 1.2168 5.49984 1.2168C2.66184 1.2168 1.04484 3.15921 0.333965 4.31696C0.114207 4.6724 -0.00219727 5.08203 -0.00219727 5.49992C-0.00219727 5.91781 0.114207 6.32744 0.333965 6.68288C1.04484 7.84063 2.66184 9.78305 5.49984 9.78305C8.33784 9.78305 9.95484 7.84063 10.6657 6.68288C10.8855 6.32744 11.0019 5.91781 11.0019 5.49992C11.0019 5.08203 10.8855 4.6724 10.6657 4.31696V4.31696ZM9.88426 6.20301C9.27376 7.19576 7.89188 8.86638 5.49984 8.86638C3.10780 8.86638 1.72592 7.19576 1.11542 6.20301C0.984861 5.99173 0.915705 5.74828 0.915705 5.49992C0.915705 5.25156 0.984861 5.00811 1.11542 4.79684C1.72592 3.80409 3.10780 2.13346 5.49984 2.13346C7.89188 2.13346 9.27376 3.80226 9.88426 4.79684C10.0148 5.00811 10.084 5.25156 10.084 5.49992C10.084 5.74828 10.0148 5.99173 9.88426 6.20301V6.20301Z" fill="#5A3416"/>
                                        <path d="M5.49992 3.20825C5.04667 3.20825 4.60360 3.34266 4.22674 3.59447C3.84988 3.84628 3.55615 4.20419 3.38270 4.62294C3.20924 5.04168 3.16386 5.50246 3.25229 5.94700C3.34071 6.39154 3.55897 6.79988 3.87947 7.12037C4.19996 7.44087 4.60830 7.65913 5.05284 7.74755C5.49738 7.83598 5.95815 7.79059 6.37690 7.61714C6.79565 7.44369 7.15356 7.14996 7.40537 6.77310C7.65718 6.39624 7.79159 5.95317 7.79159 5.49992C7.79086 4.89235 7.54918 4.30988 7.11957 3.88027C6.68996 3.45066 6.10748 3.20898 5.49992 3.20825V3.20825ZM5.49992 6.87492C5.22797 6.87492 4.96213 6.79428 4.73601 6.64319C4.50989 6.49210 4.33366 6.27736 4.22959 6.02611C4.12551 5.77486 4.09829 5.49839 4.15134 5.23167C4.20439 4.96495 4.33535 4.71994 4.52765 4.52765C4.71994 4.33535 4.96495 4.20439 5.23167 4.15134C5.49839 4.09828 5.77486 4.12551 6.02611 4.22958C6.27736 4.33365 6.49210 4.50989 6.64319 4.73601C6.79428 4.96213 6.87492 5.22797 6.87492 5.49992C6.87492 5.86459 6.73005 6.21433 6.47219 6.47219C6.21433 6.73005 5.86459 6.87492 5.49992 6.87492Z" fill="#5A3416"/>
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
                        className="w-full mt-4 rounded-full bg-[#5A3416] text-white text-base md:text-lg font-bold py-2 md:py-2.5 transition-all duration-200 hover:bg-[#3d2410]"
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
                                className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
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
                                    absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
                                    ${regData.name
                                        ? "-top-2 left-4 md:left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4.5px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
                        <div className="w-full mb-1 relative">
                            <input
                                id="reg_email"
                                type="email"
                                name="email"
                                className="peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 border-white focus:border-white outline-none focus:outline-none focus:ring-0 focus:shadow-none bg-[#FA7816] text-[#5A3416] placeholder-transparent font-semibold shadow-inner"
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
                                    absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
                                    ${regData.email
                                        ? "-top-2 left-4 md:left-5 text-xs text-white"
                                        : "top-1/2 -translate-y-1/2"
                                    }
                                    peer-focus:-top-[4px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
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
<div className="w-full mb-1 relative">
  <div className="relative py-2 md:py-2.5">
    <input
      id="reg_password"
      type={showPassword ? "text" : "password"}
      name="password"
      value={regData.password}
      onChange={(e) => setRegData('password', e.target.value)}
      onFocus={() => setIsPasswordFocused(true)}
      placeholder="password"
      className={`peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 outline-none focus:ring-0 focus:shadow-none font-semibold shadow-inner
        ${
          regData.password_confirmation
            ? regData.password === regData.password_confirmation
              ? "border-green-500 bg-green-100"
              : "border-red-500 bg-red-100"
            : "border-white bg-[#FA7816]"
        } text-[#5A3416] placeholder-transparent`}
      required
    />
    <label
      htmlFor="reg_password"
      className={`
        absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
        ${regData.password
          ? "-top-2 left-4 md:left-5 text-xs text-white"
          : "top-1/2 -translate-y-1/2"
        }
        peer-focus:top-[4px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
      `}
      style={{
        background: "#FA7816",
        padding: "0 6px",
        borderRadius: "8px",
      }}
    >
      password:
    </label>
  </div>
</div>

{/* Confirm Password */}
<div className="w-full mb-1 relative">
  <input
    id="reg_password_confirmation"
    type={showPassword ? "text" : "password"}
    name="password_confirmation"
    value={regData.password_confirmation}
    onChange={(e) => setRegData('password_confirmation', e.target.value)}
    onFocus={() => setIsPasswordFocused(false)}
    placeholder="confirm password"
    required
    className={`peer w-full rounded-full px-4 md:px-5 py-2 md:py-2.5 text-sm md:text-base border-2 outline-none focus:ring-0 focus:shadow-none font-semibold 
      ${
        regData.password_confirmation
          ? regData.password === regData.password_confirmation
            ? "border-green-500 bg-green-100"
            : "border-red-500 bg-red-100"
          : "border-white bg-[#FA7816]"
      } text-[#5A3416] placeholder-transparent`}
  />
  <label
    htmlFor="reg_password_confirmation"
    className={`
      absolute left-4 md:left-6 text-white text-sm md:text-base pointer-events-none transition-all duration-200
      ${regData.password_confirmation
        ? "-top-2 left-4 md:left-5 text-xs text-white"
        : "top-1/2 -translate-y-1/2"
      }
      peer-focus:-top-[4.5px] peer-focus:left-4 md:peer-focus:left-5 peer-focus:text-xs peer-focus:text-white
    `}
    style={{
      background: "#FA7816",
      padding: "0 6px",
      borderRadius: "8px",
    }}
  >
    confirm password:
  </label>

  {/* Matching Indicator Message */}
  {showMatchMessage && (
    <p
      className={`text-xs mt-1 font-semibold ${
        regData.password === regData.password_confirmation
          ? "text-green-600"
          : "text-red-600"
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
                                onFocus={() => setIsPasswordFocused(false)} // Close password requirements
                                required
                                className="mr-2 accent-[#5A3416]"
                            />

                            <label htmlFor="terms" className="text-[#5A3416] text-xs md:text-sm select-none">
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
                            className="w-full mt-4 rounded-full bg-[#5A3416] text-white text-base md:text-lg font-bold py-2 md:py-2.5 transition-all duration-200 hover:bg-[#3d2410]"
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
    </div>

     {/* PASSWORD REQUIREMENTS - POSITIONED AS OVERLAY OUTSIDE THE MAIN MODAL */}
    {isPasswordFocused && !isLogin && (
        <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 ml-96 w-64 z-80">
            <div className="relative p-4 bg-white rounded-xl shadow-2xl border-2 border-orange-200">
                {/* Bigger arrow pointing to password field with proper styling */}
                <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-0 h-0 border-t-[12px] border-b-[12px] border-l-0 border-r-[12px] border-t-transparent border-b-transparent border-r-orange-200 border-l-transparent"></div>
                    <div className="absolute -left-px top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-0 border-r-[10px] border-t-transparent border-b-transparent border-r-white border-l-transparent"></div>
                </div>
                <p className="text-[#5A3416] text-sm font-bold mb-3">Password must contain:</p>
                <ul className="text-xs space-y-2">
                    <li className={`flex items-center ${passwordChecks.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2 font-bold">{passwordChecks.hasUppercase ? '✓' : '✗'}</span>
                        At least one uppercase letter (A-Z)
                    </li>
                    <li className={`flex items-center ${passwordChecks.hasLowercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2 font-bold">{passwordChecks.hasLowercase ? '✓' : '✗'}</span>
                        At least one lowercase letter (a-z)
                    </li>
                    <li className={`flex items-center ${passwordChecks.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2 font-bold">{passwordChecks.hasNumber ? '✓' : '✗'}</span>
                        At least one number (0-9)
                    </li>
                    <li className={`flex items-center ${passwordChecks.hasSpecialChar ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2 font-bold">{passwordChecks.hasSpecialChar ? '✓' : '✗'}</span>
                        At least one special character
                    </li>
                    <li className={`flex items-center ${passwordChecks.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-2 font-bold">{passwordChecks.hasMinLength ? '✓' : '✗'}</span>
                        At least 8 characters long
                    </li>
                </ul>
            </div>
        </div>
    )}
</div>
    )}