# MANUAL ANALÍTICO DETALLADO: DICCIONARIO DE DATOS Y KPIs - KICKS ERP
---
**Organización**: KICKS E-Commerce S.A.
**Fecha de Publicación**: Junio de 2026
**Versión**: 1.5 (Soporte Multi-Atributos con Modelo, Colección y Precio Promo)
**Documento de Control Técnico y Estratégico**

Este manual compila la arquitectura relacional de la base de datos de **KICKS ERP**, explica detalladamente la lógica de sus **8 Módulos Operativos** (empleando la estructura analítica de 5 preguntas) y cataloga oficialmente sus **22 Indicadores Clave de Rendimiento (KPIs)** con la estructura estadística de 4 preguntas.

---

## PARTE I: ANÁLISIS ESTRATÉGICO DE LOS 8 MÓDULOS DEL ERP

### MÓDULO 1: DASHBOARD GLOBAL (Torre de Control)

#### 1. ¿Para qué sirve?
Sirve como la "torre de control" unificada del negocio. Es una pantalla diseñada para el equipo de dirección y toma de decisiones que necesitan ver la salud general de la empresa en un solo vistazo, sin perderse en el micro-detalle de las transacciones diarias. Reúne los datos financieros, logísticos, publicitarios y de producción creativa en un solo flujo inteligente.

#### 2. ¿Cuál es su función?
Su función principal es **centralizar y correlacionar datos**. En lugar de tener la información aislada (ventas en una hoja, publicidad en otra y inventario en un software de depósito), el Dashboard cruza estas fuentes en tiempo real para mostrar la rentabilidad verdadera. Responde diariamente a preguntas críticas como: *¿Cuánto dinero gastamos hoy en anuncios versus cuánto ingresó en la cuenta? ¿Estamos operando con ganancias netas tras deducir costos de producto y fletes?*

#### 3. ¿Qué mide?
- **Ventas Consolidadas**: El valor total acumulado del ingreso bruto.
- **Margen y Utilidad Financiera Real (Margen Neto)**: Qué porción de los ingresos queda como beneficio libre después de restar los costos de adquisición de la mercancía, gastos de flete y egresos operativos.
- **Eficacia Publicitaria Consolidada (ROAS & CPM)**: El rendimiento global de los canales de adquisición (Meta Ads, TikTok Ads, etc.).
- **Volumen de Tráfico y Captación**: Total de clics a enlaces y cantidad de chats de WhatsApp creados.
- **Alertas de Operaciones**: Cantidad de SKUs en nivel crítico de inventario y pedidos pendientes de despacho logístico.

#### 4. ¿Cómo lo hace?
- **Agregación en Caliente**: El módulo extrae los datos de las tablas transaccionales de ventas (`m_ventas`), gastos (`m_gastos`), logística y marketing.
- **Consultas Relacionales de Cruce**: Asocia cada venta con el costo de su SKU correspondiente (`m_productos`) para calcular la utilidad bruta en milisegundos.
- **Gráficos de Tendencia D3/Recharts**: Muestra líneas de tiempo donde puedes comparar el gasto publicitario frente a la curva de ventas logradas para detectar desfases estacionales.

#### 5. ¿Por qué lo hace?
**Para evitar decisiones a ciegas**: Muchos negocios de calzado y retail facturan montos elevados pero quiebran por falta de liquidez o márgenes reales minúsculos. El Dashboard visibiliza la **utilidad neta real**, lo que evita que la empresa gaste dinero en marketing si el costo operativo o el costo del producto están asfixiando el flujo de caja.

---

### MÓDULO 2: VENTAS (Gestión de Facturación y Canales)

#### 1. ¿Para qué sirve?
Sirve para registrar, fiscalizar y monitorear el flujo de ingresos diario proveniente de todos los canales de venta activos (WhatsApp Call Center, DM Instagram, Tienda Física en Caracas y Bots Automatizados). Es la interfaz central para los cerradores y administradores contables.

#### 2. ¿Cuál es su función?
Su función operativa es la **gestión transaccional limpia**. Permite asentar cada par de calzado vendido, asignándole un folio o `id_venta`, relacionándolo con el cliente (`id_cliente`), descontando el stock correspondiente en caliente, aplicando los métodos de pago (Zelle, Pago Móvil, Efectivo USD) y calculando automáticamente la comisión de pasarela y utilidad neta.

#### 3. ¿Qué mide?
- **Ingreso Bruto de Ventas**: Dinero acumulado sin deducción.
- **Ticket Promedio por Transacción**: El valor promedio monetario de cada compra.
- **Productividad del Operador**: Ventas y metas de cierre logradas por agente.
- **Preferencia de Métodos de Pago**: Distribución porcentual del uso de Zelle, Efectivo o Pago Móvil.
- **Desempeño de Canal comercial**: Ventas atribuidas a WhatsApp, Instagram o punto físico.

#### 4. ¿Cómo lo hace?
- **Asientos relacionales indexados**: Mediante un formulario ágil, el operador vincula un SKU de `m_productos` con un ID de `m_clientes`. El módulo busca el precio de referencia (o `precio_promo` según aplique) y el costo para estructurar el registro contable en la entidad `m_ventas`.

