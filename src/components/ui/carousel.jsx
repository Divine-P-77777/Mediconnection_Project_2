import { useState } from "react";

const Carousel = ({ children, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? children.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === children.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`relative overflow-hidden w-full ${className}`}>
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {children}
      </div>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        ◀
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        ▶
      </button>
    </div>
  );
};

const CarouselItem = ({ children, className }) => {
  return (
    <div className={`w-full flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
};

// ✅ Named Exports
export { Carousel, CarouselItem };
