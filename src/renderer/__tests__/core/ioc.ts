import * as ioc from '@fe/core/ioc'

test('ioc usage', () => {
  expect(ioc.container).toEqual({})
  expect(ioc.get('ACTION_AFTER_RUN')).toEqual([])
  ioc.remove('ACTION_AFTER_RUN', null)
  ioc.register('ACTION_AFTER_RUN', 'test')
  ioc.register('ACTION_AFTER_RUN', 'test1')
  expect(ioc.get('ACTION_AFTER_RUN')).toEqual(['test', 'test1'])
  ioc.remove('ACTION_AFTER_RUN', 'test2')
  expect(ioc.get('ACTION_AFTER_RUN')).toEqual(['test', 'test1'])
  ioc.remove('ACTION_AFTER_RUN', 'test')
  expect(ioc.get('ACTION_AFTER_RUN')).toEqual(['test1'])
  ioc.removeAll('ACTION_AFTER_RUN')
  expect(ioc.container.ACTION_AFTER_RUN).toEqual([])

  ioc.register('ACTION_AFTER_RUN', 'test')
  ioc.register('ACTION_AFTER_RUN', 'test1')
  ioc.register('ACTION_AFTER_RUN', 'test2')
  ioc.register('ACTION_AFTER_RUN', 'test3')
  ioc.register('ACTION_AFTER_RUN', 'test4')

  ioc.removeWhen('ACTION_AFTER_RUN', item => item === 'test' || item === 'test3')
  expect(ioc.get('ACTION_AFTER_RUN')).toEqual(['test1', 'test2', 'test4'])

  ioc.removeAll('ACTION_AFTER_RUN')
  ioc.register('ACTION_AFTER_RUN', 'test')
  ioc.register('ACTION_AFTER_RUN', 'test1')
  ioc.register('ACTION_AFTER_RUN', 'test2')
  ioc.register('ACTION_AFTER_RUN', 'test3')
  ioc.register('ACTION_AFTER_RUN', 'test4')

  for (const item of ioc.get('ACTION_AFTER_RUN')) {
    ioc.remove('ACTION_AFTER_RUN', item)
  }

  expect(ioc.get('ACTION_AFTER_RUN')).toEqual([])
})
