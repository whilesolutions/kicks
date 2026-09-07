import { Review } from '../types';
import { Star } from 'lucide-react';

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500 italic">Aún no hay reseñas para este producto.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((r) => (
        <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-black">{r.author}</span>
            <span className="text-xs text-gray-600">{r.date}</span>
          </div>
          <div className="flex items-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= r.rating ? 'fill-black text-black' : 'fill-gray-200 text-gray-800'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 font-serif italic">"{r.text}"</p>
        </div>
      ))}
    </div>
  );
}
