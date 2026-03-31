/// <reference types="rspress/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_SITE_TITLE: string
  readonly VITE_SITE_DESCRIPTION: string
  readonly VITE_GA_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
