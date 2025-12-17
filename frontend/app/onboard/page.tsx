'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Donasi Menjadi Mudah',
    description:
      'Donasiku adalah platform untuk memberikan donasi barang layak pakai ke berbagai kalangan, ini merupakan program sosial untuk membantu sesama manusia.',
    image: '/onboard-1.jpg',
    buttonText: 'Lanjut',
  },
  {
    id: 2,
    title: 'Punya barang bekas layak pakai ?',
    description:
      'Jangan biarkan barang tak terpakai menumpuk. Donasikan dengan mudah lewat Donasiku dan bantu mereka yang membutuhkan.',
    image: '/onboard-2.jpg',
    buttonText: 'Lanjut',
  },
  {
    id: 3,
    title: 'Maknai setiap hidup sebagai donatur',
    description:
      'Setiap donasi membawa harapan baru, jadilah bagian dari perubahan dan kebahagiaan bagi sesama.',
    image: '/onboard-3.jpg',
    buttonText: 'Mulai Donasi',
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToNextSlide = () => {
    if (currentSlide === slides.length - 1) {
      // Redirect to login page
      window.location.href = '/auth/login';
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-4 text-center">
        <Image
          src="/f6b78b3278cda1016742221dca3c5b8cdbce72c9.png"
          alt="Donasiku Logo"
          width={120}
          height={40}
          priority
          className="mx-auto"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Image */}
        <div className="w-full mb-8">
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
          {slides[currentSlide].title}
        </h1>

        {/* Description */}
        <p className="text-base md:text-lg text-gray-600 text-center mb-8 max-w-md leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${index === currentSlide ? 'bg-primary w-8' : 'bg-gray-300'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="w-full flex gap-4 flex-col-reverse sm:flex-row">
          <Link
            href="/auth/login"
            className="flex-1 py-3 px-6 text-center font-semibold text-gray-700 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Lewati
          </Link>
          <button
            onClick={goToNextSlide}
            className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-colors"
          >
            {slides[currentSlide].buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
