import type { FormulaInput, InputKind, ResultKind, Step } from '@/types/formula'

const cache = new Map<string, Intl.NumberFormat>()
function nf(min: number, max: number, grouping = true): Intl.NumberFormat {
  const k = `${min}-${max}-${grouping}`
  let f = cache.get(k)
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
      useGrouping: grouping,
    })
    cache.set(k, f)
  }
  return f
}

const clean = (x: number) => (Math.abs(x) < 1e-12 ? 0 : x)

export const fmtNumber = (x: number, max = 6) => nf(0, max).format(clean(x))
export const fmtMoney = (x: number) => {
  const v = clean(x)
  return (v < 0 ? '−R$ ' : 'R$ ') + nf(2, 2).format(Math.abs(v))
}
export const fmtPercent = (rate: number, max = 4) => nf(0, max).format(clean(rate * 100)) + '%'

export function fmtResult(x: number, kind: ResultKind): string {
  switch (kind) {
    case 'currency':
      return fmtMoney(x)
    case 'percent':
      return fmtPercent(x)
    case 'periods':
      return fmtNumber(x, 4)
    default:
      return fmtNumber(x, 6)
  }
}

/** Formata um valor para exibir dentro de um campo de entrada. */
export function fmtInput(x: number, kind: InputKind): string {
  return nf(0, kind === 'currency' ? 2 : 6, false).format(x)
}

/** Interpreta número digitado em pt-BR ("1.234,56") ou en ("1234.56"). */
export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, '').replace(/^R\$/i, '').replace(/%$/, '')
  if (!t) return null
  let norm = t
  if (t.includes(',')) norm = t.replace(/\./g, '').replace(',', '.')
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) norm = t.replace(/\./g, '')
  const n = Number(norm)
  return Number.isFinite(n) ? n : NaN
}

// ---------- LaTeX helpers ----------
const texify = (s: string) => s.replace(/,/g, '{,}').replace(/^-/, '-\\,')

/** Número em LaTeX (pt-BR). */
export const t = (x: number, max = 6) => texify(nf(0, max).format(clean(x)))
/** Valor monetário em LaTeX (2 casas). */
export const tm = (x: number) => texify(nf(2, 2).format(clean(x)))
/** Taxa em LaTeX como percentual. */
export const tp = (rate: number, max = 4) => texify(nf(0, max).format(clean(rate * 100))) + '\\%'
/** Número entre parênteses se negativo. */
export const tpar = (x: number, max = 6) => (x < 0 ? `(${t(x, max)})` : t(x, max))

export const step = (label: string, latex: string): Step => ({ label, latex })

/** Passo de conversão de taxa percentual para decimal. */
export const rateStep = (symbol: string, rate: number): Step =>
  step('Taxa na forma decimal', `${symbol} = ${tp(rate)} = ${t(rate, 8)}`)

export class CalcError extends Error {}
export function ensure(cond: boolean, message: string): asserts cond {
  if (!cond) throw new CalcError(message)
}

// ---------- Fábricas de inputs ----------
type Extra = Partial<FormulaInput>
export const inp = (
  key: string,
  symbol: string,
  label: string,
  kind: FormulaInput['kind'],
  def: number,
  extra: Extra = {},
): FormulaInput => ({ key, symbol, label, kind, default: def, ...extra })

export const rate = (key = 'i', symbol = 'i', label = 'Taxa de juros por período', def = 2, extra: Extra = {}) =>
  inp(key, symbol, label, 'percent', def, extra)

export const periods = (key = 'n', symbol = 'n', label = 'Número de períodos', def = 12, extra: Extra = {}) =>
  inp(key, symbol, label, 'number', def, { min: 0, exclusiveMin: true, ...extra })
