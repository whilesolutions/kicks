import { useState, useMemo } from 'react';
import { Search, ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../data';

interface Props {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  onNavClick: (type: string) => void;
}

export function Header({ cartCount, onOpenCart, searchQuery, setSearchQuery, onNavClick }: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [marcasOpen, setMarcasOpen] = useState(false);
  const [ropaOpen, setRopaOpen] = useState(false);
  const [calzadoOpen, setCalzadoOpen] = useState(false);

  // Quick inline search derived from MOCK_PRODUCTS
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const searchLower = searchQuery.toLowerCase();
    return MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchLower) || 
      p.brand.toLowerCase().includes(searchLower) ||
      p.colors.some(c => c.toLowerCase().includes(searchLower))
    ).slice(0, 4);
  }, [searchQuery]);

  const handleNav = (type: string) => {
    onNavClick(type);
    setMobileMenuOpen(false);
    setSearchQuery('');
  };

  const handleProductSelect = (product: Product) => {
    onNavClick(`product:${product.id}`);
    setMobileMenuOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden text-black hover:text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <button onClick={() => handleNav('Inicio')} className="flex-shrink-0 cursor-pointer text-black hover:opacity-85 transition-opacity flex items-center">
            <svg viewBox="0 0 357.23 71.89" fill="currentColor" className="h-6 md:h-7 w-auto">
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
          </button>
        </div>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-500">
          <button onClick={() => handleNav('Inicio')} className="text-black hover:text-gray-600 transition-colors uppercase">INICIO</button>
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-black transition-colors uppercase font-bold"
              onClick={() => handleNav('Calzado')}
            >
              CALZADO <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 uppercase text-xs tracking-wider">
               <button onClick={() => handleNav('Calzado')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors font-bold text-stone-800 border-b border-stone-100 mb-1 uppercase">VER TODO EL CALZADO</button>
               <button onClick={() => handleNav('calzado:Caballero')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-gray-900/10 hover:text-black transition-colors uppercase font-bold text-stone-700">CABALLERO</button>
               <button onClick={() => handleNav('calzado:Dama')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-gray-900/10 hover:text-black transition-colors uppercase font-bold text-stone-700">DAMA</button>
            </div>
          </div>
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-black transition-colors uppercase font-bold"
              onClick={(e) => e.preventDefault()}
            >
              MARCAS <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 uppercase text-xs tracking-wider">
               <button onClick={() => handleNav('Avia')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">AVIA</button>
               <button onClick={() => handleNav('Original Penguin')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">PENGUIN</button>
               <button onClick={() => handleNav('Hey Dude')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">HEY DUDE</button>
               <button onClick={() => handleNav('Carven')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors font-extrabold text-[#FCD901] bg-black/95 border-t border-stone-100 uppercase">CARVEN</button>
            </div>
          </div>
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-black transition-colors uppercase font-bold"
              onClick={() => handleNav('Ropa')}
            >
              ROPA <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col py-2 uppercase text-xs tracking-wider">
                 <button onClick={() => handleNav('Ropa')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors font-bold text-stone-800 border-b border-stone-100 mb-1 uppercase">VER TODA LA ROPA</button>
                 <button onClick={() => handleNav('ropa:Chaquetas')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">CHAQUETAS</button>
                 <button onClick={() => handleNav('ropa:Chemises')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">CHEMISES</button>
                 <button onClick={() => handleNav('ropa:Franelas')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">FRANELAS</button>
                 <button onClick={() => handleNav('ropa:Camisas')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">CAMISAS</button>
                 <button onClick={() => handleNav('ropa:Shorts')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">SHORTS</button>
                 <button onClick={() => handleNav('ropa:Pantalones')} className="text-left px-4 py-2 hover:bg-gray-50 hover:text-black transition-colors uppercase text-stone-700 font-bold">PANTALONES</button>
            </div>
          </div>
          <button onClick={() => handleNav('Promos')} className="hover:text-black transition-colors uppercase font-bold">PROMOS</button>
        </nav>

        {/* SEARCH BAR (Desktop) */}
        <div className="hidden flex-1 px-12 lg:block max-w-md relative">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Buscar marcas, colores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.currentTarget.blur();
                }
              }}
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-black transition-colors focus:border-black focus:bg-white focus:outline-none focus:ring-0"
            />
          </div>
          {/* Live Search Preview Desktop */}
          {searchQuery && searchResults.length > 0 && (
             <div className="absolute top-full left-12 right-12 mt-2 bg-white border border-gray-100 shadow-2xl rounded-xl overflow-hidden py-2 z-50">
               {searchResults.map(p => (
                 <button 
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                 >
                   <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md bg-gray-100 mix-blend-multiply border border-gray-100" />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-black uppercase">{p.name}</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest">{p.brand}</span>
                   </div>
                 </button>
               ))}
             </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-6">
          <button 
            className="lg:hidden text-black"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
             <Search className="h-5 w-5" />
          </button>
          
          <button 
            onClick={onOpenCart}
            className="group relative flex items-center text-black"
          >
            <ShoppingBag className="h-5 w-5 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div className="relative mb-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-gray-600" />
            </div>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setMobileMenuOpen(false);
                }
              }}
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-black focus:border-black focus:outline-none"
            />
          </div>
          {/* Live Search Preview Mobile */}
          {searchQuery && searchResults.length > 0 && (
             <div className="bg-gray-50 border border-gray-100 rounded-xl overflow-hidden mb-2">
               {searchResults.map(p => (
                 <button 
                    key={p.id}
                    onClick={() => handleProductSelect(p)}
                    className="w-full flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-100 text-left"
                 >
                   <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-md bg-white mix-blend-multiply border border-gray-100" />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-black uppercase">{p.name}</span>
                     <span className="text-[10px] text-gray-500 uppercase tracking-widest">{p.brand}</span>
                   </div>
                 </button>
               ))}
             </div>
          )}

          <button onClick={() => handleNav('Inicio')} className="text-left font-medium text-black uppercase tracking-widest text-sm py-2 border-b border-gray-50">INICIO</button>
          <div className="flex flex-col py-2 border-b border-gray-50">
            <div className="flex justify-between items-center w-full">
              <button onClick={() => setCalzadoOpen(!calzadoOpen)} className="text-left font-medium text-black uppercase tracking-widest text-sm w-full">CALZADO</button>
              <button className="p-2" onClick={() => setCalzadoOpen(!calzadoOpen)}>
                 <ChevronDown className={`h-4 w-4 transition-transform ${calzadoOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {calzadoOpen && (
              <div className="flex flex-col gap-3 pl-4 mt-3">
                <button onClick={() => handleNav('Calzado')} className="text-left text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest border-b border-gray-100 pb-1">VER TODO EL CALZADO</button>
                <button onClick={() => handleNav('calzado:Caballero')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">CABALLERO</button>
                <button onClick={() => handleNav('calzado:Dama')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">DAMA</button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col py-2 border-b border-gray-50">
            <div className="flex justify-between items-center w-full">
              <button onClick={() => setMarcasOpen(!marcasOpen)} className="text-left font-medium text-black uppercase tracking-widest text-sm w-full">MARCAS</button>
              <button className="p-2" onClick={() => setMarcasOpen(!marcasOpen)}>
                 <ChevronDown className={`h-4 w-4 transition-transform ${marcasOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {marcasOpen && (
              <div className="flex flex-col gap-3 pl-4 mt-3">
                <button onClick={() => handleNav('Avia')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">AVIA</button>
                <button onClick={() => handleNav('Original Penguin')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">PENGUIN</button>
                <button onClick={() => handleNav('Hey Dude')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">HEY DUDE</button>
                <button onClick={() => handleNav('Carven')} className="text-left text-xs font-bold text-[#FCD901] uppercase tracking-widest bg-black px-2.5 py-1 rounded-md max-w-max">CARVEN</button>
              </div>
            )}
          </div>

          <div className="flex flex-col py-2 border-b border-gray-50">
            <div className="flex justify-between items-center w-full">
              <button onClick={() => setRopaOpen(!ropaOpen)} className="text-left font-medium text-black uppercase tracking-widest text-sm w-full">ROPA</button>
              <button className="p-2" onClick={() => setRopaOpen(!ropaOpen)}>
                 <ChevronDown className={`h-4 w-4 transition-transform ${ropaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {ropaOpen && (
              <div className="flex flex-col gap-3 pl-4 mt-3">
                <button onClick={() => handleNav('Ropa')} className="text-left text-xs font-bold text-gray-600 hover:text-black uppercase tracking-widest border-b border-gray-100 pb-1">VER TODA LA ROPA</button>
                <button onClick={() => handleNav('ropa:Chaquetas')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">CHAQUETAS</button>
                <button onClick={() => handleNav('ropa:Chemises')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">CHEMISES</button>
                <button onClick={() => handleNav('ropa:Franelas')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">FRANELAS</button>
                <button onClick={() => handleNav('ropa:Camisas')} className="text-left text-xs font-bold text-gray-600 uppercase tracking-widest">CAMISAS</button>
                <button onClick={() => handleNav('ropa:Shorts')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">SHORTS</button>
                <button onClick={() => handleNav('ropa:Pantalones')} className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">PANTALONES</button>
              </div>
            )}
          </div>
          
          <button onClick={() => handleNav('Promos')} className="text-left font-medium text-black uppercase tracking-widest text-sm py-2 text-gray-500">PROMOS</button>
        </div>
      )}
    </header>
  );
}
