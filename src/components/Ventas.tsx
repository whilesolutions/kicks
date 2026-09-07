/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Copy, 
  Smartphone,
  Info 
} from "lucide-react";
import { ProductType, ClientType, CreativeType, SaleType } from "../types";

interface VentasProps {
  products: ProductType[];
  clients: ClientType[];
  creatives: CreativeType[];
  sales: SaleType[];
  onAddSale: (saleData: any) => Promise<any>;
  onAddClient: (clientData: any) => Promise<any>;
  refreshData: () => void;
}

export default function Ventas({ 
  products, 
  clients, 
  creatives, 
  sales,
  onAddSale, 
  onAddClient,
  refreshData 
}: VentasProps) {
  // Form State
  const [selectedSku, setSelectedSku] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<ProductType | null>(null);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [cantidad, setCantidad] = useState(1);
  const [precioFinal, setPrecioFinal] = useState(0);
  const [canalVenta, setCanalVenta] = useState<'WhatsApp' | 'Instagram' | 'Facebook' | 'TikTok' | 'Tienda Virtual'>("WhatsApp");
  const [fuenteTrafico, setFuenteTrafico] = useState("");
  const [idContenido, setIdContenido] = useState("");
  const [esDevolucion, setEsDevolucion] = useState(false);
  const [origenAtribucion, setOrigenAtribucion] = useState("");

  // Filters for Autocomplete SKU
  const [filterCat, setFilterCat] = useState("Todos");
  const [filterTalla, setFilterTalla] = useState("Todos");
  const [filterColor, setFilterColor] = useState("Todos");
  const [skuSearch, setSkuSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");

  // Validation States
  const [stockError, setStockError] = useState("");
  const [atribucionWarning, setAtribucionWarning] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick Client Modal
  const [showClientModal, setShowClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientGender, setNewClientGender] = useState<'Femenino' | 'Masculino' | 'Otro'>("Femenino");
  const [newClientAge, setNewClientAge] = useState(18);
  const [newClientState, setNewClientState] = useState("Distrito Capital");
  const [newClientMunicipio, setNewClientMunicipio] = useState("Libertador");
  const [newClientSource, setNewClientSource] = useState<'Meta Ads' | 'TikTok Orgánico' | 'TikTok Live' | 'Referido' | 'Otro'>("Meta Ads");
  const [newClientCat, setNewClientCat] = useState<'Calzado' | 'Textil'>("Calzado");
  const [newClientSub, setNewClientSub] = useState("Casual");
  const [newClientStyle, setNewClientStyle] = useState("");
  const [newClientPreferredChannel, setNewClientPreferredChannel] = useState<'WhatsApp' | 'Instagram' | 'Facebook' | 'TikTok' | 'Tienda Virtual'>("WhatsApp");
  const [newClientInterests, setNewClientInterests] = useState("");

  // Sales History Table States
  const [salesSearch, setSalesSearch] = useState("");
  const [salesChannelFilter, setSalesChannelFilter] = useState("Todos");

  // Filtered Sales History List
  const filteredSalesHistory = (sales || []).filter(s => {
    const client = clients.find(c => c.id_cliente === s.id_cliente);
    const clientName = client ? client.nombre : "";
    
    const matchesSearch = s.sku.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          s.id_venta.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          clientName.toLowerCase().includes(salesSearch.toLowerCase()) ||
                          (s.id_contenido || "").toLowerCase().includes(salesSearch.toLowerCase());
                          
    const matchesChannel = salesChannelFilter === "Todos" || s.canal_venta === salesChannelFilter;
    
    return matchesSearch && matchesChannel;
  }).sort((a, b) => b.fecha_venta.localeCompare(a.fecha_venta) || b.id_venta.localeCompare(a.id_venta));

  // Google Drive Thumbnail Extractor
  const getDriveThumbnail = (driveUrl: string) => {
    if (!driveUrl) return null;
    // Standard extraction matches e.g. drive.google.com/drive/folders/FILE_ID or drive.google.com/file/d/FILE_ID
    const folderMatch = driveUrl.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    const fileMatch = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const id = (folderMatch && folderMatch[1]) || (fileMatch && fileMatch[1]);
    
    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w300`;
    }
    return null;
  };

  // Extract color & size lists for filters
  const tallas = Array.from(new Set(products.map(p => String(p.talla))));
  const colores = Array.from(new Set(products.map(p => p.color)));

  // Filtered Products for Autocomplete dropdown
  const filteredProducts = products.filter(p => {
    const matchesCat = filterCat === "Todos" || p.categoria === filterCat;
    const matchesTalla = filterTalla === "Todos" || String(p.talla) === filterTalla;
    const matchesColor = filterColor === "Todos" || p.color.toLowerCase() === filterColor.toLowerCase();
    const matchesSearch = p.sku.toLowerCase().includes(skuSearch.toLowerCase()) || 
                          p.nombre_producto.toLowerCase().includes(skuSearch.toLowerCase());
    return matchesCat && matchesTalla && matchesColor && matchesSearch;
  });

  // Filtered Clients for Autocomplete dropdown
  const filteredClients = clients.filter(c => {
    return c.nombre.toLowerCase().includes(clientSearch.toLowerCase()) || 
           c.whatsapp.includes(clientSearch) ||
           c.id_cliente.toLowerCase().includes(clientSearch.toLowerCase());
  });

  // Calculate prices and validate stock when SKU or quantity shifts
  useEffect(() => {
    if (selectedSku) {
      const prod = products.find(p => p.sku === selectedSku);
      if (prod) {
        setSelectedProductId(prod);
        setPrecioFinal(prod.precio_venta_referencia);
        
        if (!esDevolucion && prod.stock_disponible < cantidad) {
          setStockError(`Stock insuficiente. Disponibles únicamente ${prod.stock_disponible} unidades.`);
        } else {
          setStockError("");
        }
      }
    } else {
      setSelectedProductId(null);
      setPrecioFinal(0);
      setStockError("");
    }
  }, [selectedSku, cantidad, esDevolucion, products]);

  // Check attribution warnings (Meta/TikTok sources mandate Campaign ID placement)
  useEffect(() => {
    const isPaidSource = fuenteTrafico === "Meta Ads" || fuenteTrafico === "TikTok Ads" || fuenteTrafico === "TikTok Live" || fuenteTrafico.includes("Meta");
    const hasAttribution = idContenido !== "";
    
    if (isPaidSource && !hasAttribution && fuenteTrafico !== "") {
      setAtribucionWarning(true);
    } else {
      setAtribucionWarning(false);
    }
  }, [fuenteTrafico, idContenido]);

  // Handle client selection
  const handleSelectClient = (c: ClientType) => {
    setSelectedClientId(c.id_cliente);
    setSelectedClient(c);
    setFuenteTrafico(c.fuente_adquisicion);
    setClientSearch(c.nombre);
  };

  // Submit Sale Handler
  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSku) {
      setErrorMsg("Debe seleccionar un producto (SKU).");
      return;
    }
    if (!selectedClientId) {
      setErrorMsg("Debe seleccionar un cliente del CRM.");
      return;
    }
    if (stockError && !esDevolucion) {
      setErrorMsg("No se puede completar el registro por falta de stock.");
      return;
    }

    const payload = {
      sku: selectedSku,
      id_cliente: selectedClientId,
      id_contenido: idContenido || null,
      cantidad: esDevolucion ? -Math.abs(cantidad) : Math.abs(cantidad),
      ingreso_bruto: esDevolucion ? -Math.abs(precioFinal * cantidad) : Math.abs(precioFinal * cantidad),
      canal_venta: canalVenta,
      fuente_trafico: fuenteTrafico || "Directo",
      estado_entrega: selectedClient?.estado || "No Registrado",
      municipio_entrega: selectedClient?.municipio || "No Registrado",
      es_devolucion: esDevolucion,
      origen_atribucion: (atribucionWarning && origenAtribucion) ? origenAtribucion : undefined
    };

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await onAddSale(payload);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg(`¡Venta registrada exitosamente! Código: ${res.venta.id_venta}. Stock restante: ${res.stock_disponible}`);
        // Reset form except channel
        setSelectedSku("");
        setCantidad(1);
        setPrecioFinal(0);
        setIdContenido("");
        setOrigenAtribucion("");
        setEsDevolucion(false);
        setSkuSearch("");
        setClientSearch("");
        setSelectedClient(null);
        setSelectedClientId("");
        refreshData();
      }
    } catch (err: any) {
      setErrorMsg("Fallo al conectar con el servidor: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe client registration helper
  const handleCreateClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientPhone) {
      alert("Ingrese nombre y teléfono celular.");
      return;
    }

    const payload = {
      nombre: newClientName,
      whatsapp: newClientPhone,
      genero: newClientGender,
      edad: Number(newClientAge),
      estado: newClientState,
      municipio: newClientMunicipio,
      fuente_adquisicion: newClientSource,
      gusto_categoria: newClientCat,
      gusto_subcategoria: newClientSub,
      estilo_preferido: newClientStyle || "Estilo general",
      canal_preferido_compra: newClientPreferredChannel,
      intereses_clave: newClientInterests || "Ninguno"
    };

    try {
      const cl = await onAddClient(payload);
      if (cl && cl.cliente) {
        handleSelectClient(cl.cliente);
        setShowClientModal(false);
        // Reset fields
        setNewClientName("");
        setNewClientPhone("");
        setNewClientStyle("");
        setNewClientInterests("");
        refreshData();
      }
    } catch (error: any) {
      alert("Error al guardar cliente: " + error.message);
    }
  };

  // WhatsApp Preformatted Link Composer
  const handleCopyWhatsApp = () => {
    if (!selectedProductId) {
      alert("Seleccione un producto para copiar detalles.");
      return;
    }
    const txt = `✨ *Sistema KICKS - Catálogo de Calzado y Textil* \n\n` +
          `Tenemos disponible a la orden el producto:\n` +
          `👟 *${selectedProductId.nombre_producto}*\n` +
          `• *SKU:* ${selectedProductId.sku}\n` +
          `• *Categoría:* ${selectedProductId.categoria} (${selectedProductId.subcategoria})\n` +
          `• *Talla:* ${selectedProductId.talla}\n` +
          `• *Color:* ${selectedProductId.color}\n` +
          `• *Precio de Referencia:* $${selectedProductId.precio_venta_referencia}\n` +
          `• *Almacén:* ${selectedProductId.almacen}\n\n` +
          `Si requiere imágenes de Drive, acceda acá:\n` +
          `${selectedProductId.url_carpeta_drive || "Consulte con el operador vía chat."}\n\n` +
          `¿Le gustaría que lo apartemos en su talla?`;
    
    navigator.clipboard.writeText(txt);
    alert("¡Enlace de WhatsApp copiado al portapapeles con éxito!");
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
            Registro de Ventas
          </h1>
          <p className="text-sm text-gray-500">
            Sustitución de bitácora manual en papel. Operaciones con atribución publicitaria y control de stock.
          </p>
        </div>
        
        {/* Toggle refund button */}
        <button
          onClick={() => setEsDevolucion(!esDevolucion)}
          className={`flex items-center gap-2 px-6 py-2 rounded-sm font-mono text-xs font-bold uppercase tracking-widest transition-all ${
            esDevolucion 
              ? "bg-[#E74C3C] text-gray-900 border border-[#E74C3C] shadow-lg" 
              : "bg-transparent text-[#FCD901] hover:bg-[#FCD901] hover:text-[#0A0A0A] border border-[#FCD901]/20"
          }`}
          id="toggle-return-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${esDevolucion ? 'animate-spin' : ''}`} />
          {esDevolucion ? "DEVOLUCIÓN: EN CURSO" : "PROCESAR DEVOLUCIÓN"}
        </button>
      </div>

      {/* Success/Error displays */}
      {successMsg && (
        <div className="p-4 bg-[#193F2B]/40 border-l-4 border-emerald-500 rounded-sm flex items-center gap-3 animate-fade-in" id="success-alert">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm text-emerald-100 font-mono">{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-[#4A1D19]/40 border-l-4 border-rose-600 rounded-sm flex items-center gap-3" id="error-alert">
          <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
          <span className="text-sm text-rose-100 font-mono">{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form Panel */}
        <form onSubmit={handleSubmitSale} className="lg:col-span-2 bg-white border border-gray-200 rounded-sm p-6 space-y-6 relative overflow-hidden">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#FCD901] border-b border-gray-200 pb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-[#FCD901]" />
            {esDevolucion ? "SOLICITUD DE DEVOLUCIÓN DE MERCANCÍA" : "NUEVA VENTA REGISTRADA"}
          </h2>

          {/* CRM Client Input Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold text-gray-700">CLIENTE DEL CRM (WHATSAPP/NOMBRE)</label>
              <button
                type="button"
                id="quick-create-client-btn"
                onClick={() => setShowClientModal(true)}
                className="text-xs font-mono text-[#FCD901] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Crear Nuevo Cliente
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  if (selectedClientId) {
                    setSelectedClientId("");
                    setSelectedClient(null);
                  }
                }}
                placeholder="Buscar cliente por nombre o teléfono whatsapp..."
                className="w-full bg-white text-gray-900 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FCD901]/20 font-mono"
              />
              
              {/* Autocomplete List */}
              {!selectedClientId && clientSearch.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#FDFDFD] border border-gray-200 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(c => (
                      <button
                        key={c.id_cliente}
                        type="button"
                        onClick={() => handleSelectClient(c)}
                        className="w-full text-left px-4 py-3 border-b border-[#1F1F1F] hover:bg-white transition-colors flex justify-between items-center text-xs"
                      >
                        <div className="font-mono">
                          <span className="font-bold text-gray-900 text-sm">{c.nombre}</span> <span className="text-gray-500">({c.whatsapp})</span>
                        </div>
                        <div className="text-[#FCD901] font-mono text-[10px]">{c.id_cliente} - {c.estado}</div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs font-mono text-gray-500 text-center">Falta registro. Use el botón anterior para registrarlo rápido.</div>
                  )}
                </div>
              )}
            </div>

            {selectedClient && (
              <div className="p-3 bg-[#FDFDFD] rounded-lg border border-gray-200 flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono text-gray-500">
                <div><span className="text-gray-500">Ubicación:</span> {selectedClient.estado} - {selectedClient.municipio}</div>
                <div><span className="text-gray-500">Canal Preferido:</span> {selectedClient.canal_preferido_compra}</div>
                <div><span className="text-gray-500">Moda favorita:</span> {selectedClient.gusto_categoria} ({selectedClient.gusto_subcategoria})</div>
                <div><span className="text-gray-500">Adquisición:</span> <span className="text-[#C5A059] font-bold">{selectedClient.fuente_adquisicion}</span></div>
              </div>
            )}
          </div>

          {/* Autocomplete SKU Product Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-700">PRODUCTO / SKU REFERENCIA</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todos">Todas Categorías</option>
                <option value="Calzado">Calzado</option>
                <option value="Textil">Textil</option>
              </select>
              <select
                value={filterTalla}
                onChange={(e) => setFilterTalla(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todos">Todas Tallas</option>
                {tallas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select
                value={filterColor}
                onChange={(e) => setFilterColor(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todos">Todos Colores</option>
                {colores.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={skuSearch}
                onChange={(e) => {
                  setSkuSearch(e.target.value);
                  if (selectedSku) {
                    setSelectedSku("");
                  }
                }}
                placeholder="Escriba SKU o nombre del calzado..."
                className="w-full bg-white text-gray-900 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FCD901]/20 font-mono"
              />

              {/* Autocomplete Dropdown */}
              {!selectedSku && skuSearch.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-[#FDFDFD] border border-gray-200 rounded-lg max-h-48 overflow-y-auto shadow-2xl">
                  {filteredProducts.map(p => (
                    <button
                      key={p.sku}
                      type="button"
                      onClick={() => {
                        setSelectedSku(p.sku);
                        setSkuSearch(p.sku);
                      }}
                      className="w-full text-left px-4 py-2.5 border-b border-[#1F1F1F] hover:bg-white transition-colors flex justify-between items-center text-xs font-mono"
                    >
                      <div>
                        <span className="font-bold text-gray-900 block">[{p.marca || "Zeta"}] {p.nombre_producto}</span>
                        <span className="text-gray-500 font-mono">{p.sku}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[#FCD901] font-bold block">${p.precio_venta_referencia}</span>
                        <span className={`text-[10px] ${p.stock_disponible < 5 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>Stock: {p.stock_disponible}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Error if stock limits hit */}
            {stockError && (
              <div className="text-red-500 text-xs font-mono flex items-center gap-1.5 mt-1 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                {stockError}
              </div>
            )}
          </div>

          {/* Quantity and Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-700">CANTIDAD</label>
              <input
                type="number"
                min="1"
                required
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="w-full bg-white text-gray-900 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-700 flex items-center justify-between">
                PRECIO UNITARIO ACORDADO ($)
                {selectedProductId && precioFinal !== selectedProductId.precio_venta_referencia && (
                  <span className="text-[10px] text-[#FCD901] uppercase">Venta a precio diferente</span>
                )}
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={precioFinal}
                onChange={(e) => setPrecioFinal(Number(e.target.value))}
                className="w-full bg-white text-[#FCD901] px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#FCD901]/20"
              />
            </div>
          </div>

          {/* Channel and Attribution Source */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-700">CANAL DE CONTROL DE VENTA</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-1 bg-white p-1 rounded-lg border border-gray-200">
                {(['WhatsApp', 'Instagram', 'Facebook', 'TikTok', 'Tienda Virtual'] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setCanalVenta(ch)}
                    className={`py-1.5 rounded font-mono text-[10px] transition-all capitalize ${
                      canalVenta === ch 
                        ? "bg-[#FCD901] text-[#0A0A0A] font-bold" 
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono font-bold text-gray-700">FUENTE DE TRÁFICO</label>
              <select
                value={fuenteTrafico}
                onChange={(e) => setFuenteTrafico(e.target.value)}
                className="w-full bg-white text-gray-900 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none"
              >
                <option value="">-- Autodetectar --</option>
                <option value="Meta Ads">Meta Ads (Instagram/Facebook)</option>
                <option value="TikTok Orgánico">TikTok Orgánico</option>
                <option value="TikTok Live">TikTok Live</option>
                <option value="Referido">Referido de Cliente</option>
                <option value="Otro">Otro / Tráfico Orgánico Local</option>
              </select>
            </div>
          </div>

          {/* Creative Campaign Attribution Picker */}
          <div className="space-y-2 border-t border-gray-200 pt-4">
            <label className="text-xs font-mono font-bold text-gray-700">CREATIVO / CAMPAÑA ATRIBUIDA</label>
            <select
              value={idContenido}
              onChange={(e) => setIdContenido(e.target.value)}
              className="w-full bg-white text-gray-900 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#FCD901]/20"
            >
              <option value="">-- Ninguno (Tráfico Orgánico / No Atribuible) --</option>
              {creatives.map(cr => (
                <option key={cr.id_contenido} value={cr.id_contenido}>
                  [{cr.plataforma}] {cr.nombre_campana} ({cr.id_contenido})
                </option>
              ))}
            </select>

            {/* Warning if source is paid Meta Ads / TikTok without creative selection */}
            {atribucionWarning && (
              <div className="p-3 bg-[#4A3219] border border-[#8C5D1E] rounded-lg space-y-2 animate-fade-in">
                <div className="flex gap-2 items-center text-xs text-[#EABE7C] font-mono font-bold">
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Advertencia de Atribución Publicitaria (Power BI)</span>
                </div>
                <p className="text-[11px] text-orange-200 font-mono">
                  Indicó que el tráfico provino de <span className="font-bold">{fuenteTrafico}</span> pero no detalló qué Creativo (ID) generó la compra. Agregue Origen de Atribución alternativo abajo para guardar un respaldo:
                </p>
                <input
                  type="text"
                  value={origenAtribucion}
                  onChange={(e) => setOrigenAtribucion(e.target.value)}
                  placeholder="Ej: Historia de Influencer, Grupo de Whatsapp, Origen manual..."
                  className="w-full bg-white text-gray-900 px-3 py-1.5 border border-[#8C5D1E] rounded text-xs font-mono focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
            <div className="text-xs font-mono">
              <span className="text-gray-500">Monto Neto Estimado: </span>
              <span className={`text-lg font-bold ${esDevolucion ? 'text-red-500' : 'text-emerald-600'}`}>
                {esDevolucion ? "-" : ""}${ (cantidad * precioFinal).toFixed(2) }
              </span>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || (stockError && !esDevolucion)}
              className={`px-6 py-2.5 rounded-lg font-mono text-xs font-bold tracking-widest uppercase transition-all ${
                esDevolucion 
                  ? "bg-[#E74C3C] hover:bg-red-600 text-white shadow-md cursor-pointer" 
                  : "bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] font-bold cursor-pointer"
              } ${(stockError && !esDevolucion) ? "opacity-40 cursor-not-allowed" : ""}`}
              id="submit-sale-btn"
            >
              {isLoading ? "Procesando..." : esDevolucion ? "Confirmar Devolución" : "Registrar Venta"}
            </button>
          </div>
        </form>

        {/* Product Card Thumbnail Sidebar */}
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 flex flex-col justify-between">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase">Detalle del Calzado / Drive Image</h3>
            
            {selectedProductId ? (
              <div className="space-y-4 font-mono text-xs text-gray-500">
                {/* Image extraction */}
                {getDriveThumbnail(selectedProductId.url_carpeta_drive) ? (
                  <img
                    src={getDriveThumbnail(selectedProductId.url_carpeta_drive) as string}
                    alt={selectedProductId.nombre_producto}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-square object-cover rounded bg-[#FDFDFD] border border-gray-200"
                  />
                ) : (
                  <div className="w-full aspect-square bg-white rounded border border-gray-200 border-dashed flex flex-col items-center justify-center p-4 text-center">
                    <Smartphone className="w-10 h-10 text-gray-600 mb-2" />
                    <span>Sin Enlace de Foto Drive configurado</span>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-gray-900 font-sans tracking-tight">[{selectedProductId.marca || "Zeta"}] {selectedProductId.nombre_producto}</h4>
                  <p className="text-[10px] text-gray-500 mt-1">Almacén: {selectedProductId.almacen}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                  <div>
                    <span className="text-gray-500 block">Categoría</span>
                    <span className="text-gray-900 font-bold">{selectedProductId.categoria}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Talla / Color</span>
                    <span className="text-gray-900 font-bold">{selectedProductId.talla} / {selectedProductId.color}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-gray-200 pt-2">
                  <div>
                    <span className="text-gray-500 block">Disponibles</span>
                    <span className={`font-bold ${selectedProductId.stock_disponible < 5 ? "text-red-500" : "text-emerald-600"}`}>
                      {selectedProductId.stock_disponible} unid.
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Referencia</span>
                    <span className="text-gray-900 font-bold">${selectedProductId.precio_venta_referencia}</span>
                  </div>
                </div>

                {/* Copiar Whatsapp format */}
                <button
                  type="button"
                  id="whatsapp-share-btn"
                  onClick={handleCopyWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-[#2ECC71]/10 text-[#2ECC71] hover:bg-[#2ECC71]/20 py-2.5 rounded-lg border border-[#2ECC71]/30 transition-all text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Enlace WhatsApp
                </button>
              </div>
            ) : (
              <div className="font-mono text-center py-12 text-gray-500 text-xs text-dashed border border-gray-200 rounded-lg">
                <Info className="w-6 h-6 mx-auto text-gray-600 mb-2" />
                Ningún SKU seleccionado. Autocomplete un producto para ver Drive pics y copiar mensaje comercial.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SECCIÓN REGISTRO HISTÓRICO DE VENTAS (MÓDULO DE CONSULTAS) */}
      <div className="bg-[#FDFDFD] border border-[#222222] rounded-xl p-6 mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-[#222222]">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="p-1.5 bg-[#FCD901]/10 text-[#FCD901] rounded border border-[#FCD901]/20 text-xs">LOG</span>
              Bitácora Histórica de Ventas
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Todos los pedidos facturados y registrados en el sistema, ordenados por fecha de forma descendente.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por SKU, Venta, Cliente o Ad..."
                value={salesSearch}
                onChange={(e) => setSalesSearch(e.target.value)}
                className="w-full sm:w-64 bg-white text-gray-900 placeholder-gray-650 pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#FCD901]/50"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            
            {/* Filtrar Canal */}
            <select
              value={salesChannelFilter}
              onChange={(e) => setSalesChannelFilter(e.target.value)}
              className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#FCD901]/50"
            >
              <option value="Todos">Todos los Canales</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="Tienda Virtual">Tienda Virtual</option>
            </select>
          </div>
        </div>

        {filteredSalesHistory.length === 0 ? (
          <div className="text-center py-10 font-mono text-xs text-gray-500 border border-dashed border-gray-200 rounded-lg">
            No se encontraron transacciones registradas que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-[#FDFDFD]">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead>
                <tr className="bg-[#151515] text-[#FCD901] border-b border-gray-200 whitespace-nowrap">
                  <th className="p-3 font-semibold uppercase tracking-wider">ID Venta</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Fecha</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Cliente</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">SKU & Detalle</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-center">Cant</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Canal</th>
                  <th className="p-3 font-semibold uppercase tracking-wider">Camp Publicitaria</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-right">Facturación</th>
                  <th className="p-3 font-semibold uppercase tracking-wider text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e1e]">
                {filteredSalesHistory.map((sale) => {
                  const client = clients.find(c => c.id_cliente === sale.id_cliente);
                  const pDetails = products.find(p => p.sku === sale.sku);
                  return (
                    <tr 
                      key={`${sale.id_venta}-${sale.sku}`} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-3 font-bold text-gray-900 group-hover:text-[#FCD901] transition-colors">{sale.id_venta}</td>
                      <td className="p-3 text-gray-500 font-mono text-[10px] whitespace-nowrap">{sale.fecha_venta}</td>
                      <td className="p-3">
                        <div className="font-semibold text-gray-900 leading-tight">
                          {client ? client.nombre : <span className="text-gray-500 font-normal">No Definido</span>}
                        </div>
                        <div className="text-[10px] text-gray-500 font-mono">{client?.whatsapp || "Sin número"}</div>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-gray-900 leading-tight text-xs">{pDetails?.nombre_producto || "Detalle No Cargado"}</p>
                        <p className="text-[10px] text-[#A0A0A0] font-mono mt-0.5 select-all" title="Copiar SKU">
                          {sale.sku} {pDetails && pDetails.color && `• ${pDetails.color} (${pDetails.talla})`}
                        </p>
                      </td>
                      <td className="p-3 text-center font-bold text-gray-900">{sale.cantidad}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          sale.canal_venta === 'WhatsApp' 
                            ? "bg-emerald-950/40 text-emerald-600 border-emerald-500/15" 
                            : sale.canal_venta === 'Instagram'
                            ? "bg-pink-950/40 text-pink-400 border-pink-500/15"
                            : sale.canal_venta === 'Facebook'
                            ? "bg-blue-950/40 text-blue-600 border-blue-500/15"
                            : sale.canal_venta === 'TikTok'
                            ? "bg-white text-[#00f2fe] border-indigo-500/15"
                            : "bg-amber-950/40 text-amber-400 border-amber-500/15"
                        }`}>
                          {sale.canal_venta}
                        </span>
                      </td>
                      <td className="p-3">
                        {sale.id_contenido ? (
                          <div className="max-w-[140px] truncate">
                            <span className="text-gray-700 font-semibold underline decoration-white/10 hover:text-[#FCD901] cursor-help" title={`ID Campaña: ${sale.id_contenido}`}>
                              {sale.id_contenido}
                            </span>
                            <span className="text-[9px] text-[#888] font-mono block truncate">{sale.fuente_trafico || "Redes sociales"}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 select-none">Atribución Orgánica</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span className={`font-bold text-xs ${sale.es_devolucion ? 'text-red-400' : 'text-emerald-600'}`}>
                          {sale.es_devolucion ? '-' : ''}${sale.ingreso_bruto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <div className="text-[9px] text-gray-500 font-mono">Costo Adq: ${sale.costo_total.toLocaleString("en-US", { maximumFractionDigits: 1 })}</div>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {sale.es_devolucion ? (
                          <span className="bg-red-950/40 text-red-400 border border-red-500/15 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Devolución
                          </span>
                        ) : (
                          <span className="bg-emerald-950/40 text-emerald-600 border border-emerald-500/15 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                            Venta Efectiva
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between items-center mt-4 text-[10px] font-mono text-gray-500">
          <span>Total: {sales.length} transacciones unificadas en base de datos.</span>
          <span>Filtro activo: {filteredSalesHistory.length} registros listados.</span>
        </div>
      </div>

      {/* QUICK CLIENT EXTRA REGISTRATION MODAL */}
      {showClientModal && (
        <div className="fixed inset-0 bg-[#FDFDFD] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFDFD] border border-gray-200 rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center">
              <h3 className="font-sans text-lg font-bold text-[#FCD901] tracking-wider uppercase">Registrar Nuevo Cliente en CRM</h3>
              <button 
                onClick={() => setShowClientModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClientSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ej: María Coromoto"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Celular WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="Ej: +584141234567"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Edad</label>
                  <input
                    type="number"
                    min="1"
                    max="110"
                    value={newClientAge}
                    onChange={(e) => setNewClientAge(Number(e.target.value))}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Género</label>
                  <select
                    value={newClientGender}
                    onChange={(e: any) => setNewClientGender(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Canal Adquirente</label>
                  <select
                    value={newClientSource}
                    onChange={(e: any) => setNewClientSource(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="TikTok Orgánico">TikTok Orgánico</option>
                    <option value="TikTok Live">TikTok Live</option>
                    <option value="Referido">Referido</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Estado de Venezuela</label>
                  <input
                    type="text"
                    value={newClientState}
                    onChange={(e) => setNewClientState(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Municipio</label>
                  <input
                    type="text"
                    value={newClientMunicipio}
                    onChange={(e) => setNewClientMunicipio(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Gusto Mayoritario</label>
                  <select
                    value={newClientCat}
                    onChange={(e: any) => setNewClientCat(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  >
                    <option value="Calzado">Calzado</option>
                    <option value="Textil">Textil</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Línea/Subcategoría</label>
                  <input
                    type="text"
                    value={newClientSub}
                    onChange={(e) => setNewClientSub(e.target.value)}
                    placeholder="Ej: Casual"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Estilo Preferido & Intereses</label>
                <input
                  type="text"
                  value={newClientStyle}
                  onChange={(e) => setNewClientStyle(e.target.value)}
                  placeholder="Ej: Tacones de gamuza de noche"
                  className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 bg-transparent border border-gray-200 rounded text-gray-500 text-xs font-mono hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] font-bold rounded text-xs font-mono"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple internal icon mapper
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
