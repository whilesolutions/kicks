/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  FileSpreadsheet, 
  Play, 
  Check, 
  AlertCircle, 
  Info, 
  ExternalLink,
  Loader2,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function SheetsSync() {
  const [spreadsheetUrl, setSpreadsheetUrl] = React.useState("https://docs.google.com/spreadsheets/d/1JSEiJ7I-_C4Q_VnvEoSacmOBuMksUOm9ODNUYPk6bfU/edit?usp=sharing");
  const [accessToken, setAccessToken] = React.useState("");
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<string | null>(null);
  const [syncResult, setSyncResult] = React.useState<{
    success: boolean;
    message: string;
    log?: string[];
    errors?: string[];
  } | null>(null);

  const [isPushing, setIsPushing] = React.useState(false);
  const [pushResult, setPushResult] = React.useState<{
    success: boolean;
    message: string;
    log?: string[];
  } | null>(null);

  // Fetch current config when component mounts
  React.useEffect(() => {
    fetch("/api/sheets/config")
      .then(res => res.json())
      .then(data => {
        if (data.activeSpreadsheetUrl) {
          setSpreadsheetUrl(data.activeSpreadsheetUrl);
        }
      })
      .catch(err => console.error("Error cargando configuración:", err));
  }, []);

  const handleSaveConfig = async () => {
    try {
      const res = await fetch("/api/sheets/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: spreadsheetUrl })
      });
      if (res.ok) {
        setSaveStatus("Enlace guardado exitosamente");
        setTimeout(() => setSaveStatus(null), 3000);
      }
    } catch (err: any) {
      setSaveStatus("Error guardando: " + err.message);
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    setPushResult(null);
    try {
      const res = await fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: spreadsheetUrl,
          accessToken: accessToken.trim() || undefined
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setSyncResult({
          success: true,
          message: data.message,
          log: data.log,
          errors: data.errors
        });
      } else {
        setSyncResult({
          success: false,
          message: data.error || "Fallo en la sincronización de Google Sheets",
          errors: data.errors
        });
      }
    } catch (err: any) {
      setSyncResult({
        success: false,
        message: "Ocurrió un error en el servidor: " + err.message
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePush = async () => {
    if (!accessToken.trim()) {
      alert("Para exportar y escribir de vuelta en Google Sheets, es obligatorio proveer el Token de Acceso para validar su identidad en Google.");
      return;
    }
    
    const confirmPush = window.confirm(
      "¿Está seguro que desea exportar y sobrescribir sus datos en Google Sheets? Esto reemplazará el contenido actual de las pestañas en su documento con los datos in-memory del sistema KICKS."
    );
    if (!confirmPush) return;

    setIsPushing(true);
    setSyncResult(null);
    setPushResult(null);
    try {
      const res = await fetch("/api/sheets/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accessToken: accessToken.trim()
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPushResult({
          success: true,
          message: data.message,
          log: data.log
        });
      } else {
        setPushResult({
          success: false,
          message: data.error || "Fallo al exportar cambios a Google Sheets"
        });
      }
    } catch (err: any) {
      setPushResult({
        success: false,
        message: "Ocurrió un error al exportar: " + err.message
      });
    } finally {
      setIsPushing(false);
    }
  };

  // Google Sheets Schemas Reference List
  const sheetSchemas = [
    {
      tabName: "dim_productos (o 'productos')",
      description: "Base de datos maestra de calzado y accesorios.",
      headers: ["sku", "nombre_producto", "url_imagen", "descripcion", "categoria", "subcategoria", "marca", "coleccion", "genero_objetivo", "talla", "color", "precio_venta_referencia", "precio_promocion", "proveedor", "costo_proveedor", "margen_dolar", "stock_disponible", "url_carpeta_drive", "almacen"]
    },
    {
      tabName: "dim_clientes (o 'clientes')",
      description: "CRM de clientes con números de contacto y gustos.",
      headers: ["id_cliente", "nombre", "whatsapp", "genero", "edad", "estado", "municipio", "fuente_adquisicion", "gusto_categoria"]
    },
    {
      tabName: "fact_ventas (o 'ventas')",
      description: "Registro de transacciones comerciales liquidadas.",
      headers: ["id_venta", "sku", "fecha_venta", "id_cliente", "id_contenido", "cantidad", "ingreso_bruto", "costo_total", "canal_venta", "es_devolucion"]
    },
    {
      tabName: "dim_creativos (o 'creativos')",
      description: "Materiales y pautas de anuncios de Meta o TikTok.",
      headers: ["id_contenido", "plataforma", "tipo_contenido", "nombre_campana", "objetivo", "formato", "segmento_interno"]
    },
    {
      tabName: "fact_marketing (o 'marketing')",
      description: "Estadísticas publicitarias diarias extraídas de Meta Ads.",
      headers: ["fecha", "id_contenido", "impresiones", "alcance", "clics_enlace", "gasto", "conversiones_pixel", "ctr"]
    },
    {
      tabName: "fact_gastos (o 'gastos')",
      description: "Egresos fijos, variables y pagos a proveedores.",
      headers: ["fecha", "categoria", "descripcion", "monto", "proveedor_o_destino"]
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide flex items-center gap-2">
          Sincronización Google Sheets
        </h1>
        <p className="text-sm text-gray-500">
          Cargue de forma masiva y bidireccional los catálogos, registros de CRM, campañas y métricas directo desde su hoja de cálculo preferida.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Connection Form Card & Sync Status Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-6">
            <h3 className="text-sm font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <FileSpreadsheet className="w-4 h-4 text-[#0F9D58]" /> Conexión a la Hoja de Cálculo (Google Sheets)
            </h3>

            <div className="space-y-4">
              {/* Spreadsheet URL Input */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono font-bold tracking-wider text-gray-500 flex justify-between">
                  <span>Enlace del Documento de Google Sheets</span>
                  <a 
                    href={spreadsheetUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#0F9D58] hover:underline flex items-center gap-0.5 lowercase font-normal"
                  >
                    abrir documento en nueva pestaña <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={spreadsheetUrl}
                    onChange={(e) => setSpreadsheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    className="flex-1 bg-[#FDFDFD] border border-gray-200 rounded p-2.5 text-xs text-semi-black font-semibold font-sans focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
                  />
                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black border border-gray-200 rounded text-xs font-mono font-bold uppercase transition-colors"
                  >
                    Guardar
                  </button>
                </div>
                {saveStatus && (
                  <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest pt-1">
                    {saveStatus}
                  </p>
                )}
              </div>

              {/* Private Access Token (Optional) Input */}
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] uppercase font-mono font-black tracking-wider text-gray-500">
                    Token de Acceso Google OAuth (Requerido para Escribir)
                  </span>
                  <div className="group relative">
                    <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-black text-white p-2.5 rounded text-[10px] leading-normal font-mono uppercase hidden group-hover:block z-50">
                      Opcional para lectura (si el documento es público con enlace accesible), pero OBLIGATORIO para escribir de vuelta o actualizar datos desde la app a su Google Sheets.
                    </div>
                  </div>
                </div>
                <input
                  type="password"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  placeholder="Ingrese su de Token de Acceso para activar sincronia bidireccional..."
                  className="w-full bg-[#FDFDFD] border border-gray-200 rounded p-2.5 text-xs text-semi-black font-semibold font-sans focus:outline-none focus:ring-1 focus:ring-[#0F9D58]"
                />
              </div>

              {/* Main Actions Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSync}
                  disabled={isSyncing || isPushing}
                  className={`px-5 py-3.5 bg-black hover:bg-zinc-900 text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer flex-1 ${
                    isSyncing || isPushing ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isSyncing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F9D58]" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-[#0F9D58]" />
                      Sincronizar desde Sheets 🟢
                    </>
                  )}
                </button>

                <button
                  onClick={handlePush}
                  disabled={isSyncing || isPushing}
                  className={`px-5 py-3.5 bg-[#0F9D58] hover:bg-[#0b8043] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer flex-1 ${
                    isSyncing || isPushing ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-4 h-4 text-white" />
                      Guardar de vuelta a Sheets 🟢
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sync Result Console */}
          {syncResult && (
            <div className={`border rounded-sm p-6 ${
              syncResult.success 
                ? "bg-white border-[#0F9D58]/30" 
                : "bg-white border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                {syncResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-[#0F9D58] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-4 w-full">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                      {syncResult.success ? "PROCESO COMPLETADO SATISFACTORIAMENTE" : "FALLO TOTAL O PARCIAL DEL PROCESO"}
                    </h4>
                    <p className={`text-xs mt-1 ${syncResult.success ? "text-gray-600" : "text-gray-500 font-mono"}`}>
                      {syncResult.message}
                    </p>
                  </div>

                  {/* Log entries */}
                  {syncResult.log && syncResult.log.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                        LOG DEL MOTOR DE SINCRONIZACIÓN (ZETA CORE ENGINE):
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-[220px] overflow-y-auto space-y-1">
                        {syncResult.log.map((logLine, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-xs text-gray-700 font-mono">
                            <span className="text-[#0F9D58] font-bold">●</span>
                            <span>{logLine}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors log */}
                  {syncResult.errors && syncResult.errors.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest">
                        REGISTRO DE INCONSISTENCIAS / PESTAÑAS NO ACTUALIZADAS:
                      </p>
                      <div className="bg-red-50/50 p-3 rounded-lg border border-red-100 max-h-[180px] overflow-y-auto space-y-1">
                        {syncResult.errors.map((errLine, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-xs text-red-700 font-mono">
                            <span className="text-red-500 font-bold">▲</span>
                            <span>{errLine}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 block uppercase leading-relaxed pt-1">
                        PROTIP: Las pestañas omitidas debido a inconsistencias conservan su snapshot local de datos in-memory previo, protegiendo la consistencia relacional e impidiendo la pérdida de información comercial.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Push Result Console */}
          {pushResult && (
            <div className={`border rounded-sm p-6 ${
              pushResult.success 
                ? "bg-white border-[#0F9D58]/30" 
                : "bg-white border-red-200"
            }`}>
              <div className="flex items-start gap-3">
                {pushResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-[#0F9D58] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-4 w-full">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 tracking-wide uppercase">
                      {pushResult.success ? "EXPORTACIÓN BIDIRECCIONAL SATISFACTORIA" : "FALLO AL EXPORTAR A SHEETS"}
                    </h4>
                    <p className={`text-xs mt-1 ${pushResult.success ? "text-gray-600 font-mono" : "text-gray-500 font-mono"}`}>
                      {pushResult.message}
                    </p>
                  </div>

                  {/* Log entries */}
                  {pushResult.log && pushResult.log.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-mono font-bold text-gray-600 uppercase tracking-widest">
                        REGISTRO DE CAMBIOS ESCRITOS EN GOOGLE SHEETS:
                      </p>
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 max-h-[220px] overflow-y-auto space-y-1">
                        {pushResult.log.map((logLine, idx) => (
                          <div key={idx} className="flex gap-2 items-center text-xs text-gray-700 font-mono">
                            <span className="text-[#0F9D58] font-bold">✓</span>
                            <span>{logLine}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mappings Schema Guide Sidebar */}
        <div className="space-y-6">
          
          {/* Quick Guide */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#0F9D58]" /> Instrucciones de Preparación
            </h3>

            <div className="space-y-3 font-mono text-xs text-gray-500 leading-relaxed">
              <ol className="list-decimal list-inside space-y-2 pl-0.5 text-[11px]">
                <li>Abra su Hoja de Cálculo en Google Sheets.</li>
                <li>Haga clic en el botón superior derecho <span className="text-gray-900 font-bold">Compartir</span>.</li>
                <li>Cambie el acceso general de "Restringido" a <span className="text-[#0F9D58] font-bold">"Cualquier persona con el enlace puede ver"</span>.</li>
                <li>Asegúrese de que los nombres de sus pestañas (las hojas de abajo) coincidan con los alias mapeados.</li>
              </ol>

              <div className="p-3 bg-[#0F9D58]/5 border border-[#0F9D58]/10 text-emerald-800 rounded-lg text-[10px] leading-normal uppercase">
                <span className="text-[#0F9D58] block font-bold mb-1">Cero Tolerancia a Errores:</span>
                Nuestra sincronización inteligente utiliza un corrector automático de mayúsculas, minúsculas, guiones y espacios en las cabeceras, por lo que no es necesario un orden exacto en sus columnas.
              </div>

              <div className="p-3 bg-amber-500/5 border border-amber-500/10 text-amber-800 rounded-lg text-[10px] leading-normal uppercase">
                <span className="text-amber-600 block font-bold mb-1">Matriz de Tallas Integrada:</span>
                Soporta tanto el diseño tradicional de una talla por fila como el diseño avanzado de <span className="font-bold text-gray-900">Matriz de Tallas</span> (donde las columnas individuales representan tallas como <span className="font-bold text-gray-900">"7/39"</span> o <span className="font-bold text-gray-900 font-sans">"40"</span>, guardando directamente el stock de cada variante). Se incluye soporte completo para el campo <span className="font-bold text-gray-900 font-sans">"modelo"</span> de calzado para búsquedas óptimas.
              </div>
            </div>
          </div>

          {/* Catalog of Sheets & Fields Mapping */}
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-2">
              Pestañas & Columnas Esperadas
            </h3>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {sheetSchemas.map((schema, idx) => (
                <div key={idx} className="space-y-1.5 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-xs font-mono font-bold text-gray-900 block bg-[#FDFDFD] p-1 border border-gray-100 uppercase tracking-tight">
                    {schema.tabName}
                  </span>
                  <p className="text-[10px] text-gray-400 font-mono leading-relaxed">
                    {schema.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {schema.headers.map((h, hIdx) => (
                      <span key={hIdx} className="bg-gray-100 border border-gray-200 text-gray-600 px-1 py-0.5 rounded text-[8.5px] font-mono">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
