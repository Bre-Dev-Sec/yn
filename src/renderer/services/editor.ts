import * as Monaco from 'monaco-editor'
import { FLAG_READONLY } from '@fe/support/args'
import { isElectron } from '@fe/support/env'
import { registerHook, triggerHook } from '@fe/core/hook'
import { registerAction } from '@fe/core/action'
import { Alt } from '@fe/core/command'
import { getColorScheme } from './theme'

let monaco: typeof Monaco
let editor: Monaco.editor.IStandaloneCodeEditor

/**
 * Default options.
 */
export const defaultOptions: {[key: string]: any} = {
  value: '',
  theme: getColorScheme() === 'dark' ? 'vs-dark' : 'vs',
  fontSize: 16,
  wordWrap: false,
  links: !isElectron,
  // wordWrapColumn: 40,
  // Set this to false to not auto word wrap minified files
  wordWrapMinified: true,
  mouseWheelZoom: true,
  // try "same", "indent" or "none"
  wrappingIndent: 'same',
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  scrollbar: {
    vertical: 'hidden',
    verticalScrollbarSize: 0
  },
  readOnly: FLAG_READONLY,
}

/**
 * Get Monaco
 * @returns Monaco
 */
export function getMonaco () {
  return monaco
}

/**
 * Get editor instance.
 * @returns
 */
export function getEditor () {
  return editor
}

/**
 * Ensure editor is ready.
 * @returns
 */
export function whenEditorReady (): Promise<{ editor: typeof editor, monaco: typeof monaco }> {
  if (monaco && editor) {
    return Promise.resolve({ monaco, editor })
  }

  return new Promise(resolve => {
    registerHook('EDITOR_READY', resolve)
  })
}

/**
 * Insert text at current cursor.
 * @param text
 */
export function insert (text: string) {
  const selection = getEditor().getSelection()!
  getEditor().executeEdits('', [
    {
      range: new (getMonaco().Range)(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
      text,
      forceMoveMarkers: true
    }
  ])
}

/**
 * Replace text value of line.
 * @param line
 * @param text
 */
export function replaceLine (line: number, text: string) {
  const length = getEditor().getModel()!.getLineLength(line)

  getEditor().executeEdits('', [
    { range: new (getMonaco().Range)(line, 1, line, length + 1), text }
  ])
}

/**
 * Reveal line to screen center.
 * @param line
 */
export function revealLineInCenter (line: number) {
  getEditor().revealLineInCenter(line)
}

/**
 * Reveal line.
 * @param line
 */
export function revealLine (line: number) {
  getEditor().revealLine(line)
}

/**
 * Set scroll bar position.
 * @param top
 */
export function setScrollToTop (top: number) {
  getEditor().setScrollTop(top)
}

/**
 * Get content of line.
 * @param line
 * @returns
 */
export function getLineContent (line: number) {
  return getEditor().getModel()!.getLineContent(line)
}

/**
 * Get text value.
 * @returns
 */
export function getValue () {
  return getEditor().getModel()!.getValue(getMonaco().editor.DefaultEndOfLine.LF as number)
}

/**
 * Replace text value.
 * @param search
 * @param val
 */
export function replaceValue (search: string, val: string) {
  getEditor().getModel()!.setValue(getValue().replace(search, val))
}

/**
 * Get editor selection.
 * @returns
 */
export function getSelectionInfo () {
  const selection = getEditor().getSelection()!

  return {
    line: selection.positionLineNumber,
    column: selection.positionColumn,
    lineCount: getEditor().getModel()!.getLineCount(),
    textLength: getValue().length,
    selectedLength: getEditor().getModel()!.getValueInRange(selection).length
  }
}

/**
 * Toggle editor word wrap.
 */
export function toggleWrap () {
  const isWrapping = getEditor().getOption(monaco.editor.EditorOption.wrappingInfo).isViewportWrapping
  getEditor().updateOptions({ wordWrap: (isWrapping ? 'off' : 'on') })
}

registerAction({ name: 'editor.toggle-wrap', handler: toggleWrap, keys: [Alt, 'w'] })

registerHook('MONACO_BEFORE_INIT', ({ monaco }) => {
  monaco.editor.defineTheme('vs', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#F2F2F2',
      'minimap.background': '#EEEEEE',
    }
  })

  monaco.editor.defineTheme('vs-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#131416',
      'minimap.background': '#101113',
    }
  })
})

registerHook('MONACO_READY', (payload) => {
  monaco = payload.monaco
  editor = payload.editor

  triggerHook('EDITOR_READY', payload)
})

registerHook('MONACO_CHANGE_VALUE', payload => {
  triggerHook('EDITOR_CHANGE', payload)
})

registerHook('THEME_CHANGE', () => {
  monaco?.editor.setTheme(getColorScheme() === 'dark' ? 'vs-dark' : 'vs')
})
