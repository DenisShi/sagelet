/// <reference types="vite/client" />

import type { SageletApi } from '../../shared/contracts'

declare global {
  interface Window {
    sagelet: SageletApi
  }
}

export {}
