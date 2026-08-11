import englishContent from './english.json'
import { LocalJsonContentProvider } from '../services/local-json-content-provider'

export const englishContentProvider = new LocalJsonContentProvider(englishContent)
