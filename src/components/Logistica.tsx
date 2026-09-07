import React, { useState, useMemo } from "react";
import { DispatchType, SaleType, ClientType, DevolucionType, ProductType } from "../types";
import { 
  Truck, 
  MapPin, 
  Search, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MoreHorizontal, 
  ChevronRight, 
  TrendingUp, 
  Eye, 
  FileText,
  DollarSign,
  User,
  ExternalLink,
  RefreshCw,
  Package,
  Activity,
  Clipboard,
  Sparkles,
  ShieldAlert
} from "lucide-react";

interface LogisticaProps {
  sales: SaleType[];
  clients: ClientType[];
  dispatches: DispatchType[];
  devoluciones: DevolucionType[];
  products: ProductType[];
  onAddDispatch: (payload: any) => Promise<any>;
  onUpdateDispatch: (id: string, updates: any) => Promise<any>;
  onAddDevolucion: (payload: any) => Promise<any>;
  onUpdateDevolucion: (id: string, updates: any) => Promise<any>;
  refreshData: () => Promise<void>;
  currentRole: 'admin' | 'gerente' | 'operador';
}

export default function Logistica({ 
  sales, 
  clients,
  dispatches, 
  devoluciones = [],
  products = [],
  onAddDispatch, 
  onUpdateDispatch, 
  onAddDevolucion,
  onUpdateDevolucion,
  refreshData,
  currentRole
}: LogisticaProps) {
  // Navigation tabs for Logistics Hub
  const [activeTab, setActiveTab] = useState<'despachos' | 'devoluciones'>('despachos');

  // Filters & State for Despachos
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("TODOS");
  const [courierFilter, setCourierFilter] = useState<string>("TODOS");
  const [trackingQuery, setTrackingQuery] = useState("");
  
  // Create Dialog state for Despachos
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState("");
  const [clientName, setClientName] = useState("");
  const [shippingState, setShippingState] = useState("Distrito Capital");
  const [shippingMun, setShippingMun] = useState("Chacao");
  const [address, setAddress] = useState("");
  const [shippingType, setShippingType] = useState<'Nacional' | 'Local Delivery'>('Local Delivery');
  const [courier, setCourier] = useState<'MRW' | 'Zoom' | 'Domesa' | 'Tealca' | 'Delivery Local (Motorizado)'>('Delivery Local (Motorizado)');
  const [cost, setCost] = useState("5.0");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tracking Lookup Result State
  const [trackingResult, setTrackingResult] = useState<DispatchType | null>(null);
  const [hasSearchedTracking, setHasSearchedTracking] = useState(false);

  // Return Feature States
  const [showAddReturnForm, setShowAddReturnForm] = useState(false);
  const [selectedDispatchId, setSelectedDispatchId] = useState("");
  const [returnSku, setReturnSku] = useState("");
  const [returnMotivo, setReturnMotivo] = useState<'Cambio de Talla' | 'Producto Dañado' | 'Otro'>('Cambio de Talla');
  const [tallaOriginal, setTallaOriginal] = useState("");
  const [tallaNueva, setTallaNueva] = useState("");
  const [skuNuevo, setSkuNuevo] = useState("");
  const [detalleDano, setDetalleDano] = useState("");
  const [costoRetorno, setCostoRetorno] = useState("4.5");
  const [reingresaStock, setReingresaStock] = useState(true);
  const [notasReturn, setNotasReturn] = useState("");
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  // Filters for Devoluciones listing
  const [returnSearchTerm, setReturnSearchTerm] = useState("");
  const [returnMotivoFilter, setReturnMotivoFilter] = useState<string>("TODOS");

  // Filtered dispatches
  const filteredDispatches = useMemo(() => {
    return dispatches.filter(d => {
      const matchesSearch = 
        d.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id_despacho.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.guia_tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.id_venta.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "TODOS" || d.estado_despacho === statusFilter;
      const matchesCourier = courierFilter === "TODOS" || d.agencia_courier === courierFilter;
      
      return matchesSearch && matchesStatus && matchesCourier;
    });
  }, [dispatches, searchTerm, statusFilter, courierFilter]);

  // Statistics for Despachos
  const stats = useMemo(() => {
    const total = dispatches.length;
    const delivered = dispatches.filter(d => d.estado_despacho === "Entregado").length;
    const inRoute = dispatches.filter(d => d.estado_despacho === "En Ruta").length;
    const prepared = dispatches.filter(d => d.estado_despacho === "Preparado").length;
    const pending = dispatches.filter(d => d.estado_despacho === "Pendiente").length;
    const issues = dispatches.filter(d => ["Retornado", "Problema/Soporte"].includes(d.estado_despacho)).length;
    
    const local = dispatches.filter(d => d.tipo_envio === "Local Delivery").length;
    const national = dispatches.filter(d => d.tipo_envio === "Nacional").length;
    
    return { total, delivered, inRoute, prepared, pending, issues, local, national };
  }, [dispatches]);

  // Statistics for Devoluciones
  const returnStats = useMemo(() => {
    const total = devoluciones.length;
    const sizeExchanges = devoluciones.filter(d => d.motivo === "Cambio de Talla").length;
    const damagedProducts = devoluciones.filter(d => d.motivo === "Producto Dañado").length;
    const otherMotives = devoluciones.filter(d => d.motivo === "Otro").length;
    const totalReturnFreight = devoluciones.reduce((acc, d) => acc + d.costo_retorno, 0);
    const pendingReceive = devoluciones.filter(d => d.estado_devolucion === "Pendiente de Recibir").length;
    const receivedInWarehouse = devoluciones.filter(d => d.estado_devolucion === "Recibida en Almacén").length;

    return { total, sizeExchanges, damagedProducts, otherMotives, totalReturnFreight, pendingReceive, receivedInWarehouse };
  }, [devoluciones]);

  // Filtered Devoluciones List
  const filteredDevoluciones = useMemo(() => {
    return devoluciones.filter(d => {
      const matchesSearch = 
        d.nombre_cliente.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
        d.id_devolucion.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
        d.id_despacho.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
        d.id_venta.toLowerCase().includes(returnSearchTerm.toLowerCase()) ||
        d.sku.toLowerCase().includes(returnSearchTerm.toLowerCase());

      const matchesMotivo = returnMotivoFilter === "TODOS" || d.motivo === returnMotivoFilter;
      return matchesSearch && matchesMotivo;
    });
  }, [devoluciones, returnSearchTerm, returnMotivoFilter]);

  // Action dispatch helpers
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await onUpdateDispatch(id, { estado_despacho: newStatus });
      await refreshData();
    } catch (err) {
      console.error("Fallo al actualizar despacho:", err);
    }
  };

  const handleCarrierChange = async (id: string, newCarrier: any) => {
    try {
      await onUpdateDispatch(id, { agencia_courier: newCarrier });
      await refreshData();
    } catch (err) {
      console.error("Fallo al actualizar courier:", err);
    }
  };

  const handleTrackingUpdate = async (id: string, code: string) => {
    try {
      await onUpdateDispatch(id, { guia_tracking: code });
      await refreshData();
    } catch (err) {
      console.error("Fallo al actualizar guía:", err);
    }
  };

  // Tracking Code Lookup
  const handleTrackingLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearchedTracking(true);
    if (!trackingQuery.trim()) {
      setTrackingResult(null);
      return;
    }
    const found = dispatches.find(d => 
      d.guia_tracking.toLowerCase() === trackingQuery.trim().toLowerCase() ||
      d.id_despacho.toLowerCase() === trackingQuery.trim().toLowerCase() ||
      d.id_venta.toLowerCase() === trackingQuery.trim().toLowerCase()
    );
    setTrackingResult(found || null);
  };

  // Populate client from selected sale
  const handleSaleSelectChange = (saleId: string) => {
    setSelectedSaleId(saleId);
    const mSale = sales.find(s => s.id_venta === saleId);
    if (mSale) {
      setShippingState(mSale.estado_entrega || "Distrito Capital");
      setShippingMun(mSale.municipio_entrega || "Libertador");
      
      // Attempt to find client name
      const linkedClient = clients.find(c => c.id_cliente === mSale.id_cliente);
      setClientName(linkedClient ? linkedClient.nombre : mSale.id_cliente || "Consumidor Final");
      if (mSale.estado_entrega === "Distrito Capital" || mSale.estado_entrega === "Miranda") {
        setShippingType('Local Delivery');
        setCourier('Delivery Local (Motorizado)');
        setCost("4.5");
      } else {
        setShippingType('Nacional');
        setCourier('Zoom');
        setCost("7.5");
      }
    }
  };

  // Trigger Return setup for a specific Despacho
  const handleTriggerReturnForDispatch = (disp: DispatchType) => {
    setSelectedDispatchId(disp.id_despacho);
    
    // Find linked sale to get original item SKU
    const linkedSale = sales.find(s => s.id_venta === disp.id_venta);
    if (linkedSale) {
      setReturnSku(linkedSale.sku);
      
      // populate original size from the product info
      const prod = products.find(p => p.sku === linkedSale.sku);
      if (prod) {
        setTallaOriginal(String(prod.talla));
      } else {
        // Fallback extract size from SKU e.g. ZAP-001-41-NEGRO -> 41
        const parts = linkedSale.sku.split('-');
        if (parts.length >= 4) {
          setTallaOriginal(parts[parts.length - 2]);
        }
      }
    }
    setReturnMotivo("Cambio de Talla");
    setTallaNueva("");
    setSkuNuevo("");
    setDetalleDano("");
    setNotasReturn("");
    setCostoRetorno("4.5");
    setReingresaStock(true);

    // Switch to returns tab & open form
    setActiveTab("devoluciones");
    setShowAddReturnForm(true);
  };

  // Auto populate values when dispatch is manually selected in the return form
  const handleReturnDispatchChange = (dispatchId: string) => {
    setSelectedDispatchId(dispatchId);
    if (!dispatchId) return;

    const disp = dispatches.find(d => d.id_despacho === dispatchId);
    if (disp) {
      const linkedSale = sales.find(s => s.id_venta === disp.id_venta);
      if (linkedSale) {
        setReturnSku(linkedSale.sku);
        const prod = products.find(p => p.sku === linkedSale.sku);
        if (prod) {
          setTallaOriginal(String(prod.talla));
        } else {
          const parts = linkedSale.sku.split('-');
          if (parts.length >= 4) {
            setTallaOriginal(parts[parts.length - 2]);
          }
        }
      }
    }
  };

  // List of other products of the same style (alternative sizes/colors)
  const alternateProductsForSku = useMemo(() => {
    if (!returnSku) return [];
    
    const baseProd = products.find(p => p.sku === returnSku);
    if (!baseProd) return [];

    // Filter products of same style/model name
    return products.filter(p => 
      p.nombre_producto === baseProd.nombre_producto && 
      p.sku !== returnSku
    );
  }, [products, returnSku]);

  // Create Despacho Submit
  const handleCreateDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSaleId || !clientName) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        id_venta: selectedSaleId,
        nombre_cliente: clientName,
        estado_entrega: shippingState,
        municipio_entrega: shippingMun,
        direccion_exacta: address,
        tipo_envio: shippingType,
        agencia_courier: courier,
        costo_despacho: parseFloat(cost) || 0,
        notas: notes,
        estado_despacho: "Pendiente"
      };

      await onAddDispatch(payload);
      await refreshData();
      
      // Reset
      setShowAddForm(false);
      setSelectedSaleId("");
      setClientName("");
      setAddress("");
      setNotes("");
    } catch (err) {
      console.error("Fallo al crear despacho:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create Return Submit
  const handleCreateReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispatchId || !returnSku || !returnMotivo) return;

    setIsSubmittingReturn(true);
    try {
      const payload = {
        id_despacho: selectedDispatchId,
        sku: returnSku,
        motivo: returnMotivo,
        talla_original: tallaOriginal,
        talla_nueva: returnMotivo === "Cambio de Talla" ? tallaNueva : "",
        sku_nuevo: returnMotivo === "Cambio de Talla" ? skuNuevo : "",
        detalle_dano: returnMotivo === "Producto Dañado" ? detalleDano : "",
        costo_retorno: parseFloat(costoRetorno) || 0,
        reingresa_a_stock: reingresaStock,
        notas: notasReturn,
        estado_devolucion: "Pendiente de Recibir"
      };

      await onAddDevolucion(payload);
      await refreshData();

      // Reset
      setShowAddReturnForm(false);
      setSelectedDispatchId("");
      setReturnSku("");
      setTallaOriginal("");
      setTallaNueva("");
      setSkuNuevo("");
      setDetalleDano("");
      setNotasReturn("");
    } catch (err) {
      console.error("Fallo al registrar retorno corporativo:", err);
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  // Create Patch update returns status
  const handleReturnStatusChange = async (id: string, newStatus: string) => {
    try {
      await onUpdateDevolucion(id, { estado_devolucion: newStatus });
      await refreshData();
    } catch (err) {
      console.error("Fallo al actualizar estado de retorno:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-900 pb-12">
      
      {/* HEADER SECTION */}
      <div>
        <div className="flex items-center gap-2 text-[#FCD901] font-mono text-[10px] tracking-widest uppercase font-bold">
          <Truck className="w-3.5 h-3.5" /> Logística & Control de Distribución
        </div>
        <h2 className="text-2xl font-black text-gray-900 mt-1">
          Despachos y Envíos de Encomiendas 🇻🇪
        </h2>
        <p className="text-gray-500 text-xs mt-1.5 max-w-3xl leading-relaxed">
          Monitoreo nacional de fletes, tramos de entrega interurbana para agencias aliadas 
          <strong className="text-gray-250"> MRW, Zoom, Domesa, Tealca</strong>, y distribución de delivery motorizado express local en <strong className="text-[#FCD901]">Caracas y Altos Mirandinos</strong>, integrado con logística inversa de devoluciones por talla y averías.
        </p>
      </div>

      {/* TABS SELECTOR */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('despachos')}
          className={`px-6 py-2.5 font-bold font-mono text-xs tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'despachos' 
              ? "border-[#FCD901]/20 text-[#FCD901] bg-[#FCD901]/10" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Despachos y Tracking 📦
        </button>
        <button
          onClick={() => setActiveTab('devoluciones')}
          className={`px-6 py-2.5 font-bold font-mono text-xs tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'devoluciones' 
              ? "border-[#FCD901]/20 text-[#FCD901] bg-[#FCD901]/10" 
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Devoluciones y Cambios 🔄
          {devoluciones.filter(d => d.estado_devolucion !== "Completada").length > 0 && (
            <span className="bg-red-500 text-gray-900 text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold animate-pulse">
              {devoluciones.filter(d => d.estado_devolucion !== "Completada").length}
            </span>
          )}
        </button>
      </div>

      {/* CONDITIONAL TAB RENDER */}
      {activeTab === 'despachos' ? (
        <>
          {/* METRIC KPI ROW FOR DESPACHOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* TOTAL SHIPMENTS */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Guías en Sistema</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded font-mono">Control ERP</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900 leading-none">{stats.total}</span>
                <span className="text-xs text-gray-500">paquetes</span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 flex justify-between text-[10px] text-gray-500 font-mono">
                <span>Local: <strong className="text-gray-900">{stats.local}</strong></span>
                <span>Nacional: <strong className="text-gray-900">{stats.national}</strong></span>
              </div>
            </div>

            {/* DELIVERED SUCCESS */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Entregas Exitosas</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded font-mono font-bold font-bold">✓ Efectivo</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 leading-none">
                  {stats.delivered}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ({stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex justify-between">
                <span>En Tránsito: <strong className="text-gray-900">{stats.inRoute}</strong></span>
                <span className="text-emerald-600 font-semibold font-mono">Llegada Segura</span>
              </div>
            </div>

            {/* PREPARING & PENDING */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Hangar y Alistamiento</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-mono">Pick & Pack</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400 leading-none">
                  {stats.prepared + stats.pending}
                </span>
                <span className="text-xs text-gray-500">paquetes</span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex justify-between">
                <span>Pendientes: <strong className="text-gray-900">{stats.pending}</strong></span>
                <span>Alistados En Caja: <strong className="text-gray-900">{stats.prepared}</strong></span>
              </div>
            </div>

            {/* SUPPORT / ISSUES */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Problemas & Retornos</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-red-500/10 text-red-500 border border-red-550/20 rounded font-mono">Soporte</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-red-500 leading-none">{stats.issues}</span>
                <span className="text-xs text-gray-500">guías incidentadas</span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[9px] text-gray-500 font-mono flex items-center justify-between">
                <span>Destinatario o reembolso</span>
                <span className="text-red-400 font-bold">Fletes de retorno</span>
              </div>
            </div>

          </div>

          {/* SHIPMENT LOOKUP TIMELINE */}
          <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-[#FCD901] tracking-wider uppercase font-mono">
                  ★ Buscador de Guías & Tracking Interactivo (En Vivo)
                </h3>
                <p className="text-xs text-gray-500">
                  Ingrese el número de guía, el ID de venta (ej: V-5001) para rastrear la hoja de ruta física de la encomienda.
                </p>
              </div>
              
              <form onSubmit={handleTrackingLookup} className="flex gap-2 shrink-0 md:w-96 select-none">
                <input 
                  type="text"
                  placeholder="Ej: MRW-48291029, V-5001 o María..."
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  className="flex-1 bg-[#FDFDFD] rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none placeholder-gray-650 text-gray-900 font-mono"
                />
                <button 
                  type="submit"
                  className="bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] px-4 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" /> Rastrear
                </button>
              </form>
            </div>

            {/* TRACKING TIMELINE DISPLAY */}
            {hasSearchedTracking && (
              <div className="bg-[#FDFDFD] p-5 rounded-lg border border-gray-200 animate-scale-in">
                {trackingResult ? (
                  <div className="space-y-6">
                    
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-[#FCD901]/10 flex items-center justify-center border border-[#FCD901]/20">
                          <Truck className="w-5 h-5 text-[#FCD901]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-mono font-bold text-gray-700">Guía: <span className="text-amber-400">{trackingResult.guia_tracking}</span></h4>
                          <p className="text-[10px] text-gray-500">ID Despacho: {trackingResult.id_despacho} • Con Venta: {trackingResult.id_venta}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-bold ${
                          trackingResult.estado_despacho === "Entregado" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                          trackingResult.estado_despacho === "En Ruta" ? "bg-blue-500/10 text-blue-600 border border-blue-500/20 animate-pulse" :
                          trackingResult.estado_despacho === "Preparado" ? "bg-amber-300/10 text-amber-400 border border-amber-500/10" : "bg-[#FDFDFD]0/10 text-gray-500 border border-gray-200"
                        }`}>
                          {trackingResult.estado_despacho.toUpperCase()}
                        </span>
                        <p className="text-[10px] text-gray-500 font-mono mt-1 font-bold">Courier: {trackingResult.agencia_courier}</p>
                      </div>
                    </div>

                    {/* VISUAL TIMELINE ROAD */}
                    <div className="relative pt-4 pb-2">
                      <div className="absolute top-[35px] left-6 right-6 h-0.5 bg-gray-50" />
                      <div className="absolute top-[35px] left-6 h-0.5 bg-[#FCD901] transition-all" style={{
                        width: 
                          trackingResult.estado_despacho === "Pendiente" ? "5%" :
                          trackingResult.estado_despacho === "Preparado" ? "33%" :
                          trackingResult.estado_despacho === "En Ruta" ? "66%" : "100%"
                      }} />

                      <div className="grid grid-cols-4 relative">
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${
                            ["Pendiente", "Preparado", "En Ruta", "Entregado"].includes(trackingResult.estado_despacho) 
                              ? "bg-white text-[#FCD901] border-[#FCD901]/20 shadow-[0_0_8px_rgba(212,175,55,0.4)] font-bold" 
                              : "bg-[#FDFDFD] text-gray-600 border-gray-200"
                          }`}>
                            1
                          </div>
                          <span className="text-[10px] font-bold mt-2 text-gray-700">Cargado</span>
                          <p className="text-[8px] text-gray-500 font-mono mt-0.5">Orden ERP</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${
                            ["Preparado", "En Ruta", "Entregado"].includes(trackingResult.estado_despacho) 
                              ? "bg-white text-[#FCD901] border-[#FCD901]/20 shadow-[0_0_8px_rgba(212,175,55,0.4)] font-bold" 
                              : "bg-[#FDFDFD] text-gray-600 border-gray-200"
                          }`}>
                            2
                          </div>
                          <span className="text-[10px] font-bold mt-2 text-gray-250">Preparado</span>
                          <p className="text-[8px] text-gray-500 font-mono mt-0.5">Pick & Pack</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${
                            ["En Ruta", "Entregado"].includes(trackingResult.estado_despacho) 
                              ? "bg-white text-[#FCD901] border-[#FCD901]/20 shadow-[0_0_8px_rgba(212,175,55,0.4)] font-bold" 
                              : "bg-[#FDFDFD] text-gray-600 border-gray-200"
                          }`}>
                            3
                          </div>
                          <span className="text-[10px] font-bold mt-2 text-gray-250">En Ruta</span>
                          <p className="text-[8px] text-gray-500 font-mono mt-0.5">En Tránsito</p>
                        </div>

                        <div className="flex flex-col items-center text-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${
                            trackingResult.estado_despacho === "Entregado" 
                              ? "bg-[#FCD901] text-[#0A0A0A] border-[#FCD901]/20 shadow-[0_0_12px_rgba(212,175,55,0.6)] font-extrabold" 
                              : "bg-[#FDFDFD] text-gray-600 border-gray-200"
                          }`}>
                            {trackingResult.estado_despacho === "Entregado" ? "✓" : "4"}
                          </div>
                          <span className="text-[10px] font-bold mt-2 text-gray-700">Entregado</span>
                          <p className="text-[8px] text-gray-500 font-mono mt-0.5">Destinatario Final</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FDFDFD] p-3.5 rounded border border-gray-200 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase block font-bold">Destinatario</span>
                        <p className="text-gray-900 font-bold flex items-center gap-1.5"><User className="w-3 h-3 text-[#FCD901]" /> {trackingResult.nombre_cliente}</p>
                        <p className="text-gray-500 text-[11px] leading-tight mt-0.5">{trackingResult.direccion_exacta}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase block font-bold">Destino Localidad</span>
                        <p className="text-gray-900 font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-[#FCD901]" /> {trackingResult.estado_entrega}</p>
                        <p className="text-gray-500 text-[11px]">Municipio: {trackingResult.municipio_entrega}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-500 uppercase block font-bold">Costo & Notas</span>
                        <p className="text-[#FCD901] font-bold">${trackingResult.costo_despacho.toFixed(2)} USD</p>
                        <p className="text-gray-500 text-[9px] leading-snug italic">"{trackingResult.notes || trackingResult.notas || 'Sin notas.'}"</p>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-6 text-xs font-mono text-gray-500 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    No coincide ninguna guía con "{trackingQuery}". Verifique los dígitos.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MAIN DESPACHOS WORKSPACE SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* GRID OF DISPATCH RECORDS */}
            <div className="lg:col-span-8 bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase font-mono">
                    Registros de Despachos & Hojas de Ruta
                  </h3>
                  <p className="text-xs text-gray-405">
                    Envío nacional de calzado Zeta a tianguis, sucursales y puerta de cliente.
                  </p>
                </div>

                <div className="flex gap-2 font-mono text-[10px]">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white text-[10px] text-gray-700 font-bold border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-[#aef527]"
                  >
                    <option value="TODOS">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Preparado">Preparado</option>
                    <option value="En Ruta">En Ruta</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Retornado">Retornado</option>
                    <option value="Problema/Soporte">Problema</option>
                  </select>

                  <select 
                    value={courierFilter}
                    onChange={(e) => setCourierFilter(e.target.value)}
                    className="bg-white text-[10px] text-gray-700 font-bold border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-[#aef527]"
                  >
                    <option value="TODOS">Todos los Couriers</option>
                    <option value="MRW">MRW</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Domesa">Domesa</option>
                    <option value="Tealca">Tealca</option>
                    <option value="Delivery Local (Motorizado)">Delivery Local</option>
                  </select>
                </div>
              </div>

              {/* Quick Search filter bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute top-2.5 left-3" />
                <input 
                  type="text"
                  placeholder="Buscar por cliente, id de venta, flete de correo, tracking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FDFDFD] rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none placeholder-gray-650"
                />
              </div>

              {/* Table of Dispatches */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[9.5px] pb-2 font-bold bg-[#FDFDFD]">
                      <th className="py-2.5 px-3">Hoja / Venta</th>
                      <th className="py-2.5 px-3">Cliente / Destino</th>
                      <th className="py-2.5 px-3">Agencia Allied</th>
                      <th className="py-2.5 px-3">Guía Tracking</th>
                      <th className="py-2.5 px-3">Estado Alistado</th>
                      <th className="py-2.5 px-3 text-right">Flete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDispatches.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          Ninguna encomienda coincide con el filtro.
                        </td>
                      </tr>
                    ) : (
                      filteredDispatches.map((disp) => {
                        const hasReturn = devoluciones.some(d => d.id_despacho === disp.id_despacho);
                        return (
                          <tr key={disp.id_despacho} className="hover:bg-white/[0.01] transition-colors leading-relaxed">
                            
                            <td className="py-3 px-3">
                              <div className="font-bold text-gray-900">{disp.id_despacho}</div>
                              <span className="text-[10px] text-[#FCD901] bg-[#FCD901]/10 border border-[#FCD901]/10 px-1 py-0.2 rounded font-mono block w-max mt-0.5">
                                {disp.id_venta}
                              </span>
                              
                              {/* Trigger return shortcut button */}
                              {hasReturn ? (
                                <span className="text-[9px] text-rose-400 bg-rose-500/10 border border-rose-500/10 px-1 py-0.5 rounded font-mono font-bold mt-1.5 flex items-center gap-1 w-max">
                                  ✓ Con Devolución
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleTriggerReturnForDispatch(disp)}
                                  className="mt-1.5 text-[9px] bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 hover:border-red-500/35 text-red-300 hover:text-white font-bold font-mono py-0.5 px-1.5 rounded flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-sm"
                                  title="Registrar devolución por falla de talla o avería del calzado"
                                >
                                  <RefreshCw className="w-2.5 h-2.5 animate-spin-hover" /> Cambios/Fallas
                                </button>
                              )}
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-semibold text-gray-900 flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-500 shrink-0" /> {disp.nombre_cliente}
                              </div>
                              <p className="text-[9px] text-gray-500 mt-0.5 leading-snug flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-red-500 shrink-0" />
                                {disp.estado_entrega}, {disp.municipio_entrega}
                              </p>
                            </td>

                            <td className="py-3 px-3">
                              <div className="font-semibold text-gray-700">
                                {disp.agencia_courier}
                              </div>
                              <span className={`text-[8px] font-bold font-mono px-1 py-0.2 rounded ${
                                disp.tipo_envio === "Local Delivery" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10" : "bg-blue-500/10 text-blue-600 border border-blue-500/10"
                              }`}>
                                {disp.tipo_envio}
                              </span>
                            </td>

                            <td className="py-3 px-3">
                              <input 
                                type="text"
                                value={disp.guia_tracking}
                                onChange={(e) => handleTrackingUpdate(disp.id_despacho, e.target.value)}
                                className="bg-[#FDFDFD] rounded border border-gray-200 py-0.5 px-2 text-[10.5px] text-gray-900 font-mono focus:ring-1 focus:ring-[#aef527] w-28 text-center"
                                title="Haga clic para actualizar código flete"
                              />
                            </td>

                            <td className="py-3 px-3">
                              <select
                                value={disp.estado_despacho}
                                onChange={(e) => handleStatusChange(disp.id_despacho, e.target.value)}
                                className={`text-[10px] font-bold font-mono py-1 px-2 rounded bg-white border ${
                                  disp.estado_despacho === "Entregado" ? "text-emerald-600 border-emerald-500/20" :
                                  disp.estado_despacho === "En Ruta" ? "text-blue-600 border-blue-500/20" :
                                  disp.estado_despacho === "Preparado" ? "text-amber-400 border-[#FCD901]/20" :
                                  disp.estado_despacho === "Pendiente" ? "text-slate-400 border-gray-200" : "text-rose-400 border-rose-500/20"
                                }`}
                              >
                                <option value="Pendiente">PENDIENTE</option>
                                <option value="Preparado">PREPARADO</option>
                                <option value="En Ruta">EN RUTA</option>
                                <option value="Entregado">ENTREGADO</option>
                                <option value="Retornado">RETORNADO</option>
                                <option value="Problema/Soporte">PROBLEMA/SOP</option>
                              </select>
                            </td>

                            <td className="py-3 px-3 text-right font-bold text-gray-250">
                              ${disp.costo_despacho.toFixed(2)}
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* QUICK DISPATCH SETUP FORM PANEL */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
                <h4 className="text-sm font-bold text-[#FCD901] tracking-wider uppercase font-mono mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#FCD901]" /> Programar Nuevo Despacho
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-normal">
                  Crea un envío de encomienda nacional o local enlazado a un registro de venta confirmado del ERP.
                </p>

                <form onSubmit={handleCreateDispatch} className="space-y-4">
                  
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Relacionar con Venta:</label>
                    <select 
                      value={selectedSaleId}
                      onChange={(e) => handleSaleSelectChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono text-gray-900 focus:ring-1 focus:ring-[#aef527] focus:outline-none"
                      required
                    >
                      <option value="">-- Seleccionar Venta Reciente --</option>
                      {sales
                        .filter(s => s.cantidad > 0)
                        .filter(s => !dispatches.some(d => d.id_venta === s.id_venta))
                        .map(s => (
                          <option key={s.id_venta} value={s.id_venta}>
                            {s.id_venta} ({s.sku.split('-')[0]} - Can: {s.cantidad} - {s.estado_entrega})
                          </option>
                        ))
                      }
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Líder Destinatario:</label>
                    <input 
                      type="text"
                      placeholder="Ej: Gabriela Rondón..."
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Estado:</label>
                      <input 
                        type="text"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Municipio:</label>
                      <input 
                        type="text"
                        value={shippingMun}
                        onChange={(e) => setShippingMun(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Calle y Dirección Real:</label>
                    <textarea 
                      placeholder="Detalle de dirección para Courier o Delivery Local..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full h-15 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none leading-normal font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Flete Cobertura:</label>
                      <select
                        value={shippingType}
                        onChange={(e) => {
                          const type = e.target.value as 'Nacional' | 'Local Delivery';
                          setShippingType(type);
                          if (type === 'Local Delivery') {
                            setCourier('Delivery Local (Motorizado)');
                            setCost("4.5");
                          } else {
                            setCourier('Zoom');
                            setCost("7.5");
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:ring-1 focus:ring-[#aef527] text-gray-900"
                      >
                        <option value="Local Delivery">Caracas Express</option>
                        <option value="Nacional">Interior Nacional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Operador:</label>
                      <select
                        value={courier}
                        onChange={(e) => setCourier(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono text-gray-900"
                      >
                        {shippingType === "Local Delivery" ? (
                          <option value="Delivery Local (Motorizado)">Motorizado Local</option>
                        ) : (
                          <>
                            <option value="MRW">MRW</option>
                            <option value="Zoom">Zoom</option>
                            <option value="Domesa">Domesa</option>
                            <option value="Tealca">Tealca</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Flete Cobrado (USD):</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500 absolute top-2 left-2.5" />
                      <input 
                        type="number"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="w-full bg-white border border-gray-200 pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Observaciones de Encomienda:</label>
                    <input 
                      type="text"
                      placeholder="Ej: Dejar en portería, etc..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting || !selectedSaleId}
                    className="w-full bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)] select-none"
                  >
                    {isSubmitting ? "Sincronizando..." : "Registrar Despacho Zeta ★"}
                  </button>

                </form>
              </div>

              {/* VENEZUELAN ENCOMIENDAS REGULATIONS & NOTES */}
              <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 font-mono text-[10px] text-gray-500 space-y-2">
                <h4 className="text-gray-900 font-bold uppercase text-[10.5px] tracking-wide flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#FCD901]" /> Control Logístico
                </h4>
                <ul className="space-y-1.5 leading-relaxed">
                  <li>• Toda guía con flete local motorizado debe confirmarse vía WhatsApp previamente.</li>
                  <li>• Los miércoles y viernes de flete nacional se consolidan en hangar central.</li>
                  <li>• Ante demoras, el operador re-rutará la encomienda marcándola como <strong>Problema/Soporte</strong>.</li>
                </ul>
              </div>

            </div>

          </div>
        </>
      ) : (
        <>
          {/* DEVOLUCIONES LOGISTICS SUB-DASHBOARD */}
          
          {/* REVERSE LOGISTICS KPI CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* TOTAL RETURNS METRICS */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Retornos Totales</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded font-mono font-bold">Reverse Log</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-400 leading-none">{returnStats.total}</span>
                <span className="text-xs text-gray-500">órdenes</span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex justify-between">
                <span>Pendientes: <strong className="text-gray-900">{returnStats.pendingReceive}</strong></span>
                <span>Recibidas: <strong className="text-gray-900">{returnStats.receivedInWarehouse}</strong></span>
              </div>
            </div>

            {/* SIZE EXCHANGES KPI */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold text-sky-400">Cambios de Talla</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded font-mono">Calzado</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-sky-400 leading-none">
                  {returnStats.sizeExchanges}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ({returnStats.total > 0 ? Math.round((returnStats.sizeExchanges / returnStats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex justify-between">
                <span>Deduce & corrige stock de shelf</span>
                <span className="text-emerald-600 font-semibold font-mono">Auto Stock</span>
              </div>
            </div>

            {/* PRODUCT DAMAGE KPI */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold text-amber-500">Producto Dañado / Flaws</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-500 border border-[#FCD901]/20 rounded font-mono">Merma</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500 leading-none">
                  {returnStats.damagedProducts}
                </span>
                <span className="text-xs text-gray-500 font-mono">
                  ({returnStats.total > 0 ? Math.round((returnStats.damagedProducts / returnStats.total) * 100) : 0}%)
                </span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[9px] text-gray-500 font-mono flex justify-between">
                <span>Merma aislada sin retorno stock</span>
                <span className="text-red-400 font-bold font-mono">Peligro Fábrica</span>
              </div>
            </div>

            {/* LOGISTICS REVERSE LOSS KPI */}
            <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Fletes de Retorno</span>
                <span className="px-1.5 py-0.5 text-[9px] bg-red-500/10 text-red-500 border border-red-500/15 rounded font-mono">Flete Extra</span>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-3xl font-black text-rose-500 leading-none">${returnStats.totalReturnFreight.toFixed(2)}</span>
                <span className="text-xs text-gray-500">USD</span>
              </div>
              <div className="mt-3.5 pt-3 border-t border-gray-200 text-[10px] text-gray-500 font-mono flex items-center justify-between">
                <span>Costo logístico asumido</span>
                <span className="text-red-400 font-semibold font-mono">Pérdida</span>
              </div>
            </div>

          </div>

          {/* REVERSE LOGISTICS WORKSPACE LIST & FORM */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: RETURNS LIST TABLE */}
            <div className="lg:col-span-8 bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 tracking-wide uppercase font-mono">
                    Flujo de Devoluciones, Cambios y Garantías
                  </h3>
                  <p className="text-xs text-gray-405">
                    Historial de devoluciones de calzado por errores en talla o producto dañado con reconciliación de bodega.
                  </p>
                </div>

                <div className="flex gap-2 font-mono">
                  <select 
                    value={returnMotivoFilter}
                    onChange={(e) => setReturnMotivoFilter(e.target.value)}
                    className="bg-white text-[10px] text-gray-700 font-bold border border-gray-200 rounded px-2.5 py-1 focus:ring-1 focus:ring-[#aef527]"
                  >
                    <option value="TODOS">Todos los Motivos</option>
                    <option value="Cambio de Talla">Cambio de Talla</option>
                    <option value="Producto Dañado">Producto Dañado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Search Return Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute top-2.5 left-3" />
                <input 
                  type="text"
                  placeholder="Buscar devolución por cliente, id despacho, venta, SKU defectuoso..."
                  value={returnSearchTerm}
                  onChange={(e) => setReturnSearchTerm(e.target.value)}
                  className="w-full bg-[#FDFDFD] rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none placeholder-gray-650"
                />
              </div>

              {/* Devoluciones Datagrid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[9.5px] pb-2 font-bold bg-[#FDFDFD]">
                      <th className="py-2.5 px-3">Retorno / Fecha</th>
                      <th className="py-2.5 px-3">Relaciones ERP</th>
                      <th className="py-2.5 px-3">Cliente / Detalle Motivo</th>
                      <th className="py-2.5 px-3">Alineación de Stock</th>
                      <th className="py-2.5 px-3">Estado Retorno</th>
                      <th className="py-2.5 px-3 text-right">Flete Ret</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDevoluciones.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          Ningún proceso de devolución registrado.
                        </td>
                      </tr>
                    ) : (
                      filteredDevoluciones.map((dev) => (
                        <tr key={dev.id_devolucion} className="hover:bg-white/[0.01] transition-colors leading-relaxed">
                          
                          {/* ID and Date */}
                          <td className="py-3.5 px-3">
                            <div className="font-extrabold text-[#FCD901]">{dev.id_devolucion}</div>
                            <span className="text-[9px] text-gray-500 block font-mono mt-0.5">
                              {dev.fecha_registro}
                            </span>
                          </td>

                          {/* Linked despacho & sale */}
                          <td className="py-3.5 px-3">
                            <div className="text-gray-700 font-bold block">{dev.id_despacho}</div>
                            <span className="text-[9.5px] text-gray-500 font-mono block">
                              Venta: {dev.id_venta}
                            </span>
                          </td>

                          {/* Client & specifics of damage or size */}
                          <td className="py-3.5 px-3 space-y-1">
                            <div className="font-semibold text-gray-900 flex items-center gap-1">
                              <User className="w-3 h-3 text-[#FCD901]" /> {dev.nombre_cliente}
                            </div>
                            
                            {/* Motivo details */}
                            <div className="text-[10px]">
                              <span className={`px-1.5 py-0.2 rounded font-bold text-[8.5px] tracking-wide block w-max ${
                                dev.motivo === "Cambio de Talla" ? "bg-sky-500/10 text-sky-400" : "bg-amber-300/10 text-amber-400"
                              }`}>
                                {dev.motivo.toUpperCase()}
                              </span>
                              
                              <p className="text-gray-700 text-[10.5px] mt-1 leading-normal font-sans">
                                {dev.motivo === "Cambio de Talla" ? (
                                  <>
                                    Devuelve talla <strong>{dev.talla_original}</strong> → Recibe talla <strong>{dev.talla_nueva}</strong>
                                    <span className="block text-[9.5px] font-mono text-gray-500 mt-0.5 uppercase">Alt SKU: {dev.sku_nuevo || 'No registrado'}</span>
                                  </>
                                ) : (
                                  <>
                                    Defecto: <span className="text-rose-300 font-normal italic">"{dev.detalle_dano || 'No detallado.'}"</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </td>

                          {/* Stock reconciliation */}
                          <td className="py-3.5 px-3">
                            {dev.reingresa_a_stock ? (
                              <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/10 px-1.5 py-0.5 rounded text-[8.5px] font-bold font-mono tracking-widest uppercase">
                                ✓ Reingresó
                              </span>
                            ) : (
                              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/10 px-1.5 py-0.5 rounded text-[8.5px] font-bold font-mono tracking-widest uppercase">
                                ☒ Aislado Merma
                              </span>
                            )}
                            <p className="text-[9.5px] text-gray-500 mt-1 uppercase font-mono max-w-28 truncate" title={dev.sku}>
                              SKU: {dev.sku.split('-')[0]}
                            </p>
                          </td>

                          {/* Status flow dropdown */}
                          <td className="py-3.5 px-3">
                            <select
                              value={dev.estado_devolucion}
                              onChange={(e) => handleReturnStatusChange(dev.id_devolucion, e.target.value)}
                              className={`text-[10px] font-bold font-mono py-1 px-1.5 rounded bg-white border ${
                                dev.estado_devolucion === "Completada" ? "text-emerald-600 border-emerald-500/20" :
                                dev.estado_devolucion === "Nueva Talla Enviada" ? "text-sky-400 border-sky-500/20 animate-pulse" :
                                dev.estado_devolucion === "Recibida en Almacén" ? "text-amber-400 border-amber-500/20" : "text-gray-500 border-gray-200"
                              }`}
                            >
                              <option value="Pendiente de Recibir">PENDIENTE</option>
                              <option value="Recibida en Almacén">RECIBIDO BODEGA</option>
                              <option value="Nueva Talla Enviada">NUEVO ENVIADO</option>
                              <option value="Completada">COMPLETADA</option>
                            </select>
                          </td>

                          {/* Freight */}
                          <td className="py-3.5 px-3 text-right font-extrabold text-gray-700">
                            ${dev.costo_retorno.toFixed(2)}
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* RIGHT COLUMN: REGISTRY RETURN FORM */}
            <div className="lg:col-span-4 space-y-6 animate-scale-in">
              
              <div className="bg-[#FDFDFD] p-5 rounded-xl border border-red-900/30">
                <h4 className="text-sm font-bold text-[#FCD901] tracking-wider uppercase font-mono mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#FCD901] animate-spin-hover" /> Registrar Devolución ZETA
                </h4>
                <p className="text-xs text-gray-500 mb-4 leading-normal">
                  Inicie un proceso de logística inversa. Esto recalculará y reconciliará stocks automáticos de tienda central.
                </p>

                <form onSubmit={handleCreateReturnSubmit} className="space-y-4">
                  
                  {/* Select Dispatch */}
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Seleccionar Flete de Origen:</label>
                    <select
                      value={selectedDispatchId}
                      onChange={(e) => handleReturnDispatchChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-mono text-gray-900 focus:outline-none"
                      required
                    >
                      <option value="">-- Seleccionar Despacho --</option>
                      {dispatches.map(d => (
                        <option key={d.id_despacho} value={d.id_despacho}>
                          {d.id_despacho} - {d.nombre_cliente} ({d.id_venta})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show autofilled details of original sku */}
                  {returnSku && (
                    <div className="bg-[#FDFDFD] p-3 rounded border border-gray-200 space-y-1.5 text-xs font-mono animate-scale-in">
                      <span className="text-[9px] text-gray-500 uppercase font-black block">Item de Venta Relacionado:</span>
                      <p className="text-gray-900 font-bold max-w-full truncate">{returnSku}</p>
                      
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>Marca: <strong className="text-gray-250">Zeta Calzado</strong></span>
                        <span>Original Talla: <strong className="text-gray-900">{tallaOriginal}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Motivo selector */}
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Motivo de Devolución:</label>
                    <select
                      value={returnMotivo}
                      onChange={(e) => {
                        const mot = e.target.value as any;
                        setReturnMotivo(mot);
                        // For products damaged, default reingresaStock to false
                        if (mot === "Producto Dañado") {
                          setReingresaStock(false);
                        } else {
                          setReingresaStock(true);
                        }
                      }}
                      className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono text-gray-900"
                      required
                    >
                      <option value="Cambio de Talla">Cambio de Talla</option>
                      <option value="Producto Dañado">Producto Dañado (Falla de Fábrica)</option>
                      <option value="Otro">Otro Motivo</option>
                    </select>
                  </div>

                  {/* DYNAMIC METADATA INPUT BASED ON REASON */}
                  {returnMotivo === "Cambio de Talla" && (
                    <div className="space-y-4 pt-1 animate-scale-in">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1 font-bold">Talla Original:</label>
                          <input 
                            type="text" 
                            value={tallaOriginal} 
                            readOnly 
                            className="w-full bg-[#FDFDFD] border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-500 focus:outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono uppercase text-gray-500 mb-1 font-bold">Nueva Talla:</label>
                          <input 
                            type="text" 
                            placeholder="Ej: 40" 
                            value={tallaNueva} 
                            onChange={(e) => {
                              setTallaNueva(e.target.value);
                              // Automatically try to match alternate SKU if possible
                              const matched = alternateProductsForSku.find(p => String(p.talla) === e.target.value);
                              if (matched) {
                                setSkuNuevo(matched.sku);
                              }
                            }} 
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-900 focus:ring-1 focus:ring-[#aef527] focus:outline-none" 
                            required={returnMotivo === "Cambio de Talla"}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Alternativa en Stock para Swap:</label>
                        <select
                          value={skuNuevo}
                          onChange={(e) => {
                            setSkuNuevo(e.target.value);
                            const matched = alternateProductsForSku.find(p => p.sku === e.target.value);
                            if (matched) {
                              setTallaNueva(String(matched.talla));
                            }
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-900 focus:outline-none"
                          required={returnMotivo === "Cambio de Talla"}
                        >
                          <option value="">-- Seleccionar SKU Intercambio --</option>
                          {alternateProductsForSku.map(ap => (
                            <option key={ap.sku} value={ap.sku}>
                              Talla {ap.talla} (Dispo: {ap.stock_disponible} uds) - {ap.sku.split('-').slice(0, 2).join('-')}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {returnMotivo === "Producto Dañado" && (
                    <div className="space-y-1.5 animate-scale-in">
                      <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Detalles / Defectos en Calzado:</label>
                      <textarea
                        placeholder="Ej: Costura despegada, suela rota, cordones rasgados..."
                        value={detalleDano}
                        onChange={(e) => setDetalleDano(e.target.value)}
                        className="w-full h-15 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none leading-normal font-mono"
                        required={returnMotivo === "Producto Dañado"}
                      />
                    </div>
                  )}

                  {/* Reingresar a Stock Checkbox */}
                  <div className="flex items-center gap-2 select-none py-1">
                    <input 
                      type="checkbox" 
                      id="reingresaStockCheck"
                      checked={reingresaStock}
                      onChange={(e) => setReingresaStock(e.target.checked)}
                      className="cursor-pointer font-mono"
                    />
                    <label htmlFor="reingresaStockCheck" className="text-[10px] text-gray-700 font-bold tracking-wider font-mono cursor-pointer">
                      ¿Reingresar item retornado a Stock Disponible?
                    </label>
                  </div>

                  {/* Costo Flete Retorno */}
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Costo Flete de Retorno (USD):</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500 absolute top-2 left-2.5" />
                      <input 
                        type="number"
                        step="0.01"
                        value={costoRetorno}
                        onChange={(e) => setCostoRetorno(e.target.value)}
                        className="w-full bg-white border border-gray-200 pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none font-mono"
                        required
                      />
                    </div>
                    <p className="text-[9px] text-gray-500 font-mono mt-0.5">Monto de flete cobrado por el courier o motorizado para el re-envío.</p>
                  </div>

                  {/* Private returns notes */}
                  <div>
                    <label className="block text-[9.5px] font-mono uppercase text-gray-500 mb-1 font-bold">Notas Privadas / Courier:</label>
                    <input 
                      type="text"
                      placeholder="Ej: Se acordó con cliente flete gratis..."
                      value={notasReturn}
                      onChange={(e) => setNotasReturn(e.target.value)}
                      className="w-full bg-white border border-gray-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#aef527] focus:outline-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmittingReturn || !selectedDispatchId}
                    className="w-full bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] py-2 rounded-lg text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-[0_0_10px_rgba(212,175,55,0.15)] select-none"
                  >
                    {isSubmittingReturn ? "Procesando..." : "Grabar Devolución Corporativa ✓"}
                  </button>

                </form>
              </div>

              {/* REVERSE LOGISTICS RULES */}
              <div className="bg-[#FDFDFD] p-5 rounded-xl border border-rose-900/10 font-mono text-[10px] text-gray-500 space-y-2">
                <h4 className="text-gray-900 font-bold uppercase text-[10.5px] tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#FCD901]" /> Garantía Zeta
                </h4>
                <p className="leading-relaxed">
                  • Para **Cambio de Talla**, el reingreso al stock devuelve la talla original a tienda, mientras que el SKU de intercambio se deduce automáticamente.
                </p>
                <p className="leading-relaxed">
                  • Para **Producto Dañado**, mantenga la casilla desactivada para aislar la avería fuera del stock de venta, registrando la pérdida de merma.
                </p>
              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}
