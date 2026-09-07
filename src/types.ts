export type SizeRef = {
  us: string;
  eu: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number; // 1-5
  text: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  colors: string[];
  sizes: SizeRef[];
  images: string[];
  description: string;
  material: string;
  careInstructions: string;
  reviews: Review[];
  rating: number;
  isNew?: boolean;
  isOnSale?: boolean;
  gender: "Caballero" | "Dama";
  sku: string;
  inventory: number;
  comparePrice?: number;
  category?: 'Calzado' | 'Ropa';
  subcategory?: string;
  colorVariants?: {
    [colorName: string]: {
      images: string[];
      sizes: SizeRef[];
    };
  };
};

export type CartItem = {
  id: string;
  productId: string;
  color: string;
  size: SizeRef;
  quantity: number;
};

// --- ERP & DB TYPES ---

export type ProductType = {
  sku: string;
  nombre_producto: string;
  marca: string;
  modelo?: string;
  categoria: string;
  subcategoria: string;
  genero_objetivo: string;
  talla: string | number;
  color: string;
  precio_venta_referencia: number;
  precio_promocion?: number;
  costo_unitario: number;
  margen_dolar?: number;
  temporada: string;
  coleccion?: string;
  proveedor: string;
  stock_disponible: number;
  stock_reservado: number;
  fecha_actualizacion: string;
  url_carpeta_drive: string;
  almacen: string;
  descripcion?: string;
  url_imagen?: string;
};

export type ClientType = {
  id_cliente: string;
  nombre: string;
  whatsapp: string;
  fecha_registro: string;
  genero: string;
  edad: number;
  grupo_edad: string;
  estado: string;
  municipio: string;
  fuente_adquisicion: string;
  gusto_categoria: string;
  gusto_subcategoria: string;
  estilo_preferido: string;
  canal_preferido_compra: string;
  intereses_clave: string;
};

export type CreativeType = {
  id_contenido: string;
  plataforma: string;
  tipo_contenido: string;
  nombre_campana: string;
  objetivo: string;
  formato: string;
  estilo_narrativo: string;
  enfoque_contenido: string;
  estrategia: string;
  duracion_segundos: number;
  seg_edad_min: number;
  seg_edad_max: number;
  seg_genero: string;
  seg_regiones_incluidas: string;
  seg_intereses: string;
  seg_publico_personalizado: string;
  segmento_interno: string;
  notas: string;
};

export type SaleType = {
  id_venta: string;
  sku: string;
  fecha_venta: string;
  id_cliente: string;
  id_contenido: string | null;
  cantidad: number;
  ingreso_bruto: number;
  costo_total: number;
  canal_venta: 'WhatsApp' | 'Instagram' | 'Facebook' | 'TikTok' | 'Tienda Virtual';
  fuente_trafico: string;
  estado_entrega: string;
  municipio_entrega: string;
  es_devolucion: boolean;
};

export type MarketingMetricType = {
  fecha: string;
  id_contenido: string;
  plataforma: 'Meta Ads' | 'TikTok Orgánico' | 'TikTok Live' | 'Google Ads';
  impresiones: number;
  alcance: number;
  clics_enlace: number;
  ctr: number;
  reproducciones_video_3s: number;
  reproducciones_video_15s: number;
  reproducciones_completas: number;
  gasto: number;
  conversiones_pixel: number;
  valor_conversion_pixel: number;
  cpm: number;
  cpc: number;
  ventas_atribuidas_manual: number;
  id_campana: string;
  id_conjunto_anuncios: string;
  frecuencia: number;
  mensajes: number;
  comentarios: number;
  hook_rate: number;
};

export type ExpenseType = {
  id_gasto: string;
  fecha: string;
  categoria: string;
  descripcion: string;
  monto: number;
  proveedor_o_destino: string;
};

export type DispatchType = {
  id_despacho: string;
  id_venta: string;
  nombre_cliente: string;
  estado_entrega: string;
  municipio_entrega: string;
  direccion_exacta: string;
  tipo_envio: string;
  agencia_courier: string;
  guia_tracking: string;
  fecha_despacho: string;
  estado_despacho: string;
  costo_despacho: number;
  notas: string;
};

export type DevolucionType = {
  id_devolucion: string;
  id_despacho: string;
  id_venta: string;
  nombre_cliente: string;
  sku: string;
  motivo: string;
  talla_original: string;
  talla_nueva: string;
  sku_nuevo: string;
  detalle_dano: string;
  estado_devolucion: string;
  costo_retorno: number;
  reingresa_a_stock: boolean;
  fecha_registro: string;
  notas: string;
};

export type ProjectTaskType = {
  id_tarea: string;
  id_proyecto: string;
  descripcion: string;
  prioridad: string;
  responsable: string;
  fecha_limite: string;
  estado: string;
};

export type ProjectType = {
  id_proyecto: string;
  nombre: string;
  descripcion: string;
  estado: string;
  porcentaje_progreso: number;
  presupuesto: number;
  fecha_inicio: string;
  fecha_limite: string;
  responsable_lider: string;
  tareas: ProjectTaskType[];
};

