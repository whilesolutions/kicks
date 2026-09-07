/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  Copy, 
  Check, 
  ShieldCheck, 
  Code2, 
  CheckSquare, 
  AlertCircle 
} from "lucide-react";

export default function SupabaseHelp() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (sql: string, id: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sqlTables = `-- 1. Tabla dim_productos
CREATE TABLE dim_productos (
    sku VARCHAR(100) PRIMARY KEY, -- Ej: ZAP-001-41-NEGRO
    nombre_producto VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) CHECK (categoria IN ('Zapato', 'Textil')),
    subcategoria VARCHAR(100),
    genero_objetivo VARCHAR(50) CHECK (genero_objetivo IN ('Femenino', 'Masculino', 'Unisex')),
    talla VARCHAR(50) NOT NULL,
    color VARCHAR(100) NOT NULL,
    precio_venta_referencia NUMERIC(12, 2) NOT NULL,
    costo_unitario NUMERIC(12, 2) NOT NULL,
    temporada VARCHAR(100),
    proveedor VARCHAR(255),
    stock_disponible INT DEFAULT 0,
    stock_reservado INT DEFAULT 0,
    fecha_actualizacion DATE DEFAULT CURRENT_DATE,
    url_carpeta_drive TEXT,
    almacen VARCHAR(100) DEFAULT 'Principal'
);

-- 2. Tabla dim_clientes
CREATE TABLE dim_clientes (
    id_cliente VARCHAR(100) PRIMARY KEY, -- Ej: CL-1001
    nombre VARCHAR(255),
    whatsapp VARCHAR(50),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    genero VARCHAR(50),
    edad INT,
    grupo_edad VARCHAR(50) CHECK (grupo_edad IN ('18-24', '25-34', '35-44', '45-54', '55+')),
    estado VARCHAR(100),
    municipio VARCHAR(100),
    fuente_adquisicion VARCHAR(100),
    gusto_categoria VARCHAR(100),
    gusto_subcategoria VARCHAR(100),
    estilo_preferido VARCHAR(255),
    canal_preferido_compra VARCHAR(100),
    intereses_clave TEXT
);`;

  const sqlFacts = `-- 3. Tabla dim_creativos
CREATE TABLE dim_creativos (
    id_contenido VARCHAR(100) PRIMARY KEY, -- Ej: META_REEL_001
    plataforma VARCHAR(100) CHECK (plataforma IN ('Meta Ads', 'TikTok Orgánico', 'TikTok Live')),
    tipo_contenido VARCHAR(100),
    nombre_campana VARCHAR(255),
    objetivo VARCHAR(100),
    formato VARCHAR(100),
    estilo_narrativo VARCHAR(100),
    enfoque_contenido VARCHAR(100),
    estrategia VARCHAR(100),
    duracion_segundos INT,
    seg_edad_min INT,
    seg_edad_max INT,
    seg_genero VARCHAR(50),
    seg_regiones_incluidas TEXT,
    seg_intereses TEXT,
    seg_publico_personalizado VARCHAR(255),
    segmento_interno VARCHAR(255),
    notas TEXT
);

-- 4. Tabla fact_ventas (PK Compuesta)
CREATE TABLE fact_ventas (
    id_venta VARCHAR(100),
    sku VARCHAR(100) REFERENCES dim_productos(sku) ON UPDATE CASCADE,
    fecha_venta DATE DEFAULT CURRENT_DATE,
    id_cliente VARCHAR(100) REFERENCES dim_clientes(id_cliente) ON UPDATE CASCADE,
    id_contenido VARCHAR(100) REFERENCES dim_creativos(id_contenido) ON UPDATE CASCADE,
    cantidad INT NOT NULL,
    ingreso_bruto NUMERIC(12, 2) NOT NULL,
    costo_total NUMERIC(12, 2) NOT NULL,
    canal_venta VARCHAR(100) CHECK (canal_venta IN ('WhatsApp', 'Tienda', 'Web')),
    fuente_trafico VARCHAR(100),
    estado_entrega VARCHAR(100),
    municipio_entrega VARCHAR(100),
    es_devolucion BOOLEAN DEFAULT FALSE,
    origen_atribucion TEXT,
    PRIMARY KEY (id_venta, sku)
);`;

  const sqlRls = `-- Habilitar RLS en cada tabla
ALTER TABLE dim_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_creativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ventas ENABLE ROW LEVEL SECURITY;

-- Crear Política para permitir todo acceso a roles Autenticados
CREATE POLICY "Acceso total para autenticados" ON dim_productos
    FOR ALL TO authenticated USING (true);
CREATE POLICY "Acceso total para autenticados" ON dim_clientes
    FOR ALL TO authenticated USING (true);
CREATE POLICY "Acceso total para autenticados" ON fact_ventas
    FOR ALL TO authenticated USING (true);`;

  return (
    <div className="space-y-6">
      
      {/* Editorial Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
          Estructura Supabase
        </h1>
        <p className="text-sm text-gray-500">
          Modelado relacional del Sistema Zeta. Scripts DDL listos para ejecutar en el panel de control SQL de Supabase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Database setup modules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tables and DDL Dimenstions */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#FCD901]" /> DDL: Tablas Maestras de Dimensiones
              </span>
              <button
                onClick={() => handleCopy(sqlTables, "dim")}
                className="text-xs font-mono text-[#FCD901] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "dim" ? <Check className="w-4.5 h-4.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Copiar Bloque SQL
              </button>
            </div>

            <pre className="bg-[#FDFDFD] p-4 text-[10px] rounded-lg border border-gray-200 text-gray-500 font-mono select-all overflow-x-auto leading-relaxed">
              {sqlTables}
            </pre>
          </div>

          {/* DDL Hechos y Atribuciones */}
          <div className="bg-white border border-gray-200 rounded-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#FCD901]" /> DDL: Hechos, Atribuciones & Llaves Compuestas
              </span>
              <button
                onClick={() => handleCopy(sqlFacts, "facts")}
                className="text-xs font-mono text-[#FCD901] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedSection === "facts" ? <Check className="w-4.5 h-4.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />} Copiar Bloque SQL
              </button>
            </div>

            <pre className="bg-[#FDFDFD] p-4 text-[10px] rounded-lg border border-gray-200 text-gray-500 font-mono select-all overflow-x-auto leading-relaxed">
              {sqlFacts}
            </pre>
          </div>

        </div>

        {/* Supabase security best practices and indexes */}
        <div className="space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-[#FCD901]" /> Row Level Security & Políticas de Rol
            </h3>

            <p className="text-[11px] font-mono text-gray-500 leading-normal">
              Para garantizar que los operadores únicamente registren ventas y los gerentes auditen, active RLS en Supabase y cree políticas específicas.
            </p>

            <pre className="bg-[#FDFDFD] p-3 text-[9px] rounded-lg border border-gray-200 text-gray-500 font-mono select-all overflow-x-auto leading-relaxed">
              {sqlRls}
            </pre>

            <button
              onClick={() => handleCopy(sqlRls, "rls")}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-1.5 rounded text-xs font-mono font-bold"
            >
              {copiedSection === "rls" ? "¡Políticas Copiadas!" : "Copiar DDL de RLS"}
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-4 font-mono text-xs">
            <h3 className="text-xs font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <AlertCircle className="w-4 h-4 text-emerald-600" /> Rendimiento & Indexación
            </h3>

            <p className="text-[11px] text-gray-500 leading-normal">
              El sistema Zeta crea índices automáticos en las llaves foráneas para optimizar los JOINS de alta velocidad requeridos para Power BI:
            </p>

            <ul className="space-y-2 text-[10px] text-gray-700 list-disc list-inside">
              <li><span className="text-gray-900 font-bold">idx_fact_ventas_fecha:</span> Acelera consultas de reporte temporal.</li>
              <li><span className="text-gray-900 font-bold">idx_fact_marketing_fecha:</span> Acelera auditoría de ROAS.</li>
              <li><span className="text-gray-900 font-bold">idx_dim_productos_stock:</span> Alertas de stock bajo en milisegundos.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