#### 5. ¿Por qué lo hace?
**Para resguardar el margen operativo y evitar la fuga de capitales**: Permite auditar el rendimiento individual del equipo de ventas, monitorear la tasa de cambio empleada para pagos en bolívares (BCV) y asegurar la correspondencia entre lo facturado y las entregas logísticas, eliminando pérdidas por desorden administrativo.

---

### MÓDULO 3: INVENTARIO (Catálogo & Proveedores)

#### 1. ¿Para qué sirve?
Sirve como el almacén digital inteligente del negocio. Permite coordinar la entrada, almacenamiento físico, reserva transaccional y salida de mercancía de KICKS de manera exacta.

#### 2. ¿Cuál es su función?
Su función es mantener la **trazabilidad física quirúrgica del calzado y ropa**. Permite catalogar SKU, código EAN-13, marca, modelo, colección, talla, color, costos de adquisición y ubicación en pasillos/casillas del depósito, previniendo sobreventas por descoordinación.

#### 3. ¿Qué mide?
- **Unidades en Stock Disponible**: Cantidad física libre para venta en estantería.
- **Stock Reservado**: Unidades comprometidas en pedidos aprobados que esperan despacho.
- **Valorización de Inventario**: Costo total de adquisición de la mercancía retenida en depósito.
- **Índice de Rotación**: Frecuencia con la que un SKU se vende por completo.
- **Quiebres de Stock**: SKUs activos con stock disponible por debajo del umbral mínimo de seguridad (`stock_critico`).

#### 4. ¿Cómo lo hace?
- **Integridad transaccional**: Cada vez que se registra una venta, el motor del backend incrementa el `stock_reservado` y descuenta del `stock_disponible`. Permite realizar ajustes manuales rápidos (Tipo: sumar, restar o fijar) con firmas auditables, gestionando las columnas `modelo`, `coleccion` y `precio_promo` recientemente añadidas.

#### 5. ¿Por qué lo hace?
**Para impedir la congelación de capital de trabajo y la pérdida de clientes**: El inventario de retail de moda es altamente estacional (colecciones verano, retro, etc.). Medir la rotación evita comprar calzado que no se vende y alerta tempranamente sobre la falta de tallas estrella para reponer con el proveedor con anticipación.

---

### MÓDULO 4: LOGÍSTICA & DESPACHOS

#### 1. ¿Para qué sirve?
Sirve para orquestar y controlar la cadena de suministro de "última milla". Asegura que los paquetes vendidos lleguen a manos del cliente final a nivel nacional de forma ágil y documentada.

#### 2. ¿Cuál es su función?
Su función principal es la **coordinación de envíos y conciliación logística**. Permite generar órdenes de despacho en la entidad `m_despachos_y_devoluciones`, asignar transportistas o paqueteras (MRW, Zoom, Tealca, Delivery propio en Caracas), rastrear el número de guía, emitir estados de despacho (Pendiente, En Tránsito, Entregado, Retornado) y canalizar devoluciones físicas por talla o modelo.

#### 3. ¿Qué mide?
- **Tiempo de Despacho Promedio**: Lapso entre el cierre de venta y la puesta en paquetería.
- **Efectividad de Entrega**: Porcentaje de despachos entregados al primer intento.
- **Costo de Flete Logístico**: Gasto directo imputado al transporte de paquetes.
- **Volumen de Envíos por Transportista**: Distribución de carga por agencia aérea o terrestre.
- **Tasa de Devoluciones**: Cantidad de paquetes retornados fallidos.

#### 4. ¿Cómo lo hace?
- **Flujos de Estado Operativos**: Mapea relaciones directas entre `m_ventas`, `m_clientes` y los datos internos del despacho. Permite a los operadores actualizar en un solo clic las guías de envío y procesar cambios por defecto o error.

#### 5. ¿Por qué lo hace?
**Para maximizar la satisfacción del cliente y proteger la rentabilidad**: Un cliente que vive en el interior del país juzga a KICKS por la velocidad de entrega. Monitorear los estados optimiza las rutas y el rendimiento de las paqueteras asociadas, limitando el gasto fantasma de fletes dobles por retornos innecesarios.

---

### MÓDULO 5: MARKETING & ADQUISICIÓN

#### 1. ¿Para qué sirve?
Sirve para evaluar la rentabilidad financiera real de la inversión publicitaria en canales como Meta Ads (Facebook/Instagram), TikTok Ads y Google Search, cruzando el gasto del presupuesto publicitario con el volumen de ventas generadas.

#### 2. ¿Cuál es su función?
Su función operativa es la **auditoría de rendimiento publicitario diario**. Centraliza los reportes agregados diarios (impresiones, alcance, gasto en USD, clics, leads registrados en el píxel) y los asocia directamente con los proyectos creativos para calificar científicamente la efectividad del mercadeo.

