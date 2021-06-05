import { app } from 'electron'
import store from './storage'

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

  if (!bookmark) {
    return func()
  }

  const clean = app.startAccessingSecurityScopedResource(bookmark)
  try {
    const result = func()
    clean()
    return result
  } catch (error) {
    clean()
    throw error
  }
}
