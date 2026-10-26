# PCRS ARCHITECTURE — REUSE CANDIDATES (РЕЕСТР КАНДИДАТОВ ПОВТОРНОГО ИСПОЛЬЗОВАНИЯ)

**Документ:** `ARCHITECTURE/REUSE_CANDIDATES.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Статус:** `SPECIFIED / REVIEWED`  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  

---

## 1. Регламент реестра

Реестр фиксирует архитектурные, контрактные и алгоритмические решения, извлеченные в ходе аудита трех исходных проектов:
- `Atlas Engineering Patterns` (`atlas-engineering-patterns`)
- `3D Geometry Reasoning Stand` (`dynamic-3d-geometry-reasoning-stand`)
- `AI Geometry Skill` (`ai-geometry-skill`)

Каждая запись содержит уровни достоверности:
- **`SOURCE FACT`**: Факт непосредственно подтверждается строками исходного кода или тестом.
- **`ANALYTICAL INFERENCE`**: Вывод следует из архитектурного сопоставления.
- **`PROPOSAL`**: Предложение по адаптации для предметной области PCRS.

---

## 2. Каталог кандидатов на повторное использование

### КАНДИДАТ RC-01: Контрактная парадигма «Reason Outside, Verify Inside»
- **ID:** `RC-01`
- **SOURCE_PROJECT:** `ai-geometry-skill`
- **SOURCE_PATH:** `SKILL.md` (lines 45–70), `docs/ARCHITECTURE.md` (lines 15–35)
- **SOURCE_SYMBOL_OR_SECTION:** Аксиома `REASON OUTSIDE. VERIFY INSIDE.`
- **OBSERVED_DESIGN:** AI-агент формулирует математические предположения и намерения снаружи, а ядро детерминированно выполняет примитивные построения и проверяет инварианты внутри изолированной среды с фиксированным допуском.
- **EVIDENCE:** `SOURCE FACT` — тесты `src/headless/tests/testHeadlessSkillPoC.ts` (Scenarios A–G) подтверждают успешное исполнение внешних инструкций агента без утечки контекста в ядро.
- **PCRS_TARGET_LAYER:** `Agent / Intent Layer` $\leftrightarrow$ `Deterministic Geometry Kernel`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — в PCRS агент предлагает параметры линии сгиба $L$ и направление отражения, а ядро вычисляет разбиение листа и полигоны перекрытия.
- **RISKS_AND_LIMITATIONS:** Если агент передает неоднозначный сгиб (например, прямая вне листа бумаги), ядро должно возвращать явную ошибку без галлюцинаций.
- **VALIDATION_REQUIRED:** Проверка контракта сессии `HeadlessFoldSession` на наборе тестов сгибания.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Исключает смешение вероятностных генераций языковых моделей с геометрической истиной.

---

### КАНДИДАТ RC-02: Zero-Trust верификация артефактов решений (GSA Protocol)
- **ID:** `RC-02`
- **SOURCE_PROJECT:** `ai-geometry-skill`
- **SOURCE_PATH:** `src/headless/types.ts` (lines 155–195), `src/engines/pgs/pgsReceiverVerifier.ts`
- **SOURCE_SYMBOL_OR_SECTION:** `GSASolutionArtifact`, `GSAImportReport`, принцип `PRODUCER CLAIM ≠ RECEIVER TRUTH`
- **OBSERVED_DESIGN:** Экспортируемый геометрический артефакт содержит метаданные производителя, ссылки на канонический резольвер, снимки состояния и список заверенных утверждений (`certifiedClaims`). При импорте принимающая сторона производит полную локальную проверку утверждений, отклоняя любые несоответствия (`MISMATCH`).
- **EVIDENCE:** `SOURCE FACT` — тест `testHeadlessSkillPoC.ts` (Scenario J: GSA Import + Zero Trust Local Verification). Попытка передать скомпрометированное утверждение завершается статусом `MISMATCH`.
- **PCRS_TARGET_LAYER:** `Verification Report Layer` & `Inter-Agent Exchange`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — адаптировать формат под специфику бумаги: `PaperConstructionArtifact` с инвариантами площади, сохранением изометрии и топологией слоев.
- **RISKS_AND_LIMITATIONS:** Вычислительные накладные расходы при повторной проверке больших последовательностей сгибов.
- **VALIDATION_REQUIRED:** Тест на отбраковку ложных отчетов о площади перекрытия.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Гарантирует независимость верификации при передаче результатов между разными AI-агентами (например, Gemini $\to$ ChatGPT).

---

### КАНДИДАТ RC-03: Семантическая изоляция отказа `CAPABILITY_GAP`
- **ID:** `RC-03`
- **SOURCE_PROJECT:** `ai-geometry-skill`
- **SOURCE_PATH:** `SKILL.md` (Section 2, Rule 4), `src/headless/types.ts` (`HeadlessErrorCode`)
- **SOURCE_SYMBOL_OR_SECTION:** Ошибка `CAPABILITY_GAP ≠ FALSE`
- **OBSERVED_DESIGN:** Если операция математически корректна в геометрии, но выходит за рамки возможностей текущего ядра (например, угол общего вида без аналитического решения или 3D-кинематика), ядро возвращает явный код `CAPABILITY_GAP`, а не ложный статус `false`.
- **EVIDENCE:** `SOURCE FACT` — `src/headless/HeadlessGeometrySession.ts`, контракт ошибок `HeadlessErrorCode`.
- **PCRS_TARGET_LAYER:** `Deterministic Geometry Kernel` & `Validator`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — применить в PCRS при запросе неподдерживаемых конструкций (бумага ненулевой толщины, искривленные сгибы, неголономные 3D-складывания).
- **RISKS_AND_LIMITATIONS:** Риск сокрытия программных багов под видом «пробела в возможностях». Требуется строгий список известных ограничений.
- **VALIDATION_REQUIRED:** Тест на распознавание вырожденных сгибов и неподдерживаемых топологий.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`
- **DECISION_RATIONALE:** Защищает внешних AI-агентов от ложных отрицательных выводов о геометрии.

