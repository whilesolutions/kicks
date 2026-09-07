import React, { useState, useMemo } from "react";
import { ProjectType, ProjectTaskType, CreativeType, ProductType } from "../types";
import { 
  Film, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Sparkles, 
  DollarSign, 
  Layers, 
  AlertCircle, 
  CheckSquare, 
  Square,
  TrendingUp,
  Inbox,
  Video,
  Tv,
  HelpCircle,
  Megaphone,
  Volume2,
  Tag,
  Link2,
  Check,
  Package
} from "lucide-react";

interface ProyectosProps {
  projects: ProjectType[];
  currentRole: 'admin' | 'gerente' | 'operador';
  creatives: CreativeType[];
  products: ProductType[];
  onAddProject: (payload: any) => Promise<any>;
  onAddTask: (projectId: string, payload: any) => Promise<any>;
  onUpdateTaskStatus: (projectId: string, taskId: string, updates: any) => Promise<any>;
  onAddCreative: (payload: any) => Promise<any>;
  refreshData: () => Promise<void>;
}

export default function Proyectos({
  projects,
  currentRole,
  creatives,
  products,
  onAddProject,
  onAddTask,
  onUpdateTaskStatus,
  onAddCreative,
  refreshData
}: ProyectosProps) {
  // State managers
  const [selectedProjectId, setSelectedProjectId] = useState<string>("PROY-001");
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  
  // New Campaign Form State
  const [newProjName, setNewProjName] = useState("");
  const [newProjDesc, setNewProjDesc] = useState("");
  const [newProjLeader, setNewProjLeader] = useState("Equipo Creativo");
  const [newProjBudget, setNewProjBudget] = useState("350");
  const [newProjLimit, setNewProjLimit] = useState("");
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);

  // New Ad Creative Form State
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<'Baja' | 'Media' | 'Alta'>('Media');
  const [newTaskResp, setNewTaskResp] = useState("Equipo Creativo");
  const [newTaskLimit, setNewTaskLimit] = useState("");
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Synchronizer State for dim_creativos
  const [syncTaskId, setSyncTaskId] = useState<string | null>(null);
  const [syncContentId, setSyncContentId] = useState("");
  const [syncPlatform, setSyncPlatform] = useState<'Meta Ads' | 'TikTok Orgánico' | 'TikTok Live'>("Meta Ads");
  const [syncFormat, setSyncFormat] = useState<'Reel' | 'Video Feed' | 'Estático' | 'Carrusel' | 'Historia' | 'Live Shopping'>("Reel");
  const [syncStyle, setSyncStyle] = useState<'Hablado' | 'Sin voz' | 'Música+texto' | 'Tranquilo/ASMR' | 'Enérgico'>("Hablado");
  const [syncFocus, setSyncFocus] = useState<'Solo producto' | 'Testimonio' | 'Tutorial' | 'Promoción precio' | 'Detrás de cámaras'>("Solo producto");
  const [syncStrategy, setSyncStrategy] = useState<'Lanzamiento' | 'Liquidación' | 'Construcción de marca' | 'Retargeting'>("Lanzamiento");
  const [syncSegment, setSyncSegment] = useState("Mujer joven moda");
  const [syncNotes, setSyncNotes] = useState("");
  const [selectedProductSku, setSelectedProductSku] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Pre-fill helper for synchronizing task into real creatives catalog (dim_creativos)
  const openSyncPanel = (task: ProjectTaskType, campaignName: string) => {
    setSyncTaskId(task.id_tarea);
    setShowSyncSuccess(false);
    
    // Auto generate clean Creative ID Slug
    const cleanCamp = campaignName
      .toUpperCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove tildes
      .replace(/[^\w\s]/gi, '')
      .split(' ')
      .filter(w => w.length > 2 && w !== "DEL" && w !== "CON" && w !== "CAMPAÑA")
      .slice(0, 2)
      .join('_');
      
    const cleanNum = task.id_tarea.replace(/[^\d]/gi, '');
    let prefix = "META_";
    const descLower = task.descripcion.toLowerCase();
    
    if (descLower.includes("tiktok") || descLower.includes("tok")) {
      prefix = "TIKTOK_";
      if (descLower.includes("live")) {
        setSyncPlatform("TikTok Live");
        setSyncFormat("Live Shopping");
      } else {
        setSyncPlatform("TikTok Orgánico");
        setSyncFormat("Reel");
      }
    } else {
      setSyncPlatform("Meta Ads");
      if (descLower.includes("carrusel") || descLower.includes("fotos")) {
        setSyncFormat("Carrusel");
      } else if (descLower.includes("estatico") || descLower.includes("imagen") || descLower.includes("banner")) {
        setSyncFormat("Estático");
      } else {
        setSyncFormat("Reel");
      }
    }

    if (descLower.includes("asmr") || descLower.includes("unboxing")) {
      setSyncStyle("Tranquilo/ASMR");
    } else if (descLower.includes("hablado") || descLower.includes("voz")) {
      setSyncStyle("Hablado");
    } else if (descLower.includes("musica") || descLower.includes("cancion")) {
      setSyncStyle("Música+texto");
    } else {
      setSyncStyle("Enérgico");
    }

    setSyncContentId(`${prefix}${cleanCamp}_${cleanNum || "101"}`);
    setSyncNotes(task.descripcion);

    // Default target segment
    if (campaignName.toLowerCase().includes("padre") || campaignName.toLowerCase().includes("caballero")) {
      setSyncSegment("Hombre casual elegante");
    } else if (campaignName.toLowerCase().includes("vip") || campaignName.toLowerCase().includes("kicks")) {
      setSyncSegment("Soles de alto valor VIP");
    } else {
      setSyncSegment("Mujer joven tendencia");
    }

    // Attempt to guess associated product
    const foundProd = products.find(p => descLower.includes(p.nombre_producto.toLowerCase()) || descLower.includes(p.sku.toLowerCase()));
    setSelectedProductSku(foundProd ? foundProd.sku : "");
  };

  const handleSyncToCatalogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syncContentId.trim()) return;

    setIsSyncing(true);
    try {
      const payload: CreativeType = {
        id_contenido: syncContentId.trim().toUpperCase(),
        plataforma: syncPlatform,
        tipo_contenido: syncPlatform === "Meta Ads" && syncFormat === "Estático" ? "Imagen" : "Video",
        nombre_campana: activeProject ? activeProject.nombre : "Lanzamiento Zeta",
        objetivo: "Conversión",
        formato: syncFormat,
        estilo_narrativo: syncStyle,
        enfoque_contenido: syncFocus,
        estrategia: syncStrategy,
        duracion_segundos: syncFormat === "Estático" ? 0 : 25,
        seg_edad_min: 18,
        seg_edad_max: 45,
        seg_genero: syncSegment.toLowerCase().includes("hombre") ? "Masculino" : syncSegment.toLowerCase().includes("mujer") ? "Femenino" : "Todos",
        seg_regiones_incluidas: "Distrito Capital, Miranda, Carabobo, Aragua",
        seg_intereses: "Calzado, Calzado de Venezuela, Moda, Zapatos Deportivos",
        seg_publico_personalizado: "Interacciones Instagram 180 d",
        segmento_interno: syncSegment,
        notas: syncNotes || `Creado desde el planificador para la tarea ${syncTaskId}`
      };

      await onAddCreative(payload);
      
      // Update task on local PM to keep trace of sync
      if (activeProject && syncTaskId) {
        // Tag the task indicating synchronization
        await onUpdateTaskStatus(activeProject.id_proyecto, syncTaskId, { 
          descripcion: `${activeProject.tareas.find(t => t.id_tarea === syncTaskId)?.descripcion} [Sincronizado: ${syncContentId}]`
        });
      }

      await refreshData();
      setShowSyncSuccess(true);
      setTimeout(() => {
        setSyncTaskId(null);
        setShowSyncSuccess(false);
      }, 2500);

    } catch (err) {
      console.error("Error sincronizando creativo:", err);
      alert("Error al sincronizar con el catálogo de creativos.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Computed global PM metrics
  const pmStats = useMemo(() => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.estado === "Completado" || p.porcentaje_progreso === 100).length;
    const activeProjects = projects.filter(p => p.estado === "En Progreso" && p.porcentaje_progreso < 100).length;
    
    let totalTasksCount = 0;
    let completedTasksCount = 0;
    let totalBudgetSpent = 0;

    projects.forEach(p => {
      totalBudgetSpent += p.presupuesto;
      if (p.tareas) {
        totalTasksCount += p.tareas.length;
        completedTasksCount += p.tareas.filter(t => t.estado === "Completada").length;
      }
    });

    const averageProgress = totalProjects > 0 
      ? Math.round(projects.reduce((acc, p) => acc + p.porcentaje_progreso, 0) / totalProjects) 
      : 0;

    return {
      totalProjects,
      completedProjects,
      activeProjects,
      totalTasksCount,
      completedTasksCount,
      totalBudgetSpent,
      averageProgress
    };
  }, [projects]);

  // Selected project object lookup
  const activeProject = useMemo(() => {
    return projects.find(p => p.id_proyecto === selectedProjectId) || projects[0] || null;
  }, [projects, selectedProjectId]);

  // Handles completing/toggling task status
  const handleToggleTask = async (projectId: string, taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completada" ? "Pendiente" : "Completada";
    try {
      await onUpdateTaskStatus(projectId, taskId, { estado: newStatus });
      await refreshData();
    } catch (err) {
      console.error("Error toggling task status:", err);
    }
  };

  // Handles editing of other components inside task
  const handleTaskStatusChangeDirect = async (projectId: string, taskId: string, statusVal: string) => {
    try {
      await onUpdateTaskStatus(projectId, taskId, { estado: statusVal });
      await refreshData();
    } catch (err) {
      console.error("Error patching task status directly:", err);
    }
  };

  // Handle addition of task
  const handleAddNewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim() || !activeProject) return;

    setIsSubmittingTask(true);
    try {
      const payload = {
        descripcion: newTaskDesc.trim(),
        prioridad: newTaskPriority,
        responsable: newTaskResp,
        fecha_limite: newTaskLimit || new Date().toISOString().split('T')[0],
        estado: "Pendiente"
      };

      await onAddTask(activeProject.id_proyecto, payload);
      await refreshData();
      
      // Reset
      setNewTaskDesc("");
      setNewTaskLimit("");
    } catch (err) {
      console.error("Error adding task to server:", err);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Handle creation of Project (Campaign Batch)
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    setIsSubmittingProj(true);
    try {
      const payload = {
        nombre: newProjName.trim(),
        descripcion: newProjDesc.trim(),
        responsable_lider: newProjLeader,
        presupuesto: parseFloat(newProjBudget) || 0,
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_limite: newProjLimit || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: "En Progreso",
        porcentaje_progreso: 0,
        tareas: []
      };

      const result = await onAddProject(payload);
      await refreshData();

      if (result && result.proyecto) {
        setSelectedProjectId(result.proyecto.id_proyecto);
      }
      
      // Reset
      setShowAddProjectForm(false);
      setNewProjName("");
      setNewProjDesc("");
      setNewProjLimit("");
    } catch (err) {
      console.error("Error creating project:", err);
    } finally {
      setIsSubmittingProj(false);
    }
  };

  // Check if a task description contains already synchronized ID
  const isTaskAlreadySynced = (desc: string) => {
    return desc.includes("[Sincronizado:") || /\[Sincronizado: \w+\]/.test(desc);
  };

  const getSyncedId = (desc: string) => {
    const match = desc.match(/\[Sincronizado:\s*(\w+)\]/);
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-8 animate-fade-in text-gray-900 pb-12">
      
      {/* MODULE HEADER AND BRIEF */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#FCD901] font-mono text-[10px] tracking-widest uppercase font-bold">
            <Film className="w-3.5 h-3.5" /> Planificador & Rodaje de Creativos
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-1">
            Gestión de Contenido y Anuncios 🎬
          </h2>
          <p className="text-gray-500 text-xs mt-1.5 max-w-2xl leading-relaxed">
            Coordine el proceso de producción de videos, Reels, hooks de ASMR, unboxings y carruseles publicitarios.
            Una vez terminados, <strong>sincronícelos</strong> directamente con el Catálogo de Creativos para medir su ROI real.
          </p>
        </div>

        <button 
          onClick={() => setShowAddProjectForm(!showAddProjectForm)}
          className="bg-[#FDFDFD] border border-gray-300 hover:border-[#FCD901]/20 text-gray-900 hover:text-[#FCD901] px-4 py-2 rounded-lg text-xs font-bold font-mono tracking-wide transition-all self-start cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 text-[#FCD901]" /> {showAddProjectForm ? "Ocultar Formulario" : "Nuevo Lote de Creativos"}
        </button>
      </div>

      {/* NEW CAMPAIGN FORM (Collapsible drawer-like overlay) */}
      {showAddProjectForm && (
        <div className="bg-[#FDFDFD] p-6 rounded-xl border border-[#FCD901]/20 shadow-[0_0_15px_rgba(212,175,55,0.05)] animate-scale-in">
          <h3 className="text-xs font-bold text-[#FCD901] tracking-wider uppercase font-mono mb-1.5 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FCD901]" /> Crear Nueva Campaña / Lote de Creativos
          </h3>
          <p className="text-xs text-gray-500 mb-4 font-mono">
            Planifique un nuevo set de anuncios. Determine la meta de pauta y asigne al equipo encargado del rodaje.
          </p>

          <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-[9px] font-mono uppercase text-gray-500 font-bold">Nombre o Temática de la Campaña:</label>
              <input 
                type="text"
                placeholder="Ej: Lanzamiento Tacón Chacao 👠 o Serie TikTok Orgánico Junio"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#FCD901]/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase text-gray-500 font-bold">Asignado a:</label>
              <select 
                value={newProjLeader}
                onChange={(e) => setNewProjLeader(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
              >
                <option value="Equipo Creativo">Equipo Creativo</option>
                <option value="Ing. Salazar">Ing. Salazar (Gerente)</option>
                <option value="Arq. Romano">Arq. Romano (Admin)</option>
                <option value="Operador WhatsApp">Operador WhatsApp</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase text-gray-500 font-bold">Presupuesto Estimado Ad Spend (USD):</label>
              <input 
                type="number"
                placeholder="Ej: 350"
                value={newProjBudget}
                onChange={(e) => setNewProjBudget(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-[9px] font-mono uppercase text-gray-500 font-bold">Breve de Estrategia Publicitaria / Estructura:</label>
              <input 
                type="text"
                placeholder="Ej: Producción de 4 reels para retargeting enfocados en la suavidad de las plantillas Zeta..."
                value={newProjDesc}
                onChange={(e) => setNewProjDesc(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-mono uppercase text-gray-500 font-bold">Fecha Límite de Estreno:</label>
              <input 
                type="date"
                value={newProjLimit}
                onChange={(e) => setNewProjLimit(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none text-gray-700 font-mono"
              />
            </div>

            <div className="md:col-span-4 pt-2.5 border-t border-gray-200">
              <button 
                type="submit"
                disabled={isSubmittingProj || !newProjName}
                className="w-full bg-[#FCD901] hover:bg-amber-300 text-[#0A0A0A] py-2 rounded text-xs font-bold font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 select-none cursor-pointer"
              >
                {isSubmittingProj ? "Sincronizando..." : "Iniciar Campaña Zeta ★"}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* BRIEF PM KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* TOTAL ACTIVE CAMPAIGNS */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Lotes de Contenido</span>
            <span className="text-[9px] bg-[#FCD901]/10 text-[#FCD901] border border-[#FCD901]/25 px-1 py-0.2 rounded font-mono uppercase">Campañas</span>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">{pmStats.totalProjects}</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1 leading-normal">
            <strong className="text-emerald-600">{pmStats.activeProjects}</strong> activos • <strong className="text-gray-500">{pmStats.completedProjects}</strong> listos para pauta.
          </p>
        </div>

        {/* OVERALL PRODUCTION RATIO */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Tasa de Grabación</span>
            <span className="text-[10.5px] font-bold text-gray-700 font-mono">
              {pmStats.totalTasksCount > 0 ? Math.round((pmStats.completedTasksCount / pmStats.totalTasksCount) * 100) : 0}%
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-[#FCD901]">
            {pmStats.completedTasksCount} / {pmStats.totalTasksCount}
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1 leading-normal">
            Restan <strong className="text-gray-600">{pmStats.totalTasksCount - pmStats.completedTasksCount}</strong> anuncios por rodar / editar.
          </p>
        </div>

        {/* METRICS OF ESTIMATED PAUTA SPEND */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Inversión Planificada</span>
            <span className="text-[9px] bg-sky-500/10 text-sky-400 border border-sky-500/25 px-1 rounded font-mono">Presupuesto</span>
          </div>
          <div className="mt-2 text-2xl font-black text-gray-900">${pmStats.totalBudgetSpent.toLocaleString()} USD</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1 leading-normal">
            Meta promedio por pauta: <strong className="text-[#FCD901]">${Math.round(pmStats.totalBudgetSpent / (pmStats.totalProjects || 1))} USD</strong>
          </p>
        </div>

        {/* AVERAGE PORTFOLIO COMPLETED RATIO */}
        <div className="bg-[#FDFDFD] p-5 rounded-xl border border-gray-200">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold">Progreso Promedio</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{pmStats.averageProgress}%</div>
          
          <div className="w-full bg-gray-50 h-1 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-400 h-full transition-all" style={{ width: `${pmStats.averageProgress}%` }} />
          </div>
        </div>

      </div>

      {/* CORE WORKSPACE INTERFACE: PROJECT SELECTOR AND DETAILED TASKS MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ACTIVE PROJECTS CARD SELECTOR */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase font-mono">
            Campañas Planificadas Zeta
          </h3>

          <div className="space-y-4">
            {projects.map((proj) => {
              const isSelected = proj.id_proyecto === selectedProjectId;
              
              // Count tasks
              const totTasks = proj.tareas ? proj.tareas.length : 0;
              const compTasks = proj.tareas ? proj.tareas.filter(t => t.estado === "Completada").length : 0;

              return (
                <div 
                  key={proj.id_proyecto}
                  onClick={() => setSelectedProjectId(proj.id_proyecto)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left select-none ${
                    isSelected 
                      ? "bg-[#FDFDFD] border-[#FCD901]/50 shadow-[0_0_12px_rgba(212,175,55,0.06)]" 
                      : "bg-[#FDFDFD]/70 border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[8.5px] font-mono uppercase bg-gray-200 text-gray-500 border border-gray-200 py-0.2 px-1 rounded">
                        {proj.id_proyecto}
                      </span>
                      <h4 className={`text-sm font-bold mt-1 text-gray-900 ${isSelected ? "text-[#FCD901]" : ""}`}>
                        {proj.nombre}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold font-mono tracking-wider ${
                      proj.estado === "Completado" || proj.porcentaje_progreso === 100 
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-550/20" 
                        : "bg-amber-300/10 text-amber-400 border border-[#FCD901]/10"
                    }`}>
                      {proj.estado === "Completado" ? "FILMADO" : "EN GRABACIÓN"}
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed font-sans">
                    {proj.descripcion || "Sin brief operativo proporcionado."}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                      <span>Producido: <strong className="text-gray-700">{proj.porcentaje_progreso}%</strong></span>
                      <span>{compTasks}/{totTasks} Anuncios</span>
                    </div>

                    {/* Progress Bar inside Selector card */}
                    <div className="w-full bg-[#FDFDFD] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          proj.porcentaje_progreso === 100 ? "bg-emerald-400" : "bg-[#FCD901]"
                        }`} 
                        style={{ width: `${proj.porcentaje_progreso}%` }} 
                      />
                    </div>
                  </div>

                  {/* Leader and End dates indicators */}
                  <div className="mt-3 flex justify-between items-center text-[9px] font-mono text-gray-500 border-t border-gray-200 pt-2">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-[#FCD901]" /> {proj.responsable_lider}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-red-500" /> {proj.fecha_limite}</span>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: EXPANDED ACTIVE PROJECT TASKS BOARD WITH STATUS TOGGLERS */}
        <div className="lg:col-span-7 bg-[#FDFDFD] p-6 rounded-xl border border-gray-200 space-y-6">
          
          {activeProject ? (
            <div className="space-y-6">
              
              {/* Active project intro panel */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block font-bold">Campaña Activa en Producción:</span>
                    <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2 mt-1">
                      <Layers className="w-4.5 h-4.5 text-[#FCD901]" /> {activeProject.nombre}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{activeProject.descripcion}</p>
                  </div>

                  <div className="bg-[#FDFDFD] p-2.5 rounded-lg border border-gray-200 text-right font-mono text-[10px] select-none">
                    <p className="text-gray-500 font-bold uppercase">Meta Gasto Ads:</p>
                    <p className="text-gray-900 font-extrabold text-sm">${activeProject.presupuesto.toFixed(2)} USD</p>
                  </div>
                </div>

                {/* Big status widget indicator banner */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-[10px] font-mono text-gray-500">
                  <div className="bg-[#FDFDFD] p-2 rounded border border-gray-200">
                    <span className="text-gray-500 uppercase text-[9px] block">Crew Designado:</span>
                    <strong className="text-gray-900 text-[11px] mt-0.5 block flex items-center gap-1 font-sans"><User className="w-3 h-3 text-[#FCD901]" /> {activeProject.responsable_lider}</strong>
                  </div>
                  <div className="bg-[#FDFDFD] p-2 rounded border border-gray-200">
                    <span className="text-gray-500 uppercase text-[9px] block">Meta Rodaje/Pauta:</span>
                    <strong className="text-gray-900 text-[11px] mt-0.5 block flex items-center gap-1"><Calendar className="w-3 h-3 text-[#FCD901]" /> {activeProject.fecha_limite}</strong>
                  </div>
                  <div className="bg-[#FDFDFD] p-2 rounded border border-gray-200 col-span-2 sm:col-span-1">
                    <span className="text-gray-500 uppercase text-[9px] block">Rendimiento Fílmico:</span>
                    <strong className="text-emerald-600 text-[11.5px] mt-0.5 block font-bold">{activeProject.porcentaje_progreso}% Listo</strong>
                  </div>
                </div>
              </div>

              {/* INTEGRATIVE PIPELINE FORM FOR dim_creativos AS MODAL/CARD */}
              {syncTaskId && (
                <div className="bg-white p-5 rounded-lg border-2 border-dashed border-[#FCD901]/50 shadow-[0_0_15px_rgba(212,175,55,0.1)] animate-scale-in space-y-4">
                  <div className="flex justify-between items-start border-b border-gray-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FCD901] animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider font-mono">
                          Integrador Inteligente de Creativos
                        </h4>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                          Inyectando anuncio termiando al catálogo global de atribución comercial
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSyncTaskId(null)}
                      className="text-gray-500 hover:text-gray-900 text-xs font-mono font-bold"
                    >
                      [Cancelar]
                    </button>
                  </div>

                  {showSyncSuccess ? (
                    <div className="bg-emerald-950/30 text-emerald-600 border border-emerald-500/30 p-6 rounded text-center space-y-2">
                      <Check className="w-8 h-8 mx-auto text-emerald-600 bg-emerald-500/10 p-1.5 rounded-full" />
                      <p className="text-xs font-bold font-mono uppercase tracking-widest">¡Creativo Sincronizado Exitosamente!</p>
                      <p className="text-[10px] text-gray-500 leading-normal">Se detectó el ID <strong>{syncContentId}</strong> y se insertó en el catálogo principal dim_creativos.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSyncToCatalogSubmit} className="space-y-4">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Código de Contenido (ID Único):</label>
                          <input 
                            type="text"
                            value={syncContentId}
                            onChange={(e) => setSyncContentId(e.target.value.toUpperCase())}
                            placeholder="Ej: META_REEL_009"
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono uppercase focus:outline-none focus:border-[#FCD901]/20"
                            required
                          />
                          {creatives.some(c => c.id_contenido === syncContentId) && (
                            <span className="text-[9px] text-red-400 block font-mono">⚠️ Este ID de creativo ya se encuentra registrado.</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Plataforma:</label>
                          <select 
                            value={syncPlatform}
                            onChange={(e) => setSyncPlatform(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="Meta Ads">Meta Ads</option>
                            <option value="TikTok Orgánico">TikTok Orgánico</option>
                            <option value="TikTok Live">TikTok Live</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Formato:</label>
                          <select 
                            value={syncFormat}
                            onChange={(e) => setSyncFormat(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="Reel">Reel / Video Vertical Form</option>
                            <option value="Video Feed">Video Feed Tradicional</option>
                            <option value="Estático">Estático / Imagen Sola</option>
                            <option value="Carrusel">Carrusel / Collage de Fotos</option>
                            <option value="Historia">Historia / Contenido Efímero</option>
                            <option value="Live Shopping">Live Shopping Directo</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Estilo Narrativo:</label>
                          <select 
                            value={syncStyle}
                            onChange={(e) => setSyncStyle(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="Hablado">Hablado (Voz en off / Explicación)</option>
                            <option value="Sin voz">Sin voz (Música sola)</option>
                            <option value="Música+texto">Música + Texto en Pantalla</option>
                            <option value="Tranquilo/ASMR">Tranquilo / ASMR Unboxing</option>
                            <option value="Enérgico">Enérgico / Tendencia Rápida</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Enfoque Primario de Contenido:</label>
                          <select 
                            value={syncFocus}
                            onChange={(e) => setSyncFocus(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="Solo producto">Solo producto (Estética fina)</option>
                            <option value="Testimonio">Testimonio (Reseña cliente)</option>
                            <option value="Tutorial">Tutorial (Cómo calzar / combinar)</option>
                            <option value="Promoción precio">Promoción de Precio (Liquidación)</option>
                            <option value="Detrás de cámaras">Detrás de cámaras (Taller / Showroom)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Estrategia Comercial:</label>
                          <select 
                            value={syncStrategy}
                            onChange={(e) => setSyncStrategy(e.target.value as any)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="Lanzamiento">Lanzamiento (Colección Nueva)</option>
                            <option value="Liquidación">Liquidación (Outlet / Descuento)</option>
                            <option value="Construcción de marca">Construcción de Marca (Identidad)</option>
                            <option value="Retargeting">Retargeting (Públicos tibios)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Segmento Demográfico Objetivo:</label>
                          <input 
                            type="text"
                            value={syncSegment}
                            onChange={(e) => setSyncSegment(e.target.value)}
                            placeholder="Ej: Mujer joven moda o Caballero urbano casual"
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Producto Modelo Zeta Vinculado:</label>
                          <select 
                            value={selectedProductSku}
                            onChange={(e) => setSelectedProductSku(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 font-mono focus:outline-none"
                          >
                            <option value="">-- Ninguno (Genérico) --</option>
                            {products.map(p => (
                              <option key={p.sku} value={p.sku}>{p.nombre_producto} ({p.sku})</option>
                            ))}
                          </select>
                        </div>

                      </div>

                      <div className="space-y-1">
                        <label className="block text-[8.5px] font-mono uppercase text-gray-500 font-bold">Notas de Producción / Copywriting:</label>
                        <textarea 
                          value={syncNotes}
                          onChange={(e) => setSyncNotes(e.target.value)}
                          placeholder="Escriba aquí los detalles del guión o copy utilizado..."
                          className="w-full h-16 bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 focus:outline-none text-gray-700"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSyncing || creatives.some(c => c.id_contenido === syncContentId)}
                        className="w-full bg-[#FCD901] hover:bg-amber-300 text-[#0A0A0A] font-extrabold uppercase font-mono tracking-widest text-xs py-2 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none disabled:opacity-30"
                      >
                        {isSyncing ? "Integrando..." : "Confirmar e Inyectar en Catálogo Principal 🚀"}
                      </button>

                    </form>
                  )}
                </div>
              )}

              {/* INTERACTIVE TASKS LIST */}
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-[#FDFDFD] p-2 px-3 rounded text-[10px] font-mono tracking-wider font-bold text-gray-500 uppercase">
                  <span>Guiones & Anuncios a Rodar (Creativos)</span>
                  <span>Producción</span>
                </div>

                {(!activeProject.tareas || activeProject.tareas.length === 0) ? (
                  <div className="bg-[#FDFDFD] p-8 rounded-lg border border-dashed border-gray-200 text-center text-xs font-mono text-gray-500 flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-6 h-6 text-gray-500" />
                    No hay anuncios pautados para grabar en este lote. Registre el primero en el formulario inferior.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeProject.tareas.map((task) => {
                      const isCompleted = task.estado === "Completada";
                      const isLinked = isTaskAlreadySynced(task.descripcion);
                      const synId = getSyncedId(task.descripcion);
                      
                      return (
                        <div 
                          key={task.id_tarea}
                          className={`p-3.5 rounded-lg border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            isCompleted 
                              ? "bg-[#FDFDFD] border-emerald-500/10 opacity-80" 
                              : task.prioridad === "Alta" 
                              ? "bg-red-50 border-red-500/15" 
                              : "bg-[#FDFDFD] border-gray-100"
                          }`}
                        >
                          {/* Checkbox trigger toggler + Description */}
                          <div className="flex items-start gap-3 flex-1">
                            <button 
                              type="button"
                              onClick={() => handleToggleTask(activeProject.id_proyecto, task.id_tarea, task.estado)}
                              className="mt-1 transition-transform hover:scale-110 active:scale-95 cursor-pointer text-[#aef52750] hover:text-[#FCD901]"
                              title={isCompleted ? "Marcar como pendiente" : "Marcar como completada"}
                            >
                              {isCompleted ? (
                                <CheckSquare className="w-5 h-5 text-emerald-600" />
                              ) : (
                                <Square className="w-5 h-5 text-gray-600 hover:border-[#FCD901]/20" />
                              )}
                            </button>

                            <div className="space-y-0.5">
                              <p className={`text-xs text-gray-900 leading-normal font-medium ${
                                isCompleted ? "line-through text-gray-500 font-normal" : ""
                              }`}>
                                {task.descripcion.split(" [Sincronizado:")[0]}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[9px] font-mono text-gray-500">
                                <span className="bg-gray-50 text-gray-700 px-1.5 py-0.2 rounded font-bold">{task.id_tarea}</span>
                                <span className={`px-1.5 py-0.2 rounded font-bold ${
                                  task.prioridad === "Alta" ? "bg-red-500/10 text-red-400 border border-red-500/10" :
                                  task.prioridad === "Media" ? "bg-amber-300/10 text-amber-400 border border-amber-500/10" : "bg-gray-50 text-gray-500"
                                }`}>
                                  Prio: {task.prioridad}
                                </span>
                                <span className="text-gray-500">Filma:<strong> {task.responsable}</strong></span>
                                {task.fecha_limite && (
                                  <span className="text-gray-500 flex items-center gap-0.5">
                                    <Clock className="w-2.5 h-2.5 text-gray-500" /> {task.fecha_limite}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action controls or Sync Catalogo Badge */}
                          <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0 select-none font-mono">
                            {isCompleted ? (
                              isLinked || synId ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9.5px] font-bold px-2 py-1 rounded flex items-center gap-1 select-all uppercase">
                                  <Link2 className="w-3 h-3 text-emerald-600" />
                                  Atribuidor {synId || "Ok"}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openSyncPanel(task, activeProject.nombre)}
                                  className="bg-amber-300 hover:bg-[#FCD901] text-[#0A0A0A] hover:scale-103 active:scale-95 text-[9.5px] font-black tracking-wider px-2.5 py-1 rounded flex items-center gap-1 flex-row transition-all text-center cursor-pointer select-none border border-black/10"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-gray-900" />
                                  CONECTAR ROI
                                </button>
                              )
                            ) : null}

                            <select
                              value={task.estado}
                              onChange={(e) => handleTaskStatusChangeDirect(activeProject.id_proyecto, task.id_tarea, e.target.value)}
                              className={`text-[10px] font-bold font-mono px-2 py-1 bg-white border rounded focus:ring-1 focus:ring-[#aef527] focus:outline-none ${
                                task.estado === "Completada" ? "text-emerald-600 border-emerald-500/20" :
                                task.estado === "En Progreso" ? "text-amber-400 border-amber-500/20" : "text-gray-500 border-gray-200"
                              }`}
                            >
                              <option value="Pendiente">PENDIENTE</option>
                              <option value="En Progreso">EDICIÓN/PROG</option>
                              <option value="Completada">LISTO/OK</option>
                            </select>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* QUICK NEW TASK CREATOR PANEL */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-xs font-bold text-[#FCD901] tracking-wider uppercase font-mono mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Agregar Guión / Anuncio por Rodar
                </h4>

                <form onSubmit={handleAddNewTask} className="space-y-4 bg-[#FDFDFD] p-4 rounded-lg border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    <div className="md:col-span-6 space-y-1">
                      <label className="block text-[8px] font-mono uppercase text-gray-500 font-bold">Concepto Creativo, Gancho o Idea (Ej: ASMR Botas):</label>
                      <input 
                        type="text"
                        placeholder="Ej: TikTok Hablado - Combinando las Botas Piel Tacón con outfits casuales"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-[#FCD901]/20"
                        required
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="block text-[8px] font-mono uppercase text-gray-500 font-bold">Prioridad de Lanzamiento:</label>
                      <select 
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 focus:outline-none font-mono"
                      >
                        <option value="Alta">Alta 🔴 Prisa</option>
                        <option value="Media">Media 🟡 Normal</option>
                        <option value="Baja">Baja ⚪ Stock/Org.</option>
                      </select>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="block text-[8px] font-mono uppercase text-gray-500 font-bold">Productor Resp.:</label>
                      <select 
                        value={newTaskResp}
                        onChange={(e) => setNewTaskResp(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-900 focus:outline-none font-mono"
                      >
                        <option value="Equipo Creativo">Equipo Creativo</option>
                        <option value="Admin">Admin (Director)</option>
                        <option value="Gerente">Gerente</option>
                        <option value="Operador">Operadores</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs justify-between items-center">
                    <div className="flex items-center gap-2 w-full sm:w-auto font-mono">
                      <span className="text-[9px] text-gray-500 font-bold uppercase shrink-0">Fecha de Grabación:</span>
                      <input 
                        type="date"
                        value={newTaskLimit}
                        onChange={(e) => setNewTaskLimit(e.target.value)}
                        className="bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-900 focus:outline-none font-mono"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingTask || !newTaskDesc}
                      className="w-full sm:w-auto bg-[#FDFDFD] border border-gray-200 hover:border-[#FCD901]/20 text-gray-900 hover:text-[#FCD901] px-5 py-1.5 rounded text-xs font-bold font-mono tracking-wider uppercase transition-all select-none cursor-pointer"
                    >
                      {isSubmittingTask ? "Integrando..." : "Programar Anuncio ✓"}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 font-mono">
              Para calendarizar filmaciones, asegúrese de que el portafolio de campañas tenga cargado datos.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