#### 3. ¿Qué mide?
- **Retorno de la Inversión Publicitaria (ROAS)**: Cuánto dinero regresa en ingresos brutos por cada dólar inyectado en publicidad.
- **Hook Rate**: El porcentaje de atracción inicial del video promocional a los 3 segundos.
- **Hold Rate**: El porcentaje de retención a 15 segundos (interés real del usuario).
- **Costo por Chat Abierto (CPW)**: Tarifa de adquisición de prospectos de WhatsApp.
- **CTR (Click-Through Rate)** y **CPM**: Costos de subasta y tasa de interés general de anuncios.

#### 4. ¿Cómo lo hace?
- **Cruce de Atribución Analítica**: El módulo extrae los registros de la tabla `m_marketing` y los concatena con la tabla `m_ventas` filtrada por fechas para calcular los indicadores agregados en tiempo real e ilustrarlos en matrices de dispersión y gráficos comparativos.

#### 5. ¿Por qué lo hace?
**Para detener la quema inconsciente de capital publicitario**: En el e-commerce, los anuncios representan el principal egreso variable. Saber qué campaña u orientación específica está trayendo clientes de alto valor permite redirigir el presupuesto en caliente hacia lo que vende, blindando la liquidez corporativa.

---

### MÓDULO 6: PROYECTOS CREATIVOS (Producción Multimedia)

#### 1. ¿Para qué sirve?
Sirve para planificar, presupuestar y medir la efectividad financiera real de todo el contenido audiovisual corporativo (vlogs, modelajes, reseñas UGC, infografías) producido por el equipo creativo.

#### 2. ¿Cuál es su función?
Su función principal es la **gestión de activos digitales y ROI artístico**. Registra la ficha del contenido (`id_creativo`), el guion o hook estratégico, el formato de red social (ej. vertical 9:16 de Reels), los organizadores, responsables de edición, fecha de rodaje, y el costo de producción asociado para calcular su rentabilidad directa al ser pautado.

#### 3. ¿Qué mide?
- **Costo de Producción Creativa**: Dinero consumido en realización y edición.
- **Conversión de Venta Atribuida**: Facturación lograda con ese anuncio específico.
- **Retorno Creativo (ROI-C)**: Retorno de la inversión de producción basado en ventas.
- **Mejor Formato de Atracción**: Comparación de rendimiento entre Reels, TikToks, post estáticos o carruseles.
- **Velocidad de Entrega**: Tiempo transcurrido entre la idea e indexación del video en pauta de marketing.

#### 4. ¿Cómo lo hace?
- **Asociación cruzada**: Asocia el campo `id_contenido` de `m_marketing` con la clave primaria `id_creativo` de `m_proyectos_creativos`. Esto permite que cuando el equipo de Ads utiliza una pieza audiovisual, el sistema automáticamente sepa cuánto costó producirla y cuántos ingresos atrajo mediante las transacciones históricas registradas.

#### 5. ¿Por qué lo hace?
**Para transformar el arte en ciencia comercial rentable**: Permite justificar científicamente por qué se debe firmar un presupuesto de rodaje caro si una pieza multimedia en particular reporta un ROI alto. De igual manera, desaconseja repetir formatos aburridos que costaron caro y no generaron ventas del calzado.

---

### MÓDULO 7: GESTIÓN DE CLIENTES (CRM Conversacional)

#### 1. ¿Para qué sirve?
Sirve para centralizar la información de los clientes de KICKS, facilitando la retención, fidelización y el re-contacto estratégico personalizado (promociones por colección, tallas específicas, cupones).

#### 2. ¿Cuál es su función?
Su función de negocio es la **fidelización y personalización conversacional**. Permite segmentar prospectos y compradores VIP por edad, estado federal, intereses clave (ej. calzado deportivo vs sandalias casuales), tipo de cliente (Lead frío, VIP recurrente) y registrar automáticamente su historial comercial (ticket promedio y cantidad de compras realizadas en total).

#### 3. ¿Qué mide?
- **Retención de Clientes**: Porcentaje de compradores que regresan a comprar un segundo par.
- **Ticket Promedio por Cliente Habitual**: Cuánto consume un VIP contra un comprador único.
- **Customer Lifetime Value (LTV)**: Valor total del cliente proyectado en el tiempo.
- **Calificación del Segmento**: Masa de clientes por intereses clave de calzado.
- **Último Contacto**: Días inactivos sin interacción de venta.

#### 4. ¿Cómo lo hace?
- **Fichaje Dinámico de CRM**: Centraliza la tabla relacional `m_clientes` que se actualiza automáticamente con cada transacción asentada en el módulo de Ventas. El sistema agrupa dinámicamente sus consumos para otorgar marcas VIP al sobrepasar umbrales definidos en el ERP.

#### 5. ¿Por qué lo hace?
**Para reducir drásticamente el Costo de Adquisición de Clientes (CAC)**: En el retail moderno, es hasta 5 veces más barato convencer a un cliente existente de comprar otra colección de KICKS que captar uno nuevo desde cero en Ads de Meta. Estructurar el CRM permite enviar plantillas quirúrgicas por WhatsApp a los clientes del calzado de su talla exacta cuando ingresan nuevos modelos.

---

### MÓDULO 8: CONTROL DE GASTOS (Finanzas Corporativas)

