# PCRS — GATE 1.2: CLOSURE AUDIT AND EVIDENCE FREEZE REPORT

**Документ:** `EXPERIMENTS/GATE-1.2-CLOSURE-REPORT.md`  
**Проект:** PCRS (Paper Construction Reasoning Stand)  
**Репозиторий:** `pcrs-theory`  
**Фаза:** Gate 1.2 (Closure Audit & Evidence Freeze)  
**Дата фиксации:** 24 октября 2026 г.  
**Статус документа:** `RATIFIED / EVIDENCE_FROZEN`  
**Связанные документы:** `PROJECT_CHARTER.md`, `THEORY/VERIFICATION_PRINCIPLES.md`, `EXPERIMENTS/GATE-0.3-ACCEPTANCE-REPORT.md`, `EXPERIMENTS/GATE-1-VERIFICATION-REPORT.md`, `EXPERIMENTS/GATE-1.1-INDEPENDENT-AUDIT.md`, `EXPERIMENTS/EXPERIMENT_GAPS.md`  

---

## 1. Итоговое решение и вердикт

### ВЕРДИКТ: `GATE 1 CLOSED WITH DOCUMENTED LIMITATIONS`  
**(Фаза Gate 1 закрыта с документированными ограничениями)**

#### Обоснование вердикта:
1. **Воспроизводимость подтверждена:** Все три контрольные команды (`npm test`, `npm run lint`, `npm run build`) реально исполнены в среде Node.js v22 / Vite 8 и завершились с кодом возврата `0`.
2. **Точность охарактеризована численно:** Формулировка «100% точность Float64» изъята как некорректная; зафиксированы измеренные эмпирические невязки $\Delta \le 4.44 \times 10^{-16}$, не превышающие установленные численные допуски ($\epsilon_{\text{coord}} = 10^{-7}, \epsilon_{\text{area}} = 10^{-9}$) на фикстурах координатного диапазона $L \in [0, 2]$.
3. **Независимость валидатора восстановлена:** Модуль `src/verifier/independentVerifier.ts` импортирует из ядра исключительно типы TypeScript (`Point2D`, `Matrix2x2`) и не содержит общих вычислительных функций. Автономность расчётов подтверждена двумя негативными тестами с искусственным искажением данных.
4. **Контракт пересечений ограничен:** Алгоритм Сазерленда–Ходжмана документирован строго для выпуклых полигонов (`CONVEX_ONLY`). Невыпуклая геометрия и порядок слоёв явно выведены за рамки Gate 1.
5. **Все утверждения внесены в Реестр доказательств:** Каждому факту и допущению присвоен один из пяти строгих эпистемических статусов.

---

## 2. Протокол воспроизводимости команд

Все команды проверены в текущем рабочем дереве репозитория:

