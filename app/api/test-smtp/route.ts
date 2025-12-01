// app/api/test-smtp/route.ts
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type SmtpRequestBody = {
  host: string
  port: string | number
  username?: string
  password?: string
  from: string
  to: string
  useTls?: boolean
}

type ErrorRule = {
  match: string
  message: string
}

const errorMap: ErrorRule[] = [
  {
    match: '535',
    message:
      '535 Authentication failed. Check username/password or App Password.',
  },
  {
    match: 'Invalid login',
    message: 'Invalid login. Username or password is wrong.',
  },
  {
    match: 'ENOTFOUND',
    message: 'Host not found. Check SMTP host (e.g. smtp.gmail.com).',
  },
  {
    match: 'ETIMEDOUT',
    message: 'Connection timed out. Port may be blocked by firewall/hosting.',
  },
  {
    match: 'ECONNREFUSED',
    message: 'Connection refused. SMTP server rejected the connection.',
  },
  {
    match: 'self signed certificate',
    message:
      'Self-signed certificate. Try disabling strict TLS or use a valid certificate.',
  },
  {
    match: '530',
    message: '530 error. Server needs STARTTLS/SSL or authentication.',
  },
  {
    match: '550',
    message: '550 error. Sender not allowed or mailbox unavailable.',
  },
]

function explainError(raw: unknown): string {
  if (!raw) return 'Unknown error.'
  const text = String(raw)

  for (const rule of errorMap) {
    if (text.includes(rule.match)) {
      return rule.message
    }
  }

  return 'No specific match. Check host, port, username, password and TLS settings.'
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<SmtpRequestBody>
    const { host, port, username, password, from, to, useTls } = body

    if (!host || !port || !from || !to) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields (host, port, from, to).',
          explanation:
            'Please fill host, port, from and to fields before testing.',
        },
        { status: 400 }
      )
    }

    const numericPort = Number(port)

    const transporter = nodemailer.createTransport({
      host,
      port: numericPort,
      secure: !!useTls,
      auth:
        username && password
          ? {
              user: username,
              pass: password,
            }
          : undefined,
    })

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'SMTP Test from SMTP Debugging Copilot',
      text: 'If you see this email, your SMTP settings are working.',
    })

    return NextResponse.json(
      {
        success: true,
        messageId: info.messageId,
        response: info.response,
      },
      { status: 200 }
    )
  } catch (err) {
    const errorText = (err as Error)?.message || String(err)
    const explanation = explainError(errorText)

    return NextResponse.json(
      {
        success: false,
        error: errorText,
        explanation,
      },
      { status: 200 }
    )
  }
}
