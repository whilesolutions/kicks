/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  MapPin, 
  Smartphone, 
  Heart, 
  User, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Percent 
} from "lucide-react";
import { ClientType, SaleType, CreativeType } from "../types";

interface ClientesProps {
  clients: ClientType[];
  sales: SaleType[];
  creatives: CreativeType[];
}

export default function Clientes({ clients, sales, creatives }: ClientesProps) {
  // Filter States
  const [selectedState, setSelectedState] = useState("Todos");
  const [selectedGusto, setSelectedGusto] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClient, setActiveClient] = useState<ClientType | null>(null);

  // States list for filtering
  const estados = Array.from(new Set(clients.map(c => c.estado)));

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesState = selectedState === "Todos" || c.estado === selectedState;
    const matchesGusto = selectedGusto === "Todos" || c.gusto_categoria === selectedGusto;
    const matchesQuery = c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.whatsapp.includes(searchQuery) ||
                         c.id_cliente.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesGusto && matchesQuery;
  });

  // Calculate stats for a client helper
  const getClientStats = (idClient: string) => {
    const clientSales = sales.filter(s => s.id_cliente === idClient);
    
    // Auto Calculate LTV (Sum of gross income including returns with negative value)
    const ltv = clientSales.reduce((acc, s) => acc + s.ingreso_bruto, 0);
    const transacCount = clientSales.filter(s => !s.es_devolucion).length;
    const devCount = clientSales.filter(s => s.es_devolucion).length;

    return {
      clientSales,
      ltv: Number(ltv.toFixed(2)),
      transacCount,
      devCount
    };
  };

  // Affinity Score Calculator: Target Ad Segment VS Actual Purchase Pattern
  const getClientAffinity = (client: ClientType) => {
    // 1. Find target creative corresponding to their acquisition method or matching parameters
    const acqCreative = creatives.find(cr => 
      cr.plataforma === client.fuente_adquisicion || 
      cr.segmento_interno.toLowerCase().includes(client.gusto_subcategoria.toLowerCase())
    ) || creatives[0];

    const actualShopping = client.gusto_categoria; // 'Zapato' or 'Textil'
    
    // Ad category focus matches their actual shopping categorization
    const adFocusCategory = acqCreative?.enfoque_contenido.includes("producto") ? "Zapato" : "Textil";
    const matchesCategory = adFocusCategory === actualShopping;
    
    // Platform matches preferred channel
    const matchesChannel = 
      (acqCreative?.plataforma.includes("Meta") && ["WhatsApp", "Instagram", "Facebook"].includes(client.canal_preferido_compra)) ||
      (acqCreative?.plataforma.includes("TikTok") && client.canal_preferido_compra === "TikTok") ||
      client.canal_preferido_compra === "Tienda Virtual";

    let affinityScore = 40; // baseline %
    if (matchesCategory) affinityScore += 40;
    if (matchesChannel) affinityScore += 20;

    return {
      sourceCreative: acqCreative,
      adFocusCategory,
      actualShopping,
      matchesCategory,
      affinityScore
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide">
          CRM & Afinidad de Clientes
        </h1>
        <p className="text-sm text-gray-500">
          Base consolidada de clientes, cálculo automático de LTV y cruce entre segmentación publicitaria vs gustos reales.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Clients Directory Panel */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* CRM Search and Filter Options */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
            <div className="text-xs font-mono font-bold text-gray-700 uppercase flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FCD901]" /> Directorio del CRM
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nombre, cédula, whatsapp..."
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              />

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todos">Ubicación (Venezuela)</option>
                {estados.map(st => <option key={st} value={st}>{st}</option>)}
              </select>

              <select
                value={selectedGusto}
                onChange={(e) => setSelectedGusto(e.target.value)}
                className="bg-white text-gray-900 px-3 py-1.5 border border-gray-200 rounded font-mono text-xs focus:outline-none"
              >
                <option value="Todos">Preferencia de Línea</option>
                <option value="Zapato">Zapato</option>
                <option value="Textil">Textil</option>
              </select>
            </div>
          </div>

          {/* Customer list */}
          <div className="bg-white border border-gray-200 rounded-sm overflow-hidden divide-y divide-[#1F1F1F]">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => {
                const stats = getClientStats(client.id_cliente);
                const isActive = activeClient?.id_cliente === client.id_cliente;

                return (
                  <button
                    key={client.id_cliente}
                    onClick={() => setActiveClient(client)}
                    className={`w-full text-left p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs ${
                      isActive ? "bg-[#FDFDFD] border-l-2 border-[#FCD901]/20" : "hover:bg-white"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 text-sm font-bold font-sans">{client.nombre}</span>
                        <span className="text-[10px] text-gray-500 font-mono">({client.id_cliente})</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1 text-[11px]"><MapPin className="w-3 h-3 text-red-500" /> {client.estado} ({client.municipio})</span>
                        <span className="flex items-center gap-1 text-[11px]"><Smartphone className="w-3 h-3 text-[#2ECC71]" /> {client.whatsapp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right shrink-0">
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Preferencia</span>
                        <span className="text-gray-900 font-bold">{client.gusto_categoria} - {client.gusto_subcategoria}</span>
                      </div>
                      
                      <div>
                        <span className="text-[10px] text-gray-500 block uppercase">Canal Ads</span>
                        <span className="text-[#C5A059] font-bold">{client.fuente_adquisicion}</span>
                      </div>

                      <div className="bg-[#FDFDFD] px-3 py-1.5 rounded border border-gray-200">
                        <span className="text-[9px] text-gray-500 block uppercase font-bold">LTV TOTAL</span>
                        <span className="text-emerald-600 font-bold text-sm">${stats.ltv}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 font-mono">No se registraron clientes con esos filtros.</div>
            )}
          </div>
        </div>

        {/* Client Profiler Detallado Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-sm p-5 space-y-6">
            <h3 className="text-xs font-mono font-bold tracking-wider text-gray-700 uppercase flex items-center gap-1.5 border-b border-gray-200 pb-3">
              <User className="w-4 h-4 text-[#FCD901]" /> Visualización del Perfil Seleccionado
            </h3>

            {activeClient ? (
              <div className="space-y-6 font-mono text-xs">
                
                {/* Visual Bio */}
                <div className="space-y-1.5">
                  <h4 className="font-sans text-lg font-bold text-gray-900 tracking-tight">{activeClient.nombre}</h4>
                  <p className="text-gray-500 text-xs">Registrado el: {activeClient.fecha_registro}</p>
                  <div className="flex gap-2">
                    <span className="bg-white text-gray-700 px-2 py-0.5 rounded text-[10px] uppercase">Edad: {activeClient.edad} (Grupo {activeClient.grupo_edad})</span>
                    <span className="bg-white text-gray-700 px-2 py-0.5 rounded text-[10px] uppercase">{activeClient.genero}</span>
                  </div>
                </div>

                {/* Economic Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#FDFDFD] p-3 rounded-lg border border-gray-200 text-center">
                    <span className="text-[10px] text-gray-500 uppercase block">Compras Exitosas</span>
                    <span className="text-gray-900 text-lg font-bold">{getClientStats(activeClient.id_cliente).transacCount}</span>
                  </div>
                  <div className="bg-[#FDFDFD] p-3 rounded-lg border border-gray-200 text-center">
                    <span className="text-[10px] text-gray-500 uppercase block">LTV Acumulado</span>
                    <span className="text-emerald-600 text-lg font-bold">${getClientStats(activeClient.id_cliente).ltv}</span>
                  </div>
                </div>

                {/* Campaign Affinity Checker */}
                <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-4">
                  <h4 className="font-bold text-[#FCD901] text-xs flex items-center justify-between border-b border-gray-200 pb-2 uppercase">
                    <span>Afinidad del Cliente</span>
                    <span className="flex items-center gap-0.5 text-emerald-600 text-[11px]"><Percent className="w-3" /> {getClientAffinity(activeClient).affinityScore}% puntuación</span>
                  </h4>
                  
                  <div className="space-y-3 font-mono text-[11px] text-gray-500 leading-relaxed">
                    <div className="flex justify-between">
                      <span className="text-gray-500">¿Anuncio enfocado en su gusto?</span>
                      <span className={`font-bold ${getClientAffinity(activeClient).matchesCategory ? "text-emerald-600" : "text-rose-400"}`}>
                        {getClientAffinity(activeClient).matchesCategory ? "Sí, Total Afinidad" : "No, Atribución Desviada"}
                      </span>
                    </div>

                    <div className="text-gray-500 pt-1.5 border-t border-gray-200">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Target de Campaña Atraído</span>
                      Segmento publicitado: <span className="text-[#C5A059] block font-bold">"{getClientAffinity(activeClient).sourceCreative?.segmento_interno || "No Definido"}"</span>
                      Sección objetivo del anuncio: <span className="text-gray-900 font-bold">{getClientAffinity(activeClient).adFocusCategory}</span>
                    </div>

                    <div className="text-gray-500 pt-1.5 border-t border-gray-200">
                      <span className="text-[10px] text-gray-500 block uppercase font-bold mb-1">Comportamiento Real CRM</span>
                      Gustos del cliente: <span className="text-gray-900 block">Calzado tipo {activeClient.gusto_subcategoria} ({activeClient.gusto_categoria})</span>
                      Estilo específico: <span className="text-gray-900 block italic">"{activeClient.estilo_preferido}"</span>
                    </div>
                  </div>
                </div>

                {/* Purchase Logs list */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Historial de Compras de la libreta</h4>
                  
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {getClientStats(activeClient.id_cliente).clientSales.length > 0 ? (
                      getClientStats(activeClient.id_cliente).clientSales.map((sale, i) => (
                        <div key={i} className="bg-white p-2.5 rounded border border-[#1F1F1F] flex justify-between items-center">
                          <div>
                            <span className="text-gray-900 font-bold block text-[11px]">{sale.sku}</span>
                            <span className="text-[10px] text-gray-500">{sale.fecha_venta} • {sale.canal_venta}</span>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold block ${sale.es_devolucion ? 'text-red-500' : 'text-gray-900'}`}>
                              {sale.es_devolucion ? "" : "+"}{sale.cantidad} uds
                            </span>
                            <span className={`text-[10px] font-bold ${sale.es_devolucion ? 'text-red-500' : 'text-emerald-600'}`}>
                              ${sale.ingreso_bruto}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-600 text-[11px]">No tiene transacciones registradas todavía.</div>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-20 text-gray-500 font-mono text-xs">
                Seleccione un cliente de la lista para ver su LTV automatizado, afinidad publicitaria e historial de transacciones.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
