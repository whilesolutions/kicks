import React from 'react';

const BRANDS = [
  { name: 'AVIA', motto: 'PERFORMANCE ATHLETICS' },
  { name: 'ORIGINAL PENGUIN', motto: 'EST. 1955 MINNEAPOLIS' },
  { name: 'HEY DUDE', motto: 'LIGHTWEIGHT COMFORT' },
  { name: 'CARVEN', motto: 'PARIS COUTURE' },
];

export function BrandCarousel() {
  // Duplicate list of brands multiple times to ensure seamless infinite looping marquee
  const items = [...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <div className="bg-[#EDEDED] py-10 overflow-hidden border-t border-b border-gray-200 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-center text-[10px] uppercase font-bold tracking-wider text-gray-600">
          Nuestras Marcas Aliadas y Auténticas
        </p>
      </div>
      <div className="relative flex w-full overflow-hidden">
        {/* Infinite sliding container */}
        <div className="flex gap-16 md:gap-24 items-center animate-marquee whitespace-nowrap py-2">
          {items.map((brand, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center shrink-0 min-w-[150px] cursor-pointer hover:scale-105 transition-transform"
            >
              {brand.name === 'AVIA' && (
                <div className="flex flex-col items-center">
                  <span className="font-mono text-2xl font-black tracking-tight text-gray-800">AVIA</span>
                  <span className="text-[7px] tracking-widest text-gray-500 font-bold -mt-1">ELEVATE PHYSICAL</span>
                </div>
              )}
              {brand.name === 'ORIGINAL PENGUIN' && (
                <div className="flex flex-col items-center">
                  <span className="font-serif text-xl font-bold tracking-tighter text-gray-800 italic">Penguin</span>
                  <span className="text-[6px] tracking-wider text-gray-500 font-bold">ORIGINAL PENGUIN</span>
                </div>
              )}
              {brand.name === 'HEY DUDE' && (
                <div className="flex flex-col items-center">
                  <span className="font-sans text-xl font-black tracking-widest text-amber-900">hey dude!</span>
                  <span className="text-[6px] tracking-wider text-gray-500 font-bold">FEATHERWEIGHT</span>
                </div>
              )}
              {brand.name === 'CARVEN' && (
                <div className="flex flex-col items-center">
                  <span className="font-serif text-xl tracking-[0.2em] font-extrabold text-stone-800">CARVEN</span>
                  <span className="text-[6px] tracking-normal text-stone-500 uppercase font-semibold">PARIS</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