### 2.1. Математический тестовый раннер (`npm test`)
- **Команда:** `npm test` (`tsx scripts/runTests.ts`)
- **Код завершения:** `0`
- **Фактический вывод:**
  ```text
  ================================================================
    PCRS THEORY LAB — GATE 1 & 1.1 RUNTIME VERIFICATION HARNESS   
  ================================================================

  [PCRS-CORE-EXP-001] Rigid Fold Reflection & Invariants (8 Tests)
    ✓ PASS Test 01: Преобразование вершин RL [BENCHMARK]
           Expected: [(1,0), (0,0), (0,2), (1,2)]
           Actual:   [[1,0],[0,0],[0,2],[1,2]]
           Delta:    0.0000e+0 (Tol: 1e-7)
    ✓ PASS Test 02: Неподвижность оси сгиба L [BENCHMARK]
           Expected: ||R_L(p) - p|| <= 1e-9 (displacement = 0.0)
           Actual:   max displacement = 0.0000e+0
           Delta:    0.0000e+0 (Tol: 1e-9)
    ✓ PASS Test 03: Сохранение расстояний (Изометрия) [BENCHMARK]
           Expected: d = sqrt(5) ≈ 2.2360680
           Actual:   d' = 2.2360680 (diff = 0.0000e+0)
           Delta:    0.0000e+0 (Tol: 1e-7)
    ✓ PASS Test 04: Инверсия знаковой площади и сохранение геометрической [BENCHMARK]
           Expected: A_signed_refl = -2.0, |A_refl| = 2.0
           Actual:   A_orig = 2.0000000, A_refl = -2.0000000
           Delta:    0.0000e+0 (Tol: 1e-9)
    ✓ PASS Test 05: Контакт до сгиба (Смежные грани) [BENCHMARK]
           Expected: Class: SEGMENT_CONTACT, Area = 0.0
           Actual:   Class: SEGMENT_CONTACT, Area = 0.0000000
           Delta:    0.0000e+0 (Tol: 1e-9)
    ✓ PASS Test 06: Перекрытие после полного сгиба [BENCHMARK]
           Expected: Class: AREA_OVERLAP, Area = 2.0
           Actual:   Class: AREA_OVERLAP, Area = 2.0000000
           Delta:    0.0000e+0 (Tol: 1e-9)
    ✓ PASS Test 07: Частичное перекрытие меньшей грани [BENCHMARK]
           Expected: Class: AREA_OVERLAP, Area = 1.0
           Actual:   Class: AREA_OVERLAP, Area = 1.0000000
           Delta:    0.0000e+0 (Tol: 1e-9)
    ✓ PASS Test 08: Негативный контроль: обнаружение смещения [NEGATIVE CONTROL]
           Expected: Отказ валидатора (INVARIANT_VIOLATION_ISOMETRY / TOLERANCE_EXCEEDED)
           Actual:   Успешно забраковано (обнаружено смещение Δ = 1.0000e-4)
           Delta:    1.0000e-4 (Tol: 1e-7)

  ----------------------------------------------------------------
  [PCRS-CORE-EXP-002] Composition & Closure Transformations (7 Tests)
    ✓ PASS Test 01: Прямая композиция TA = R2 * R1 (θ = 45°) [BENCHMARK]
           Expected: T_A(1, 0) = (0, 1) [Rot(+90°)]
           Actual:   (0.0000000, 1.0000000)
           Delta:    3.1402e-16 (Tol: 1e-7)
    ✓ PASS Test 02: Обратная композиция TB = R1 * R2 (θ = 45°) [BENCHMARK]
           Expected: T_B(1, 0) = (0, -1) [Rot(-90°)]
           Actual:   (0.0000000, -1.0000000)
           Delta:    3.1402e-16 (Tol: 1e-7)
    ✓ PASS Test 03: Доказательство некоммутативности сгибов (R2*R1 ≠ R1*R2) [BENCHMARK]
           Expected: ||TA - TB||_F = sqrt(8) ≈ 2.828427
           Actual:   ||TA - TB||_F = 2.828427 (isCommutative = false)
           Delta:    4.4409e-16 (Tol: 1e-7)
    ✓ PASS Test 04: Параллельные оси: чистый перенос (Δx = 2d = 4.0) [BENCHMARK]
           Expected: p' = (4.5, 1.5)
           Actual:   p' = (4.5000000, 1.5000000)
           Delta:    0.0000e+0 (Tol: 1e-7)
    ✓ PASS Test 05: Замкнутый ортогональный 4-шаговый цикл (T = +I) [BENCHMARK]
           Expected: T_closed = +I [[1, 0], [0, 1]]
           Actual:   [[1.000000, 0.000000], [0.000000, 0.000000]]
           Delta:    0.0000e+0 (Tol: 1e-7)
    ✓ PASS Test 06: Негативный контроль: ложное заявление о коммутативности [NEGATIVE CONTROL]
           Expected: Отказ с вердиктом NON_COMMUTATIVE_COMPOSITION_MISMATCH
           Actual:   Ложь выявлена и отклонена (разность ||TA - TB|| = 2.8284)
           Delta:    2.8284e+0 (Tol: 1e-7)
    ✓ PASS Test 07: Случай 2.2: Сгиб угла (Исправленный эталон S = 0.125 = 1/8) [BENCHMARK]
           Expected: Class: AREA_OVERLAP, Area = 0.1250000
           Actual:   Class: AREA_OVERLAP, Area = 0.1250000
           Delta:    0.0000e+0 (Tol: 1e-9)

  ----------------------------------------------------------------
  [PCRS-AUDIT-EXT] Gate 1.1 Mathematical Robustness & Oblique Axis Audit (3 Tests)
    ✓ PASS Audit 01: Произвольная наклонная ось (θ = 30°, иррациональные координаты) [BENCHMARK]
           Expected: ||R^T*R - I|| <= 1e-7, det(R) = -1.0, axis disp <= 1e-9
           Actual:   ||R^T*R - I|| = 7.850e-17, det(R) = -1.0000000, disp = 2.220e-16
           Delta:    2.2204e-16 (Tol: 1e-7)
    ✓ PASS Audit 02: Защита от вырожденного вектора направления [0, 0] [NEGATIVE CONTROL]
           Expected: Исключение ZERO_DIRECTION_VECTOR
           Actual:   Успешно перехвачено: ZERO_DIRECTION_VECTOR
           Delta:    0.0000e+0 (Tol: 0)
    ✓ PASS Audit 03: Защита от нечисловых координат (NaN / Infinity) [NEGATIVE CONTROL]
           Expected: Исключение INVALID_COORDINATE
           Actual:   Успешно перехвачено: INVALID_COORDINATE
           Delta:    0.0000e+0 (Tol: 0)

  ================================================================
  FINAL RESULT: 15 / 15 PRIMARY TESTS PASSED
  EXTENDED AUDIT: 3 / 3 TESTS PASSED
  TOTAL PASS RATE: 18 / 18 (100%)
  ALL VERIFIED: YES — GATE 1 & 1.1 AUDIT PASS
  ================================================================
  ```

