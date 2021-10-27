import Markdown from 'markdown-it'
import mermaid from 'mermaid/dist/mermaid.js'
import { Plugin } from '@fe/context'
import { h } from 'vue'

const mermaidChart: any = (code: string) => {
  try {
    return h('div', { key: code, class: 'mermaid reduce-brightness' }, code)
  } catch ({ str }) {
    return h('pre', str)
  }
}

const MermaidPlugin = (md: Markdown) => {
  mermaid.initialize({})

  const temp = md.renderer.rules.fence!.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      return mermaidChart(code)
    }
    const firstLine = code.split(/\n/)[0].trim()
    if (firstLine === 'gantt' || firstLine === 'sequenceDiagram' || firstLine.match(/^graph (?:TB|BT|RL|LR|TD);?$/)) {
      return mermaidChart(code)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default {
  name: 'markdown-mermaid',
  register: ctx => {
    ctx.theme.addStyles(`
      .markdown-view .markdown-body .mermaid {
        background: #fff;
      }
    `)
    ctx.markdown.registerPlugin(MermaidPlugin)
    ctx.registerHook('ON_VIEW_RENDERED', () => mermaid.init('.mermaid'))
  }
} as Plugin
