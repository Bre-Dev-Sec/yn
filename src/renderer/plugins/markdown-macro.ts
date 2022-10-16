import { escapeRegExp, omit } from 'lodash-es'
import frontMatter from 'front-matter'
import type { Plugin } from '@fe/context'
import type { Doc } from '@fe/types'
import type { MenuItem } from '@fe/services/status-bar'
import { render } from '@fe/services/view'
import { t } from '@fe/services/i18n'
import { readFile } from '@fe/support/api'
import { getLogger, md5 } from '@fe/utils'
import { basename, dirname, resolve } from '@fe/utils/path'
import { getPurchased } from '@fe/others/premium'
import ctx from '@fe/context'

type Result = { __macroResult: true, vars?: Record<string, any>, value: string }
type CacheItem = {
  $define: Record<string, any>
  $include?: Record<string, CacheItem>
} & Record<string, Result | Promise<Result>>

const logger = getLogger('plugin-macro')
const debounceToast = ctx.lib.lodash.debounce((...args: [any, any]) => ctx.ui.useToast().show(...args), 300)
const magicNewline = '--yn-macro-new-line--'

const AsyncFunction = Object.getPrototypeOf(async () => 0).constructor
let macroOuterVars = {}

const globalVars = {
  $export: exportVar,
  $afterMacro: afterMacro,
  $ctx: ctx,
  $noop: noop,
}

function lineCount (str: string) {
  let s = 1
  const len = str.length

  for (let i = 0; i < len; i++) {
    if (str.charCodeAt(i) === 0x0A) {
      s++
    }
  }

  return s
}

function wrapResult (result: any) {
  let value = result
  let res = result
  if (result.__macroResult) {
    value = result.value
  } else {
    res = { __macroResult: true, value: '' + value }
  }

  if (
    value === null ||
    typeof value === 'function' ||
    typeof value === 'symbol' ||
    typeof value === 'undefined' ||
    (typeof value === 'object')
  ) {
    throw new Error('Macro result type error.')
  }

  return res
}

function macro (exp: string, vars: Record<string, any>): Result | Promise<Result> {
  logger.debug('macro', exp)

  exp = exp.replaceAll(magicNewline, '\n')

  const FunctionConstructor = exp.startsWith('await') ? AsyncFunction : Function
  const fun = new FunctionConstructor('vars', `with (vars) { return (${exp}); }`)

  let result = fun(vars)

  if (!(result instanceof Promise)) {
    return wrapResult(result)
  }

  result = result.then(wrapResult)

  return result
}

