import React, { useState } from 'react';
import { Database, TrendingUp, Calculator, Table2, Search, SlidersHorizontal, BookOpen, CheckCircle, HelpCircle, Star, ShieldAlert, Zap, Printer } from 'lucide-react';

export default function DataDictionary() {
  const [activeView, setActiveView] = useState<'tables' | 'kpis'>('tables');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [expandedKpi, setExpandedKpi] = useState<number | null>(null);

  const tables = [
    {
      name: "m_productos (Inventario y Catálogo)",
      description: "Almacena la información de cada artículo físico disponible para la venta con identificadores universales e históricos de adquisición.",
      sirvePara: "Sirve como el maestro de artículos unificado del negocio, estructurando cada par de calzado y prenda de ropa por marca, modelo, colección, color, costo de adquisición, precio de venta sugerido, precio promocional y talla de manera estandarizada.",
      seUso: "Se usó para organizar el inventario digital, calcular el valor exacto de la mercancía en estantería (valorización de inventario), prevenir sobreventas mediante la segregación entre inventario disponible y reservado, y alertar tempranamente sobre quiebres de artículos de alta demanda.",
      porQueSeCreo: "Se creó para evitar la congelación innecesaria de capital de trabajo por acumulación de mercancía de baja rotación, estandarizar los códigos de barras e IDs para el picker, y garantizar el conocimiento absoluto del costo unitario frente al precio promocional para defender el margen bruto de ganancia.",
      columns: [
        { name: "sku", type: "string", desc: "Stock Keeping Unit. Código estructurado único (ej. ZAP-AVI-BLA-42)." },
        { name: "codigo_barras_ean", type: "string", desc: "Código EAN-13 para lectura por pistola de escáner en punto físico." },
        { name: "nombre_producto", type: "string", desc: "Nombre comercial detallado para visualización y catálogos." },
        { name: "marca", type: "string", desc: "Marca del fabricante (ej. Avia, Hey Dude, Kickers)." },
        { name: "modelo", type: "string", desc: "Línea o modelo específico del producto (ej. Wally Sox, Avi-Forte, Classic Clog)." },
        { name: "categoria", type: "string", desc: "Clasificación superior de mercado (ej. Calzado, Ropa, Accesorios)." },
        { name: "subcategoria", type: "string", desc: "Subgrupo de producto (ej. Zapatillas deportivas, Sandalias, Franelas)." },
        { name: "genero_objetivo", type: "string", desc: "Género comercial (Dama, Caballero, Unisex, Niño)." },
        { name: "coleccion", type: "string", desc: "Temporada o campaña de lanzamiento del artículo (ej. Verano 2026, Clásicos Permanentes, Retro Core)." },
        { name: "talla", type: "string | number", desc: "Medida específica de la unidad física (ej. US-9, EUR-42, L, XL)." },
        { name: "color", type: "string", desc: "Variación de tono base (ej. Azul Marino, Negro Slate, Blanco Off-White)." },
        { name: "precio_venta_referencia", type: "number", desc: "Precio sugerido base al detal en USD." },
        { name: "precio_promo", type: "number", desc: "Precio especial de venta con descuento aplicado en campañas específicas (USD)." },
        { name: "costo_unitario", type: "number", desc: "Costo promedio ponderado de compra FOB o adquisición del proveedor." },
        { name: "stock_disponible", type: "number", desc: "Unidades físicas listas para entrega inmediata en estantería." },
        { name: "stock_reservado", type: "number", desc: "Unidades asignadas a pedidos confirmados que esperan empaque o despacho." },
        { name: "stock_critico", type: "number", desc: "Nivel recomendado de re-orden para disparar alertas automáticas de reposición." },
        { name: "ubicacion_almacen", type: "string", desc: "Pasillo/Estante/Casilla de almacenamiento físico (ej. Pasillo C - Caja 14)." },
        { name: "id_proveedor", type: "string", desc: "Clave foránea de enlace al registro general de proveedores externos." },
        { name: "fecha_ingreso", type: "string", desc: "Fecha de la última recepción de mercancía de este SKU." },
        { name: "estado_producto", type: "string", desc: "Estado operativo de venta (Activo, Descontinuado, Pausado, Liquidación)." }
      ]
    },
    {
      name: "m_clientes (CRM Core)",
      description: "Registro consolidado de clientes habituales, leads y prospectos del embudo de WhatsApp e Instagram.",
      sirvePara: "Sirve para centralizar la información transaccional y de comportamiento de todos los prospectos y clientes frecuentes, permitiendo segmentaciones geográficas, etarias, preferenciales y de fidelización.",
      seUso: "Se usó para alimentar el motor conversacional de ventas por WhatsApp y DM, identificar a los compradores VIP de alta recurrencia, realizar campañas de re-contacto con mensajes dirigidos por tallas disponibles, y calcular el ciclo de retención integral.",
      porQueSeCreo: "Se creó con el fin de disminuir drásticamente el Costo de Adquisición de Clientes (CAC) al maximizar el valor de vida del cliente (Lifetime Value - LTV), asegurando que un comprador existente vuelva a adquirir una nueva colección sin requerir nuevas inversiones en publicidad.",
      columns: [
        { name: "id_cliente", type: "string", desc: "Identificador unívoco del prospecto en el ecosistema." },
        { name: "nombre", type: "string", desc: "Nombre completo o de pila reportado por el comprador." },
        { name: "whatsapp", type: "string", desc: "Formato internacional de contacto (ej. +58412XXXXXXX) usado como llave principal de chat." },
        { name: "correo_electronico", type: "string", desc: "Dirección de correo para envíos automáticos de facturación digital." },
        { name: "edad", type: "number", desc: "Edad declarada o deducida a partir de comportamiento de compra." },
        { name: "estado_logistico", type: "string", desc: "Estado federal de residencia (ej. Miranda, Distrito Capital, Zulia)." },
        { name: "municipio_ciudad", type: "string", desc: "Ubicación detallada de entrega principal (ej. Chacao, Baruta, Maracaibo)." },
        { name: "fuente_adquisicion", type: "string", desc: "Canal raíz por el cual capturamos el lead (ej. TikTok Orgánico, Instagram Ads, Referido)." },
        { name: "intereses_clave", type: "string", desc: "Palabras clave de gustos (ej. Calzado Deportivo, Zapatos Veraniegos, Comodidad)." },
        { name: "tipo_cliente", type: "string", desc: "Perfilación comercial (Lead Frío, Prospecto Interesado, Comprador Único, VIP Recurrente)." },
        { name: "frecuencia_de_compra", type: "number", desc: "Total de órdenes cerradas de por vida en la base transaccional." },
        { name: "ticket_promedio_historico", type: "number", desc: "Valor promedio de compra del usuario (USD)." },
        { name: "ultimo_contacto", type: "string", desc: "Timestamp del último mensaje respondido o envío de plantilla por WhatsApp." }
      ]
    },
    {
      name: "m_ventas (Transaccional & Facturación)",
      description: "Asiento comercial analítico de cada transacción realizada por la red de ventas.",
      sirvePara: "Sirve para registrar en tiempo real cada transacción comercial hecha en KICKS por cualquier canal, calculando comisiones financieras, ingresos brutos, costos totales asociados de stock, y la ganancia neta generada.",
      seUso: "Se usó para la conciliación contable diaria del negocio, monitorear la productividad de los cerradores del call center, fiscalizar el uso de métodos de pago (Zelle, Bolívares a tasa BCV, Efectivo USD), y actualizar el inventario disponible al instante.",
      porQueSeCreo: "Se creó para garantizar total transparencia operativa, evitar fugas de capital por desorden administrativo, auditar las comisiones de los operadores, e iniciar la orden de despacho logístico con total precisión tras la confirmación de fondos.",
      columns: [
        { name: "id_venta", type: "string", desc: "Identificador secuencial de factura de control interno." },
        { name: "sku", type: "string", desc: "Llave de relación al producto comprado (FK a m_productos)." },
        { name: "id_cliente", type: "string", desc: "Llave de relación al comprador (FK a m_clientes)." },
        { name: "fecha_venta", type: "string", desc: "Fecha y hora exacta del marcado de la venta." },
        { name: "cantidad", type: "number", desc: "Número de unidades de ese SKU llevadas en la misma transacción." },
        { name: "ingreso_bruto", type: "number", desc: "Ingresos totales por venta de las unidades al precio final pactado (USD)." },
        { name: "costo_total", type: "number", desc: "Suma de los costos unitarios base del SKU al momento de la venta (USD)." },
        { name: "comision_pasarela", type: "number", desc: "Comisión retenida si se cobró por plataforma externa (ej. Stripe, Binance Pay)." },
        { name: "utilidad_neta_venta", type: "number", desc: "Ganancia real de la transacción (Ingreso Bruto - Costo Total - Comisiones)." },
        { name: "metodo_pago", type: "string", desc: "Canal financiero utilizado (Zelle, Pago Móvil VEF, Efectivo USD, Binance, Banesco)." },
        { name: "tasa_cambio_aplicada", type: "number", desc: "Tasa del BCV o paralelo empleada si el pago fue en Bolívares (VEF) para el asiento contable." },
        { name: "estado_pago", type: "string", desc: "Condición de fondos (Pendiente por Conciliar, Pagado, Devolución o Reembolso)." },
        { name: "canal_venta", type: "string", desc: "Canal origen de atención (WhatsApp Call Center, DM Instagram, Tienda Física, Bot Automatizado)." },
        { name: "operador_responsable", type: "string", desc: "Nombre del agente de ventas encargado de cerrar la transacción." }
      ]
    },
    {
      name: "m_marketing (Ecosistema de Ads)",
      description: "Métricas consolidadas diarias de rendimiento de subastas de anuncios pautados.",
      sirvePara: "Sirve como el agregador analítico del desempeño de las campañas publicitarias bajo subastas en plataformas de anuncios (Meta, TikTok, Google), cruzando el presupuesto diario consumido con impactos, clicks de tráfico, leads e inicios de chat.",
      seUso: "Se usó para calcular científicamente la relación entre el gasto publicitario y la captación de prospectos (Costo por Chat, CTR, CPM, Hook Rate), permitiendo auditar qué anuncios o segmentaciones traen la mayor masa de clientes potenciales al menor costo.",
      porQueSeCreo: "Se creó para impedir el desperdicio inconsciente de presupuesto en campañas baratas pero sin conversión, y proveer al analista de medios (Trafficker) el control en caliente sobre qué anuncios apagar o escalar para sostener un ROAS saludable.",
      columns: [
        { name: "fecha", type: "string", desc: "Día a nivel calendario del reporte (Dia-Mes-Año)." },
        { name: "id_contenido", type: "string", desc: "Identificador del anuncio que asocia al creativo específico (FK a m_creativos)." },
        { name: "nombre_campana", type: "string", desc: "Categoría de campaña en Meta/TikTok Manager (ej. LAL-Calzado-Frío)." },
        { name: "plataforma", type: "string", desc: "Red que pauta y cobra el espacio (Meta Ads, TikTok Ads, Google Search)." },
        { name: "gasto", type: "number", desc: "Dinero neto consumido en la subasta del día (USD)." },
        { name: "impresiones", type: "number", desc: "Suma de veces que el anuncio apareció en pantalla del público." },
        { name: "alcance", type: "number", desc: "Número de perfiles únicos que vieron la publicidad al menos una vez." },
        { name: "clics_enlace", type: "number", desc: "Número directo de clicks de redirección recibidos hacia el link de destino." },
        { name: "conversiones_pixel", type: "number", desc: "Eventos web de checkout, agregar al carrito o lead medidos por API del píxel." },
        { name: "leads_registrados", type: "number", desc: "Chats de WhatsApp nuevos abiertos con el texto del pre-mensaje publicitario." },
        { name: "reproducciones_video_3s", type: "number", desc: "Muestra de interés inicial. Visualizaciones de video del anuncio mayor a 3 seg." },
        { name: "reproducciones_video_15s", type: "number", desc: "Muestra de fidelidad. Visualizaciones acumuladas del mismo video mayores a 15 seg o fin." }
      ]
    },
    {
      name: "m_proyectos_creativos (Producción Creativa)",
      description: "Fichas técnicas de cada pieza audiovisual de contenido orgánico o promocional, creadas para escalar la marca.",
      sirvePara: "Sirve para catalogar y monitorear el ciclo de vida y costos de producción de todas las propuestas multimedia, videos UGC (contenido generado por usuarios) y piezas estéticas grabadas para la marca.",
      seUso: "Se usó para medir el ROI de producción (ROI-C) de cada pieza al vincularla con las ventas atribuidas en Ads, evaluar e indexar los videos de mayor enganche inicial de 3 segundos, y archivar enlaces directos del material editado en la nube.",
      porQueSeCreo: "Se creó para desmitificar 'las vistas de vanidad' y convertir el diseño audiovisual en una ciencia exacta, justificando presupuestos creativos de rodaje únicamente a partir de la facturación comercial conseguida por cada video.",
      columns: [
        { name: "id_creativo", type: "string", desc: "Identificador clave (ej. CRT-024-HEYD-PLAYA)." },
        { name: "nombre_creativo", type: "string", desc: "Título descriptivo del gancho o guion utilizado (ej. Unboxing Hey Dude Verano)." },
        { name: "formato", type: "string", desc: "Especificación de dimensiones de archivo (Video Vertical 9:16, Carrusel 1:1, Foto Editorial 4:5)." },
        { name: "enlace_recurso", type: "string", desc: "Dirección compartida del almacenamiento en la nube (Google Drive, Frame.io) con el video final en alta calidad." },
        { name: "disenador_editor", type: "string", desc: "Nombre o handle del creador encargado de la edición o filmación (ej. @carlos_videos)." },
        { name: "actor_modelo", type: "string", desc: "Talento principal que sale a cuadro en caso de videos UGC de marca." },
        { name: "costo_produccion", type: "number", desc: "Costo total de realizar el video (Incluye pago a editor y pago a modelos)." },
        { name: "estado_produccion", type: "string", desc: "Fase de control (En Guión, Filmación, Edición, Feedback, Aprobado, Disponible en Ads, Descontinuado)." },
        { name: "fecha_lanzamiento", type: "string", desc: "Día en que el video se cargó a Ads o se publicó en perfiles orgánicos." },
        { name: "reproducciones_organicas", type: "number", desc: "Total de views orgánicas de posteo acumuladas antes del impulso pago." }
      ]
    },
    {
      name: "m_gastos (Contabilidad de Egresos)",
      description: "Control financiero administrativo de egresos corporativos periódicos, fijos y variables.",
      sirvePara: "Sirve para asentar y clasificar con total disciplina financiera cualquier desembolso de dinero diferente a los costos de mercancía (ej. nóminas, pauta, alquiler, fletes directos, comisiones y empaques).",
      seUso: "Se usó para deducir de los márgenes brutos comerciales los gastos o costos operativos vigentes (OpEx) y de esta manera obtener la utilidad operativa neta verdadera (EBITDA) del periodo comercial.",
      porQueSeCreo: "Se creó para evitar sorpresas o iliquidez por costos ocultos, permitiendo identificar de forma inmediata qué rubros están sobredimensionados e implementar estrategias ágiles de contención de gastos fijos.",
      columns: [
        { name: "id_gasto", type: "string", desc: "Código transaccional único de egreso." },
        { name: "fecha_gasto", type: "string", desc: "Día que se ejecutó la transferencia o egreso físico." },
        { name: "categoria", type: "string", desc: "Clasificación de egresos (Servicios, Nómina, Publicidad, Packaging, Logística, Alquileres)." },
        { name: "monto", type: "number", desc: "Monto neto desembolsado en USD." },
        { name: "proveedor_o_destino", type: "string", desc: "Persona o empresa receptora del pago (ej. SSER-REPOSTERAS, META PAYMENTS, PROV-CARTONES)." },
        { name: "metodo_pago_egreso", type: "string", desc: "Cuenta bancaria u origen de egreso (Caja Chica, Banco Nacional VEF, Cuenta Zelle Corp, Binance Pay)." },
        { name: "factura_soporte_url", type: "string", desc: "Enlace o referencia física del justificativo, recibo o factura oficial aprobada." },
        { name: "aprobado_por", type: "string", desc: "Rol/Firma del administrativo que autorizó liberar los fondos de caja (ej. AR Romano)." }
      ]
    },
    {
      name: "m_despachos_y_devoluciones (Módulo Logística)",
      description: "Estado, seguimiento y costos asociados con el despacho de mercancías vendidas de última milla.",
      sirvePara: "Sirve para organizar el despacho de última milla, asociar guías de rastreo con empresas transportistas (MRW, Zoom, Tealca, Delivery), registrar el estado de entrega y asentar retornos documentados de mercancías.",
      seUso: "Se usó para monitorear los tiempos promedio de flete nacional, reducir la tasa de devoluciones mediante el rastreo oportuno de problemas de entrega, y calcular los costos de envío acumulados de la tienda.",
      porQueSeCreo: "Se creó para blindar la experiencia de compra del cliente una vez finalizado el pago, asegurar que la mercancía llegue de manera exacta a su destino nacional, y reducir el costo de fletes inútiles por rebotas no resueltos por el call center.",
      columns: [
        { name: "guia_tracking", type: "string", desc: "Código de rastreo de la empresa de paquetería emisora." },
        { name: "id_venta", type: "string", desc: "Código de venta que originó la orden de despacho (FK a m_ventas)." },
        { name: "empresa_courier", type: "string", desc: "Agencia logística asignada para transporte (MRW Nacional, Zoom, Tealca, Delivery Motorizado propio)." },
        { name: "fecha_envio", type: "string", desc: "Momento exacto en el que el paquete salió del almacén." },
        { name: "fecha_entrega", type: "string", desc: "Fecha en la que el cliente firmó la recepción física de su envío de manera conforme." },
        { name: "estado_despacho", type: "string", desc: "Estatus de ruta de paquetería (Por Enviar, En Ruta, En Oficina Courier, Entregado, Retornado)." },
        { name: "costo_despacho", type: "number", desc: "Tarifa flete del envío cobrada por la empresa de envíos (USD)." },
        { name: "direccion_detallada", type: "string", desc: "Dirección literal de entrega para el repartidor o destinatario principal." },
        { name: "intentos_entrega", type: "number", desc: "Contador de visitas fallidas en destino antes de que sea devuelto al almacén." },
        { name: "motivo_devolucion", type: "string", desc: "Causa de retorno detallado de las unidades si el paquete fue rebotado (Cambio de Talla, Cliente no localizado, Falso número)." }
      ]
    }
  ];

  const kpis = [
    {
      name: "Ventas Brutas del Mes (USD)",
      category: "Estrategia Global",
      formula: "SUM(m_ventas.ingreso_bruto) WHERE fecha_venta = MES_ACTUAL Y es_devolucion = FALSIFICADO",
      desc: "Suma total de la facturación en USD por productos vendidos en el mes en curso, aislando reembolsos y devoluciones para reportar la tracción pura de ventas.",
      sirvePara: "Evaluar la tracción comercial absoluta y volumen bruto ingresado al negocio de forma mensual.",
      mide: "La consolidación total de ingresos brutos por intercambios comerciales concretados.",
      comoMide: "Suma acumulada de la columna 'ingreso_bruto' de la tabla 'm_ventas' filtrando el mes actual y excluyendo transacciones marcadas como devolución.",
      porQueMide: "Permite saber rápidamente la velocidad de colocación de mercancía y contrastar de manera inmediata contra la meta de facturación mensual fijada por el equipo directivo."
    },
    {
      name: "Margen Bruto (%)",
      category: "Finanzas",
      formula: "((Suma de Ventas Brutas USD - Suma de Costo Total) / Suma de Ventas Brutas USD) * 100",
      desc: "Mide el rendimiento unitario y comercial de la tienda antes de restar gastos fijos y operativos. Refleja qué tan lucrativo es vender el inventario actual.",
      sirvePara: "Entender la rentabilidad directa de la gama de productos del catálogo y la salud del costo de adquisición.",
      mide: "El porcentaje de ingresos residuales que queda para cubrir gastos de operación tras sustraer el costo base de la mercancía.",
      comoMide: "Resta el 'costo_total' acumulativo de ventas del total del 'ingreso_bruto', y divide el residuo entre el mismo 'ingreso_bruto', multiplicándolo por cien.",
      porQueMide: "Es el termómetro de protección financiera. Garantiza que la estrategia de precios resista fluctuaciones de fletes internacionales y evite captar volumen con pérdida operativa."
    },
    {
      name: "ROAS Global (Return On Ad Spend)",
      category: "Ecosistema de Ads",
      formula: "Ingresos Totales Atribuidos a Canales Pautados / Gasto Neto Consumido en Campañas",
      desc: "Eficiencia consolidada de la inversión publicitaria paga (Meta & TikTok Ads). Un número superior a 3 indica rentabilidad óptima del embudo de pauta.",
      sirvePara: "Medir la rentabilidad de las campañas publicitarias bajo subastas en plataformas digitales.",
      mide: "El retorno multiplicador de cada dólar inyectado de presupuesto en anuncios pagados.",
      comoMide: "Cruza la facturación total cuya procedencia de atribución ('canal_venta') provenga de pauta contra los egresos por 'gasto' publicitario cargados en 'm_marketing'.",
      porQueMide: "Permite calibrar de forma reactiva si el precio por adquisición de cliente no se está devorando la ganancia neta. Si disminuye de 3, señala urgencia de refrescar creativos."
    },
    {
      name: "Clientes Nuevos del Mes",
      category: "CRM & Adquisición",
      formula: "Conteo único de id_cliente en m_ventas del mes actual sin historial previo de compra de por vida",
      desc: "Monitorea la expansión de mercado y el ritmo de conversión. Evalúa cuántas personas entran por primera vez a comprar en lugar de la recompra habitual.",
      sirvePara: "Evaluar el ritmo de asimilación de nueva audiencia interesada y el crecimiento real del ecosistema de clientes.",
      mide: "El volumen absoluto de compradores de primer contacto temporal dentro de la base de datos.",
      comoMide: "Cuenta de forma única los 'id_cliente' en documentos de venta facturados donde no exista ningún registro de transacciones suyas previas en meses anteriores.",
      porQueMide: "Es el indicador fundamental de tracción del embudo. Sin inyección constante de clientes nuevos, el negocio se vuelve vulnerable a la fatiga del LTV de su base histórica."
    },
    {
      name: "Hook Rate Promedio (%) (Tasa de Enganche)",
      category: "Contenido & Video",
      formula: "Promedio de (reproducciones_video_3s / impresiones) * 100 de todos los creativos activos",
      desc: "Índice de potencia del 'gancho' visual. Indica qué tan atractivos son los primeros 3 segundos de un video publicitario u orgánico para retener el scroll.",
      sirvePara: "Optimizar el inicio de los videos creativos para detener el salto instantáneo de los usuarios en redes sociales.",
      mide: "La capacidad de retención visual del primer impacto de la miniatura y segundos iniciales del audiovisual.",
      comoMide: "Suma las 'reproducciones_video_3s' de todos los anuncios y las divide entre la suma de 'impresiones' mostradas a pantalla, expresándolo porcentualmente.",
      porQueMide: "Porque el scroll en redes es hostil e instantáneo. Si un video tiene menos del 20% de Hook Rate, indica que el gancho falló y el mensaje central nunca será escuchado."
    },
    {
      name: "Hold Rate (Tasa de Retención a 15s)",
      category: "Contenido & Video",
      formula: "(Reproducciones de 15 segundos / Impresiones) * 100",
      desc: "Indica si la narrativa y edición del anuncio es capaz de arrastrar al espectador hasta consumir el pilar central del mensaje comercial.",
      sirvePara: "Evaluar la calidad y el ritmo de persuasión de la narrativa media de la pieza audiovisual.",
      mide: "La permanencia voluntaria de los usuarios consumiendo el material comercial sin saltarlo por más de quince segundos.",
      comoMide: "Divide el consolidado métrico diario de 'reproducciones_video_15s' de las plataformas de anuncios entre las 'impresiones' de ese periodo.",
      porQueMide: "Un alto Hook Rate convence al click, pero un excelente Hold Rate convence a la mente del cliente. Resuelve ganchos que solo aportan visitas vacías sin venta."
    },
    {
      name: "Top 5 Tallas Más Vendidas",
      category: "Inventario & Operativa",
      formula: "Suma agrupada de m_ventas.cantidad agrupada por m_productos.talla desc (Límite: 5)",
      desc: "Predice la curva exacta de distribución física por talla para evitar stock retenido y planificar reposiciones exactas al proveedor.",
      sirvePara: "Orientar al departamento de compras sobre las medidas industriales de calzado o ropa de mayor rotación comercial.",
      mide: "El volumen físico de mercancía comercializada segmentada directamente por talla del vestuario.",
      comoMide: "Suma las unidades vaciadas en 'cantidad' de 'm_ventas', aplicando un agrupador SQL/TypeScript basado en el campo 'talla' de catálogo de productos.",
      porQueMide: "Previene la acumulación pasiva de stock ocioso en tallas extremas (ej: muy pequeñas o muy grandes) y optimiza el flujo de caja inyectándolo en las tallas más demandadas."
    },
    {
      name: "Top 5 Colores Más Vendidos",
      category: "Inventario & Ventas",
      formula: "Suma agrupada de m_ventas.ingreso_bruto por m_productos.color desc (Límite: 5)",
      desc: "Analiza el gusto estético del mercado nacional mapeando variantes cromáticas de calzado o ropa que aportan mayor volumen monetario.",
      sirvePara: "Conocer la tendencia cromática dominante y guiar los próximos diseños y órdenes de confección o importación.",
      mide: "La masa de ingresos acumulados asociada directamente a variaciones cromáticas de productos físicos.",
      comoMide: "Agrupa y suma los valores en 'ingreso_bruto' de ventas asociándolos con el color maestro definido en 'm_productos', arrojando el Top 5 comercial.",
      porQueMide: "Asegura la sintonía absoluta con los gustos estéticos estacionales de los clientes venezolanos, minimizando inventarios lentos."
    },
    {
      name: "Matriz de Calor: Formato de Anuncio vs Talla",
      category: "Inteligencia Cruzada",
      formula: "Suma de m_ventas.ingreso_bruto cruzando m_productos.talla frente a m_proyectos_creativos.formato",
      desc: "Cruza la dimensión de distribución física (Talla) con el canal publicitario que detonó el clic (ej: Reels 9:16 vs Post estático). Revela combinaciones de alto volumen comercial.",
      sirvePara: "Identificar si tipos específicos de creativos publicitarios atraen a segmentos físicos particulares.",
      mide: "El rendimiento de facturación cruzando variables de catálogo con variables multimedia de marketing.",
      comoMide: "Construye un mapa bidimensional coloreando condicionalmente las intersecciones de suma de ingresos entre tallas (filas) y formatos de anuncio (columnas).",
      porQueMide: "Muestra hallazgos invisibles: ej. si los Reels de humor UGC venden tallas para caballero y las fotos estáticas sobrias venden tallas de dama. Permite segmentar el presupuesto."
    },
    {
      name: "Alerta de Stock Bajo (Quiebre de Suministro)",
      category: "Inventario & Suministro",
      formula: "Alertas visuales si m_productos.stock_disponible < 5",
      desc: "Monitoreo en tiempo real de almacén. Previene pérdidas comerciales disparando avisos instantáneos de reorden de mercancía al área de compras.",
      sirvePara: "Automatizar la advertencia temprana sobre la inminente ruptura de stock de productos sumamente cotizados.",
      mide: "Las unidades físicas exactas remanentes en las estanterías de empaque por cada SKU.",
      comoMide: "Genera un filtro lógico dinámico que reporta de manera resaltada en color rojo los identificadores donde la columna 'stock_disponible' es inferior a 5 unidades.",
      porQueMide: "Un producto exitoso sin stock arruina la pauta comercial y debilita de inmediato el flujo de ventas estables. Reabastecer a tiempo protege el crecimiento."
    },
    {
      name: "Matriz de Afinidad (Segmentación vs Comprador)",
      category: "Marketing Inteligente",
      formula: "Comparativa cruzada: Gasto en m_marketing.segmento_interno vs Ventas acumuladas de m_clientes.intereses_clave",
      desc: "Compara si el dinero de los anuncios orientados a ciertos públicos atrae verdaderamente a compradores con perfiles de compra compatibles. Evita quemar capital publicitario.",
      sirvePara: "Validar la precisión quirúrgica del algoritmo publicitario y la coherencia del equipo de pauta.",
      mide: "La correlación de afinidad real entre la audiencia pagadora elegida y los intereses empíricos del comprador final.",
      comoMide: "Mapea las audiencias de pauta del Meta Manager que generaron el tráfico contra los de 'intereses_clave' registrados por los operadores en el CRM.",
      porQueMide: "Evita el desperdicio publicitario. Si gastas presupuesto en la segmentación 'Moda Fitness' pero el 90% de tus ventas las cierran clientes amantes de 'Comodidad en Oficina', debes reenfocar los anuncios de inmediato."
    },
    {
      name: "Tabla de Eficiencia por Creativo",
      category: "Contenido & Video",
      formula: "Mesa cruzada por ID_Contenido (Formato, Gasto, Conversiones, ROAS, CPA = Gasto / Ventas)",
      desc: "El panel táctico definitivo de optimización. Ordena los videos activos por rendimiento financiero para apagar piezas deficientes y duplicar ganadores.",
      sirvePara: "Determinar con frialdad matemática qué piezas audiovisuales específicas están aportando ganancia y cuáles queman recursos.",
      mide: "El desglose presupuestario y transaccional indexado por cada pieza publicitaria ('id_creativo') cargada.",
      comoMide: "Cruza el ID de contenido pautado de la tabla 'm_marketing' con la facturación y la tabla de producción para calcular el Costo Por Adquisición (CPA) y ROAS individual.",
      porQueMide: "Es la brújula diaria del analista de medios digitales. Al identificar creativos obsoletos o caros, se pueden pausar permitiendo migrar presupuesto a las piezas ganadoras en caliente."
    },
    {
      name: "Gráfico de Dispersión: Hook Rate vs ROAS",
      category: "Inteligencia Creativa",
      formula: "Coordenadas [Eje X: hook_rate, Eje Y: ROAS, Eje Z / Diámetro: gasto_publicitario]",
      desc: "Identifica si un alto nivel de detención visual (Hook Rate) se traduce verdaderamente en ingresos reales (ROAS). Sirve para calibrar si el video tiene mucho entretenimiento pero bajo gancho de venta.",
      sirvePara: "Calibrar si los videos con ganchos espectaculares realmente convencen a la persona de comprar o si solo aportan clics curiosos.",
      mide: "La correlación estadística espacial entre enganche a tres segundos y rendimiento financiero.",
      comoMide: "Traza de forma interactiva una matriz de dispersión donde cada anuncio es una burbuja. Su eje horizontal es el Hook Rate, el eje vertical es el ROAS y el volumen representa el gasto publicitario acumulado.",
      porQueMide: "Permite aislar videos clickbaits de videos meramente comerciales de alta conversión. Evita celebrar videos con millones de vistas pero cero ventas de calzado."
    },
    {
      name: "Mapa Coroplético de Venezuela de Ventas",
      category: "Cobertura Geográfica",
      formula: "Suma agrupada de m_ventas.ingreso_bruto según el estado_logistico del m_clientes",
      desc: "Asigna un mapa térmico nacional coloreado de menor a mayor intensidad, localizando las regiones geográficas con mayor volumen de compra real y última milla.",
      sirvePara: "Visualizar y priorizar geográficamente los mercados de mayor demanda corporativa.",
      mide: "La densidad comercial de facturación neta clasificada por demarcación territorial de entrega.",
      comoMide: "Consolida las ventas agrupándolas por el campo 'estado_logistico' de la dirección del cliente, proyectándolas en un gráfico de calor nacional.",
      porQueMide: "Excelente para negociar mejores fletes y alianzas con agencias de envío en estados clave, ó bien desplegar tiendas físicas en los polos de mayor renta."
    },
    {
      name: "Mapa de Inversión Publicitaria",
      category: "Cobertura Geográfica",
      formula: "Suma de m_marketing.gasto según segmentaciones geográficas representadas",
      desc: "Representa territorialmente la masa de audiencia alcanzada y pagada en campañas. Al compararse con el Mapa de Ventas, diagnostica fugas de presupuesto en estados inactivos.",
      sirvePara: "Monitorear en qué zonas geográficas estamos concentrando la mayor parte de la pauta pagada en Meta o TikTok.",
      mide: "El presupuesto de marketing diario consumido regionalmente.",
      comoMide: "Acumula el gasto de anuncios filtrado por las regiones geográficas de exclusión e inclusión aplicadas dentro de la configuración de campaña.",
      porQueMide: "Al cruzarlo visualmente contra el Mapa de Ventas, revela ineficiencias de segmentación profunda: ej: si se está pautando masivamente en Bolívar pero las ventas provienen de Maracaibo, hay que reajustar los radios de ads."
    },
    {
      name: "CTR (Click-Through Rate / Tasa de Clic)",
      category: "Publicidad",
      formula: "(Clics en Enlace / Impresiones) * 100",
      desc: "Mapea el interés de la oferta. Del total de personas que vieron la miniatura o video del anuncio en redes, cuántas decidieron hacer click directo.",
      sirvePara: "Mapear el nivel de interés comercial que despierta la oferta o el gancho visual del anuncio en la audiencia fría.",
      mide: "El porcentaje de personas impactadas que ejecutan una acción directa de redirección o clic al ver el anuncio.",
      comoMide: "Divide los 'clics_enlace' recibidos por un anuncio en 'm_marketing' entre el volumen neto de 'impresiones' registradas en el feed.",
      porQueMide: "Es el indicador directo de la relevancia de nuestro mensaje. Si el CTR es bajo (<1.5%), significa que el producto no convence, el copy es vago ó el calzado se ve poco atractivo."
    },
    {
      name: "CPM (Costo por Mil Impresiones)",
      category: "Publicidad",
      formula: "(Gasto Publicitario / Impresiones) * 1000",
      desc: "Monitorea la inflación publicitaria en las subastas de Meta/TikTok. Indica qué tan costosa ó barata es la competencia visual por el espacio en las pantallas.",
      sirvePara: "Monitorear la competitividad industrial de las subastas publicitarias en los nichos de clientes pretendidos.",
      mide: "La tarifa monetaria en dólares necesaria para desplegar mil impactos de anuncio en pantallas de usuarios venezolanos.",
      comoMide: "Toma el 'gasto' publicitario diario, lo divide entre las 'impresiones' absolutas y normaliza el resultado multiplicándolo por mil.",
      porQueMide: "Permite identificar anomalías del mercado. Si el CPM sube drásticamente, advierte sobre alta saturación por eventos estacionales (Navidad/Black Friday) ó cansancio del público."
    },
    {
      name: "Creative Fatigue (Fatiga de Creativo)",
      category: "Creativos & Anuncios",
      formula: "Frecuencia > 3.5 en el mismo grupo de anuncios combinada con caída de CTR > 20%",
      desc: "Alerta automática que detecta agotamiento de audiencia. Sucede cuando el público objetivo ha visto el mismo video demasiadas veces y deja de hacer clics.",
      sirvePara: "Prevenir pérdidas de flujo de caja protegiendo el embudo de saturación de audiencia.",
      mide: "La tasa de decaimiento del CTR en proporción al incremento repetitivo del promedio de visualizaciones por persona.",
      comoMide: "Mide si la frecuencia supera un promedio de 3.5 impactos repetidos por perfil; si detecta caída de un 20% en CTR histórico, levanta la alerta de desactivación.",
      porQueMide: "Porque retener anuncios repetitivos irrita al público y triplica paulatinamente los costos operativos del cierre. Fuerza la renovación constante de creativos."
    },
    {
      name: "CPW (Costo por Chat de WhatsApp)",
      category: "Marketing Directo",
      formula: "Gasto Publicitario Diario / Conversaciones Nuevas Registradas en WhatsApp",
      desc: "Métrica estrella del embudo interactivo. Calcula cuánto dinero del gasto publicitario cuesta generar un prospecto calificado que inicie un chat real.",
      sirvePara: "Conocer el costo de adquisición de prospectos directos entregados en tiempo real a los operadores de WhatsApp.",
      mide: "El costo unitario promedio en USD por cada canal conversacional nuevo abierto de pauta comercial.",
      comoMide: "Divide la inversión de gasto destinada a campañas de captación entre el volumen de 'leads_registrados' cargado por día.",
      porQueMide: "Es el latido del equipo comercial. Si el CPW supera el umbral rentable diario (ej: mayor a $1.20), el volumen de chats para los cerradores decrecerá, limitando la conversión de ventas."
    },
    {
      name: "ROI de Producción Creativa (ROI-C)",
      category: "Contenido & Video",
      formula: "(Ventas Atribuidas al Cortometraje / Costo Total de Realización) * 100",
      desc: "Mide de manera aislada la ganancia de pautar rodajes con modelos, UGCs organizados ó directores independientes, determinando su viabilidad económica.",
      sirvePara: "Evitar de forma estricta los denominados 'gastos de vanidad' estéticos de producción multimedia sin retorno de caja.",
      mide: "El retorno financiero integral basado exclusivamente en la facturación que atribuye su origen al material creativo.",
      comoMide: "Consolida las ventas cerradas asociadas a un 'id_creativo' y divide este volumen comercial entre el 'costo_produccion' neto de la ficha multimedia.",
      porQueMide: "Proporciona bases racionales para justificar e incentivar mayores presupuestos de grabación con creadores profesionales que aporten alta conversión monetaria real."
    },
    {
      name: "Tasa de Devolución Logística",
      category: "Logística",
      formula: "(Despachos con estatus 'Retornado' / Envíos Totales Realizados) * 100",
      desc: "Diagnostica ineficacia administrativa por envíos de última milla fallidos (dirección incorrecta, cliente inubicable, demoras en el transporte).",
      sirvePara: "Identificar fallas graves en la preventa, la logística de última milla o la selección de paqueteras asociadas.",
      mide: "La ineficiencia operativa de paquetes enviados al detal que no pudieron ser entregados con éxito.",
      comoMide: "Divide el número de envíos asignados en 'm_despachos_y_devoluciones' con estado 'Retornado' entre el número total de envíos consolidados del mes.",
      porQueMide: "Las devoluciones destruyen el margen de ganancia operativa, pues implican pagar fletes o despachos perdidos de ida y de vuelta. Alerta si es necesario depurar agencias o confirmar mejor por WhatsApp antes de enviar."
    },
    {
      name: "LTV (Customer Lifetime Value)",
      category: "Fidelización",
      formula: "Ticket Promedio * Frecuencia de Compra * Vida Útil Promedio de la Cuenta",
      desc: "Representación monetaria del valor de vida del comprador. Proyecta cuánto presupuesto total inyectará el cliente habitual al negocio a lo largo del tiempo.",
      sirvePara: "Establecer presupuestos de captación (CAC límite) lógicos y predecir el flujo continuo sin depender eternamente de nueva publicidad.",
      mide: "El flujo bruto promedio derivado de un comprador a lo largo de su interacción con la marca.",
      comoMide: "Multiplica el valor del 'ticket_promedio_historico' en el CRM por la 'frecuencia_de_compra' media grupal estandarizada.",
      porQueMide: "Porque captar un cliente cuesta caro. La verdadera fortuna reside en la recurrencia. Este número le dice al equipo comercial que vale la pena cuidar cada detalle de soporte posventa."
    }
  ];

  const categories = ['todos', 'Estrategia Global', 'Finanzas', 'Ecosistema de Ads', 'CRM & Adquisición', 'Contenido & Video', 'Inventario & Operativa', 'Inventario & Ventas', 'Inteligencia Cruzada', 'Inventario & Suministro', 'Marketing Inteligente', 'Cobertura Geográfica', 'Publicidad', 'Creativos & Anuncios', 'Marketing Directo', 'Logística', 'Fidelización'];

  const filteredKpis = kpis.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          kpi.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          kpi.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || kpi.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownloadMarkdown = () => {
    let md = `# MANUAL ANALÍTICO DETALLADO: DICCIONARIO DE DATOS Y KPIs - KICKS ERP\n`;
    md += `**Organización**: KICKS E-Commerce S.A.  \n`;
    md += `**Fecha de Generación**: ${new Date().toLocaleDateString('es-ES')}  \n`;
    md += `**Versión**: 1.5 (Trazabilidad Multi-Atributos de Inventario y KPIs)  \n\n`;
    md += `Este manual ha sido descargado dinámicamente desde el sistema KICKS ERP.\n\n`;

    md += `## 1. ESQUEMAS RELACIONALES DE LA BASE DE DATOS\n\n`;
    tables.forEach(t => {
      md += `### Tabla: ${t.name}\n`;
      md += `*${t.description}*\n\n`;
      md += `* **¿Para qué sirve?**: ${t.sirvePara}  \n`;
      md += `* **¿Para qué se usó?**: ${t.seUso}  \n`;
      md += `* **¿Por qué se creó?**: ${t.porQueSeCreo}  \n\n`;
      md += `| Columna | Tipo de Dato | Descripción Funcional y Relacional |\n`;
      md += `| :--- | :--- | :--- |\n`;
      t.columns.forEach(c => {
        md += `| **${c.name}** | \`${c.type}\` | ${c.desc} |\n`;
      });
      md += `\n---\n\n`;
    });

    md += `## 2. GLOSARIO ANALÍTICO KPI - 22 MÉTRICAS CLAVE\n\n`;
    kpis.forEach((kpi, idx) => {
      md += `### KPI ${idx + 1}: ${kpi.name}\n`;
      md += `* **Categoría**: ${kpi.category}  \n`;
      md += `* **Fórmula / Origen transaccional**: \`${kpi.formula}\`  \n`;
      md += `* **Descripción**: *"${kpi.desc}"*\n\n`;
      md += `#### A. ¿Para qué sirve? (Funcionalidad analítica)\n${kpi.sirvePara}\n\n`;
      md += `#### B. ¿Qué mide? (Propósito estadístico directo)\n${kpi.mide}\n\n`;
      md += `#### C. ¿Cómo lo mide? (Fórmula y origen transaccional relacional)\n${kpi.comoMide}\n\n`;
      md += `#### D. ¿Por qué lo mide? (Visión estratégica empresarial de toma de decisiones)\n${kpi.porQueMide}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "KICKS_Diccionario_KPIs.md");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col h-full font-sans animate-fade-in relative">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between bg-stone-50 gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            Diccionario de Datos y Métricas (KPIs)
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-1 leading-relaxed">
            Documentación técnica referencial de módulos de bases de datos y cálculo oficial de los <span className="font-extrabold text-black">22 KPIs estratégicos</span> de KICKS.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0 flex-wrap no-print">
          <div className="flex bg-stone-200 p-1 rounded-lg">
             <button
               onClick={() => setActiveView('tables')}
               className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-md flex items-center gap-2 transition-all ${activeView === 'tables' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'}`}
             >
               <Table2 className="w-3.5 h-3.5" /> Entidades de Base de Datos
             </button>
             <button
               onClick={() => setActiveView('kpis')}
               className={`px-4 py-2 text-xs uppercase font-bold tracking-wider rounded-md flex items-center gap-2 transition-all ${activeView === 'kpis' ? 'bg-white text-black shadow-xs' : 'text-gray-600 hover:text-black'}`}
             >
               <TrendingUp className="w-3.5 h-3.5" /> Glosario Analítico KPI (22)
             </button>
          </div>
          <button
            onClick={handleDownloadMarkdown}
            className="px-4 py-2 text-xs uppercase font-black tracking-wider rounded-lg flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white border border-transparent shadow-sm transition-all"
            title="Descargar Diccionario Completo en Archivo Markdown (.md) robusto"
          >
            <BookOpen className="w-4 h-4 text-yellow-400" /> Descargar (.MD)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-xs uppercase font-black tracking-wider rounded-lg flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border border-black shadow-sm transition-all"
            title="Exportar Reporte Completo a PDF para impresión"
          >
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      <div className="p-6 lg:p-8 overflow-y-auto">
        {activeView === 'tables' ? (
          <div className="space-y-8 animate-fade-in">
            <div className="mb-4">
               <h3 className="text-sm font-bold uppercase tracking-widest text-black border-l-4 border-yellow-400 pl-3">Arquitectura de Tablas Transaccionales</h3>
               <p className="text-xs text-gray-500 font-mono mt-2 pl-4">El sistema opera en una robusta estructura relacional consolidando inventario, clientes, ventas, creativos, logística y egresos directos en modelos (Types) principales de PostgreSQL.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tables.map((t, index) => (
                <div key={index} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="bg-stone-50 border-b border-gray-200 px-5 py-4">
                       <p className="text-xs font-mono font-black text-black uppercase tracking-tight">{t.name}</p>
                       <p className="text-[11px] text-gray-500 mt-1 leading-relaxed font-semibold">{t.description}</p>
                    </div>

                    {/* Las tres preguntas estratégicas del módulo */}
                    <div className="p-4 border-b border-stone-100 bg-stone-50/40 space-y-2.5">
                       <div className="p-3 bg-white rounded-lg border border-stone-100 shadow-3xs">
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-blue-600 flex items-center gap-1.5 font-mono">
                             <HelpCircle className="w-3.5 h-3.5" /> ¿Para qué sirve?
                          </p>
                          <p className="text-[11px] text-stone-700 leading-relaxed font-semibold mt-1 font-sans">{t.sirvePara}</p>
                       </div>
                       <div className="p-3 bg-white rounded-lg border border-stone-100 shadow-3xs">
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 font-mono">
                             <CheckCircle className="w-3.5 h-3.5" /> ¿Para qué se usó?
                          </p>
                          <p className="text-[11px] text-stone-700 leading-relaxed font-semibold mt-1 font-sans">{t.seUso}</p>
                       </div>
                       <div className="p-3 bg-white rounded-lg border border-stone-100 shadow-3xs">
                          <p className="text-[9px] font-extrabold uppercase tracking-widest text-[#7c3aed] flex items-center gap-1.5 font-mono">
                             <Star className="w-3.5 h-3.5" /> ¿Por qué se creó?
                          </p>
                          <p className="text-[11px] text-stone-700 leading-relaxed font-semibold mt-1 font-sans">{t.porQueSeCreo}</p>
                       </div>
                    </div>

                    <div className="p-0 overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-stone-100 border-b border-gray-200 text-[10px] uppercase text-gray-600 font-black">
                            <th className="py-2.5 px-4 font-bold w-1/3">Columna</th>
                            <th className="py-2.5 px-4 font-bold w-1/4">Tipo de Dato</th>
                            <th className="py-2.5 px-4 font-bold">Resumen Técnico</th>
                          </tr>
                        </thead>
                        <tbody className="text-xs font-mono">
                          {t.columns.map((c, idx) => (
                            <tr key={idx} className="border-b border-stone-100 hover:bg-yellow-50/20 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-black border-r border-stone-100">{c.name}</td>
                              <td className="py-2.5 px-4 text-emerald-600 border-r border-stone-100 font-medium">{c.type}</td>
                              <td className="py-2.5 px-4 text-gray-600 font-medium whitespace-pre-wrap">{c.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50 p-5 rounded-xl border border-gray-200">
               <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-yellow-100 rounded-lg text-yellow-600">
                     <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-black">Motor de KPIs Unificado</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Fórmulas y desglose táctico para auditar y potenciar el rendimiento del negocio.</p>
                  </div>
               </div>
               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                 {/* Search bar */}
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input
                     type="text"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Buscar KPI por texto..."
                     className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-xs font-sans w-full md:w-56 focus:outline-none focus:border-black"
                   />
                 </div>
                 {/* Category Selector */}
                 <div className="relative flex items-center bg-white border border-gray-200 rounded-lg px-2.5">
                   <SlidersHorizontal className="w-3.5 h-3.5 text-gray-450 mr-2 shrink-0" />
                   <select
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="py-2 pr-4 bg-transparent outline-none text-xs text-stone-700 font-bold cursor-pointer"
                   >
                     {categories.map((cat, idx) => (
                       <option key={idx} value={cat}>{cat === 'todos' ? 'Todas las Áreas' : cat}</option>
                     ))}
                   </select>
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredKpis.map((kpi, idx) => {
                const kpiIndex = kpis.findIndex(k => k.name === kpi.name);
                const isExpanded = expandedKpi === kpiIndex;
                return (
                  <div 
                    key={idx} 
                    className={`rounded-xl border bg-white shadow-xs hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between overflow-hidden cursor-pointer ${isExpanded ? 'border-black ring-1 ring-black' : 'border-gray-200'}`}
                    onClick={() => setExpandedKpi(isExpanded ? null : kpiIndex)}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <span className="shrink-0 text-[9px] uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded text-gray-700 font-black border border-stone-200">
                          {kpi.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-mono text-stone-400 font-bold uppercase">Clave-{kpiIndex + 1}</span>
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-black leading-snug uppercase tracking-tight mb-2 flex items-center justify-between">
                        {kpi.name}
                        <Zap className={`w-3.5 h-3.5 shrink-0 ${isExpanded ? 'text-yellow-500 fill-yellow-400' : 'text-stone-300 group-hover:text-amber-500 transition-colors'}`} />
                      </h4>

                      <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3 line-clamp-3">
                        {kpi.desc}
                      </p>

                      <div className="p-3 bg-yellow-50/70 border border-yellow-200/60 rounded-lg">
                        <p className="text-[9px] font-mono text-yellow-800 uppercase tracking-widest font-black mb-1 flex items-center gap-1">
                          Calculado vía:
                        </p>
                        <p className="text-[11px] font-mono text-stone-900 font-bold break-words">
                          {kpi.formula}
                        </p>
                      </div>
                    </div>

                    {/* Collapsible Analytica Block */}
                    <div className={`border-t bg-stone-50 border-stone-200 flex flex-col transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-[500px] opacity-100 p-5' : 'max-h-0 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
                       <div className="space-y-4">
                         <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                           <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                             <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                             ¿Para qué sirve?
                           </p>
                           <p className="text-xs text-stone-700 font-semibold leading-relaxed">{kpi.sirvePara}</p>
                         </div>

                         <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                           <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                             <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                             ¿Qué mide?
                           </p>
                           <p className="text-xs text-stone-700 font-semibold leading-relaxed">{kpi.mide}</p>
                         </div>

                         <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                           <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                             <TrendingUp className="w-3.5 h-3.5 text-yellow-500" />
                             ¿Cómo lo mide?
                           </p>
                           <p className="text-xs text-stone-700 font-semibold leading-relaxed">{kpi.comoMide}</p>
                         </div>

                         <div className="bg-white p-3 rounded-lg border border-stone-200 shadow-xs">
                           <p className="text-[10px] font-bold text-black uppercase tracking-wider mb-1 flex items-center gap-1.5">
                             <Star className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
                             ¿Por qué lo mide?
                           </p>
                           <p className="text-xs text-stone-700 font-semibold leading-relaxed">{kpi.porQueMide}</p>
                         </div>
                       </div>
                    </div>

                    <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 text-right flex items-center justify-between">
                      <span className="text-[10px] font-semibold font-mono text-stone-500 transition-colors uppercase">
                        {isExpanded ? 'Haga clic para plegar' : 'Haga clic para ver desglose técnico completo'}
                      </span>
                      <span className="text-[10px] font-black uppercase text-black font-mono">
                        {isExpanded ? '▲ CERRAR' : '▼ DESPLEGAR'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredKpis.length === 0 && (
              <div className="p-12 text-center border border-dashed border-gray-200 rounded-xl bg-stone-50">
                 <ShieldAlert className="w-8 h-8 text-stone-400 mx-auto mb-3 animate-bounce" />
                 <p className="text-sm text-stone-750 font-black uppercase leading-tight">No se encontró ninguna métrica activa</p>
                 <p className="text-xs text-stone-500 font-mono mt-1">Pruebe modificando los términos del buscador o limpie el filtro de áreas de negocio.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= ESTILOS Y CONTENEDOR EXCLUSIVO PARA IMPRESIÓN/PDF ================= */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* Desactivar toda la app en pantalla ordinaria y proteger el fondo blanco de impresión */
          body {
            background: white !important;
            color: black !important;
            font-size: 11px !important;
            padding: 0px !important;
            margin: 0px !important;
          }
          
          /* Ocultar la app general pero mantener visible el contenedor de impresión */
          body * {
            visibility: hidden;
            height: 0;
            overflow: hidden;
          }
          
          .print-full-dictionary, .print-full-dictionary * {
            visibility: visible !important;
            height: auto !important;
            overflow: visible !important;
          }

          .print-full-dictionary {
            position: absolute !important;
            left: 0px !important;
            top: 0px !important;
            width: 100% !important;
            display: block !important;
            padding: 20px !important;
          }
          
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-bottom: 25px !important;
            page-break-inside: avoid !important;
          }

          .print-table th, .print-table td {
            border: 1px solid #d1d5db !important;
            padding: 6px 8px !important;
            text-align: left !important;
          }

          .print-card {
            border: 1px solid #e5e7eb !important;
            border-radius: 8px !important;
            padding: 18px !important;
            margin-bottom: 20px !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            background: #fafaf9 !important;
          }

          .print-section-title {
            font-size: 16px !important;
            font-weight: 800 !important;
            border-bottom: 2px solid #000000 !important;
            padding-bottom: 6px !important;
            margin-top: 30px !important;
            margin-bottom: 15px !important;
            text-transform: uppercase !important;
          }

          .print-page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      `}} />

      {/* HTML visible únicamente en impresión física / exportación PDF */}
      <div className="hidden print:block print-full-dictionary font-sans text-black leading-relaxed">
        {/* Portada del Reporte */}
        <div className="text-center py-10 mb-8 border-b-4 border-black">
          <h1 className="text-2xl font-black uppercase tracking-tight">KICKS ERP - Reporte Ejecutivo</h1>
          <p className="text-lg font-bold text-stone-700 uppercase tracking-widest mt-1">Diccionario de Datos y Glosario Analítico KPI</p>
          <div className="text-xs font-mono text-gray-500 mt-4 space-y-1">
            <p><strong>Organización:</strong> KICKS E-Commerce S.A.</p>
            <p><strong>Fecha de Generación:</strong> {new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Versión:</strong> 1.4 (Soporte Multi-Atributos de Inventario y 22 KPIs)</p>
          </div>
        </div>

        {/* Sección 1: Base de Datos */}
        <h2 className="print-section-title">1. Arquitectura del Modelo Relacional de Datos</h2>
        <p className="text-xs text-gray-600 mb-6 font-medium">
          El ecosistema operativamente estructurado de KICKS se compone de las siguientes entidades primarias. Las claves foráneas garantizan coherencia relacional para el cálculo exacto de métricas comerciales, logísticas e inventarios.
        </p>

        {tables.map((t, index) => (
          <div key={index} className="print-table-container mb-8">
            <h3 className="text-sm font-black uppercase tracking-tight text-black mt-4 mb-2">Tabla: {t.name}</h3>
            <p className="text-xs text-stone-700 italic mb-3 font-semibold">"{t.description}"</p>
            
            {/* Las tres preguntas clave integradas en el flujo del PDF imprimible */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-sans">
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <strong className="block text-[10px] text-blue-800 uppercase tracking-wider mb-1 font-mono">¿Para qué sirve?</strong>
                <p className="text-stone-850 font-medium leading-relaxed">{t.sirvePara}</p>
              </div>
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <strong className="block text-[10px] text-emerald-800 uppercase tracking-wider mb-1 font-mono">¿Para qué se usó?</strong>
                <p className="text-stone-850 font-medium leading-relaxed">{t.seUso}</p>
              </div>
              <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                <strong className="block text-[10px] text-purple-800 uppercase tracking-wider mb-1 font-mono">¿Por qué se creó?</strong>
                <p className="text-stone-850 font-medium leading-relaxed">{t.porQueSeCreo}</p>
              </div>
            </div>

            <table className="print-table">
              <thead>
                <tr className="bg-stone-150 text-[10px] font-bold uppercase font-mono">
                  <th style={{ width: '30%' }}>Columna</th>
                  <th style={{ width: '20%' }}>Tipo</th>
                  <th>Descripción Funcional y Relacional</th>
                </tr>
              </thead>
              <tbody>
                {t.columns.map((c, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="font-bold font-mono">{c.name}</td>
                    <td className="text-emerald-750 font-semibold font-mono">{c.type}</td>
                    <td>{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Salto de página para comenzar los KPIs en una hoja nueva */}
        <div className="print-page-break" />

        {/* Sección 2: KPIs */}
        <h2 className="print-section-title">2. Glosario de KPIs Estratégicos Unificados (22 Métricas)</h2>
        <p className="text-xs text-gray-600 mb-6 font-medium">
          A continuación, se catalogan de forma oficial los 22 Indicadores Clave de Rendimiento (KPIs) implementados en los tableros analíticos de KICKS, desglosando valor de negocio, propósitos estadísticos directos y fórmulas de cálculo.
        </p>

        <div className="space-y-6">
          {kpis.map((kpi, index) => (
            <div key={index} className="print-card border border-stone-300">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-stone-200">
                <span className="text-[10px] font-black uppercase tracking-widest bg-stone-200 px-2 py-0.5 rounded text-stone-800">
                  {kpi.category}
                </span>
                <span className="text-[10px] font-black font-mono text-stone-500">MÉTRICA CLAVE - {index + 1}</span>
              </div>
              
              <h3 className="text-sm font-black uppercase tracking-tight text-black mb-2">{kpi.name}</h3>
              <p className="text-xs text-stone-700 italic mb-3 font-medium">"{kpi.desc}"</p>
              
              <div className="grid grid-cols-1 gap-2 mb-3">
                <div className="bg-white p-2.5 rounded border border-stone-200 font-mono text-xs">
                  <strong className="text-amber-800 tracking-wider">FÓRMULA / ORIGEN:</strong> <span className="text-stone-900 font-bold">{kpi.formula}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <strong className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">¿Para qué sirve?</strong>
                  <p className="text-stone-800 font-medium leading-normal">{kpi.sirvePara}</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <strong className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">¿Qué mide?</strong>
                  <p className="text-stone-800 font-medium leading-normal">{kpi.mide}</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <strong className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">¿Cómo lo mide?</strong>
                  <p className="text-stone-800 font-medium leading-normal">{kpi.comoMide}</p>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <strong className="block text-[10px] text-stone-500 uppercase tracking-wider mb-1">¿Por qué lo mide?</strong>
                  <p className="text-stone-800 font-medium leading-normal">{kpi.porQueMide}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
