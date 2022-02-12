/**
 * Get all params from url.
 * @returns params
 */
export function $args () {
  return new URLSearchParams(location.search)
}

export const URL_GITHUB = 'https://github.com/purocean/yn'
export const URL_MAS = 'https://apps.apple.com/cn/app/yank-note/id1551528618'

export const FLAG_DISABLE_XTERM = true
export const FLAG_MAS = true
export const FLAG_DEMO = import.meta.env.MODE === 'demo'
export const FLAG_READONLY = $args().get('readonly') === 'true'
export const FLAG_DEBUG = import.meta.env.MODE === 'development' || $args().get('debug') === 'true'