#### 1. ¿Para qué sirve?
Sirve para registrar cada salida de dinero ajena a la compra de productos base (costes operativos, sueldos del personal, arriendo de oficinas, comisiones bancarias, servicios, transporte, etc.) con el fin de calcular la rentabilidad contable final.

#### 2. ¿Cuál es su función?
Su función es proveer **disciplina de caja y control de costos**. Permite clasificar egresos por categoría (Servicios, Nómina, Delivery, Fletes, Software, Pauta Ads, Impuestos), registrar el proveedor de servicios, el folio de pago, método monetario y fecha contable para deducirlos de los márgenes comerciales brutos diarios.

#### 3. ¿Qué mide?
- **Gasto Operativo Neto (OpEx)**: Suma agregada de salidas financieras corrientes.
- **Distribución de Egresos por Categoría**: Porcentaje destinado a marketing, delivery, nóminas, etc.
- **Relación de Gastos Operativos vs Ingreso Bruto (Margen OpEx)**: Qué porcentaje de las ventas consume la operación.
- **Flujo de Salida por Proveedor**: Egresos concentrados en contrataciones externas de servicios.

#### 4. ¿Cómo lo hace?
- **Asientos contables simples**: Alimenta la tabla `m_gastos` vinculándola con las fechas y los responsables. El módulo de finanzas concatena esta suma de egresos con los ingresos del módulo de ventas para arrojar las utilidades netas e EBITDA.

#### 5. ¿Por qué lo hace?
**Para garantizar la viabilidad y rentabilidad a largo plazo**: Una empresa con millones de ventas puede estar perdiendo dinero si sus egresos fijos logísticos o publicitarios están inflados. Registrar detalladamente los gastos en el ERP de KICKS bloquea de inmediato las fugas de capital y permite aplicar políticas de austeridad oportunas.

---

## PARTE II: GLOSARIO CIENTÍFICO DE LOS 22 KPIs DE RENDIMIENTO

A continuación, se detalla formalmente cada una de las 22 métricas integradas en los paneles analíticos de KICKS, estructuradas de forma científica según las 4 preguntas requeridas:

### 1. ROAS (Retorno de la Inversión Publicitaria)
- **¿Para qué sirve?** Evalúa la rentabilidad neta monetaria cosechada por la pauta pagada en anuncios.
- **¿Qué mide?** La relación financiera directa entre los ingresos comerciales y la inversión en publicidad exterior.
- **¿Cómo lo mide?** `ROAS = Ingreso Bruto de Ventas Atribuidas / Gasto Publicitario de Anuncios`.
- **¿Por qué lo mide?** Indica de forma clara e indiscutible si las campañas de adquisición están devolviendo más dinero del que consumen, evitando pérdidas masivas de presupuesto en pauta que no convence.

### 2. Hook Rate (Tasa de Enganche)
- **¿Para qué sirve?** Califica la potencia de atracción visual y guion de los 3 primeros segundos de los videos promocionales.
- **¿Qué mide?** La efectividad táctica del enganche inicial de la pieza audiovisual sobre la audiencia fría en redes.
- **¿Cómo lo mide?** `Hook Rate = (Reproducciones de Video a 3 Segundos / Impresiones del Anuncio) * 100`.
- **¿Por qué lo mide?** Si el anuncio tiene un Hook Rate bajo (< 25%), la audiencia lo salta de forma instantánea. Permite cambiar el inicio del video sin tener que desechar todo el cortometraje producido.

### 3. Hold Rate (Tasa de Retención)
- **¿Para qué sirve?** Evalúa el verdadero interés, dinamismo argumentativo y retención del material comercial para retener personas después del hook.
- **¿Qué mide?** La permanencia voluntaria de los prospectos consumiendo el contenido publicitario por más de 15 segundos continuos.
- **¿Cómo lo mide?** `Hold Rate = (Reproducciones de Video a 15 Segundos / Impresiones del Anuncio) * 100`.
- **¿Por qué lo mide?** Un alto Hook Rate convence al clic, pero un excelente Hold Rate convence a la mente del cliente. Resuelve problemas de videos engañosos que generan vistas rápidas vacías pero no venden.

### 4. Top 5 Tallas Más Vendidas
- **¿Para qué sirve?** Guía al departamento de compras sobre las medidas industriales de calzado de mayor demanda para evitar stock detenido.
- **¿Qué mide?** El desglose exacto de volumen físico de mercancía comercializada agrupada por la talla del catálogo.
- **¿Cómo lo mide?** `Suma de Cantidad de Ventas de m_ventas agrupadas por Talla de m_productos desc (Filtrado Top 5)`.
- **¿Por qué lo mide?** Previene la retención ociosa de caja en tallas extremas (muy pequeñas o muy grandes) que tardan meses en rotar, concentrando el capital del negocio en los números que los venezolanos calzan con mayor frecuencia (ej: US-9, US-10).

