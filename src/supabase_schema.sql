-- ==========================================
-- SISTEMA ZETA - ESTRUCTURA SUPABASE (DDL)
-- ==========================================

-- 1. Tabla dim_productos
CREATE TABLE dim_productos (
    sku VARCHAR(100) PRIMARY KEY, -- Ej: ZAP-001-41-NEGRO
    nombre_producto VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) CHECK (categoria IN ('Zapato', 'Textil')),
    subcategoria VARCHAR(100),
    genero_objetivo VARCHAR(50) CHECK (genero_objetivo IN ('Femenino', 'Masculino', 'Unisex')),
    talla VARCHAR(50) NOT NULL, -- Separada
    color VARCHAR(100) NOT NULL, -- Normalizado
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
    fuente_adquisicion VARCHAR(100), -- Meta Ads, TikTok Orgánico, Referido, etc.
    gusto_categoria VARCHAR(100),
    gusto_subcategoria VARCHAR(100),
    estilo_preferido VARCHAR(255),
    canal_preferido_compra VARCHAR(100),
    intereses_clave TEXT
);

-- 3. Tabla dim_creativos
CREATE TABLE dim_creativos (
    id_contenido VARCHAR(100) PRIMARY KEY, -- Ej: META_REEL_001
    plataforma VARCHAR(100) CHECK (plataforma IN ('Meta Ads', 'TikTok Orgánico', 'TikTok Live')),
    tipo_contenido VARCHAR(100),
    nombre_campana VARCHAR(255),
    objetivo VARCHAR(100),
    formato VARCHAR(100), -- Reel, Video Feed, Estático, etc.
    estilo_narrativo VARCHAR(100), -- Hablado, Sin voz, etc.
    enfoque_contenido VARCHAR(100), -- Solo producto, Testimonio, etc.
    estrategia VARCHAR(100), -- Lanzamiento, Liquidación, etc.
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

-- 4. Tabla dim_regiones (PK Compuesta)
CREATE TABLE dim_regiones (
    estado VARCHAR(100),
    municipio VARCHAR(100),
    region_agrupada VARCHAR(100),
    PRIMARY KEY (estado, municipio)
);

-- 5. Tabla fact_ventas (PK Compuesta)
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
    origen_atribucion TEXT, -- Campo de respaldo
    PRIMARY KEY (id_venta, sku)
);

-- 6. Tabla fact_marketing (PK Compuesta)
CREATE TABLE fact_marketing (
    fecha DATE,
    id_contenido VARCHAR(100) REFERENCES dim_creativos(id_contenido) ON UPDATE CASCADE,
    plataforma VARCHAR(100),
    impresiones INT DEFAULT 0,
    alcance INT DEFAULT 0,
    clics_enlace INT DEFAULT 0,
    ctr NUMERIC(5, 2),
    reproducciones_video_3s INT DEFAULT 0,
    reproducciones_video_15s INT DEFAULT 0,
    reproducciones_completas INT DEFAULT 0,
    hook_rate NUMERIC(5, 2),
    tasa_retencion_15s NUMERIC(5, 2),
    gasto NUMERIC(12, 2) DEFAULT 0,
    conversiones_pixel INT DEFAULT 0,
    valor_conversion_pixel NUMERIC(12, 2) DEFAULT 0,
    cpm NUMERIC(12, 2),
    cpc NUMERIC(12, 2),
    ventas_atribuidas_manual INT DEFAULT 0,
    PRIMARY KEY (fecha, id_contenido)
);

-- ==========================================
-- CREACIÓN DE ÍNDICES REQUERIDOS
-- ==========================================
CREATE INDEX idx_fact_ventas_fecha ON fact_ventas(fecha_venta);
CREATE INDEX idx_fact_ventas_creativo ON fact_ventas(id_contenido);
CREATE INDEX idx_fact_marketing_fecha ON fact_marketing(fecha);
CREATE INDEX idx_dim_productos_stock ON dim_productos(stock_disponible);

-- ==========================================
-- POLÍTICAS DE Row Level Security (RLS)
-- ==========================================

-- Habilitar RLS en cada tabla
ALTER TABLE dim_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_creativos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dim_regiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE fact_marketing ENABLE ROW LEVEL SECURITY;

-- Crear Política para permitir todo acceso a roles Autenticados
CREATE POLICY "Permitir select para usuarios autenticados" ON dim_productos
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir insert/update para usuarios autenticados" ON dim_productos
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir select para usuarios autenticados" ON dim_clientes
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir insert/update para usuarios autenticados" ON dim_clientes
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir select para usuarios autenticados" ON dim_creativos
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir insert/update para usuarios autenticados" ON dim_creativos
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir select para usuarios autenticados" ON dim_regiones
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Permitir select para usuarios autenticados" ON fact_ventas
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir insert/update para usuarios autenticados" ON fact_ventas
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Permitir select para usuarios autenticados" ON fact_marketing
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Permitir insert/update para usuarios autenticados" ON fact_marketing
    FOR ALL TO authenticated USING (true);
