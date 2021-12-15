import { Escape } from '@fe/core/command'
import { getActionHandler, registerAction } from '@fe/core/action'
import { useToast } from '@fe/support/ui/toast'
import store from '@fe/support/store'
import type { Components } from '@fe/types'
import { t } from './i18n'
import { emitResize } from './layout'

export type MenuItem = Components.ContextMenu.Item
export type BuildContextMenu = (items: MenuItem[], e: MouseEvent) => void

let enableSyncScroll = true
let syncScrollTimer: any

const contextMenuFunList: BuildContextMenu[] = []

function present (flag: boolean) {
  if (flag) {
    useToast().show('info', t('exit-presentation-msg'))
  }
  store.commit('setPresentation', flag)
  setTimeout(() => {
    emitResize()
  }, 0)
}

/**
 * Rerender view.
 */
export function render () {
  getActionHandler('view.render')()
}

/**
 * Refresh view.
 */
export function refresh () {
  getActionHandler('view.refresh')()
}

/**
 * Reveal line.
 * @param startLine
 * @param endLine
 */
export function revealLine (startLine: number, endLine?: number) {
  getActionHandler('view.reveal-line')(startLine, endLine)
}

/**
 * Scroll to a position.
 * @param top
 */
export function scrollTopTo (top: number) {
  getActionHandler('view.scroll-top-to')(top)
}

/**
 * Get rendered HTML.
 * @returns HTML
 */
export function getContentHtml () {
  return getActionHandler('view.get-content-html')()
}

/**
 * Get view dom.
 * @returns
 */
export function getViewDom () {
  return getActionHandler('view.get-view-dom')()
}

/**
 * Get render env.
 * @returns
 */
export function getRenderEnv () {
  return getActionHandler('view.get-render-env')()
}

/**
 * Enter presentation mode.
 */
export function enterPresent () {
  getActionHandler('view.enter-presentation')()
}

/**
 * Exit presentation mode.
 */
export function exitPresent () {
  getActionHandler('view.exit-presentation')()
}

/**
 * Toggle auto render preview.
 * @param flag
 */
export function toggleAutoPreview (flag?: boolean) {
  const showXterm = store.state.autoPreview
  store.commit('setAutoPreview', typeof flag === 'boolean' ? flag : !showXterm)
}

/**
 * Add a context menu processor.
 * @param fun
 */
export function tapContextMenus (fun: BuildContextMenu) {
  contextMenuFunList.push(fun)
}

/**
 * Get context menus
 * @param e
 * @returns
 */
export function getContextMenuItems (e: MouseEvent) {
  const items: MenuItem[] = []

  contextMenuFunList.forEach((fun) => {
    fun(items, e)
  })

  return items
}

/**
 * get enableSyncScroll
 * @returns
 */
export function getEnableSyncScroll () {
  return enableSyncScroll
}

/**
 * disable sync scroll for a while
 * @param fn
 * @param timeout
 */
export async function disableSyncScrollAwhile (fn: Function, timeout = 500) {
  clearTimeout(syncScrollTimer)
  enableSyncScroll = false
  await fn()
  syncScrollTimer = setTimeout(() => {
    enableSyncScroll = true
  }, timeout)
}

registerAction({
  name: 'view.enter-presentation',
  handler: () => present(true),
  keys: ['F5']
})

registerAction({
  name: 'view.exit-presentation',
  handler: () => present(false),
  keys: [Escape],
  when: () => {
    const el = window.document.activeElement
    return store.state.presentation &&
      el?.tagName !== 'INPUT' &&
      el?.tagName !== 'TEXTAREA' &&
      [...document.body.children] // has mask?
        .filter(x => x.tagName === 'DIV' && x.clientWidth > 10 && x.clientHeight > 10)
        .length < 2
  }
})
