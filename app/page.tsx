'use client'

import React, { ChangeEvent, FormEvent, useState } from 'react'

type Mode = 'smtp' | 'api'

type SmtpFormState = {
  host: string
  port: string
  username: string
  password: string
  from: string
  to: string
  useTls: boolean
}

type ApiFormState = {
  url: string
  method: 'GET' | 'POST'
  apiKey: string
  rawBody: string
}

type SmtpResult = null | {
  success: boolean
  error?: string
  explanation?: string
  messageId?: string
  response?: string
}

type ApiResult = null | {
  success: boolean
  status?: number
  statusText?: string
  body?: string
  error?: string
  explanation?: string
}

const initialSmtpForm: SmtpFormState = {
  host: '',
  port: '587',
  username: '',
  password: '',
  from: '',
  to: '',
  useTls: true,
}

const initialApiForm: ApiFormState = {
  url: '',
  method: 'POST',
  apiKey: '',
  rawBody: '{ "example": "data" }',
}

export default function HomePage() {
  const [mode, setMode] = useState<Mode>('smtp')

  const [smtpForm, setSmtpForm] = useState<SmtpFormState>(initialSmtpForm)
  const [smtpLoading, setSmtpLoading] = useState(false)
  const [smtpResult, setSmtpResult] = useState<SmtpResult>(null)

  const [apiForm, setApiForm] = useState<ApiFormState>(initialApiForm)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiResult, setApiResult] = useState<ApiResult>(null)

  const handleSmtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSmtpForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleApiChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setApiForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSmtpSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSmtpLoading(true)
    setSmtpResult(null)

    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smtpForm),
      })

      const data = (await res.json()) as SmtpResult
      setSmtpResult(data)
    } catch (err) {
      setSmtpResult({
        success: false,
        error: (err as Error).message || String(err),
        explanation: 'Request failed. Check network or /api/test-smtp route.',
      })
    } finally {
      setSmtpLoading(false)
    }
  }

  const handleApiSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setApiLoading(true)
    setApiResult(null)

    try {
      const res = await fetch('/api/test-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiForm),
      })

      const data = (await res.json()) as ApiResult
      setApiResult(data)
    } catch (err) {
      setApiResult({
        success: false,
        error: (err as Error).message || String(err),
        explanation: 'Request failed. Check network or /api/test-api route.',
      })
    } finally {
      setApiLoading(false)
    }
  }

  const smtpSnippet = buildNodeMailerSnippet(smtpForm)

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-800">
            <span className="h-2 w-2 rounded-full bg-amber_gold-500" />
            SMTP & API Debugging
          </div>
          <h1 className="mt-3 bg-gradient-to-r from-amber_gold-500 via-neon_pink-500 to-azure_blue-500 bg-clip-text text-3xl font-semibold text-transparent sm:text-4xl">
            SMTP & API Email Debugging Copilot
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Test your SMTP servers and HTTP/API email endpoints (Supabase,
            SendGrid, custom) in one place. No AI, no accounts—just debugging.
          </p>
        </header>

        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="inline-flex rounded-full border border-slate-800 bg-slate-900/60 p-1 text-xs font-medium">
            <button
              onClick={() => setMode('smtp')}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === 'smtp'
                  ? 'bg-amber_gold-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              SMTP Test
            </button>
            <button
              onClick={() => setMode('api')}
              className={`rounded-full px-4 py-1.5 transition ${
                mode === 'api'
                  ? 'bg-azure_blue-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              API Test
            </button>
          </div>
        </div>

        {/* Views */}
        <div className="flex-1 pb-4">
          {mode === 'smtp' ? (
            <SmtpView
              form={smtpForm}
              onChange={handleSmtpChange}
              onSubmit={handleSmtpSubmit}
              loading={smtpLoading}
              result={smtpResult}
              snippet={smtpSnippet}
            />
          ) : (
            <ApiView
              form={apiForm}
              onChange={handleApiChange}
              onSubmit={handleApiSubmit}
              loading={apiLoading}
              result={apiResult}
            />
          )}
        </div>

        {/* Footer mini note */}
        <footer className="mt-4 border-t border-slate-900 pt-3 text-xs text-slate-500">
          Pro tip: don&apos;t use real production passwords when screen sharing.
        </footer>
      </div>
    </main>
  )
}

type SmtpViewProps = {
  form: SmtpFormState
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent) => void
  loading: boolean
  result: SmtpResult
  snippet: string
}

function SmtpView({
  form,
  onChange,
  onSubmit,
  loading,
  result,
  snippet,
}: SmtpViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
      {/* Left: SMTP form */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-blue_violet-900/40">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              SMTP Settings
            </h2>
            <p className="text-xs text-slate-400">
              Paste your SMTP creds and send a real test email.
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300">
            Nodemailer / Node.js
          </span>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3 text-xs sm:text-sm">
          <div>
            <Label>Host</Label>
            <Input
              name="host"
              value={form.host}
              onChange={onChange}
              placeholder="smtp.gmail.com"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Port</Label>
              <Input
                name="port"
                value={form.port}
                onChange={onChange}
                placeholder="465 / 587"
              />
            </div>
            <div className="mt-1.5 flex items-center gap-2 sm:mt-6">
              <input
                id="useTls"
                name="useTls"
                type="checkbox"
                checked={form.useTls}
                onChange={onChange}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber_gold-500 focus:ring-amber_gold-500"
              />
              <label htmlFor="useTls" className="text-xs text-slate-300">
                Use SSL/TLS (secure)
              </label>
            </div>
          </div>

          <div>
            <Label>Username (optional)</Label>
            <Input
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="user@example.com"
            />
          </div>

          <div>
            <Label>Password (optional)</Label>
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="SMTP password / App Password"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>From</Label>
              <Input
                name="from"
                value={form.from}
                onChange={onChange}
                placeholder="from@example.com"
              />
            </div>
            <div>
              <Label>To (test recipient)</Label>
              <Input
                name="to"
                value={form.to}
                onChange={onChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-blaze_orange-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow hover:bg-blaze_orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Testing SMTP...' : 'Run SMTP Test'}
          </button>
        </form>
      </section>

      {/* Right: SMTP result + snippet */}
      <section className="flex flex-col gap-4">
        <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <h2 className="text-sm font-semibold text-slate-100">SMTP Result</h2>
          <p className="mt-1 text-xs text-slate-400">
            See the raw error/response and a simple explanation.
          </p>

          {!result && (
            <p className="mt-4 text-xs text-slate-500">
              Fill the form on the left and click{' '}
              <span className="font-medium text-amber_gold-500">
                Run SMTP Test
              </span>{' '}
              to see details here.
            </p>
          )}

          {result && (
            <div className="mt-4 space-y-3 text-xs">
              <p
                className={`font-medium ${
                  result.success ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {result.success
                  ? '✅ SMTP test succeeded.'
                  : '❌ SMTP test failed.'}
              </p>

              {result.error && (
                <div>
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Raw Error
                  </h3>
                  <pre className="max-h-40 overflow-auto rounded-md bg-slate-950/80 p-2 text-[11px] text-red-200 ring-1 ring-slate-800">
                    {result.error}
                  </pre>
                </div>
              )}

              {result.explanation && (
                <div>
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Explanation
                  </h3>
                  <p className="text-xs text-slate-200">{result.explanation}</p>
                </div>
              )}

              {result.success && !result.error && (
                <div>
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Raw Response
                  </h3>
                  <pre className="max-h-40 overflow-auto rounded-md bg-slate-950/80 p-2 text-[11px] text-emerald-200 ring-1 ring-slate-800">
                    {JSON.stringify(
                      {
                        messageId: result.messageId,
                        response: result.response,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-100">
              Node.js / Nodemailer Snippet
            </h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
              Copy & paste
            </span>
          </div>
          <p className="mb-2 text-[11px] text-slate-400">
            Uses your host/port/from/to values. Replace{' '}
            <code className="text-amber_gold-400">YOUR_SMTP_USERNAME</code> and{' '}
            <code className="text-amber_gold-400">YOUR_SMTP_PASSWORD</code> with
            real credentials or environment variables.
          </p>
          <pre className="max-h-56 overflow-auto rounded-md bg-slate-950/80 p-2 text-[11px] text-slate-100 ring-1 ring-slate-800">
            <code>{snippet}</code>
          </pre>
        </div>
      </section>
    </div>
  )
}

type ApiViewProps = {
  form: ApiFormState
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void
  onSubmit: (e: FormEvent) => void
  loading: boolean
  result: ApiResult
}

function ApiView({ form, onChange, onSubmit, loading, result }: ApiViewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
      {/* Left: API form */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm shadow-azure_blue-900/40">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              API Endpoint Test
            </h2>
            <p className="text-xs text-slate-400">
              Test Supabase functions, SendGrid, or any HTTP endpoint with an
              API key.
            </p>
          </div>
          <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-300">
            Authorization: Bearer
          </span>
        </div>

        <form onSubmit={onSubmit} className="grid gap-3 text-xs sm:text-sm">
          <div>
            <Label>URL</Label>
            <Input
              name="url"
              value={form.url}
              onChange={onChange}
              placeholder="https://xxxx.supabase.co/functions/v1/send-email"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Method</Label>
              <select
                name="method"
                value={form.method}
                onChange={onChange}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 shadow-sm outline-none ring-amber_gold-500/30 focus:ring"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
              </select>
            </div>
            <div>
              <Label>API Key (optional)</Label>
              <Input
                name="apiKey"
                value={form.apiKey}
                onChange={onChange}
                placeholder="Supabase / SendGrid API key"
              />
              <p className="mt-1 text-[10px] text-slate-500">
                Sent as <code>Authorization: Bearer YOUR_KEY</code>.
              </p>
            </div>
          </div>

          <div>
            <Label>Body (raw JSON, optional)</Label>
            <textarea
              name="rawBody"
              value={form.rawBody}
              onChange={onChange}
              rows={6}
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 shadow-sm outline-none ring-azure_blue-500/30 focus:ring font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-azure_blue-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow hover:bg-azure_blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Testing API...' : 'Run API Test'}
          </button>
        </form>
      </section>

      {/* Right: API result */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <h2 className="text-sm font-semibold text-slate-100">API Result</h2>
        <p className="mt-1 text-xs text-slate-400">
          Status code, explanation, and raw response body.
        </p>

        {!result && (
          <p className="mt-4 text-xs text-slate-500">
            Enter your endpoint, method, and API key, then click{' '}
            <span className="font-medium text-azure_blue-400">
              Run API Test
            </span>
            .
          </p>
        )}

        {result && (
          <div className="mt-4 space-y-3 text-xs">
            <p
              className={`font-medium ${
                result.success ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {result.success
                ? '✅ API request succeeded.'
                : '❌ API request failed.'}
            </p>

            {typeof result.status !== 'undefined' && (
              <p className="text-[11px] text-slate-200">
                Status:{' '}
                <span className="font-mono">
                  {result.status} {result.statusText || ''}
                </span>
              </p>
            )}

            {result.explanation && (
              <div>
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Explanation
                </h3>
                <p className="text-xs text-slate-200">{result.explanation}</p>
              </div>
            )}

            {result.error && (
              <div>
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Raw Error
                </h3>
                <pre className="max-h-40 overflow-auto rounded-md bg-slate-950/80 p-2 text-[11px] text-red-200 ring-1 ring-slate-800">
                  {result.error}
                </pre>
              </div>
            )}

            {result.body && (
              <div>
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Response Body
                </h3>
                <pre className="max-h-52 overflow-auto rounded-md bg-slate-950/80 p-2 text-[11px] text-slate-100 ring-1 ring-slate-800">
                  {result.body}
                </pre>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

/* Small shared UI helpers */

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-300">
    {children}
  </label>
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input: React.FC<InputProps> = (props) => (
  <input
    {...props}
    className={
      'w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-xs text-slate-100 shadow-sm outline-none ring-amber_gold-500/30 focus:ring ' +
      (props.className ?? '')
    }
  />
)

/* Snippet builder */

function buildNodeMailerSnippet(form: SmtpFormState): string {
  const host = form.host || 'smtp.example.com'
  const port = form.port || '587'
  const from = form.from || 'from@example.com'
  const to = form.to || 'to@example.com'
  const secure = form.useTls ? 'true' : 'false'

  return `import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "${host}",
  port: ${port},
  secure: ${secure}, // true for 465, false for other ports
  auth: {
    user: "YOUR_SMTP_USERNAME",
    pass: "YOUR_SMTP_PASSWORD",
  },
});

async function sendTest() {
  const info = await transporter.sendMail({
    from: "${from}",
    to: "${to}",
    subject: "SMTP Test",
    text: "This is a test email from SMTP Debugging Copilot.",
  });

  console.log("Message sent:", info.messageId);
  console.log("Server response:", info.response);
}

sendTest().catch(console.error);`
}