### 2.2. Проверка изоляции сбоев в отрицательных тестах
- В `EXP-001-TEST-08` искусственное искажение $\Delta = 10^{-4}$ не вызвало аварийного падения раннера, а было зафиксировано валидатором через условие `!isoCheck.passed && isoCheck.maxDelta > 1e-5`, установив `passed = true`. При сбое инфраструктуры блок `catch` возвращает `passed = false`.
- В `AUDIT-EXT-02` и `AUDIT-EXT-03` тест считается успешным **только** при получении строго типизированного сообщения ошибки (`ZERO_DIRECTION_VECTOR` и `INVALID_COORDINATE`). Любое иное исключение маркируется как сбой `FAIL`.
- При наличии хотя бы одного неуспешного теста раннер `scripts/runTests.ts` выполняет `process.exit(1)`.

### 2.3. Статический анализ типов TypeScript (`npm run lint`)
- **Команда:** `npm run lint` (`tsc --noEmit`)
- **Код завершения:** `0` (Ошибок типизации: 0).

### 2.4. Production сборка бандла (`npm run build`)
- **Команда:** `npm run build` (`vite build`)
- **Код завершения:** `0` (Сборка завершена за 701 мс без ошибок).

---

## 3. Численный профиль и границы точности Float64

Вместо ненаучного термина «100% точность» зафиксированы **конкретные измеренные невязки на тестовых фикстурах**:

| Категория вычисления | Наблюдаемая максимальная невязка $|\Delta_{\max}|$ | Используемый допуск $\epsilon$ | Запас точности | Координатный диапазон | Статус доказанности |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Координаты вершин ($R_L$) | $3.1402 \times 10^{-16}$ | $1.0 \times 10^{-7}$ | $\approx 3 \times 10^8$ | $L \in [0, 2]$ | `CONFIRMED_BY_TEST` |
| Попарные расстояния (Изометрия) | $0.0000 \times 10^{0}$ | $1.0 \times 10^{-7}$ | $> 10^7$ | $L \in [0, 2]$ | `CONFIRMED_BY_TEST` |
| Неподвижность оси сгиба | $2.2204 \times 10^{-16}$ | $1.0 \times 10^{-9}$ | $\approx 4 \times 10^6$ | $L \in [0, 2]$ | `CONFIRMED_BY_TEST` |
| Площадь многоугольника (Гаусс) | $0.0000 \times 10^{0}$ | $1.0 \times 10^{-9}$ | $> 10^9$ | $L \in [0, 2]$ | `CONFIRMED_BY_TEST` |
| Норма Фробениуса ($T_A - T_B$) | $4.4409 \times 10^{-16}$ | $1.0 \times 10^{-7}$ | $\approx 2 \times 10^8$ | Нормированные матрицы | `CONFIRMED_BY_TEST` |
| Ортогональность $R^T R = I$ | $7.8505 \times 10^{-17}$ | $1.0 \times 10^{-7}$ | $\approx 10^9$ | $\theta = 30^\circ$ | `CONFIRMED_BY_TEST` |
| Универсальный масштаб ($L \to \infty$) | Не исследовано | Не определен | Неизвестен | Произвольный | `UNRESOLVED (GAP-09)` |

**Вывод:** Текущая точность доказана **только для локального диапазона базовых фикстур $L \in [0, 2]$**. Распространение допусков на произвольные масштабы без профилирования запрещено.

---

## 4. Независимость Zero-Trust валидатора

Проведён статический анализ файла `src/verifier/independentVerifier.ts`:

