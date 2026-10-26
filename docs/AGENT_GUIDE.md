# PCRS — AGENT NAVIGATION GUIDE

**Документ:** `docs/AGENT_GUIDE.md`
**Проект:** PCRS (Paper Construction Reasoning Stand)
**Цель:** Обеспечить автономное изучение, верификацию и переиспользование знаний проекта другим ИИ-агентом.

---

## A. Mission
PCRS — это исследовательский стенд для детерминированного изучения геометрических операций в 2D-евклидовой плоскости (в основном отражений) и проверки их свойств.
**Вне области (OUT_OF_SCOPE):** 3D-кинематика, физическая складываемость бумаги, толщина листа, моделирование пластической деформации.

## B. Recommended Reading Order
1.  `/README.md` — Общий обзор.
2.  `/PROJECT_CHARTER.md` — Миссия, принципы и границы.
3.  `/docs/architecture/PCRS_EPISTEMIC_STATUS_POLICY.md` — Понимание того, что есть «факт», а что — «гипотеза».
4.  `/docs/architecture/PCRS_DOCUMENTATION_REGISTER.md` — Навигация по документации.
5.  `/docs/patterns/` — Изучение канонических спецификаций паттернов (`P-01`).
6.  `/EXPERIMENTS/ORIGAMI-REFERENCE/EXPERIMENT_INDEX.md` — Результаты верификации.
7.  `/src/` — Исходный код (ядро и верификатор).

## C. Architecture Map
- **AGENT PROPOSES:** Генерирует гипотезу о геометрическом преобразовании.
- **CORE COMPUTES (`src/core/reflection.ts`):** Детерминированно выполняет вычисления в Float64 (ЗАМОРОЖЕН).
- **INDEPENDENT VERIFIER (`src/verifier/independentVerifier.ts`):** Автономно проверяет метрические инварианты (ЗАМОРОЖЕН).
- **EXPERIMENTS:** Подтверждают свойства паттернов.

## D. Mathematical Operations (P-01)
**Операция:** Planar Line Reflection (Отражение относительно прямой).
- **Математика:** Матрица Хаусхолдера $R = 2\mathbf{u}\mathbf{u}^T - I$, где $\mathbf{u}$ — единичный вектор направления оси.
- **Инварианты:** Изометрия (сохранение расстояний), сохранение площади, инверсия ориентации ($\det(R) = -1$).
- **Реализация:** `reflectPoint` (точки), `reflectPolygon` (грани).

## E. Evidence Protocol
Агент обязан различать эпистемические статусы:
1.  **CONFIRMED_BY_TEST:** Подтверждено выполнением кода (код 0, толерантность $\le \epsilon$).
2.  **CONFIRMED_BY_ANALYTIC_CHECK:** Сравнение с математическим оракулом.
3.  **UNVERIFIED:** Спецификация есть, но тесты не запущены.
4.  **HYPOTHESIS:** Требует проверки.

## F. How to Verify a Claim
1.  Найти формулу в `docs/patterns/`.
2.  Найти реализацию в `src/core/reflection.ts`.
3.  Выполнить тест из `EXPERIMENTS/` или `src/core/`.
4.  Проверить `AuditReport` верификатора на наличие ошибок (`AuditErrorCode`).
5.  Если $\Delta > \epsilon$, считать претензию `FAILED`.

## G. Safe Extension Rules
- **ЗАПРЕЩЕНО:** Редактировать `src/core/reflection.ts` и `src/verifier/independentVerifier.ts`.
- **РАЗРЕШЕНО:** Добавлять новые `docs/patterns/` (паспорта) и `EXPERIMENTS/` (тесты).
- **ПРАВИЛО:** Любой новый паттерн должен сопровождаться тестами, подтверждающими его инварианты.

## H. Current Limitations
- Только жесткая 2D-геометрия.
- Численные допуски $\epsilon$ эмпирически проверены в тестовых сценариях для области $L = \max(|x|, |y|) \le 2$ (все вершины должны находиться внутри квадрата 4x4 с центром в начале координат).
- Sutherland-Hodgman для выпуклых многоугольников.

## I. Future AI Skill Interface
Будущий Skill должен поддерживать методы:
- `validate_preconditions(pattern_id, inputs)`
- `execute_pattern(pattern_id, inputs)`
- `verify_result(pattern_id, inputs, output, expected_invariants)`
- `explain_invariants(pattern_id)`
