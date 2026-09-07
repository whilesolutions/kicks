/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Settings, 
  Copy, 
  Terminal, 
  Plug, 
  FileJson, 
  Eye, 
  Check 
} from "lucide-react";

export default function PowerBI() {
  const [copiedText, setCopiedText] = React.useState<string | null>(null);

  // Dynamic host lookup
  const currentHost = window.location.origin;

  const endpoints = [
    {
      id: "ventas",
      title: "1. Detalle Consolidado de Ventas JOINS",
      url: `${currentHost}/api/ventas_detalle`,
      description: "Retorna el JOIN relacional completo: fact_ventas + dim_productos + dim_clientes + dim_creativos. Soporta filtros de fecha_inicio, fecha_fin y paginación.",
      method: "GET",
      params: "?fecha_inicio=2026-05-01&fecha_fin=2026-06-30&page=1&limit=500"
    },
    {
      id: "marketing",
      title: "2. Métricas de Campañas de Marketing",
      url: `${currentHost}/api/marketing_detalle`,
      description: "Retorna el JOIN de fact_marketing + dim_creativos. Crucial para auditar CPM, CTR, Hook Rate %, clicks, impresiones y gasto total por creativo publicitado.",
      method: "GET",
      params: "?fecha_inicio=2026-05-01&fecha_fin=2026-06-30"
    },
    {
      id: "afinidad",
      title: "3. Matriz de Afinidad de Públicos",
      url: `${currentHost}/api/kpi_afinidad`,
      description: "Cruce relacional agregado (segmento_interno vs gusto_categoria) combinando gasto incurrido en Ads vs ingresos recaudados en caja para calcular ROAS de afinidad.",
      method: "GET",
      params: ""
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const powerQueryM = `let
    UrlBase = "${currentHost}/api/ventas_detalle",
    Source = Json.Document(Web.Contents(UrlBase)),
    data = Source[data],
    #"Converted to Table" = Table.FromList(data, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Expanded Column1" = Table.ExpandRecordColumn(#"Converted to Table", "Column1", 
        {"id_venta", "sku", "fecha_venta", "cantidad", "ingreso_bruto", "costo_total", "canal_venta", "fuente_trafico", "estado_entrega", "municipio_entrega", "es_devolucion", "nombre_producto", "marca_producto", "categoria_producto", "subcategoria_producto", "talla_producto", "color_producto", "id_cliente", "nombre_cliente", "grupo_edad_cliente"}, 
        {"id_venta", "sku", "fecha_venta", "cantidad", "ingreso_bruto", "costo_total", "canal_venta", "fuente_trafico", "estado_entrega", "municipio_entrega", "es_devolucion", "nombre_producto", "marca_producto", "categoria_producto", "subcategoria_producto", "talla_producto", "color_producto", "id_cliente", "nombre_cliente", "grupo_edad_cliente"}
    )
in
    #"Expanded Column1"`;

  return (
    <div className="space-y-6">
      
      {/* Editorial Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
          Sincronización Power BI
        </h1>
        <p className="text-sm text-gray-500">
          Documentación Swagger interactiva y endpoints para extracción ETL directa en la nube.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* API Endpoints Catalog */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6">
            <h3 className="text-sm font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <Plug className="w-4 h-4 text-[#FCD901]" /> Catálogo de Endpoints JSON (Swagger)
            </h3>

            <div className="space-y-6">
              {endpoints.map((ep) => (
                <div key={ep.id} className="space-y-2 p-4 bg-[#FDFDFD] border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider">{ep.title}</h4>
                    <span className="bg-[#FCD901]/10 text-[#FCD901] px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold">
                      {ep.method}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-gray-500 leading-normal">{ep.description}</p>

                  <div className="pt-2 flex items-center gap-2">
                    <div className="bg-[#FDFDFD] border border-gray-200 rounded p-2 text-[11px] font-mono text-gray-700 select-all truncate uppercase flex-1 max-w-[480px]">
                      {ep.url}{ep.params}
                    </div>
                    <button
                      onClick={() => handleCopy(`${ep.url}${ep.params}`, ep.id)}
                      className="p-2 border border-gray-200 rounded bg-[#FDFDFD] hover:bg-gray-200 text-[#FCD901] hover:text-gray-900 transition-all shrink-0 cursor-pointer"
                      title="Copiar URL al portapapeles"
                    >
                      {copiedText === ep.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* M-Code Power Query Integration Tutorial */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <Terminal className="w-4 h-4 text-[#FCD901]" /> Guía de Importación M-Code
            </h3>

            <div className="space-y-4 font-mono text-xs text-gray-500 leading-relaxed">
              <p>Siga estos pasos para automatizar la extracción ETL en su Power BI Desktop:</p>
              
              <ol className="list-decimal list-inside space-y-2 text-[11px] pl-1">
                <li>Abra Power BI Desktop.</li>
                <li>Seleccione <span className="text-gray-900 font-bold">Obtener datos</span> &gt; <span className="text-gray-900 font-bold">Consulta vacía</span>.</li>
                <li>Abra el <span className="text-gray-900 font-bold">Editor avanzado</span>.</li>
                <li>Pegue el siguiente código M de Power Query y aplique los cambios:</li>
              </ol>

              {/* Code Box */}
              <div className="relative scrollbar">
                <pre className="bg-[#FDFDFD] p-3 text-[9px] rounded-lg border border-gray-200 text-gray-700 overflow-x-auto max-h-48 leading-relaxed font-mono">
                  {powerQueryM}
                </pre>
                <button
                  onClick={() => handleCopy(powerQueryM, "mcode")}
                  className="absolute right-2 top-2 p-1.5 bg-[#FDFDFD] hover:bg-gray-200 border border-gray-200 rounded text-[#FCD901] hover:text-gray-900 transition-all cursor-pointer"
                  title="Copiar M-Code"
                >
                  {copiedText === "mcode" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3.5 bg-[#4A3219]/10 border border-[#8C5D1E]/20 text-orange-400 rounded-lg text-[10px] leading-normal uppercase">
                <span className="text-[#FCD901] block font-bold mb-1">PROTIP DE AUTO-SINCRO:</span>
                Al estar expuesto mediante una API pública, puede programar actualizaciones automáticas de caché en Power BI Service (SaaS empresarial) cada 30 minutos sin requerir gateways residenciales.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