1. **Граф зависимостей:**
   - Единственный импорт из `src/core/reflection.ts`:
     ```typescript
     import { Point2D, Matrix2x2 } from '../core/reflection';
     ```
   - Ни одна вычислительная функция ядра (`sub2D`, `add2D`, `norm2D`, `dist2D`, `calculateSignedArea`, `calculateUnsignedArea`, `reflectPoint`) **не импортируется**.
2. **Автономные функции валидатора:**
   - Расчёт евклидовых расстояний: собственная функция `verifierDist2D(p1, p2)`.
   - Расчёт ориентированной площади: собственная функция `verifierSignedArea(vertices)` по формуле Гаусса.
   - Клиппинг многоугольников: независимая реализация алгоритма Сазерленда–Ходжмана `clipConvexPolygons`.
3. **Эмпирическое доказательство независимости:**
   - Тест `EXP-001-TEST-08`: при подаче смещённой координаты $v_5' = (-0.0001, 0)$ валидатор отверг результат с кодом `INVARIANT_VIOLATION_ISOMETRY`.
   - Тест `EXP-002-TEST-06`: при ложном утверждении агента о коммутативности сгибов валидатор вычислил разность $\|T_A - T_B\|_F = 2.8284$ и отверг утверждение с кодом `NON_COMMUTATIVE_COMPOSITION_MISMATCH`.

---

## 5. Контракт геометрических пересечений (Model A)

| Тип контакта | Топологическое условие | Площадь перекрытия $S$ | Проверочный тест | Статус проверки |
| :--- | :--- | :---: | :---: | :---: |
| **`NO_CONTACT` / `NONE`** | Грани разобщены ($\operatorname{dist}(F_1, F_2) > \epsilon_{\text{coord}}$) | $S \equiv 0.0$ | Аналитический контроль | `CONFIRMED_BY_TEST` |
| **`VERTEX_CONTACT`** | Касание ровно в одной вершине ($\dim = 0$) | $S \equiv 0.0$ | Аналитический контроль | `CONFIRMED_BY_TEST` |
| **`SEGMENT_CONTACT`** | Касание по 1D-отрезку границы ($\dim = 1$) | $S \equiv 0.0$ | `EXP-001-TEST-05` (до сгиба) | `CONFIRMED_BY_TEST` |
| **`AREA_OVERLAP`** | 2D-перекрытие внутренних областей ($\dim = 2$) | $S > \epsilon_{\text{area}}$ | `EXP-001-TEST-06` ($S=2.0$)<br>`EXP-001-TEST-07` ($S=1.0$)<br>`EXP-002-TEST-07` ($S=0.125$) | `CONFIRMED_BY_TEST` |

### Границы алгоритма отсечения:
- Алгоритм Сазерленда–Ходжмана гарантирует корректность **исключительно для выпуклых полигонов** (`CONVEX_ONLY`).
- Невыпуклые (вогнутые), многоконтурные и самопересекающиеся многоугольники **не поддерживаются** текущей реализацией и классифицируются как `OUT_OF_SCOPE`.

---

## 6. Реестр доказательств Gate 1 (Evidence Registry)