### 5. Top 5 Colores Más Vendidos
- **¿Para qué sirve?** Identifica la tendencia estética cromática dominante y guiar las próximas órdenes de importación de moda de KICKS.
- **¿Qué mide?** La masa de facturación total asociada directamente a variaciones cosméticas del calzado.
- **¿Cómo lo mide?** `Suma de Ingreso Bruto de m_ventas agrupadas por Color de m_productos desc (Filtrado Top 5)`.
- **¿Por qué lo mide?** Asegura que el stock responda de forma quirúrgica a los gustos de los consumidores según la temporada (ej: Blanco Off-White dominando sobre Negro), minimizando la necesidad de remates por liquidación de colores impopulares.

### 6. Matriz de Calor: Formato de Anuncio vs Talla (Inteligencia Cruzada)
- **¿Para qué sirve?** Identifica correlaciones invisibles entre los gustos de diseño de contenido publicitario y las medidas de los clientes compradores.
- **¿Qué mide?** El rendimiento comercial de ventas cruzado espacialmente entre dimensiones logísticas y audiovisuales.
- **¿Cómo lo mide?** `Agrupación bidimensional de Suma(Ingreso Bruto) cruzando m_proyectos_creativos.formato (X) con m_productos.talla (Y)`.
- **¿Por qué lo mide?** Descubre patrones secretos del mercado: por ejemplo, si los anuncios verticales dinámicos atraen jóvenes que usan tallas pequeñas, mientras que las fotos estáticas tradicionales atraen personas de tallas grandes. Permite hiper-segmentar el presupuesto de pauta.

### 7. Alerta de Stock Bajo (Riesgo de Quiebre)
- **¿Para qué sirve?** Automatiza la advertencia temprana sobre el agotamiento inminente de existencias comerciales de alta rotación.
- **¿Qué mide?** Identificadores SKU de productos cuyo nivel de almacén disponible se encuentra por debajo de 5 unidades físicas.
- **¿Cómo lo mide?** `Filtro lógico: stock_disponible < 5 (Estado crítico visualizado en rojo en m_productos)`.
- **¿Por qué lo mide?** Quedarse sin inventario en un calzado estrella detiene abruptamente las ventas mientras los anuncios siguen consumiendo dinero de pauta, mermando los ingresos y desperdiciando tracción de marca.

### 8. Matriz de Afinidad (Segmentación vs Comprador CRM)
- **¿Para qué sirve?** Alerta sobre discordancias graves entre el público teórico que la empresa cree tener en anuncios de redes frente a quienes compran de verdad en el CRM.
- **¿Qué mide?** El grado de correlación espacial entre los intereses definidos en marketing y los registrados por el CRM.
- **¿Cómo lo mide?** `Contraste espacial: Gasto en m_marketing.segmento_interno vs. Ingresos del cliente registrado con intereses_clave en m_clientes`.
- **¿Por qué lo mide?** Si la empresa gasta $1,000 apuntando a "Zapatillas de Maratón", pero el CRM indica que el 90% de sus compradores VIP son "Amantes de Moda Casual Urbana", este KPI detiene de inmediato el desperdicio publicitario y enfoca el dinero en el cliente real.

### 9. Tabla de Eficiencia por Creativo (Analítica por Pieza)
- **¿Para qué sirve?** Ordena de forma implacable y con frialdad matemática todos los videos activos en el meta manager para apagar perdedores y potenciar ganadores.
- **¿Qué mide?** Costes, conversiones, CTR, CPA y ROAS indexados por cada identificador de creativo individual.
- **¿Cómo lo mide?** `Agregación cruzada por id_contenido recopilando Gasto, Clics, Leads y Ventas de por vida`.
- **¿Por qué lo mide?** Es el panel diario de control para el Trafficker digital. Permite "asesinar" videos obsoletos o que elevan drásticamente el Costo por Adquisición, migrando ese presupuesto en caliente a creativos rentables.

### 10. Gráfico de Dispersión: Hook Rate vs ROAS
- **¿Para qué sirve?** Calibrar si la "creatividad espectacular" de un video se traduce en rentabilidad comercial o en simple entretenimiento vacío.
- **¿Qué mide?** La correlación matemática entre el enganche visual del público y el retorno financiero directo.
- **¿Cómo lo mide?** `Coordenadas cartesianas: Eje X (Hook Rate), Eje Y (ROAS), Diámetro de la burbuja (Gasto acumulado)`.
- **¿Por qué lo mide?** Protege al negocio de la "ilusión viral". Revela si un Reel creativo con un gancho excelente está trayendo compradores reales ó solo espectadores "clickbait" que no tienen intención de comprar calzado de KICKS.

### 11. Mapa Coroplético de Ventas (Venezuela)
- **¿Para qué sirve?** Visualiza geográficamente la densidad de demanda interna del país para negociar mejores fletes de despacho nacional.
- **¿Qué mide?** La concentración volumétrica y financiera de facturación real agrupada por el estado de residencia del cliente.
- **¿Cómo lo mide?** `Suma(Ingreso Bruto de m_ventas) agrupada por m_clientes.estado_logistico proyectada en colores de calor geográfico`.
- **¿Por qué lo mide?** Permite fundamentar alianzas comerciales de última milla con aerolíneas o paqueteras (MRW, Tealca, Zoom) en las regiones con el 80% del mercado de KICKS, o pautar publicidad exclusiva local en regiones desatendidas de alta renta.

