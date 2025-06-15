import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight, Clock } from 'lucide-react';

// Import required Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';


const NewsCarousel = ({
  items,
  title = "News",
  autoplayDelay = 5000,
  className = "",
  showReadMoreButton = true,
  effect = "slide", 
  showDate = true,
  accentColor = "black",
}) => {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  if (!items || items.length === 0) {
    return null;
  }

  useEffect(() => {
    if (swiper) {
      swiper.on('slideChange', () => {
        setActiveIndex(swiper.realIndex);
      });
    }
    
    return () => {
      if (swiper) {
        swiper.off('slideChange');
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [swiper]);

  // Custom navigation functions
  const goPrev = () => {
    if (swiper) swiper.slidePrev();
  };

  const goNext = () => {
    if (swiper) swiper.slideNext();
  };

  // Toggle autoplay
  const toggleAutoplay = () => {
    if (swiper) {
      if (isAutoplayPaused) {
        swiper.autoplay.start();
      } else {
        swiper.autoplay.stop();
      }
      setIsAutoplayPaused(!isAutoplayPaused);
    }
  };

  // Generate CSS variables for the accent color
  const accentColorStyle = {
    '--accent-color': accentColor,
    '--accent-color-light': `${accentColor}33`, // 20% opacity
  };

  return (
    <section 
      className={`w-full py-12 md:py-16 bg-gray-50 lg:py-20 ${className}`} 
      aria-labelledby="news-heading"
      style={accentColorStyle}
    >
      <div className="container mx-auto ">
        <div className="shadow-customm p-7 bg-white rounded-xl">

        <div className="flex items-center justify-between mb-6">
          <h2 
            id="news-heading" 
            className="text-3xl md:text-4xl font-bold border-b-2 pb-2"
            style={{ borderColor: 'var(--accent-color)' }}
          >
            {title}
          </h2>

          <div className="flex items-center space-x-3">
            {/* Autoplay toggle button */}
            <button
              onClick={toggleAutoplay}
              className="hidden md:flex items-center justify-center p-2 rounded bg-codee hover:bg-gray-200 transition-colors"
              aria-label={isAutoplayPaused ? "Resume autoplay" : "Pause autoplay"}
            >
              {isAutoplayPaused ? (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>

            {/* Custom navigation arrows */}
            <div className="flex items-center space-x-2">
              <button
                onClick={goPrev}
                className="p-2 rounded bg-codee hover:bg-gray-200 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goNext}
                className="p-2 rounded bg-codee hover:bg-gray-200 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Swiper component */}
        <div className="relative">
          <Swiper
            onSwiper={setSwiper}
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            autoplay={{ delay: autoplayDelay, disableOnInteraction: false }}
            effect={effect === 'fade' ? 'fade' : 'slide'}
            loop={true}
            slidesPerView={1}
            speed={800}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              bulletActiveClass: 'opacity-100',
              bulletClass: 'inline-block w-2 h-2 mx-1 rounded-full opacity-60 transition-all duration-300',
              renderBullet: (index, className) => {
                return `<span class="${className}" style="background-color: var(--accent-color)"></span>`;
              }
            }}
            className="rounded-xl lg:rounded-2xl overflow-hidden shadow-cu"
          >
            {items.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="group relative w-full overflow-hidden aspect-[16/9] md:aspect-[2/1] lg:aspect-[21/9]">
                  {/* Image container */}
                  <div 
                    className="absolute inset-0 bg-center bg-cover  transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image?.src || item.image})` }}
                    aria-hidden="true"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-10 z-10">
                    <div className="max-w-3xl">
                    
                      {/* Category tag */}
                      {item.category && (
                        <span 
                          className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3"
                          style={{ 
                            backgroundColor: 'var(--accent-color)',
                            color: '#fff' 
                          }}
                        >
                          {item.category}
                        </span>
                      )}
                      
                      <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 text-white">
                        {item.title}
                      </h3>
                      
                      <p className="text-sm md:text-base mb-4 max-w-prose text-white/90 line-clamp-2 md:line-clamp-3">
                        {item.description}
                      </p>

                      {showReadMoreButton && (
                        <a 
                          href={item.link || "#"} 
                          className="inline-flex items-center text-sm font-medium rounded-lg transition-all 
                            py-2 px-4 md:py-3 md:px-5 group/btn hover:transform hover:-translate-y-1"
                          style={{ 
                            backgroundColor: 'var(--accent-color)',
                            color: '#fff' 
                          }}
                        >
                          Read More 
                          <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Progress indicator */}
          

          {/* Custom pagination */}
          <div className="swiper-pagination flex justify-center mt-4"></div>
          
          {/* Slide counter */}
          <div className="hidden shadow- md:block absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white font-medium">
            {activeIndex + 1} / {items.length}
          </div>
        </div>
        
        {/* Thumbnails for desktop */}
        <div className="hidden lg:grid grid-cols-3 gap-4 mt-4">
          {items.slice(0, 3).map((item, index) => (
            <button
              key={index}
              onClick={() => swiper?.slideTo(index)}
              className={`flex items-center p-3 rounded-lg shadow-customm mt-2 transition-all ${
                activeIndex === index 
                  ? 'bg-gray-100 border-l-4' 
                  : 'bg-white hover:bg-gray-50 border-l-4 border-transparent'
              }`}
              style={activeIndex === index ? { borderLeftColor: 'var(--accent-color)' } : {}}
            >
              <div 
                className="w-16 h-16 rounded-md bg-center bg-cover flex-shrink-0 mr-3"
                style={{ backgroundImage: `url(${item.image?.src || item.image})` }}
              />
              <div className="text-left">
                <h4 className="font-medium line-clamp-1">{item.title}</h4>
                {showDate && item.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

// Example usage with enhanced demo data
const demoNewsItems = [
  {
    image: { src: "/tshirt6.jpg" },
    title: "TeexVerse yangiliklari",
    description: "Bizning yangi t-shirt kolleksiyamizni ko'ring. Premium materiallardan tayyorlangan va zamonaviy dizaynlar bilan bezatilgan.",
    link: "/news/new-collection",
    date: "2025-05-01",
    category: "New Collection"
  },
  {
    image: { src: "/tshirt8.jpg" },
    title: "Design news",
    description: "AI bilan yaratilgan maxsus dizaynlar. Zamonaviy texnologiya va ijodkorlik birlashganda ajoyib natijalar olinadi.",
    link: "/news/ai-designs",
    date: "2025-04-28",
    category: "Technology"
  },
  {
    image: { src: "/tshirt9.jpg" },
    title: "Sifat va uslub birlashdi",
    description: "Yuqori sifatli matolardan tayyorlangan mahsulotlar. Biz har bir detalga e'tibor beramiz, chunki siz eng yaxshisiga loyiqsiz.",
    link: "/news/quality-materials",
    date: "2025-04-25",
    category: "Quality"
  }
];


export default function NewsCarouselDemo() {
  return (
    <NewsCarousel 
      items={demoNewsItems} 
      title="Latest News"
      accentColor="#0fd6a0" 
      effect="slide"
    />
  );
}