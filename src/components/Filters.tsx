import React, { useState } from 'react';
import { SizeRef } from '../types';
import { SlidersHorizontal, ChevronDown, ChevronUp, X, Sparkles } from 'lucide-react';

interface Props {
  brands: string[];
  selectedBrand: string | null;
  setSelectedBrand: (b: string | null) => void;
  sizes: SizeRef[];
  selectedSize: string | null;
  setSelectedSize: (s: string | null) => void;
  genders: string[];
  selectedGender: string | null;
  setSelectedGender: (g: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (c: string | null) => void;
  colors: string[];
  showOnlySale: boolean;
  setShowOnlySale: (s: boolean) => void;
  selectedCategory: 'Calzado' | 'Ropa' | null;
  setSelectedCategory: (c: 'Calzado' | 'Ropa' | null) => void;
  selectedSubcategory: string | null;
  setSelectedSubcategory: (s: string | null) => void;
}

const COLOR_MAP: Record<string, string> = {
  "Negro": "#18181b",
  "Blanco": "#ffffff",
  "Gris Claro": "#e5e7eb",
  "Gris Oscuro": "#4b5563",
  "Plata": "#d1d5db",
  "Carbón": "#374151",
  "Hueso": "#f3f4f6",
  "Crema": "#fef3c7",
  "Ónix": "#1f2937",
  "Ceniza": "#9ca3af",
  "Pizarra": "#64748b",
  "Marfil": "#fffff0"
};

const SUBCATEGORIES = ["Chaquetas", "Chemises", "Franelas", "Camisas", "Shorts", "Pantalones"];

export function Filters({ 
  brands, selectedBrand, setSelectedBrand, 
  sizes, selectedSize, setSelectedSize,
  genders, selectedGender, setSelectedGender,
  colors, selectedColor, setSelectedColor,
  showOnlySale, setShowOnlySale,
  selectedCategory, setSelectedCategory,
  selectedSubcategory, setSelectedSubcategory
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Check if any filter is active
  const hasActiveFilters = !!(selectedBrand || selectedSize || selectedGender || selectedColor || showOnlySale || selectedCategory || selectedSubcategory);

  const activePillsCount = [
    selectedGender ? 1 : 0,
    selectedBrand ? 1 : 0,
    selectedColor ? 1 : 0,
    selectedSize ? 1 : 0,
    showOnlySale ? 1 : 0,
    selectedCategory ? 1 : 0,
    selectedSubcategory ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const clearAllFilters = () => {
    setSelectedBrand(null);
    setSelectedSize(null);
    setSelectedGender(null);
    setSelectedColor(null);
    setShowOnlySale(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  return (
    <div className="sticky top-[80px] z-20 w-full mb-8 select-none transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-2xl shadow-md transition-all duration-300 overflow-hidden px-4 md:px-6 py-3">
        
        {/* HEADER BAR (Toggle Accordion / Status Summary) */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2.5 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-stone-800 transition-all active:scale-95"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtrar Productos
              {activePillsCount > 0 && (
                <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold ml-1">
                  {activePillsCount}
                </span>
              )}
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {/* Quick overview of active filters when closed */}
            {!isOpen && hasActiveFilters && (
              <div className="hidden lg:flex flex-wrap items-center gap-1.5 transition-all">
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    {selectedCategory}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }} />
                  </span>
                )}
                {selectedSubcategory && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    {selectedSubcategory}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => setSelectedSubcategory(null)} />
                  </span>
                )}
                {selectedGender && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    {selectedGender}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => setSelectedGender(null)} />
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    {selectedBrand}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => setSelectedBrand(null)} />
                  </span>
                )}
                {selectedColor && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLOR_MAP[selectedColor] || '#ccc' }} />
                    {selectedColor}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => setSelectedColor(null)} />
                  </span>
                )}
                {selectedSize && (
                  <span className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/60 px-2 py-1 rounded-lg text-[10px] font-bold uppercase text-stone-700">
                    Talla {selectedSize}
                    <X className="w-2.5 h-2.5 cursor-pointer hover:text-black" onClick={() => setSelectedSize(null)} />
                  </span>
                )}
                {showOnlySale && (
                  <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 border border-yellow-200 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">
                    PROMO
                    <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setShowOnlySale(false)} />
                  </span>
                )}
                <button 
                  onClick={clearAllFilters}
                  className="text-[10px] font-extrabold uppercase text-stone-400 hover:text-black transition-colors ml-2"
                >
                  Limpiar Todo
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowOnlySale(!showOnlySale)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${showOnlySale ? 'bg-yellow-400 text-stone-900 font-extrabold shadow-sm' : 'bg-stone-900 text-white hover:bg-stone-800'}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {showOnlySale ? '✓ En Promoción' : 'Ver Promociones'}
            </button>
          </div>
        </div>

        {/* EXPANDABLE ACCORDION CONTENT */}
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 mt-6 pt-4 border-t border-stone-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-left">
            
            {/* Tipo de Producto Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B3B3B3]">Tipo de Producto</span>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${!selectedCategory ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                >
                  Todos los Productos
                </button>
                <button 
                  onClick={() => { setSelectedCategory('Calzado'); setSelectedSubcategory(null); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${selectedCategory === 'Calzado' ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                >
                  Calzado
                </button>
                <button 
                  onClick={() => { setSelectedCategory('Ropa'); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${selectedCategory === 'Ropa' && !selectedSubcategory ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                >
                  Ropa (Ver Todo)
                </button>
              </div>

              {selectedCategory === 'Ropa' && (
                <div className="flex flex-col gap-1 mt-2.5 p-2 bg-stone-50/80 rounded-xl border border-stone-200/30">
                  <span className="text-[8px] font-extrabold uppercase text-stone-400 tracking-widest mb-1 block">Subtipos de Ropa</span>
                  <div className="flex flex-wrap gap-1">
                    {SUBCATEGORIES.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded transition-colors ${selectedSubcategory === sub ? 'bg-stone-900 text-white' : 'bg-stone-200/60 hover:bg-stone-300/65 text-stone-700'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Genders Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B3B3B3]">Género / Para</span>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => setSelectedGender(null)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${!selectedGender ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                >
                  Todos
                </button>
                {genders.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setSelectedGender(g)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${selectedGender === g ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B3B3B3]">Marcas</span>
              <div className="flex flex-wrap gap-1.5">
                <button 
                  onClick={() => setSelectedBrand(null)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${!selectedBrand ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                >
                  Todas
                </button>
                {brands.map(b => (
                  <button 
                    key={b} 
                    onClick={() => setSelectedBrand(b)}
                    className={`px-3 py-1.5 text-xs font-bold uppercase rounded-lg transition-colors ${selectedBrand === b ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 border border-stone-200/60 text-stone-700'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors Swatches */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B3B3B3]">Colores Disponibles</span>
              <div className="flex flex-wrap gap-2 pt-1">
                <button 
                  onClick={() => setSelectedColor(null)}
                  className={`h-8 px-2.5 rounded-lg border flex items-center justify-center text-[10px] font-black uppercase tracking-tighter transition-all ${!selectedColor ? 'border-black text-gray-900 bg-black' : 'border-stone-200 hover:border-black bg-stone-50 text-stone-700 hover:bg-white'}`}
                >
                  MIX
                </button>
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    title={c}
                    style={{ backgroundColor: COLOR_MAP[c] || '#cccccc' }}
                    className={`h-8 w-8 rounded-full border transition-all ${selectedColor === c ? 'border-black scale-110 ring-2 ring-black ring-offset-2' : 'border-transparent hover:scale-110'} ${c === 'Blanco' ? 'border-stone-200' : ''}`}
                  />
                ))}
              </div>
            </div>

            {/* Sizes List */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#B3B3B3]">Tallas Disponibles</span>
              <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto scrollbar-hide">
                {sizes.map((s) => (
                  <button
                    key={s.us}
                    onClick={() => setSelectedSize(selectedSize === s.us ? null : s.us)}
                    className={`min-w-[2.5rem] px-2 py-1 text-[11px] font-bold uppercase rounded-lg border transition-colors ${
                      selectedSize === s.us ? 'border-black bg-black text-white' : 'border-stone-200 bg-white text-stone-600 hover:border-black hover:text-black'
                    }`}
                  >
                    {s.us}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Collapsible Action Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-100">
            <button 
              onClick={clearAllFilters}
              className="px-4 py-2 text-xs font-bold uppercase text-stone-500 hover:text-black transition-colors"
            >
              Limpiar Todo
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors shadow-sm"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