### 12. Mapa de Inversión Publicitaria Regional
- **¿Para qué sirve?** Mide la dispersión geográfica del dinero destinado a anuncios para contrastarlo con de dónde llegan las compras reales de KICKS.
- **¿Qué mide?** El presupuesto de marketing consumido territorialmente según los conjuntos de segmentación geográfica.
- **¿Cómo lo mide?** `Gasto total acumulado por segmentación geográfica de campaña (Estados o Ciudades configurados)`.
- **¿Por qué lo mide?** Diagnóstica ineficiencias críticas: si el 30% de la publicidad pagada impacta el estado Zulia, pero las ventas de Zulia aportan menos del 2% real, advierte que hay un problema de flete regional u oferta local que está ahogando la conversión.

### 13. CTR (Click-Through Rate / Tasa de Clic)
- **¿Para qué sirve?** Califica el nivel de persuasión directa del texto, oferta y foto de los anuncios en redes sociales.
- **¿Qué mide?** El porcentaje de usuarios que, tras ver el anuncio en su celular, realizan un clic de redirección hacia KICKS.
- **¿Cómo lo mide?** `CTR = (Clics en el Enlace / Impresiones del Anuncio) * 100`.
- **¿Por qué lo mide?** Es la salud del mensaje. Si el CTR es bajo (< 1.5%), indica que la oferta comercial es poco atractiva, el precio genera resistencia o el diseño del calzado se ve poco llamativo para la audiencia elegida.

### 14. CPM (Costo por Mil Impresiones)
- **¿Para qué sirve?** Monitorea la inflación publicitaria de las subastas digitales en Meta y TikTok.
- **¿Qué mide?** La tarifa que de forma variable cobra el algoritmo por desplegar mil visualizaciones de anuncios.
- **¿Cómo lo mide?** `CPM = (Gasto Publicitario / Impresiones) * 1000`.
- **¿Por qué lo mide?** Revela el grado de saturación del mercado. Si el CPM sube abruptamente (ej: en vísperas de Black Friday o Navidad), alerta al equipo directivo de que es momento de apoyarse más en el tráfico orgánico de Instagram/TikTok y en la recompra del CRM en lugar de competir por anuncios sumamente costosos.

### 15. Creative Fatigue (Fatiga o Cansancio del Anuncio)
- **¿Para qué sirve?** Alerta de forma automática sobre el desgaste visual de un video que ha sido visto demasiadas veces por el mismo público de KICKS.
- **¿Qué mide?** El decaimiento del interés comercial por sobreexposición repetitiva.
- **¿Cómo lo mide?** `Alerta si: Frecuencia de Anuncio > 3.5 veces combinada con caída de CTR > 20% en las últimas 72 horas`.
- **¿Por qué lo mide?** Evita perder dinero y devaluar la marca. Un anuncio fatigado mantiene costos publicitarios altos mientras sus ventas decaen a cero porque el público se aburre del contenido promocional repetitivo.

### 16. CPW (Costo por Chat de WhatsApp)
- **¿Para qué sirve?** Determina la eficiencia de captación directa para de esta forma conocer cuánto cuesta nutrir con prospectos calificados a los operadores de chat del ERP.
- **¿Qué mide?** El costo financiero unitario promedio invertido para generar una nueva conversación entablada en WhatsApp.
- **¿Cómo lo mide?** `CPW = Gasto publicitario destinado a campañas de mensajería / Conversaciones creadas de WhatsApp`.
- **¿Por qué lo mide?** Un aumento marcado del CPW (ej. superando el umbral de $1.20) avisa instantáneamente que los costes comerciales del call-center para cerrar pedidos se duplicarán, asfixiando el margen disponible.

### 17. ROI-C (ROI de Producción Creativa)
- **¿Para qué sirve?** Mide de forma aislada la ganancia de pautar rodajes artísticos complejos frente a su costo físico de realización.
- **¿Qué mide?** El dividendo financiero específico extraído de un material multimedia neto frente a sus costos de producción (modelos, locación, edición).
- **¿Cómo lo mide?** `ROI-C = (Facturación Comercial Atribuida al Creativo / Costo de Producción del Creativo) * 100`.
- **¿Por qué lo mide?** Purifica el presupuesto creativo de caprichos estéticos o "vistas de vanidad", forzando a que las producciones multimedia tengan un retorno comercial real que inyecte liquidez al retail.

### 18. Tasa de Devolución Logística
- **¿Para qué sirve?** Diagnóstica ineficiencias de última milla, problemas de preventa, o deficiencias de confirmación del call-center.
- **¿Qué mide?** El volumen porcentual de despachos que fueron cancelados o retornados por no poder ser entregados físicamente.
- **¿Cómo lo mide?** `Tasa Devolución = (Número de envíos fallidos estado "Retornado" / Envíos Totales cursados) * 100`.
- **¿Por qué lo mide?** Las devoluciones devoran la rentabilidad operativa. Un paquete retornado implica pagar fletes de envío inútiles ida y vuelta, además de retener inventario ocioso en tránsito. Alerta si es preciso depurar paqueteras o certificar la preventa por WhatsApp.

