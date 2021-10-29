import { Plugin } from '@fe/context'
import { FLAG_DISABLE_XTERM } from '@fe/support/args'
import { getActionHandler } from '@fe/core/action'
import { getKeysLabel } from '@fe/core/command'

export default {
  name: 'status-bar-view',
  register: ctx => {
    const updateMenu = () => {
      const toggleTitle = (flag: boolean, title: string) => (flag ? '隐藏' : '显示') + title

      ctx.statusBar.tapMenus(menus => {
        menus['status-bar-view'] = {
          id: 'status-bar-view',
          position: 'left',
          title: '视图',
          list: [
            {
              id: 'toggle-side',
              type: 'normal',
              title: toggleTitle(ctx.store.state.showSide, '侧栏'),
              subTitle: getKeysLabel('layout.toggle-side'),
              onClick: () => getActionHandler('layout.toggle-side')()
            },
            {
              id: 'toggle-editor',
              type: 'normal',
              title: toggleTitle(ctx.store.state.showEditor, '编辑'),
              subTitle: getKeysLabel('layout.toggle-editor'),
              onClick: () => getActionHandler('layout.toggle-editor')()
            },
            {
              id: 'toggle-view',
              type: 'normal',
              title: toggleTitle(ctx.store.state.showView, '预览'),
              subTitle: getKeysLabel('layout.toggle-view'),
              onClick: () => getActionHandler('layout.toggle-view')()
            },
            ...(!FLAG_DISABLE_XTERM ? [{
              id: 'toggle-xterm',
              type: 'normal' as any,
              title: toggleTitle(ctx.store.state.showXterm, '终端'),
              subTitle: getKeysLabel('layout.toggle-xterm'),
              onClick: () => getActionHandler('layout.toggle-xterm')()
            }] : []),
            {
              id: 'toggle-wrap',
              type: 'normal',
              title: '切换换行',
              subTitle: getKeysLabel('editor.toggle-wrap'),
              onClick: () => getActionHandler('editor.toggle-wrap')()
            },
          ]
        }
      })
    }

    ctx.store.watch((state: any) => {
      return Object.keys(state).filter(key => key.startsWith('show')).map((key: any) => state[key]).join()
    }, updateMenu, { immediate: true })
  }
} as Plugin
