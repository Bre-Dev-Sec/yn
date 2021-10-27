import dayjs from 'dayjs'
import { insert, whenEditorReady } from '@fe/services/editor'
import type { Plugin } from '@fe/context'
import store from '@fe/support/store'
import { encodeMarkdownLink } from '@fe/utils'
import type { Doc } from '@fe/types'
import { dirname, isBelongTo, join, relative } from '@fe/utils/path'
import { getActionHandler } from '@fe/core/action'
import { refreshTree } from '@fe/services/tree'
import { upload } from '@fe/services/base'

async function uploadFile (file: any, asImage: boolean) {
  if (!store.state.currentFile) {
    throw new Error('当前未打开文件')
  }

  const filename = file.name
  const assetPath = await upload(file, store.state.currentFile, filename)

  if (asImage) {
    insert(`![图片](${encodeMarkdownLink(assetPath)})\n`)
  } else {
    insert(`附件 [${dayjs().format('YYYY-MM-DD HH:mm')}] [${file.name} (${(file.size / 1024).toFixed(2)}KiB)](${encodeMarkdownLink(assetPath)}){class=open target=_blank}\n`)
  }

  refreshTree()
}

function addAttachment (asImage = false) {
  const input = window.document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.onchange = async () => {
    for (let i = 0; i < input.files!.length; i++) {
      await uploadFile(input.files![i], asImage)
    }
  }
  input.click()
}

function addDocument (doc: Doc) {
  const file = store.state.currentFile
  if (file) {
    const cwd = dirname(file.path)
    const filePath = isBelongTo(cwd, doc.path)
      ? relative(cwd, doc.path)
      : join('/', doc.path)
    const fileName = doc.name.replace(/\.[^.]*$/, '')
    insert(`[${fileName}](${encodeMarkdownLink(filePath)})`)
  } else {
    throw new Error('当前未打开文件')
  }
}

export default {
  name: 'editor-attachment',
  register: () => {
    whenEditorReady().then(({ editor, monaco }) => {
      editor.addAction({
        id: 'plugin.editor.add-image',
        contextMenuGroupId: 'modification',
        label: '添加图片',
        keybindings: [
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_I
        ],
        run: () => addAttachment(true),
      })
      editor.addAction({
        id: 'plugin.editor.add-file',
        contextMenuGroupId: 'modification',
        label: '插入附件',
        keybindings: [
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_F
        ],
        run: () => addAttachment(false),
      })
      editor.addAction({
        id: 'plugin.editor.add-document',
        contextMenuGroupId: 'modification',
        label: '插入文档',
        keybindings: [
          monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KEY_I
        ],
        run: () => {
          getActionHandler('filter.choose-document')().then(addDocument)
        },
      })
    })
  }
} as Plugin
