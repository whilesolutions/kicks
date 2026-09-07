import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PRODUCTS, SIZES, CLOTHING_SIZES } from './data';
import { Product, CartItem } from './types';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { PromoBanners, BrandBanner } from './components/Banners';
import { CategoryGrid } from './components/CategoryGrid';
import { PromoMidBanner } from './components/PromoMidBanner';
import { BrandCarousel } from './components/BrandCarousel';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { ReviewCarousel } from './components/ReviewCarousel';

// ERP Imports
import Navigation from './components/Navigation';
import DashboardGlobal from './components/DashboardGlobal';
import Ventas from './components/Ventas';
import Inventario from './components/Inventario';
import Logistica from './components/Logistica';
import Proyectos from './components/Proyectos';
import Clientes from './components/Clientes';
import Marketing from './components/Marketing';
import Gastos from './components/Gastos';
import GeminiAnalyst from './components/GeminiAnalyst';
import DataDictionary from './components/DataDictionary';
import SupabaseHelp from './components/SupabaseHelp';
import PowerBI from './components/PowerBI';
import SheetsSync from './components/SheetsSync';

import { 
  ProductType, 
  ClientType, 
  CreativeType, 
  SaleType, 
  MarketingMetricType, 
  ExpenseType, 
  DispatchType, 
  DevolucionType, 
  ProjectType 
} from './types';

const ERP_EMAIL = 'kicksshoesandmore@gmail.com';
const ERP_PASSWORD = '123456789';

