// Demo mode swaps Supabase reads/writes for an in-memory dataset so the app
// can be shown off without touching the real database. Toggle with the
// DEMO_MODE env var in .env.local (requires a dev server restart to take effect).
export const isDemoMode = () => process.env.DEMO_MODE === "true";
