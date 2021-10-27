import * as api from '@fe/support/api'
import { FLAG_DISABLE_XTERM } from '@fe/support/args'
import store from '@fe/support/store'
import { BuildInSettings } from '@fe/types'
import { getThemeName } from './theme'

export type Schema = {
  type: string,
  title: string,
  properties: {[K in keyof BuildInSettings]: {
    defaultValue: BuildInSettings[K] extends any ? BuildInSettings[K] : any
    [key: string]: any,
  }},
  required: (keyof BuildInSettings)[],
}

const schema: Schema = {
  type: 'object',
  title: '配置项',
  properties: {
    repos: {
      defaultValue: [],
      type: 'array',
      title: '仓库',
      format: 'table',
      items: {
        type: 'object',
        title: '仓库',
        properties: {
          name: {
            type: 'string',
            title: '仓库名',
            maxLength: 10,
            options: {
              inputAttributes: { placeholder: '请输入' }
            },
          },
          path: {
            type: 'string',
            title: '路径',
            readonly: true,
            options: {
              inputAttributes: { placeholder: '请选择储存位置', style: 'cursor: pointer' }
            },
          }
        }
      },
    },
    theme: {
      defaultValue: 'system',
      title: '主题',
      type: 'string',
      enum: ['system', 'dark', 'light']
    },
    'assets-dir': {
      defaultValue: './FILES/{docSlug}',
      title: '图片存放目录',
      type: 'string',
      minLength: 1,
      description: '支持相对路径和绝对路径（限于仓库内部）,可用变量：docSlug, date'
    } as any,
    shell: {
      defaultValue: '',
      title: '终端 Shell',
      type: 'string',
    } as any,
  } as any,
  required: ['theme'],
}

const settings = getDefaultSetting()

if (FLAG_DISABLE_XTERM) {
  delete (schema.properties as any).shell
}

export function getSchema () {
  return schema
}

export function tapSchema (fun: (schema: Schema) => void) {
  fun(schema)
}

function transformSettings (data: any) {
  data.repos = Object.keys(data.repositories).map(name => ({
    name,
    path: data.repositories[name]
  }))

  data.theme = getThemeName()

  delete data.repositories

  return data
}

export function getDefaultSetting () {
  return Object.fromEntries(
    Object.entries(schema.properties).map(([key, val]) => [key, val.defaultValue])
  ) as BuildInSettings
}

export async function fetchSettings () {
  const data = transformSettings(await api.fetchSettings())

  return Object.assign(settings, {
    ...getDefaultSetting(),
    ...data
  })
}

export async function writeSettings (value: Record<string, any>) {
  const repositories: any = {}
  value.repos.forEach(({ name, path }: any) => {
    name = name.trim()
    path = path.trim()
    if (name && path) {
      repositories[name] = path
    }
  })

  delete value.repos
  delete value.theme
  value.repositories = repositories

  await api.writeSettings(value)
  return await fetchSettings()
}

export function getSettings () {
  return settings
}

export function showSettingPanel () {
  store.commit('setShowSetting', true)
}

export function hideSettingPanel () {
  store.commit('setShowSetting', false)
}