export default function App() {
  const [view, setView] = useState<'home' | 'product' | 'erp'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'Calzado' | 'Ropa' | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showOnlySale, setShowOnlySale] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // ERP State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentRole, setCurrentRole] = useState<'admin' | 'gerente' | 'operador'>('admin');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [products, setProducts] = useState<ProductType[]>([]);
  const [clients, setClients] = useState<ClientType[]>([]);
  const [creatives, setCreatives] = useState<CreativeType[]>([]);
  const [sales, setSales] = useState<SaleType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [dispatches, setDispatches] = useState<DispatchType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [devolutions, setDevolutions] = useState<DevolucionType[]>([]);
  const [marketingMetrics, setMarketingMetrics] = useState<MarketingMetricType[]>([]);
  const [erpLoading, setErpLoading] = useState(false);

  // Pre-load or refresh data from our fast REST Express APIs
  const refreshAllERPData = async () => {
    setErpLoading(true);
    try {
      const [
        resProducts,
        resClients,
        resCreatives,
        resSales,
        resExpenses,
        resDispatches,
        resProjects,
        resDevolutions,
        resMetrics
      ] = await Promise.all([
        fetch('/api/productos').then(r => r.json()),
        fetch('/api/clientes').then(r => r.json()),
        fetch('/api/creativos').then(r => r.json()),
        fetch('/api/ventas').then(r => r.json()),
        fetch('/api/gastos').then(r => r.json()),
        fetch('/api/despachos').then(r => r.json()),
        fetch('/api/proyectos').then(r => r.json()),
        fetch('/api/devoluciones').then(r => r.json()),
        fetch('/api/marketing').then(r => r.ok ? r.json() : [])
      ]);

      setProducts(resProducts || []);
      setClients(resClients || []);
      setCreatives(resCreatives || []);
      setSales(resSales || []);
      setExpenses(resExpenses || []);
      setDispatches(resDispatches || []);
      setProjects(resProjects || []);
      setDevolutions(resDevolutions || []);
      setMarketingMetrics(resMetrics || []);
    } catch (err) {
      console.error('Error fetching ERP data:', err);
    } finally {
      setErpLoading(false);
    }
  };

  // Fetch ERP information when logged in or when viewing the ERP area
  useEffect(() => {
    if (isLoggedIn || view === 'erp') {
      refreshAllERPData();
    }
  }, [isLoggedIn, view]);

  // ERP Database Actions - Real REST API wrapper bindings
  const handleUpdateStock = async (sku: string, cantidad: number, tipo: 'sumar' | 'restar' | 'fijar') => {
    const res = await fetch(`/api/productos/${sku}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cantidad, tipo })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Algo salió mal al actualizar stock");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddProduct = async (prodData: any) => {
    const res = await fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prodData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al indexar producto");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddSale = async (saleData: any) => {
    const res = await fetch("/api/ventas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(saleData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrar venta");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddClient = async (clientData: any) => {
    const res = await fetch("/api/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrar cliente");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddDispatch = async (payload: any) => {
    const res = await fetch("/api/despachos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al crear despacho");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleUpdateDispatch = async (id: string, updates: any) => {
    const res = await fetch(`/api/despachos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al guardar despacho");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddDevolucion = async (payload: any) => {
    const res = await fetch("/api/devoluciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrar devolución");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleUpdateDevolucion = async (id: string, updates: any) => {
    const res = await fetch(`/api/devoluciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al actualizar devolución");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddProject = async (payload: any) => {
    const res = await fetch("/api/proyectos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al fundar proyecto");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddTask = async (projectId: string, payload: any) => {
    const res = await fetch(`/api/proyectos/${projectId}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al programar tarea");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleUpdateTaskStatus = async (projectId: string, taskId: string, updates: any) => {
    const res = await fetch(`/api/proyectos/${projectId}/tareas/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al actualizar tarea");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddCreative = async (payload: any) => {
    const res = await fetch("/api/creativos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al indexar creativo");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleUploadCSV = async (csvText: string) => {
    const res = await fetch("/api/marketing/upload-csv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csvText })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al cargar reporte CSV");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleUpdateCreative = async (id: string, payload: any) => {
    const res = await fetch(`/api/creativos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al actualizar creativo");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleAddExpense = async (payload: any) => {
    const res = await fetch("/api/gastos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al registrar egreso");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleDeleteExpense = async (id: string) => {
    const res = await fetch(`/api/gastos/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Error al remover gasto");
    }
    const data = await res.json();
    await refreshAllERPData();
    return data;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.toLowerCase() === ERP_EMAIL && passwordInput === ERP_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Verifique por favor.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmailInput('');
    setPasswordInput('');
    setView('home');
  };

  // Inline Search derived from data.ts MOCK_PRODUCTS
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedBrand, selectedSize, selectedGender, selectedColor, showOnlySale, selectedCategory, selectedSubcategory]);

  const brands = useMemo(() => Array.from(new Set(MOCK_PRODUCTS.map(p => p.brand))), []);
  const genders = useMemo(() => Array.from(new Set(MOCK_PRODUCTS.map(p => p.gender))), []);
  const colors = useMemo(() => Array.from(new Set(MOCK_PRODUCTS.flatMap(p => p.colors))), []);
  const allReviews = useMemo(() => MOCK_PRODUCTS.flatMap(p => p.reviews), []);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(searchLower) || 
                            p.brand.toLowerCase().includes(searchLower) ||
                            p.gender.toLowerCase().includes(searchLower) ||
                            p.colors.some(c => c.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
      if (selectedBrand && p.brand !== selectedBrand) return false;
      if (selectedSize && !p.sizes.some(s => s.us === selectedSize)) return false;
      if (selectedGender && p.gender !== selectedGender) return false;
      if (selectedColor && !p.colors.includes(selectedColor)) return false;
      if (showOnlySale && !p.isOnSale) return false;

      const pCat = p.category || 'Calzado';
      if (selectedCategory && pCat !== selectedCategory) return false;
      if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;

      return true;
    });
  }, [searchQuery, selectedBrand, selectedSize, selectedGender, selectedColor, showOnlySale, selectedCategory, selectedSubcategory]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setView('home');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (type: string) => {
    if (type === 'ERP') {
      setView('erp');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (type.startsWith('product:')) {
      const pId = type.split(':')[1];
      const prod = MOCK_PRODUCTS.find(p => p.id === pId);
      if (prod) {
        handleProductClick(prod);
      }
      setSearchQuery('');
      return;
    }

    setView('home');
    setSelectedProduct(null);
    setSearchQuery('');
    setSelectedBrand(null);
    setSelectedSize(null);
    setSelectedGender(null);
    setSelectedColor(null);
    setShowOnlySale(false);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    
    if (type === 'Hombre') setSelectedGender('Caballero');
    if (type === 'Mujer') setSelectedGender('Dama');
    if (type === 'calzado:Caballero') {
      setSelectedCategory('Calzado');
      setSelectedGender('Caballero');
    }
    if (type === 'calzado:Dama') {
      setSelectedCategory('Calzado');
      setSelectedGender('Dama');
    }
    if (type === 'Promos') setShowOnlySale(true);
    if (type === 'Avia') setSelectedBrand('Avia');
    if (type === 'Original Penguin') setSelectedBrand('Penguin');
    if (type === 'Hey Dude') setSelectedBrand('Hey Dude');
    if (type === 'Carven') setSelectedBrand('Carven');
    
    if (type === 'Ropa') {
      setSelectedCategory('Ropa');
    }
    if (type.startsWith('ropa:')) {
      setSelectedCategory('Ropa');
      setSelectedSubcategory(type.split(':')[1]);
    }
    if (type === 'Calzado') {
      setSelectedCategory('Calzado');
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    const existingIndex = cart.findIndex(i => 
      i.productId === newItem.productId && 
      i.color === newItem.color && 
      i.size.us === newItem.size.us
    );

    if (existingIndex >= 0) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += newItem.quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { ...newItem, id: Math.random().toString(36).substring(7) }]);
    }
    
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  // --- RENDERING PATHS ---

  // 1. ERP SECURE REGISTRY VIEW (UNLOGGED)
  if (view === 'erp' && !isLoggedIn) {
     return (
       <div className="flex flex-col min-h-screen bg-gray-50 text-black selection:bg-black selection:text-gray-900 font-sans items-center justify-center p-4">
         <div className="w-full max-w-md bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 space-y-6">
           <div className="text-center">
             <button onClick={() => setView('home')} className="font-sans text-3xl font-black tracking-tighter text-black uppercase mb-1">
               KICKS
             </button>
             <p className="text-xs uppercase tracking-widest font-bold text-gray-600 mt-2">
               Zeta Enterprise Resource Planning
             </p>
           </div>

           <form onSubmit={handleLoginSubmit} className="space-y-4">
             <div>
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Correo Electrónico</label>
               <input
                 type="email"
                 required
                 placeholder="kicksshoesandmore@gmail.com"
                 value={emailInput}
                 onChange={(e) => setEmailInput(e.target.value)}
                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm text-black focus:border-black focus:bg-white focus:outline-none focus:ring-0"
               />
             </div>

             <div>
               <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Contraseña Corporativa</label>
               <input
                 type="password"
                 required
                 placeholder="•••••••••"
                 value={passwordInput}
                 onChange={(e) => setPasswordInput(e.target.value)}
                 className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 text-sm text-black focus:border-black focus:bg-white focus:outline-none focus:ring-0"
               />
             </div>

             {loginError && (
               <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold text-center border border-red-100 font-mono">
                 ⚠️ {loginError}
               </div>
             )}

             <button
               type="submit"
               className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3 uppercase tracking-widest text-xs rounded-xl transition-colors cursor-pointer mt-2"
             >
               Iniciar Sesión ERP
             </button>
           </form>

           <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 text-center">
             <button
               onClick={() => setView('home')}
               className="text-xs text-gray-500 hover:text-black hover:underline"
             >
               ← Volver a la Tienda Virtual
             </button>
             <p className="text-[10px] text-gray-600 leading-snug">
               Área restringida. Solo personal autorizado KICKS & CO. El acceso no autorizado quedará registrado.
             </p>
           </div>
         </div>
       </div>
     );
  }

  // 2. ERP SECURE DASHBOARD DESKTOP SHELL (LOGGED IN)
  if (view === 'erp' && isLoggedIn) {
     return (
       <div className="flex flex-col lg:flex-row min-h-screen bg-[#FDFDFD] text-black light-erp">
          <Navigation 
            currentRole={currentRole} 
            setRole={setCurrentRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            onBackToStore={() => setView('home')}
          />
          
          <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-h-screen relative">
             <div className="absolute top-4 right-4 z-40 hidden lg:block">
               <button
                 onClick={handleLogout}
                 className="px-4 py-1.5 border border-gray-200 hover:border-red-500 hover:text-red-500 rounded font-mono text-[10px] uppercase tracking-widest bg-white text-gray-700 transition-all shadow-sm cursor-pointer"
               >
                 Cerrar Sesión 🔓
               </button>
             </div>

             {erpLoading ? (
               <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FCD901]"></div>
                 <p className="text-xs text-stone-400 font-mono">Cargando base de datos ERP en tiempo real...</p>
               </div>
             ) : (
               <div className="animate-fade-in">
                 {activeTab === 'dashboard' && (
                   <DashboardGlobal 
                     products={products} 
                     clients={clients} 
                     sales={sales} 
                     expenses={expenses} 
                     marketingMetrics={marketingMetrics} 
                   />
                 )}
                 {activeTab === 'ventas' && (
                   <Ventas 
                     products={products} 
                     clients={clients} 
                     creatives={creatives} 
                     sales={sales} 
                     onAddSale={handleAddSale} 
                     onAddClient={handleAddClient} 
                     refreshData={refreshAllERPData} 
                   />
                 )}
                 {activeTab === 'inventario' && (
                   <Inventario 
                     products={products} 
                     onUpdateStock={handleUpdateStock} 
                     onAddProduct={handleAddProduct} 
                     refreshData={refreshAllERPData} 
                   />
                 )}
                 {activeTab === 'logistica' && (
                   <Logistica 
                     sales={sales} 
                     clients={clients} 
                     dispatches={dispatches} 
                     devoluciones={devolutions} 
                     products={products} 
                     onAddDispatch={handleAddDispatch} 
                     onUpdateDispatch={handleUpdateDispatch} 
                     onAddDevolucion={handleAddDevolucion} 
                     onUpdateDevolucion={handleUpdateDevolucion} 
                     refreshData={refreshAllERPData} 
                     currentRole={currentRole} 
                   />
                 )}
                 {activeTab === 'proyectos' && (
                   <Proyectos 
                     projects={projects} 
                     currentRole={currentRole} 
                     creatives={creatives} 
                     products={products} 
                     onAddProject={handleAddProject} 
                     onAddTask={handleAddTask} 
                     onUpdateTaskStatus={handleUpdateTaskStatus} 
                     onAddCreative={handleAddCreative} 
                     refreshData={refreshAllERPData} 
                   />
                 )}
                 {activeTab === 'clientes' && (
                   <Clientes 
                     clients={clients} 
                     sales={sales} 
                     creatives={creatives} 
                   />
                 )}
                 {activeTab === 'marketing' && (
                   <Marketing 
                     creatives={creatives} 
                     sales={sales} 
                     marketingMetrics={marketingMetrics} 
                     products={products} 
                     onUploadCSV={handleUploadCSV} 
                     onUpdateCreative={handleUpdateCreative} 
                     refreshData={refreshAllERPData} 
                   />
                 )}
                 {activeTab === 'gastos' && (
                   <Gastos 
                     expenses={expenses} 
                     sales={sales} 
                     products={products} 
                     onAddExpense={handleAddExpense} 
                     onDeleteExpense={handleDeleteExpense} 
                     refreshData={refreshAllERPData} 
                   />
                 )}
                 {activeTab === 'analyst' && <GeminiAnalyst />}
                 {activeTab === 'dictionary' && <DataDictionary />}
                 {activeTab === 'sheets' && <SheetsSync />}
                 {activeTab === 'supabase' && <SupabaseHelp />}
                 {activeTab === 'powerbi' && <PowerBI />}
               </div>
             )}
          </main>
       </div>
     );
  }

  // 3. STORE VIEWS (HOME)
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] font-sans text-black selection:bg-black selection:text-gray-900">
      
      {view === 'home' && (
        <div className="flex-1 flex flex-col">
          <Header 
            cartCount={cart.reduce((acc, current) => acc + current.quantity, 0)} 
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onNavClick={handleNavClick}
          />

          <main className="flex-1">
            {!searchQuery && !selectedBrand && !selectedSize && !selectedGender && !selectedColor && !showOnlySale && !selectedCategory && !selectedSubcategory ? (
              <>
                <PromoBanners />
                <CategoryGrid onSelect={handleNavClick} />
              </>
            ) : (
              (selectedBrand || selectedCategory) && (
                <BrandBanner 
                  brand={selectedBrand} 
                  category={selectedCategory} 
                  subcategory={selectedSubcategory} 
                  onClearFilters={() => {
                    setSelectedBrand(null);
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSelectedColor(null);
                    setSelectedGender(null);
                    setSelectedSize(null);
                    setSearchQuery('');
                    setShowOnlySale(false);
                  }}
                />
              )
            )}

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              
              <Filters 
                brands={brands.concat(brands.includes("Carven") ? [] : ["Carven"])}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                sizes={selectedCategory === 'Ropa' ? CLOTHING_SIZES : SIZES}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                genders={genders}
                selectedGender={selectedGender}
                setSelectedGender={setSelectedGender}
                colors={colors}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                showOnlySale={showOnlySale}
                setShowOnlySale={setShowOnlySale}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubcategory={selectedSubcategory}
                setSelectedSubcategory={setSelectedSubcategory}
              />

              {filteredProducts.length > 0 ? (
                <>
                  <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8 pb-12">
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onClick={handleProductClick} 
                      />
                    ))}
                  </div>
                  {visibleCount < filteredProducts.length && (
                    <div className="text-center mt-2 mb-16">
                      <button 
                        onClick={() => setVisibleCount(c => c + 12)} 
                        className="border border-black bg-white text-black px-12 py-3 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition-colors"
                      >
                        Cargar Más
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-32 text-center">
                   <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No encontramos productos que coincidan con tus filtros.</p>
                   <button 
                     onClick={() => { setSearchQuery(''); setSelectedBrand(null); setSelectedSize(null); setSelectedGender(null); setSelectedColor(null); setShowOnlySale(false); setSelectedCategory(null); setSelectedSubcategory(null); }}
                     className="mt-6 border border-black bg-black text-white px-6 py-2 rounded-full uppercase tracking-widest text-xs font-bold hover:bg-transparent hover:text-black transition-colors"
                   >
                     Limpiar Filtros
                   </button>
                </div>
              )}
            </div>
            
            <ReviewCarousel reviews={allReviews} />
            <PromoMidBanner />
            <FAQ />
            <BrandCarousel />
          </main>
          
          <Footer onAdminClick={() => setView('erp')} />
        </div>
      )}

      {view === 'product' && selectedProduct && (
        <div className="flex-1 flex flex-col">
          <Header 
            cartCount={cart.reduce((acc, current) => acc + current.quantity, 0)} 
            onOpenCart={() => setIsCartOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={(val) => {
              setSearchQuery(val);
              if(val.trim() !== '') {
                 setView('home');
                 setSelectedProduct(null);
                 window.scrollTo({ top: 0, behavior: 'instant' as any });
              }
            }}
            onNavClick={handleNavClick}
          />
          <main className="flex-1">
            <ProductDetail 
              product={selectedProduct} 
              onBack={handleBackToHome}
              onAddToCart={addToCart}
              onProductClick={handleProductClick}
              onNavClick={handleNavClick}
            />
            <ReviewCarousel reviews={allReviews} />
          </main>
          <Footer onAdminClick={() => setView('erp')} />
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
      />
    </div>
  );
}
