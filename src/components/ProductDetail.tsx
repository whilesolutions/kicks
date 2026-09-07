import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import { Product, SizeRef, CartItem } from '../types';
import { Accordion } from './Accordion';
import { ProductCard } from './ProductCard';
import { MOCK_PRODUCTS, SIZES, CLOTHING_SIZES } from '../data';

interface Props {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: Omit<CartItem, 'id'>) => void;
  onProductClick: (p: Product) => void;
  onNavClick?: (type: string) => void;
}

const SizeGuideTable = () => (
  <div className="mb-10 w-full flex flex-col bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
    <div className="p-6">
      <h4 className="text-xs font-black uppercase tracking-widest text-black mb-6">Equivalencias de Talla</h4>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
             <tr className="border-b-2 border-black">
               <th className="py-2 font-black uppercase">US</th>
               <th className="py-2 font-black uppercase text-gray-500">UK</th>
               <th className="py-2 font-black uppercase text-gray-500">EU</th>
               <th className="py-2 font-black uppercase text-gray-500">CM</th>
             </tr>
          </thead>
          <tbody className="text-gray-600 font-medium">
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">7</td><td>6</td><td>40</td><td>25</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">8</td><td>7</td><td>41</td><td>26</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">9</td><td>8</td><td>42.5</td><td>27</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">10</td><td>9</td><td>44</td><td>28</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">11</td><td>10</td><td>45</td><td>29</td></tr>
            <tr className="border-b border-gray-200"><td className="py-2 text-black font-bold">12</td><td>11</td><td>46</td><td>30</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <div className="w-full flex justify-center items-center p-6 border-t border-gray-200 bg-white shadow-sm flex-col">
       <img src="https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1200&fit=crop" alt="Cómo medirse" className="w-full max-h-64 object-cover rounded-xl grayscale opacity-80 border border-gray-100" />
       <span className="text-xs font-bold text-black mt-4 text-center uppercase tracking-widest w-full border-t border-gray-100 pt-3">Medir siempre desde el talón hasta la punta</span>
    </div>
  </div>
);

