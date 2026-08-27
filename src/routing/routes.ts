import type { Locale } from '../types/domain'

export const routeFor = (locale: Locale, path = '') => `/${locale}${path || '/'}`
