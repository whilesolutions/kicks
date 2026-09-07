import { ArrowRight, Trophy, Gift } from "lucide-react";
// @ts-ignore
import promoPadre from "../assets/images/promo_padre_banner_1781473917582.jpg";
// @ts-ignore
import promoMundial from "../assets/images/promo_mundial_estadio_banner_1781476173261.jpg";

export function PromoBanners() {
  return (
    <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row gap-4 px-4 sm:px-6 lg:px-8 mt-6 mb-12">
      
      {/* Banner Día del Padre */}
      <div className="flex-1 bg-gray-950 relative overflow-hidden min-h-[250px] md:min-h-[300px] group cursor-pointer rounded-3xl">
         <div 
           className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
           style={{ backgroundImage: `url(${promoPadre})` }}
         ></div>
      </div>

      {/* Banner Mundial */}
      <div className="flex-1 bg-black relative overflow-hidden min-h-[250px] md:min-h-[300px] group cursor-pointer rounded-3xl">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
          style={{ backgroundImage: `url(${promoMundial})` }}
        ></div>
      </div>

    </div>
  );
}

interface BrandBannerProps {
  brand: string | null;
  category: 'Calzado' | 'Ropa' | null;
  subcategory: string | null;
  onClearFilters?: () => void;
}
export function BrandBanner({ brand, category, subcategory, onClearFilters }: BrandBannerProps) {
  let bgUrl = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop";

  if (brand) {
    switch (brand.toLowerCase()) {
      case 'avia':
        bgUrl = "https://images.unsplash.com/photo-1482731215275-a1f151646268?q=80&w=1200&auto=format&fit=crop";
        break;
      case 'penguin':
      case 'original penguin':
        bgUrl = "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop";
        break;
      case 'hey dude':
        bgUrl = "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop";
        break;
      case 'carven':
        bgUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop";
        break;
      default:
        // Generic brand background
        bgUrl = "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1200&auto=format&fit=crop";
        break;
    }
  } else if (category === 'Ropa') {
    bgUrl = "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop";
  } else if (category === 'Calzado') {
    bgUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 mb-10">
      <div className="relative overflow-hidden bg-gray-50 h-[180px] md:h-[260px] flex items-center justify-start group rounded-3xl shadow-sm border border-gray-100">
        {/* Background Image with Parallax Hover */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] ease-out group-hover:scale-105"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
      </div>
    </div>
  );
}
