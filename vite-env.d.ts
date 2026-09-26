/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL: string
  readonly VITE_AD_PUBLISHER_ID: string
  readonly VITE_AD_SLOT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
