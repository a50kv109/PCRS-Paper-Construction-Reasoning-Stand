import React, { useState } from 'react';
import { PCRSDocument, KnowledgeStatus, UnresolvedQuestion } from '../types/pcrs';
import { 
  ShieldCheck, 
  HelpCircle, 
  Filter, 
  ExternalLink, 
  AlertCircle,
  FileCheck,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Props {
  documents: PCRSDocument[];
  onSelectDoc: (id: string) => void;
}

const STATUS_DEFINITIONS: Record<KnowledgeStatus, { desc: string; count: number; color: string }> = {
  PROPOSED: { desc: 'Выдвинуто как идея или рабочая гипотеза', count: 2, color: 'text-amber-400 border-amber-800 bg-amber-950/40' },
  SPECIFIED: { desc: 'Имеет строгое формальное описание и контракты', count: 7, color: 'text-sky-400 border-sky-800 bg-sky-950/40' },
  DERIVED: { desc: 'Аналитически выведено символьными методами', count: 4, color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' },
  EXPERIMENT_VERIFIED: { desc: 'Воспроизведено программным запуском теста', count: 0, color: 'text-teal-400 border-teal-800 bg-teal-950/40' },
  FAILED: { desc: 'Выявлено противоречие или несоответствие эталону', count: 0, color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
  UNSUPPORTED_INPUT: { desc: 'Входные данные вне специфицированной области', count: 0, color: 'text-orange-400 border-orange-800 bg-orange-950/40' },
  UNVERIFIED: { desc: 'Зафиксировано, но ожидает процедуры проверки', count: 2, color: 'text-slate-400 border-slate-700 bg-slate-900' },
  REVIEWED: { desc: 'Архитектурный аудит источника завершён', count: 2, color: 'text-indigo-300 border-indigo-800 bg-indigo-950/40' },
  AUDITED: { desc: 'Аналитический аудит расхождений проведён', count: 1, color: 'text-cyan-300 border-cyan-800 bg-cyan-950/40' },
  CANDIDATE: { desc: 'Кандидат на перенос в ядро PCRS', count: 0, color: 'text-yellow-300 border-yellow-800 bg-yellow-950/40' },
  ACCEPTED: { desc: 'Решение принято рабочей группой PCRS', count: 0, color: 'text-emerald-300 border-emerald-700 bg-emerald-950/40' },
  REJECTED: { desc: 'Решение аргументированно отклонено', count: 0, color: 'text-rose-400 border-rose-800 bg-rose-950/40' },
};

export const StatusMatrix: React.FC<Props> = ({ documents, onSelectDoc }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'matrix' | 'questions'>('matrix');

  // Collect all unresolved questions
  const allQuestions: Array<{ docId: string; docTitle: string; docPath: string; q: UnresolvedQuestion }> = [];
  documents.forEach((d) => {
    d.unresolvedQuestions.forEach((q) => {
      allQuestions.push({ docId: d.id, docTitle: d.title, docPath: d.path, q });
    });
  });

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-bold">
              PCRS Governance Matrix
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Матрица статусов знаний и реестр нерешённых вопросов
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Строгая типизация всех утверждений в соответствии со статьёй 4 Устава проекта (PROJECT_CHARTER.md). 
            Запрет некритического признания гипотез за проверенные факты.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex border border-slate-700 bg-slate-950 p-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 flex items-center gap-1.5 ${
              activeTab === 'matrix' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Матрица статусов ({documents.length} файлов)
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 flex items-center gap-1.5 ${
              activeTab === 'questions' ? 'bg-slate-800 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Реестр UQ ({allQuestions.length} вопросов)
          </button>
        </div>
      </div>

      {/* Status Definitions Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 font-mono text-xs">
        {(Object.entries(STATUS_DEFINITIONS) as [KnowledgeStatus, typeof STATUS_DEFINITIONS[KnowledgeStatus]][]).map(
          ([statusKey, def]) => {
            const isFilterActive = selectedFilter === statusKey;
            return (
              <button
                key={statusKey}
                onClick={() => setSelectedFilter(selectedFilter === statusKey ? 'ALL' : statusKey)}
                className={`p-3 text-left border transition-all flex flex-col justify-between ${
                  isFilterActive ? 'ring-1 ring-sky-400' : ''
                } ${def.color}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] uppercase">{statusKey}</span>
                  </div>
                  <p className="text-[10px] text-slate-300/80 line-clamp-2 leading-snug">{def.desc}</p>
                </div>
              </button>
            );
          }
        )}
      </div>

      {activeTab === 'matrix' ? (
        /* Status Matrix Table */
        <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] uppercase">
                <th className="p-3.5 font-medium">Файл / Модуль</th>
                <th className="p-3.5 font-medium">Категория</th>
                <th className="p-3.5 font-medium">Текущий статус</th>
                <th className="p-3.5 font-medium">Уровень верификации</th>
                <th className="p-3.5 font-medium">Открытые вопросы</th>
                <th className="p-3.5 font-medium text-right">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {documents
                .filter((d) => selectedFilter === 'ALL' || d.status === selectedFilter)
                .map((doc) => {
                  const statusCfg = STATUS_DEFINITIONS[doc.status];
                  return (
                    <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-100 flex items-center gap-2">
                          <span>{doc.path}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-sans">{doc.title}</div>
                      </td>
                      <td className="p-3.5 text-slate-400">{doc.category}</td>
                      <td className="p-3.5">
                        <span className={`inline-block px-1.5 py-0.5 border text-[10px] uppercase ${statusCfg.color}`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {doc.id.includes('exp') || doc.id === 'foundations' ? (
                          <span className="text-emerald-400 font-semibold">L2 (Ground Truth)</span>
                        ) : doc.id.includes('protocol') || doc.id.includes('levels') ? (
                          <span className="text-sky-400">L1-L3 (Spec)</span>
                        ) : (
                          <span className="text-slate-400">L0 (Doc Schema)</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {doc.unresolvedQuestions.length > 0 ? (
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            {doc.unresolvedQuestions.length} не решено
                          </span>
                        ) : (
                          <span className="text-emerald-400/80 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> 0 (Закрыто)
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onSelectDoc(doc.id)}
                          className="px-2.5 py-1 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
                        >
                          Открыть
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Unresolved Questions Tracker */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {allQuestions.map(({ docId, docTitle, docPath, q }) => (
              <div
                key={q.id}
                className="bg-slate-900 border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                    <span className="text-amber-400 font-bold text-sm">{q.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 uppercase border ${
                        q.status === 'RESOLVED'
                          ? 'text-emerald-400 border-emerald-800 bg-emerald-950/60'
                          : 'text-amber-400 border-amber-800 bg-amber-950/60'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    В документе: <span className="text-sky-400 font-semibold">{docPath}</span>
                  </div>
                  <p className="text-slate-200 text-xs font-sans leading-relaxed">{q.question}</p>
                </div>

                {q.proposedAnswer && (
                  <div className="bg-slate-950 p-3 border-l-2 border-sky-400 mt-2 text-[11px] text-slate-300">
                    <span className="text-sky-400 font-semibold block mb-0.5">Предложенный вектор решения:</span>
                    {q.proposedAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
