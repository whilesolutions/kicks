/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart, 
  Upload, 
  Edit2, 
  Trash, 
  Check, 
  DollarSign, 
  RefreshCw, 
  TrendingUp, 
  Flame, 
  Heart,
  Grid
} from "lucide-react";
import { CreativeType, SaleType, MarketingMetricType, ProductType } from "../types";

interface MarketingProps {
  creatives: CreativeType[];
  sales: SaleType[];
  marketingMetrics: MarketingMetricType[];
  products: ProductType[];
  onUploadCSV: (csvText: string) => Promise<any>;
  onUpdateCreative: (id: string, payload: any) => Promise<any>;
  refreshData: () => void;
}

export default function Marketing({ 
  creatives, 
  sales, 
  marketingMetrics, 
  products,
  onUploadCSV, 
  onUpdateCreative,
  refreshData 
}: MarketingProps) {
  // Parsing State
  const [dragActive, setDragActive] = useState(false);
  const [pastedCSV, setPastedCSV] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // Filters State
  const [platformFilter, setPlatformFilter] = useState("Todas");
  const [startDate, setStartDate] = useState("2026-05-01");
  const [endDate, setEndDate] = useState("2026-06-30");

  // Inline editing State
  const [editingCreativeId, setEditingCreativeId] = useState<string | null>(null);
  const [editingCampName, setEditingCampName] = useState("");
  const [editingSegInter, setEditingSegInter] = useState("");
  const [editingNotes, setEditingNotes] = useState("");

  // Handler for inline edits
  const handleStartEdit = (cr: CreativeType) => {
    setEditingCreativeId(cr.id_contenido);
    setEditingCampName(cr.nombre_campana);
    setEditingSegInter(cr.segmento_interno);
    setEditingNotes(cr.notas);
  };

  const handleSaveEdit = async (crId: string) => {
    try {
      await onUpdateCreative(crId, {
        nombre_campana: editingCampName,
        segmento_interno: editingSegInter,
        notas: editingNotes
      });
      setEditingCreativeId(null);
      refreshData();
    } catch (err: any) {
      alert("Error al editar creativo: " + err.message);
    }
  };

  // Parser helper
  const handleCSVUploadSubmit = async (text: string) => {
    if (!text || !text.trim()) {
      alert("Ingrese datos en el área de pegado");
      return;
    }
    setUploadStatus("Procesando...");
    try {
      const res = await onUploadCSV(text);
      setUploadStatus(`¡Sincronizado! ${res.filas_procesadas} líneas de métricas integradas mediante UPSERT.`);
      setPastedCSV("");
      refreshData();
    } catch (err: any) {
      setUploadStatus("Error: " + err.message);
    }
  };

  // Drag Event Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCSVUploadSubmit(event.target.result as string);
        }
      };
      reader.readAsText(file);
    }
  };

  // FILTERED METRICS AND SALES FOR PRE-POWER BI CALCS
  const filteredMetrics = marketingMetrics.filter(m => {
    const matchesPlatform = platformFilter === "Todas" || m.plataforma === platformFilter;
    const matchesDate = m.fecha >= startDate && m.fecha <= endDate;
    return matchesPlatform && matchesDate;
  });

  const filteredSales = sales.filter(s => {
    const matchesDate = s.fecha_venta >= startDate && s.fecha_venta <= endDate;
    return matchesDate;
  });

  // KPI 1: Ventas del rango
  const totalSalesRevenue = filteredSales.reduce((acc, s) => acc + s.ingreso_bruto, 0);

  // KPI 2: ROAS Promedio
  // ROAS = (Conversion value / marketing Spend)
  const totalSpend = filteredMetrics.reduce((acc, m) => acc + m.gasto, 0);
  const totalAttrValue = filteredMetrics.reduce((acc, m) => acc + m.valor_conversion_pixel, 0);
  const roas = totalSpend > 0 ? Number((totalAttrValue / totalSpend).toFixed(2)) : 0;

  // KPI 3: Hook Rate promedio (reproducciones_video_3s / impresiones) * 100
  const totalImpressions = filteredMetrics.reduce((acc, m) => acc + m.impresiones, 0);
  const totalHookViews = filteredMetrics.reduce((acc, m) => acc + m.reproducciones_video_3s, 0);
  const hookRate = totalImpressions > 0 ? Number(((totalHookViews / totalImpressions) * 100).toFixed(1)) : 0;

  // KPI 4: Talla más vendida (Moda)
  const tallaCounts: { [key: string]: number } = {};
  filteredSales.forEach(s => {
    const prod = products.find(p => p.sku === s.sku);
    if (prod && !s.es_devolucion) {
      tallaCounts[prod.talla] = (tallaCounts[prod.talla] || 0) + s.cantidad;
    }
  });
  let mostSoldTalla = "N/A";
  let maxTallaCount = 0;
  Object.entries(tallaCounts).forEach(([talla, count]) => {
    if (count > maxTallaCount) {
      maxTallaCount = count;
      mostSoldTalla = talla;
    }
  });

  // CHART 1: Top 5 Colors Sold (Ingresos)
  const colorRevenues: { [key: string]: number } = {};
  filteredSales.forEach(s => {
    const prod = products.find(p => p.sku === s.sku);
    if (prod) {
      colorRevenues[prod.color] = (colorRevenues[prod.color] || 0) + s.ingreso_bruto;
    }
  });
  const topColorsData = Object.entries(colorRevenues)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 5);

  const maxColorRevenue = topColorsData.length > 0 ? topColorsData[0][1] : 1;

  // MATRIX: Format vs Talla (Ingresos)
  const formatsList = ["Reel", "Video Feed", "Estático", "Carrusel", "Live Shopping"];
  const tallasList = ["36", "38", "40", "42", "M", "S"];
  
  // Pivot calculations
  const matrixData: { [key: string]: number } = {};
  filteredSales.forEach(s => {
    if (s.id_contenido) {
      const creativo = creatives.find(c => c.id_contenido === s.id_contenido);
      const prod = products.find(p => p.sku === s.sku);
      if (creativo && prod) {
        const key = `${creativo.formato}_${prod.talla}`;
        matrixData[key] = (matrixData[key] || 0) + s.ingreso_bruto;
      }
    }
  });

  // Table: Hook Rate por Estilo Narrativo
  const narrativeStyles = ["Hablado", "Sin voz", "Música+texto", "Tranquilo/ASMR", "Enérgico"];
  const hookRateByNarrative = narrativeStyles.map(style => {
    const matchCreatives = creatives.filter(c => c.estilo_narrativo === style).map(c => c.id_contenido);
    const relatedMetrics = filteredMetrics.filter(m => matchCreatives.includes(m.id_contenido));
    
    const imps = relatedMetrics.reduce((acc, m) => acc + m.impresiones, 0);
    const hooks = relatedMetrics.reduce((acc, m) => acc + m.reproducciones_video_3s, 0);
    const rate = imps > 0 ? ((hooks / imps) * 100).toFixed(1) : "0.0";
    const spendOnStyle = relatedMetrics.reduce((acc, m) => acc + m.gasto, 0);

    return { style, rate, spendOnStyle };
  });

  return (
    <div className="space-y-6">
      
      {/* Editorial Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
          Marketing & Retorno (ROI)
        </h1>
        <p className="text-sm text-gray-500">
          Panel de control previo a Power BI. Registre pautas de Meta publicadas y asigne atribución con las ventas reales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Performance Dashboard & KPIs */}
        <div className="lg:col-span-2 space-y-6">

          {/* Sindicación de Filtros Temporal / Sambil */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-xs font-mono font-bold text-gray-700 uppercase shrink-0">Filtrado del Dashboard:</span>
            
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todas">Plataformas (Todas)</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="TikTok Orgánico">TikTok Orgánico</option>
                <option value="TikTok Live">TikTok Live</option>
              </select>

              <div className="flex items-center gap-1 font-mono text-xs text-gray-500">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white text-gray-900 px-2 py-1.5 border border-gray-200 rounded focus:outline-none"
                />
                <span>a</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white text-gray-900 px-2 py-1.5 border border-gray-200 rounded focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4 Cards KPI pre-PowerBI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-gray-200 rounded-sm p-4 font-mono">
              <span className="text-[10px] text-gray-500 uppercase block font-bold leading-none mb-1.5">VENTAS DEL DÍA/RANGO</span>
              <span className="text-gray-900 text-lg font-bold block">${totalSalesRevenue.toFixed(2)}</span>
              <span className="text-[9px] text-[#2ECC71] mt-1 block">Bruto Recaudado</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 font-mono">
              <span className="text-[10px] text-gray-500 uppercase block font-bold leading-none mb-1.5">RETORNO AD ROAS</span>
              <span className="text-[#FCD901] text-lg font-bold block">{roas}x</span>
              <span className="text-[9px] text-gray-500 mt-1 block">Ref. Pixel de Compra</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 font-mono">
              <span className="text-[10px] text-gray-500 uppercase block font-bold leading-none mb-1.5">HOOK RATE MEDIO</span>
              <span className="text-gray-900 text-lg font-bold block">{hookRate}%</span>
              <span className="text-[9px] text-yellow-500 mt-1 block">Retención pauta 3s</span>
            </div>

            <div className="bg-white border border-gray-200 rounded-sm p-4 font-mono">
              <span className="text-[10px] text-gray-500 uppercase block font-bold leading-none mb-1.5">HORMA / TALLA LÍDER</span>
              <span className="text-[#3498DB] text-lg font-bold block">{mostSoldTalla}</span>
              <span className="text-[9px] text-gray-500 mt-1 block">Horma más demandada</span>
            </div>

          </div>

          {/* Dynamic SVG Chart 1 - Top 5 Colors */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 pb-2 border-b border-gray-200">
              <BarChart className="w-4 h-4 text-[#FCD901]" /> Gráfico: Top 5 de Colores de Calzado Vendidos (Ingresos)
            </h3>

            {topColorsData.length > 0 ? (
              <div className="space-y-4 pt-2">
                {topColorsData.map(([color, rev], i) => {
                  const percentage = (rev / maxColorRevenue) * 100;
                  return (
                    <div key={color} className="font-mono text-xs space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-gray-900 uppercase">{i+1}. {color}</span>
                        <span className="text-[#FCD901] font-bold">${rev.toFixed(2)} USD</span>
                      </div>
                      
                      {/* Interactive Bar */}
                      <div className="w-full h-3 bg-[#FDFDFD] rounded overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#C5A059] to-[#aef527] rounded transition-all duration-505"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 font-mono text-xs">No se registran ventas para pintar gráficos en esta fecha.</div>
            )}
          </div>

          {/* Matrix Heatmap Grid */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 pb-2 border-b border-gray-200">
              <Grid className="w-4 h-4 text-[#FCD901]" /> Matriz de Calor Cruzada: Formato Creativo vs Talla (Ventas)
            </h3>
            
            <p className="text-[10px] text-gray-500 font-mono">Los valores representan los ingresos brutos en USD. Cruce ideal para planificar compras de hormas según el formato publicitario.</p>

            <div className="overflow-x-auto pt-2">
              <div className="min-w-[450px]">
                {/* Headers */}
                <div className="grid grid-cols-7 gap-1 text-[10px] font-mono font-bold text-gray-500 text-center uppercase py-2 bg-white">
                  <div>Formato</div>
                  {tallasList.map(t => <div key={t}>{t}</div>)}
                </div>

                {/* Grid values */}
                <div className="divide-y divide-[#222]">
                  {formatsList.map(fmt => (
                    <div key={fmt} className="grid grid-cols-7 gap-1 text-[10px] font-mono text-center py-1.5 items-center">
                      <div className="text-left font-bold text-gray-500 pl-2">{fmt}</div>
                      {tallasList.map(t => {
                        const val = matrixData[`${fmt}_${t}`] || 0;
                        let bgStr = "bg-transparent text-gray-600";
                        if (val > 100) bgStr = "bg-amber-950/40 text-[#FCD901] border border-[#FCD901]/35";
                        else if (val > 0) bgStr = "bg-[#FDFDFD]/40 text-gray-700 border border-gray-200";
                        
                        return (
                          <div key={t} className={`py-2 rounded font-bold ${bgStr}`}>
                            ${val}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: CSV Parser Console & Creative Table */}
        <div className="space-y-6">

          {/* Drag & Drop Parser Card */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <Upload className="w-4 h-4 text-[#FCD901]" /> Integrador de CSV de Anuncios
            </h3>

            {/* Drop Zone Box */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center font-mono text-xs transition-colors cursor-pointer ${
                dragActive 
                  ? "border-[#FCD901]/20 bg-[#FCD901]/10 text-[#0A0A0A]" 
                  : "border-gray-200 bg-[#FDFDFD] text-gray-500 hover:border-gray-600"
              }`}
            >
              <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <span className="block font-bold text-gray-700">Suelte aquí el CSV de pautas</span>
              <span className="block text-[10px] text-gray-500 mt-1">Parsea y hace UPSERT automático</span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">O pegue el texto del CSV del Administrador</span>
              <textarea
                value={pastedCSV}
                onChange={(e) => setPastedCSV(e.target.value)}
                placeholder="fecha,id_contenido,plataforma,impresiones,alcance,clics,gasto,conversiones,valor_conversion,campana,conjunto,frecuencia,mensajes,comentarios&#10;2026-05-25,META_REEL_001,Meta Ads,12000,8500,420,150.00,18,810.00,CAMP-META-01,ADSET-CALZADO,1.41,154,24"
                className="w-full h-24 bg-[#FDFDFD] text-gray-900 p-2.5 border border-gray-200 rounded-lg text-[10px] sm:text-xs font-mono focus:outline-none"
              />
              <button
                onClick={() => handleCSVUploadSubmit(pastedCSV)}
                className="w-full bg-[#FDFDFD] hover:bg-gray-50 text-[#FCD901] hover:text-gray-900 border border-[#FCD901]/20 py-2 rounded-lg font-mono text-xs font-bold uppercase transition-colors"
              >
                Procesar e Integrar Anuncios
              </button>
            </div>

            {uploadStatus && (
              <div className="p-3 bg-[#FDFDFD] border border-gray-200 rounded-lg font-mono text-[10px] text-[#FCD901] leading-normal uppercase">
                {uploadStatus}
              </div>
            )}
          </div>

          {/* Hook rate / ASMR table */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 pb-2 border-b border-gray-200">
              <Flame className="w-4 h-4 text-orange-500" /> Hook Rate promedio por Estilo Narrativo
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] text-gray-500">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase">
                    <th className="pb-2">Estilo Narrativo</th>
                    <th className="pb-2 text-center">Hook Rate %</th>
                    <th className="pb-2 text-right">Inversión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F1F1F]">
                  {hookRateByNarrative.map(row => (
                    <tr key={row.style} className="hover:bg-white">
                      <td className="py-2 text-gray-900 font-medium">{row.style}</td>
                      <td className="py-2 text-center text-[#FCD901] font-bold">{row.rate}%</td>
                      <td className="py-2 text-right text-gray-500">${row.spendOnStyle.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* IN-LINE EDITABLE CREATIVES DB TABLE */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-200">
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5">
            <Edit2 className="w-4 h-4 text-[#FCD901]" /> Catálogo de Creativos Publicitarios (`dim_creativos`)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Edición de campaña rápida en vivo</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#FDFDFD] text-gray-500 border-b border-gray-200">
                <th className="p-3">ID DE CONTENIDO</th>
                <th className="p-3">PLATAFORMA</th>
                <th className="p-3">NOMBRE DE CAMPAÑA</th>
                <th className="p-3">FORMATO / ESTILO</th>
                <th className="p-3">SEGMENTO PUBLICITADO</th>
                <th className="p-3">NOTAS INTERNAS</th>
                <th className="p-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {creatives.map(cr => {
                const isEditing = editingCreativeId === cr.id_contenido;
                return (
                  <tr key={cr.id_contenido} className="hover:bg-white text-gray-700">
                    <td className="p-3 font-bold text-gray-900 select-all">{cr.id_contenido}</td>
                    <td className="p-3 text-gray-500">{cr.plataforma}</td>
                    
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingCampName}
                          onChange={(e) => setEditingCampName(e.target.value)}
                          className="bg-white text-gray-900 px-2 py-1 text-xs font-mono border border-[#FCD901]/20 rounded w-full"
                        />
                      ) : (
                        <span className="font-sans font-semibold text-gray-900">{cr.nombre_campana}</span>
                      )}
                    </td>

                    <td className="p-3">{cr.formato} / {cr.estilo_narrativo}</td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingSegInter}
                          onChange={(e) => setEditingSegInter(e.target.value)}
                          className="bg-white text-gray-900 px-2 py-1 text-xs font-mono border border-[#FCD901]/20 rounded w-full"
                        />
                      ) : (
                        <span className="text-[#C5A059] font-bold">{cr.segmento_interno}</span>
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <textarea
                          type="text"
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          className="bg-white text-gray-900 px-2 py-1 text-xs font-mono border border-[#FCD901]/20 rounded w-full"
                        />
                      ) : (
                        <span className="text-gray-500 font-mono text-[11px] truncate block max-w-[200px]">{cr.notas}</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveEdit(cr.id_contenido)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 rounded inline-flex items-center gap-1 text-[11px]"
                        >
                          <Check className="w-3.5 h-3.5" /> Guardar
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(cr)}
                          className="text-[#FCD901] hover:underline hover:text-gray-900"
                        >
                          Editar params
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED TRACKING LISTING FOR UPLOADED MARKETING METRICS */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
        <div className="pb-2 border-b border-gray-200">
          <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5">
            Historial de Métricas y Rendimiento Publicitario (`fact_marketing`)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Resumen de pautas integradas por fecha y canal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs text-gray-700">
            <thead>
              <tr className="bg-[#FDFDFD] text-gray-500 border-b border-gray-200">
                <th className="p-3">FECHA</th>
                <th className="p-3">CREATIVO / ID</th>
                <th className="p-3">PLATAFORMA</th>
                <th className="p-3">ID CAMPAÑA</th>
                <th className="p-3">ID CONJUNTO</th>
                <th className="p-3 text-center">FRECUENCIA</th>
                <th className="p-3 text-center">IMPRESIONES</th>
                <th className="p-3 text-center">CLICS</th>
                <th className="p-3 text-center">CTR %</th>
                <th className="p-3 text-center">INVERSIÓN</th>
                <th className="p-3 text-center">CONV. (PIXEL)</th>
                <th className="p-3 text-center">MENSAJES</th>
                <th className="p-3 text-center font-bold text-[#FCD901]">HOOK RATE %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredMetrics.length === 0 ? (
                <tr>
                  <td colSpan={13} className="p-8 text-center text-gray-500 text-xs">
                    No se registran métricas cargadas en el rango seleccionado. Pruebe usando los ejemplos de pegado.
                  </td>
                </tr>
              ) : (
                filteredMetrics.map((met, i) => (
                  <tr key={`${met.fecha}_${met.id_contenido}_${i}`} className="hover:bg-white">
                    <td className="p-3 text-gray-900 font-medium whitespace-nowrap">{met.fecha}</td>
                    <td className="p-3 font-semibold text-gray-900">{met.id_contenido}</td>
                    <td className="p-3">{met.plataforma}</td>
                    <td className="p-3 text-gray-500 truncate max-w-[120px]" title={met.id_campana}>{met.id_campana || "N/A"}</td>
                    <td className="p-3 text-gray-500 truncate max-w-[120px]" title={met.id_conjunto_anuncios}>{met.id_conjunto_anuncios || "N/A"}</td>
                    <td className="p-3 text-center">{met.frecuencia ? met.frecuencia.toFixed(2) : "1.00"}</td>
                    <td className="p-3 text-center">{met.impresiones.toLocaleString()}</td>
                    <td className="p-3 text-center">{met.clics_enlace.toLocaleString()}</td>
                    <td className="p-3 text-center">{met.ctr ? met.ctr.toFixed(2) : "0.00"}%</td>
                    <td className="p-3 text-center font-bold text-gray-900">${met.gasto.toFixed(2)}</td>
                    <td className="p-3 text-center font-bold text-[#2ECC71]">{met.conversiones_pixel}</td>
                    <td className="p-3 text-center font-bold text-sky-400">{met.mensajes || 0}</td>
                    <td className="p-3 text-center font-bold text-[#FCD901]">{met.hook_rate ? met.hook_rate.toFixed(1) : "0.0"}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
