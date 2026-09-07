/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Filter, 
  Download, 
  Plus, 
  FolderLock, 
  Film, 
  SlidersHorizontal, 
  ChevronRight,
  TrendingUp,
  AlertOctagon,
  Wrench,
  Upload,
  CheckCircle2
} from "lucide-react";
import { ProductType } from "../types";

interface InventarioProps {
  products: ProductType[];
  onUpdateStock: (sku: string, cantidad: number, tipo: 'sumar' | 'restar' | 'fijar') => Promise<any>;
  onAddProduct: (prodData: any) => Promise<any>;
  refreshData: () => void;
}

export default function Inventario({ 
  products, 
  onUpdateStock, 
  onAddProduct,
  refreshData 
}: InventarioProps) {
  // Filter States
  const [catFilter, setCatFilter] = useState("Todos");
  const [tallaFilter, setTallaFilter] = useState("Todos");
  const [colorFilter, setColorFilter] = useState("Todos");
  const [brandFilter, setBrandFilter] = useState("Todos");
  const [coleccionFilter, setColeccionFilter] = useState("Todos");
  const [searchWord, setSearchWord] = useState("");

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'sumar' | 'restar' | 'fijar'>("sumar");
  
  // Create Product Input
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdBrand, setNewProdBrand] = useState("Kicks");
  const [newProdModelo, setNewProdModelo] = useState("");
  const [newProdCat, setNewProdCat] = useState<'Zapato' | 'Textil'>("Zapato");
  const [newProdSub, setNewProdSub] = useState("Casual");
  const [newProdGenre, setNewProdGenre] = useState<'Femenino' | 'Masculino' | 'Unisex'>("Unisex");
  const [newProdTalla, setNewProdTalla] = useState("38");
  const [newProdColor, setNewProdColor] = useState("Negro");
  const [newProdRefPrice, setNewProdRefPrice] = useState(40);
  const [newProdCost, setNewProdCost] = useState(18);
  const [newProdSeason, setNewProdSeason] = useState("Colección 2026");
  const [newProdColeccion, setNewProdColeccion] = useState("Colección 2025");
  const [newProdProv, setNewProdProv] = useState("Distribuidor General");
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdDrive, setNewProdDrive] = useState("");
  const [newProdAlmacen, setNewProdAlmacen] = useState("Principal");

  // Bulk CSV Importer states
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<any[]>([]);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  // File parse handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    parseFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    parseFile(file);
  };

  const parseFile = (file: File) => {
    setImportError("");
    setImportSuccess("");
    if (!file.name.endsWith(".csv")) {
      setImportError("Solo se admiten archivos .csv de inventario. Por favor guarde su hoja de Excel como CSV (delimitado por comas o punto y coma).");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) {
          setImportError("El archivo seleccionado está vacío.");
          return;
        }

        const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) {
          setImportError("El formato del archivo es inválido, requiere fila de encabezados y datos.");
          return;
        }

        const firstLine = lines[0];
        const delimiter = firstLine.includes(";") ? ";" : ",";
        const headers = firstLine.split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, "").toLowerCase());
        
        const parsedRows: any[] = [];
        const getColIndex = (nicknames: string[]) => {
          return headers.findIndex(h => nicknames.some(nick => h.includes(nick)));
        };

        const idxSku = getColIndex(["sku"]);
        const idxNombre = getColIndex(["nombre", "producto", "name", "articulo"]);
        const idxMarca = getColIndex(["marca", "brand"]);
        const idxCategoria = getColIndex(["categoria", "category"]);
        const idxSubcategoria = getColIndex(["subcategoria", "sublinea", "sub"]);
        const idxGenero = getColIndex(["genero", "gender", "publico"]);
        const idxTalla = getColIndex(["talla", "size"]);
        const idxColor = getColIndex(["color"]);
        const idxPrecio = getColIndex(["precio", "venta", "retail", "ref", "price"]);
        const idxCosto = getColIndex(["costo", "unitario", "compra", "cost"]);
        const idxTemporada = getColIndex(["temporada", "season"]);
        const idxColeccion = getColIndex(["coleccion", "collection", "año"]);
        const idxProveedor = getColIndex(["proveedor", "vendor", "supplier"]);
        const idxStock = getColIndex(["stock", "disponible", "existencia", "qty", "cantidad"]);
        const idxAlmacen = getColIndex(["almacen", "warehouse", "ubicacion"]);
        const idxDrive = getColIndex(["drive", "fotos", "url", "carpeta"]);

        // Automatic Matrix Tallas Finder (S, M, L, XL, 35, 36, etc. as columns)
        const sizeColumns: { sizeName: string; index: number }[] = [];
        const possibleSizes = ["34", "35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46", "xs", "s", "m", "l", "xl", "2xl", "3xl"];

        headers.forEach((h, idx) => {
          const cleanH = h.toLowerCase().trim().replace(/^["']|["']$/g, "");
          if (possibleSizes.includes(cleanH)) {
            sizeColumns.push({ sizeName: cleanH.toUpperCase(), index: idx });
          } else if (cleanH.startsWith("talla_") && possibleSizes.includes(cleanH.replace("talla_", ""))) {
            sizeColumns.push({ sizeName: cleanH.replace("talla_", "").toUpperCase(), index: idx });
          }
        });

        const isMatrixFormat = sizeColumns.length > 0 && idxTalla === -1;

        if (idxNombre === -1 || idxColor === -1) {
          setImportError("No se pudieron mapear las columnas obligatorias en su CSV. Asegúrese de incluir los encabezados 'nombre_producto' y 'color'.");
          return;
        }

        if (!isMatrixFormat && idxTalla === -1) {
          setImportError("No se encontró la columna de 'Talla' ni columnas de tallas individuales (ej. '37', '38' o 'S', 'M').");
          return;
        }

        for (let i = 1; i < lines.length; i++) {
          const cells = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ""));
          if (cells.length < headers.length) continue;

          const nName = cells[idxNombre];
          const nColor = cells[idxColor];
          const nPrecio = idxPrecio !== -1 ? Number(cells[idxPrecio].replace(/[^0-9.]/g, "")) || 40 : 40;
          const nCosto = idxCosto !== -1 ? Number(cells[idxCosto].replace(/[^0-9.]/g, "")) || 18 : 18;

          if (!nName || !nColor) continue;

          const baseProd = {
            sku: idxSku !== -1 ? cells[idxSku] : "",
            nombre_producto: nName,
            marca: idxMarca !== -1 ? cells[idxMarca] : "Kicks",
            categoria: idxCategoria !== -1 ? cells[idxCategoria] : "Calzado",
            subcategoria: idxSubcategoria !== -1 ? cells[idxSubcategoria] : "Casual",
            genero_objetivo: idxGenero !== -1 ? cells[idxGenero] : "Unisex",
            color: nColor,
            precio_venta_referencia: nPrecio,
            costo_unitario: nCosto,
            temporada: idxTemporada !== -1 ? cells[idxTemporada] : "Colección 2026",
            coleccion: idxColeccion !== -1 ? cells[idxColeccion] : "Colección 2025",
            proveedor: idxProveedor !== -1 ? cells[idxProveedor] : "Importación Directa",
            almacen: idxAlmacen !== -1 ? cells[idxAlmacen] : "Principal",
            url_carpeta_drive: idxDrive !== -1 ? cells[idxDrive] : ""
          };

          if (isMatrixFormat) {
            // For Matrix Format, construct separate SKUs for each size column that has quantity > 0
            sizeColumns.forEach(sizeCol => {
              const val = cells[sizeCol.index];
              const parsedStock = val ? parseInt(val.replace(/[^0-9]/g, "")) || 0 : 0;
              if (parsedStock > 0) {
                // Generate a unique SKU derivative if base SKU exists
                const finalSku = baseProd.sku ? `${baseProd.sku}-${sizeCol.sizeName}` : "";
                parsedRows.push({
                  ...baseProd,
                  sku: finalSku,
                  talla: sizeCol.sizeName,
                  stock_disponible: parsedStock
                });
              }
            });
          } else {
            // Single Row Format
            const nTalla = cells[idxTalla];
            const nStock = idxStock !== -1 ? parseInt(cells[idxStock].replace(/[^0-9]/g, "")) || 0 : 0;
            if (!nTalla) continue;

            parsedRows.push({
              ...baseProd,
              sku: baseProd.sku,
              talla: nTalla,
              stock_disponible: nStock
            });
          }
        }

        if (parsedRows.length === 0) {
          setImportError("No se encontraron filas con datos elegibles en el archivo.");
        } else {
          setParsedProducts(parsedRows);
          setImportSuccess(`Archivo mapeado exitosamente. Se detectaron ${parsedRows.length} calzados listos para importar.`);
        }
      } catch (err: any) {
        setImportError("Error al procesar el archivo CSV: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkImport = async () => {
    if (parsedProducts.length === 0) return;
    setImporting(true);
    setImportError("");
    setImportSuccess("");

    try {
      let succeededCount = 0;
      for (const prod of parsedProducts) {
        await onAddProduct(prod);
        succeededCount++;
      }
      setImportSuccess(`¡Importación masiva exitosa! ${succeededCount} productos agregados exitosamente.`);
      setParsedProducts([]);
      refreshData();
    } catch (err: any) {
      setImportError("Error parcial durante la carga masiva: " + err.message);
    } finally {
      setImporting(false);
    }
  };

  // Filter lists
  const tallas = Array.from(new Set(products.map(p => String(p.talla))));
  const colores = Array.from(new Set(products.map(p => p.color)));
  const marcas = Array.from(new Set(products.map(p => p.marca || "Sin Marca")));

  const colecciones = Array.from(new Set(products.map(p => p.coleccion || "Sin Colección")));

  const filtered = products.filter(p => {
    const matchesCat = catFilter === "Todos" || p.categoria === catFilter;
    const matchesTalla = tallaFilter === "Todos" || String(p.talla) === tallaFilter;
    const matchesColor = colorFilter === "Todos" || p.color.toLowerCase() === colorFilter.toLowerCase();
    const matchesBrand = brandFilter === "Todos" || (p.marca || "Sin Marca") === brandFilter;
    const matchesColeccion = coleccionFilter === "Todos" || (p.coleccion || "Sin Colección") === coleccionFilter;
    const matchesSearch = p.sku.toLowerCase().includes(searchWord.toLowerCase()) || 
                          p.nombre_producto.toLowerCase().includes(searchWord.toLowerCase()) ||
                          (p.modelo && p.modelo.toLowerCase().includes(searchWord.toLowerCase())) ||
                          (p.marca && p.marca.toLowerCase().includes(searchWord.toLowerCase())) ||
                          (p.coleccion && p.coleccion.toLowerCase().includes(searchWord.toLowerCase()));
    return matchesCat && matchesTalla && matchesColor && matchesBrand && matchesColeccion && matchesSearch;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = [
      "SKU", "Nombre Producto", "Marca", "Categoria", "Subcategoria", "Genero Objetivo", 
      "Talla", "Color", "Precio Referencia", "Costo Unitario", "Temporada", "Colección",
      "Proveedor", "Stock Disponible", "Stock Reservado", "Fecha Actualizacion", 
      "Almacen", "Google Drive Link"
    ];

    const rows = filtered.map(p => [
      p.sku,
      `"${p.nombre_producto}"`,
      `"${p.marca || 'Sin Marca'}"`,
      p.categoria,
      p.subcategoria,
      p.genero_objetivo,
      p.talla,
      p.color,
      p.precio_venta_referencia,
      p.costo_unitario,
      p.temporada,
      `"${p.coleccion || 'Sin Colección'}"`,
      `"${p.proveedor}"`,
      p.stock_disponible,
      p.stock_reservado,
      p.fecha_actualizacion,
      p.almacen,
      `"${p.url_carpeta_drive}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Inventario_KICKS_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Google Drive Thumbnail Extractor
  const getDriveThumbnail = (url: string) => {
    if (!url) return null;
    const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    const id = (folderMatch && folderMatch[1]) || (fileMatch && fileMatch[1]);
    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w400`;
    }
    return null;
  };

  // Safe manual stock updater
  const handleModifyStockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await onUpdateStock(selectedProduct.sku, Math.abs(adjustQty), adjustType);
      alert("Stock actualizado de manera exitosa!");
      setShowAdjustStock(false);
      setAdjustQty(0);
      
      // Update modal detailed product snapshot dynamically
      const updatedItem = products.find(p => p.sku === selectedProduct.sku);
      if (updatedItem) {
        setSelectedProduct(updatedItem);
      }
      refreshData();
    } catch (err: any) {
      alert("Error al actualizar stock: " + err.message);
    }
  };

  // Create Product handler
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdColor || !newProdTalla) {
      alert("Especifique Nombre, color y talla.");
      return;
    }

    const payload = {
      nombre_producto: newProdName,
      marca: newProdBrand || "Kicks",
      modelo: newProdModelo,
      categoria: newProdCat,
      subcategoria: newProdSub,
      genero_objetivo: newProdGenre,
      talla: newProdTalla,
      color: newProdColor,
      precio_venta_referencia: Number(newProdRefPrice),
      costo_unitario: Number(newProdCost),
      temporada: newProdSeason,
      coleccion: newProdColeccion,
      proveedor: newProdProv,
      stock_disponible: Number(newProdStock),
      url_carpeta_drive: newProdDrive,
      almacen: newProdAlmacen
    };

    try {
      await onAddProduct(payload);
      alert("¡Producto nuevo ingresado e indexado!");
      setShowCreateModal(false);
      // Reset forms
      setNewProdName("");
      setNewProdBrand("Kicks");
      setNewProdModelo("");
      setNewProdColeccion("Colección 2025");
      setNewProdDrive("");
      refreshData();
    } catch (err: any) {
      alert("Error al crear producto: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
            Control de Inventario
          </h1>
          <p className="text-sm text-gray-500">
            Gestión física y digital de SKUs. Alertas de desabastecimiento inmediato para compras y reabastecimiento de mercancía.
          </p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowImportPanel(!showImportPanel)}
            className="px-5 py-2 border border-[#FCD901]/45 text-gray-700 hover:text-[#FCD901] hover:border-[#FCD901]/20 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
            id="toggle-import-panel-btn"
          >
            Importar Excel/CSV
          </button>
          
          <button
            onClick={handleExportCSV}
            className="px-5 py-2 border border-[#FCD901]/20 text-[#FCD901] text-xs font-bold uppercase tracking-widest hover:bg-[#FCD901] hover:text-[#0A0A0A] transition-colors cursor-pointer"
            id="export-csv-btn"
          >
            Exportar CSV
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2 bg-[#FCD901] text-[#0A0A0A] text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-[#FCD901]/80 transition-all font-sans"
            id="open-create-prod-btn"
          >
            Registrar Producto
          </button>
        </div>
      </div>

      {/* DRAG AND DROP CSV IMPORTER PANEL */}
      {showImportPanel && (
        <div className="bg-[#FDFDFD] border border-dashed border-[#FCD901]/40 rounded-lg p-6 space-y-4 animate-fade-in text-gray-700 font-sans" id="bulk-import-panel">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Upload className="w-4 h-4 text-[#FCD901]" /> Importador Masivo de Inventario Calzado (.CSV)
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5 font-sans">
                Utiliza tu archivo de Excel exportado como CSV para cargar productos en lote de forma segura.
              </p>
            </div>
            <button 
              onClick={() => {
                setShowImportPanel(false);
                setParsedProducts([]);
              }}
              className="text-gray-500 hover:text-gray-900 transition-colors text-xs font-mono"
            >
              ✖ Cerrar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Drop Zone */}
            <div className="lg:col-span-12 xl:col-span-5 space-y-3">
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="w-full h-44 border-2 border-dashed border-gray-700 hover:border-[#FCD901]/20 rounded-lg bg-[#FDFDFD] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all relative group"
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-8 h-8 text-gray-500 group-hover:text-[#FCD901] mb-2 transform group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-gray-900 uppercase font-sans">Arrastra tu archivo CSV aquí</span>
                <span className="text-[10px] text-gray-500 mt-1 font-sans">O haz clic para navegar por tu disco local</span>
                <span className="text-[9px] text-[#FCD901] mt-3 font-mono font-bold tracking-widest">SÓLO ARCHIVOS DELIMITADOS POR COMAS</span>
              </div>

              {importError && (
                <div className="p-3 bg-red-955/40 border border-red-500/30 text-red-400 text-xs rounded-sm font-mono leading-tight">
                  ⚠️ Error: {importError}
                </div>
              )}

              {importSuccess && (
                <div className="p-3 bg-emerald-955/40 border border-emerald-500/30 text-emerald-600 text-xs rounded-sm font-mono flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{importSuccess}</span>
                </div>
              )}
            </div>

            {/* Instruction Column Mapping Guide */}
            <div className="lg:col-span-12 xl:col-span-7 bg-white border border-gray-200 p-4 rounded-lg space-y-3 font-sans text-xs">
              <span className="text-[#FCD901] font-bold block border-b border-gray-200 pb-1 uppercase tracking-wider text-[11px] font-mono">Guía de Formatos Admitidos (¡Soporta Ambos!)</span>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                KICKS detecta automáticamente cómo estructuraste tu archivo. Elige la forma que te sea más fácil en Excel:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-900 font-bold text-[10.5px] uppercase block mb-1 text-[#FCD901]">Opción A: Fila por Talla (Tradicional)</span>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Colocas una columna <strong>Talla</strong> (donde escribes <span className="font-mono text-gray-900">40, M, L...</span>) y una columna <strong>Stock</strong> (con la cantidad). Excelente si vas de uno en uno.
                  </p>
                </div>
                <div className="bg-white p-2.5 rounded border border-gray-200">
                  <span className="text-gray-900 font-bold text-[10.5px] uppercase block mb-1 text-[#FCD901]">Opción B: Tallas como Columnas (Matriz)</span>
                  <p className="text-[10px] text-gray-500 leading-snug">
                    Crea columnas llamadas exactamente como las tallas (ej. <span className="font-mono text-gray-900">37, 38, S, M, L, XL...</span>) y coloca la cantidad directo en la celda. ¡Ideal para tiendas de calzado y textil!
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-2">
                <span className="text-[10px] uppercase font-mono font-bold text-gray-500 block mb-1">Mapeo de Columnas Genéricas:</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9.5px]">
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900 font-bold">Nombre Producto*</span>
                    <span className="text-gray-500">nombre, producto, calzado, name</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900 font-bold">Color*</span>
                    <span className="text-gray-500">color</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900 font-bold">Talla (Opción A)*</span>
                    <span className="text-gray-500">talla, size</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900 font-bold">Existencia (Opción A)*</span>
                    <span className="text-gray-500">stock, existencia, cant, qty</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900">Precio Venta</span>
                    <span className="text-gray-500">precio, venta, ref, retail</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-200/50 pb-0.5">
                    <span className="text-gray-900">Costo de Compra</span>
                    <span className="text-gray-500">costo, unitario, cost</span>
                  </div>
                </div>
              </div>

              {parsedProducts.length > 0 && (
                <div className="pt-2 border-t border-gray-200 flex justify-between items-center bg-[#FDFDFD] p-2 rounded-sm mt-2">
                  <span className="text-gray-900 font-sans text-xs">Productos detectados: <strong className="text-[#FCD901]">{parsedProducts.length} SKU</strong></span>
                  <button
                    type="button"
                    onClick={handleBulkImport}
                    disabled={importing}
                    className="bg-[#FCD901] hover:bg-[#C5A059] disabled:bg-gray-700 text-[#0A0A0A] font-bold uppercase text-[10px] px-4 py-1.5 rounded transition-all cursor-pointer font-sans"
                  >
                    {importing ? "Sincronizando..." : `Guardar en Lote (${parsedProducts.length} SKU)`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Internal Filter Panel */}
      <div className="bg-white border border-gray-200 rounded-sm p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <SlidersHorizontal className="w-4 h-4 text-[#FCD901] shrink-0" />
          <span className="text-xs font-mono font-bold text-gray-700 uppercase mr-2">Filtros:</span>
          
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
          >
            <option value="Todos">Categorías (Todas)</option>
            <option value="Zapato">Zapato</option>
            <option value="Textil">Textil</option>
          </select>

          <select
            value={tallaFilter}
            onChange={(e) => setTallaFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
          >
            <option value="Todos">Tallas (Todas)</option>
            {tallas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
          >
            <option value="Todos">Colores (Todos)</option>
            {colores.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
          >
            <option value="Todos">Marcas (Todas)</option>
            {marcas.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={coleccionFilter}
            onChange={(e) => setColeccionFilter(e.target.value)}
            className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
          >
            <option value="Todos">Colecciones (Todas)</option>
            {colecciones.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Filter className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-500" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Buscar por SKU, calzado..."
            className="w-full bg-white text-gray-900 pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Grid of Products */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#FDFDFD] border-b border-gray-200 text-gray-500 font-bold whitespace-nowrap">
                <th className="p-4">SKU PRODUCTO</th>
                <th className="p-4 text-center">COLECCIÓN</th>
                <th className="p-4">MARCA</th>
                <th className="p-4">NOMBRE GENÉRICO</th>
                <th className="p-4">CATEGORÍA</th>
                <th className="p-4 text-center">TALLA</th>
                <th className="p-4 text-center">COLOR</th>
                <th className="p-4 text-right">PRECIO REF.</th>
                <th className="p-4 text-right">COSTO COVI</th>
                <th className="p-4 text-center">STOCK DISP.</th>
                <th className="p-4 text-center">MEDIOS</th>
                <th className="p-4 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filtered.length > 0 ? (
                filtered.map((p) => {
                  const isLowStock = p.stock_disponible < 5;
                  return (
                    <tr 
                      key={p.sku} 
                      className={`hover:bg-white transition-colors ${
                        isLowStock ? "bg-[#331111]/20" : ""
                      }`}
                    >
                      <td className="p-4 font-bold text-[#FCD901] font-mono select-all whitespace-nowrap">{p.sku}</td>
                      <td className="p-4 text-center text-gray-700 whitespace-nowrap">
                        <span className="bg-[#FDFDFD] border border-gray-200 px-2 py-0.5 rounded text-gray-600 text-[10px] font-bold">{p.coleccion || "Sin Colección"}</span>
                      </td>
                      <td className="p-4 text-gray-900 font-semibold uppercase whitespace-nowrap">{p.marca || "Kicks"}</td>
                      <td className="p-4 font-sans text-sm text-gray-900 font-semibold whitespace-nowrap">
                        {p.nombre_producto}
                        {p.modelo && (
                          <span className="block text-xs text-gray-500 font-normal">
                            Modelo: {p.modelo}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-500 capitalize whitespace-nowrap">{p.categoria} ({p.subcategoria})</td>
                      <td className="p-4 text-center text-gray-900 font-bold whitespace-nowrap">{p.talla}</td>
                      <td className="p-4 text-center text-gray-700 capitalize whitespace-nowrap">{p.color}</td>
                      <td className="p-4 text-right text-gray-900 font-bold whitespace-nowrap">${p.precio_venta_referencia}</td>
                      <td className="p-4 text-right text-gray-500 whitespace-nowrap">${p.costo_unitario}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded font-bold text-xs ${
                          isLowStock 
                            ? "bg-rose-950/50 text-[#E74C3C] border border-[#E74C3C]/30 animate-pulse" 
                            : "bg-white text-emerald-600 border border-emerald-500/20"
                        }`}>
                          {p.stock_disponible} uds.
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {p.url_carpeta_drive ? (
                          <span className="text-[#3498DB] font-bold text-[10px] uppercase tracking-widest border border-[#3498DB]/30 bg-[#3498DB]/5 px-2 py-0.5 rounded">
                            Drive Live
                          </span>
                        ) : (
                          <span className="text-gray-600 text-[10px] uppercase">Sin adjunto</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="text-[#FCD901] hover:underline hover:text-gray-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          Inspeccionar DETALLE <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-500 font-mono">No se encontraron productos con los criterios dados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-[#FDFDFD] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFDFD] border border-gray-200 rounded-xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-[#FCD901]" />
                <h3 className="font-sans text-lg font-bold text-gray-900 leading-tight">Ficha Corporativa: {selectedProduct.nombre_producto}</h3>
              </div>
              <button 
                onClick={() => {
                  setSelectedProduct(null);
                  setShowAdjustStock(false);
                }}
                className="text-gray-500 hover:text-gray-900 cursor-pointer px-2.5 py-1 text-sm border border-gray-200 hover:bg-white rounded"
              >
                ✖ Cerrar
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Gallery Preview */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5 bg-white py-1 px-2.5 rounded border border-gray-200">
                    <Film className="w-3.5 h-3.5 text-[#C5A059]" /> Galería Multimedia De Google Drive
                  </h4>

                  {getDriveThumbnail(selectedProduct.url_carpeta_drive) ? (
                    <div className="space-y-2">
                      <img
                        src={getDriveThumbnail(selectedProduct.url_carpeta_drive) as string}
                        alt={selectedProduct.nombre_producto}
                        referrerPolicy="no-referrer"
                        className="w-full h-64 object-cover rounded bg-[#FDFDFD] border border-gray-200 shadow-md"
                      />
                      <div className="p-3 bg-[#FDFDFD] border border-gray-200 rounded flex justify-between items-center">
                        <span className="text-[10px] font-mono text-gray-500">Video Embed Player (Drive)</span>
                        <a 
                          href={selectedProduct.url_carpeta_drive} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#3498DB] hover:underline font-mono text-xs font-bold"
                        >
                          Ver Carpeta Original en Nueva Ventana ↗
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-[#FDFDFD] rounded border border-gray-200 flex flex-col items-center justify-center p-6 text-center text-xs font-mono text-gray-500">
                      <AlertOctagon className="w-8 h-8 text-yellow-600 mb-2" />
                      <span>No se cuenta con material gráfico de Google Drive para este SKU.</span>
                      <p className="mt-2 text-gray-600 max-w-xs">Inserte un enlace válido de Drive para sincronizar miniaturas de forma inmediata desde el almacén.</p>
                    </div>
                  )}
                </div>

                {/* Technical Product Specifications */}
                <div className="space-y-4 font-mono text-xs">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-white py-1 px-2.5 rounded border border-gray-200">
                    Especificaciones Técnicas del Producto
                  </h4>

                  <div className="grid grid-cols-2 gap-4 bg-[#FDFDFD] p-4 rounded-lg border border-gray-200">
                    <div>
                      <span className="text-gray-500 block">SKU INTERNO</span>
                      <span className="text-gray-900 font-bold text-sm bg-white px-1.5 py-0.5 rounded select-all border border-gray-200">{selectedProduct.sku}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">MARCA REGISTRADA</span>
                      <span className="text-gray-900 font-bold bg-white px-1.5 py-0.5 rounded border border-gray-200 uppercase">{selectedProduct.marca || "Zeta"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">CONTROL ALMACÉN</span>
                      <span className="text-gray-900 font-bold">{selectedProduct.almacen}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block">CATEGORÍA PRINCIPAL</span>
                      <span className="text-gray-900 font-bold uppercase">{selectedProduct.categoria}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">SUB-LÍNEA</span>
                      <span className="text-gray-900 font-bold capitalize">{selectedProduct.subcategoria}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block">PÚBLICO</span>
                      <span className="text-[#C5A059] font-bold uppercase">{selectedProduct.genero_objetivo}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">TALLA / COLOR</span>
                      <span className="text-gray-900 font-bold uppercase">{selectedProduct.talla} / {selectedProduct.color}</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block">REF. COMPRA (COSTO)</span>
                      <span className="text-gray-500 font-bold">${selectedProduct.costo_unitario} USD</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">REF. VENTA PÚBLICO</span>
                      <span className="text-[#FCD901] font-bold text-sm">${selectedProduct.precio_venta_referencia} USD</span>
                    </div>

                    <div>
                      <span className="text-gray-500 block">TEMPORADA / TEXTO</span>
                      <span className="text-gray-900 text-[10px] uppercase">{selectedProduct.temporada}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">COLECCIÓN</span>
                      <span className="text-[#FCD901] font-bold uppercase">{selectedProduct.coleccion || "Sin Colección"}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">PROVEEDOR ORIGEN</span>
                      <span className="text-gray-900">{selectedProduct.proveedor}</span>
                    </div>
                  </div>

                  {/* Stock Level Card */}
                  <div className="p-4 bg-[#1B1B1B] border border-gray-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 block text-[10px]">CANTIDAD ACTUAL EN INVENTARIO:</span>
                      <span className={`text-xl font-bold ${selectedProduct.stock_disponible < 5 ? "text-red-500" : "text-emerald-600"}`}>
                        {selectedProduct.stock_disponible} Unidades Dispo.
                      </span>
                    </div>

                    <button
                      onClick={() => setShowAdjustStock(true)}
                      className="px-3 py-1.5 bg-[#C5A059] hover:bg-[#FCD901] text-[#0A0A0A] font-bold uppercase font-mono text-[10px] rounded flex items-center gap-1"
                      id="modify-stock-trigger"
                    >
                      <Wrench className="w-3.5 h-3.5" /> Modificar Stock
                    </button>
                  </div>
                </div>

              </div>

              {/* Adjust Stock Form (COLLAPSIBLE) */}
              {showAdjustStock && (
                <form onSubmit={handleModifyStockSubmit} className="p-4 bg-[#1F1414] border border-rose-950/50 rounded-xl space-y-4 animate-fade-in" id="adjust-stock-form">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-[#E74C3C] uppercase tracking-wider flex items-center gap-1">
                      <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" /> Ajustar Existencias del Producto
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Los cambios se aplican en vivo en la base de datos</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-gray-500 font-mono block mb-1">Acción</label>
                      <select
                        value={adjustType}
                        onChange={(e: any) => setAdjustType(e.target.value)}
                        className="w-full bg-white text-gray-900 p-2 border border-gray-300 rounded font-mono text-xs focus:outline-none"
                      >
                        <option value="sumar">Abastecer (+ Sumar)</option>
                        <option value="restar">Egresar (- Restar)</option>
                        <option value="fijar">Fijar Cantidad Exacta</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-mono block mb-1">Cantidad de Modificación</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={adjustQty}
                        onChange={(e) => setAdjustQty(Number(e.target.value))}
                        className="w-full bg-white text-gray-900 p-2 border border-gray-300 rounded font-mono text-xs focus:outline-none"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-rose-600 hover:bg-rose-700 text-gray-900 font-mono text-xs py-2 rounded font-bold cursor-pointer transition-colors"
                      >
                        Aplicar Movimiento
                      </button>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      )}

      {/* CREATE PRODUCT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[#FDFDFD] backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FDFDFD] border border-gray-200 rounded-xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-200 bg-white flex justify-between items-center shrink-0">
              <h3 className="font-sans text-lg font-bold text-[#FCD901] tracking-wider uppercase">Registrar Nuevo SKU de Mercancía</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="p-6 space-y-4 overflow-y-auto font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Nombre del Producto</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="Ej: Sandalia Plana Cuero"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Marca del Producto (Marca)</label>
                  <input
                    type="text"
                    required
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    placeholder="Ej: Zeta, Puma, Nike"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Modelo del Zapato (ej: Liberty, Fonter)</label>
                  <input
                    type="text"
                    value={newProdModelo}
                    onChange={(e) => setNewProdModelo(e.target.value)}
                    placeholder="Escriba el modelo específico del calzado"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Categoría Primaria</label>
                  <select
                    value={newProdCat}
                    onChange={(e: any) => setNewProdCat(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  >
                    <option value="Zapato">Zapato</option>
                    <option value="Textil">Textil</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Subcategoría</label>
                  <input
                    type="text"
                    required
                    value={newProdSub}
                    onChange={(e) => setNewProdSub(e.target.value)}
                    placeholder="Ej: Casual o De Vestir"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Género Destino</label>
                  <select
                    value={newProdGenre}
                    onChange={(e: any) => setNewProdGenre(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  >
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Talla Única</label>
                  <input
                    type="text"
                    required
                    value={newProdTalla}
                    onChange={(e) => setNewProdTalla(e.target.value)}
                    placeholder="Ej: 38 o M"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Color Normalizado</label>
                  <input
                    type="text"
                    required
                    value={newProdColor}
                    onChange={(e) => setNewProdColor(e.target.value)}
                    placeholder="Ej: Negro"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Precio Venta Ref ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProdRefPrice}
                    onChange={(e) => setNewProdRefPrice(Number(e.target.value))}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Costo Unitario ($)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newProdCost}
                    onChange={(e) => setNewProdCost(Number(e.target.value))}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Existencia Inicial</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(Number(e.target.value))}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Temporada</label>
                  <input
                    type="text"
                    value={newProdSeason}
                    onChange={(e) => setNewProdSeason(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Colección</label>
                  <input
                    type="text"
                    value={newProdColeccion}
                    onChange={(e) => setNewProdColeccion(e.target.value)}
                    placeholder="Ej: Colección 2025"
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Proveedor Origen</label>
                  <input
                    type="text"
                    value={newProdProv}
                    onChange={(e) => setNewProdProv(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Almacén Ubicación</label>
                  <input
                    type="text"
                    value={newProdAlmacen}
                    onChange={(e) => setNewProdAlmacen(e.target.value)}
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider">Carpeta Fotos (Drive URL)</label>
                  <input
                    type="text"
                    value={newProdDrive}
                    onChange={(e) => setNewProdDrive(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#FDFDFD] rounded border border-gray-200 font-mono text-[9px] text-gray-500 leading-normal uppercase">
                <span className="text-[#FCD901] block font-bold mb-1">REGLA AUTOMÁTICA DEL SKU:</span>
                El sku se formará automáticamente bajo la convención: <span className="text-gray-900 block font-bold text-[10px] mt-0.5">{"{CODIGO_GENÉRICO}-{TALLA}-{COLOR}"}</span>
                Por ejemplo: ZAP-38-NEGRO. Las dimensiones de talla y color se desglosarán en la base de datos.
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-transparent border border-gray-200 rounded text-gray-500 hover:text-gray-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] font-bold rounded"
                >
                  Indizar SKU Calzado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
