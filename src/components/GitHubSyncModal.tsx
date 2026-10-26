import React, { useState } from 'react';
import { PCRSDocument } from '../types/pcrs';
import { 
  GitBranch, 
  Copy, 
  Check, 
  Terminal, 
  FolderTree, 
  CheckCircle2,
  FileText
} from 'lucide-react';

interface Props {
  documents: PCRSDocument[];
}

export const GitHubSyncModal: React.FC<Props> = ({ documents }) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);

  // Generate automated bash script to replicate exact directory tree and files
  const bashScript = `#!/usr/bin/env bash
# PCRS Theory Lab — GitHub Sync Script
# Target Repository: pcrs-theory

set -e

echo "=== Initializing pcrs-theory repository structure ==="
mkdir -p THEORY ARCHITECTURE EXPERIMENTS/PCRS-EXP-001 EXPERIMENTS/PCRS-EXP-002 DECISIONS

${documents
  .map(
    (d) => `cat << 'EOF' > ${d.path}
${d.content}
EOF
echo "Created ${d.path}"`
  )
  .join('\n\n')}

echo "=== All 10 files successfully generated for GitHub ==="
git status
`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(bashScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleCopySingle = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFileId(id);
    setTimeout(() => setCopiedFileId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 font-bold uppercase tracking-widest">
            <GitBranch className="w-4 h-4" />
            <span>GitHub Synchronization Center</span>
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Перенос материалов в репозиторий GitHub (`pcrs-theory`)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Все 10 утверждённых документов структурированы и готовы для первого коммита в постоянное хранилище.
          </p>
        </div>

        <button
          onClick={handleCopyScript}
          className="px-4 py-2 border border-sky-500 bg-sky-950/80 hover:bg-sky-900 text-sky-300 font-mono text-xs flex items-center gap-2 transition-all self-start md:self-center"
        >
          {copiedScript ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Скрипт скопирован!</span>
            </>
          ) : (
            <>
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Скопировать Bash-скрипт генерации</span>
            </>
          )}
        </button>
      </div>

      {/* GitHub Workflow Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 p-4 space-y-2">
          <span className="text-sky-400 font-bold">Шаг 1: Создать репозиторий</span>
          <p className="text-slate-300 font-sans text-xs">
            Создайте на GitHub публичный или приватный репозиторий с названием:
          </p>
          <div className="bg-slate-950 p-2 border border-slate-800 text-sky-300 font-bold">
            pcrs-theory
          </div>
          <p className="text-slate-500 text-[11px]">
            Описание: Теоретическая и экспериментальная основа PCRS — Paper Construction Reasoning Stand.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 space-y-2">
          <span className="text-amber-400 font-bold">Шаг 2: Выполнить скрипт в терминале</span>
          <p className="text-slate-300 font-sans text-xs">
            Клонируйте пустой репозиторий, вставьте скопированный скрипт в bash и запустите:
          </p>
          <pre className="bg-slate-950 p-2 border border-slate-800 text-emerald-400 text-[11px]">
            bash setup-pcrs-theory.sh
          </pre>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 space-y-2">
          <span className="text-emerald-400 font-bold">Шаг 3: Первый коммит</span>
          <p className="text-slate-300 font-sans text-xs">
            Зафиксируйте Gate 0 в истории Git:
          </p>
          <pre className="bg-slate-950 p-2 border border-slate-800 text-slate-300 text-[11px]">
git add .
git commit -m "feat: init Gate 0 PCRS Theory Lab"
git push origin main
          </pre>
        </div>
      </div>

      {/* Document Package Checklist */}
      <div className="bg-slate-900 border border-slate-800 p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-sky-400" />
            <span className="font-bold text-slate-200">
              Пакет утверждённых файлов для экспорта ({documents.length} файлов)
            </span>
          </div>
          <span className="text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Готовность
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-200 font-semibold">{doc.path}</span>
                  <span className="text-slate-500 text-[11px] block sm:inline sm:ml-2">
                    — {doc.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 border border-slate-700 bg-slate-950 text-slate-300">
                  {doc.status}
                </span>
                <button
                  onClick={() => handleCopySingle(doc.id, doc.content)}
                  className="px-2 py-1 border border-slate-700 hover:border-slate-500 bg-slate-800 text-slate-300 text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedFileId === doc.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