---

### КАНДИДАТ RC-04: Трехуровневая изоляция состояния геометрии, представления и рендера
- **ID:** `RC-04`
- **SOURCE_PROJECT:** `3D-Geometry-Reasoning-Stand`
- **SOURCE_PATH:** `docs/ARCHITECTURE.md` (Section 2), `src/core/types.ts` (lines 40–90)
- **SOURCE_SYMBOL_OR_SECTION:** Разделение `CanonicalGeometryState`, `RepresentationState`, `VisualizationState`
- **OBSERVED_DESIGN:** Каноническое геометрическое состояние содержит строго исходные координаты в декартовом пространстве и является глубоко замороженным (`Object.freeze`). Производные представления (сферические углы, развертки) вычисляются по требованию. Состояние визуализации (камера, зум, цвет) изолировано и не имеет математической силы.
- **EVIDENCE:** `SOURCE FACT` — тест `src/tests/m1_canonical_state.test.ts` (T14, T17): изменение параметров камеры или попытка внешней мутации не изменяют каноническое состояние и не меняют сигнатуру.
- **PCRS_TARGET_LAYER:** `PCRS Domain Model` & `UI Layer`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — в PCRS `CanonicalGeometryState` хранит 2D-координаты вершин граней листа, `RepresentationState` хранит видимый силуэт и развертку, а `VisualizationState` управляет холстом SVG/WebGL.
- **RISKS_AND_LIMITATIONS:** Необходимость детерминированного клонирования при операциях сгиба.
- **VALIDATION_REQUIRED:** Тест на неизменность исходных координат листа при изменении зума или угла камеры.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Фундаментально предотвращает загрязнение чистой геометрии экранными пикселями и параметрами рендеринга.

---

### КАНДИДАТ RC-05: Детерминированная сигнатура геометрии и нормализация чисел
- **ID:** `RC-05`
- **SOURCE_PROJECT:** `3D-Geometry-Reasoning-Stand`
- **SOURCE_PATH:** `src/core/signature.ts` (lines 15–50)
- **SOURCE_SYMBOL_OR_SECTION:** `computeGeometrySignature`, `computeGeometryHash` (FNV-1a 32-bit), `normalizeNumber`
- **OBSERVED_DESIGN:** Преобразование вещественных чисел с нормализацией `-0` в `+0` и фиксацией 10 десятичных знаков (`toFixed(10)`). Формирование канонической строки геометрии и ее хеширование алгоритмом FNV-1a.
- **EVIDENCE:** `SOURCE FACT` — тест `m1_canonical_state.test.ts` (T13, T14).
- **PCRS_TARGET_LAYER:** `State Layer` & `Trace Cache`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — адаптировать формат под полигональные грани: `POLY_V1|STATIC:[...]|MOVING:[...]|CREASE:[...]`.
- **RISKS_AND_LIMITATIONS:** Погрешности округления на границе $10^{-10}$ для чисел, полученных разными путями вычислений.
- **VALIDATION_REQUIRED:** Проверка идентичности сигнатур после эквивалентных последовательностей преобразований.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Обеспечивает мгновенное детерминированное сравнение состояний складывания и кэширование результатов верификации.

