import crypto from 'crypto'
import { NextResponse } from 'next/server'
import {
  getClickPesaToken,
  createClickPesaChecksum
} from '../../../../../lib/clickpesa'

const PLANS = {
  bronze: {
    name: 'Bronze Starter',
    amount: 5000
  },
  gold: {
    name: 'Gold Growth',
    amount: 15000
  },
  platinum: {
    name: 'Platinum Premium',
    amount: 35000
  }
} as const

function normalizePhone(phone: string) {
  let value = phone.replace(/\D/g, '')

  if (value.startsWith('0')) {
    value = `255${value.slice(1)}`
  }

  if (!value.startsWith('255')) {
    throw new Error('Phone number must be a Tanzanian number')
  }

  if (value.length !== 12) {
    throw new Error('Invalid Tanzanian phone number')
  }

  return value
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      planId,
      phoneNumber,
      paymentMethod
    } = body

    if (!planId || !phoneNumber || !paymentMethod) {
      return NextResponse.json(
        {
          error: 'Missing payment information'
        },
        { status: 400 }
      )
    }

    const plan =
      PLANS[planId as keyof typeof PLANS]

    if (!plan) {
      return NextResponse.json(
        {
          error: 'Invalid subscription plan'
        },
        { status: 400 }
      )
    }

    const phone = normalizePhone(phoneNumber)

    const orderReference =
      `FIN-${planId.toUpperCase()}-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`

    const token = await getClickPesaToken()

    /**
     * MOBILE MONEY
     */
    if (paymentMethod === 'momo') {
      const payload: Record<string, any> = {
        amount: String(plan.amount),
        currency: 'TZS',
        orderReference,
        phoneNumber: phone
      }

      if (process.env.CLICKPESA_CHECKSUM_KEY) {
        payload.checksum =
          createClickPesaChecksum(payload)
      }

      const response = await fetch(
        'https://api.clickpesa.com/third-parties/payments/initiate-ussd-push-request',
        {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          cache: 'no-store'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('ClickPesa error:', data)

        return NextResponse.json(
          {
            error: data?.message || 'Unable to initiate payment'
          },
          { status: response.status }
        )
      }

      return NextResponse.json({
        success: true,
        type: 'momo',
        orderReference,
        paymentId: data.id,
        status: data.status,
        message:
          'Payment request sent. Please approve it on your phone.'
      })
    }

    /**
     * CARD
     *
     * We use ClickPesa Hosted Checkout instead
     * of handling card numbers/CVV ourselves.
     */
    if (paymentMethod === 'card') {
      const payload: Record<string, any> = {
        totalPrice: String(plan.amount),
        orderReference,
        orderCurrency: 'TZS',
        customerPhone: phone,
        description:
          `${plan.name} subscription - Finbrigde Africa Co Ltd`
      }

      if (process.env.NEXT_PUBLIC_APP_URL) {
        payload.callbackUrl =
          `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/clickpesa/webhook`
      }

      if (process.env.CLICKPESA_CHECKSUM_KEY) {
        payload.checksum =
          createClickPesaChecksum(payload)
      }

      const response = await fetch(
        'https://api.clickpesa.com/third-parties/checkout-link/generate-checkout-url',
        {
          method: 'POST',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          cache: 'no-store'
        }
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('ClickPesa card error:', data)

        return NextResponse.json(
          {
            error:
              data?.message ||
              'Unable to create card checkout'
          },
          { status: response.status }
        )
      }

      return NextResponse.json({
        success: true,
        type: 'card',
        orderReference,
        checkoutLink: data.checkoutLink
      })
    }

    return NextResponse.json(
      {
        error: 'Unsupported payment method'
      },
      { status: 400 }
    )

  } catch (error) {
    console.error('ClickPesa payment error:', error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Payment initialization failed'
      },
      { status: 500 }
    )
  }
}