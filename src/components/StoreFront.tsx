import React, { useState, useMemo } from 'react';
import { ProductType } from '../types';
import { Search, ShoppingBag, ArrowLeft, Phone } from 'lucide-react';

interface StoreFrontProps {
  products: ProductType[];
  onBackToErp: () => void;
}

export default function StoreFront({ products, onBackToErp }: StoreFrontProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});

  // Colors:
  // Principal: White (bg-white)
  // Dark Green: #0b3b24
  // Lime Green: #aef527

  // Extraer las categorías únicas
  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.categoria)))];

  // Agrupar los productos por "nombre_producto" y "color" para crear la "vista Shopify"
  const groupedProducts = useMemo(() => {
    const groups: Record<string, {
      baseProduct: ProductType;
      tallasDisponibles: { talla: string | number; stock: number; sku: string }[];
      totalStock: number;
    }> = {};

    products.forEach(p => {
      // Clave única por nombre y color
      const key = `${p.nombre_producto}_${p.color}`.toLowerCase();
      
      if (!groups[key]) {
        groups[key] = {
          baseProduct: p,
          tallasDisponibles: [],
          totalStock: 0
        };
      }
      
      // Añadir la talla si tiene cantidad > 0 (o la guardamos igual para saber qué manejan)
      groups[key].tallasDisponibles.push({
        talla: p.talla,
        stock: p.stock_disponible,
        sku: p.sku
      });
      groups[key].totalStock += p.stock_disponible;
    });

    // Convertir de objeto a array y ordenar las tallas dentro de cada grupo
    return Object.values(groups).map(g => {
      g.tallasDisponibles.sort((a, b) => {
        const tA = String(a.talla);
        const tB = String(b.talla);
        return tA.localeCompare(tB, undefined, { numeric: true });
      });
      return g;
    });
  }, [products]);

  // Filtrar los grupos
  const filteredGroups = groupedProducts.filter(g => {
    const p = g.baseProduct;
    const matchesCat = selectedCategory === 'Todos' || p.categoria === selectedCategory;
    const matchesSearch = p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.marca && p.marca.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          p.color.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleWhatsAppOrder = (product: ProductType, tallas: string) => {
    const hasPromo = product.precio_promocion && product.precio_promocion > 0;
    const activePrice = hasPromo ? product.precio_promocion! : product.precio_venta_referencia;
    const isPromoText = hasPromo ? `\n*(¡Precio Especial de Promoción!)*` : '';

    const text = `¡Hola! Me interesa este producto de la tienda:\n\n*${product.nombre_producto}*\n*Marca:* ${product.marca || 'N/A'}\n*Color:* ${product.color}\n*Tallas disponibles:* ${tallas}\n*Precio Unitario:* $${activePrice.toFixed(2)}${isPromoText}\n\n¿Por favor me confirman disponibilidad de mi talla y envío?`;
    const whatsappUrl = `https://wa.me/584120000000?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 font-sans">
      {/* Top Banner (Dark Green) */}
      <div className="bg-[#FCD901] text-[#0A0A0A] text-[10px] text-center py-2 uppercase tracking-widest font-bold">
        <span className="text-[#FCD901] px-2">•</span> Envíos a todo el país <span className="text-[#FCD901] px-2">•</span> Pedidos Seguros vía WhatsApp
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBackToErp}
                className="text-gray-500 hover:text-[#FCD901] transition-colors p-2"
                title="Volver al ERP"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="flex-shrink-0 flex items-center">
                {/* Brand Logo - KICKS */}
                <svg viewBox="0 0 357.23 71.89" fill="currentColor" className="h-8 w-auto text-[#FCD901]">
                  <g id="Capa_1-2">
                    <path d="m269.55,71.27c1.31-1.73,2.38-3.19,3.5-4.6,2.69-3.39,5.44-6.73,8.09-10.16.66-.85,1.31-1.16,2.36-1.15,10.22.03,20.44.05,30.66,0,2.55-.01,5.11-.19,7.65-.41,2.66-.23,3.81-1.28,4.45-3.92.45-1.83.83-3.68,1.21-5.53.28-1.35-.34-2.2-1.66-2.37-1.87-.24-3.75-.45-5.63-.49-9.11-.2-18.21-.32-27.32-.49-3.43-.07-6.77-.38-9.35-3.1-2.13-2.23-3.41-5-2.8-7.89,1.55-7.26,3.12-14.57,5.54-21.56,1.95-5.64,6.93-8.39,12.83-8.85,4.58-.36,9.2-.31,13.8-.36,12.66-.13,25.32-.24,37.99-.31,1.98-.01,3.96.18,6.34.3-.39.95-.5,1.68-.92,2.14-4.1,4.53-8.23,9.02-12.42,13.46-.41.43-1.28.59-1.94.59-8.78.04-17.55,0-26.33.04-3.33.02-6.66.19-9.99.28-1.99.05-3.4.95-4.04,2.86-.55,1.63-1.13,3.26-1.45,4.94-.43,2.22.12,2.88,2.33,3.01,3.93.22,7.87.43,11.81.51,7.05.14,14.11.18,21.16.25,3.69.03,6.78,1.5,9.46,3.93,2.03,1.85,2.54,4.35,2.25,6.87-.41,3.57-.99,7.15-1.87,10.63-1.02,4.08-2.31,8.11-3.72,12.07-1.71,4.81-5.69,7.35-10.08,9.34-.48.21-1.09.16-1.64.17-18.33.09-36.66.19-54.99.24-1.64,0-3.28-.26-5.29-.43Z"/>
                    <path d="m138.44,17.25c1.46.99,2.91,2,4.37,2.98,1.25.83,1.67,1.82,1.26,3.39-2.37,9.13-4.66,18.28-6.95,27.43-.73,2.92-.01,3.9,3.06,3.95,9.38.17,18.76.26,28.14.39,3.83.05,7.66.12,11.49.23.87.02,1.72.24,2.82.4-.75,3.14-1.43,6.09-2.16,9.04-.46,1.89-.9,3.78-1.52,5.62-.17.49-.94,1.12-1.44,1.12-14.33,0-28.65-.07-42.98-.16-2.22-.01-4.44-.17-6.65-.29-4.36-.23-7.71-2.33-10.1-5.88-1.87-2.78-1.3-5.92-.59-8.89,2.78-11.66,5.62-23.3,8.57-34.91,1.04-4.07,2.02-8.25,3.79-12.03,2.65-5.63,7.46-8.79,13.78-8.9C161.33.4,179.31.23,197.29,0c.27,0,.55.03,1.1.06-1,1.74-1.96,3.32-2.83,4.95-1.83,3.42-3.57,6.89-5.44,10.3-.28.5-.99.91-1.58,1.06-.79.21-1.65.16-2.48.16-15.33.09-30.65.17-45.98.25-.54,0-1.07.05-1.61.08l-.03.37Z"/>
                    <path d="m264.72,71.56c-1.98.1-3.67.26-5.36.27-4.89.04-9.78-.03-14.66.05-1.13.02-1.66-.42-2.17-1.35-4.62-8.54-9.33-17.03-13.89-25.6-.81-1.53-1.79-2.22-3.45-2.21-1.16,0-2.32-.13-3.49-.18-.91-.03-1.38-.43-1.14-1.36.99-3.87,1.96-7.74,3.04-11.59.17-.62.77-1.35,1.35-1.58,4.45-1.77,7.8-5.05,11.3-8.11,7.22-6.33,14.36-12.75,21.55-19.11.42-.37,1.03-.74,1.56-.75,7.21-.05,14.42-.03,21.97-.03-.46.57-.68.92-.97,1.18-9.29,8.59-18.6,17.16-27.88,25.76-2.2,2.04-4.31,4.16-6.47,6.24-1.25,1.2-1.61,2.33-.61,4.06,5.55,9.6,10.98,19.28,16.43,28.94.94,1.67,1.82,3.38,2.89,5.37Z"/>
                    <path d="m91.48.08c-10.34,9.52-20.5,18.88-30.66,28.24-1.96,1.81-3.85,3.68-5.85,5.44-.98.86-.85,1.61-.29,2.6,4.52,7.96,9.02,15.92,13.5,23.9,2.03,3.62,4.01,7.27,6.21,11.26-1.74.11-3.2.28-4.66.29-5,.04-10,.05-14.99-.03-.61,0-1.48-.51-1.78-1.04-3.39-5.92-6.7-11.88-10.02-17.84-1.7-3.06-3.31-6.16-5.06-9.18-.31-.53-1.11-.98-1.74-1.07-1.26-.17-2.55-.04-3.82-.06-1.25-.02-1.94-.7-1.65-1.92.93-3.82,1.91-7.63,2.99-11.41.34-1.19,1.33-1.75,2.63-1.97.98-.17,2.05-.62,2.8-1.27,6.03-5.15,12.01-10.37,17.98-15.6,3.63-3.19,7.18-6.46,10.81-9.65.45-.4,1.14-.75,1.72-.76,7.05-.05,14.1-.03,21.16-.03.2,0,.4.04.72.08Z"/>
                    <path d="m4.54.51c.6-.08.81-.13,1.01-.14,9.55-.11,19.11-.19,28.66-.33,1.47-.02,1.81.35,1.44,1.82-3.33,13.18-6.59,26.39-9.87,39.58-2.36,9.47-4.75,18.94-7.06,28.42-.32,1.3-.83,1.83-2.21,1.81-4.88-.08-9.76,0-14.64-.07-2.04-.03-2.11-.37-1.61-2.35,2.1-8.34,4.11-16.71,6.2-25.05,2.59-10.39,5.21-20.77,7.88-31.14.31-1.19.06-1.94-.75-2.79C10.61,7.13,7.7,3.93,4.54.51Z"/>
                    <path d="m226.35.51c-2.03,8.03-3.98,15.71-5.91,23.4-3.83,15.34-7.63,30.69-11.52,46.02-.16.63-.95,1.51-1.52,1.56-5.85.57-11.71.49-17.77,0,.14-.72.21-1.25.34-1.76,5.72-22.64,11.45-45.28,17.13-67.94.33-1.32,1-1.73,2.18-1.73,4.89,0,9.77-.02,14.66.01.74,0,1.48.26,2.41.43Z"/>
                    <path d="m82.56,71.6C88.6,47.54,94.55,23.82,100.5.12c5.57,0,10.95-.08,16.32.04,2.16.05,2.26.4,1.7,2.63-5.44,21.69-10.88,43.38-16.33,65.06-.91,3.61-.91,3.64-4.63,3.71-4.39.09-8.77.11-13.16.15-.53,0-1.07-.07-1.84-.13Z"/>
                  </g>
                </svg>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-[#FDFDFD] placeholder-gray-650 focus:outline-none focus:ring-1 focus:ring-[#aef527] focus:border-[#FCD901]/20 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Buscar productos por nombre, marca o color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-[#FCD901] relative">
                <ShoppingBag className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Category Navigation (Mobile Scrollable) */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap pb-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'border-[#FCD901]/20 text-[#FCD901] font-bold'
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-[#FCD901] mb-6 font-sans tracking-tight flex items-center gap-3">
          {selectedCategory === 'Todos' ? 'Catálogo General' : `Categoría: ${selectedCategory}`}
          <span className="text-sm font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{filteredGroups.length} modelos</span>
        </h2>

        {filteredGroups.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No se encontraron modelos con estos criterios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredGroups.map((group) => {
              const { baseProduct, tallasDisponibles, totalStock } = group;
              const hasStock = totalStock > 0;
              const stockListStr = tallasDisponibles.filter(t => t.stock > 0).map(t => t.talla).join(", ");
              const groupKey = `${baseProduct.nombre_producto}_${baseProduct.color}`.toLowerCase();

              // Parse image URLs list if they are separated by commas or whitespace
              const imageUrls = baseProduct.url_imagen 
                ? baseProduct.url_imagen.split(/[\s,;]+/).map(u => u.trim()).filter(Boolean) 
                : [];
              
              const activeImgIdx = activeImageIndexes[groupKey] || 0;
              const displayedImage = imageUrls[activeImgIdx] || baseProduct.url_imagen;

              const hasPromo = baseProduct.precio_promocion && baseProduct.precio_promocion > 0;
              
              return (
                <div key={`${baseProduct.sku}-group`} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                  {/* Image Area */}
                  <div className="aspect-square bg-gray-50 relative overflow-hidden flex-shrink-0">
                    {displayedImage ? (
                      <img 
                        src={displayedImage} 
                        alt={baseProduct.nombre_producto}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.currentTarget as HTMLImageElement).style.opacity = '0.3';
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <ShoppingBag className="w-12 h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* Image navigation bullets if multiple are present */}
                    {imageUrls.length > 1 && (
                      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1 z-10">
                        {imageUrls.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndexes(prev => ({ ...prev, [groupKey]: idx }));
                            }}
                            className={`w-1.5 h-1.5 rounded-full transition-all border border-black/10 ${
                              idx === activeImgIdx ? 'bg-[#FCD901] px-1' : 'bg-white/80'
                            }`}
                            title={`Ver foto ${idx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                      {!hasStock && (
                        <span className="bg-[#EE4B2B] text-white text-[9px] font-black uppercase py-0.5 px-2 rounded tracking-widest shadow-sm">
                          Agotado
                        </span>
                      )}
                      {hasStock && totalStock <= 5 && (
                        <span className="bg-[#FCD901] text-[#0A0A0A] text-[9px] font-bold uppercase py-0.5 px-2 rounded tracking-widest shadow-sm">
                          Pocas unidades
                        </span>
                      )}
                      {baseProduct.marca && (
                        <span className="bg-black/95 backdrop-blur-sm border border-stone-800 text-white text-[9px] uppercase py-0.5 px-2.5 rounded font-black tracking-wider shadow-sm inline-block w-fit">
                          {baseProduct.marca}
                        </span>
                      )}
                      {baseProduct.coleccion && (
                        <span className="bg-[#FCD901] text-black text-[9px] uppercase py-0.5 px-2.5 rounded font-black tracking-wider shadow-sm inline-block w-fit">
                          Año {baseProduct.coleccion}
                        </span>
                      )}
                      {hasPromo && (
                        <span className="bg-rose-500 text-white text-[9px] uppercase py-0.5 px-2 rounded font-black tracking-wider shadow-sm inline-block w-fit animate-pulse">
                          PROMO
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Info Area */}
                  <div className="p-4 flex flex-col flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-[#FCD901] transition-colors line-clamp-2">
                        {baseProduct.nombre_producto}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{baseProduct.color}</p>
                      
                      {baseProduct.descripcion && (
                        <p className="text-[11px] text-gray-400 mt-2 line-clamp-3 leading-relaxed block italic" title={baseProduct.descripcion}>
                          {baseProduct.descripcion}
                        </p>
                      )}

                      {baseProduct.url_carpeta_drive && (
                        <a 
                          href={baseProduct.url_carpeta_drive}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-zinc-500 hover:text-black mt-2 font-mono transition-colors"
                          title="Abrir carpeta en Google Drive"
                        >
                          <span>📁</span> Drive Fotos
                        </a>
                      )}
                    </div>

                    {/* Sizes Row */}
                    <div className="mt-3 mb-4">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-bold">Tallas Disponibles:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {tallasDisponibles.map(t => (
                          <span 
                            key={t.sku} 
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono border ${
                              t.stock > 0 
                                ? 'bg-white border-gray-300 text-gray-700' 
                                : 'bg-[#FDFDFD] border-gray-100 text-gray-500 line-through'
                            }`}
                            title={t.stock > 0 ? `Stock: ${t.stock}` : 'Agotado'}
                          >
                            {t.talla}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-auto">
                      <div className="flex items-baseline gap-2 mb-3">
                        {hasPromo ? (
                          <>
                            <span className="text-xl font-black text-rose-600 font-mono tracking-tight animate-pulse" title="¡En Promoción!">
                              ${baseProduct.precio_promocion!.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500 line-through font-medium">
                              ${baseProduct.precio_venta_referencia.toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-black text-[#FCD901] font-mono tracking-tight">
                            ${baseProduct.precio_venta_referencia.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button 
                        onClick={() => handleWhatsAppOrder(baseProduct, stockListStr || 'Ninguna')}
                        disabled={!hasStock}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all ${
                          hasStock 
                            ? 'bg-[#FCD901] text-[#0A0A0A] hover:bg-black hover:text-[#FCD901] hover:shadow-md cursor-pointer duration-200' 
                            : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {hasStock ? 'Pedir por WhatsApp' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#FCD901] text-gray-700 py-12 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h1 className="font-sans text-2xl font-black italic tracking-tighter text-gray-900 mb-4">
              K<span className="text-[#FCD901] px-0.5">I</span>CKS
            </h1>
            <p className="text-sm text-gray-500">
              Tu tienda virtual oficial de calzado y textil. Catálogo en tiempo real sincronizado con nuestro ERP.
            </p>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold uppercase tracking-wider mb-4 text-sm">Links Útiles</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button className="hover:text-[#FCD901] transition-colors">Políticas de Envío</button></li>
              <li><button className="hover:text-[#FCD901] transition-colors">Guía de Tallas</button></li>
              <li><button className="hover:text-[#FCD901] transition-colors">Devoluciones</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-900 font-bold uppercase tracking-wider mb-4 text-sm">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="w-4 h-4 text-[#FCD901]" />
                <span className="text-gray-900 font-mono">+58 412-000-0000</span>
              </li>
              <li>
                <button className="bg-[#FCD901] text-[#0A0A0A] px-4 py-2 font-bold uppercase tracking-widest text-xs rounded hover:bg-[#C5A059] transition-colors w-full sm:w-auto shadow-sm">
                  Atención vía WhatsApp
                </button>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