### 19. LTV (Customer Lifetime Value)
- **¿Para qué sirve?** Pronostica el flujo recurrente de facturación bruta que un comprador fidelizado aportará de por vida a KICKS.
- **¿Qué mide?** La proyección financiera agregada de transacciones basada en el historial de interacción del usuario.
- **¿Cómo lo mide?** `LTV = Ticket Promedio Histórico de compra * Frecuencia de Compra del Cliente`.
- **¿Por qué lo mide?** Establece el Costo de Adquisición de Clientes máximo aceptable (CAC máximo rentable). Saber que un cliente VIP comprará 3 veces en un período determinado permite invertir más presupuesto para captarlo con absoluta holgura financiera.

### 20. EBITDA (Beneficios Antes de Intereses, Impuestos, Depreciaciones y Amortizaciones)
- **¿Para qué sirve?** Analiza la viabilidad económica bruta intrínseca del negocio, excluyendo gastos contables de apalancamiento o depreciación.
- **¿Qué mide?** La rentabilidad puramente comercial y operativa de KICKS en su ejecución diaria.
- **¿Cómo lo mide?** `EBITDA = Ingreso Operativo Bruto - Costo de Adquisición de Mercancía - Gasto Operativo (OpEx, Delivery, Marketing y Nóminas)`.
- **¿Por qué lo mide?** Es la métrica financiera internacional que determina el verdadero valor comercial del negocio para inversionistas. Muestra si las operaciones centrales de la empresa son rentables por sí solas.

### 21. CAC (Costo de Adquisición de Clientes)
- **¿Para qué sirve?** Determina la viabilidad del embudo comercial de KICKS ERP calculando el costo total para captar un comprador real.
- **¿Qué mide?** La inversión financiera necesaria para concretar un nuevo comprador en el transcurso del tiempo del reporte.
- **¿Cómo lo mide?** `CAC = Gasto Total de Marketing de Adquisición / Número de Compradores Nuevos ingresados al CRM`.
- **¿Por qué lo mide?** Permite validar si la captación de clientes de primera compra no es más costosa que los ingresos que aportan de por vida (LTV), garantizando que el modelo sea sostenible en el tiempo.

### 22. Rotación de Inventario Colectivo
- **¿Para qué sirve?** Monitorea la longevidad del activo corriente en almacén por marca, colección y categoría.
- **¿Qué mide?** El tiempo promedio medido en días necesario para vender y agotar por completo el stock estático de KICKS.
- **¿Cómo lo mide?** `Rotación = (Costo Relativo de la Mercancía Vendida / Costo de Adquisición del Inventario Promedio en Almacén)`.
- **¿Por qué lo mide?** En retail de moda y vestimentas, mantener un modelo por más de 120 días en depósito reduce exponencialmente su valor debido al desfase de colecciones. Este KPI obliga de inmediato a realizar promociones aplicando el `precio_promo` para recuperar el flujo de caja e invertir en nuevos catálogos.

---

## PARTE III: DICCIONARIO DE ENTIDADES RELACIONALES (BASE DE DATOS)

Las tablas maestras y transaccionales del ERP operan relacionadas mediante claves foráneas para garantizar la trazabilidad de los cálculos de negocio. Presentan la siguiente estructura relacional formal de columnas:

### 1. Tabla: `m_productos` (Inventario & Catálogo maestro)
*   **`sku`** (`string`, PRIMARY KEY): Stock Keeping Unit. Ej. `ZAP-AVI-BLA-42`.
*   **`codigo_barras_ean`** (`string`): Código EAN-13 para pistola de escáner en punto de venta.
*   **`nombre_producto`** (`string`): Nombre comercial detallado.
*   **`marca`** (`string`): Marca del fabricante (ej. Avia, Hey Dude, Kickers, Crocs).
*   **`modelo`** (`string`): Línea o modelo de calzado (ej. Wally Sox, Avi-Forte).
*   **`categoria`** (`string`): Tipo general de mercado (Calzado, Ropa, Accesorios).
*   **`subcategoria`** (`string`): Subgrupo (Zapatillas, Sandalias, Franelas).
*   **`genero_objetivo`** (`string`): Género comercial (Dama, Caballero, Unisex, Niño).
*   **`coleccion`** (`string`): Temporada o campaña de lanzamiento (ej. Verano 2026).
*   **`talla`** (`string | number`): Talla de la unidad (ej. US-9, EUR-42, XL).
*   **`color`** (`string`): Variación cromática base (ej. Azul Slate, Off-White).
*   **`precio_venta_referencia`** (`number`): Precio base de oferta al detal (USD).
*   **`precio_promo`** (`number`): Precio de descuento por campaña o remates de inventario estático (USD).
*   **`costo_unitario`** (`number`): Costo de adquisición o compra FOB con proveedor (USD).
*   **`stock_disponible`** (`number`): Unidades libres listas para entrega.
*   **`stock_reservado`** (`number`): Unidades asignadas a pedidos confirmados.
*   **`stock_critico`** (`number`): Nivel de alerta preventiva de quiebre de stock.
*   **`ubicacion_almacen`** (`string`): Ubicación para picker/despachador (ej. Pasillo D - Estante 2).
*   **`id_proveedor`** (`string`): Enlace al catálogo de proveedores externos.
*   **`fecha_ingreso`** (`string`): Fecha de última recepción del SKU.
*   **`estado_producto`** (`string`): Estado (Activo, Descontinuado, Pausado, Liquidación).

