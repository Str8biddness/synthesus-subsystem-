import React, { useState, useEffect, useRef } from "react";
import "./Hyperspace.css";
import { Zap, Rocket, Globe, BrainCircuit } from "lucide-react";
import TelemetryVisualizer from "@/components/TelemetryVisualizer";
import LLMBrainVisualizer from "@/components/LLMBrainVisualizer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  source?: string;
}

export default function HyperspaceOS() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "✨ Greetings, cosmic traveler! I am the Hybrid Synthetic General Intelligence, integrating multi-agent consciousness. The Sovereign Hyperspace Desktop is now online.",
      source: "synthetic_core"
    }
  ]);
  const [input, setInput] = useState("");
  const [isWarping, setIsWarping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  // PPBRS Telemetry state
  const [entropy, setEntropy] = useState<number>(0);
  const [topPatterns, setTopPatterns] = useState<{id: string, prob: number}[]>([]);

  useEffect(() => {
    // Connect to IPC Server
    ws.current = new WebSocket("ws://localhost:5010/ws");
    
    ws.current.onopen = () => {
      setMessages(prev => [...prev, {
        id: `system-init-${Date.now()}`,
        role: "assistant",
        content: "✨ Hyperspace Link Established. PPBRS Engine Online.",
        source: "system"
      }]);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "message") {
        const validatedRole = data.role === "user" || data.role === "assistant" ? data.role : "assistant";
        const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setMessages(prev => [...prev, {
          id: messageId,
          role: validatedRole,
          content: data.content,
          source: data.source
        }]);
      } else if (data.type === "trace") {
        setEntropy(data.entropy);
        if (data.top_patterns && data.top_probs) {
           const patterns = data.top_patterns.map((p: string, i: number) => ({
             id: p,
             prob: data.top_probs[i]
           }));
           setTopPatterns(patterns);
        }
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !ws.current) return;

    // Trigger Warp Flash
    setIsWarping(true);
    setTimeout(() => setIsWarping(false), 500);

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newMsg: Message = { id: messageId, role: "user", content: input };
    setMessages(prev => [...prev, newMsg]);
    
    // Send to PPBRS via WebSocket
    ws.current.send(JSON.stringify({ text: input }));
    setInput("");
  };

  return (
    <div className="hyperspace-wrapper">
      {/* Hyperspace Background System */}
      <div className="hyperspace-bg">
        <div className="starfield"></div>
        <div className="warp-stars"></div>
        <div className="chemical-asteroids"></div>
        <div className="animated-planets">
          <div className="planet planet-1"></div>
          <div className="planet planet-2"></div>
          <div className="planet planet-3"></div>
        </div>
        {isWarping && <div className="warp-flash"></div>}
      </div>

      {/* Sovereign Desktop UI */}
      <div className="app-container">
        
        {/* Header */}
        <header className="top-header glass-panel">
          <div className="brand">
            <Globe className="logo-mark" />
            <div className="brand-text">
              <h1>SYNTHESUS <span className="version">AIVM Grid</span></h1>
              <p>Sovereign Conscious Operating System</p>
            </div>
          </div>
          
          <div className="system-stats">
            <div className="stat-box">
              <span className="stat-label">WORKING MEMORY</span>
              <span className="stat-value">7/7</span>
            </div>
            <div className="stat-box">
              <span className="stat-label">EPISODIC TRACES</span>
              <span className="stat-value">1,402</span>
            </div>
            <div className="health-status">
              <div className="pulse-ring"><div className="pulse-dot online"></div></div>
              <span className="status-text">NEURAL LINK ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Main Interface Layout */}
        <main className="main-layout">
          
          {/* Left Panel: Brain Graph & Modules */}
          <aside className="left-panel glass-panel flex-col gap-4 p-4">
             <div className="panel-header">
                <h2><BrainCircuit className="w-4 h-4" /> Probabilistic Engine</h2>
             </div>
             
             <div className="flex-1 flex flex-col gap-4 border border-white/5 rounded-lg bg-black/20 p-4 overflow-y-auto">
                <TelemetryVisualizer entropy={entropy} topPatterns={topPatterns} />
             </div>
          </aside>

          {/* Center Panel: Hyper-Chat */}
          <section className="center-panel glass-panel">
            <div className="chat-header">
               <Zap className="w-8 h-8 text-orange-400 drop-shadow-[0_0_8px_rgba(255,140,0,0.6)]" />
               <div>
                 <h2 className="text-orange-400 font-bold tracking-widest text-lg">HYPER-CHAT</h2>
                 <p className="text-xs text-slate-400">Secure IPC WebSocket Channel</p>
               </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.role}`}>
                  <div className="msg-content">{msg.content}</div>
                  {msg.source && (
                    <div className="msg-meta mt-1 text-right">
                       <span className={`badge ${msg.source}`}>{msg.source.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={endOfMessagesRef} />
            </div>

            <div className="chat-input-area">
              <div className="input-wrapper">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Transmit neural pattern..." 
                  className="bg-transparent text-white w-full outline-none px-2"
                />
                <button onClick={handleSend} className="btn-primary flex items-center gap-2">
                  <Rocket className="w-4 h-4" /> WARP
                </button>
              </div>
            </div>
          </section>

          {/* Right Panel: Engines */}
          <aside className="right-panel glass-panel p-4 flex flex-col">
             <div className="panel-header mb-4">
                <h2><Zap className="w-4 h-4" /> Multi-LLM Brain (ONNX)</h2>
                <span className="live-badge">LIVE</span>
             </div>
             <div className="flex-1 overflow-hidden">
               <LLMBrainVisualizer />
             </div>
          </aside>

        </main>
      </div>
    </div>
  );
}
