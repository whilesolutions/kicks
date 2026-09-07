import React from 'react';
import { Product } from '../types';

interface Props {
  product: Product;
  onClick: (p: Product) => void;
  key?: any;
}

const COLOR_MAP: Record<string, string> = {
  "Blanco": "#ffffff",
  "Negro": "#000000",
  "Gris": "#808080",
  "Azul": "#1e40af",
  "Verde": "#166534",
  "Rojo": "#991b1b",
  "Amarillo": "#facc15",
  "Marrón": "#78350f",
  "Naranja": "#ea580c",
  "Rosa": "#fbcfe8",
  "Morado": "#581c87",
  "Celeste": "#38bdf8",
  "Beige": "#f5f5dc",
  "Kaki": "#c2b280",
  "Gris/Verde": "#5f9ea0",
  "Marino": "#1e3a8a",
  "Camel": "#c19a6b",
  "Oliva": "#808000",
  "Marfil": "#fffff0"
};

export function ProductCard({ product, onClick }: Props) {
  const [displayedImage, setDisplayedImage] = React.useState(product.images[0]);

  React.useEffect(() => {
    setDisplayedImage(product.images[0]);
  }, [product.images]);

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-3"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-50 rounded-2xl border border-stone-100">
        <img
          src={displayedImage}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.isNew && (
          <div className="absolute left-3 top-3 bg-black px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white rounded-md shadow-sm">
            Nuevo
          </div>
        )}
        {product.isOnSale && (
          <div className="absolute left-3 top-3 bg-[#C21F3F] px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-white rounded-md shadow-sm">
            Promoción
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-black group-hover:underline">{product.name}</h3>
            <p className="mt-1 text-xs text-gray-500 uppercase tracking-widest">{product.brand}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm font-semibold text-black">${product.price.toFixed(2)}</p>
            {product.comparePrice && (
              <p className="text-[10px] text-gray-600 line-through">${product.comparePrice.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <div className="mt-2.5 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {product.colors.length} {product.colors.length === 1 ? 'Color' : 'Colores'}
          </p>
          <div className="flex flex-wrap items-center gap-1 max-w-[65%] justify-end">
            {product.colors.map((color, idx) => {
              const swatchImage = (product.colorVariants && product.colorVariants[color]?.images?.[0]) || product.images[idx % product.images.length] || product.images[0];
              const isActive = displayedImage === swatchImage;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDisplayedImage(swatchImage);
                  }}
                  className={`relative h-7 w-7 overflow-hidden rounded-md border transition-all hover:scale-105 active:scale-95 ${
                    isActive 
                      ? 'border-black ring-1 ring-black z-10 scale-105' 
                      : 'border-stone-200 hover:border-stone-400'
                  }`}
                  title={color}
                >
                  <img 
                    src={swatchImage} 
                    alt={color} 
                    className="h-full w-full object-cover" 
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
