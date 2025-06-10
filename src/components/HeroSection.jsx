import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    bg: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    title: "Build Your Perfect Snack Box",
    desc: "Choose from 100+ snacks and customize your box as you like.",
  },
  {
    bg: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
    title: "Flexible Weekly & Monthly Delivery",
    desc: "Get your snack box delivered at your convenience-no hassle, no worries.",
  },
  {
    bg: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    title: "Healthy, Tasty, Always Fresh",
    desc: "Handpicked snacks, curated for your taste and well-being.",
  },
  {
    bg: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=1200&q=80",
    title: "Perfect for Home, Office & Gifting",
    desc: "Surprise yourself or someone special with a personalized snack box.",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [mounted, setMounted] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setFade(true);
      }, 350);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [current]);

  const goTo = (idx) => {
    setFade(false);
    setTimeout(() => {
      setCurrent(idx);
      setFade(true);
    }, 350);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setFade(false);
        setTimeout(() => {
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
          setFade(true);
        }, 350);
      } else {
        setFade(false);
        setTimeout(() => {
          setCurrent((prev) => (prev + 1) % slides.length);
          setFade(true);
        }, 350);
      }
    }
    touchStartX.current = null;
  };

  const handleStartBuilding = () => {
    const el = document.getElementById("categories");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.section
      className="w-full flex justify-center items-center py-6 md:py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="
          relative w-full
          max-w-lg sm:max-w-xl md:max-w-2xl
          min-h-[220px] md:min-h-[320px]
          flex items-center justify-center
          rounded-2xl md:rounded-3xl
          shadow-xl overflow-hidden
          bg-white
        "
      >
        {/* Background image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={slides[current].bg}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
            style={{ zIndex: 1, opacity: 0.92 }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.92, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            draggable={false}
            loading="eager"
          />
        </AnimatePresence>
        {/* Overlay for readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, #60a5fa33 0%, #bfdbfe22 100%)", // blue-400 to blue-200, light overlay
            zIndex: 2,
          }}
        />
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "-content"}
            className="relative z-20 flex flex-col items-center justify-center w-full"
            style={{
              maxWidth: "500px",
              margin: "0 auto",
              minHeight: "140px",
            }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
              {slides[current].title}
            </h1>
            <p className="text-base md:text-lg text-white mb-5 max-w-xl mx-auto">
              {slides[current].desc}
            </p>
            <button
              className="bg-[#2196f3] hover:bg-[#1769aa] text-white font-bold px-6 py-2 rounded-full shadow transition"
              onClick={handleStartBuilding}
            >
              Start Building
            </button>
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full border border-[#2196f3] transition ${
                    idx === current ? "bg-[#2196f3]" : "bg-white/80"
                  }`}
                  onClick={() => goTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
