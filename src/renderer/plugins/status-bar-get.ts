import { FLAG_DEMO, URL_GITHUB, URL_MAS } from '@fe/support/args'
import { Plugin } from '@fe/context'

export default {
  name: 'status-bar-get',
  register: ctx => {
    if (FLAG_DEMO) {
      ctx.statusBar.tapMenus(menus => {
        menus['status-bar-get'] = {
          id: 'status-bar-get',
          position: 'left',
          title: ctx.i18n.t('status-bar.get.get-application'),
          icon: 'download',
          list: [
            { id: 'github', type: 'normal', title: 'GitHub', onClick: () => window.open(URL_GITHUB + '/releases') },
            { id: 'mas', type: 'normal', title: 'Mac App Store', onClick: () => window.open(URL_MAS) },
          ]
        }
      })
    }
  }
} as Plugin
