import crypto from 'crypto'

const CLICKPESA_BASE_URL = 'https://api.clickpesa.com/third-parties'

export async function getClickPesaToken() {
  const apiKey = process.env.CLICKPESA_API_KEY
  const clientId = process.env.CLICKPESA_CLIENT_ID

  if (!apiKey || !clientId) {
    throw new Error('ClickPesa credentials are not configured')
  }

  const response = await fetch(
    `${CLICKPESA_BASE_URL}/generate-token`,
    {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'client-id': clientId
      },
      cache: 'no-store'
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`ClickPesa token error: ${error}`)
  }

  const data = await response.json()

  if (!data.token) {
    throw new Error('ClickPesa did not return an authorization token')
  }

  return data.token
}

/**
 * ClickPesa checksum generation.
 *
 * The current ClickPesa documentation requires:
 * - recursively sort object keys
 * - JSON stringify
 * - HMAC-SHA256
 */
function canonicalize(value: any): any {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(canonicalize)
  }

  return Object.keys(value)
    .sort()
    .reduce((result: Record<string, any>, key) => {
      result[key] = canonicalize(value[key])
      return result
    }, {})
}

export function createClickPesaChecksum(payload: Record<string, any>) {
  const secret = process.env.CLICKPESA_CHECKSUM_KEY

  if (!secret) {
    throw new Error('CLICKPESA_CHECKSUM_KEY is not configured')
  }

  const canonicalPayload = canonicalize(payload)
  const payloadString = JSON.stringify(canonicalPayload)

  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex')
}

export function verifyClickPesaChecksum(
  payload: Record<string, any>,
  receivedChecksum: string
) {
  const payloadToVerify = { ...payload }

  delete payloadToVerify.checksum
  delete payloadToVerify.checksumMethod

  const expected = createClickPesaChecksum(payloadToVerify)

  return crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(receivedChecksum)
  )
}