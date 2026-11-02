import { describe, expect, test } from 'bun:test'
import { runInNewContext } from 'node:vm'

import { themeScript } from '../src/components/theme-provider'

function bootstrap(stored, dark, blocked = false) {
  const classes = new Set(['light'])
  const root = {
    classList: {
      remove: (...values) =>
        values.forEach((value) => {
          classes.delete(value)
        }),
      add: (value) => classes.add(value),
    },
    style: {},
  }
  runInNewContext(themeScript, {
    localStorage: {
      getItem() {
        if (blocked) throw new Error('Storage blocked')
        return stored
      },
    },
    window: { matchMedia: () => ({ matches: dark }) },
    document: { documentElement: root },
  })
  return { classes: [...classes], scheme: root.style.colorScheme }
}

describe('resource theme before hydration', () => {
  test('an explicit preference wins over the operating system on reload', () => {
    expect(bootstrap('dark', false)).toEqual({
      classes: ['dark'],
      scheme: 'dark',
    })
    expect(bootstrap('light', true)).toEqual({
      classes: ['light'],
      scheme: 'light',
    })
  })
  test('system, missing and invalid preferences follow the device', () => {
    for (const stored of ['system', null, 'unexpected']) {
      expect(bootstrap(stored, true)).toEqual({
        classes: ['dark'],
        scheme: 'dark',
      })
      expect(bootstrap(stored, false)).toEqual({
        classes: ['light'],
        scheme: 'light',
      })
    }
  })
  test('blocked storage still applies the device preference', () => {
    expect(bootstrap(null, true, true)).toEqual({
      classes: ['dark'],
      scheme: 'dark',
    })
  })
})
