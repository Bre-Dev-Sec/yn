import CryptoJS from 'crypto-js'
import dayjs from 'dayjs'
import { getActionHandler } from '@fe/core/action'
import { decrypt } from '@fe/utils/crypto'
import { getSetting, setSetting } from '@fe/services/setting'
import { refresh } from '@fe/services/view'
import { FLAG_DEMO, MODE } from '@fe/support/args'
import ga from '@fe/support/ga'
import ctx from '@fe/context'

interface License {
  name: string,
  email: string,
  hash: string,
  activateExpires: number,
  expires: number,
}

let purchased: boolean | null = null

function parseLicense (licenseStr: string) {
  const error = new Error('Invalid License')

  if (!licenseStr) {
    return null
  }

  try {
    licenseStr = [...licenseStr].reverse().join('')
    licenseStr = CryptoJS.enc.Hex.parse(licenseStr).toString(CryptoJS.enc.Utf8)

    if (licenseStr.length < 40) {
      return null
    }

    const { content } = decrypt(
      licenseStr.substring(32),
      licenseStr.substring(0, 32)
    )

    const leading = 'yank-note-license'
    if (content.startsWith(leading)) {
      return JSON.parse(content.replace(leading, '')) as License
    } else {
      throw error
    }
  } catch {
    throw error
  }
}

export function getPurchased (force = false) {
  if (!force && typeof purchased === 'boolean') {
    return purchased
  }

  if (FLAG_DEMO || MODE === 'share-preview') {
    return true
  }

  purchased = !!getLicenseInfo()

  return purchased
}

export function showPremium () {
  getActionHandler('premium.show')()
  ga.logEvent('yn_premium_show', { purchased: getPurchased() })
}

export function getLicenseInfo () {
  try {
    const licenseStr = getSetting('license')
    const info = parseLicense(licenseStr!)

    if (info) {
      ga.setUserId(info.email)
      ga.setUserProperties({
        name: info.name,
        expires: dayjs(info.expires).format('YYYY-MM-DD'),
        hash: info.hash,
      })
    }

    return info
  } catch (error) {
    console.error(error)
  }

  return null
}

export async function setLicense (licenseStr: string) {
  async function getTime () {
    const time = await fetch('http://worldclockapi.com/api/json/est/now').then(r => r.json())
    return dayjs(time.currentDateTime).valueOf()
  }

  const license = parseLicense(licenseStr)

  const now = await getTime()
  if (!license || now > license.activateExpires) {
    throw new Error('Invalid License')
  }

  await setSetting('license', licenseStr)
  refresh()
}

export function genLicense () {
  const exp = 3 * 24 * 60 * 60 * 1000
  const name = 'iap-' + Date.now()
  const email = `${name}@iap`

  const expires = ctx.lib.dayjs('2099-01-01 00:00:00').valueOf()
  const key = ctx.utils.md5('yank-note' + name + email)
  const hash = ctx.utils.md5(key)
  const data = {
    name,
    email,
    hash,
    expires,
    activateExpires: Date.now() + exp,
  }

  const payload = 'yank-note-license' + JSON.stringify(data)
  const encrypted = ctx.utils.crypto.encrypt(payload, key).content
  return [...ctx.lib.cryptojs.enc.Hex.stringify(
    ctx.lib.cryptojs.enc.Utf8.parse(key + encrypted)
  )].reverse().join('')
}
