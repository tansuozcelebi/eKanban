# eKanban Test Coverage Analysis

## Current Coverage (Server)

| File | Statements | Branches | Functions | Lines | Notes |
|------|-----------|----------|-----------|-------|-------|
| **All files** | **86.82%** | **80%** | **92.85%** | **86.45%** | |
| `app.js` | 85.71% | 50% | 50% | 85.71% | Production static-file branch untested |
| `config/database.js` | 60% | 78.57% | 50% | 60% | `closePool()` untested |
| `config/mikroQueries.js` | 100% | 100% | 100% | 100% | Static data, no logic |
| `middleware/dbFallback.js` | 100% | 100% | 100% | 100% | Fully covered |
| `routes/kanban.js` | 98% | 80% | 100% | 100% | Full CRUD tested |
| `routes/operations.js` | 80% | 100% | 100% | 80% | Only fallback path tested |
| `routes/stock.js` | 80% | 100% | 100% | 79.48% | Only fallback path tested |
| `routes/warehouses.js` | 84.61% | 100% | 100% | 84.61% | Only fallback path tested |

### Client Coverage: 0%

No test framework is configured and no tests exist for the React frontend.

---

## What IS Tested (44 tests, 4 suites)

1. **Kanban routes integration** — Full CRUD lifecycle (create, read, update, delete), alerts filtering, stats aggregation, status recalculation, 404 handling
2. **DB fallback routes** — Stock (list, summary, by-warehouse, search), Warehouses, Operations, Work Orders — all exercised via the demo-data fallback paths
3. **`calculateStatus` logic** — Critical/warning/ok thresholds, edge cases (zero values, equal boundaries)
4. **Demo data integrity** — Warehouse count, stock item structure, generated stock ranges, operation/work-order field completeness, unique IDs/codes

---

## Critical Coverage Gaps (Prioritized)

### Priority 1 — High Risk, Zero Coverage

#### 1. Client-Side Tests (React Components + API Layer)
**Files:** `App.js`, `Dashboard.js`, `KanbanBoard.js`, `StockLevels.js`, `Operations.js`, `api.js`
**Risk:** The entire UI has no tests. Any refactor silently breaks user-facing features.

**What to test:**
- **`api.js`** — `fetchJson`/`postJson`/`putJson`/`deleteJson` error handling (non-ok responses throw), URL construction, all endpoint wrapper functions
- **`App.js`** — Route rendering (each path shows the right page), sidebar navigation active state
- **`Dashboard.js`** — Stats card rendering, alerts section, loading/error states, data fetching on mount
- **`KanbanBoard.js`** — Card filtering by status, create/edit modal, CRUD operations, status badge colors, progress bar calculation
- **`StockLevels.js`** — Warehouse filtering, search functionality, stock grouping logic
- **`Operations.js`** — Tab switching (operations vs work orders), status filtering, progress bar rendering

**Setup needed:**
```json
// client/package.json devDependencies
"@testing-library/react": "^14.1.2",
"@testing-library/jest-dom": "^6.1.4",
"@testing-library/user-event": "^14.5.1"
```

#### 2. Database Success Path (SQL Server Integration)
**Files:** `routes/stock.js`, `routes/operations.js`, `routes/warehouses.js`
**Risk:** The `try` blocks (lines that call `getPool()` + `pool.request().query()`) are entirely uncovered. If the SQL queries or result mapping break, tests won't catch it.

**What to test:**
- Mock `mssql` to simulate a successful pool connection
- Verify correct SQL query is called for each endpoint
- Verify `req.params` / `req.query` are properly passed as SQL inputs (e.g., `stock/warehouse/:id` uses `@warehouseId`)
- Test that `result.recordset` is forwarded correctly

**Example approach:**
```js
jest.mock('../../src/config/database', () => ({
  sql: { Int: 'int', NVarChar: 'nvarchar' },
  getPool: jest.fn(),
}));
```

