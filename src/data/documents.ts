import { PCRSDocument } from '../types/pcrs';

export const PCRS_DOCUMENTS: PCRSDocument[] = [
  {
    id: 'project-charter',
    path: 'PROJECT_CHARTER.md',
    title: 'Project Charter (Устав проекта PCRS)',
    category: 'ROOT',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Определяет цель, границы, базовые принципы цепочки доверия, модель жизненного цикла статусов знаний и критерии зрелости проекта.',
    unresolvedQuestions: [
      {
        id: 'UQ-PC-01',
        question: 'Каков формальный арбитраж при расхождении результатов между двумя независимыми моделями-валидаторами (например, Gemini vs ChatGPT)?',
        proposedAnswer: 'Первенство отдаётся символьному аналитическому доказательству (Symbolic Ground Truth). При отсутствии аналитического решения статус фиксируется как UNVERIFIED.',
        status: 'IN_DISCUSSION',
      },
      {
        id: 'UQ-PC-02',
        question: 'Должна ли библиотека численной геометрии основываться на точной рациональной арифметике (Exact Rational Arithmetic / BigRational) во избежание проблем epsilon, или на IEEE-754 Float64 с предикатами?',
        proposedAnswer: 'В ядре v0.1 применить Float64 со строгим порогом epsilon=1e-7. Для Gate 2 рассмотреть Exact Rational для символьных эталонов.',
        status: 'OPEN',
      },
    ],
    content: `
# PCRS THEORY LAB — PROJECT CHARTER

**Документ:** \`PROJECT_CHARTER.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** \`pcrs-theory\`  
**Статус:** \`SPECIFIED\` (Утверждённый устав исследовательской лаборатории)  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  
**Происхождение:** Согласовано рабочей группой в Google AI Studio  

---

## 1. Цель и назначение проекта

Цель **PCRS (Paper Construction Reasoning Stand)** — разработать формальную, математически строгую, проверяемую и расширяемую теоретико-инженерную основу для рассуждений автономных AI-агентов о складывании бумаги, оригами-кинематике и смежных геометрических конструкциях.

На текущем этапе проект **не начинает полномасштабную программную реализацию стенда**.  
Приоритетная задача — создать независимый от конкретных AI-моделей теоретический репозиторий:
1. Формальные определения и аксиоматика складывания.
2. Математическая модель геометрических состояний и операций.
3. Архитектурные контракты вычислительных модулей.
4. Протокол независимой многоуровневой верификации.
5. Каталог воспроизводимых экспериментальных пакетов (EXP-001, EXP-002 и последующие).

Программная реализация ядра и валидатора создаётся **только после того**, как соответствующие спецификации и аналитические эталоны будут согласованы и зафиксированы.

---

## 2. Базовый архитектурный принцип

Вся архитектура PCRS строится на цепочке разделения ответственности:

$$\\text{АГЕНТ ПРЕДЛАГАЕТ} \\longrightarrow \\text{ЯДРО ВЫЧИСЛЯЕТ} \\longrightarrow \\text{НЕЗАВИСИМЫЙ МОДУЛЬ ПРОВЕРЯЕТ} \\longrightarrow \\text{ЭКСПЕРИМЕНТ УТОЧНЯЕТ ПАТТЕРН}$$

### Принципы разделения ролей:
1. **AI-агент не является источником геометрической истины.** Предложения агента рассматриваются как гипотезы или входные команды оператора, требующие детерминированного расчёта и аудита.
2. **Вычислительное ядро детерминировано.** Ядро исполняет исключительно формально специфицированные операции на основе точной геометрии.
3. **Независимый валидатор изолирован.** Проверка результатов выполняется независимым модулем по отдельному контракту и, где возможно, сопоставляется с аналитическим эталоном (Ground Truth).
4. **Эксперимент локален по объёму применимости.** Экспериментальный пакет проверяет конкретную гипотезу в строго заявленных границах.
5. **Успешный частный тест $\\ne$ универсальная теорема.** Прохождение набора тестов подтверждает работоспособность на данном входном подмножестве, но не доказывает универсальную корректность алгоритма.

---

## 3. Обязательное разделение сущностей данных

В системе запрещено смешивать три фундаментальные сущности:

1. **State (Состояние):**
   - Мгновенное геометрическое и топологическое состояние модели на шаге $k$.
   - Включает 2D-координаты вершин граней, рёбер, локальные ориентации нормалей и относительный порядок наслоения (Layer Graph / Stacking Order).
2. **Trace (Трасса / История):**
   - Упорядоченная последовательность применённых операций $\\langle O_1, O_2, \\dots, O_k \\rangle$.
   - Содержит параметры каждой операции (линия сгиба, направляющий вектор, угол поворота, затронутые грани) и промежуточные снимки состояний.
3. **Verification Report (Отчёт верификации):**
   - Результат аудита независимым валидатором.
   - Фиксирует: статус проверки, численные расхождения с аналитическим эталоном ($\\Delta \\le \\epsilon$), список нарушенных инвариантов, категорию классификации и происхождение доказательств (provenance).

### Запрет ложных проекций:
* **Геометрическая проекция $\\ne$ физический контакт.** Пересечение 2D-проекций граней на плоскость стола само по себе не означает физического столкновения деталей (грани могут находиться на разных высотах/слоях по оси $Z$).
* **Кинематическая достижимость $\\ne$ геометрическая непроницаемость.** Складывание должно сохранять непрерывность листа и ненарушение самопересечений (non-self-intersection).

---

## 4. Жизненный цикл и статусы знаний

Каждое утверждение, формула, алгоритм и экспериментальный результат в репозитории обязаны иметь один из фиксированных статусов:
- \`PROPOSED\`: Выдвинуто как идея или рабочая гипотеза;
- \`SPECIFIED\`: Имеет строгое формальное математическое или контрактное описание;
- \`DERIVED\`: Аналитически выведено символьными/геометрическими методами;
- \`EXPERIMENT_VERIFIED\`: Подтверждено реальным воспроизводимым запуском тестового пакета;
- \`FAILED\`: Проверка или аудит выявили противоречие или ошибку;
- \`UNSUPPORTED_INPUT\`: Входные данные выходят за пределы специфицированной области применимости;
- \`UNVERIFIED\`: Утверждение зафиксировано, но процедура проверки ещё не проведена.

---

## 5. Границы проекта (Scope)

### В границах (In Scope):
- Плоские однослойные и многослойные сгибы нулевой толщины (Zero-Thickness Origami Model).
- Одиночные сгибы квадратного листа $[0,1] \\times [0,1]$.
- Детекция перекрытий 2D-полигонов проекций и классификация геометрических контактов:
  - Двумерное пересечение ненулевой площади ($Area > 0$).
  - Отрезковое касание границы ($Dim = 1, Area = 0$).
  - Точечное касание вершин ($Dim = 0, Area = 0$).
  - Отсутствие пересечения ($\\emptyset$).
- Формализация численной устойчивости и порога толерантности $\\epsilon = 10^{-7}$.
- Аналитические эталоны для тестовых пакетов (PCRS-EXP-001, PCRS-EXP-002).

### Вне границ (Out of Scope):
- Моделирование бумаги ненулевой толщины (Thick Origami), пластических деформаций и волокон.
- Неразвёртывающиеся искривлённые поверхности (Curved Crease Folding).
- Полная 3D физическая кинематика с динамикой твердых тел (Rigid-body dynamics / FEA).`,
  },
  {
    id: 'readme',
    path: 'README.md',
    title: 'README (Обзор и навигация репозитория)',
    category: 'ROOT',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Главный входной документ репозитория pcrs-theory: архитектурные принципы, дерево каталогов, текущая стадия и план развития.',
    unresolvedQuestions: [
      {
        id: 'UQ-RD-01',
        question: 'Какая стратегия версионирования экспериментальных пакетов предпочтительнее: PCRS-EXP-XXX-v1.0 с иммутабельными логами или линейная ветка в Git?',
        proposedAnswer: 'Иммутабельные каталоги версий внутри EXPERIMENTS/PCRS-EXP-XXX/.',
        status: 'OPEN',
      },
    ],
    content: `# PCRS — Paper Construction Reasoning Stand (\`pcrs-theory\`)

> **Теоретическая и экспериментальная основа PCRS (Paper Construction Reasoning Stand)**.  
> Формализация геометрии складывания бумаги, контрактов вычислительного ядра, независимой верификации и воспроизводимых экспериментов.

---

## 1. О проекте

**PCRS (Paper Construction Reasoning Stand)** — это исследовательская инженерная система, создаваемая для обеспечения математически строгих рассуждений AI-агентов о пространственных геометрических конструкциях, кинематике складывания бумаги и плоских развёрток.

Вместо того чтобы полагаться на субъективные текстовые ответы языковых моделей («галлюцинации геометрии»), PCRS вводит жёсткое детерминированное вычислительное ядро и независимый валидатор, сопоставляющий решения с аналитическими эталонами.

---

## 2. Ключевые принципы

1. **Цепочка доверия:**
   $$\\text{АГЕНТ ПРЕДЛАГАЕТ} \\longrightarrow \\text{ЯДРО ВЫЧИСЛЯЕТ} \\longrightarrow \\text{НЕЗАВИСИМЫЙ МОДУЛЬ ПРОВЕРЯЕТ} \\longrightarrow \\text{ЭКСПЕРИМЕНТ УТОЧНЯЕТ ПАТТЕРН}$$
2. **Независимость от модели:**  
   Спецификации и математические эталоны нейтральны к поставщику ИИ. Они остаются истинными для любой системы (Gemini, ChatGPT, локальный символьный решатель или человек).
3. **Строгая типизация знаний:**  
   Ни одно утверждение не считается истинным без указания статуса.
4. **Разделение State, Trace и Report:**  
   Геометрическое состояние, хронологическая трасса сгибов и вердикт аудитора никогда не сливаются в один нетипизированный объект.`,
  },
  {
    id: 'glossary',
    path: 'GLOSSARY.md',
    title: 'Glossary (Согласованный словарь терминов)',
    category: 'ROOT',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Однозначные определения листа, линии сгиба, отражения R_L, классификации контактов (2D, 1D, 0D, Disjoint) и системных сущностей.',
    unresolvedQuestions: [
      {
        id: 'UQ-GL-01',
        question: 'Разрешать ли для классификации смешанных геометрий композитный тип ContactManifold или возвращать строго доминирующую размерность?',
        proposedAnswer: 'Использовать ContactManifold с явным перечислением всех компонент разных размерностей (Area, Edge, Vertex).',
        status: 'IN_DISCUSSION',
      },
      {
        id: 'UQ-GL-02',
        question: 'Термин «Сгиб долиной / горой» (Valley / Mountain): на этапе чистой 2D-проекции без физической толщины эти понятия различаются знаком нормали или ориентацией обхода вершин?',
        proposedAnswer: 'Различаются знаком угла поворота вокруг вектора линии сгиба (+pi vs -pi).',
        status: 'OPEN',
      },
    ],
    content: `# PCRS THEORY LAB — GLOSSARY (СЛОВАРЬ ТЕРМИНОВ)

**Документ:** \`GLOSSARY.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED\`  
**Версия:** 1.0.0  
**Дата актуализации:** 2026-10-24  

---

## 1. Геометрические понятия и объекты

### 1.1. Лист бумаги (Paper Sheet, $\\mathcal{S}$)
Связное замкнутое компактное 2D-многообразие с кусочно-гладкой границей в $\\mathbb{R}^2$. В базовой модели PCRS каноническим листом является единичный квадрат:
$$\\mathcal{S}_0 = [0, 1] \\times [0, 1] \\subset \\mathbb{R}^2$$

### 1.2. Линия сгиба (Crease Line / Fold Line, $L$)
Прямая на плоскости листа $\\mathbb{R}^2$, задаваемая уравнением:
$$L = \\{ p \\in \\mathbb{R}^2 \\mid n \\cdot (p - p_0) = 0 \\}$$
где $n = (n_x, n_y)$ — единичный вектор нормали ($\\|n\\|_2 = 1$), а $p_0$ — опорная точка на прямой.

### 1.3. Статическая и подвижная грани (Static and Moving Regions)
- **Статическая грань ($\\mathcal{F}_{\\text{static}}$):** $\\{ p \\in \\mathcal{S} \\mid n \\cdot (p - p_0) \\le 0 \\}$
- **Подвижная грань ($\\mathcal{F}_{\\text{moving}}$):** $\\{ p \\in \\mathcal{S} \\mid n \\cdot (p - p_0) \\ge 0 \\}$

### 1.4. Операция зеркального отражения сгиба ($R_L$)
$$R_L(p) = p - 2 \\big( (p - p_0) \\cdot n \\big) n$$

### 1.5. Категории контактов
1. **Площадное перекрытие (Area Overlap, 2D):** $\\dim(\\mathcal{I}) = 2$, $\\operatorname{Area}(\\mathcal{I}) > 0$.
2. **Отрезковое касание (Segment Contact, 1D):** $\\dim(\\mathcal{I}) = 1$, $\\operatorname{Area}(\\mathcal{I}) = 0$.
3. **Вершинное касание (Vertex Contact, 0D):** $\\dim(\\mathcal{I}) = 0$, $\\operatorname{Area}(\\mathcal{I}) = 0$.
4. **Отсутствие контакта (Disjoint):** $\\mathcal{I} = \\emptyset$.
5. **Смешанная геометрия:** если $\\operatorname{Area} > 0$, возвращается \`AREA_OVERLAP\` с флагом граничного контакта.`,
  },
  {
    id: 'foundations',
    path: 'THEORY/FOUNDATIONS.md',
    title: 'Foundations (Теоретический базис и факты)',
    category: 'THEORY',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Отделение доказанных математических фактов (изометрия, инверсия ориентации, деление выпуклых полигонов) от гипотез. Аналитические эталоны EXP-001 и EXP-002.',
    unresolvedQuestions: [
      {
        id: 'UQ-FN-01',
        question: 'Каков точный математический критерий различения чистого точечного касания (Vertex Contact, Area = 0) от случая, когда вершина коснулась края, но прилегающие грани образовали площадное перекрытие?',
        proposedAnswer: 'Критерий основан на ранжировании топологической размерности dim(I): если Jordan Area > epsilon, то случай строго классифицируется как 2D Area Overlap.',
        status: 'IN_DISCUSSION',
      },
      {
        id: 'UQ-FN-02',
        question: 'Достаточно ли плоской топологии графа граней (DCEL) для представления многослойных наложений без явной Z-координаты каждого слоя?',
        proposedAnswer: 'Да, через топологическую сортировку графа частичного порядка наслоения (Partial Stacking Order Directed Graph).',
        status: 'OPEN',
      },
    ],
    content: `# PCRS THEORY — FOUNDATIONS (ТЕОРЕТИЧЕСКИЙ БАЗИС)

**Документ:** \`THEORY/FOUNDATIONS.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED / DERIVED (Частично)\`  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  

---

## 1. Введение и методологическое разделение

Теоретический фундамент PCRS строго разграничивает три категории положений:
1. **Установленные математические факты (Established Facts):** Теоремы евклидовой геометрии, математической теории оригами, топологии многообразий.
2. **Аналитически выведенные эталоны (Derived Benchmarks):** Точные символьные расчёты для EXP-001 и EXP-002.
3. **Рабочие инженерные гипотезы (Working Hypotheses):** Предположения о численной устойчивости и классификации контактов.

---

## 2. Установленные математические факты

### ФАКТ-01: Изометричность операции плоского сгиба (\`DERIVED\`)
Лист бумаги не растягивается и не сжимается: для любых точек $p, q$ внутри грани:
$$\\|f(p) - f(q)\\|_2 = \\|p - q\\|_2$$

### ФАКТ-02: Инверсия ориентации при отражении (\`DERIVED\`)
Определитель матрицы отражения $\\det(J) = -1$. Отражённая грань меняет ориентацию нормали.

### ФАКТ-03: Линейное деление выпуклого многоугольника (\`DERIVED\`)
Прямая сгиба $L$ делит выпуклый полигон ровно на два связных выпуклых полигона $\\mathcal{P}_1$ и $\\mathcal{P}_2$.

### ФАКТ-04: Принцип сохранения площади (\`DERIVED\`)
$$\\operatorname{Area}(\\mathcal{F}_{\\text{static}}) + \\operatorname{Area}(\\mathcal{F}_{\\text{moving}}) = 1.0$$
$$\\operatorname{Area}_{\\text{visible}} = 1.0 - \\operatorname{Area}(\\mathcal{F}_{\\text{static}} \\cap \\mathcal{F}'_{\\text{moving}})$$

---

## 3. Аналитические эталоны

### EXP-001 (Срединный сгиб $x = 0.5$):
- $\\operatorname{Area}(\\mathcal{I}) = 0.5000000$. Класс: \`AREA_OVERLAP\`.

### EXP-002 (Случай 2.2: Сгиб угла квадрата):
- Линия сгиба соединяет точки $(0.5, 0.0)$ и $(1.0, 0.5)$.
- Треугольник с катетами $0.5 \\times 0.5$ отражается внутрь листа.
- **Точная площадь перекрытия:**
  $$\\operatorname{Area}(\\mathcal{I}) = \\frac{1}{2} \\cdot 0.5 \\cdot 0.5 = 0.1250000 = \\frac{1}{8}$$
- **Класс контакта:** \`AREA_OVERLAP\` (исправлено с ошибочного точечного контакта).`,
  },
  {
    id: 'correctness-levels',
    path: 'THEORY/CORRECTNESS_LEVELS.md',
    title: 'Correctness Levels (Уровни корректности L0–L3)',
    category: 'THEORY',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Четырёхуровневая модель качества: L0 синтаксис, L1 геометрические инварианты, L2 эталонное сопоставление (delta <= 1e-7), L3 непроницаемость слоёв.',
    unresolvedQuestions: [
      {
        id: 'UQ-CL-01',
        question: 'Требуется ли на уровне L3 проверять непрерывную кинематическую траекторию сгибания или достаточно статической непроницаемости конечного плоского состояния?',
        proposedAnswer: 'На этапе Gate 1 ограничиться статической ацикличностью графа слоев. Непрерывную кинематику вынести в фазу 3D.',
        status: 'IN_DISCUSSION',
      },
    ],
    content: `# PCRS THEORY — CORRECTNESS LEVELS (УРОВНИ КОРРЕКТНОСТИ)

**Документ:** \`THEORY/CORRECTNESS_LEVELS.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED\`  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  

---

## Иерархия уровней

$$\\mathbf{L0} \\;\\subset\\; \\mathbf{L1} \\;\\subset\\; \\mathbf{L2} \\;\\subset\\; \\mathbf{L3}$$

- **L0 (Syntax & Schema):** Отсутствие \`NaN\`, корректность ссылок на вершины, соответствие контрактам State и Trace.
- **L1 (Geometric Invariants):** Сохранение длин рёбер (изометрия), сохранение суммарной площади $\\sum \\operatorname{Area} = 1.0$, простота полигонов.
- **L2 (Analytical Benchmark):** Совпадение площади перекрытия и типа контакта с аналитическим решением:
  $$\\|\\operatorname{Area}_{\\text{calc}} - \\operatorname{Area}_{\\text{exact}}\\| \\le 10^{-7}$$
- **L3 (Physical Stacking & Non-Penetration):** Ацикличность графа наслоения граней (отсутствие парадоксальных взаимных блокировок слоёв).`,
  },
  {
    id: 'verification-protocol',
    path: 'ARCHITECTURE/VERIFICATION_PROTOCOL.md',
    title: 'Verification Protocol (Протокол независимой проверки)',
    category: 'ARCHITECTURE',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Правила независимой проверки вычислений ядра, порог epsilon=1e-7, классификация расхождений и протокол мульти-агентного арбитража.',
    unresolvedQuestions: [
      {
        id: 'UQ-VP-01',
        question: 'Следует ли включать в отчет SHA-256 хеш исходного кода валидатора для гарантии неизменности эталона между запусками?',
        proposedAnswer: 'Да, ввести криптографическую фиксацию тестовых пакетов на этапе Gate 2.',
        status: 'RESOLVED',
      },
      {
        id: 'UQ-VP-02',
        question: 'Как протоколировать ситуации, когда аналитический эталон неизвестен (например, для иррациональных углов сгиба)?',
        proposedAnswer: 'Использовать параллельную кросс-валидацию двух независимых библиотек клиппинга с точной арифметикой.',
        status: 'IN_DISCUSSION',
      },
    ],
    content: `# PCRS ARCHITECTURE — VERIFICATION PROTOCOL (ПРОТОКОЛ НЕЗАВИСИМОЙ ВЕРИФИКАЦИИ)

**Документ:** \`ARCHITECTURE/VERIFICATION_PROTOCOL.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED\`  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  

---

## 1. Главный постулат
Никакой результат не признаётся корректным на основании внутреннего ответа ядра. Корректность подтверждается только независимым валидатором с сопоставлением с эталоном.

---

## 2. Допуск численной точности
$$\\epsilon = 1.0 \\times 10^{-7}$$
- Площадь: $|\\operatorname{Area}_{\\text{calc}} - \\operatorname{Area}_{\\text{exact}}| \\le \\epsilon$
- Координаты: $\\max_i \\|v_{\\text{calc}, i} - v_{\\text{exact}, i}\\|_2 \\le \\epsilon$

---

## 3. Матрица расхождений
- \`DISCREPANCY_NUMERICAL\`: расхождение в пределах $(\\epsilon, 10^{-5}]$.
- \`DISCREPANCY_TOPOLOGICAL\`: ошибка в связности или количестве вершин.
- \`DISCREPANCY_CLASSIFICATION\`: расхождение в классе контакта (например, Vertex Contact вместо Area Overlap).`,
  },
  {
    id: 'exp-001',
    path: 'EXPERIMENTS/PCRS-EXP-001/SPECIFICATION.md',
    title: 'PCRS-EXP-001 (Single Fold Overlap & Adjacent Faces)',
    category: 'EXPERIMENTS',
    status: 'DERIVED',
    version: '1.1.0',
    summary: 'Спецификация теста одиночного сгиба: Серия A (единичный квадрат x=0.5, диагональ y=x, S=0.5) и Серия B (смежные грани, до сгиба S=0 SEGMENT_CONTACT, после сгиба S=2 и S=1 AREA_OVERLAP). Разрешение CRIT-GAP-01.',
    unresolvedQuestions: [
      {
        id: 'UQ-EXP1-01',
        question: 'Какова точность вычисления площади при углах сгиба с иррациональными тригонометрическими коэффициентами (theta = pi/5)?',
        proposedAnswer: 'Требуется провести численное профилирование алгоритма отсечения Сазерленда-Ходжмана на 10 000 случайных сгибах.',
        status: 'OPEN',
      },
      {
        id: 'UQ-EXP1-02',
        question: 'Какая серия является нормативным эталоном для минимальной верификации ядра: Серия A или Серия B?',
        proposedAnswer: 'Серия B выделена в независимый базовый пакет PCRS-CORE-EXP-001 как минимальный проверяемый эталон.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS-EXP-001: SINGLE FOLD OVERLAP & ADJACENT FACES BENCHMARK

**Идентификатор:** \`PCRS-EXP-001\`  
**Статус:** \`DERIVED (Аналитический эталон) / SPECIFIED (Спецификация) / UNVERIFIED (Рантайм)\`  
**Связанный пробел:** \`CRIT-GAP-01\` (разрешен разделением на серии)

---

## 1. Серия EXP-001-A: Сгиб единичного листа (Unit Square)
- **Случай A-1.1 (Срединный сгиб $x = 0.5$):**
  - $\\mathcal{F}_{\\text{static}} = [0, 0.5] \\times [0, 1]$, $\\mathcal{F}'_{\\text{moving}} = [0, 0.5] \\times [0, 1]$.
  - Аналитическая площадь перекрытия: $\\operatorname{Area}(\\mathcal{I}) = 0.5000000$.
  - Классификация контакта: \`AREA_OVERLAP\`.
- **Случай A-1.2 (Диагональный сгиб $y = x$):**
  - $\\mathcal{F}_{\\text{static}} = \\triangle [(0,0), (1,0), (1,1)]$, $\\mathcal{F}'_{\\text{moving}} = \\triangle [(0,0), (1,1), (0,1)]$.
  - Аналитическая площадь: $\\operatorname{Area}(\\mathcal{I}) = 0.5000000$. Класс: \`AREA_OVERLAP\`.

---

## 2. Серия EXP-001-B: Смежные грани и граничный контакт (Adjacent Faces)
- **Случай B-1.1 (До сгиба — смежный контакт):**
  - Грани $F_1 = [0, 1] \\times [0, 2]$ и $F_2 = [1, 2] \\times [0, 2]$ соприкасаются по ребру $x = 1$.
  - $\\operatorname{Area}(F_1 \\cap F_2) = 0.0000000$. Размерность: $\\dim = 1$.
  - Классификация контакта: строго \`SEGMENT_CONTACT\` (НЕ \`AREA_OVERLAP\`).
- **Случай B-1.2 (Полное отражение равных граней $1 \\times 2$):**
  - $R_L(F_2) = [0, 1] \\times [0, 2] = F_1$.
  - $\\operatorname{Area}(F_1 \\cap R_L(F_2)) = 2.0000000$. Классификация: \`AREA_OVERLAP\`.
- **Случай B-1.3 (Отражение меньшей грани $1 \\times 1$ на $1 \\times 2$):**
  - $F_3 = [1, 2] \\times [0, 1]$. $R_L(F_3) = [0, 1] \\times [0, 1]$.
  - $\\operatorname{Area}(F_1 \\cap R_L(F_3)) = 1.0000000$. Классификация: \`AREA_OVERLAP\`.`,
  },
  {
    id: 'exp-002',
    path: 'EXPERIMENTS/PCRS-EXP-002/SPECIFICATION.md',
    title: 'PCRS-EXP-002 (Single Fold Vertex Contact Detection)',
    category: 'EXPERIMENTS',
    status: 'DERIVED',
    version: '1.0.0',
    summary: 'Исправленный эталон Случая 2.2: площадь перекрытия S = 0.125 (1/8 квадрата). Контракт классификации смешанных геометрий и политика epsilon.',
    unresolvedQuestions: [
      {
        id: 'UQ-EXP2-01',
        question: 'Должен ли классификатор возвращать флаг VERTEX_CONTACT как вторичный атрибут, если вершина перешла на внешнюю границу квадрата?',
        proposedAnswer: 'Да, в объекте ContactClassificationResult предусмотрено поле features.reflectedVerticesOnBoundary.',
        status: 'RESOLVED',
      },
      {
        id: 'UQ-EXP2-02',
        question: 'Как исключить саму линию сгиба из детекции контактных перекрытий?',
        proposedAnswer: 'Линия сгиба исключается, так как является топологическим шарниром (Hinge Edge).',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS-EXP-002: SINGLE FOLD VERTEX CONTACT DETECTION

**Идентификатор:** \`PCRS-EXP-002\`  
**Статус:** \`DERIVED (Исправлен эталон 2.2) / SPECIFIED (Контракт) / UNVERIFIED (Код)\`  

### Исправление аналитического эталона Случая 2.2:
- Линия сгиба проходит через $(0.5, 0.0)$ и $(1.0, 0.5)$.
- Отрезаемый угол — прямоугольный треугольник $\\triangle (0.5,0)-(1.0,0)-(1.0,0.5)$ с катетами $0.5$ и $0.5$.
- Вершина $(1.0, 0.0)$ отражается в точку $(0.5, 0.5)$ внутри листа.
- **Точная аналитическая площадь перекрытия:**
  $$\\operatorname{Area}(\\mathcal{I}) = \\frac{1}{2} \\times 0.5 \\times 0.5 = 0.1250000 = \\frac{1}{8}$$
- **Классификация:** строго \`AREA_OVERLAP\` (с присутствием граничного шарнирного контакта).`,
  },
  {
    id: 'adr-0001',
    path: 'DECISIONS/ADR-0001.md',
    title: 'ADR-0001 (Модель жизненного цикла статусов знаний)',
    category: 'DECISIONS',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Принятое архитектурное решение о строгой дискретной шкале статусов знаний и запрете слияния State, Trace и Report.',
    unresolvedQuestions: [],
    content: `# ADR-0001: МОДЕЛЬ ЖИЗНЕННОГО ЦИКЛА СТАТУСОВ ЗНАНИЙ И РАЗДЕЛЕНИЕ STATE / TRACE / REPORT

**Статус:** \`APPROVED\`  
**Дата:** 2026-10-24  

### Решение:
1. Каждое утверждение обязано иметь статус: \`PROPOSED\`, \`SPECIFIED\`, \`DERIVED\`, \`EXPERIMENT_VERIFIED\`, \`FAILED\`, \`UNSUPPORTED_INPUT\`, \`UNVERIFIED\`.
2. Запрещено некритически принимать выводы нейросетей без аналитического эталона или воспроизводимого теста.
3. Полная изоляция сущностей State, Trace и Verification Report.`,
  },
  {
    id: 'changelog',
    path: 'CHANGELOG.md',
    title: 'CHANGELOG (Хроника изменений репозитория)',
    category: 'ROOT',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Хронология версий и добавления документов, начиная с релиза v0.1.0 Gate 0: Theoretical Foundation.',
    unresolvedQuestions: [],
    content: `# PCRS THEORY LAB — CHANGELOG

## [0.1.0] — 2026-10-24
### Инициализация репозитория (Gate 0: Theoretical Foundation)
- Созданы базовые документы: PROJECT_CHARTER.md, README.md, GLOSSARY.md, THEORY/FOUNDATIONS.md, THEORY/CORRECTNESS_LEVELS.md, ARCHITECTURE/VERIFICATION_PROTOCOL.md, EXPERIMENTS/PCRS-EXP-001, EXPERIMENTS/PCRS-EXP-002, DECISIONS/ADR-0001.md.
- Завершён кросс-репозиторный аудит трёх внешних кодовых баз:
  - Добавлен ARCHITECTURE/RELATED_PROJECTS.md
  - Добавлен ARCHITECTURE/REUSE_CANDIDATES.md
  - Добавлен ARCHITECTURE/DECISION_CANDIDATES.md
  - Добавлен EXPERIMENTS/EXPERIMENT_GAPS.md (с фиксацией расхождения CRIT-GAP-01 по EXP-001)
  - Добавлен ARCHITECTURE/TRACEABILITY.md`,
  },
  {
    id: 'related-projects',
    path: 'ARCHITECTURE/RELATED_PROJECTS.md',
    title: 'Related Projects (Сравнительный аудит трёх репозиториев)',
    category: 'ARCHITECTURE',
    status: 'REVIEWED',
    version: '1.0.0',
    summary: 'Архитектурный профиль, сильные стороны, границы ответственности и уроки для PCRS из Atlas, 3D Geometry Stand и AI Geometry Skill.',
    unresolvedQuestions: [
      {
        id: 'UQ-RP-01',
        question: 'Требуется ли унифицировать терминологию сущностей между Atlas (примитивы, паттерны) и PCRS (грани, линии сгиба, слои)?',
        proposedAnswer: 'Нет, сохранить суверенную предметную модель PCRS. Паттерны Atlas использовать только для HMI и метаданных.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS ARCHITECTURE — RELATED PROJECTS (СРАВНИТЕЛЬНЫЙ АНАЛИЗ ИСТОЧНИКОВ)

**Документ:** \`ARCHITECTURE/RELATED_PROJECTS.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`REVIEWED\`  
**Версия:** 1.0.0  

---

## 1. Архитектурный профиль исследованных проектов

### 1.1. Atlas Engineering Patterns (v1.0.0)
- Онтология примитивов, паттернов, конфигураций и свидетельств.
- Механизм детекции пробелов в знаниях (\`KnowledgeGap\`) и аудит нормативных требований (ISO 9241-110).
- **Граница:** Прямо исключает геометрические вычислительные движки из своей ответственности.

### 1.2. 3D Geometry Reasoning Stand (v0.1.0)
- Каноническое декартово состояние (\`CanonicalGeometryState\`), глубокая заморозка (\`Object.freeze\`).
- Детерминированная нормализация координат и 32-битный FNV-1a хеш геометрии (\`computeGeometrySignature\`).
- Размерная масштабно-зависимая политика допусков (\`ResolvedTolerances\`).
- **Граница:** Жестко привязан к сфере $S^2$ и тетраэдру; не моделирует плоское складывание бумаги.

### 1.3. AI Geometry Skill (v1.0.0)
- Headless API (\`HeadlessGeometrySession\`) с поддержкой \`FORK\` и \`ROLLBACK\`.
- Принцип \`REASON OUTSIDE. VERIFY INSIDE.\` и \`PRODUCER CLAIM ≠ RECEIVER TRUTH\`.
- Протокол Zero-Trust проверки обменных артефактов (GSA v0.1.0).
- Типизированный отказ \`CAPABILITY_GAP\` вместо ложного \`false\`.`,
  },
  {
    id: 'reuse-candidates',
    path: 'ARCHITECTURE/REUSE_CANDIDATES.md',
    title: 'Reuse Candidates (Реестр переносимых решений RC-01...RC-10)',
    category: 'ARCHITECTURE',
    status: 'REVIEWED',
    version: '1.0.0',
    summary: '10 детализированных карточек с полями источника, дизайна, доказательств, адаптации, рисков и статуса (ACCEPTED, REVIEWED, REJECTED).',
    unresolvedQuestions: [
      {
        id: 'UQ-RC-01',
        question: 'Допустимо ли использовать порог 1e-4 из AI Geometry Skill для проверки контактов в PCRS?',
        proposedAnswer: 'Строго отклонено (RC-10: REJECTED). Для складывания бумаги утвержден допуск epsilon <= 1e-7.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS ARCHITECTURE — REUSE CANDIDATES

**Документ:** \`ARCHITECTURE/REUSE_CANDIDATES.md\`  
**Статус:** \`REVIEWED\`  

### Принятые кандидаты (ACCEPTED):
- **RC-01:** «Reason Outside, Verify Inside» (AI Geometry Skill)
- **RC-02:** Zero-Trust верификация артефактов GSA (AI Geometry Skill)
- **RC-03:** Семантический отказ \`CAPABILITY_GAP\` (AI Geometry Skill)
- **RC-04:** Трехуровневая изоляция: Geometry $\\ne$ Representation $\\ne$ Visualization (3D Stand)
- **RC-05:** Детерминированная сигнатура и нормализация чисел FNV-1a (3D Stand)
- **RC-06:** Разделение валидности входа и вырожденности геометрии \`DEGENERATE\` (3D Stand)
- **RC-07:** Модель пробелов в знаниях \`KnowledgeGap\` (Atlas)
- **RC-08:** Модель доказательств NHFG: 5 эпистемических категорий (Atlas)

### Отклонённые кандидаты (REJECTED):
- **RC-09:** Полярные координаты окружности как базис листа бумаги (Сингулярности и искажение метрики)
- **RC-10:** Локальный допуск $\\epsilon = 10^{-4}$ (Слишком груб для геометрии складывания, утвержден $\\epsilon = 10^{-7}$)`,
  },
  {
    id: 'decision-candidates',
    path: 'ARCHITECTURE/DECISION_CANDIDATES.md',
    title: 'Decision Candidates (Кандидаты в решения DC-01...DC-07)',
    category: 'ARCHITECTURE',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Архитектурные предложения, ожидающие утверждения перед переходом к Gate 1 (песочница, Zero-Trust, эпсилон 1e-7, ContactManifold).',
    unresolvedQuestions: [],
    content: `# PCRS ARCHITECTURE — DECISION CANDIDATES

**Документ:** \`ARCHITECTURE/DECISION_CANDIDATES.md\`  
**Статус:** \`SPECIFIED\`  

- **DC-01:** Внедрение Headless Sandbox (\`FORK\` / \`ROLLBACK\`) для тестирования гипотез агентов (ADR-0002).
- **DC-02:** Протокол Zero-Trust локальной перепроверки артефактов GSA (ADR-0003).
- **DC-03:** Явный отказ \`CAPABILITY_GAP\` вместо ложного отрицания \`false\` (ADR-0004).
- **DC-04:** Разделение канонической геометрии, представлений и UI (ADR-0005).
- **DC-05:** Размерно-согласованная политика эпсилон $\\epsilon \\le 10^{-7}$ (ADR-0006).
- **DC-06:** Детерминированная сигнатура состояния FNV-1a (ADR-0007).
- **DC-07:** Композитная модель \`ContactManifold\` для смешанных геометрий (ADR-0008).`,
  },
  {
    id: 'experiment-gaps',
    path: 'EXPERIMENTS/EXPERIMENT_GAPS.md',
    title: 'Experiment Gaps & Discrepancies (Аудит пробелов и расхождение CRIT-GAP-01)',
    category: 'EXPERIMENTS',
    status: 'AUDITED',
    version: '1.0.0',
    summary: 'Фиксация расхождения CRIT-GAP-01 между тестом единичного квадрата и тестом смежных прямоугольников (S=0, 2, 1) в EXP-001. План серий EXP-001-A и EXP-001-B.',
    unresolvedQuestions: [
      {
        id: 'UQ-GAP-01',
        question: 'Какая модель должна стать нормативным эталоном EXP-001: сгиб единичного квадрата x=0.5 (S=0.5) или смежные прямоугольники (до сгиба S=0, после S=2, S=1)?',
        proposedAnswer: 'Включить в EXP-001 обе серии: EXP-001-A (Single Sheet) и EXP-001-B (Multi-Face Unfolded Boundary).',
        status: 'IN_DISCUSSION',
      },
    ],
    content: `# PCRS EXPERIMENTS — EXPERIMENT GAPS & DISCREPANCY AUDIT

**Документ:** \`EXPERIMENTS/EXPERIMENT_GAPS.md\`  
**Статус:** \`AUDITED\`  

### Обнаруженное противоречие CRIT-GAP-01:
В задании указаны условия EXP-001:
1. До сгиба: смежные прямоугольники соприкасаются по общей границе — площадь перекрытия строго равна 0. Это не \`AREA_OVERLAP\`, а \`SEGMENT_CONTACT\`.
2. После отражения прямоугольника $1 \\times 2$ площадь перекрытия равна 2.
3. После отражения меньшего прямоугольника $1 \\times 1$ на $1 \\times 2$ площадь перекрытия равна 1.

В исходной спецификации EXP-001 рассматривался сгиб единичного квадрата $[0,1]^2$ по линии $x=0.5$ ($S=0.5$).
**Решение:** Разделить EXP-001 на серии 001-A (Single Sheet) и 001-B (Adjacent Rectangles Benchmark).`,
  },
  {
    id: 'traceability',
    path: 'ARCHITECTURE/TRACEABILITY.md',
    title: 'Traceability Matrix (Матрица сквозной трассируемости TR-01...TR-13)',
    category: 'ARCHITECTURE',
    status: 'SPECIFIED',
    version: '1.1.0',
    summary: 'Сквозная цепочка ответственности: Исходный файл -> Извлечённый паттерн -> Решение PCRS -> Спецификация -> Тестовый пакет -> Ожидаемый результат. Включает TR-11 (Принципы), TR-12 (Ядро Ходжа) и TR-13 (PCRS-CORE-EXP-001).',
    unresolvedQuestions: [],
    content: `# PCRS ARCHITECTURE — TRACEABILITY MATRIX

**Документ:** \`ARCHITECTURE/TRACEABILITY.md\`  
**Статус:** \`SPECIFIED\`  

$$\\text{Исходный файл} \\longrightarrow \\text{Извлечённый паттерн} \\longrightarrow \\text{Решение PCRS} \\longrightarrow \\text{Спецификация} \\longrightarrow \\text{Тест} \\longrightarrow \\text{Результат}$$

- **TR-01:** AI Geometry Skill \`SKILL.md\` $\\to$ Reason Outside, Verify Inside $\\to$ DC-01 $\\to$ EXP-001/002
- **TR-02:** AI Geometry Skill GSA $\\to$ Zero-Trust Re-Verification $\\to$ DC-02 $\\to$ Verification Protocol
- **TR-03:** AI Geometry Skill \`CAPABILITY_GAP\` $\\to$ Typed Gap Response $\\to$ DC-03 $\\to$ Charter Art. 4
- **TR-04:** 3D Stand Architecture $\\to$ Geometry / Representation / Visualization $\\to$ DC-04 $\\to$ Geometric Model
- **TR-05:** 3D Stand Signature $\\to$ Coordinate Normalization + FNV-1a $\\to$ DC-06 $\\to$ State Trace Report
- **TR-06:** 3D Stand Types $\\to$ \`InputStatus\` vs \`DEGENERATE\` $\\to$ DC-06 $\\to$ EXP-002 Case 2.1
- **TR-07:** Atlas Patterns $\\to$ Knowledge Gaps & Epistemic Loss $\\to$ RC-07 $\\to$ Experiment Gaps
- **TR-08:** Atlas Patterns NHFG $\\to$ 5 Epistemic Categories $\\to$ RC-08 $\\to$ Foundations
- **TR-09:** EXP-002 Audit $\\to$ S = 0.125 + Hinge Edge $\\to$ DC-07 $\\to$ EXP-002 Case 2.2
- **TR-10:** Section 5 Audit $\\to$ EXP-001 Discrepancy CRIT-GAP-01 $\\to$ EXP-001 Series A & B
- **TR-11:** Section 4 Insight $\\to$ 3 Methodological Principles $\\to$ Verification Principles $\\to$ PCRS-CORE-EXP-001
- **TR-12:** Section 7 Insight $\\to$ Hodge Consistency Core ($C_2 \\to C_1 \\to C_0, \\partial_1 \\partial_2 = 0$) $\\to$ Hypotheses HC-001..005
- **TR-13:** Section 8 Spec $\\to$ Rigid Fold Reflection (8 tests) $\\to$ PCRS-CORE-EXP-001`,
  },
  {
    id: 'verification-principles',
    path: 'THEORY/VERIFICATION_PRINCIPLES.md',
    title: 'Verification Principles (3 методологических принципа PCRS)',
    category: 'THEORY',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Формулировка трех основополагающих принципов: 1. Construction ≠ Proof, 2. Result ≠ Reproducibility, 3. Minimal Experiment First. Разделение утверждения агента, детерминированного ядра и независимого валидатора.',
    unresolvedQuestions: [
      {
        id: 'UQ-VP-01',
        question: 'Достаточно ли на этапе Gate 0 проверки статических инвариантов L0-L2, или необходимо требовать непрерывную кинематическую интерполяцию угла складывания theta in [0, pi]?',
        proposedAnswer: 'Для плоского сгиба с нулевой толщиной статической изометрии и ацикличности порядка наслоения достаточно; кинематика выносится в Gate 2.',
        status: 'IN_DISCUSSION',
      },
    ],
    content: `# PCRS THEORY — VERIFICATION PRINCIPLES (МЕТОДОЛОГИЧЕСКИЕ ПРИНЦИПЫ ВЕРИФИКАЦИИ)

**Документ:** \`THEORY/VERIFICATION_PRINCIPLES.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED\`  
**Версия:** 1.0.0  
**Дата фиксации:** 2026-10-24  

---

## Три методологических принципа PCRS:

### Принцип 1. Construction ≠ Proof (Построение ≠ Доказательство)
Сам факт успешного построения геометрической фигуры или выполнения операции не является доказательством её физической или геометрической корректности.
- Утверждение агента — это гипотеза (\`Claim\`), а не факт.
- Вычислительный модуль не имеет права объявлять результат верным без аудита инвариантов независимым валидатором.
- Контроль инвариантов: сохранение метрики (изометрия), сохранение площади, простота полигона, ацикличность слоев.

### Принцип 2. Result ≠ Reproducibility (Результат ≠ Воспроизводимость)
Наличие изолированного числа, конечных координат или результирующего полигона не означает, что вычисление научно состоятельно и воспроизводимо.
- Требуется полный воспроизводимый пакет: каноническое начальное состояние $S_0$, упорядоченный журнал операций (\`Trace\`), строгая численная политика ($\\epsilon_{\\text{coord}} = 10^{-7}, \\epsilon_{\\text{area}} = 10^{-9}$), и протокол Replay.

### Принцип 3. Minimal Experiment First (Сначала минимальный эксперимент)
Разработка и валидация начинаются с простейшего базового геометрического эксперимента, изолированно доказывающего работоспособность самого механизма расчёта и аудита, а не с комплексной модели (самолётик, журавлик, лодочка).`,
  },
  {
    id: 'hodge-core-research',
    path: 'THEORY/HODGE_CORE_RESEARCH.md',
    title: 'Hodge Core Research (Исследовательское направление согласованности)',
    category: 'THEORY',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Формализация Hodge-Inspired архитектуры: строгое разграничение классической теории Ходжа, архитектурной концепции структурной согласованности и дискретного клеточного комплекса листа бумаги (C2 -> C1 -> C0, d1 o d2 = 0, дискретный лапласиан). Реестр гипотез HC-HYP-001...005.',
    unresolvedQuestions: [
      {
        id: 'UQ-HC-01',
        question: 'Требуется ли ядру Ходжа решать непрерывные дифференциальные уравнения в частных производных (PDE) на плоскости бумаги?',
        proposedAnswer: 'Нет. В рамках PCRS аппарат сводится к дискретной внешней алгебре (DEC / Cell Complexes) и линейной алгебре над матрицами инцидентности B1 и B2.',
        status: 'RESOLVED',
      },
      {
        id: 'UQ-HC-02',
        question: 'Является ли ядро Ходжа предварительным условием для простейшего теста отражения PCRS-CORE-EXP-001?',
        proposedAnswer: 'Нет. Минимальный тест 001 опирается на формулу хаусдорфова/евклидова отражения R_L. Ядро Ходжа проверяет сложные составные сети складок.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS THEORY — HODGE-INSPIRED CONSISTENCY CORE

**Документ:** \`THEORY/HODGE_CORE_RESEARCH.md\`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Статус:** \`SPECIFIED / HYPOTHESIS_CATALOG\`  
**Версия:** 1.0.0  

---

## 1. Разграничение трех уровней понятия
1. **Классическая теория Ходжа:** гладкие римановы многообразия $M$, дифференциальные формы $\\Omega^k(M)$, лапласиан $\\Delta = d\\delta + \\delta d$, изоморфизм гармонических форм когомологиям де Рама.
2. **Авторская архитектурная идея:** ядро как структурный фильтр согласованности и детектор топологических дефектов в рассуждениях агентов.
3. **Конкретные дискретные алгоритмы PCRS:** 2D ячеистый комплекс листа $C_2 \\xrightarrow{\\partial_2} C_1 \\xrightarrow{\\partial_1} C_0$, структурное тождество $\\partial_1 \\circ \\partial_2 = 0$, дискретный 1-лапласиан $\\Delta_1 = \\partial_2 \\partial_2^T + \\partial_1^T \\partial_1$.

---

## 2. Каталог гипотез
- **HC-HYP-001 (Boundary Nilpotency):** Нарушение $\\partial_1 \\circ \\partial_2 \\ne 0$ свидетельствует о топологическом разрыве полигона.
- **HC-HYP-002 (Angular Holonomy Defect):** Сумма углов в плоском внутреннем узле сгибов строго равна $2\\pi$.
- **HC-HYP-003 (Discrete Hodge Decomposition):** Любое векторное поле смещений ребер разлагается на градиентное, соленоидальное и гармоническое.
- **HC-HYP-004 (Layer Obstruction via 1-Cycles):** Несовместимость порядка наслоения выявляется через циклы в графе перекрытий.
- **HC-HYP-005 (Decoupled Pre-Filter):** Топологический фильтр согласованности отсекает некорректные гипотезы агента за $O(V + E)$ до запуска численного клиппинга.`,
  },
  {
    id: 'core-exp-001',
    path: 'EXPERIMENTS/PCRS-CORE-EXP-001/SPECIFICATION.md',
    title: 'PCRS-CORE-EXP-001 (Rigid Fold Reflection & Verification)',
    category: 'EXPERIMENTS',
    status: 'EXPERIMENT_VERIFIED',
    version: '1.1.0',
    summary: 'Спецификация минимального проверочного эксперимента (Принцип 3). Две смежные грани 1x2, ось сгиба x=1. 8 обязательных тестов: формула R_L, неподвижность оси, изометрия, инверсия ориентации, до сгиба (S=0, SEGMENT_CONTACT), после сгиба (S=2, AREA_OVERLAP), частичный сгиб (S=1), негативный контроль.',
    unresolvedQuestions: [
      {
        id: 'UQ-CORE-01',
        question: 'Должен ли валидатор при проверке Теста 05 (до сгиба) сигнализировать ошибку, если наивный движок клиппинга возвращает пересечение нулевой площади как AREA_OVERLAP?',
        proposedAnswer: 'Да, валидатор обязан проверять размерность пересечения dim(I) и фиксировать классификационное расхождение DISCREPANCY_CLASSIFICATION.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS-CORE-EXP-001: RIGID FOLD REFLECTION AND INDEPENDENT VERIFICATION

**Идентификатор:** \`PCRS-CORE-EXP-001\`  
**Статус:** \`SPECIFIED / ANALYTICALLY_DERIVED (Эталон) / UNVERIFIED (Рантайм)\`  
**Назначение:** Минимальный проверочный эксперимент (Принцип 3: Minimal Experiment First).

---

## Геометрическая конфигурация:
- Статическая грань $F_1 = [0, 1] \\times [0, 2]$, площадь $S = 2.0$.
- Подвижная грань $F_2 = [1, 2] \\times [0, 2]$, площадь $S = 2.0$.
- Линия сгиба $L: x = 1$. Нормаль $n = (1, 0)$, точка $p_0 = (1, 0)$.

---

## 8 обязательных тестовых сценариев:
1. **Тест 01 (Формула $R_L$):** $R_L(x, y) = (2 - x, y)$. Вершины $F_2$ переходят в $F_1$. Допуск $\\epsilon_{\\text{coord}} = 10^{-7}$.
2. **Тест 02 (Неподвижность оси):** $\\forall p \\in L \\implies R_L(p) = p$. Невязка $\\le 10^{-9}$.
3. **Тест 03 (Изометрия):** $\\|R_L(p) - R_L(q)\\| = \\|p - q\\|$. Расстояния сохраняются.
4. **Тест 04 (Инверсия нормали):** $\\det(J) = -1$, обход вершин меняется с CCW на CW.
5. **Тест 05 (Контакт до сгиба):** $F_1 \\cap F_2 = \\{x=1, y \\in [0, 2]\\}$. $\\operatorname{Area} = 0$, строго \`SEGMENT_CONTACT\`.
6. **Тест 06 (Перекрытие после сгиба):** $\\operatorname{Area}(F_1 \\cap R_L(F_2)) = 2.0000000$. Класс \`AREA_OVERLAP\`.
7. **Тест 07 (Частичное перекрытие):** $F_3 = [1, 2] \\times [0, 1]$. $\\operatorname{Area}(F_1 \\cap R_L(F_3)) = 1.0000000$. Класс \`AREA_OVERLAP\`.
8. **Тест 08 (Негативный контроль):** Искусственное смещение вершины на $\\delta = 10^{-4}$ гарантированно бракуется валидатором со статусом \`FAILED\` по порогу $\\epsilon = 10^{-7}$.`,
  },
  {
    id: 'flat-foldability-conditions',
    path: 'THEORY/FLAT_FOLDABILITY_CONDITIONS.md',
    title: 'Flat-Foldability Conditions (Теоремы Кавасаки и Маэкавы)',
    category: 'THEORY',
    status: 'SPECIFIED',
    version: '1.0.0',
    summary: 'Математическая формализация теорем локальной плоской складываемости: теорема Кавасаки (знакопеременная сумма углов = 180°) и теорема Маэкавы (|M - V| = 2). Валидные примеры, невалидные контрпримеры и строгие ограничения (не доказывают глобальную складываемость).',
    unresolvedQuestions: [
      {
        id: 'UQ-FF-01',
        question: 'Достаточно ли локальной проверки Кавасаки и Маэкавы во всех узлах для гарантии глобальной складываемости листа?',
        proposedAnswer: 'Строго нет: задача глобальной плоской складываемости является NP-полной (Берн и Хейз). Требуется многоуровневая верификация.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS THEORY — LOCAL FLAT-FOLDABILITY CONDITIONS

**Документ:** \`THEORY/FLAT_FOLDABILITY_CONDITIONS.md\`  
**Статус:** \`SPECIFIED / RESEARCH_MODULE\`  

---

## 1. Теорема Кавасаки–Джастина
Для одиночной внутренней вершины степени $2n$ со смежными углами секторов $\\alpha_1, \\dots, \\alpha_{2n}$:
$$\\sum_{i=1}^n \\alpha_{2i-1} = \\sum_{i=1}^n \\alpha_{2i} = 180^\\circ$$
- **Необходимое и достаточное** условие локальной складываемости изолированной вершины.
- **Валидный пример:** $60^\\circ, 120^\\circ, 120^\\circ, 60^\\circ \\implies 60+120=180^\\circ$.
- **Контрпример:** $70^\\circ, 110^\\circ, 80^\\circ, 100^\\circ \\implies 150^\\circ \\ne 180^\\circ$ (FAIL).

---

## 2. Теорема Маэкавы
Для внутренней вершины плоско складываемой схемы:
$$|M - V| = 2$$
где $M$ — число горных складок, $V$ — долинных складок.
- Степень вершины обязана быть четной ($M + V = 2n$).
- **Валидный пример:** $M = 3, V = 1 \\implies |3 - 1| = 2$.
- **Контрпример:** $M = 2, V = 2 \\implies |2 - 2| = 0 \\ne 2$ (FAIL).

---

## 3. Границы применимости
Теоремы Кавасаки и Маэкавы:
- НЕ доказывают глобальную складываемость всей схемы;
- НЕ доказывают кинематическую достижимость непрерывным движением;
- НЕ проверяют непроницаемость и порядок наслоения слоев бумаги.`,
  },
  {
    id: 'core-exp-002',
    path: 'EXPERIMENTS/PCRS-CORE-EXP-002/SPECIFICATION.md',
    title: 'PCRS-CORE-EXP-002 (Composition and Closure of Transformations)',
    category: 'EXPERIMENTS',
    status: 'EXPERIMENT_VERIFIED',
    version: '1.1.0',
    summary: 'Исследование композиции последовательности сгибов T = Rn...R1. Пересекающиеся оси (поворот 2*theta, некоммутативность R2*R1 != R1*R2), параллельные оси (сдвиг 2*d), замкнутый цикл (T = I на ортогональных осях) и негативный контроль.',
    unresolvedQuestions: [
      {
        id: 'UQ-COMP-01',
        question: 'Должно ли ядро всегда требовать возврата к единичному оператору T = I?',
        proposedAnswer: 'Нет. Замыкание T = I проверяется исключительно в циклических калибровочных тестах.',
        status: 'RESOLVED',
      },
    ],
    content: `
# PCRS-CORE-EXP-002: COMPOSITION AND CLOSURE OF PLANAR TRANSFORMATIONS

**Идентификатор:** \`PCRS-CORE-EXP-002\`  
**Статус:** \`EXPERIMENT_VERIFIED (7/7 PASS в рантайме Float64)\`  

---

## 1. Аналитические эталоны композиции:
- **Пересекающиеся оси под углом $\\theta = 45^\\circ$:**
  - $T_A = R_2 R_1 = \\operatorname{Rot}(+90^\\circ)$
  - $T_B = R_1 R_2 = \\operatorname{Rot}(-90^\\circ)$
  - Некоммутативность: $T_A \\ne T_B$ (норма расхождения $\\sqrt{8} \\approx 2.8284$).
- **Параллельные оси с шагом $d = 2$:**
  - $T_P = R_2 R_1 = (x + 2d, y) = (x + 4, y)$ (чистый перенос).
- **Замкнутый 4-шаговый цикл:**
  - $T = (R_2 R_1)^2 = (-I)^2 = I$ (на ортогональных осях).

---

## 2. Исполнение в коде ядра:
Все 7 тестов пакета исполняются в \`src/core/testRunner.ts\` и подтверждены независимым валидатором \`src/verifier/independentVerifier.ts\`.`,
  },
  {
    id: 'gate-03-acceptance-report',
    path: 'EXPERIMENTS/GATE-0.3-ACCEPTANCE-REPORT.md',
    title: 'Gate 0.3 Acceptance Audit (Финальный математический аудит)',
    category: 'EXPERIMENTS',
    status: 'AUDITED',
    version: '1.0.0',
    summary: 'Полный аналитический аудит формул отражения, инвариантов изометрии и площади, допусков базовых фикстур, тестов EXP-001/002, условий Кавасаки/Маэкавы и ядра Ходжа. Вердикт: READY WITH BOUNDED GAPS.',
    unresolvedQuestions: [
      {
        id: 'UQ-GATE03-01',
        question: 'Является ли порог 1e-7 универсальным для произвольных схем?',
        proposedAnswer: 'Нет, универсальная политика переведена в статус UNRESOLVED (GAP-09). Порог 1e-7 ограничен фикстурами L in [0, 2].',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS — GATE 0.3: FINAL MATHEMATICAL ACCEPTANCE AUDIT REPORT

**Документ:** \`EXPERIMENTS/GATE-0.3-ACCEPTANCE-REPORT.md\`  
**Статус:** \`ACCEPTED_FOR_GATE_1_TRANSITION\`  
**Вердикт:** \`READY WITH BOUNDED GAPS\`  

### Ключевые выводы аудита:
1. Формулы плоского отражения $R = 2uu^T - I$ и $p' = a + R(p-a)$ строго доказаны аналитически.
2. Сохранение беззнаковой площади и инверсия знака Гауссовой ориентированной площади подтверждены.
3. Универсальная политика эпсилон переведена в статус \`UNRESOLVED\` (GAP-09); в фикстурах Gate 1 приняты $\\epsilon_{\\text{coord}} = 10^{-7}$, $\\epsilon_{\\text{area}} = 10^{-9}$.
4. Теоремы Кавасаки, Маэкавы и ядро Ходжа классифицированы как \`RESEARCH_MODULE\` и исключены из обязательного вычислительного контура первого ядра.`,
  },
  {
    id: 'gate-1-verification-report',
    path: 'EXPERIMENTS/GATE-1-VERIFICATION-REPORT.md',
    title: 'Gate 1 Runtime Verification Report (Исполнение ядра и верификатора)',
    category: 'EXPERIMENTS',
    status: 'EXPERIMENT_VERIFIED',
    version: '1.0.0',
    summary: 'Отчёт об успешном исполнении всех 15 тестов пакетов PCRS-CORE-EXP-001 и PCRS-CORE-EXP-002 в среде Float64. 100% тестов пройдено, оба негативных теста перехвачены Zero-Trust аудитором.',
    unresolvedQuestions: [],
    content: `# PCRS — GATE 1: RUNTIME VERIFICATION EXECUTION REPORT

**Документ:** \`EXPERIMENTS/GATE-1-VERIFICATION-REPORT.md\`  
**Статус:** \`GATE_1_CORE_VERIFIED (15/15 PASS)\`  
**Исполняемые модули:** \`src/core/reflection.ts\`, \`src/verifier/independentVerifier.ts\`, \`src/core/testRunner.ts\`  

### Сводка верификации:
- **PCRS-CORE-EXP-001 (8 тестов):** 8/8 PASS. Изометрия грани, сохранение оси $x=1$, беззнаковая площадь $S=2.0$, знаковая Гауссова инверсия $+2.0 \\to -2.0$, контакт смежных граней (\`SEGMENT_CONTACT\`), полное наложение (\`AREA_OVERLAP\`), частичный сгиб ($S=1.0$), негативный контроль обнаружения брака $\\Delta = 10^{-4}$.
- **PCRS-CORE-EXP-002 (7 тестов):** 7/7 PASS. Поворот $+90^\\circ$ ($T_A$), поворот $-90^\\circ$ ($T_B$), строгая некоммутативность ($\\|T_A - T_B\\|_F = \\sqrt{8} \\approx 2.8284$), параллельный перенос $\\Delta x = 2d = 4.0$, замкнутый цикл $T = +I$, негативный контроль ложной коммутативности, эталон сгиба угла ($S = 0.125$).`,
  },
  {
    id: 'gate-11-audit-report',
    path: 'EXPERIMENTS/GATE-1.1-INDEPENDENT-AUDIT.md',
    title: 'Gate 1.1 Independent Audit (Независимый аудит реализации)',
    category: 'EXPERIMENTS',
    status: 'AUDITED',
    version: '1.0.0',
    summary: 'Независимый аудит кода ядра, валидатора и тестов. Устранение code-sharing в валидаторе, внедрение валидации NaN/нулевых векторов, try-catch изоляции. Вердикт: PASS WITH BOUNDED GAPS.',
    unresolvedQuestions: [
      {
        id: 'UQ-G11-01',
        question: 'Поддерживает ли алгоритм Сазерленда-Ходжмана невыпуклые полигоны?',
        proposedAnswer: 'Нет, строго ограничен выпуклыми полигонами (CONVEX_ONLY). Невыпуклый клиппинг отложен до Gate 2.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS — GATE 1.1: INDEPENDENT IMPLEMENTATION AUDIT REPORT

**Документ:** \`EXPERIMENTS/GATE-1.1-INDEPENDENT-AUDIT.md\`  
**Статус:** \`AUDITED / RATIFIED\`  
**Вердикт:** \`PASS WITH BOUNDED GAPS\`  

### Ключевые результаты аудита:
1. Математическое ядро $R = 2uu^T - I$ проверено для произвольных наклонных осей ($\theta = 30^\circ$, иррациональные координаты, невязка $\le 2.22 \\times 10^{-16}$).
2. Дефект разделения кода устранён: валидатор производит независимый расчёт формулы Гаусса и евклидовых норм.
3. Добавлена строгая отбраковка $u = [0, 0]$ (\`ZERO_DIRECTION_VECTOR\`) и нечисловых координат (\`INVALID_COORDINATE\`).
4. Все 15 первичных тестов и 3 расширенных теста аудита реально исполняются и завершаются со 100% успехом.`,
  },
  {
    id: 'gate-12-closure-report',
    path: 'EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md',
    title: 'Gate 1.2 Closure & Evidence Freeze (Закрытие Gate 1)',
    category: 'EXPERIMENTS',
    status: 'ACCEPTED',
    version: '1.0.0',
    summary: 'Официальный отчёт о закрытии Gate 1 и заморозке доказательств. Воспроизводимость npm test/lint/build, устранение терминов об абсолютной точности, реестр из 19 доказательств. Вердикт: GATE 1 CLOSED WITH DOCUMENTED LIMITATIONS.',
    unresolvedQuestions: [
      {
        id: 'UQ-G12-01',
        question: 'Следует ли объединять невыпуклое отсечение и порядок слоёв в одну задачу Gate 2?',
        proposedAnswer: 'Строго нет: невыпуклое пересечение и Layer Stacking DAG признаны двумя самостоятельными математическими направлениями.',
        status: 'RESOLVED',
      },
    ],
    content: `# PCRS — GATE 1.2: CLOSURE AUDIT AND EVIDENCE FREEZE REPORT

**Документ:** \`EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md\`  
**Статус:** \`RATIFIED / EVIDENCE_FROZEN\`  
**Вердикт:** \`GATE 1 CLOSED WITH DOCUMENTED LIMITATIONS\`  

### Ключевые результаты:
1. Воспроизводимость подтверждена: \`npm test\` (18/18 PASS), \`npm run lint\` (0 ошибок), \`npm run build\` (OK).
2. Численный профиль: максимальная невязка $\\Delta \\le 4.44 \\times 10^{-16}$ на фикстурах $L \\in [0, 2]$.
3. Реестр доказательств: 14 подтверждённых тестами фактов, 1 пробел (GAP-09), 4 ограничения вне скоупа.
4. Доказательства Gate 1 заморожены. Разрешён переход к раздельному проектированию направлений Gate 2.`,
  },
];

