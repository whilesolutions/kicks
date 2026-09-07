/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  ShoppingBag, 
  Percent, 
  AlertTriangle, 
  Flame, 
  Sparkles,
  Users,
  Target,
  PackageCheck,
  ChevronRight,
  Filter,
  MessageSquare,
  Eye,
  MousePointerClick,
  Award,
  Layers,
  MapPin,
  HelpCircle,
  Activity
} from "lucide-react";
import { ProductType, ClientType, SaleType, MarketingMetricType, ExpenseType } from "../types";
import { motion, AnimatePresence } from "motion/react";

const winningShoeImage = "/src/assets/images/winning_shoe_1780411254457.png";

interface DashboardGlobalProps {
  products: ProductType[];
  clients: ClientType[];
  sales: SaleType[];
  marketingMetrics: MarketingMetricType[];
  expenses: ExpenseType[];
}

export default function DashboardGlobal({ 
  products, 
  clients, 
  sales, 
  marketingMetrics, 
  expenses 
}: DashboardGlobalProps) {
  // Range Presets: "30days", "thisYear", "historical" (2.5 years)
  const [rangePreset, setRangePreset] = useState<"30days" | "thisYear" | "historical">("historical");
  
  // Custom date bounds depending on preset
  const [startDate, setStartDate] = useState("2023-12-01"); // approx 2.5 years ago
  const [endDate, setEndDate] = useState("2026-06-02");

  // Power BI Cross-Filtering Slicer State
  // "TODOS" or specific channel
  const [selectedChannel, setSelectedChannel] = useState<string>("TODOS");

  // Sync date ranges when preset changes
  React.useEffect(() => {
    if (rangePreset === "30days") {
      setStartDate("2026-05-03");
      setEndDate("2026-06-02");
    } else if (rangePreset === "thisYear") {
      setStartDate("2026-01-01");
      setEndDate("2026-06-02");
    } else if (rangePreset === "historical") {
      setStartDate("2023-12-01");
      setEndDate("2026-06-02");
    }
  }, [rangePreset]);

  // Sparkle details / hover states
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);
  const [hoveredPareto, setHoveredPareto] = useState<string | null>(null);

  // --- ANALYTICS ENGINES ---

  // 1. Raw sales in range
  const rawSalesInRange = useMemo(() => {
    return sales.filter(s => s.fecha_venta >= startDate && s.fecha_venta <= endDate);
  }, [sales, startDate, endDate]);

  // Aggregated Sales in Date Range with Sanitized Channels
  // (maps legacy "Tienda" -> "Instagram" and "Web" -> "Tienda Virtual")
  const baseSalesSelectedRange = useMemo(() => {
    return rawSalesInRange.map(s => {
      let canal = s.canal_venta || "WhatsApp";
      if (canal === ("Tienda" as any)) canal = "Instagram";
      if (canal === ("Web" as any)) canal = "Tienda Virtual";
      return { 
        ...s, 
        canal_venta: canal as 'WhatsApp' | 'Instagram' | 'Facebook' | 'TikTok' | 'Tienda Virtual' 
      };
    });
  }, [rawSalesInRange]);

  // 2. APPLY CHANNELS CROSS-FILTERING (Power BI Experience)
  const filteredSales = useMemo(() => {
    if (selectedChannel === "TODOS") {
      return baseSalesSelectedRange;
    }
    return baseSalesSelectedRange.filter(s => s.canal_venta === selectedChannel);
  }, [baseSalesSelectedRange, selectedChannel]);

  // Filter Expenses globally in range
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => e.fecha >= startDate && e.fecha <= endDate);
  }, [expenses, startDate, endDate]);

  // Filter Marketing ads metrics globally in range
  const filteredMarketing = useMemo(() => {
    return marketingMetrics.filter(m => m.fecha >= startDate && m.fecha <= endDate);
  }, [marketingMetrics, startDate, endDate]);

  // 1. FINANCIAL KPI CALCULATIONS (Filtered by Channel!)
  const grossRevenue = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.ingreso_bruto, 0);
  }, [filteredSales]);

  const cogs = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.costo_total, 0);
  }, [filteredSales]);

  // Gasto Operativo en el rango (Operating expenses are allocated globally, or weighted when cross-filtering is on)
  const totalOperatingCosts = useMemo(() => {
    const rawCosts = filteredExpenses.reduce((acc, e) => acc + e.monto, 0);
    // If a channel is selected, we allocate operating cost proportionally to that channel's revenue share to be mathematically sound!
    if (selectedChannel === "TODOS" || baseSalesSelectedRange.length === 0) {
      return rawCosts;
    }
    const totalRevAllChannels = baseSalesSelectedRange.reduce((acc, s) => acc + s.ingreso_bruto, 0);
    const weight = totalRevAllChannels > 0 ? (grossRevenue / totalRevAllChannels) : 0;
    return rawCosts * weight;
  }, [filteredExpenses, selectedChannel, baseSalesSelectedRange, grossRevenue]);

  // Spend on Marketing Ads (Allocation)
  const totalMarketingSpend = useMemo(() => {
    const rawSpend = filteredMarketing.reduce((acc, m) => acc + m.gasto, 0);
    if (selectedChannel === "TODOS") {
      return rawSpend;
    }
    
    // Proportional spend allocation based on platform matching
    // e.g. Meta Ads spent goes mostly to WA/IG/FB. TikTok metrics to TikTok channel.
    let weight = 0;
    const totalRevAllChannels = baseSalesSelectedRange.reduce((acc, s) => acc + s.ingreso_bruto, 0);
    if (totalRevAllChannels > 0) {
      weight = grossRevenue / totalRevAllChannels;
    }
    
    const metaSpend = filteredMarketing
      .filter(m => m.plataforma === "Meta Ads")
      .reduce((acc, m) => acc + m.gasto, 0);
    
    const tiktokSpend = filteredMarketing
      .filter(m => m.plataforma.includes("TikTok"))
      .reduce((acc, m) => acc + m.gasto, 0);

    if (selectedChannel === "WhatsApp" || selectedChannel === "Instagram" || selectedChannel === "Facebook") {
      // Allocate portion of Meta budget + organic overhead
      return metaSpend * (grossRevenue / (baseSalesSelectedRange
        .filter(s => ["WhatsApp", "Instagram", "Facebook"].includes(s.canal_venta))
        .reduce((acc, s) => acc + s.ingreso_bruto, 0) || 1));
    } else if (selectedChannel === "TikTok") {
      return tiktokSpend;
    } else {
      return rawSpend * weight;
    }
  }, [filteredMarketing, selectedChannel, baseSalesSelectedRange, grossRevenue]);

  const totalCostsAndExpenses = useMemo(() => {
    return cogs + totalOperatingCosts + totalMarketingSpend;
  }, [cogs, totalOperatingCosts, totalMarketingSpend]);

  const netUtility = useMemo(() => {
    return grossRevenue - totalCostsAndExpenses;
  }, [grossRevenue, totalCostsAndExpenses]);

  const profitMarginPercent = useMemo(() => {
    return grossRevenue > 0 ? (netUtility / grossRevenue) * 100 : 0;
  }, [grossRevenue, netUtility]);
  
  const averageTicket = useMemo(() => {
    const saleIDs = Array.from(new Set(filteredSales.map(s => s.id_venta)));
    return saleIDs.length > 0 ? grossRevenue / saleIDs.length : 0;
  }, [filteredSales, grossRevenue]);

  // 2. MARKETING FUNNEL & ATTRIBUTION DIGITAL (Social messaging oriented)
  const totalImpressions = useMemo(() => {
    return filteredMarketing.reduce((acc, m) => acc + m.impresiones, 0);
  }, [filteredMarketing]);

  const totalClicksOnAds = useMemo(() => {
    return filteredMarketing.reduce((acc, m) => acc + m.clics_enlace, 0);
  }, [filteredMarketing]);

  // Conversations initiated (People writing to WhatsApp or DMing on Instagram / Facebook / TikTok)
  const totalMessageConversations = useMemo(() => {
    const sumMessagesLogged = filteredMarketing.reduce((acc, m) => acc + (m.mensajes || 0), 0);
    if (sumMessagesLogged > 0) return sumMessagesLogged;
    // Fallback heuristic: 3.5% of Clics en Ads successfully initiate an actual chat/text conversation with operators
    return Math.round(totalClicksOnAds * 0.035) || Math.round(filteredSales.length * 2.8) || 30;
  }, [filteredMarketing, totalClicksOnAds, filteredSales.length]);

  const closedSalesCount = useMemo(() => {
    return Array.from(new Set(filteredSales.map(s => s.id_venta))).length;
  }, [filteredSales]);

  // Conversions Pixel value
  const totalConversionsValue = useMemo(() => {
    return filteredMarketing.reduce((acc, m) => acc + m.valor_conversion_pixel, 0);
  }, [filteredMarketing]);

  const averageRoas = useMemo(() => {
    return totalMarketingSpend > 0 ? totalConversionsValue / totalMarketingSpend : 0;
  }, [totalMarketingSpend, totalConversionsValue]);

  // CAC & LTV calculations
  const newlyAcquiredClientsCount = useMemo(() => {
    // If channel filtered, count clients whose acquisition source or preferred purchase match
    const periodClients = clients.filter(c => c.fecha_registro >= startDate && c.fecha_registro <= endDate);
    if (selectedChannel === "TODOS") return periodClients.length;
    
    return periodClients.filter(c => {
      let clientCh = c.canal_preferido_compra;
      if (clientCh === ("Tienda" as any)) clientCh = "Instagram";
      if (clientCh === ("Web" as any)) clientCh = "Tienda Virtual";
      return clientCh === selectedChannel;
    }).length;
  }, [clients, startDate, endDate, selectedChannel]);

  const cac = useMemo(() => {
    const divisor = newlyAcquiredClientsCount > 0 ? newlyAcquiredClientsCount : (closedSalesCount * 0.4 || 1);
    return totalMarketingSpend / divisor;
  }, [totalMarketingSpend, newlyAcquiredClientsCount, closedSalesCount]);

  // Advanced Customer Lifetime Value (LTV) in range
  const averageLtv = useMemo(() => {
    // Total gross sales value per client / total clients
    const clientSalesMap: { [key: string]: number } = {};
    filteredSales.forEach(s => {
      clientSalesMap[s.id_cliente] = (clientSalesMap[s.id_cliente] || 0) + s.ingreso_bruto;
    });
    
    const clientSalesArray = Object.values(clientSalesMap);
    if (clientSalesArray.length === 0) return 0;
    const sumLtv = clientSalesArray.reduce((a, b) => a + b, 0);
    return sumLtv / clientSalesArray.length;
  }, [filteredSales]);

  // Health Index Ratio (LTV / CAC) - Standard Power BI gauge
  const ltvToCacRatio = useMemo(() => {
    return cac > 0 ? averageLtv / cac : 0;
  }, [averageLtv, cac]);

  // 3. STATS INVENTORY rotation
  const totalRemainingStock = useMemo(() => {
    return products.reduce((acc, p) => acc + p.stock_disponible, 0);
  }, [products]);

  const totalUnitsSold = useMemo(() => {
    return filteredSales.reduce((acc, s) => acc + s.cantidad, 0);
  }, [filteredSales]);

  const stockCriticalProducts = useMemo(() => {
    return products.filter(p => p.stock_disponible <= 3);
  }, [products]);

  // Find slow-moving products (low sales, high stock in current perspective)
  const slowMovingStockProducts = useMemo(() => {
    return products.map(p => {
      // Calculate units sold for this SKU
      const soldQty = filteredSales
        .filter(s => s.sku === p.sku && !s.es_devolucion)
        .reduce((sum, s) => sum + s.cantidad, 0);

      return {
        ...p,
        vendidos_rango: soldQty,
        stock: p.stock_disponible,
        prioridad_promocion: p.stock_disponible * 2.5 - soldQty // higher priority for more overstock and fewer sales
      };
    })
    // Filter to items with high stock (>= 6) and low sales (<= 2) in the filtered window
    .filter(p => p.stock_disponible >= 6 && p.vendidos_rango <= 2)
    .sort((a, b) => b.prioridad_promocion - a.prioridad_promocion);
  }, [products, filteredSales]);

  // 4. CHART DATA 1: SALES & EXPENSES TIMELINE (Cross-filtered!)
  const monthlyTimelineData = useMemo(() => {
    const monthsGroup: { [key: string]: { revenue: number; expense: number; qty: number } } = {};
    
    // Process Sales (dynamically filtered by Slicer)
    filteredSales.forEach(s => {
      const monthLabel = s.fecha_venta.substring(0, 7); // "YYYY-MM"
      if (!monthsGroup[monthLabel]) {
        monthsGroup[monthLabel] = { revenue: 0, expense: 0, qty: 0 };
      }
      monthsGroup[monthLabel].revenue += s.ingreso_bruto;
      monthsGroup[monthLabel].expense += s.costo_total; // COGS portion
      monthsGroup[monthLabel].qty += s.cantidad;
    });

    // Process Operating & Marketing Expenses (allocated per selection or fully historical)
    filteredExpenses.forEach(e => {
      const monthLabel = e.fecha.substring(0, 7);
      if (!monthsGroup[monthLabel]) {
        monthsGroup[monthLabel] = { revenue: 0, expense: 0, qty: 0 };
      }
      
      let allocatedAmount = e.monto;
      if (selectedChannel !== "TODOS" && baseSalesSelectedRange.length > 0) {
        // weigh it
        const totalRevAllChannels = baseSalesSelectedRange.reduce((acc, s) => acc + s.ingreso_bruto, 0);
        allocatedAmount = e.monto * (grossRevenue / (totalRevAllChannels || 1));
      }
      monthsGroup[monthLabel].expense += allocatedAmount;
    });

    filteredMarketing.forEach(m => {
      const monthLabel = m.fecha.substring(0, 7);
      if (!monthsGroup[monthLabel]) {
        monthsGroup[monthLabel] = { revenue: 0, expense: 0, qty: 0 };
      }
      
      let allocatedAd = m.gasto;
      if (selectedChannel !== "TODOS") {
        if (selectedChannel === "WhatsApp" || selectedChannel === "Instagram" || selectedChannel === "Facebook") {
          allocatedAd = m.plataforma === "Meta Ads" ? m.gasto : 0;
        } else if (selectedChannel === "TikTok") {
          allocatedAd = m.plataforma.includes("TikTok") ? m.gasto : 0;
        } else {
          allocatedAd = 0;
        }
      }
      monthsGroup[monthLabel].expense += allocatedAd;
    });

    // Convert to sorted list
    return Object.entries(monthsGroup)
      .map(([month, val]) => ({
        month,
        revenue: val.revenue,
        expense: val.expense,
        qty: val.qty
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredSales, filteredExpenses, filteredMarketing, selectedChannel, baseSalesSelectedRange, grossRevenue]);

  // Timeline SVG calculations
  const maxTimelineVal = useMemo(() => {
    const vals = monthlyTimelineData.flatMap(d => [d.revenue, d.expense]);
    return vals.length > 0 ? Math.max(...vals, 1000) * 1.15 : 1000;
  }, [monthlyTimelineData]);

  // 5. CHART DATA 2: BRANDS MARKETSHARE GROUPING (Cross-filtered!)
  const brandData = useMemo(() => {
    const brands: { [key: string]: { qty: number; revenue: number } } = {};
    
    filteredSales.forEach(s => {
      const prod = products.find(p => p.sku === s.sku);
      const brand = prod?.marca || "Zeta";
      if (!brands[brand]) {
        brands[brand] = { qty: 0, revenue: 0 };
      }
      brands[brand].qty += s.cantidad;
      brands[brand].revenue += s.ingreso_bruto;
    });

    const totalRevenueRange = Object.values(brands).reduce((sum, b) => sum + b.revenue, 0);

    return Object.entries(brands)
      .map(([name, val]) => ({
        name,
        qty: val.qty,
        revenue: val.revenue,
        percentage: totalRevenueRange > 0 ? (val.revenue / totalRevenueRange) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [filteredSales, products]);

  // 6. CHANNEL SHARE SECTOR (Always displays all selection options, highlights active selection!)
  const channelData = useMemo(() => {
    const channels: { [key: string]: number } = { 
      "WhatsApp": 0, 
      "Instagram": 0, 
      "Facebook": 0, 
      "TikTok": 0, 
      "Tienda Virtual": 0 
    };

    baseSalesSelectedRange.forEach(s => {
      const canal = s.canal_venta;
      if (channels[canal] !== undefined) {
        channels[canal] += s.ingreso_bruto;
      }
    });

    const totalChan = Object.values(channels).reduce((a, b) => a + b, 0);

    return Object.entries(channels).map(([name, value]) => ({
      name,
      value,
      percent: totalChan > 0 ? (value / totalChan) * 100 : 0
    })).sort((a, b) => b.value - a.value);
  }, [baseSalesSelectedRange]);

  // Demographics Grouping (Cross-filtered!)
  const ageCohortData = useMemo(() => {
    const counts = { "18-24": 0, "25-34": 0, "35-44": 0, "45-54": 0, "55+": 0 };
    filteredSales.forEach(s => {
      const cli = clients.find(c => c.id_cliente === s.id_cliente);
      if (cli && counts[cli.grupo_edad] !== undefined) {
        counts[cli.grupo_edad] += Math.abs(s.cantidad);
      }
    });
    const totalAgeUnits = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([name, qty]) => ({
      name,
      qty,
      percent: totalAgeUnits > 0 ? (qty / totalAgeUnits) * 100 : 0
    }));
  }, [filteredSales, clients]);

  // Regional Hotspots (Cross-filtered matrix)
  const regionData = useMemo(() => {
    const regions: { [key: string]: { rev: number; qty: number } } = {};
    filteredSales.forEach(s => {
      const key = s.estado_entrega || "No Definido";
      if (!regions[key]) {
        regions[key] = { rev: 0, qty: 0 };
      }
      regions[key].rev += s.ingreso_bruto;
      regions[key].qty += s.cantidad;
    });
    return Object.entries(regions)
      .map(([state, data]) => ({ state, rev: data.rev, qty: data.qty }))
      .sort((a, b) => b.rev - a.rev)
      .slice(0, 4);
  }, [filteredSales]);

  // 7. POWER BI PARETO ANALYSIS CRUCIAL MODULE (Identify brands accounting for 80% cumulative revenue)
  const paretoData = useMemo(() => {
    let runningSum = 0;
    const totalRev = brandData.reduce((acc, b) => acc + b.revenue, 0);
    
    return brandData.map((b) => {
      runningSum += b.revenue;
      const cumPercent = totalRev > 0 ? (runningSum / totalRev) * 100 : 0;
      return {
        ...b,
        cumPercent,
        isEssential80: cumPercent - b.percentage <= 80.1
      };
    });
  }, [brandData]);

  // Find most active campaign / Creative
  const bestAd = useMemo(() => {
    if (filteredMarketing.length === 0) return null;
    const adGroups: { [key: string]: { score: number; rev: number; spent: number } } = {};
    
    filteredMarketing.forEach(m => {
      const creativeId = m.id_contenido;
      if (!adGroups[creativeId]) {
        adGroups[creativeId] = { score: 0, rev: 0, spent: 0 };
      }
      adGroups[creativeId].spent += m.gasto;
      adGroups[creativeId].rev += m.valor_conversion_pixel;
    });

    const adArr = Object.entries(adGroups).map(([id, val]) => {
      return {
        id,
        spent: val.spent,
        rev: val.rev,
        roas: val.spent > 0 ? val.rev / val.spent : 0
      };
    });

    return adArr.sort((a,b) => b.roas - a.roas)[0];
  }, [filteredMarketing]);

  // POWER BI LIVE INSIGHTS: DYNAMIC AVATAR DEL CLIENTE ESTRELLA / CLIENTE IDEAL (Sr. / Sra. Zeta)
  const clientStarAvatar = useMemo(() => {
    // 1. Defalut / fallback profiles
    const defaultObj = {
      nombre: "Sr. Zeta",
      genero: "Masculino",
      edad: 45,
      talla: "43",
      color: "Blanco",
      categoria: "Calzado",
      subcategoria: "Zapatos",
      canal: selectedChannel === "TODOS" ? "WhatsApp" : selectedChannel,
      triggerAnuncio: "Meta Ads en temática narrativa / Storytelling hito",
      grupo_edad_sub: "45-54 años"
    };

    if (filteredSales.length === 0) {
      return defaultObj;
    }

    // Accumulators
    const genderCounts: { [key: string]: number } = {};
    const ageSum: { sum: number; count: number } = { sum: 0, count: 0 };
    const cohortCounts: { [key: string]: number } = {};
    const sizeCounts: { [key: string]: number } = {};
    const colorCounts: { [key: string]: number } = {};
    const categoryCounts: { [key: string]: number } = {};
    const subcategoryCounts: { [key: string]: number } = {};
    const adCounts: { [key: string]: number } = {};

    filteredSales.forEach(s => {
      const qty = Math.abs(s.cantidad) || 1;

      // Classify Client
      const cli = clients.find(c => c.id_cliente === s.id_cliente);
      if (cli) {
        genderCounts[cli.genero] = (genderCounts[cli.genero] || 0) + qty;
        if (cli.edad) {
          ageSum.sum += cli.edad * qty;
          ageSum.count += qty;
        }
        if (cli.grupo_edad) {
          cohortCounts[cli.grupo_edad] = (cohortCounts[cli.grupo_edad] || 0) + qty;
        }
      }

      // Classify Product
      const prod = products.find(p => p.sku === s.sku);
      if (prod) {
        sizeCounts[String(prod.talla)] = (sizeCounts[String(prod.talla)] || 0) + qty;
        colorCounts[prod.color] = (colorCounts[prod.color] || 0) + qty;
        categoryCounts[prod.categoria] = (categoryCounts[prod.categoria] || 0) + qty;
        subcategoryCounts[prod.subcategoria] = (subcategoryCounts[prod.subcategoria] || 0) + qty;
      }

      // Classify Ad Creative
      if (s.id_contenido) {
        adCounts[s.id_contenido] = (adCounts[s.id_contenido] || 0) + qty;
      }
    });

    const getMaxKey = (obj: { [key: string]: number }, fallback: string) => {
      const entries = Object.entries(obj);
      if (entries.length === 0) return fallback;
      return entries.sort((a, b) => b[1] - a[1])[0][0];
    };

    const topGender = getMaxKey(genderCounts, "Masculino");
    const avgAge = ageSum.count > 0 ? Math.round(ageSum.sum / ageSum.count) : (topGender === "Femenino" ? 32 : 45);
    const topCohort = getMaxKey(cohortCounts, "35-44");
    const topSize = getMaxKey(sizeCounts, "43");
    const topColor = getMaxKey(colorCounts, "Blanco");
    const topCategory = getMaxKey(categoryCounts, "Calzado");
    const topSubcategory = getMaxKey(subcategoryCounts, "Zapatos");

    // Dynamic brand or style naming
    let nombre = "Sr. Zeta";
    if (topGender === "Femenino") {
      nombre = "Sra. Zeta";
    } else if (topGender === "Otro") {
      nombre = "Persona Zeta";
    }

    // Ad Attribution trigger theme finder
    const topAdId = getMaxKey(adCounts, "");
    let triggerAnuncio = "Anuncios narrativos de Meta en WhatsApp";

    if (topAdId) {
      if (topAdId.includes("REEL") || topAdId.toLowerCase().includes("reel")) {
        triggerAnuncio = "Video Reel con temática narrativa y humana";
      } else if (topAdId.includes("LIVE") || topAdId.toLowerCase().includes("live")) {
        triggerAnuncio = "Liquidación interactiva en TikTok Live compras";
      } else if (topAdId.includes("EST") || topAdId.toLowerCase().includes("static")) {
        triggerAnuncio = "Anuncio estático minimalista de alta gama estética";
      } else {
        triggerAnuncio = `Campaña publicitaria #${topAdId} en redes`;
      }
    } else {
      let topChan = selectedChannel;
      if (topChan === "TODOS") {
        const chanRevenue: { [key: string]: number } = {};
        filteredSales.forEach(s => {
          chanRevenue[s.canal_venta] = (chanRevenue[s.canal_venta] || 0) + s.ingreso_bruto;
        });
        topChan = getMaxKey(chanRevenue, "WhatsApp");
      }

      if (topChan === "TikTok") {
        triggerAnuncio = "TikTok Loops orgánicos de comedia y unboxing";
      } else if (topChan === "Instagram" || topChan === "Facebook" || topChan === "WhatsApp") {
        triggerAnuncio = "Anuncio de Meta Ads con copia conversacional hilada";
      } else {
        triggerAnuncio = "Copa estática en catálogo de tienda virtual";
      }
    }

    return {
      nombre,
      genero: topGender,
      edad: avgAge,
      talla: topSize,
      color: topColor,
      categoria: topCategory,
      subcategoria: topSubcategory,
      canal: selectedChannel === "TODOS" ? "WhatsApp" : selectedChannel,
      triggerAnuncio,
      grupo_edad_sub: `Grupo ${topCohort}`
    };
  }, [filteredSales, clients, products, selectedChannel]);

  // Find top selling product in the filtered range (Winning Product)
  const winningProduct = useMemo(() => {
    if (filteredSales.length === 0) {
      return {
        sku: "ZAP-002-42-MARRON",
        nombre: "Botas de Cuero Marrón",
        marca: "Zeta Outdoor",
        precio: 65,
        talla: "42",
        color: "Marrón",
        qty: 18,
        revenue: 1170,
        driveUrl: ""
      };
    }

    const productSales: { [key: string]: { qty: number; revenue: number } } = {};
    filteredSales.forEach(s => {
      if (s.es_devolucion) return; // skip returns for top seller power calculation
      const qty = s.cantidad;
      const rev = s.ingreso_bruto;
      productSales[s.sku] = {
        qty: (productSales[s.sku]?.qty || 0) + qty,
        revenue: (productSales[s.sku]?.revenue || 0) + rev
      };
    });

    const entries = Object.entries(productSales);
    if (entries.length === 0) {
      return {
        sku: "ZAP-002-42-MARRON",
        nombre: "Botas de Cuero Marrón",
        marca: "Zeta Outdoor",
        precio: 65,
        talla: "42",
        color: "Marrón",
        qty: 18,
        revenue: 1170,
        driveUrl: ""
      };
    }

    // Sort by revenue descending to identify true monetary winner
    const [topSku, data] = entries.sort((a, b) => b[1].revenue - a[1].revenue)[0];
    const prodDetails = products.find(p => p.sku === topSku);

    return {
      sku: topSku,
      qty: data.qty,
      revenue: data.revenue,
      nombre: prodDetails?.nombre_producto || "Calzado Premium Zeta",
      marca: prodDetails?.marca || "Zeta",
      precio: prodDetails?.precio_venta_referencia || 45,
      talla: prodDetails?.talla || "Varios",
      color: prodDetails?.color || "N/A",
      driveUrl: prodDetails?.url_carpeta_drive || ""
    };
  }, [filteredSales, products]);

  return (
    <div className="space-y-8 animate-fade-in text-gray-900 pb-12">
      
      {/* 1. Header with Title & Date preset metrics */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono text-[#FCD901] font-semibold bg-[#FCD901]/10 px-2.5 py-1 rounded border border-[#FCD901]/20 w-fit uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FCD901] animate-pulse" />
            Socio Analítico Pro • Modos Avanzados de Power BI
          </div>
          <h1 className="font-sans text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-1.5 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Panel de Control Ejecutivo Zeta
          </h1>
          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">
            Consolidación avanzada de transacciones digitales cruzadas con marketing atribución. 
            Segmentamos tus canales conversacionales (<span className="text-emerald-600 font-semibold">WhatsApp</span>, <span className="text-pink-400 font-semibold">Instagram</span>, <span className="text-blue-600 font-semibold">Facebook</span>, y <span className="text-[#00f2fe] font-semibold">TikTok</span>) con cross-filtering completo.
          </p>
        </div>

        {/* Range Selector Preset */}
        <div className="flex flex-wrap items-center gap-2 bg-[#FDFDFD] p-2 rounded-xl border border-gray-200">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono px-2 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#FCD901]" />
            Período:
          </div>
          
          {(["30days", "thisYear", "historical"] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => setRangePreset(preset)}
              className={`px-3 py-1.5 rounded font-mono text-[10px] tracking-wide transition-all uppercase ${
                rangePreset === preset 
                  ? "bg-[#FCD901] text-[#0A0A0A] font-extrabold shadow" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/5"
              }`}
            >
              {preset === "30days" ? "30 Días" : preset === "thisYear" ? "Este Año" : "Histórico (2.5 Años)"}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

          {/* Custom Date Inputs */}
          <div className="flex items-center gap-2 font-mono text-[10px] text-gray-500">
            <input 
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setRangePreset("historical" as any); // Custom trigger
              }}
              className="bg-white text-gray-900 py-1 px-2 border border-gray-200 rounded focus:outline-none text-[10px]"
            />
            <span>Al</span>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setRangePreset("historical" as any); // Custom trigger
              }}
              className="bg-white text-gray-900 py-1 px-2 border border-gray-200 rounded focus:outline-none text-[10px]"
            />
          </div>
        </div>
      </div>

      {/* 2. POWER BI SEGMENTATION SLICER BAR (The interactive filtering experience) */}
      <div className="bg-[#FDFDFD] p-4 rounded-xl border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2 bg-amber-500/10 text-[#FCD901] rounded font-mono text-[10px] font-bold border border-amber-500/15">Slicing Activo</div>
            <h3 className="font-sans font-bold text-xs text-gray-700 uppercase tracking-widest">
              Segmentación Cruzada de Ventas por Canal
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-500">
            Presiona un canal para filtrar todo el informe:
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3.5">
          <button
            onClick={() => setSelectedChannel("TODOS")}
            className={`py-2 rounded-lg text-xs font-mono border transition-all flex flex-col items-center justify-center gap-1 ${
              selectedChannel === "TODOS"
                ? "bg-white text-gray-900 font-extrabold border-white shadow-lg"
                : "bg-[#FDFDFD] text-gray-500 border-gray-200 hover:border-[#666] hover:text-gray-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-[10px] uppercase">Mostrar Todo</span>
          </button>

          {[
            { id: "WhatsApp", icon: MessageSquare, colorClass: "text-emerald-600", hoverColor: "hover:border-emerald-500/40" },
            { id: "Instagram", icon: ShoppingBag, colorClass: "text-pink-400", hoverColor: "hover:border-pink-500/40" },
            { id: "Facebook", icon: Users, colorClass: "text-blue-600", hoverColor: "hover:border-blue-500/40" },
            { id: "TikTok", icon: Flame, colorClass: "text-[#00f2fe]", hoverColor: "hover:border-indigo-500/40" },
            { id: "Tienda Virtual", icon: Target, colorClass: "text-amber-400", hoverColor: "hover:border-amber-500/40" }
          ].map((ch) => {
            const Icon = ch.icon;
            const isActive = selectedChannel === ch.id;
            return (
              <button
                key={ch.id}
                onClick={() => setSelectedChannel(ch.id)}
                className={`py-2 rounded-lg text-xs font-mono border transition-all flex flex-col items-center justify-center gap-1 ${
                  isActive
                    ? "bg-[#FCD901] text-[#0A0A0A] font-extrabold border-[#FCD901]/20 shadow-lg scale-[1.03]"
                    : `bg-[#FDFDFD] text-gray-500 border-gray-200 ${ch.hoverColor} hover:text-gray-900`
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gray-900' : ch.colorClass}`} />
                <span className="text-[9px] uppercase tracking-tighter truncate max-w-full px-1">{ch.id}</span>
              </button>
            );
          })}
        </div>
        
        {/* Dynamic badge indicator */}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-700 bg-[#FDFDFD] p-2.5 rounded-lg border border-gray-200 font-sans font-medium">
          <Activity className="w-4 h-4 text-[#FCD901] shrink-0 animate-pulse" />
          <span>Filtro de Datos: </span>
          <span className="text-gray-900 font-bold uppercase underline decoration-[#aef527] tracking-wider">
            {selectedChannel === "TODOS" ? "Consolidando todos los Canales y Ads" : `Restringido únicamente a: ${selectedChannel}`}
          </span>
          <span className="text-gray-500 hidden sm:inline ml-auto">
            ({filteredSales.length} transacciones unificadas en rango de fechas)
          </span>
        </div>
      </div>

      {/* 3. CORE FINANCIAL CARD METRICS ROW (Power BI KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* REVENUE CARD */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#444] transition-all duration-300">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign className="w-24 h-24 text-gray-900" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-gray-700 font-sans uppercase font-extrabold">VENTAS BRUTAS ({selectedChannel})</span>
            <span className="bg-emerald-950/40 text-emerald-600 border border-emerald-500/10 text-xs font-mono font-bold px-2.5 py-1 rounded flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> FACTURADO
            </span>
          </div>
          <div className="mt-5">
            <h2 className="text-4xl font-extrabold text-gray-900 font-sans tracking-tight">
              ${grossRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="text-xs text-gray-500 mt-3 flex justify-between items-center bg-[#FDFDFD] p-2 rounded border border-gray-200 font-mono">
              <span>{filteredSales.length} Pedidos Cerrados</span>
              <span className="text-[#FCD901] font-bold">Ticket Prom: ${averageTicket.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* COSTS CARD */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#444] transition-all duration-300">
          <div className="absolute top-0 right-0 p-5 opacity-5 group-hover:scale-110 transition-transform">
            <DollarSign className="w-24 h-24 text-gray-900" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-gray-700 font-sans uppercase font-extrabold">COSTOS & INVERSIÓN AD</span>
            <span className="bg-red-950/40 text-red-400 border border-red-500/10 text-xs font-mono font-bold px-2.5 py-1 rounded flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" /> EGRESOS EST.
            </span>
          </div>
          <div className="mt-5">
            <h2 className="text-4xl font-extrabold text-[#dddddd] font-sans tracking-tight">
              ${totalCostsAndExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div className="text-xs text-gray-500 mt-3 flex flex-wrap justify-between gap-2 bg-[#FDFDFD] p-2 rounded border border-gray-200 font-mono">
              <span>COGS: ${cogs.toLocaleString()}</span>
              <span className="text-red-400 font-bold">• AdSpend: ${Math.round(totalMarketingSpend).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* MARGIN CARD */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#444] transition-all duration-300">
          <div className="absolute top-5 right-5 w-3.5 h-3.5 rounded-full bg-amber-500/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping"></div>
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-gray-700 font-sans uppercase font-extrabold">UTILIDAD NETO ({selectedChannel})</span>
            <span className={`border text-xs font-mono font-bold px-2.5 py-1 rounded ${
              netUtility >= 0 
                ? "bg-amber-50 text-amber-800 border-amber-200" 
                : "bg-red-50 text-red-650 border-red-200"
            }`}>
              {profitMarginPercent.toFixed(1)}% MARGEN
            </span>
          </div>
          <div className="mt-5">
            <h2 className={`text-4xl font-extrabold font-sans tracking-tight ${netUtility >= 0 ? 'text-amber-800' : 'text-red-600'}`}>
              ${netUtility.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <span className="text-xs text-gray-500 block mt-3 leading-relaxed bg-[#FDFDFD] p-2 rounded border border-gray-200 font-mono">
              Retorno real deducidos costos y prorrateo de nómina/publicidad.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* METRICS RATIO (CAC/LTV) */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#444] transition-all duration-300">
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-gray-700 font-sans uppercase font-extrabold">EFICIENCIA DE CLIENTE</span>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold px-2.5 py-1 rounded">
              LTV : CAC
            </span>
          </div>
          <div className="mt-5">
            <h2 className="text-4xl font-extrabold text-gray-900 font-sans tracking-tight">
              {ltvToCacRatio > 0 ? `${ltvToCacRatio.toFixed(1)}x` : "N/D"}
            </h2>
            <div className="text-xs text-gray-500 mt-3 flex justify-between bg-[#FDFDFD] p-2 rounded border border-gray-200 font-mono">
              <span>CAC: ${cac.toFixed(1)}</span>
              <span className="text-indigo-700 font-bold">LTV Estimado: ${averageLtv.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* CLIENT STAR AVATAR CARD */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#FCD901]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles className="w-16 h-16 text-amber-600 animate-pulse" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-amber-700 font-sans uppercase font-extrabold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Cliente Ideal
            </span>
            <span className="bg-amber-100/50 text-amber-850 border border-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Ganador ★
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {/* Round Miniature Photo Frame */}
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-gray-900 truncate leading-tight">
                {clientStarAvatar.nombre}
              </h3>
              <p className="text-xs text-gray-550 text-gray-500 font-mono">
                {clientStarAvatar.edad} años • {clientStarAvatar.grupo_edad_sub}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-gray-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Favorito:</span>
              <span className="text-gray-900 font-bold uppercase truncate max-w-[150px]">
                {clientStarAvatar.subcategoria} {clientStarAvatar.color}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Talla Ideal:</span>
              <span className="text-amber-850 font-extrabold bg-amber-100/60 px-2 py-0.5 rounded border border-amber-200">
                Talla {clientStarAvatar.talla}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Canal Favorito:</span>
              <span className="text-emerald-600 font-bold truncate">
                {clientStarAvatar.canal}
              </span>
            </div>
            <div className="text-[10px] font-mono text-gray-700 leading-normal bg-gray-50/50 p-2.5 rounded border border-gray-200 mt-2 col-span-2">
              <span className="text-amber-850 font-bold block mb-1 uppercase tracking-wider text-[8px]">Ganador con:</span>
              {clientStarAvatar.triggerAnuncio}
            </div>
          </div>
        </div>

        {/* WINNING PRODUCT KPI CARD (Producto Ganador con zapato) */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 relative overflow-hidden group hover:border-[#FCD901]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:scale-110 transition-transform">
            <PackageCheck className="w-16 h-16 text-amber-600 animate-pulse" />
          </div>
          <div className="flex justify-between items-start">
            <span className="text-xs tracking-wider text-amber-700 font-sans uppercase font-extrabold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Producto Ganador
            </span>
            <span className="bg-amber-100/50 text-amber-850 border border-amber-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Top Ventas ★
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            {/* Show the beautiful photorealistic shoe image! */}
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#FCD901]/20 shrink-0 bg-[#FDFDFD] flex items-center justify-center">
              <img 
                src={winningShoeImage} 
                alt={winningProduct?.nombre || "Producto Ganador"} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-extrabold text-gray-900 truncate leading-tight" title={winningProduct?.nombre}>
                {winningProduct?.nombre}
              </h3>
              <p className="text-xs text-gray-500 font-mono">
                {winningProduct?.marca} • SKU: {winningProduct?.sku}
              </p>
            </div>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-gray-200 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Unidades:</span>
              <span className="text-gray-900 font-extrabold text-sm text-[13px]">
                {winningProduct?.qty} pares
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Ingresos Totales:</span>
              <span className="text-amber-850 font-extrabold text-sm text-[13px]">
                ${winningProduct?.revenue?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Atributos:</span>
              <span className="text-gray-700 font-semibold truncate max-w-[180px]">
                Color {winningProduct?.color} ({winningProduct?.talla})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Precio Ref:</span>
              <span className="text-amber-850 font-extrabold text-sm text-[13px]">
                ${winningProduct?.precio} USD
              </span>
            </div>
            {winningProduct?.driveUrl && (
              <a 
                href={winningProduct.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-center block text-amber-700 hover:text-amber-900 underline mt-3"
              >
                Ver carpeta en Drive ↗
              </a>
            )}
          </div>
        </div>

      </div>

      {/* 4. MAIN DOUBLE GRAPH BLOCK: FINANCIAL HISTORICAL TRENDS & PARETO BRAND BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRAPH 1: TREND TIMELINE BY MONTH */}
        <div className="lg:col-span-2 bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-4 gap-2">
            <div>
              <span className="text-[10px] font-mono text-[#FCD901] tracking-wider uppercase font-bold">MONITOR EN TIEMPO REAL - POWER BI ENGINE</span>
              <h2 className="text-lg font-bold text-gray-900 font-sans tracking-tight mt-1">Evolución de Ingresos vs Egresos ({selectedChannel})</h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm"></span> Ingresos
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-sm"></span> Costo Consolidado
              </div>
            </div>
          </div>

          <div className="relative h-64 w-full">
            {monthlyTimelineData.length === 0 ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500 bg-[#FDFDFD] rounded">
                Sin transacciones registradas en el canal o rango seleccionado.
              </div>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#aef527" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#aef527" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                  <line 
                    key={idx} 
                    x1="45" 
                    y1={20 + p * 180} 
                    x2="575" 
                    y2={20 + p * 180} 
                    stroke="#222" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                ))}

                {/* Area paths */}
                {(() => {
                  const pointsCount = monthlyTimelineData.length;
                  const stepX = pointsCount > 1 ? 530 / (pointsCount - 1) : 530;
                  
                  let revPath = "";
                  let expPath = "";
                  
                  monthlyTimelineData.forEach((d, idx) => {
                    const x = 45 + idx * stepX;
                    const yRev = 200 - (d.revenue / maxTimelineVal) * 180;
                    const yExp = 200 - (d.expense / maxTimelineVal) * 180;
                    
                    if (idx === 0) {
                      revPath += `M ${x} ${yRev}`;
                      expPath += `M ${x} ${yExp}`;
                    } else {
                      revPath += ` L ${x} ${yRev}`;
                      expPath += ` L ${x} ${yExp}`;
                    }
                  });

                  const revArea = revPath + ` L ${45 + (pointsCount - 1) * stepX} 200 L 45 200 Z`;
                  const expArea = expPath + ` L ${45 + (pointsCount - 1) * stepX} 200 L 45 200 Z`;

                  return (
                    <>
                      <path d={revArea} fill="url(#revGrad)" />
                      <path d={expArea} fill="url(#expGrad)" />

                      <path d={revPath} fill="none" stroke="#aef527" strokeWidth="2.5" strokeLinecap="round" />
                      <path d={expPath} fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 2" />

                      {/* Timeline Interaction nodes */}
                      {monthlyTimelineData.map((d, idx) => {
                        const x = 45 + idx * stepX;
                        const yRev = 200 - (d.revenue / maxTimelineVal) * 180;
                        const isHovered = hoveredMonth === d.month;
                        
                        return (
                          <g key={d.month} onMouseEnter={() => setHoveredMonth(d.month)} onMouseLeave={() => setHoveredMonth(null)} className="cursor-pointer">
                            <circle 
                              cx={x} 
                              cy={yRev} 
                              r={isHovered ? 6 : 4} 
                              fill="#aef527" 
                              stroke="#0A0A0A" 
                              strokeWidth="2"
                              className="transition-all duration-150"
                            />
                            {isHovered && (
                              <g>
                                <rect 
                                  x={x > 450 ? x - 145 : x + 12} 
                                  y={yRev - 45} 
                                  width="140" 
                                  height="55" 
                                  rx="6" 
                                  fill="#161616" 
                                  stroke="#aef527" 
                                  strokeWidth="1"
                                />
                                <text x={x > 450 ? x - 135 : x + 22} y={yRev - 30} fill="#aef527" fontSize="10" fontFamily="monospace" fontWeight="bold">
                                  Ingreso: ${d.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </text>
                                <text x={x > 450 ? x - 135 : x + 22} y={yRev - 15} fill="#EF4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                                  Costo: ${d.expense.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </text>
                                <text x={x > 450 ? x - 135 : x + 22} y={yRev - 2} fill="#E5E7EB" fontSize="8" fontFamily="monospace">
                                  Unidades: {d.qty} ud
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </>
                  );
                })()}

                {/* X labels */}
                {monthlyTimelineData.map((d, idx) => {
                  const pointsCount = monthlyTimelineData.length;
                  const stepX = pointsCount > 1 ? 530 / (pointsCount - 1) : 530;
                  const x = 45 + idx * stepX;
                  
                  const skip = pointsCount > 8 && idx % 2 !== 0;
                  if (skip) return null;
                  
                  return (
                    <text key={d.month} x={x} y="222" fill="#777" fontSize="9" textAnchor="middle" fontFamily="monospace" className="uppercase">
                      {d.month.split("-")[1]}/{d.month.split("-")[0].substring(2)}
                    </text>
                  );
                })}
              </svg>
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-500 block leading-tight mt-1.5 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            Haz hover sobre los nodos de fecha para inspeccionar el volumen de facturación deducido del period.
          </span>
        </div>

        {/* GRAPH 2: BRAND PENETRATION & PARETO CURVE */}
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">Análisis Pareto 80/20</span>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase font-bold">Cuota de Rendimiento</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 font-sans tracking-tight mt-1">Concentración de Ventas por Marca</h2>
            <p className="text-xs text-gray-500 mt-1">
              Este análisis indica qué marcas generan el 80% del valor total de la tienda en este canal.
            </p>
          </div>

          <div className="space-y-4 my-6">
            {paretoData.slice(0, 5).map((brand, idx) => {
              const bgBar = brand.isEssential80 ? "bg-[#FCD901]" : "bg-gray-300";
              return (
                <div 
                  key={brand.name} 
                  className="space-y-1.5 cursor-pointer group"
                  onMouseEnter={() => setHoveredPareto(brand.name)}
                  onMouseLeave={() => setHoveredPareto(null)}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-mono text-xs uppercase font-bold flex items-center gap-1.5 ${brand.isEssential80 ? 'text-gray-900' : 'text-gray-500'}`}>
                      {idx + 1}. {brand.name}
                      {brand.isEssential80 && <Award className="w-3 h-3 text-[#FCD901]" />}
                    </span>
                    <span className="text-gray-500 font-mono text-[11px]">
                      ${brand.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })} ({brand.percentage.toFixed(0)}%)
                    </span>
                  </div>
                  
                  {/* Progress bars showing raw volume and Pareto line */}
                  <div className="relative">
                    <div className="w-full bg-[#FDFDFD] h-3 rounded-full overflow-hidden border border-[#232323] relative">
                      <motion.div 
                        className={`h-full ${bgBar} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${brand.percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                      />
                    </div>
                    {/* Pareto indicator marker showing cumulative sum text on hover */}
                    {hoveredPareto === brand.name && (
                      <div className="absolute -top-6 right-0 bg-[#FCD901] text-[#0A0A0A] font-mono text-[8px] font-extrabold px-1 py-0.5 rounded shadow">
                        Suma Acumulado: {brand.cumPercent.toFixed(1)}% de Ventas
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            {brandData.length === 0 && (
              <div className="text-center py-10 font-mono text-xs text-gray-500">
                Sin productos vendidos. Registre una venta para activar.
              </div>
            )}
          </div>

          <div className="bg-white p-3 rounded-lg border border-gray-200 text-[10px] font-mono text-gray-500">
            {paretoData.length > 0 ? (
              <div className="space-y-1">
                <p className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FCD901]" /> REVELACIÓN PARETO:
                </p>
                <p className="leading-relaxed">
                  Las marcas destacadas en dorado representan más del 80% de tus ingresos unificados de calzado y textil para este canal. Enfoca tu presupuesto publicitario aquí.
                </p>
              </div>
            ) : (
                "Esperando carga relacional del ERP..."
            )}
          </div>
        </div>

      </div>

      {/* 5. POWER BI SOPHISTICATED FUNNEL ANALYSIS - ADS TO LIVE MESSAGES TO CASH (Embudo Chat-to-Cash) */}
      <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <div>
            <span className="text-[10px] font-mono text-[#FCD901] tracking-wider uppercase font-bold">EMBUDO DE CONVERSIÓN CONVERSACIONAL DE ANUNCIOS</span>
            <h2 className="text-lg font-bold text-gray-900 font-sans tracking-tight mt-1">Embudo Digital Ad-to-Chat-to-Cash ({selectedChannel})</h2>
            <p className="text-xs text-gray-500 mt-1">
              Visualización de atribución y rendimiento publicitario. De la visualización en Meta Ads/TikTok al pago de calzado por WhatsApp/DMs.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-gray-500 uppercase">INVERSIÓN EN ADS: </span>
            <span className="text-base font-extrabold text-[#FCD901] block font-mono">
              ${Math.round(totalMarketingSpend).toLocaleString()} USD
            </span>
          </div>
        </div>

        {/* Funnel Layout */}
        {totalImpressions === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-gray-500 bg-[#FDFDFD] rounded">
            Falta cargar métricas de publicidad en la pestaña de mercado (Meta Ads / TikTok) para trazar el embudo automático.
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* STAGE 1: IMPRESSIONS */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-3 font-mono text-xs text-gray-700">
                <div className="flex items-center gap-1.5 font-bold">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span>1. Impresiones Redes</span>
                </div>
                <span className="text-[10px] text-gray-500">Exposición en Meta / TikTok</span>
              </div>
              <div className="md:col-span-7 relative">
                <div className="w-full bg-[#FDFDFD] border border-gray-200 h-8 rounded relative overflow-hidden">
                  <div className="bg-gray-200 h-full w-full opacity-60"></div>
                  <div className="absolute inset-0 flex items-center px-4 justify-between text-xs font-mono font-bold text-gray-900">
                    <span>{totalImpressions.toLocaleString()} Impresiones</span>
                    <span>100% (Inicio)</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 text-right">
                <span className="text-[10px] text-gray-500 font-mono block">MEDIDA CRÍTICA</span>
                <span className="text-xs font-bold text-gray-700 font-mono">Presencia de Marca</span>
              </div>
            </div>

            {/* STAGE 2: CLICKS ON ADS (CTR) */}
            {(() => {
              const ctr = totalClicksOnAds > 0 && totalImpressions > 0 ? (totalClicksOnAds / totalImpressions) * 100 : 0;
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 font-mono text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 font-bold">
                      <MousePointerClick className="w-4 h-4 text-indigo-400" />
                      <span>2. Clics de Interés</span>
                    </div>
                    <span className="text-[10px] text-gray-500">CTA de anuncio accionado</span>
                  </div>
                  <div className="md:col-span-7 relative">
                    <div className="w-full bg-[#FDFDFD] border border-gray-200 h-8 rounded relative overflow-hidden">
                      <div 
                        style={{ width: `${Math.max(Math.min(ctr * 20, 100), 5)}%` }} 
                        className="bg-indigo-600/40 h-full border-r border-[#FCD901]/45"
                      ></div>
                      <div className="absolute inset-0 flex items-center px-4 justify-between text-xs font-mono font-bold text-gray-900">
                        <span>{totalClicksOnAds.toLocaleString()} Clics</span>
                        <span>CTR: {ctr.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">CPM PROMEDIO</span>
                    <span className="text-xs font-bold text-indigo-300 font-mono">${((totalMarketingSpend / totalImpressions) * 1000).toFixed(2)} USD</span>
                  </div>
                </div>
              );
            })()}

            {/* STAGE 3: MESSAGE CONVERSATIONS INITIATED */}
            {(() => {
              const clickToMessageRatio = totalClicksOnAds > 0 ? (totalMessageConversations / totalClicksOnAds) * 100 : 0;
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 font-mono text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 font-bold">
                      <MessageSquare className="w-4 h-4 text-[#FCD901]" />
                      <span>3. Chats Iniciados</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Mensaje a WA / IG / FB</span>
                  </div>
                  <div className="md:col-span-7 relative">
                    <div className="w-full bg-[#FDFDFD] border border-gray-200 h-8 rounded relative overflow-hidden">
                      <div 
                        style={{ width: `${Math.max(Math.min(clickToMessageRatio * 5, 100), 5)}%` }} 
                        className="bg-amber-600/30 h-full border-r border-amber-500/40"
                      ></div>
                      <div className="absolute inset-0 flex items-center px-4 justify-between text-xs font-mono font-bold text-gray-900">
                        <span>{totalMessageConversations.toLocaleString()} Chats Recibidos</span>
                        <span>Clic a Lead: {clickToMessageRatio.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">COSTO POR CHAT</span>
                    <span className="text-xs font-bold text-[#FCD901] font-mono">
                      ${totalMessageConversations > 0 ? (totalMarketingSpend / totalMessageConversations).toFixed(2) : "0"} USD
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* STAGE 4: CLOSED SALES & PAID CONVERSIONS */}
            {(() => {
              const chatbotClosureRate = totalMessageConversations > 0 ? (closedSalesCount / totalMessageConversations) * 100 : 0;
              const globalConversion = totalImpressions > 0 ? (closedSalesCount / totalImpressions) * 100 : 0;
              return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 font-mono text-xs text-gray-700">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Target className="w-4 h-4 text-emerald-600 animate-pulse" />
                      <span>4. Transacciones Pagadas</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Cierre e ingreso bancario</span>
                  </div>
                  <div className="md:col-span-7 relative">
                    <div className="w-full bg-[#FDFDFD] border border-emerald-500/20 h-8 rounded relative overflow-hidden">
                      <div 
                        style={{ width: `${Math.max(chatbotClosureRate, 3)}%` }} 
                        className="bg-emerald-600/20 h-full border-r border-emerald-500"
                      ></div>
                      <div className="absolute inset-0 flex items-center px-4 justify-between text-xs font-mono font-bold text-gray-900">
                        <span>{closedSalesCount.toLocaleString()} Compras Cerradas</span>
                        <span>Tasa Cierre Chats: {chatbotClosureRate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">RETORNO AD ROAS</span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{averageRoas.toFixed(2)}x</span>
                  </div>
                </div>
              );
            })()}

          </div>
        )}
      </div>

      {/* 6. LOWER THREE-COLUMN DENSE INFORMATION MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* FACTURACIÓN REAL CORRESPONDIENTE A TU SELECCIÓN */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div className="border-b border-gray-200 pb-3 mb-3">
            <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase font-bold">MONITOR REAL DE ATRIBUCIÓN</span>
            <h3 className="text-sm font-bold text-gray-900 font-sans mt-1">Ingresos Unificados por Canal</h3>
          </div>

          <div className="space-y-4 my-3 text-xs font-mono">
            {channelData.map(c => {
              const isSelected = selectedChannel === c.name || selectedChannel === "TODOS";
              const dotColor = c.name === "WhatsApp" ? "bg-emerald-500" : c.name === "Instagram" ? "bg-pink-400" : c.name === "Facebook" ? "bg-blue-400" : c.name === "TikTok" ? "bg-indigo-400" : "bg-amber-300";
              const borderHighlight = selectedChannel === c.name ? "border-amber-500 bg-amber-500/5 shadow-inner" : "border-gray-200";
              return (
                <div 
                  key={c.name}
                  onClick={() => setSelectedChannel(c.name)} 
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer hover:border-gray-200 hover:scale-[1.01] ${borderHighlight} ${!isSelected && 'opacity-40'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${dotColor}`}></span>
                    <span className="text-gray-900 font-bold">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-900 font-bold block">${c.value.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    <span className="text-gray-500 text-[9px]">{c.percent.toFixed(1)}% de las ventas</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[9px] text-[#FCD901] leading-snug font-mono bg-[#FCD901]/10 px-2 py-1.5 rounded border border-[#FCD901]/10">
            💡 Presiona cualquiera de los canales arriba para filtrar automáticamente todo el reporte.
          </div>
        </div>

        {/* AGE GROUP WITH CHOSEN SLICER */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div className="border-b border-gray-200 pb-3 mb-3">
            <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase font-bold">SEGMENTACIÓN DE AUDIENCIA DEL CANAL</span>
            <h3 className="text-sm font-bold text-gray-900 font-sans mt-1">Distribución por Grupo de Edad ({selectedChannel})</h3>
          </div>

          <div className="flex h-36 items-end justify-between px-2 gap-2 mt-4">
            {ageCohortData.map((a, idx) => {
              const colHeight = a.percent > 0 ? `${Math.round(Math.max(a.percent * 1.5, 8))}px` : "1px";
              return (
                <div key={a.name} className="flex-1 flex flex-col items-center group cursor-pointer">
                  <span className="text-[8px] font-mono text-gray-500 group-hover:text-[#FCD901] opacity-0 group-hover:opacity-100 transition-all mb-1">
                    {a.qty} ud
                  </span>
                  <div 
                    style={{ height: colHeight }} 
                    className="w-full bg-gray-50 group-hover:bg-[#FCD901] border border-gray-200 group-hover:border-[#FCD901]/40 rounded-t-sm transition-all duration-300 relative shadow-inner"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/5 rounded-t-sm"></div>
                  </div>
                  <span className="text-[9px] font-mono text-gray-500 mt-2 font-bold group-hover:text-gray-900 transition-colors">
                    {a.name}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[9px] text-gray-500 mt-3 leading-snug">
            Muestra la distribución de unidades adquiridas por segmento de edad para la porción de ventas de {selectedChannel}.
          </div>
        </div>

        {/* REGIONAL MATRIX BREAKDOWN */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between hover:border-gray-300 transition-colors">
          <div className="border-b border-gray-200 pb-3 mb-3">
            <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase font-bold">HOTSPOTS GEOGRÁFICOS DE COBRANZA</span>
            <h3 className="text-sm font-bold text-gray-900 font-sans mt-1">Top Estados en Venezuela</h3>
          </div>

          <div className="space-y-2.5 my-3">
            {regionData.map((r, idx) => {
              const progressPercentage = regionData[0].rev > 0 ? (r.rev / regionData[0].rev) * 100 : 0;
              return (
                <div key={r.state} className="bg-[#FDFDFD] p-2 rounded-lg border border-gray-200 space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5 capitalize">
                      <MapPin className="w-3 h-3 text-[#FCD901]" /> {r.state}
                    </span>
                    <span className="text-gray-900 font-bold">${r.rev.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="w-full bg-[#FDFDFD] h-1 rounded-full overflow-hidden">
                    <div style={{ width: `${progressPercentage}%` }} className="bg-[#FCD901] h-full rounded-full"></div>
                  </div>
                </div>
              );
            })}

            {regionData.length === 0 && (
              <div className="text-center py-8 font-mono text-xs text-gray-500">
                Sin datos de envío.
              </div>
            )}
          </div>

          <div className="text-[9px] text-gray-500 leading-snug">
            Regiones con mayor rentabilidad de envíos en base al domicilio de tu CRM.
          </div>
        </div>

      </div>

      {/* 7. ADVERTISING BEST STAR HERO BANNER */}
      <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100/50 text-amber-850 text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border border-amber-200">MEJOR ANUNCIO</span>
            <span className="text-[10px] font-mono text-gray-500">Atribución de conversión Meta & TikTok</span>
          </div>
          <h3 className="text-base font-extrabold text-gray-900">Anuncio Ganador del Período: {bestAd ? bestAd.id : "No detectado"}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Identificado como el creativo más rentable uniendo códigos de seguimiento contra volumen bruto de venta cerrado por tus operadores.
          </p>
        </div>
        <div className="md:col-span-4 text-right">
          {bestAd ? (
            <div className="bg-[#FDFDFD] p-3 rounded-lg border border-gray-200 inline-block text-left w-full sm:w-auto min-w-[180px]">
              <span className="text-[9px] text-gray-500 font-mono block">RETORNO ESTIMADO ROAS</span>
              <span className="text-xl font-extrabold text-emerald-600 font-mono block">{bestAd.roas.toFixed(2)}x</span>
              <div className="flex justify-between text-[9px] text-gray-500 font-mono mt-1 pt-1 border-t border-gray-200">
                <span>Gastado: ${bestAd.spent}</span>
                <span>Retorno: ${bestAd.rev}</span>
              </div>
            </div>
          ) : (
            <span className="text-xs font-mono text-gray-500 text-center block">Carga datos de ads para calcular</span>
          )}
        </div>
      </div>

      {/* 8. WAREHOUSE STOCKS CRITICAL WARNINGS */}
      <div className="bg-red-950/10 border border-red-500/20 p-5 rounded-xl space-y-4">
        <div className="flex items-center gap-2.5 text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider font-mono">Alerta del ERP: Inventario Crítico Detectado</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              Los siguientes SKUs disponen de 3 unidades o menos en stock y requieren reaprovisionamientos.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stockCriticalProducts.slice(0, 8).map(p => (
            <div key={p.sku} className="bg-[#FDFDFD] p-3 rounded-lg border border-gray-200 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="font-bold text-red-400 block capitalize text-ellipsis overflow-hidden whitespace-nowrap max-w-[150px]">{p.nombre_producto}</span>
                <span className="text-[10px] text-gray-500">{p.sku}</span>
              </div>
              <div className="text-right">
                <span className="bg-red-950 text-red-405 px-2 py-0.5 rounded border border-red-500/10 font-bold block">
                  {p.stock_disponible} ud
                </span>
                <span className="text-[9px] text-gray-500 mt-0.5 block">{p.almacen}</span>
              </div>
            </div>
          ))}

          {stockCriticalProducts.length === 0 && (
            <div className="col-span-full text-center py-6 font-mono text-xs text-emerald-600">
              ¡Excelente líder! Todos los productos están abastecidos correctamente (Ningún artículo abajo de 3 unidades).
            </div>
          )}
        </div>
      </div>

      {/* 9. SLOW MOVING HIGH STOCK PROMOTION DETECTOR */}
      <div className="bg-[#FDFDFD] border border-gray-200/80 p-6 rounded-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3 text-amber-800">
            <Sparkles className="w-5 h-5 text-amber-700 animate-pulse" />
            <div>
              <h4 className="text-base font-black uppercase tracking-wider font-sans flex items-center gap-1.5 text-gray-900">
                Detector de Calzado de Baja Rotación & Alto Stock 📈
              </h4>
              <p className="text-xs text-gray-700 mt-1">
                Análisis cruzado del ERP: Alta disponibilidad física con bajo volumen de venta. Ideal para promociones, ofertas de liquidación o nuevas pautas.
              </p>
            </div>
          </div>
          <span className="bg-amber-100/55 text-amber-850 border border-amber-200 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider self-start md:self-auto">
            Ocasiones de Ad Spend 📣
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {slowMovingStockProducts.slice(0, 4).map(p => {
            // Pick static creative suggestion depending on characteristics
            let suggestedOffer = "";
            let idealAdFormat = "";
            
            if (p.precio_venta_referencia > 50) {
              suggestedOffer = `Cupón de descuento directo de $15 USD o calzado complementario en un combo 'VVIP Style'`;
              idealAdFormat = "Carrusel de fotos estáticas en Meta Ads comparando el par con outfits de prestigio.";
            } else if (p.genero_objetivo === "Femenino") {
              suggestedOffer = `Descuento flash de 15% en WhatsApp o pack 2x1 en tallas seleccionadas`;
              idealAdFormat = "Video corto en Instagram Reels destacando la suavidad del material en uso diario.";
            } else {
              suggestedOffer = `Envío totalmente gratis en Caracas y un 10% de descuento automático en tienda virtual`;
              idealAdFormat = "Gancho de ASMR Unboxing y prueba de durabilidad en TikTok Orgánico.";
            }

            return (
              <div key={p.sku} className="bg-[#FDFDFD] border border-gray-200/80 hover:border-[#FCD901]/35 rounded-xl p-5 space-y-4 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <span className="text-xs font-mono font-bold text-gray-500 uppercase">
                      {p.marca} • SKU {p.sku}
                    </span>
                    <h5 className="text-base font-extrabold text-gray-900 truncate mt-1" title={p.nombre_producto}>
                      {p.nombre_producto}
                    </h5>
                    <div className="flex items-center gap-2 mt-2 font-sans text-xs">
                      <span className="bg-[#FCD901]/10 text-amber-600 border border-amber-500/10 px-2 py-0.5 rounded font-bold">
                        Talla: {p.talla}
                      </span>
                      <span className="bg-gray-50 text-gray-700 px-2.5 py-0.5 rounded font-bold">
                        Color: {p.color}
                      </span>
                      <span className="text-gray-700 font-medium">
                        ${p.precio_venta_referencia} USD
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="bg-[#FDFDFD] border border-gray-200 px-3 py-1.5 rounded">
                      <p className="text-[9px] text-gray-500 font-mono font-bold leading-none uppercase tracking-wider">STOCK ERP</p>
                      <p className="text-base font-extrabold text-gray-900 font-sans mt-1.5 leading-none">{p.stock_disponible} uds</p>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs font-sans text-gray-500 font-medium">
                        Vendido: <strong className="text-red-400 font-extrabold">{p.vendidos_rango} ud</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI / Marketing Action Suggestion box */}
                <div className="bg-[#FCD901]/10 border border-[#FCD901]/15 rounded-lg p-3.5 text-xs">
                  <p className="font-sans text-[#FCD901] font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                     Estrategia Recomendada:
                  </p>
                  <p className="text-gray-700 mt-1.5 leading-relaxed font-sans">
                    Estimular rotación del SKU ofreciendo <strong className="text-amber-600 font-bold">{suggestedOffer}</strong>.
                  </p>

                  <div className="mt-3 pt-2 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    <span>Formato Ideal: <strong className="text-[#FCD901] font-semibold">{idealAdFormat}</strong></span>
                    <span className="text-emerald-600 font-extrabold uppercase shrink-0">🔥 Alto ROI</span>
                  </div>
                </div>
              </div>
            );
          })}

          {slowMovingStockProducts.length === 0 && (
            <div className="col-span-full bg-emerald-950/15 border border-emerald-500/20 p-8 rounded-lg text-center text-xs font-sans text-emerald-600 space-y-1">
              <p className="font-bold uppercase tracking-wider text-sm">⚡ ¡Optimización de Inventario al Máximo!</p>
              <p className="text-gray-350 leading-relaxed">
                No se detectaron calzados de baja rotación con sobrestock en el período seleccionado. Todas tus referencias con alto inventario presentan una excelente tasa de venta orgánica o atribuida.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
