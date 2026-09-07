import { Review } from '../types';
import { Star } from 'lucide-react';

export function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  // Duplicate to ensure overflowing track
  let track = [...reviews];
  while(track.length < 10) {
    track = [...track, ...reviews];
  }

  return (
    <div className="overflow-hidden bg-gray-50 py-16 border-y border-gray-100 w-full mb-16">
       <div className="text-center mb-8 px-4">
         <h2 className="text-2xl font-black uppercase tracking-tighter text-black">Clientes Satisfechos</h2>
         <p className="text-xs text-gray-500 uppercase tracking-widest mt-2">La experiencia Kicks en palabras de nuestra comunidad</p>
       </div>
       <div className="relative w-full overflow-hidden">
         <div className="animate-marquee flex gap-6 px-6">
           {track.map((r, i) => (
             <div key={`${r.id}-${i}`} className="w-80 shrink-0 bg-white p-6 shadow-sm border border-gray-100 rounded-2xl flex flex-col justify-between">
                <div>
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= r.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-serif italic mb-6 leading-relaxed">"{r.text}"</p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-auto">
                  <span className="font-bold text-xs uppercase tracking-widest text-black">{r.author}</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-600">{r.date}</span>
                </div>
             </div>
           ))}
         </div>
       </div>
    </div>
  );
}
