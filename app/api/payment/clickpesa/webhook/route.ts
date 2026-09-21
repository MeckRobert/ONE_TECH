import { NextResponse } from 'next/server'
import {
  verifyClickPesaChecksum
} from '../../../../../lib/clickpesa'

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    console.log(
      'ClickPesa webhook:',
      JSON.stringify(payload, null, 2)
    )

    /**
     * Verify ClickPesa signature if checksum is provided.
     */
    if (
      process.env.CLICKPESA_CHECKSUM_KEY &&
      payload.checksum
    ) {
      const valid = verifyClickPesaChecksum(
        payload,
        payload.checksum
      )

      if (!valid) {
        console.error(
          'Invalid ClickPesa webhook checksum'
        )

        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const event = payload.event
    const data = payload.data

    if (!data) {
      return NextResponse.json(
        { received: true },
        { status: 200 }
      )
    }

    /**
     * PAYMENT RECEIVED
     */
    if (
      event === 'PAYMENT RECEIVED' &&
      data.status === 'SUCCESS'
    ) {
      const orderReference =
        data.orderReference

      const amount =
        Number(data.collectedAmount)

      const currency =
        data.collectedCurrency

      const paymentId =
        data.paymentId || data.id

      console.log(
        'SUCCESSFUL PAYMENT:',
        {
          orderReference,
          paymentId,
          amount,
          currency
        }
      )

      /**
       * IMPORTANT:
       *
       * Here you update your DATABASE.
       *
       * Example:
       *
       * await prisma.payment.update(...)
       *
       * await prisma.subscription.update(...)
       */

      return NextResponse.json({
        received: true
      })
    }

    /**
     * PAYMENT FAILED
     */
    if (
      event === 'PAYMENT FAILED'
    ) {
      console.log(
        'PAYMENT FAILED:',
        data.orderReference,
        data.message
      )

      /**
       * Update database:
       *
       * payment.status = FAILED
       */

      return NextResponse.json({
        received: true
      })
    }

    return NextResponse.json({
      received: true
    })

  } catch (error) {
    console.error(
      'ClickPesa webhook error:',
      error
    )

    return NextResponse.json(
      {
        error: 'Webhook processing failed'
      },
      { status: 500 }
    )
  }
}