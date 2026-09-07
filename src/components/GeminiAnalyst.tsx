/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Lightbulb, 
  TrendingUp, 
  PackageCheck, 
  PenTool, 
  Bot, 
  User 
} from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function GeminiAnalyst() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "💼 ¡Saludos! Soy tu consultor de negocios inteligente de KICKS.\n\nTengo acceso en vivo a los registros consolidados de ventas de tu ERP, métricas publicitarias de Meta Ads / TikTok, y el catálogo general de calzado.\n\n¿En qué puedo asistirte para optimizar las operaciones de calzado en Venezuela hoy?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Preset quick questions for fast operational assistance
  const presets = [
    {
      label: "Alerta de Stock & quiebres",
      prompt: "Analiza el inventario actual de calzado. Enumera qué SKUs tienen menos de 5 unidades, prevé quiebres de stock según las ventas actuales y sugiereme un plan de compras rápido de hormas.",
      icon: PackageCheck
    },
    {
      label: "Copywriter para Meta Ads",
      prompt: "Escríbeme 3 opciones de copys publicitarios de enganche para Instagram Ads promocionando la categoría de sandalias de cuero basado en las compras de los clientes caraqueños, con tono de estatus elegante y caribeño.",
      icon: PenTool
    },
    {
      label: "Cálculo & Auditoría de ROAS",
      prompt: "Calcula el retorno de inversión publicitaria (ROAS) consolidado. Dime qué creativos están rindiendo por encima de la media y cuáles deberíamos apagar de inmediato.",
      icon: TrendingUp
    }
  ];

  // Send to server-side Gemini Proxy API
  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isLoading) return;

    const newMsgs = [...messages, { role: 'user', content: userPrompt } as Message];
    setMessages(newMsgs);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/smart_analyst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userPrompt })
      });

      const data = await response.json();
      
      if (data.error) {
        setMessages([...newMsgs, { 
          role: 'assistant', 
          content: `⚠️ Error de Asistencia: ${data.error}` 
        }]);
      } else {
        setMessages([...newMsgs, { 
          role: 'assistant', 
          content: data.response || "No recibí respuesta del analista." 
        }]);
      }
    } catch (err: any) {
      setMessages([...newMsgs, { 
        role: 'assistant', 
        content: `⚠️ Error al conectar con el servidor: ${err.message}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Custom text formatter that converts markdown asterisks to JSX elements safely
  const formatText = (text: string) => {
    return text.split('\n').map((line, blockIdx) => {
      // Find bold markers and convert them
      let formattedLine = [];
      let parts = line.split('**');
      
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
          formattedLine.push(<strong key={i} className="text-[#FCD901] font-bold">{parts[i]}</strong>);
        } else {
          formattedLine.push(parts[i]);
        }
      }

      return (
        <span key={blockIdx} className="block min-h-[1em] mb-1">
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Editorial Title */}
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl mb-1 text-gray-900 tracking-wide flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-[#FCD901]" /> Consultoría Cognitiva
        </h1>
        <p className="text-sm text-gray-500">
          Asistencia corporativa impulsada por IA. Audite el rendimiento operativo y redacte copys con el contexto real de sus ventas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar: Presets and Prompts */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-200 rounded-sm p-4 space-y-3">
            <h3 className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" /> Consultas Rápidas
            </h3>
            
            <p className="text-[10px] text-gray-500 font-mono">Preguntas preconfiguradas con inyección relacional de tu ERP para darte respuestas exactas en segundos:</p>

            <div className="space-y-2">
              {presets.map((p, i) => {
                const Icon = p.icon;
                return (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(p.prompt)}
                    disabled={isLoading}
                    className="w-full text-left p-3 rounded-lg bg-[#FDFDFD] border border-gray-200 hover:border-[#FCD901]/20 transition-all text-xs font-mono strings-light hover:text-gray-900 block space-y-1 group"
                  >
                    <span className="text-[#FCD901] font-bold flex items-center gap-1 text-[11px] group-hover:underline">
                      <Icon className="w-3.5 h-3.5" /> {p.label}
                    </span>
                    <span className="text-[10px] text-gray-500 line-clamp-2 leading-snug">{p.prompt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Conversation Canvas */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-sm flex flex-col h-[65vh] overflow-hidden">
          
          {/* Conversation list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isAssistant 
                      ? "bg-[#FCD901]/10 border-[#FCD901]/20 text-[#FCD901]" 
                      : "bg-gray-200 border-gray-300 text-gray-900"
                  }`}>
                    {isAssistant ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  {/* Speech bubble */}
                  <div className={`p-4 rounded-xl text-xs font-mono leading-relaxed shadow-md ${
                    isAssistant 
                      ? "bg-white text-gray-700 border border-[#232323]" 
                      : "bg-[#FCD901] text-[#0A0A0A] font-semibold"
                  }`}>
                    <div className="whitespace-pre-line">{formatText(m.content)}</div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-2 items-center text-xs font-mono text-[#FCD901] animate-pulse">
                <Sparkles className="w-4 h-4 text-[#FCD901] animate-spin" />
                <span>KICKS está compilando tu información...</span>
              </div>
            )}
          </div>

          {/* Form Action Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="p-4 border-t border-gray-200 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              required
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escriba aquí su consulta ejecutiva para el Asistente KICKS..."
              className="flex-1 bg-white text-gray-900 px-4 py-2.5 rounded-lg border border-gray-200 text-xs font-mono focus:outline-none focus:border-[#FCD901]/20"
            />
            
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#FCD901] hover:bg-[#C5A059] text-[#0A0A0A] font-bold p-2.5 rounded-lg hover:shadow-lg transition-all shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
