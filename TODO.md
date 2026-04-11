# TODO: Production Readiness & Technical Debt Reduction

## High-Impact Fixes

1. **Centralize API Calls & Business Logic**
   - Create a shared API utility module for all backend requests.
   - Build custom React hooks for component consumption (e.g., useTeams, useGameState).
   - Refactor all fetch logic in components to use these utilities/hooks.

2. **Refactor Large & Multi-Responsibility Components**
   - Identify and split components that handle multiple concerns or contain redundant logic.
   - Move business logic out of UI components into hooks/services.
   - Ensure each component has a single responsibility.

3. **Enable TypeScript Strict Mode**
   - Update tsconfig.json to enable strict mode.
   - Refactor code to eliminate any/unsafe types and enforce strong typing for API responses, props, and state.
   - Export shared interfaces/types from a central file.

4. **Add Prettier Formatting**
   - Install and configure Prettier for consistent code formatting.
   - Add Prettier scripts to package.json.
   - Run Prettier across the codebase.

5. **Environment Variable Handling**
   - Add .env file support for local development.
   - Refactor hardcoded values/config to use environment variables.
   - Document required environment variables in README.md.

6. **Remove Debug/Console Logs from Production Paths**
   - Audit code for console.log, alert, and other debug statements.
   - Remove or gate these logs for production builds.

## Additional Improvements

- Abstract repeated Tailwind class patterns into reusable components or CSS utilities.
- Add error handling and fallback logic for all API calls.
- Audit dependencies for outdated or unnecessary packages.
- Add ESLint for additional linting if desired.

---

## Implementation Plan

### 1. Centralize API Calls

- [x] Create `utils/api.ts` for request logic
- [x] Build hooks: `useTeams`, `useGameState`, etc.
- [x] Refactor components to use hooks/API module

### 2. Refactor Components

- [x] Identify large/multi-responsibility components
- [x] Split into smaller, focused components
- [x] Move logic to hooks/services

### 3. TypeScript Strict Mode

- [x] Enable strict mode in tsconfig.json
- [x] Refactor code for strong typing
- [x] Centralize interfaces/types

### 4. Prettier Formatting

- [ ] Install Prettier
- [ ] Configure Prettier
- [ ] Add scripts to package.json
- [ ] Format codebase

### 5. Environment Variables

- [ ] Add .env file support
- [ ] Refactor config/hardcoded values
- [ ] Update README.md with env docs

### 6. Remove Debug Code

- [ ] Audit for console.log/alert
- [ ] Remove or gate debug code

---

## Notes

- Prioritize fixes that reduce technical debt and improve maintainability.
- Focus on practical, high-impact changes that can be implemented quickly by a small team.
- Avoid unnecessary refactors or over-engineering.
