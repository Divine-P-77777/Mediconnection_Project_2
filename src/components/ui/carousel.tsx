"use client";

import { useState, ReactNode } from "react";

interface CarouselProps {
  children: ReactNode[];
  className?: string;
}

interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}


const Carousel = ({ children, className = "" }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const total = children.length;

  const prevSlide = (): void => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const nextSlide = (): void => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
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
        type="button"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        ◀
      </button>

      <button
        type="button"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        ▶
      </button>
    </div>
  );
};


const CarouselItem = ({ children, className = "" }: CarouselItemProps) => {
  return (
    <div className={`w-full flex-shrink-0 ${className}`}>
      {children}
    </div>
  );
};

export { Carousel, CarouselItem };
