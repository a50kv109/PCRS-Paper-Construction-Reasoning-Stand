import React, { useState } from 'react';
import { PCRS_DOCUMENTS } from './data/documents';
import { RepositoryExplorer } from './components/RepositoryExplorer';
import { GeometricVerifier } from './components/GeometricVerifier';
import { StatusMatrix } from './components/StatusMatrix';
import { ArchitectureFlow } from './components/ArchitectureFlow';
import { GitHubSyncModal } from './components/GitHubSyncModal';
import { ExecutionHarness } from './components/ExecutionHarness';
import { 
  FolderTree, 
  Compass, 
  ShieldCheck, 
  GitBranch, 
  Cpu, 
  PlayCircle,
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'docs' | 'runner' | 'verifier' | 'governance' | 'arch' | 'github'>('runner');
  const [selectedDocId, setSelectedDocId] = useState<string>('project-charter');

  const handleOpenDocFromMatrix = (docId: string) => {
    setSelectedDocId(docId);
    setActiveTab('docs');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Engineering Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500/10 border border-sky-400 flex items-center justify-center text-sky-400 font-mono font-bold text-sm shrink-0">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-mono text-sm font-bold tracking-tight text-slate-100">
                  PCRS THEORY LAB
                </h1>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-sky-600 bg-sky-950/80 text-sky-300">
                  pcrs-theory
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 border border-emerald-500 bg-emerald-950/80 text-emerald-300 font-bold">
                  Gate 1: Closed & Frozen (18/18)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xl hidden md:block">
                Paper Construction Reasoning Stand: Формализация геометрии сгибов, контракты ядра и протоколы верификации
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 font-mono text-xs text-slate-400">
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-slate-500">Допуск:</span>
              <span className="text-emerald-400 font-semibold">ε = 10⁻⁷</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-slate-500">Тесты ядра:</span>
              <span className="text-emerald-400 font-semibold">15 / 15 PASS</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">EXP-002 Эталон:</span>
              <span className="text-amber-400 font-semibold">S = 0.125</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 font-mono text-xs">
          <button
            onClick={() => setActiveTab('runner')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'runner'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Рантайм-раннер (Gate 1: 15/15)</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'docs'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Репозиторий & Документы</span>
          </button>

          <button
            onClick={() => setActiveTab('verifier')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'verifier'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Геометрический верификатор (SVG)</span>
          </button>

          <button
            onClick={() => setActiveTab('governance')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'governance'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Матрица статусов и UQ</span>
          </button>

          <button
            onClick={() => setActiveTab('arch')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'arch'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-teal-400" />
            <span>Архитектура & Уровни L0–L3</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3.5 py-2.5 flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'github'
                ? 'border-sky-400 text-sky-300 bg-slate-800/40 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>Синхронизация с GitHub</span>
          </button>
        </div>
      </header>

      {/* Main Workbench Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'runner' && <ExecutionHarness />}

        {activeTab === 'docs' && (
          <RepositoryExplorer
            documents={PCRS_DOCUMENTS}
            selectedDocId={selectedDocId}
            onSelectDoc={setSelectedDocId}
          />
        )}

        {activeTab === 'verifier' && <GeometricVerifier />}

        {activeTab === 'governance' && (
          <StatusMatrix
            documents={PCRS_DOCUMENTS}
            onSelectDoc={handleOpenDocFromMatrix}
          />
        )}

        {activeTab === 'arch' && <ArchitectureFlow />}

        {activeTab === 'github' && <GitHubSyncModal documents={PCRS_DOCUMENTS} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PCRS — Paper Construction Reasoning Stand • Репозиторий: <code className="text-slate-400">pcrs-theory</code>
          </div>
          <div className="flex items-center gap-4">
            <span>Статусы: PROPOSED → SPECIFIED → DERIVED → EXPERIMENT_VERIFIED</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