### 2. Tabla: `m_clientes` (Base CRM Core)
*   **`id_cliente`** (`string`, PRIMARY KEY): Identificador de control interno.
*   **`nombre`** (`string`): Nombre completo.
*   **`whatsapp`** (`string`): Teléfono o llave del chat con el cliente.
*   **`correo_electronico`** (`string`): Dirección de correo para comunicaciones.
*   **`edad`** (`number`): Edad calculada o declarada.
*   **`estado_logistico`** (`string`): Estado federal de entrega (ej. Miranda).
*   **`municipio_ciudad`** (`string`): Municipio o ciudad.
*   **`fuente_adquisicion`** (`string`): Flujo de captación (TikTok, Instagram Ads, Tienda).
*   **`intereses_clave`** (`string`): Categorías del CRM por preferencia gustativa.
*   **`tipo_cliente`** (`string`): Nivel (Lead frío, VIP recurrente, Comprador).
*   **`frecuencia_de_compra`** (`number`): Cantidad de facturas de por vida.
*   **`ticket_promedio_historico`** (`number`): Consumo consolidado medio por par de zapatos.
*   **`ultimo_contacto`** (`string`): Timestamp del último mensaje enviado.

### 3. Tabla: `m_ventas` (Ingresos & Facturación transaccional)
*   **`id_venta`** (`string`, PRIMARY KEY): Folio de factura contable interna.
*   **`sku`** (`string`, FOREIGN KEY linked to `m_productos.sku`): SKU comercial comprado.
*   **`id_cliente`** (`string`, FOREIGN KEY linked to `m_clientes.id_cliente`): Id del comprador.
*   **`fecha_venta`** (`string`): Fecha calendario del registro.
*   **`cantidad`** (`number`): Pares o piezas compradas en la misma transacción.
*   **`ingreso_bruto`** (`number`): Facturación bruto total (USD).
*   **`costo_total`** (`number`): Coste acumulado de los SKUs asociados a la venta.
*   **`comision_pasarela`** (`number`): Comisión del canal monetario.
*   **`utilidad_neta_venta`** (`number`): Rendimiento neta (`Ingreso Bruto - Costo - Comisión`).
*   **`metodo_pago`** (`string`): Pago (Zelle, Pago Móvil VEF, Efectivo USD, Banesco).
*   **`tasa_cambio_aplicada`** (`number`): Tasa cambiaria oficial BCV del día en VEF.
*   **`estado_pago`** (`string`): Conciliación (Pagado, Pendiente, Reembolsado).
*   **`canal_venta`** (`string`): Call-Center WhatsApp, DM, Web, Punto de venta.
*   **`operador_responsable`** (`string`): Agente del cierre responsable de comisiones.

### 4. Tabla: `m_marketing` (Ecosistema de Ads)
*   **`fecha`** (`string`): Día calendario de adquisición.
*   **`id_contenido`** (`string`, FOREIGN KEY linked to `m_proyectos_creativos.id_creativo`): ID audiovisual.
*   **`nombre_campana`** (`string`): Nombre técnico en el manager de Ads.
*   **`plataforma`** (`string`): Red (Meta Ads, TikTok Ads, Google Search).
*   **`gasto`** (`number`): Inversión publicitaria diaria en USD.
*   **`impresiones`** (`number`): Impactos totales en feeds de usuarios.
*   **`alcance`** (`number`): Personas únicas alcanzadas.
*   **`clics_enlace`** (`number`): Redirecciones directas al WhatsApp o web.
*   **`conversiones_pixel`** (`number`): Registro automático web de leads de píxel.
*   **`leads_registrados`** (`number`): Chats con pre-mensaje de anuncio iniciados.
*   **`reproducciones_video_3s`** (`number`): Reproducciones cortas mayor a 3 seg.
*   **`reproducciones_video_15s`** (`number`): Reproducciones continuas mayor a 15 seg.

### 5. Tabla: `m_proyectos_creativos` (Producción de Contenido)
*   **`id_creativo`** (`string`, PRIMARY KEY): Identificador del material.
*   **`nombre_creativo`** (`string`): Nombre de guion de la pieza.
*   **`formato`** (`string`): Vertical Reels 9:16, Cuadrado Post 1:1, Horizontal.
*   **`fecha_rodaje`** (`string`): Fecha de grabación.
*   **`costo_produccion`** (`number`): Tarifa en USD de los creadores de contenido o modelos.
*   **`estado`** (`string`): Estado del video (Idea, Grabado, En Edición, Activo en Ads).
*   **`responsable_edicion`** (`string`): Editor audiovisual y diseñador.

*(Para revisar las demás tablas operacionales como gastos o logística, dirigirse al módulo interactivo "Diccionario de Datos" en KICKS ERP).*
