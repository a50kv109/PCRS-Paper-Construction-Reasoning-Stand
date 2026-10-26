import React, { useState } from 'react';
import { PCRSDocument, KnowledgeStatus } from '../types/pcrs';
import { 
  FileText, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronRight, 
  Folder, 
  FolderOpen,
  Code2,
  BookOpen,
  Download
} from 'lucide-react';

interface Props {
  documents: PCRSDocument[];
  selectedDocId: string;
  onSelectDoc: (id: string) => void;
}

const STATUS_COLORS: Record<KnowledgeStatus, { text: string; bg: string; border: string }> = {
  PROPOSED: { text: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-700/50' },
  SPECIFIED: { text: 'text-sky-400', bg: 'bg-sky-950/40', border: 'border-sky-700/50' },
  DERIVED: { text: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-700/50' },
  EXPERIMENT_VERIFIED: { text: 'text-teal-300', bg: 'bg-teal-950/40', border: 'border-teal-700/50' },
  FAILED: { text: 'text-rose-400', bg: 'bg-rose-950/40', border: 'border-rose-700/50' },
  UNSUPPORTED_INPUT: { text: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-700/50' },
  UNVERIFIED: { text: 'text-slate-400', bg: 'bg-slate-900', border: 'border-slate-700' },
  REVIEWED: { text: 'text-indigo-300', bg: 'bg-indigo-950/40', border: 'border-indigo-700/50' },
  AUDITED: { text: 'text-cyan-300', bg: 'bg-cyan-950/40', border: 'border-cyan-700/50' },
  CANDIDATE: { text: 'text-yellow-300', bg: 'bg-yellow-950/40', border: 'border-yellow-700/50' },
  ACCEPTED: { text: 'text-emerald-300', bg: 'bg-emerald-950/40', border: 'border-emerald-600/50' },
  REJECTED: { text: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-700/50' },
};

export const RepositoryExplorer: React.FC<Props> = ({
  documents,
  selectedDocId,
  onSelectDoc,
}) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const handleCopyMarkdown = () => {
    if (!selectedDoc) return;
    navigator.clipboard.writeText(selectedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedDoc) return;
    const blob = new Blob([selectedDoc.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedDoc.path.split('/').pop() || 'document.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories = [
    { key: 'ALL', label: `Все файлы (${documents.length})` },
    { key: 'ROOT', label: 'Корень (Root)' },
    { key: 'THEORY', label: 'Теория (THEORY/)' },
    { key: 'ARCHITECTURE', label: 'Архитектура (ARCHITECTURE/)' },
    { key: 'EXPERIMENTS', label: 'Эксперименты (EXP/)' },
    { key: 'DECISIONS', label: 'Решения (ADR/)' },
  ];

  const filteredDocs = activeCategory === 'ALL' 
    ? documents 
    : documents.filter((d) => d.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[750px]">
      {/* File Tree / Navigation Sidebar */}
      <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-none p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-sky-400" />
              <span className="font-mono text-xs uppercase tracking-wider text-slate-300">
                Репозиторий pcrs-theory
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">v0.1.0 Gate 0</span>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-1 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-2 py-1 text-[11px] font-mono transition-colors text-left ${
                  activeCategory === cat.key
                    ? 'text-sky-300 bg-sky-950/60 border-b border-sky-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Document List */}
          <div className="space-y-1 overflow-y-auto max-h-[580px] pr-1 font-mono text-xs">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDoc.id;
              const statusCfg = STATUS_COLORS[doc.status];
              return (
                <button
                  key={doc.id}
                  onClick={() => onSelectDoc(doc.id)}
                  className={`w-full text-left p-2.5 transition-all flex flex-col gap-1 border-l-2 ${
                    isSelected
                      ? 'bg-slate-800/90 border-sky-400 text-slate-100 shadow-inner'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate font-medium text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {doc.path}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-mono px-1 py-0.5 border ${statusCfg.text} ${statusCfg.bg} ${statusCfg.border}`}
                    >
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">{doc.title.split('(')[0]}</span>
                    {doc.unresolvedQuestions.length > 0 && (
                      <span className="text-amber-400/90 text-[10px] flex items-center gap-1 shrink-0">
                        <HelpCircle className="w-3 h-3" />
                        {doc.unresolvedQuestions.length} UQ
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Repository State Footer */}
        <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
          <span>{documents.length} файлов | Gate 0</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Синхронизировано
          </span>
        </div>
      </div>

      {/* Document Content Viewer */}
      <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-none p-6 flex flex-col">
        {/* Document Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-sky-400 font-semibold uppercase tracking-wide">
                {selectedDoc.path}
              </span>
              <span
                className={`text-[11px] font-mono px-1.5 py-0.5 border uppercase ${
                  STATUS_COLORS[selectedDoc.status].text
                } ${STATUS_COLORS[selectedDoc.status].bg} ${
                  STATUS_COLORS[selectedDoc.status].border
                }`}
              >
                {selectedDoc.status}
              </span>
              <span className="text-xs font-mono text-slate-500">v{selectedDoc.version}</span>
            </div>
            <h2 className="text-lg font-semibold text-slate-100">{selectedDoc.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex border border-slate-700 bg-slate-950 p-0.5 font-mono text-xs">
              <button
                onClick={() => setViewMode('rendered')}
                className={`px-3 py-1 flex items-center gap-1.5 ${
                  viewMode === 'rendered'
                    ? 'bg-slate-800 text-sky-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Текст
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1 flex items-center gap-1.5 ${
                  viewMode === 'raw'
                    ? 'bg-slate-800 text-sky-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Markdown
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Скопировать для переноса в GitHub"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Копировать .md</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-1.5 border border-slate-700 hover:border-slate-600 bg-slate-800 text-slate-300 hover:text-slate-100 transition-colors"
              title="Скачать файл"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Summary Box */}
        <div className="bg-slate-950/60 border-l-2 border-sky-500/80 p-3 mb-6 font-mono text-xs text-slate-300">
          <span className="text-sky-400 font-semibold block mb-1 uppercase tracking-wider text-[10px]">
            Назначение документа:
          </span>
          {selectedDoc.summary}
        </div>

        {/* Content Display */}
        <div className="flex-1 overflow-y-auto max-h-[620px] pr-2">
          {viewMode === 'raw' ? (
            <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 border border-slate-800 whitespace-pre-wrap leading-relaxed select-all">
              {selectedDoc.content}
            </pre>
          ) : (
            <div className="space-y-4 text-slate-200 text-sm leading-relaxed font-sans">
              {/* Render formatted blocks */}
              {selectedDoc.content.split('\n\n').map((paragraph, idx) => {
                const trimmed = paragraph.trim();

                if (trimmed.startsWith('# ')) {
                  return (
                    <h1
                      key={idx}
                      className="text-xl font-bold text-slate-100 pt-2 pb-1 border-b border-slate-800"
                    >
                      {trimmed.replace('# ', '')}
                    </h1>
                  );
                }
                if (trimmed.startsWith('## ')) {
                  return (
                    <h2
                      key={idx}
                      className="text-base font-semibold text-sky-300 pt-3 pb-1 border-b border-slate-800/60 flex items-center gap-2"
                    >
                      <ChevronRight className="w-4 h-4 text-sky-400 shrink-0" />
                      {trimmed.replace('## ', '')}
                    </h2>
                  );
                }
                if (trimmed.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-sm font-semibold text-slate-200 pt-2">
                      {trimmed.replace('### ', '')}
                    </h3>
                  );
                }
                if (trimmed.startsWith('```')) {
                  const code = trimmed.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '');
                  return (
                    <pre
                      key={idx}
                      className="bg-slate-950 border border-slate-800 p-3 font-mono text-xs text-emerald-300 overflow-x-auto my-3 leading-snug"
                    >
                      {code}
                    </pre>
                  );
                }
                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote
                      key={idx}
                      className="border-l-2 border-amber-500/80 bg-slate-950/40 p-3 font-mono text-xs text-amber-200/90 my-2"
                    >
                      {trimmed.replace(/^> /gm, '')}
                    </blockquote>
                  );
                }
                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                  const items = trimmed.split('\n');
                  return (
                    <ul key={idx} className="space-y-1.5 list-disc list-inside text-xs text-slate-300 pl-1">
                      {items.map((it, iIdx) => (
                        <li key={iIdx} className="leading-normal">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: it
                                .replace(/^[-*]\s+/, '')
                                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                                .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-sky-300 px-1 py-0.5 font-mono text-[11px]">$1</code>'),
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  );
                }

                return (
                  <p
                    key={idx}
                    className="text-xs text-slate-300 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: trimmed
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-slate-800 text-sky-300 px-1 py-0.5 font-mono text-[11px]">$1</code>'),
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Unresolved Questions Section for this Document */}
        {selectedDoc.unresolvedQuestions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-950/80 p-4 border border-amber-900/40">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-semibold text-amber-300 font-mono uppercase tracking-wider">
                Открытые нерешённые вопросы документа ({selectedDoc.unresolvedQuestions.length})
              </h4>
            </div>
            <div className="space-y-3 font-mono text-xs">
              {selectedDoc.unresolvedQuestions.map((uq) => (
                <div key={uq.id} className="p-2.5 bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold">{uq.id}</span>
                    <span
                      className={`text-[10px] px-1 py-0.5 uppercase ${
                        uq.status === 'RESOLVED'
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                          : 'text-amber-400 bg-amber-950/60 border border-amber-800'
                      }`}
                    >
                      {uq.status}
                    </span>
                  </div>
                  <p className="text-slate-200">{uq.question}</p>
                  {uq.proposedAnswer && (
                    <div className="text-[11px] text-slate-400 bg-slate-950 p-2 border-l border-sky-400/60 mt-1">
                      <span className="text-sky-400 font-semibold">Предложение / Решение: </span>
                      {uq.proposedAnswer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
