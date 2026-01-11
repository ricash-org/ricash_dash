# E2E Smoke Plan (Playwright)

This project does not include Playwright dependencies yet. To enable E2E tests:

1. Install
   - pnpm add -D @playwright/test
   - npx playwright install --with-deps

2. Scripts (package.json)
   - "test:e2e": "playwright test"

3. Smoke scenarios
   - login-otp.spec: phone → request OTP → enter 4 digits → lands on /app/dashboard
   - rbac-routes.spec: login as SUPER_ADMIN → access /app/users/kyc and /app/funds/approval

Folder structure
- tests/e2e/login-otp.spec.ts
- tests/e2e/rbac-routes.spec.ts

Note: These specs assume the mock OTP accepts any 4-digit code and SUPER_ADMIN role is granted on phone login (as in AuthContext mock).

