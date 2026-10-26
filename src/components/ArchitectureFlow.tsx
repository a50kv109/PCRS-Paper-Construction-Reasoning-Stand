import React, { useState } from 'react';
import { 
  Cpu, 
  Bot, 
  ShieldCheck, 
  FlaskConical, 
  ArrowRight, 
  Layers, 
  FileCode, 
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 1,
      title: '1. АГЕНТ ПРЕДЛАГАЕТ',
      subtitle: 'Agent Proposes',
      icon: Bot,
      color: 'sky',
      role: 'Формулирует геометрическую гипотезу или последовательность операций складывания.',
      rule: 'AI-агент НЕ является источником геометрической истины. Любые его выводы о площадях или касаниях считаются лишь гипотезами со статусом PROPOSED.',
      outputs: ['Параметры сгиба: линия L, направление', 'Предполагаемый класс контакта'],
    },
    {
      id: 2,
      title: '2. ЯДРО ВЫЧИСЛЯЕТ',
      subtitle: 'Core Computes',
      icon: Cpu,
      color: 'amber',
      role: 'Детерминированное бескомпромиссное геометрическое ядро.',
      rule: 'Ядро не использует вероятностные модели. Выполняет полигональный клиппинг Сазерленда-Ходжмана, изометрическое зеркальное отражение R_L и топологическое разбиение.',
      outputs: ['Новое геометрическое состояние (State)', 'Запись в трассу (Trace Snapshot)'],
    },
    {
      id: 3,
      title: '3. ВАЛИДАТОР ПРОВЕРЯЕТ',
      subtitle: 'Validator Verifies',
      icon: ShieldCheck,
      color: 'emerald',
      role: 'Независимый изолированный аудитор уровней L0–L3.',
      rule: 'Работает независимо от вычислительного ядра. Проверяет инварианты сохранения площади, длин рёбер и сравнивает результат с аналитическим эталоном с точностью ε = 1e-7.',
      outputs: ['Verification Report', 'Статус: PASS / FAILED / DISCREPANCY'],
    },
    {
      id: 4,
      title: '4. ЭКСПЕРИМЕНТ УТОЧНЯЕТ',
      subtitle: 'Experiment Refines',
      icon: FlaskConical,
      color: 'teal',
      role: 'Каталог воспроизводимых пакетов (EXP-001, EXP-002...).',
      rule: 'Успешный частный тест не доказывает универсальность алгоритма. Эксперимент фиксирует точные границы применимости и формирует базу регрессионного тестирования.',
      outputs: ['Обновление матрицы статусов', 'Спецификация граничных случаев'],
    },
  ];

  const levels = [
    {
      level: 'L0',
      name: 'Синтаксис и Схема',
      check: 'Типы State, Trace, отсутствие NaN, корректность индексов вершин.',
      status: 'ОБЯЗАТЕЛЬНО',
    },
    {
      level: 'L1',
      name: 'Геометрические инварианты',
      check: 'Сохранение площади листа, изометрия отражения ||R_L(a)-R_L(b)|| = ||a-b||, простота полигонов.',
      status: 'ОБЯЗАТЕЛЬНО',
    },
    {
      level: 'L2',
      name: 'Аналитический эталон (Ground Truth)',
      check: 'Разница с точным символьным решением: ||Area_calc - Area_exact|| ≤ 10⁻⁷.',
      status: 'КРИТИЧЕСКИ',
    },
    {
      level: 'L3',
      name: 'Топологическая непроницаемость',
      check: 'Ацикличность графа наслоения (DAG), отсутствие парадоксальных самопересечений слоёв.',
      status: 'РАСШИРЕННО',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center gap-2 mb-1.5 font-mono text-xs text-sky-400 font-bold uppercase tracking-widest">
          <span>PCRS Core Architecture</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100">
          Архитектурная цепочка доверия и разделение сущностей
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Фундаментальный принцип: агенты предлагают гипотезы, вычислительное ядро рассчитывает детерминированную геометрию,
          независимый валидатор производит аудит по уровням L0–L3, а эксперименты уточняют границы паттерна.
        </p>
      </div>

      {/* 4-Stage Interactive Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((st) => {
          const Icon = st.icon;
          const isActive = activeStep === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setActiveStep(st.id)}
              className={`p-5 text-left border transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-800 border-sky-400 text-slate-100 shadow-xl'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-slate-950 border border-slate-800 text-sky-400`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-xs text-slate-500 font-bold">0{st.id}</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-200 mb-1">{st.title}</div>
                <div className="text-[11px] text-slate-400 font-sans">{st.subtitle}</div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-sky-400 font-mono">
                {isActive ? '● Активный узел' : 'Подробнее →'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep Dive */}
      {(() => {
        const cur = steps.find((s) => s.id === activeStep) || steps[0];
        const Icon = cur.icon;
        return (
          <div className="bg-slate-900 border border-slate-800 p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
              <Icon className="w-6 h-6 text-sky-400" />
              <div>
                <h3 className="text-base font-bold text-slate-100">{cur.title}</h3>
                <span className="text-slate-400 text-[11px]">{cur.role}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 border border-slate-800/80 space-y-2">
                <span className="text-amber-400 font-semibold uppercase text-[11px] block">
                  Обязательное системное правило:
                </span>
                <p className="text-slate-300 text-xs font-sans leading-relaxed">{cur.rule}</p>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-800/80 space-y-2">
                <span className="text-emerald-400 font-semibold uppercase text-[11px] block">
                  Выходные контракты узла:
                </span>
                <ul className="space-y-1 text-slate-300">
                  {cur.outputs.map((out, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-sky-400"></span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}

      {/* The 3 Data Entities Isolation (State, Trace, Report) */}
      <div className="bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          Разделение сущностей данных: State vs Trace vs Report
        </h3>
        <p className="text-xs text-slate-400 max-w-3xl">
          Статья 3 Устава запрещает смешивать состояние геометрии с историей операций или отчётом верификатора:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between text-sky-400 font-bold">
              <span>1. State (Состояние)</span>
              <FileCode className="w-4 h-4" />
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Мгновенный снимок геометрии на шаге k: координаты вершин, ориентированные рёбра, плоские полигоны граней и
              порядок наслоения.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between text-amber-400 font-bold">
              <span>2. Trace (Трасса)</span>
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Упорядоченная история применённых операций ⟨O₁, O₂, ..., Oₖ⟩ с параметрами каждого сгиба (нормаль, точка,
              угол, затронутые грани).
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>3. Report (Отчёт)</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-slate-300 font-sans text-xs">
              Аудиторский вердикт валидатора: метрики расхождения (|Δ| ≤ 1e-7), список нарушенных инвариантов и статус
              верификации.
            </p>
          </div>
        </div>
      </div>

      {/* Levels L0-L3 Details */}
      <div className="bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 font-mono">
          Иерархия уровней верификации (L0 ⊂ L1 ⊂ L2 ⊂ L3)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {levels.map((lvl) => (
            <div key={lvl.level} className="bg-slate-950 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold text-sm">{lvl.level}</span>
                <span className="text-[10px] text-emerald-400 border border-emerald-800 px-1 py-0.5">
                  {lvl.status}
                </span>
              </div>
              <div className="font-semibold text-slate-200">{lvl.name}</div>
              <p className="text-slate-400 text-[11px] font-sans leading-snug">{lvl.check}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
