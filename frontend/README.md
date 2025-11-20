# Frontend Workspace – Chapter 6 Day 1

This workspace now hosts the Next.js 15 App Router shell that powers the `/expenses` experience described in `specs/003-frontend-integration/`.

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   npm install --prefix frontend
   ```
2. **Configure environment**
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Update `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_TELEMETRY_REFRESH_ENDPOINT` with the Chapter 5 backend + telemetry endpoints.
3. **Run the dev server with Fast 3G throttle prep**
   ```bash
   npm run dev:frontend
   ```
   - Once the Next.js server boots, open the browser devtools > **Network** > **Throttling** and select **Fast 3G**.
   - Capture skeleton timing (must appear within 200 ms) before proceeding to state screenshots.
4. **Run workspace checks**
   ```bash
   npm run lint:frontend
   npm run test:frontend
   npm run test:e2e --prefix frontend
   ```

## Screenshot & Telemetry Prep

- Keep the throttled tab open to capture `state-loading.png`, `state-empty.png`, `state-error.png`, and `state-success.png` under `specs/003-frontend-integration/`.
- Use the dedicated `dev:screenshot` script if Playwright browsers need to share a cache with the dev server while capturing UI evidence.
- Telemetry emissions reference `NEXT_PUBLIC_TELEMETRY_REFRESH_ENDPOINT`; verify the mock server receives `frontend.expenses.refresh_ms` events before recording Quickstart results.
