import React from 'react';
// @ts-ignore
import promoShoesConcrete from "../assets/images/promo_shoes_concrete_1781474436551.jpg";

export function PromoMidBanner() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 mb-16 select-none">
      <div className="relative overflow-hidden rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-200 cursor-pointer group aspect-[21/9]">
        {/* High-impact retail banner image */}
        <img 
          src={promoShoesConcrete} 
          alt="Colección y Promociones Exclusivas de Temporada" 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]" 
          referrerPolicy="no-referrer"
        />
        {/* Sleek vignette frame to ground the visual elegance */}
        <div className="absolute inset-0 bg-stone-900/5 mix-blend-multiply pointer-events-none" />
      </div>
    </div>
  );
}
