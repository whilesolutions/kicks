import React, { useState } from "react";
import { 
  Receipt, 
  Trash2, 
  Plus, 
  DollarSign, 
  FileText, 
  Calendar, 
  Layers, 
  Percent, 
  Briefcase, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  Truck
} from "lucide-react";
import { ExpenseType, SaleType, ProductType } from "../types";

interface GastosProps {
  expenses: ExpenseType[];
  sales: SaleType[];
  products: ProductType[];
  onAddExpense: (payload: any) => Promise<any>;
  onDeleteExpense: (id: string) => Promise<any>;
  refreshData: () => void;
}

export default function Gastos({ expenses, sales, products, onAddExpense, onDeleteExpense, refreshData }: GastosProps) {
  // Local state for registering new expense
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [categoria, setCategoria] = useState<ExpenseType["categoria"]>("Suscripciones");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ text: "", type: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !categoria || !monto) {
      setFeedback({ text: "La fecha, la categoría y el monto son indispensables.", type: "error" });
      return;
    }

    setLoading(true);
    setFeedback({ text: "", type: "" });
    try {
      const res = await onAddExpense({
        fecha,
        categoria,
        descripcion,
        monto: parseFloat(monto),
        proveedor_o_destino: proveedor
      });

      if (res.error) {
        setFeedback({ text: `Error: ${res.error}`, type: "error" });
      } else {
        setFeedback({ text: "Gasto registrado exitosamente en el ERP Zeta", type: "success" });
        setDescripcion("");
        setMonto("");
        setProveedor("");
        refreshData();
      }
    } catch (err: any) {
      setFeedback({ text: `Error de red: ${err.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este gasto del ERP?")) return;
    try {
      const res = await onDeleteExpense(id);
      if (res.error) {
        alert("Error al eliminar: " + res.error);
      } else {
        refreshData();
      }
    } catch (err: any) {
      alert("Error de red: " + err.message);
    }
  };

  // Profit/Loss breakdown calculations
  const totalRevenues = sales.reduce((acc, s) => acc + s.ingreso_bruto, 0);
  const totalCOGS = sales.reduce((acc, s) => acc + s.costo_total, 0); // Costo de ventas de productos vendidos
  const totalOpExpenses = expenses.reduce((acc, exp) => acc + exp.monto, 0);
  const contributionMargin = totalRevenues - totalCOGS; // Margen de contribución
  const netProfit = contributionMargin - totalOpExpenses; // Utilidad Neta Real

  const profitMarginPercent = totalRevenues > 0 ? (netProfit / totalRevenues) * 100 : 0;
  const cogsPercent = totalRevenues > 0 ? (totalCOGS / totalRevenues) * 100 : 0;
  const opExpensesPercent = totalRevenues > 0 ? (totalOpExpenses / totalRevenues) * 100 : 0;

  // Expenses grouped by Category
  const categoriesList: ExpenseType["categoria"][] = [
    "Suscripciones",
    "Alquiler",
    "Logística",
    "Nómina",
    "Marketing Extra",
    "Otros"
  ];

  const expensesByCategory = categoriesList.reduce((acc, cat) => {
    const totalCat = expenses.filter(exp => exp.categoria === cat).reduce((sum, current) => sum + current.monto, 0);
    acc[cat] = totalCat;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h2 className="font-sans text-xl font-bold uppercase tracking-wider text-gray-900">
          Gestión de Expensas y Egresos Operacionales
        </h2>
        <p className="text-xs font-mono text-gray-500 mt-1 uppercase">
          Módulo ERP para la contabilidad general de gastos corporativos y estado de resultados (P&L) de la tienda.
        </p>
      </div>

      {/* P&L Statement Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total revenue */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 font-bold">
              Ingresos Brutos
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-gray-900">
              ${totalRevenues.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-gray-500 mt-1">Facturado en showrooms, WhatsApp y directo.</p>
          </div>
        </div>

        {/* Total cogs */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
              Costo de Ventas (COGS)
            </span>
            <Layers className="w-4 h-4 text-gray-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-gray-700">
              ${totalCOGS.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-gray-500 mt-1 font-mono">
              {cogsPercent.toFixed(1)}% de las ventas. (Costo unitario del proveedor).
            </p>
          </div>
        </div>

        {/* Running overhead gastos */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
              Egresos Operativos
            </span>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold font-mono text-gray-900">
              ${totalOpExpenses.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-gray-500 mt-1 font-mono">
              {opExpensesPercent.toFixed(1)}% de las ventas. (Alquiler, suscripciones, nómina, logística).
            </p>
          </div>
        </div>

        {/* Real bottom line profit */}
        <div className={`bg-[#FDFDFD] p-5 rounded-xl border ${netProfit >= 0 ? "border-[#FCD901]/50" : "border-red-950"} flex flex-col justify-between`}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#FCD901] font-bold">
              Utilidad Real (Profit Neto)
            </span>
            <Percent className="w-4 h-4 text-[#FCD901]" />
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-bold font-mono ${netProfit >= 0 ? "text-[#FCD901]" : "text-red-500"}`}>
              ${netProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <p className="text-[10px] text-gray-700 mt-1 font-bold">
              Margen de Ganancia: <span className={netProfit >= 0 ? "text-emerald-600" : "text-red-400"}>{profitMarginPercent.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Register Expense Form vs Breakdown chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form to create expense */}
        <div className="lg:col-span-4 bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 self-start space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <Receipt className="w-4 h-4 text-[#FCD901]" />
            <h3 className="text-xs font-bold uppercase text-gray-900 tracking-widest">
              Registrar Nuevo Egreso
            </h3>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                Fecha de Pago
              </label>
              <input
                type="date"
                required
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 focus:border-[#FCD901]/20 text-xs px-3 py-2.5 rounded-lg font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                Categoría del Egresos
              </label>
              <select
                required
                value={categoria}
                onChange={e => setCategoria(e.target.value as any)}
                className="w-full bg-white text-gray-900 border border-gray-300 focus:border-[#FCD901]/20 text-xs px-3 py-2.5 rounded-lg font-mono outline-none"
              >
                <option value="Suscripciones">Suscripciones (Netflix, Shopify, CRM, etc.)</option>
                <option value="Alquiler">Alquiler (Showrooms, depósitos)</option>
                <option value="Logística">Logística / Envíos (Empaque, flete, delivery)</option>
                <option value="Nómina">Nómina (Vendedores, operadores, asesores)</option>
                <option value="Marketing Extra">Marketing Extra / Publicidad física</option>
                <option value="Otros">Otros egresos imprevistos</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                Monto en USD ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500 text-xs font-mono">$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={monto}
                  onChange={e => setMonto(e.target.value)}
                  className="w-full bg-white text-gray-900 border border-gray-300 focus:border-[#FCD901]/20 text-xs pl-8 pr-3 py-2.5 rounded-lg font-mono outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                Descripción / Concepto
              </label>
              <textarea
                placeholder="Ej. Alquiler Oficina Chacao Junio 2026"
                rows={2}
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 focus:border-[#FCD901]/20 text-xs px-3 py-2 rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1">
                Proveedor / Destino de Fondos
              </label>
              <input
                type="text"
                placeholder="Ej. Inmobiliaria, Shopify Inc., etc."
                value={proveedor}
                onChange={e => setProveedor(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 focus:border-[#FCD901]/20 text-xs px-3 py-2.5 rounded-lg outline-none"
              />
            </div>

            {feedback.text && (
              <div className={`p-3 rounded text-[11px] flex items-center gap-2 border ${
                feedback.type === "success" 
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-600" 
                  : "bg-red-950/40 border-red-500/30 text-red-400"
              }`}>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{feedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FCD901] hover:bg-[#BCA02E] text-[#0A0A0A] font-bold uppercase py-2.5 px-4 rounded-lg text-xs tracking-wider transition-colors cursor-pointer flex justify-center items-center gap-2"
            >
              <Plus className="w-4 h-4 text-gray-900" />
              {loading ? "PROCESANDO..." : "REGISTRAR EN ERP"}
            </button>
          </form>
        </div>

        {/* Right Column: Expenditures breakdown and items list */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Expenditure Category Breakdown */}
          <div className="bg-[#FDFDFD] p-6 rounded-xl border border-gray-200">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">
              Distribución de Costos por Categorías
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categoriesList.map(cat => {
                const totalCat = expensesByCategory[cat] || 0;
                const ratio = totalOpExpenses > 0 ? (totalCat / totalOpExpenses) * 100 : 0;
                return (
                  <div key={cat} className="bg-white p-4 rounded-lg border border-gray-200 relative overflow-hidden">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wide block mb-1">
                      {cat}
                    </span>
                    <span className="text-lg font-bold font-mono text-gray-900">
                      ${totalCat.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="mt-3 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#FCD901] h-1.5 rounded-full" 
                        style={{ width: `${ratio}%` }} 
                      />
                    </div>
                    <span className="text-[9px] text-[#FCD901] font-mono mt-1 block">
                      {ratio.toFixed(0)}% de egresos totales
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Expense logs list */}
          <div className="bg-[#FDFDFD] rounded-xl border border-gray-200 p-4 sm:p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">
              Historial de Transacciones de Egresos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 px-2 text-[10px] font-mono uppercase">ID</th>
                    <th className="py-3 px-2 text-[10px] font-mono uppercase">Fecha</th>
                    <th className="py-3 px-2 text-[10px] font-mono uppercase">Categoría</th>
                    <th className="py-3 px-2 text-[10px] font-mono uppercase font-bold">Concepto / Descripción</th>
                    <th className="py-3 px-2 text-[10px] font-mono uppercase">Destinatario</th>
                    <th className="py-3 px-2 text-[10px] font-mono uppercase text-right">Monto (USD)</th>
                    <th className="py-3 px-2 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1A1A]">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-500 font-mono">
                        No hay egresos de showroom o nóminas registrados actualmente.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id_gasto} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-2 font-mono text-gray-500 text-[10px]">
                          {exp.id_gasto}
                        </td>
                        <td className="py-3 px-2 font-mono text-gray-700">
                          {exp.fecha}
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono capitalize ${
                            exp.categoria === "Alquiler" 
                              ? "bg-blue-900/40 text-blue-300 border border-blue-500/10" 
                              : exp.categoria === "Suscripciones" 
                              ? "bg-purple-900/40 text-purple-300 border border-purple-500/10" 
                              : exp.categoria === "Logística" 
                              ? "bg-amber-900/40 text-amber-600 border border-amber-500/10"
                              : exp.categoria === "Nómina"
                              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/10"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {exp.categoria}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-bold text-gray-900 max-w-xs truncate">
                          {exp.descripcion}
                        </td>
                        <td className="py-3 px-2 text-gray-500">
                          {exp.proveedor_o_destino || "No registrado"}
                        </td>
                        <td className="py-3 px-2 font-mono text-right font-bold text-gray-900 text-[13px]">
                          ${exp.monto.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => handleDelete(exp.id_gasto)}
                            className="p-1 text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Eliminar Transacción"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
