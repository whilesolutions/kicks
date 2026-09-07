/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  FileCode, 
  Settings, 
  ShieldCheck, 
  Sparkles,
  Menu,
  X,
  Database,
  Receipt,
  LayoutDashboard,
  Truck,
  Briefcase,
  FileSpreadsheet
} from "lucide-react";

interface NavigationProps {
  currentRole: 'admin' | 'gerente' | 'operador';
  setRole: (role: 'admin' | 'gerente' | 'operador') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBackToStore?: () => void;
}

export default function Navigation({ currentRole, setRole, activeTab, setActiveTab, onBackToStore }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Available tabs and metadata
  const allTabs = [
    { id: "dashboard", label: "Dashboard Global", icon: LayoutDashboard, roles: ["admin", "gerente", "operador"] },
    { id: "ventas", label: "Ventas", icon: ShoppingBag, roles: ["admin", "operador"] },
    { id: "inventario", label: "Inventario", icon: Package, roles: ["admin", "gerente"] },
    { id: "logistica", label: "Despachos & Envíos", icon: Truck, roles: ["admin", "gerente", "operador"] },
    { id: "proyectos", label: "Gestión de Creativos 🎬", icon: Briefcase, roles: ["admin", "gerente", "operador"] },
    { id: "clientes", label: "CRM Clientes", icon: Users, roles: ["admin", "gerente", "operador"] },
    { id: "marketing", label: "Marketing", icon: TrendingUp, roles: ["admin", "gerente"] },
    { id: "gastos", label: "Gastos & Egresos", icon: Receipt, roles: ["admin", "gerente"] },
    { id: "analyst", label: "Asistente IA KICKS", icon: Sparkles, roles: ["admin", "gerente"] },
    { id: "sheets", label: "Sincro Google Sheets 🟢", icon: FileSpreadsheet, roles: ["admin", "gerente"] },
    { id: "dictionary", label: "Diccionario & KPIs", icon: FileCode, roles: ["admin", "gerente", "operador"] },
    { id: "supabase", label: "Esquema Supabase", icon: Database, roles: ["admin"] },
    { id: "powerbi", label: "Conexión Power BI", icon: Settings, roles: ["admin"] },
  ];

  // Filter tabs by active role
  const visibleTabs = allTabs.filter(tab => tab.roles.includes(currentRole));

  return (
    <aside className="w-full lg:w-72 bg-[#FDFDFD] lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-between shrink-0 overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-8 border-b border-gray-200 flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center">
              <svg viewBox="0 0 357.23 71.89" fill="currentColor" className="w-[145px] h-auto text-black">
                <g id="Capa_1-2">
                  <path d="m269.55,71.27c1.31-1.73,2.38-3.19,3.5-4.6,2.69-3.39,5.44-6.73,8.09-10.16.66-.85,1.31-1.16,2.36-1.15,10.22.03,20.44.05,30.66,0,2.55-.01,5.11-.19,7.65-.41,2.66-.23,3.81-1.28,4.45-3.92.45-1.83.83-3.68,1.21-5.53.28-1.35-.34-2.2-1.66-2.37-1.87-.24-3.75-.45-5.63-.49-9.11-.2-18.21-.32-27.32-.49-3.43-.07-6.77-.38-9.35-3.1-2.13-2.23-3.41-5-2.8-7.89,1.55-7.26,3.12-14.57,5.54-21.56,1.95-5.64,6.93-8.39,12.83-8.85,4.58-.36,9.2-.31,13.8-.36,12.66-.13,25.32-.24,37.99-.31,1.98-.01,3.96.18,6.34.3-.39.95-.5,1.68-.92,2.14-4.1,4.53-8.23,9.02-12.42,13.46-.41.43-1.28.59-1.94.59-8.78.04-17.55,0-26.33.04-3.33.02-6.66.19-9.99.28-1.99.05-3.4.95-4.04,2.86-.55,1.63-1.13,3.26-1.45,4.94-.43,2.22.12,2.88,2.33,3.01,3.93.22,7.87.43,11.81.51,7.05.14,14.11.18,21.16.25,3.69.03,6.78,1.5,9.46,3.93,2.03,1.85,2.54,4.35,2.25,6.87-.41,3.57-.99,7.15-1.87,10.63-1.02,4.08-2.31,8.11-3.72,12.07-1.71,4.81-5.69,7.35-10.08,9.34-.48.21-1.09.16-1.64.17-18.33.09-36.66.19-54.99.24-1.64,0-3.28-.26-5.29-.43Z"/>
                  <path d="m138.44,17.25c1.46.99,2.91,2,4.37,2.98,1.25.83,1.67,1.82,1.26,3.39-2.37,9.13-4.66,18.28-6.95,27.43-.73,2.92-.01,3.9,3.06,3.95,9.38.17,18.76.26,28.14.39,3.83.05,7.66.12,11.49.23.87.02,1.72.24,2.82.4-.75,3.14-1.43,6.09-2.16,9.04-.46,1.89-.9,3.78-1.52,5.62-.17.49-.94,1.12-1.44,1.12-14.33,0-28.65-.07-42.98-.16-2.22-.01-4.44-.17-6.65-.29-4.36-.23-7.71-2.33-10.1-5.88-1.87-2.78-1.3-5.92-.59-8.89,2.78-11.66,5.62-23.3,8.57-34.91,1.04-4.07,2.02-8.25,3.79-12.03,2.65-5.63,7.46-8.79,13.78-8.9C161.33.4,179.31.23,197.29,0c.27,0,.55.03,1.1.06-1,1.74-1.96,3.32-2.83,4.95-1.83,3.42-3.57,6.89-5.44,10.3-.28.5-.99.91-1.58,1.06-.79.21-1.65.16-2.48.16-15.33.09-30.65.17-45.98.25-.54,0-1.07.05-1.61.08l-.03.37Z"/>
                  <path d="m264.72,71.56c-1.98.1-3.67.26-5.36.27-4.89.04-9.78-.03-14.66.05-1.13.02-1.66-.42-2.17-1.35-4.62-8.54-9.33-17.03-13.89-25.6-.81-1.53-1.79-2.22-3.45-2.21-1.16,0-2.32-.13-3.49-.18-.91-.03-1.38-.43-1.14-1.36.99-3.87,1.96-7.74,3.04-11.59.17-.62.77-1.35,1.35-1.58,4.45-1.77,7.8-5.05,11.3-8.11,7.22-6.33,14.36-12.75,21.55-19.11.42-.37,1.03-.74,1.56-.75,7.21-.05,14.42-.03,21.97-.03-.46.57-.68.92-.97,1.18-9.29,8.59-18.6,17.16-27.88,25.76-2.2,2.04-4.31,4.16-6.47,6.24-1.25,1.2-1.61,2.33-.61,4.06,5.55,9.6,10.98,19.28,16.43,28.94.94,1.67,1.82,3.38,2.89,5.37Z"/>
                  <path d="m91.48.08c-10.34,9.52-20.5,18.88-30.66,28.24-1.96,1.81-3.85,3.68-5.85,5.44-.98.86-.85,1.61-.29,2.6,4.52,7.96,9.02,15.92,13.5,23.9,2.03,3.62,4.01,7.27,6.21,11.26-1.74.11-3.2.28-4.66.29-5,.04-10,.05-14.99-.03-.61,0-1.48-.51-1.78-1.04-3.39-5.92-6.7-11.88-10.02-17.84-1.7-3.06-3.31-6.16-5.06-9.18-.31-.53-1.11-.98-1.74-1.07-1.26-.17-2.55-.04-3.82-.06-1.25-.02-1.94-.7-1.65-1.92.93-3.82,1.91-7.63,2.99-11.41.34-1.19,1.33-1.75,2.63-1.97.98-.17,2.05-.62,2.8-1.27,6.03-5.15,12.01-10.37,17.98-15.6,3.63-3.19,7.18-6.46,10.81-9.65.45-.4,1.14-.75,1.72-.76,7.05-.05,14.1-.03,21.16-.03.2,0,.4.04.72.08Z"/>
                  <path d="m4.54.51c.6-.08.81-.13,1.01-.14,9.55-.11,19.11-.19,28.66-.33,1.47-.02,1.81.35,1.44,1.82-3.33,13.18-6.59,26.39-9.87,39.58-2.36,9.47-4.75,18.94-7.06,28.42-.32,1.3-.83,1.83-2.21,1.81-4.88-.08-9.76,0-14.64-.07-2.04-.03-2.11-.37-1.61-2.35,2.1-8.34,4.11-16.71,6.2-25.05,2.59-10.39,5.21-20.77,7.88-31.14.31-1.19.06-1.94-.75-2.79C10.61,7.13,7.7,3.93,4.54.51Z"/>
                  <path d="m226.35.51c-2.03,8.03-3.98,15.71-5.91,23.4-3.83,15.34-7.63,30.69-11.52,46.02-.16.63-.95,1.51-1.52,1.56-5.85.57-11.71.49-17.77,0,.14-.72.21-1.25.34-1.76,5.72-22.64,11.45-45.28,17.13-67.94.33-1.32,1-1.73,2.18-1.73,4.89,0,9.77-.02,14.66.01.74,0,1.48.26,2.41.43Z"/>
                  <path d="m82.56,71.6C88.6,47.54,94.55,23.82,100.5.12c5.57,0,10.95-.08,16.32.04,2.16.05,2.26.4,1.7,2.63-5.44,21.69-10.88,43.38-16.33,65.06-.91,3.61-.91,3.64-4.63,3.71-4.39.09-8.77.11-13.16.15-.53,0-1.07-.07-1.84-.13Z"/>
                </g>
              </svg>
            </div>
            <span className="text-[8.5px] tracking-[0.25em] font-mono text-stone-600 mt-2 uppercase font-black leading-none">
              SISTEMA DE INVENTARIO & ERP
            </span>
          </div>
          {/* Mobile Hamburguer */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 text-gray-500 hover:text-black rounded-md hover:bg-gray-100 transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
 
        {/* Role Quick Switcher Dashboard */}
        <div className="p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-black" />
            <span className="text-[10px] font-bold text-gray-600 font-mono uppercase tracking-[0.1em]">
              CONTROL DE PRIVILEGIOS
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded border border-gray-200">
            {(['admin', 'gerente', 'operador'] as const).map((r) => (
              <button
                key={r}
                id={`role-btn-${r}`}
                onClick={() => {
                  setRole(r);
                  // Auto redirect if tab is not allowed for the selected role
                  const allowed = allTabs.find(t => t.id === activeTab)?.roles.includes(r);
                  if (!allowed) {
                    const firstAllowed = allTabs.find(t => t.roles.includes(r));
                    if (firstAllowed) setActiveTab(firstAllowed.id);
                  }
                }}
                className={`py-1.5 px-1 text-[10px] font-mono rounded tracking-tight capitalize transition-all ${
                  currentRole === r 
                    ? "bg-black text-white font-bold" 
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
 
        {/* Navigation Tabs List - Desktop */}
        <nav className="hidden lg:block p-4 space-y-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs uppercase tracking-wider font-mono transition-all border ${
                  isActive 
                    ? "bg-black border-black text-white font-semibold" 
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-black"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
          
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="w-full flex items-center gap-3 px-4 py-2.5 mt-4 rounded-md text-xs uppercase tracking-wider font-mono transition-all border border-black text-black hover:bg-black hover:text-white"
            >
              🛍️ Ir a la Tienda
            </button>
          )}
        </nav>
 
         {/* Navigation Tabs List - Mobile */}
        {mobileOpen && (
          <nav className="lg:hidden p-4 space-y-1 bg-white border-b border-gray-200 transition-all">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`mobile-tab-btn-${tab.id}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-xs uppercase tracking-wider font-mono transition-all border ${
                    isActive 
                      ? "bg-black border-black text-white font-semibold" 
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
            
            {onBackToStore && (
              <button
                onClick={() => {
                  onBackToStore();
                  setMobileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 mt-4 rounded-md text-xs uppercase tracking-wider font-mono transition-all border border-black text-black hover:bg-black hover:text-white"
              >
                🛍️ Ir a la Tienda
              </button>
            )}
          </nav>
        )}
      </div>
 
      {/* Footer Branding - Profile Avatar matching active role */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-900 font-bold text-xs italic shrink-0 ${currentRole === 'admin' ? 'bg-gray-400' : 'bg-stone-500'}`}>
            {currentRole === 'admin' ? 'AR' : currentRole === 'gerente' ? 'IS' : 'TM'}
          </div>
          <div>
            <p className="text-xs font-semibold text-black">
              {currentRole === 'admin' ? 'Arq. Romano' : currentRole === 'gerente' ? 'Ing. Salazar' : 'Téc. Medina'}
            </p>
            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">
              {currentRole === 'admin' ? 'Administrador' : currentRole === 'gerente' ? 'Gerente Corp.' : 'Operador Zeta'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