function transform (
  src: string,
  vars: Record<string, any>,
  options: {
    autoRerender: boolean,
    purchased: boolean,
    cache: CacheItem,
    callback?: (result: Result | Promise<Result>, match: string, matchPos: number) => void
  },
) {
  const define = { ...vars.define, ...options.cache.$define }
  vars.define = define
  const keys = Object.keys(define)
  if (keys.length) {
    const reg = new RegExp(keys.map(escapeRegExp).join('|'), 'g')
    src = src.replace(reg, match => {
      const val = define[match]
      // only support single line macro expression
      if (typeof val === 'string' && /^\s*\[=.+?=\]\s*$/s.test(val)) {
        // single line expression
        return val.trim().replaceAll('\n', magicNewline)
      } else {
        match = match.replace(/\n|'/, '\\$&')
        return `[= define['${match}'] =]`
      }
    })
  }

  return src.replace(/\[=.+?=\]/gs, (match, matchPos) => {
    try {
      const exp = match
        .substring(2, match.length - 2)
        .trim()
        .replace(/=\\\]|\[\\=/g, x => x.replace('\\', ''))

      const id = md5(exp)

      let result: Result | Promise<Result>
      if (options.purchased) {
        if (options.cache[id]) {
          result = options.cache[id]
          if (!(result instanceof Promise) && result.vars) {
            // update vars to newer
            Object.assign(result.vars, vars)
          }
        } else {
          macroOuterVars = vars
          result = macro(exp, vars)
          macroOuterVars = {}
          if (result instanceof Promise) {
            options.cache[id] = result
              .catch(() => ({ __macroResult: true, value: match } as Result))
              .then(res => {
                options.cache[id] = res
                options.autoRerender && render()
                return res
              })
          }
        }
      } else {
        result = { __macroResult: true, value: t('premium.need-purchase', 'Macro') + `, <a href="javascript: ctx.showPremium()">${t('premium.buy-license')}</a> ` }
      }

      options.callback?.(result, match, matchPos)

      if (result instanceof Promise) {
        return 'macro is running……'
      }

      if (result.vars) {
        Object.assign(vars, result.vars, { define })
      }

      return result.value
    } catch {
      macroOuterVars = {}
    }

    return match.replaceAll(magicNewline, '\n')
  })
}

function exportVar (key: string, val: any): Result {
  return { __macroResult: true, vars: { [key]: val }, value: '' }
}

function afterMacro (fn: (src: string) => string): Result {
  return { __macroResult: true, vars: { $__hook_after_macro: fn }, value: '' }
}

// do nothing, text placeholder
function noop () {
  return { __macroResult: true, value: '' }
}

async function include (
  options: {
    belongDoc: Doc | undefined | null
    purchased: boolean,
    cache: CacheItem,
    count: number,
  },
  path: string,
  trim = false
): Promise<Result> {
  const { belongDoc } = options

  if (!belongDoc) {
    throw new Error('Current document is null')
  }

  if (options.count >= 3) {
    return { __macroResult: true, value: 'Error: $include maximum call stack size exceeded [3]' }
  }

  if (!path.endsWith('.md')) {
    return { __macroResult: true, value: 'Error: $include markdown file only' }
  }

  const outerVars = { ...macroOuterVars }

  try {
    const absolutePath = resolve(dirname(belongDoc.path), path)
    const file: Doc = { type: 'file', name: basename(absolutePath), repo: belongDoc.repo, path: absolutePath }
    const { content } = await readFile(file)
    const fm = frontMatter(content)

    // merge front-matter attributes to current document vars.
    const vars: Record<string, any> = {
      ...outerVars,
      ...globalVars,
      $include: include.bind(null, { ...options, belongDoc: file, count: options.count + 1 }),
      $doc: {
        basename: file.name ? file.name.substring(0, file.name.lastIndexOf('.')) : '',
        ...ctx.lib.lodash.pick(file, 'name', 'repo', 'path', 'content', 'status')
      },
    }

    const cache = options.cache
    if (options.count === 0 && !options.cache.$include) {
      cache.$include = {}
    }

    if (fm.attributes && typeof fm.attributes === 'object') {
      // only add new attributes
      Object.assign(vars, fm.attributes, { ...vars })
      if (vars.define && typeof vars.define === 'object') {
        Object.assign(cache.$define, vars.define)
      }
    }

    const cacheKey = '' + options.count + file.repo + file.path
    if (!cache.$include![cacheKey]) {
      cache.$include![cacheKey] = { $define: {} } as CacheItem
    }

    const body = trim ? fm.body.trim() : fm.body

    const tasks: Promise<Result>[] = []
    let value = transform(
      body,
      vars,
      {
        ...options,
        cache: cache.$include![cacheKey],
        autoRerender: false,
        callback: res => {
          if (res instanceof Promise) {
            tasks.push(res)
          }
        }
      }
    )

    if (tasks.length > 0) {
      await Promise.allSettled(tasks)

      // get final result
      value = transform(
        body,
        vars,
        {
          ...options,
          cache: cache.$include![cacheKey],
          autoRerender: false,
        }
      )
    }

    return { __macroResult: true, vars: omit(vars, '$include', '$doc'), value }
  } catch (error: any) {
    return error.message
  }
}

function hookAfter (body: string, vars: Record<string, any>) {
  if (vars.$__hook_after_macro && typeof vars.$__hook_after_macro === 'function') {
    try {
      return vars.$__hook_after_macro(body)
    } catch (error) {
      debounceToast('warning', `[$afterMacro]: ${error}`)
      return body
    }
  }

  return body
}

export default {
  name: 'markdown-macro',
  register: ctx => {
    ctx.markdown.registerPlugin(md => {
      md.core.ruler.after('normalize', 'after_normalize', (state) => {
        const env = state.env || {}
        const file = env.file || {}

        if (!env.attributes || !env.attributes.enableMacro) {
          return false
        }

        const cache = ctx.markdown.getRenderCache('plugin-macro', 'cache', { $define: {} } as CacheItem)

        const options = {
          purchased: getPurchased() || file.repo === '__help__',
          cache,
          autoRerender: true,
        }

        const vars: Record<string, any> = {
          ...globalVars,
          $include: include.bind(null, { ...options, belongDoc: file, count: 0 }),
          $doc: {
            basename: file.name ? file.name.substring(0, file.name.lastIndexOf('.')) : '',
            ...ctx.lib.lodash.pick(env.file, 'name', 'repo', 'path', 'content', 'status')
          },
          ...env.attributes,
        }

        if (!env.macroLines) {
          env.macroLines = []
        }

        let lineOffset = 0
        let posOffset = 0

        const bodyBeginPos = env.bodyBeginPos || 0
        const head = state.src.substring(0, bodyBeginPos)
        const body = state.src.substring(bodyBeginPos)

        const srcBody = transform(body, vars, {
          ...options,
          callback: (result, match, matchPos) => {
            if (result instanceof Promise) {
              return
            }

            const resultStr = result.value
            const matchLine = lineCount(match)
            const resultLine = lineCount(resultStr)

            if (resultLine !== matchLine) {
              const currentLineOffset = (matchLine - resultLine)
              const currentPosOffset = (match.length - resultStr.length)
              lineOffset += currentLineOffset
              posOffset += currentPosOffset
              env.macroLines.push({
                matchPos,
                matchLine,
                resultLine,
                lineOffset,
                posOffset,
                currentPosOffset,
                currentLineOffset,
                matchLength: match.length,
                resultLength: resultStr.length,
              })
            }
          }
        })

        state.src = head + hookAfter(srcBody, vars)
        state.env.originSource = state.env.source
        state.env.source = state.src

        return false
      })
    })

    ctx.registerHook('STARTUP', () => {
      ctx.statusBar.tapMenus(menus => {
        const list = menus['status-bar-tool']?.list
        if (list) {
          const id = 'plugin.markdown-macro.copy-markdown'
          const menu: MenuItem = {
            id,
            type: 'normal',
            hidden: !(ctx.view.getRenderEnv()?.attributes?.enableMacro),
            title: ctx.i18n.t('status-bar.tool.macro-copy-markdown'),
            onClick: () => {
              ctx.utils.copyText(ctx.view.getRenderEnv()?.source)
            }
          }

          const item = list.find(x => x.type === 'normal' && x.id === id)
          if (item) {
            Object.assign(item, menu)
          } else {
            list.push(menu)
          }
        }
      })
    })

    ctx.registerHook('VIEW_RENDERED', () => {
      ctx.statusBar.refreshMenu()
    })

    ctx.editor.tapSimpleCompletionItems(items => {
      /* eslint-disable no-template-curly-in-string */

      items.push(
        { label: '/ [= Macro', insertText: '[= ${1:1+1} =]' },
        { label: '/ [= Macro $include', insertText: '[= \\$include(\'$1\') =]' },
        { label: '/ [= Macro $afterMacro', insertText: '[= \\$afterMacro(src => { \n return src.toUpperCase(); \n}) =]' },
      )
    })

    ctx.editor.tapMarkdownMonarchLanguage(mdLanguage => {
      mdLanguage.tokenizer.root.unshift(
        [/\[=/, { token: 'keyword', next: '@monacoEnd', nextEmbedded: 'text/javascript' }],
      )

      mdLanguage.tokenizer.monacoEnd = [
        [/=\]/, { token: 'keyword', next: '@pop', nextEmbedded: '@pop' }]
      ]
    })
  }
} as Plugin
