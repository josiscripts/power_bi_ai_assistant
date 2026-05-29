/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_POWER_BI_API_KEY: string;
  readonly VITE_POWER_BI_TENANT_ID: string;
  readonly VITE_CLAUDE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