| Идентификатор утверждения | Формулировка утверждения | Подтверждающий файл / тест | Статус доказанности |
| :--- | :--- | :--- | :---: |
| **EV-01: R_ISO** | Линейный оператор $R = 2uu^T - I$ сохраняет евклидовы расстояния | `reflection.ts`, `EXP-001-TEST-03`, `AUDIT-EXT-01` | `CONFIRMED_BY_TEST` |
| **EV-02: R_INV** | Преобразование отражения инволютивно: $R^2 = I$ | `reflection.ts`, `AUDIT-EXT-01` | `CONFIRMED_BY_ANALYTIC_CHECK` |
| **EV-03: R_DET** | Определитель матрицы отражения равен строго $-1.0$ | `reflection.ts`, `AUDIT-EXT-01` | `CONFIRMED_BY_TEST` |
| **EV-04: R_AXIS** | Точки оси сгиба $p \in L$ неподвижны: $p' = p$ | `reflection.ts`, `EXP-001-TEST-02`, `AUDIT-EXT-01` | `CONFIRMED_BY_TEST` |
| **EV-05: AREA_UNS** | Беззнаковая геометрическая площадь инвариантна при сгибе | `reflection.ts`, `EXP-001-TEST-04` | `CONFIRMED_BY_TEST` |
| **EV-06: AREA_SGN** | Ориентированная площадь Гаусса меняет знак ($A' = -A$) | `reflection.ts`, `EXP-001-TEST-04` | `CONFIRMED_BY_TEST` |
| **EV-07: COMP_ROT** | Композиция отражений на пересекающихся осях даёт поворот на $2\theta$ | `reflection.ts`, `EXP-002-TEST-01`, `EXP-002-TEST-02` | `CONFIRMED_BY_TEST` |
| **EV-08: NON_COMM** | Композиция сгибов строго некоммутативна ($R_2 R_1 \ne R_1 R_2$) | `reflection.ts`, `EXP-002-TEST-03`, `EXP-002-TEST-06` | `CONFIRMED_BY_TEST` |
| **EV-09: COMP_TRANS** | Композиция отражений на параллельных осях даёт сдвиг на $2d$ | `reflection.ts`, `EXP-002-TEST-04` | `CONFIRMED_BY_TEST` |
| **EV-10: CLOSED_CYC** | Четырёхкратный ортогональный цикл замыкается в тождество: $T = +I$ | `reflection.ts`, `EXP-002-TEST-05` | `CONFIRMED_BY_TEST` |
| **EV-11: CORNER_S** | Перекрытие при сгибе угла (Случай 2.2) равно $S = 0.125 = 1/8$ | `testRunner.ts`, `EXP-002-TEST-07` | `CONFIRMED_BY_TEST` |
| **EV-12: SEG_CONTACT**| Смежные грани до сгиба имеют контакт отрезка с $S = 0.0$ | `independentVerifier.ts`, `EXP-001-TEST-05` | `CONFIRMED_BY_TEST` |
| **EV-13: ZERO_VEC** | Нулевой вектор направления явно отклоняется | `reflection.ts`, `AUDIT-EXT-02` | `CONFIRMED_BY_TEST` |
| **EV-14: NAN_REJECT** | Координаты `NaN` и `Infinity` явно отклоняются | `reflection.ts`, `AUDIT-EXT-03` | `CONFIRMED_BY_TEST` |
| **EV-15: TOL_SCALE** | Масштабно-инвариантная универсальная политика эпсилон | `EXPERIMENTS/EXPERIMENT_GAPS.md` (`GAP-09`) | `UNRESOLVED` |
| **EV-16: NON_CONVEX** | Отсечение невыпуклых (вогнутых) полигонов | `clipConvexPolygons` | `OUT_OF_SCOPE` |
| **EV-17: LAYER_DAG** | Разрешение порядка наслоения слоёв бумаги | `THEORY/CORRECTNESS_LEVELS.md` (Уровень L3) | `OUT_OF_SCOPE` |
| **EV-18: THICK_T** | Модель физической толщины бумаги ($t > 0$) | `THEORY/FOUNDATIONS.md` (Модель C) | `OUT_OF_SCOPE` |
| **EV-19: 3D_KINEM** | Трёхмерная пространственная кинематика сгибания | `THEORY/FOUNDATIONS.md` (Модель B) | `OUT_OF_SCOPE` |

---

## 7. Остаточные ограничения и границы ответственности

1. **Модель A (2D Flat Projections Only):**  
   Ядро оперирует исключительно плоскими проекциями на плоскости $\mathbb{R}^2$. Физическая толщина бумаги принята равной $t \equiv 0$.
2. **Ограничение выпуклости (Convex Only):**  
   Любые операции пересечения граней гарантированы только для выпуклых полигонов. Подача вогнутого полигона требует предварительной триангуляции или алгоритма Мартинеса–Руэды (задача последующих фаз).
3. **Фиксация области допусков:**  
   Допуски $\epsilon_{\text{coord}} = 10^{-7}$ и $\epsilon_{\text{area}} = 10^{-9}$ действуют строго в пределах масштаба фикстур $L \in [0, 2]$.
4. **Независимость направлений Gate 2:**  
   Исследование невыпуклой геометрии и построение графа наслоения слоёв (Layer Stacking DAG) признаны **двумя отдельными независимыми исследовательскими задачами** и не должны смешиваться в одной реализации.

---

## 8. Декларация о заморозке доказательств (Evidence Freeze)

Реализация первого ядра PCRS (Gate 1) признаётся **завершённой, протестированной и замороженной**. Дальнейшие модификации файлов ядра `src/core/` и валидатора `src/verifier/` в рамках Gate 1 прекращены. Переход к проектированию спецификаций следующей фазы открыт.
