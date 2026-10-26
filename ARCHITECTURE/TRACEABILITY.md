# PCRS ARCHITECTURE — TRACEABILITY MATRIX (МАТРИЦА СКВОЗНОЙ ТРАССИРУЕМОСТИ)

**Документ:** `ARCHITECTURE/TRACEABILITY.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Статус:** `SPECIFIED / REVIEWED`  
**Версия:** 1.2.0  
**Дата фиксации:** 2026-10-24  

---

## 1. Назначение и структура цепочки трассируемости

Матрица трассируемости гарантирует строгое происхождение каждого принятого архитектурного решения, математической формулы и тестового сценария.

Сквозная цепочка ответственности:
$$\text{Исходный файл / Исследование} \longrightarrow \text{Извлечённый паттерн} \longrightarrow \text{Решение PCRS} \longrightarrow \text{Спецификация} \longrightarrow \text{Тестовый пакет} \longrightarrow \text{Ожидаемый результат}$$

---

## 2. Сквозная таблица трассируемости решений (TR-01 ... TR-20)

| ID | Исходный файл в репозитории-доноре / Источник | Извлечённый паттерн / Контракт | Решение PCRS (Кандидат) | Документ спецификации | Тестовый пакет | Ожидаемый результат верификации |
| :---: | :--- | :--- | :---: | :--- | :--- | :--- |
| **TR-01** | `ai-geometry-skill`: `SKILL.md`, `docs/ARCHITECTURE.md` | `REASON OUTSIDE. VERIFY INSIDE.` Разделение рассуждений и проверки. | `DC-01`, `RC-01` (Headless Session) | `ARCHITECTURE/RELATED_PROJECTS.md` | `PCRS-EXP-001`, `PCRS-EXP-002` | Агент предлагает сгиб $L$, ядро детерминированно считает $R_L$, валидатор аудирует с $\epsilon = 10^{-7}$. |
| **TR-02** | `ai-geometry-skill`: `src/headless/types.ts` | GSA Zero-Trust: локальная перепроверка артефактов (`CLAIM ≠ TRUTH`) | `DC-02`, `RC-02` (PaperSolutionArtifact) | `ARCHITECTURE/VERIFICATION_PROTOCOL.md` | `PCRS-EXP-001`, `PCRS-EXP-002` | Валидатор пересчитывает площадь перекрытия локально. Статус `MISMATCH` при $|\Delta| > \epsilon$. |
| **TR-03** | `ai-geometry-skill`: `SKILL.md` (Rule 4) | `CAPABILITY_GAP ≠ FALSE`. Типизированный отказ вместо ложного булева значения. | `DC-03`, `RC-03` | `PROJECT_CHARTER.md` (ст. 4), `FOUNDATIONS.md` | Будущий `PCRS-EXP-004` (Curved Crease) | Запрос сгиба с искривленной линией или $t > 0$ возвращает статус `UNSUPPORTED_INPUT / CAPABILITY_GAP`. |
| **TR-04** | `3D-Geometry-Stand`: `docs/ARCHITECTURE.md` | Трёхуровневая изоляция: `GeometryState` (декартов, заморожен) $\ne$ `Repr` $\ne$ `Vis` | `DC-04`, `RC-04` (State Model) | `THEORY/FOUNDATIONS.md` | `PCRS-CORE-EXP-001` | Изменение параметров рендера дает ровно 0 изменений в канонических координатах вершин листа. |
| **TR-05** | `3D-Geometry-Stand`: `src/core/signature.ts` | Детерминированная сигнатура: нормализация чисел (`toFixed(10)`, $-0 \to +0$), FNV-1a. | `DC-06`, `RC-05` (Geometry Signature) | `THEORY/VERIFICATION_PRINCIPLES.md` | `PCRS-CORE-EXP-001`, `CORE-EXP-002` | Идентичные конфигурации полигонов дают 100% совпадающий хеш. Метаданные времени не влияют на хеш. |
| **TR-06** | `3D-Geometry-Stand`: `src/core/types.ts` | Разделение валидности входа и вырожденности геометрии (`DEGENERATE`). | `DC-06`, `RC-06` | `THEORY/CORRECTNESS_LEVELS.md` | `PCRS-EXP-002` (Case 2.1) | Сгиб через одну вершину классифицируется как `VERTEX_CONTACT` без выброса исключения. |
| **TR-07** | `Atlas-Patterns`: `src/atlas/types.ts` | Модель пробелов в знаниях (`KnowledgeGap`) и регистрация эпистемических потерь. | `RC-07` (Knowledge Governance) | `PROJECT_CHARTER.md`, `EXPERIMENT_GAPS.md` | Реестр GAP-01..08 в `StatusMatrix` | Недоказанные утверждения блокируются от перехода в `EXPERIMENT_VERIFIED`. |
| **TR-08** | `Atlas-Patterns`: `docs/NHFG_DATA_MODEL.md` | 5 эпистемических категорий доказательств (`SOURCE_CONFIRMED` ... `DESIGN_HYPOTHESIS`). | `RC-08` (Evidence Model) | `PROJECT_CHARTER.md` (ст. 4), `FOUNDATIONS.md` | Контрольные значения EXP | Каждое контрольное значение имеет метку происхождения (`DERIVED`, `AUDITED`, `SOURCE_CONFIRMED`). |
| **TR-09** | PCRS EXP-002 Аудит (Случай 2.2) | Исправление эталона $S = 0.125$ и детекция смешанной геометрии (DC-07). | `DC-07` (`ContactManifold`) | `EXPERIMENTS/PCRS-EXP-002/SPECIFICATION.md` | `PCRS-EXP-002` (Case 2.2) | Треугольник с катетами $0.5 \times 0.5$ дает $\operatorname{Area} = 0.125$, класс `AREA_OVERLAP` с флагом `HINGE_EDGE`. |
| **TR-10** | Аудит Раздела 5 задания: CRIT-GAP-01 | Противоречие EXP-001: единичный сгиб ($S = 0.5$) vs смежные прямоугольники ($S = 0, 2, 1$). | Разделение на серии 001-A и 001-B | `EXPERIMENTS/PCRS-EXP-001/SPECIFICATION.md` | `PCRS-EXP-001` (Серии A и B) | Case 1.1 (до сгиба): $\operatorname{Area} = 0$ (`SEGMENT_CONTACT`). Case 1.2: $\operatorname{Area} = 2$. Case 1.3: $\operatorname{Area} = 1$. |
| **TR-11** | Инсайт по пространственному рассуждению | Три методологических принципа: Construction $\ne$ Proof, Result $\ne$ Reproducibility, Minimal Experiment First | Конституция верификации PCRS | `THEORY/VERIFICATION_PRINCIPLES.md` | `PCRS-CORE-EXP-001` | Независимая проверка инвариантов L0–L3, воспроизводимость Trace Replay, негативный контроль. |
| **TR-12** | Авторское архитектурное направление | Hodge-Inspired Consistency Core: клеточный комплекс $C_2 \to C_1 \to C_0$, тождество $B_1 B_2 = 0$, дискретный $\Delta_1$ | Исследовательское направление (не путать с классической теорией Ходжа) | `THEORY/HODGE_CORE_RESEARCH.md` | Гипотезы `HC-HYP-001` .. `HC-HYP-005` | Алгебраический аудит топологической замкнутости и поиск глобальных невязок складочной сети. |
| **TR-13** | Раздел 8 задания: Минимальный эксперимент | Rigid Fold Reflection and Independent Verification (8 обязательных тестов на прямоугольниках $1 \times 2$) | Эталонный минимальный сценарий ядра | `EXPERIMENTS/PCRS-CORE-EXP-001/SPECIFICATION.md` | `PCRS-CORE-EXP-001` (Тесты 01–08) | Доказательство базового механизма расчёта и независимого аудита до перехода к 3D оригами. |
| **TR-14** | Инсайт A: Разграничение моделей отражения | Матрица отражения $R = 2uu^T - I$, вывод свойств ($R^TR=I, R^2=I, \det=-1$, изометрия, площадь) и разделение Моделей A, B, C | Семантика `FoldOperation` | `THEORY/VERIFICATION_PRINCIPLES.md` | `PCRS-CORE-EXP-001` | Разграничение 2D-проекции отпечатка (Model A), 3D-вращения (Model B) и физической траектории (Model C). |
| **TR-15** | Инсайт B: Композиция и замыкание | Последовательность $T = R_n \dots R_1$ (справа налево), поворот $2\theta$ (пересечение), сдвиг $2d$ (параллельные), некоммутативность | Анализ последовательностей сгибов | `THEORY/VERIFICATION_PRINCIPLES.md`, `EXPERIMENTS/PCRS-CORE-EXP-002` | `PCRS-CORE-EXP-002` (Тесты 01–07) | 3 уровня утверждений (`LOCAL_TRANSFORMATION_VALID`, `COMPOSITION_ALGEBRA_CORRECT`, `PHYSICAL_FOLD_SEQUENCE_ADMISSIBLE`). Цикл $T=I$. |
| **TR-16** | Инсайт C: Локальная плоская складываемость | Теорема Кавасаки ($\sum \alpha_{2i-1} = \sum \alpha_{2i} = 180^\circ$) и Теорема Маэкавы ($|M - V| = 2$) | Исследовательский модуль валидатора | `THEORY/FLAT_FOLDABILITY_CONDITIONS.md` | Тестовые сценарии секторов | Проверка четности степени, сумм секторов и баланса гор/долин. Граница: не доказывает глобальную складываемость. |
| **TR-17** | Инсайт D: Клеточный комплекс и тождество $\partial_1\partial_2=0$ | Явные матрицы $B_1$ ($4 \times 5$) и $B_2$ ($5 \times 2$), прямое умножение $B_1 B_2 = 0$, негативный тест с испорченным знаком | Детектор топологических дефектов контура | `THEORY/HODGE_CORE_RESEARCH.md` | `TOPOLOGICAL_CHAIN_CONSISTENCY` | $100\%$ детекция незамкнутых контуров и неверной ориентации обхода. Статус строго `TOPOLOGICAL_CHAIN_CONSISTENCY`. |
| **TR-18** | Инсайт E: Дискретная теория Ходжа | Операторы $d_k, \delta_k$, дискретный 1-лапласиан $\Delta_1 = B_1^T B_1 + B_2 B_2^T$ ($5 \times 5$), $\ker(\Delta_1) = \{0\}$, оценка приложений | Исследовательский диагностический модуль | `THEORY/HODGE_CORE_RESEARCH.md` | Численный расчет $\Delta_1$ | Классифицирован как `RESEARCH_MODULE / NOT_YET_JUSTIFIED` для продакшн-ядра. |
| **TR-19** | Инсайт F: Локализованный граф наслоения | Локализация порядка наслоения по связным областям перекрытия $F_i >_{\Omega_k} F_j$ | Контракт слоя Layer Stacking | `EXPERIMENTS/EXPERIMENT_GAPS.md` (GAP-07) | Тест на триаду перекрытий | Исключение ложных глобальных циклов при разобщенных перекрытиях граней. |
| **TR-20** | Инсайты G & H: Сигнатуры, сетка и Zenodo | Аудит FNV-1a (хеш $\ne$ доказательство), запрет безусловного snapping, учет контекста DOI 10.5281/zenodo.20142167 | Эпистемическая политика данных | `THEORY/VERIFICATION_PRINCIPLES.md` | Тесты на искажение сетки | Разделение 5 процедур. Zenodo зафиксирован как `POTENTIAL_METHOD_SOURCE / UNVERIFIED_CONTEXT` без импорта формул. |

---

## 3. Протокол аудита изменений трассируемости

Любое изменение в формулах или кодовых реализациях обязано обновлять соответствующую строку в матрице трассируемости.  
Запрещено вносить реализации без ссылки на `ID` кандидата или решение `DC-*`.
