/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOVERNANCE_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}