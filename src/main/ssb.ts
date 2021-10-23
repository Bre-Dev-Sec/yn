import { app } from 'electron'
import store from './storage'
import { getAction } from './action'

const STORAGE_BOOKMARK_KEY = 'macos_file_access_bookmark'

const data: { [key: string]: string } = store.get(STORAGE_BOOKMARK_KEY) || {}

export const setAccessFileBookmark = (paths: string[], bookmarks: string[]) => {
  paths.forEach((path, idx) => {
    if (bookmarks[idx]) {
      data[path.replace(/\/$/, '')] = bookmarks[idx]
    }
  })
  store.set(STORAGE_BOOKMARK_KEY, data)
}

export const wrapAccessFileBookmark = (path: string, func: Function) => {
  if (!process.mas) {
    return func()
  }

  let bookmark: string | undefined
  for (const key of Object.keys(data)) {
    if (path.startsWith(key)) {
      bookmark = data[key]
      break
    }
  }

  const xFunc = () => {
    try {
      return func()
    } catch (error: any) {
      if (error.message.includes('EPERM: operation not permitted, scandir')) {
        getAction('show-main-window')()
        getAction('show-open-dialog')({
          properties: ['openDirectory'],
          defaultPath: path,
          message: '文件访问权限丢失，请授予储存目录权限（点击“打开”按钮）'
        }).then(() => {
          getAction('reload-main-window')()
        })

        throw new Error(`文件访问权限丢失 [${path}]`)
      }

      throw error
    }
  }

  if (!bookmark) {
    return xFunc()
  }

  try {
    const clean = app.startAccessingSecurityScopedResource(bookmark)
    try {
      const result = xFunc()
      clean()
      return result
    } catch (error) {
      clean()
      throw error
    }
  } catch (error: any) {
    if (error.message.includes('bookmarkDataIsStale')) {
      throw new Error(`书签过期，文件访问权限丢失 [${path}]`)
    }

    throw error
  }
}