---

### КАНДИДАТ RC-06: Разделение статусов валидности входа и геометрической вырожденности
- **ID:** `RC-06`
- **SOURCE_PROJECT:** `3D-Geometry-Reasoning-Stand`
- **SOURCE_PATH:** `src/core/types.ts` (lines 95–130), `src/core/geometryState.ts`
- **SOURCE_SYMBOL_OR_SECTION:** Перечисления `InputGeometryStatus`, `RealizationStatus`, `GeometryValidationCode`
- **OBSERVED_DESIGN:** Входные данные проверяются на валидность (`VALID_INPUT`, `NON_FINITE_INPUT`). Вырожденные конфигурации (компланарность, совпадение вершин) не выбрасывают аварийное исключение, а классифицируются как статус реализации `DEGENERATE` или `VERTEX_COINCIDENT`.
- **EVIDENCE:** `SOURCE FACT` — тест `m1_canonical_state.test.ts` (T16: вырожденная компланарная геометрия принимается и классифицируется как `DEGENERATE`, не вызывая аварийного падения).
- **PCRS_TARGET_LAYER:** `Deterministic Geometry Kernel`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — в PCRS сгиб, проходящий точно по ребру или через одну вершину, не должен ломать ядро, а должен возвращать `DEGENERATE_CREASE` или `BOUNDARY_COINCIDENT`.
- **RISKS_AND_LIMITATIONS:** Необходимость аккуратного обновления графа граней при нулевой площади отсекаемой части.
- **VALIDATION_REQUIRED:** Граничные тесты сгибов по краю квадрата.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-002` (Случай 2.1)
- **DECISION_RATIONALE:** Предотвращает сбои ядра на предельных геометрических случаях.

---

### КАНДИДАТ RC-07: Модель пробелов в знаниях и потерь (Knowledge Gaps & Epistemic Loss)
- **ID:** `RC-07`
- **SOURCE_PROJECT:** `atlas-engineering-patterns`
- **SOURCE_PATH:** `src/atlas/types.ts` (`KnowledgeGap`, `LossItem`, `EpistemicProvenance`), `tests/epistemicLoss.test.ts`
- **SOURCE_SYMBOL_OR_SECTION:** `knowledgeGaps`, `lossLog`, `anti-hallucination gap detection`
- **OBSERVED_DESIGN:** Система явно логирует и выводит оператору пробелы в знаниях (`KnowledgeGap`), если требование не может быть удовлетворено доступными проверенными компонентами, блокируя генерацию ложной уверенности.
- **EVIDENCE:** `SOURCE FACT` — тест `tests/audit.test.ts` (Раздел 3: Anti-hallucination check: missing capability correctly flagged as explicit Knowledge Gap).
- **PCRS_TARGET_LAYER:** `Governance & Knowledge Layer`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — связать с реестром нерешенных вопросов (UQ) в PCRS: если случай не имеет аналитического эталона, формировать `KnowledgeGap`.
- **RISKS_AND_LIMITATIONS:** Минимальные (чисто информационный контракт).
- **VALIDATION_REQUIRED:** Проверка генерации отчетов верификации при `UNVERIFIED` статусе.
- **RELATED_EXPERIMENTS:** Все пакеты EXP.
- **DECISION_RATIONALE:** Обеспечивает научную честность системы в соответствии со статьей 5 Устава проекта.

---

### КАНДИДАТ RC-08: Модель жизненного цикла нормативных свидетельств (NHFG Stage C)
- **ID:** `RC-08`
- **SOURCE_PROJECT:** `atlas-engineering-patterns`
- **SOURCE_PATH:** `docs/NHFG_DATA_MODEL.md`, `src/atlas/types.ts` (строки 190–260)
- **SOURCE_SYMBOL_OR_SECTION:** `EpistemicCategory`, `SourceRecord`, `PatternMapping`, `VerificationRecord`
- **OBSERVED_DESIGN:** Связывание инженерных решений с нормативными стандартами через 5 эпистемических категорий (`SOURCE_CONFIRMED`, `ENGINEERING_INTERPRETATION`, `DESIGN_HYPOTHESIS`, `VERIFIED_RESULT`, `UNVERIFIED_OR_UNKNOWN`).
- **EVIDENCE:** `SOURCE FACT` — тест `tests/nhfg.test.ts`.
- **PCRS_TARGET_LAYER:** `Theory Foundations` & `Charter Governance`
- **REUSE_STATUS:** `ACCEPTED`
- **ADAPTATION_REQUIRED:** `PROPOSAL` — интеграция со шкалой статусов PCRS (`PROPOSED`, `SPECIFIED`, `DERIVED`, `EXPERIMENT_VERIFIED`, `FAILED`, `UNSUPPORTED_INPUT`, `UNVERIFIED`).
- **RISKS_AND_LIMITATIONS:** Избыточная детализация для простых математических задач на этапе Gate 0.
- **VALIDATION_REQUIRED:** Синхронизация с `PROJECT_CHARTER.md`.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Обеспечивает объективную доказательную базу для каждого теоретического утверждения.

---

### КАНДИДАТ RC-09: Использование полярных координат окружности как модели геометрии листа
- **ID:** `RC-09`
- **SOURCE_PROJECT:** `ai-geometry-skill` & `3D-Geometry-Reasoning-Stand`
- **SOURCE_PATH:** `docs/CANONICAL_GEOMETRY_COORDINATES_AND_INVARIANTS.md`, `src/core/representation.ts`
- **SOURCE_SYMBOL_OR_SECTION:** Полярная параметризация $(\theta, R)$ и сферическая $(\phi, \lambda)$
- **OBSERVED_DESIGN:** Представление вершин через угловое смещение относительно окружности или сферы.
- **EVIDENCE:** `SOURCE FACT` — оба проекта используют замкнутые круглые базисы.
- **PCRS_TARGET_LAYER:** `PCRS Domain Model`
- **REUSE_STATUS:** `REJECTED`
- **ADAPTATION_REQUIRED:** Неприменимо.
- **RISKS_AND_LIMITATIONS:** Бумага является кусочно-плоским многообразием с прямолинейными границами и сгибами. Параметризация окружности создает искусственные сингулярности и искажает длины хорд.
- **VALIDATION_REQUIRED:** Не требуется.
- **RELATED_EXPERIMENTS:** Нет.
- **DECISION_RATIONALE:** Модель листа PCRS базируется на декартовых координатах $\mathbb{R}^2$ и полигонах контуров.

---

### КАНДИДАТ RC-10: Локальный допуск $\epsilon = 10^{-4}$ для классификации геометрических отношений
- **ID:** `RC-10`
- **SOURCE_PROJECT:** `ai-geometry-skill`
- **SOURCE_PATH:** `src/headless/types.ts` (`threshold: 1e-4`), `src/components/CanvasStage.tsx`
- **SOURCE_SYMBOL_OR_SECTION:** Порог точности проверки `1e-4`
- **OBSERVED_DESIGN:** Проверка перпендикулярности, совпадения точек и касания с фиксированным порогом $10^{-4}$.
- **EVIDENCE:** `SOURCE FACT` — `testHeadlessSkillPoC.ts` (C.2: Strict receiver-owned threshold 1e-4 enforced).
- **PCRS_TARGET_LAYER:** `Verification Protocol`
- **REUSE_STATUS:** `REJECTED`
- **ADAPTATION_REQUIRED:** Замена на размерно-согласованный стандарт PCRS $\epsilon = 10^{-7}$.
- **RISKS_AND_LIMITATIONS:** При сгибании бумаги погрешность $10^{-4}$ на единичном квадрате приводит к ложному объединению вершин, находящихся на расстоянии $0.0001$, что искажает вычисление площадей микроперекрытий (например, при острых углах сгиба).
- **VALIDATION_REQUIRED:** Сравнительный численный анализ устойчивости на EXP-001/002.
- **RELATED_EXPERIMENTS:** `PCRS-EXP-001`, `PCRS-EXP-002`
- **DECISION_RATIONALE:** Стандартом PCRS утвержден допуск $\epsilon = 10^{-7}$ (Gate 0).
