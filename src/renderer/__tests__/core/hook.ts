import * as hook from '@fe/core/hook'
import * as ioc from '@fe/core/ioc'

jest.mock('@fe/utils', () => ({
  getLogger: () => new Proxy({}, { get: () => () => 0 })
}))

afterEach(() => {
  ioc.removeAll('ACTION_AFTER_RUN')
})

test('hook usage 1', async () => {
  const fn1 = jest.fn()
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(res).toBe(undefined)
})

test('hook usage 2', async () => {
  const fn1 = jest.fn().mockReturnValue(true)
  const fn2 = jest.fn().mockReturnValue(true)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toHaveBeenCalledWith({ name: 'test' })
})

test('hook usage 3', async () => {
  const fn1 = jest.fn().mockReturnValue(true)
  const fn2 = jest.fn().mockReturnValue(true)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' }, { breakable: true })
  expect(res).toBe(true)
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toBeCalledTimes(0)
})

test('hook usage 4', async () => {
  const fn1 = jest.fn().mockReturnValue(Promise.resolve(true))
  const fn2 = jest.fn().mockReturnValue(true)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' }, { breakable: true })
  expect(res).toBe(true)
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toBeCalledTimes(0)
})

test('hook usage 5', async () => {
  const fn1 = jest.fn().mockReturnValue(false)
  const fn2 = jest.fn().mockReturnValue(true)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' }, { breakable: true })
  expect(res).toBe(true)
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toHaveBeenCalledWith({ name: 'test' })
})

test('hook usage 6', async () => {
  const fn1 = jest.fn().mockReturnValue(Promise.resolve(false))
  const fn2 = jest.fn().mockReturnValue(true)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' }, { breakable: true })
  expect(res).toBe(true)
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toHaveBeenCalledWith({ name: 'test' })
})

test('hook usage 7', async () => {
  const fn1 = jest.fn().mockReturnValue(Promise.resolve(false))
  const fn2 = jest.fn().mockReturnValue(false)
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  hook.registerHook('ACTION_AFTER_RUN', fn2)
  const res = await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' }, { breakable: true })
  expect(res).toBe(false)
  expect(fn1).toHaveBeenCalledWith({ name: 'test' })
  expect(fn2).toHaveBeenCalledWith({ name: 'test' })
})

test('hook usage 8', async () => {
  const fn1 = jest.fn()
  hook.registerHook('ACTION_AFTER_RUN', fn1)
  await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  expect(fn1).toBeCalledTimes(2)
})

test('hook usage 8', async () => {
  const fn1: any = jest.fn()
  hook.registerHook('ACTION_AFTER_RUN', fn1, true)
  await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  await hook.triggerHook('ACTION_AFTER_RUN', { name: 'test' })
  expect(fn1).toBeCalledTimes(1)
})
