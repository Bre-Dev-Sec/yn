import type { Plugin, Ctx } from '@fe/context'
import type { BuildInActionName, Doc } from '@fe/types'

export default {
  name: 'document-history-stack',
  register: (ctx: Ctx) => {
    let stack: Doc[] = []
    let idx = -1

    const backId: BuildInActionName = 'plugin.document-history-stack.back'
    const forwardId: BuildInActionName = 'plugin.document-history-stack.forward'

    function go (offset: number) {
      const index = idx + offset
      if (index >= stack.length || index < 0) {
        return
      }

      const nextFile = stack[index]
      if (!ctx.doc.isSameFile(nextFile, ctx.store.state.currentFile)) {
        ctx.doc.switchDoc(nextFile)
      }

      idx = index
      updateMenu()
    }

    function updateMenu () {
      ctx.statusBar.tapMenus(menus => {
        const list = menus['status-bar-navigation']?.list || []
        if (list) {
          menus['status-bar-navigation'].list = [
            {
              id: forwardId,
              type: 'normal' as any,
              title: '前进',
              disabled: idx >= stack.length - 1,
              subTitle: ctx.shortcut.getKeysLabel(forwardId),
              onClick: () => ctx.action.getActionHandler(forwardId)()
            },
            {
              id: backId,
              type: 'normal' as any,
              title: '后退',
              disabled: idx <= 0,
              subTitle: ctx.shortcut.getKeysLabel(backId),
              onClick: () => ctx.action.getActionHandler(backId)()
            },
          ].concat(list.filter(x => ![forwardId, backId].includes(x.id as BuildInActionName)) as any)
        }
      })
    }

    function removeFromStack (doc?: Doc) {
      stack = stack.filter(x => !ctx.doc.isSubOrSameFile(doc, x))
      idx = stack.length - 1
      updateMenu()
    }

    ctx.bus.on('doc.switched', (file?: Doc | null) => {
      if (file) {
        if (!ctx.doc.isSameFile(stack[idx], file)) {
          stack.splice(idx + 1, stack.length)
          stack.push({ type: file.type, repo: file.repo, name: file.name, path: file.path })
          idx = stack.length - 1
        }
      }
      updateMenu()
    })

    ctx.bus.on('doc.deleted', removeFromStack)
    ctx.bus.on('doc.moved', ({ oldDoc }) => removeFromStack(oldDoc))

    ctx.action.registerAction({
      name: backId,
      handler: () => go(-1),
      keys: [ctx.shortcut.Alt, ctx.shortcut.BracketLeft],
    })

    ctx.action.registerAction({
      name: forwardId,
      handler: () => go(1),
      keys: [ctx.shortcut.Alt, ctx.shortcut.BracketRight],
    })
  }
} as Plugin