#### 3. `calculateStatus` Extraction & Direct Testing
**File:** `routes/kanban.js:15-19`
**Risk:** `calculateStatus` is a private function inside the route module — it can only be tested indirectly through HTTP calls. If someone modifies the function, integration tests may miss subtle logic regressions.

**Recommendation:** Extract `calculateStatus` into a shared utility (e.g., `src/utils/kanban.js`) and export it. This enables direct unit testing and reuse in other modules.

### Priority 2 — Moderate Risk

#### 4. Database Connection Management
**File:** `config/database.js`
**Lines uncovered:** 27-33 (`closePool`)
**Risk:** `closePool()` is untested. If connection cleanup fails, the server could leak SQL connections under load.

**What to test:**
- `getPool()` creates a pool on first call, returns same pool on subsequent calls
- `closePool()` closes the pool and resets it to `null`
- `getPool()` after `closePool()` creates a fresh pool

#### 5. Input Validation & Edge Cases
**Files:** All route files
**Missing tests:**
- `PUT /api/kanban/:id` with non-integer ID (e.g., `"abc"`)
- `POST /api/kanban` with missing required fields
- `GET /api/stock/warehouse/:id` with non-integer ID
- `GET /api/stock/search` with special characters / SQL injection patterns in `q` parameter
- Request body with extra unexpected fields (mass assignment)

#### 6. Production Static File Serving
**File:** `app.js:22-27`
**Risk:** The `NODE_ENV === 'production'` branch is untested (50% branch coverage). A bad path join could break production deployment.

**What to test:** Set `NODE_ENV=production` in test, verify that a GET to an unknown route serves the React SPA fallback.

### Priority 3 — Nice to Have

#### 7. Kanban Card ID Generation
**File:** `routes/kanban.js:37`
**Edge case:** When all cards are deleted, `Math.max(...[])` returns `-Infinity`. The `kanbanCards.length > 0` guard handles this, but it's worth verifying with a test that creates a card after deleting all cards.

#### 8. Health Check Timestamp Format
**File:** `app.js:31`
**Verify:** The timestamp is a valid ISO 8601 string.

---

## Recommended Implementation Plan

### Phase 1 — Harden the Backend (1-2 days)

| # | Test | Covers |
|---|------|--------|
| 1 | Extract `calculateStatus` to utility + unit tests | Core Kanban business logic |
| 2 | Mock-DB tests for stock/operations/warehouse routes | SQL query correctness, param binding |
| 3 | Edge-case tests for kanban routes | Invalid IDs, missing fields, empty state |
| 4 | `database.js` pool management tests | Connection lifecycle |

### Phase 2 — Add Frontend Testing (2-3 days)

| # | Test | Covers |
|---|------|--------|
| 5 | Set up Jest + React Testing Library in `client/` | Test infrastructure |
| 6 | `api.js` unit tests (mock `fetch`) | HTTP helper correctness, error handling |
| 7 | `App.js` routing tests | Navigation, route-component mapping |
| 8 | `KanbanBoard.js` component tests | Card CRUD, filtering, modal, status colors |
| 9 | `Dashboard.js` component tests | Stats rendering, alerts display |
| 10 | `StockLevels.js` + `Operations.js` tests | Filtering, search, tab switching |

### Phase 3 — CI & Robustness (1 day)

| # | Task | Purpose |
|---|------|---------|
| 11 | Add GitHub Actions CI workflow | Run tests on every PR |
| 12 | Add coverage thresholds to Jest config | Prevent coverage regression |
| 13 | Add E2E smoke test with Playwright/Cypress | Verify full-stack integration |

---

## Key Risks from Missing Tests

| Risk | Severity | Gap |
|------|----------|-----|
| SQL query regression breaks production data | **High** | DB success path untested |
| UI breaks silently on refactor | **High** | Zero client tests |
| `calculateStatus` logic drift | **Medium** | Not directly unit-testable (private fn) |
| SQL injection via `/api/stock/search?q=` | **Medium** | No input sanitization tests |
| Connection pool leak on server shutdown | **Low** | `closePool()` untested |