export function ProductDetail({ product, onBack, onAddToCart, onProductClick, onNavClick }: Props) {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [selectedSize, setSelectedSize] = useState<SizeRef | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 480) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const minSwipeDistance = 50;

  // Derivando imágenes y tallas disponibles según el color seleccionado
  const activeImages = (product.colorVariants && product.colorVariants[selectedColor]?.images) || product.images;
  const availableSizes = (product.colorVariants && product.colorVariants[selectedColor]?.sizes) || product.sizes;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setActiveImage((prev) => (prev < activeImages.length - 1 ? prev + 1 : 0));
    }
    if (isRightSwipe) {
      setActiveImage((prev) => (prev > 0 ? prev - 1 : activeImages.length - 1));
    }
  };

  // Pre-select defaults when product changes
  useEffect(() => {
    if (product) {
      const initialColor = product.colors[0] || "";
      setSelectedColor(initialColor);
      const initialSizes = (product.colorVariants && product.colorVariants[initialColor]?.sizes) || product.sizes;
      setSelectedSize(initialSizes[0] || null);
      setActiveImage(0);
      setShowSizeGuide(false);
    }
  }, [product]);

  // Adjust selected size and reset gallery when selectedColor changes independently
  useEffect(() => {
    if (product && selectedColor) {
      const currentColorSizes = (product.colorVariants && product.colorVariants[selectedColor]?.sizes) || product.sizes;
      const isStillAvailable = currentColorSizes.some(s => s.us === selectedSize?.us);
      if (!isStillAvailable) {
        setSelectedSize(currentColorSizes[0] || null);
      }
      setActiveImage(0);
    }
  }, [selectedColor]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Por favor, selecciona una talla.");
      return;
    }
    onAddToCart({
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1
    });
  };

  // Find related products (same brand or category, exclude current)
  const relatedProducts = MOCK_PRODUCTS.filter(p => p.id !== product.id && p.brand === product.brand).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
       {/* Top Navigation */}
       <div className="sticky top-0 z-20 flex items-center gap-4 bg-white/90 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8 border-b border-gray-100">
         <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-gray-500 transition-colors">
           <ArrowLeft className="h-4 w-4" /> VOLVER
         </button>
         <div className="hidden sm:flex ml-auto items-center text-[10px] font-bold tracking-widest uppercase text-gray-600">
           <button 
             onClick={() => onNavClick ? onNavClick('Inicio') : onBack()} 
             className="hover:text-black transition-colors uppercase tracking-widest font-bold cursor-pointer"
           >
             Tienda
           </button> 
           <ChevronRight className="mx-2 h-3 w-3 text-gray-400" />
           <button 
             onClick={() => {
               const b = product.brand === "Penguin" ? "Original Penguin" : product.brand;
               if (onNavClick) onNavClick(b);
               else onBack();
             }} 
             className="hover:text-black transition-colors uppercase tracking-widest font-bold cursor-pointer"
           >
             {product.brand}
           </button> 
           <ChevronRight className="mx-2 h-3 w-3 text-gray-400" />
           <span className="text-black font-extrabold">{product.name}</span>
         </div>
       </div>

       <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:flex lg:gap-16 lg:px-8 lg:py-12">
         
         {/* Image Gallery */}
         <div className="lg:w-1/2 flex flex-col-reverse lg:flex-row gap-4 lg:items-start">
            <div className="flex shrink-0 gap-4 overflow-x-auto lg:w-24 lg:flex-col pb-2 lg:p-1 scrollbar-hide">
              {activeImages.map((mediaUrl, i) => {
                const isVideo = mediaUrl && (mediaUrl.endsWith('.mp4') || mediaUrl.includes('video'));
                return (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-[4/5] w-24 flex-shrink-0 overflow-hidden bg-gray-50 rounded-xl transition-all ${activeImage === i ? 'border-2 border-black opacity-100' : 'opacity-60 hover:opacity-100 border-2 border-transparent'}`}
                  >
                    {isVideo ? (
                      <video src={mediaUrl} className="h-full w-full object-cover pointer-events-none" muted playsInline />
                    ) : (
                      <img src={mediaUrl} alt="" className="h-full w-full object-cover mix-blend-multiply" />
                    )}
                  </button>
                );
              })}
            </div>
            <div 
              className="relative aspect-[4/5] w-full flex-1 overflow-hidden bg-white rounded-2xl border border-gray-100 group"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
               {activeImages.length > 1 && (
                 <>
                   <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev > 0 ? prev - 1 : activeImages.length - 1); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full text-black opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95 shadow-md">
                     <ChevronLeft className="w-6 h-6 ml-[-2px]" />
                   </button>
                   <button onClick={(e) => { e.stopPropagation(); setActiveImage(prev => prev < activeImages.length - 1 ? prev + 1 : 0); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full text-black opacity-0 group-hover:opacity-100 transition-all z-20 hover:scale-110 active:scale-95 shadow-md">
                     <ChevronRight className="w-6 h-6 mr-[-2px]" />
                   </button>
                 </>
               )}
               {(() => {
                 const currentMedia = activeImages[activeImage] || activeImages[0];
                 const isMainVideo = currentMedia && (currentMedia.endsWith('.mp4') || currentMedia.includes('video'));
                 return isMainVideo ? (
                    <video src={currentMedia} className="h-full w-full object-cover transition-opacity duration-300" autoPlay loop muted playsInline />
                 ) : (
                    <img src={currentMedia} alt={product.name} className="h-full w-full object-cover mix-blend-multiply transition-opacity duration-300" />
                 );
               })()}
            </div>
         </div>

         {/* Product Info */}
         <div className="mt-10 lg:mt-0 lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <h1 className="text-4xl font-black uppercase tracking-tighter text-black sm:text-5xl">{product.name}</h1>
              <div className="flex items-center flex-wrap gap-4 mt-4">
                <p className="text-sm text-gray-500 font-bold tracking-[0.2em] uppercase">{product.brand}</p>
                <div className="w-1 h-4 bg-gray-200 hidden sm:block"></div>
                <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">SKU: {product.sku}</p>
                <div className="sm:ml-auto flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  <span className={`w-2 h-2 rounded-full ${product.inventory > 10 ? 'bg-green-500' : product.inventory > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-black">
                    {product.inventory > 0 ? `${product.inventory} en Stock` : 'Agotado'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-4 mt-6">
              <p className="text-3xl font-bold text-black border-b-2 border-black pb-1">${product.price.toFixed(2)}</p>
              {product.comparePrice && (
                <p className="text-lg text-gray-600 line-through pb-1">${product.comparePrice.toFixed(2)}</p>
              )}
              {product.isOnSale && <span className="bg-[#C21F3F] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm mb-2">Promo Activa</span>}
            </div>
            
            <p className="mt-8 text-sm text-gray-600 leading-relaxed font-sans max-w-xl">
              {product.description}
            </p>

            <hr className="my-8 border-gray-100" />

            {/* Colors */}
            <div className="mb-8">
               <h3 className="text-xs font-black tracking-widest uppercase text-black mb-4">Color Seleccionado: <span className="text-gray-500 border-b border-gray-300 ml-2">{selectedColor}</span></h3>
               <div className="flex flex-wrap gap-3">
                  {product.colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-6 py-3 border text-xs font-bold uppercase tracking-widest transition-all rounded-full ${
                        selectedColor === c ? 'border-black bg-black text-white shadow-xl' : 'border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
               </div>
            </div>

            {/* Sizes */}
            <div className="mb-10">
               <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xs font-black tracking-widest uppercase text-black">
                   Talla: <span className="text-gray-500 border-b border-gray-300 ml-2">
                     {selectedSize ? (product.category === 'Ropa' ? selectedSize.us : `US ${selectedSize.us}`) : 'Selecciona una...'}
                   </span>
                 </h3>
                 {product.category !== 'Ropa' && (
                   <button onClick={() => setShowSizeGuide(!showSizeGuide)} className="text-[10px] font-bold text-gray-600 tracking-widest uppercase border-b border-gray-400 hover:text-black hover:border-black transition-colors">
                     {showSizeGuide ? 'Ocultar Guía' : 'Ver Guía de Tallas'}
                   </button>
                 )}
               </div>
               
               {showSizeGuide && product.category !== 'Ropa' && <SizeGuideTable />}

               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {(product.category === 'Ropa' ? CLOTHING_SIZES : SIZES).map((s) => {
                   const isAvailable = availableSizes.some(ps => ps.us === s.us);
                   const isSelected = selectedSize?.us === s.us;
                   return (
                     <button
                       key={s.us}
                       disabled={!isAvailable}
                       onClick={() => isAvailable && setSelectedSize(s)}
                       className={`relative flex flex-col items-center justify-center border py-3 transition-all overflow-hidden ${
                         !isAvailable ? 'border-gray-100 bg-gray-50 text-gray-700 cursor-not-allowed' :
                         isSelected ? 'border-black bg-black text-white' : 'border-gray-200 bg-white hover:border-gray-400 text-black'
                       }`}
                     >
                       {!isAvailable && <span className="absolute inset-0 w-full h-full pointer-events-none before:absolute before:content-[''] before:top-1/2 before:left-[-10%] before:w-[120%] before:h-[1px] before:bg-gray-300 before:-rotate-12 border-0"></span>}
                       <span className="text-sm font-medium relative z-10 uppercase">{product.category === 'Ropa' ? s.us : `US ${s.us}`}</span>
                       {product.category !== 'Ropa' && (
                         <span className={`text-[10px] relative z-10 ${isSelected ? 'text-stone-300' : isAvailable ? 'text-gray-500' : 'text-gray-400'}`}>EU {s.eu}</span>
                       )}
                     </button>
                   );
                 })}
               </div>
            </div>

            <button
               onClick={handleAddToCart}
               disabled={product.inventory === 0}
               className={`w-full py-5 text-sm font-black uppercase tracking-widest text-white transition-all shadow-2xl rounded-2xl ${product.inventory > 0 ? 'bg-black hover:bg-gray-800 active:scale-[0.98]' : 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'}`}
            >
               {product.inventory > 0 ? 'Añadir a la Bolsa' : 'Agotado'}
            </button>
            <p className="mt-6 text-center text-[10px] font-bold tracking-widest uppercase text-gray-600">
              Checkout rápido, seguro y personalizado vía WhatsApp.
            </p>

            <div className="mt-12 flex flex-col border-t border-gray-200">
              <Accordion title="Materiales y Confección" content={product.material} />
              <Accordion title="Instrucciones de Cuidado" content={product.careInstructions} />
              <Accordion title="Envíos y Políticas" content="Envío a coordinar vía WhatsApp. Entregas locales el mismo día y envíos nacionales entre 2-4 días hábiles vía MRW/Zoom/Tealca." />
            </div>
         </div>

       </div>

        {/* Floating Quick Add Action Pill instead of full-screen bar */}
        <div className={`fixed bottom-6 right-4 sm:right-8 z-40 transition-all duration-500 ease-out ${showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}>
          <div className="bg-white/95 backdrop-blur-md border border-stone-200/80 rounded-full py-1.5 pl-2.5 pr-2.5 sm:pr-4 shadow-[0_12px_35px_rgba(0,0,0,0.15)] flex items-center gap-3">
            {/* thumbnail */}
            <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200/60 overflow-hidden shrink-0 flex items-center justify-center">
              <img 
                src={activeImages[0] || product.images[0]} 
                alt={product.name} 
                className="h-full w-full object-cover mix-blend-multiply" 
              />
            </div>
            {/* product brief */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] font-black uppercase text-stone-900 tracking-tight leading-none truncate max-w-[120px]">{product.name}</span>
              <span className="text-[9px] font-bold text-stone-500 leading-none mt-1">
                {selectedSize ? `Talla: ${selectedSize.us}` : 'Selec. Talla'}
              </span>
            </div>
            {/* action CTA */}
            <button
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${product.inventory > 0 ? 'bg-black text-white hover:bg-stone-800' : 'bg-stone-300 text-stone-400 cursor-not-allowed'}`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${product.inventory > 0 ? 'text-white' : 'text-stone-400'}`} />
              <span>+ Bolsa</span>
              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono ${product.inventory > 0 ? 'bg-white/20 text-white' : 'bg-stone-400/20 text-stone-500'}`}>${product.price.toFixed(0)}</span>
            </button>
          </div>
        </div>

       {/* Related Products Section */}
       {relatedProducts.length > 0 && (
         <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 border-t border-gray-100">
           <div className="flex justify-between items-end mb-8">
             <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Completa tu Look</h2>
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 hidden md:block">Más de {product.brand}</span>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
             {relatedProducts.map(p => (
               <ProductCard key={p.id} product={p} onClick={onProductClick} />
             ))}
           </div>
         </div>
       )}

    </div>
  );
}
