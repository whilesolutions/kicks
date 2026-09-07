import React from 'react';

interface CategoryCard {
  title: string;
  countKey: string;
  image: string;
  navType: string;
}

const CATEGORIES: CategoryCard[] = [
  {
    title: 'Calzado Caballero',
    countKey: 'Caballero',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop',
    navType: 'Hombre'
  },
  {
    title: 'Calzado Dama',
    countKey: 'Dama',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
    navType: 'Mujer'
  },
  {
    title: 'Chaquetas',
    countKey: 'Chaquetas',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop',
    navType: 'ropa:Chaquetas'
  },
  {
    title: 'Franelas & Polos',
    countKey: 'Franelas',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    navType: 'ropa:Franelas'
  },
  {
    title: 'Camisas',
    countKey: 'Camisas',
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600&auto=format&fit=crop',
    navType: 'ropa:Camisas'
  },
  {
    title: 'Pantalones & Shorts',
    countKey: 'Pantalones',
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop',
    navType: 'ropa:Pantalones'
  }
];

interface Props {
  onSelect: (type: string) => void;
}

export function CategoryGrid({ onSelect }: Props) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 mb-12 select-none">
      <div className="flex flex-col mb-6">
        <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#B3B3B3]">Explora Nuestras Colecciones</h3>
        <h2 className="text-xl md:text-2xl font-black uppercase text-black -mt-1">Categorías Destacadas</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat, idx) => (
          <div 
            key={idx}
            onClick={() => onSelect(cat.navType)}
            className="group relative h-48 rounded-2xl overflow-hidden bg-stone-100 cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95 border border-stone-200"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:via-black/35 transition-all" />

            {/* Bottom Content Label */}
            <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left z-10">
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#FCD901] transition-colors">
                {cat.title}
              </h4>
              <span className="text-[9px] font-bold text-stone-300 uppercase tracking-widest mt-0.5 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex items-center">
                Ver Colección
                <span className="ml-1 text-[10px]">→</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
