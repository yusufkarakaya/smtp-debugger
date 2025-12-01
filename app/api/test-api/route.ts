// app/api/test-api/route.ts
import { NextResponse } from 'next/server'

type ApiTestRequestBody = {
  url: string
  method?: string
  apiKey?: string
  rawBody?: string
}

const statusMap: Record<number, string> = {
  200: '200 OK — Request succeeded.',
  201: '201 Created — Resource created successfully.',
  400: '400 Bad Request — Check your request body or parameters.',
  401: '401 Unauthorized — API key or Authorization header is missing/invalid.',
  403: "403 Forbidden — You don't have permission. API key may not allow this action.",
  404: '404 Not Found — URL is wrong or endpoint does not exist.',
  405: '405 Method Not Allowed — Check HTTP method (GET/POST).',
  500: '500 Internal Server Error — Something went wrong on the server side.',
}

function explainStatus(status?: number): string {
  if (typeof status === 'number' && statusMap[status]) return statusMap[status]
  if (!status) return 'No response from server. Check URL or network.'
  return `${status} — Check server logs or documentation for more details.`
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<ApiTestRequestBody>
    const { url, method = 'POST', apiKey, rawBody } = body

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: 'URL is required.',
          explanation: 'Please enter the full endpoint URL (https://...).',
        },
        { status: 400 }
      )
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    }

    if (rawBody && method !== 'GET') {
      fetchOptions.body = rawBody
    }

    const res = await fetch(url, fetchOptions)
    const text = await res.text()
    const explanation = explainStatus(res.status)

    return NextResponse.json(
      {
        success: res.ok,
        status: res.status,
        statusText: res.statusText,
        body: text,
        explanation,
      },
      { status: 200 }
    )
  } catch (err) {
    const errorText = (err as Error)?.message || String(err)
    return NextResponse.json(
      {
        success: false,
        error: errorText,
        explanation:
          'Request failed before reaching the server. Check URL format or network.',
      },
      { status: 200 }
    )
  }
}
