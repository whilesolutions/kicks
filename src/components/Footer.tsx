import React from 'react';
import { Instagram, Facebook, Phone, MapPin, MessageCircle } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const scrollToFAQ = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('faq-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-white pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-auto border-t border-stone-900">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="mb-4 text-white">
            <svg id="Capa_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 357.23 71.89" className="h-7 w-auto text-white">
              <g id="Capa_1-2">
                <path fill="currentColor" d="m269.55,71.27c1.31-1.73,2.38-3.19,3.5-4.6,2.69-3.39,5.44-6.73,8.09-10.16.66-.85,1.31-1.16,2.36-1.15,10.22.03,20.44.05,30.66,0,2.55-.01,5.11-.19,7.65-.41,2.66-.23,3.81-1.28,4.45-3.92.45-1.83.83-3.68,1.21-5.53.28-1.35-.34-2.2-1.66-2.37-1.87-.24-3.75-.45-5.63-.49-9.11-.2-18.21-.32-27.32-.49-3.43-.07-6.77-.38-9.35-3.1-2.13-2.23-3.41-5-2.8-7.89,1.55-7.26,3.12-14.57,5.54-21.56,1.95-5.64,6.93-8.39,12.83-8.85,4.58-.36,9.2-.31,13.8-.36,12.66-.13,25.32-.24,37.99-.31,1.98-.01,3.96.18,6.34.3-.39.95-.5,1.68-.92,2.14-4.1,4.53-8.23,9.02-12.42,13.46-.41.43-1.28.59-1.94.59-8.78.04-17.55,0-26.33.04-3.33.02-6.66.19-9.99.28-1.99.05-3.4.95-4.04,2.86-.55,1.63-1.13,3.26-1.45,4.94-.43,2.22.12,2.88,2.33,3.01,3.93.22,7.87.43,11.81.51,7.05.14,14.11.18,21.16.25,3.69.03,6.78,1.5,9.46,3.93,2.03,1.85,2.54,4.35,2.25,6.87-.41,3.57-.99,7.15-1.87,10.63-1.02,4.08-2.31,8.11-3.72,12.07-1.71,4.81-5.69,7.35-10.08,9.34-.48.21-1.09.16-1.64.17-18.33.09-36.66.19-54.99.24-1.64,0-3.28-.26-5.29-.43Z"/>
                <path fill="currentColor" d="m138.44,17.25c1.46.99,2.91,2,4.37,2.98,1.25.83,1.67,1.82,1.26,3.39-2.37,9.13-4.66,18.28-6.95,27.43-.73,2.92-.01,3.9,3.06,3.95,9.38.17,18.76.26,28.14.39,3.83.05,7.66.12,11.49.23.87.02,1.72.24,2.82.4-.75,3.14-1.43,6.09-2.16,9.04-.46,1.89-.9,3.78-1.52,5.62-.17.49-.94,1.12-1.44,1.12-14.33,0-28.65-.07-42.98-.16-2.22-.01-4.44-.17-6.65-.29-4.36-.23-7.71-2.33-10.1-5.88-1.87-2.78-1.3-5.92-.59-8.89,2.78-11.66,5.62-23.3,8.57-34.91,1.04-4.07,2.02-8.25,3.79-12.03,2.65-5.63,7.46-8.79,13.78-8.9C161.33.4,179.31.23,197.29,0c.27,0,.55.03,1.1.06-1,1.74-1.96,3.32-2.83,4.95-1.83,3.42-3.57,6.89-5.44,10.3-.28.5-.99.91-1.58,1.06-.79.21-1.65.16-2.48.16-15.33.09-30.65.17-45.98.25-.54,0-1.07.05-1.61.08l-.03.37Z"/>
                <path fill="currentColor" d="m264.72,71.56c-1.98.1-3.67.26-5.36.27-4.89.04-9.78-.03-14.66.05-1.13.02-1.66-.42-2.17-1.35-4.62-8.54-9.33-17.03-13.89-25.6-.81-1.53-1.79-2.22-3.45-2.21-1.16,0-2.32-.13-3.49-.18-.91-.03-1.38-.43-1.14-1.36.99-3.87,1.96-7.74,3.04-11.59.17-.62.77-1.35,1.35-1.58,4.45-1.77,7.8-5.05,11.3-8.11,7.22-6.33,14.36-12.75,21.55-19.11.42-.37,1.03-.74,1.56-.75,7.21-.05,14.42-.03,21.97-.03-.46.57-.68.92-.97,1.18-9.29,8.59-18.6,17.16-27.88,25.76-2.2,2.04-4.31,4.16-6.47,6.24-1.25,1.2-1.61,2.33-.61,4.06,5.55,9.6,10.98,19.28,16.43,28.94.94,1.67,1.82,3.38,2.89,5.37Z"/>
                <path fill="currentColor" d="m91.48.08c-10.34,9.52-20.5,18.88-30.66,28.24-1.96,1.81-3.85,3.68-5.85,5.44-.98.86-.85,1.61-.29,2.6,4.52,7.96,9.02,15.92,13.5,23.9,2.03,3.62,4.01,7.27,6.21,11.26-1.74.11-3.2.28-4.66.29-5,.04-10,.05-14.99-.03-.61,0-1.48-.51-1.78-1.04-3.39-5.92-6.7-11.88-10.02-17.84-1.7-3.06-3.31-6.16-5.06-9.18-.31-.53-1.11-.98-1.74-1.07-1.26-.17-2.55-.04-3.82-.06-1.25-.02-1.94-.7-1.65-1.92.93-3.82,1.91-7.63,2.99-11.41.34-1.19,1.33-1.75,2.63-1.97.98-.17,2.05-.62,2.8-1.27,6.03-5.15,12.01-10.37,17.98-15.6,3.63-3.19,7.18-6.46,10.81-9.65.45-.4,1.14-.75,1.72-.76,7.05-.05,14.1-.03,21.16-.03.2,0,.4.04.72.08Z"/>
                <path fill="currentColor" d="m4.54.51c.6-.08.81-.13,1.01-.14,9.55-.11,19.11-.19,28.66-.33,1.47-.02,1.81.35,1.44,1.82-3.33,13.18-6.59,26.39-9.87,39.58-2.36,9.47-4.75,18.94-7.06,28.42-.32,1.3-.83,1.83-2.21,1.81-4.88-.08-9.76,0-14.64-.07-2.04-.03-2.11-.37-1.61-2.35,2.1-8.34,4.11-16.71,6.2-25.05,2.59-10.39,5.21-20.77,7.88-31.14.31-1.19.06-1.94-.75-2.79C10.61,7.13,7.7,3.93,4.54.51Z"/>
                <path fill="currentColor" d="m226.35.51c-2.03,8.03-3.98,15.71-5.91,23.4-3.83,15.34-7.63,30.69-11.52,46.02-.16.63-.95,1.51-1.52,1.56-5.85.57-11.71.49-17.77,0,.14-.72.21-1.25.34-1.76,5.72-22.64,11.45-45.28,17.13-67.94.33-1.32,1-1.73,2.18-1.73,4.89,0,9.77-.02,14.66.01.74,0,1.48.26,2.41.43Z"/>
                <path fill="currentColor" d="m82.56,71.6C88.6,47.54,94.55,23.82,100.5.12c5.57,0,10.95-.08,16.32.04,2.16.05,2.26.4,1.7,2.63-5.44,21.69-10.88,43.38-16.33,65.06-.91,3.61-.91,3.64-4.63,3.71-4.39.09-8.77.11-13.16.15-.53,0-1.07-.07-1.84-.13Z"/>
              </g>
            </svg>
          </div>
          <p className="text-stone-300 text-sm leading-relaxed font-semibold">
            Tu destino premium en Venezuela para las mejores marcas de calzado. 
            Elegancia, comodidad y un estilo de compra minimalista directo por WhatsApp.
          </p>
        </div>
        
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-stone-300">Contacto</h4>
          <ul className="space-y-4 text-sm text-stone-300 font-semibold">
            <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-stone-400" /> +58 412 2178393</li>
            <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-stone-400" /> Tienda Online (Kicks Venezuela)</li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-stone-300">Síguenos</h4>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-all"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-all"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-all">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:border-white transition-all">
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-stone-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-300 gap-4">
        <p className="text-stone-300 font-semibold">&copy; {new Date().getFullYear()} KICKS VENEZUELA. Todos los derechos reservados.</p>
        <button 
          onClick={onAdminClick} 
          className="text-[10px] text-stone-300 hover:text-[#FCD901] font-mono tracking-widest uppercase transition-colors font-bold"
        >
          Acceso Corporativo 🔐
        </button>
      </div>
    </footer>
  );
}
