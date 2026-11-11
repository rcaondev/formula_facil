import type { Formula, TableData } from '@/types/formula'
import { CalcError, ensure, fmtMoney, fmtNumber, inp, rate, rateStep, step, t, tm, tp } from './format'

const FC0 = inp('FC0', 'FC_0', 'Investimento inicial', 'currency', 10000, { min: 0, exclusiveMin: true })
const i = rate('i', 'i', 'Taxa mínima de atratividade', 10, { min: -100, exclusiveMin: true })
const cashflows = { label: 'Fluxos de caixa futuros', default: [3000, 4000, 5000, 4000] }

const MAX_TERMS = 4

/** Expressão LaTeX do somatório de fluxos descontados (abreviada se longa). */
function sumExpr(flows: number[], base: string): string {
  const term = (fc: number, k: number) => `\\dfrac{${tm(fc)}}{(${base})^{${k}}}`
  if (flows.length <= MAX_TERMS) return flows.map((fc, idx) => term(fc, idx + 1)).join(' + ')
  const n = flows.length
  return `${term(flows[0], 1)} + ${term(flows[1], 2)} + \\cdots + ${term(flows[n - 1], n)}`
}

function discounted(flows: number[], i: number) {
  let acc = 0
  return flows.map((fc, idx) => {
    const k = idx + 1
    const factor = 1 / (1 + i) ** k
    const pv = fc * factor
    acc += pv
    return { k, fc, factor, pv, acc }
  })
}

function flowTable(FC0: number, flows: number[], i: number, highlight?: number): TableData {
  const rows = discounted(flows, i)
  return {
    columns: ['Período', 'Fluxo', 'Fator de desconto', 'Valor presente', 'Saldo acumulado'],
    rows: [
      ['0', fmtMoney(-FC0), '1', fmtMoney(-FC0), fmtMoney(-FC0)],
      ...rows.map((r) => [String(r.k), fmtMoney(r.fc), fmtNumber(r.factor, 6), fmtMoney(r.pv), fmtMoney(r.acc - FC0)]),
    ],
    highlight,
  }
}

function npv(FC0: number, flows: number[], r: number) {
  return flows.reduce((s, fc, idx) => s + fc / (1 + r) ** (idx + 1), -FC0)
}

function irr(FC0: number, flows: number[]): number {
  let lo = -0.9999
  let hi = 1
  let fLo = npv(FC0, flows, lo)
  let fHi = npv(FC0, flows, hi)
  while (fLo * fHi > 0 && hi < 1e6) {
    hi *= 2
    fHi = npv(FC0, flows, hi)
  }
  if (fLo * fHi > 0) throw new CalcError('Não foi encontrada uma TIR: os fluxos não mudam de sinal no VPL.')
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2
    const fMid = npv(FC0, flows, mid)
    if (Math.abs(fMid) < 1e-10) return mid
    if (fLo * fMid < 0) hi = mid
    else {
      lo = mid
      fLo = fMid
    }
  }
  return (lo + hi) / 2
}

const needFlows = (flows: number[]) => ensure(flows.length > 0, 'Adicione pelo menos um fluxo de caixa.')

export const investmentFormulas: Formula[] = [
  {
    id: 'inv-vpl',
    category: 'investimentos',
    name: 'Valor presente líquido (VPL)',
    description: 'Soma dos fluxos futuros descontados à taxa mínima de atratividade, menos o investimento inicial. VPL > 0 indica projeto viável.',
    latex: 'VPL = \\sum_{t=1}^{n} \\dfrac{FC_t}{(1 + i)^t} - FC_0',
    inputs: [FC0, i],
    cashflows,
    compute: ({ FC0, i }, flows) => {
      needFlows(flows)
      const rows = discounted(flows, i)
      const sum = rows[rows.length - 1].acc
      const v = sum - FC0
      return {
        label: 'Valor presente líquido', symbol: 'VPL', value: v, kind: 'currency',
        note: v >= 0 ? 'VPL não negativo: o projeto remunera ao menos a taxa mínima de atratividade.' : 'VPL negativo: o projeto não atinge a taxa mínima de atratividade.',
        steps: [
          rateStep('i', i),
          step('Fluxos descontados', `\\sum = ${sumExpr(flows, t(1 + i, 8))}`),
          step('Soma dos valores presentes', `\\sum = ${tm(sum)}`),
          step('Resultado', `VPL = ${tm(sum)} - ${tm(FC0)} = ${tm(v)}`),
        ],
        table: flowTable(FC0, flows, i),
      }
    },
  },
  {
    id: 'inv-tir',
    category: 'investimentos',
    name: 'Taxa interna de retorno (TIR)',
    description: 'Taxa que zera o VPL do projeto. Calculada numericamente pelo método da bisseção.',
    latex: '0 = \\sum_{t=0}^{n} \\dfrac{FC_t}{(1 + TIR)^t}',
    inputs: [FC0],
    cashflows,
    compute: ({ FC0 }, flows) => {
      needFlows(flows)
      const r = irr(FC0, flows)
      return {
        label: 'Taxa interna de retorno', symbol: 'TIR', value: r, kind: 'percent',
        steps: [
          step('Equação a resolver', `0 = -${tm(FC0)} + ${sumExpr(flows, '1 + TIR')}`),
          step('Solução numérica (bisseção)', `TIR = ${t(r, 8)}`),
          step('Verificação', `VPL(${tp(r)}) \\approx ${tm(npv(FC0, flows, r))}`),
        ],
        table: flowTable(FC0, flows, r),
      }
    },
  },
  {
    id: 'inv-payback',
    category: 'investimentos',
    name: 'Payback descontado',
    description: 'Tempo necessário para que os fluxos descontados recuperem o investimento inicial. A fração do último período é interpolada linearmente.',
    latex: '\\sum_{k=1}^{t} \\dfrac{FC_k}{(1 + i)^k} = FC_0',
    inputs: [FC0, i],
    cashflows,
    compute: ({ FC0, i }, flows) => {
      needFlows(flows)
      const rows = discounted(flows, i)
      const idx = rows.findIndex((r) => r.acc >= FC0)
      if (idx === -1) {
        throw new CalcError(`O investimento não é recuperado no horizonte informado (acumulado descontado: ${fmtMoney(rows[rows.length - 1].acc)}).`)
      }
      const prevAcc = idx === 0 ? 0 : rows[idx - 1].acc
      const missing = FC0 - prevAcc
      const frac = missing / rows[idx].pv
      const pb = idx + frac
      return {
        label: 'Payback descontado', symbol: 't', value: pb, kind: 'periods',
        steps: [
          rateStep('i', i),
          step(`Acumulado descontado até o período ${idx}`, `${tm(prevAcc)}`),
          step('Valor que falta recuperar', `${tm(FC0)} - ${tm(prevAcc)} = ${tm(missing)}`),
          step(`Fração do período ${idx + 1}`, `\\dfrac{${tm(missing)}}{${tm(rows[idx].pv)}} = ${t(frac, 4)}`),
          step('Resultado', `t = ${idx} + ${t(frac, 4)} = ${t(pb, 4)} \\text{ períodos}`),
        ],
        table: flowTable(FC0, flows, i, idx + 1),
      }
    },
  },
  {
    id: 'inv-il',
    category: 'investimentos',
    name: 'Índice de lucratividade (IL)',
    description: 'Quanto cada unidade investida retorna em valor presente. IL > 1 indica projeto viável.',
    latex: 'IL = \\dfrac{\\sum_{t=1}^{n} \\frac{FC_t}{(1 + i)^t}}{FC_0}',
    inputs: [FC0, i],
    cashflows,
    compute: ({ FC0, i }, flows) => {
      needFlows(flows)
      const rows = discounted(flows, i)
      const sum = rows[rows.length - 1].acc
      const il = sum / FC0
      return {
        label: 'Índice de lucratividade', symbol: 'IL', value: il, kind: 'number',
        note: il >= 1 ? 'IL ≥ 1: o valor presente dos fluxos cobre o investimento.' : 'IL < 1: o valor presente dos fluxos não cobre o investimento.',
        steps: [
          rateStep('i', i),
          step('Soma dos valores presentes', `\\sum = ${sumExpr(flows, t(1 + i, 8))} = ${tm(sum)}`),
          step('Resultado', `IL = \\dfrac{${tm(sum)}}{${tm(FC0)}} = ${t(il, 4)}`),
        ],
        table: flowTable(FC0, flows, i),
      }
    },
  },
  {
    id: 'inv-payback-simples',
    category: 'investimentos',
    name: 'Payback simples',
    description: 'Tempo para recuperar o investimento somando os fluxos nominais, sem descontar o valor do dinheiro no tempo. A fração do último período é interpolada linearmente.',
    latex: '\\sum_{k=1}^{t} FC_k = FC_0',
    inputs: [FC0],
    cashflows,
    compute: ({ FC0 }, flows) => {
      needFlows(flows)
      let acc = 0
      const accs = flows.map((fc) => (acc += fc))
      const idx = accs.findIndex((a) => a >= FC0)
      if (idx === -1) {
        throw new CalcError(`O investimento não é recuperado no horizonte informado (acumulado: ${fmtMoney(accs[accs.length - 1])}).`)
      }
      const prevAcc = idx === 0 ? 0 : accs[idx - 1]
      const missing = FC0 - prevAcc
      const frac = missing / flows[idx]
      const pb = idx + frac
      return {
        label: 'Payback simples', symbol: 't', value: pb, kind: 'periods',
        steps: [
          step(`Acumulado até o período ${idx}`, `${tm(prevAcc)}`),
          step('Valor que falta recuperar', `${tm(FC0)} - ${tm(prevAcc)} = ${tm(missing)}`),
          step(`Fração do período ${idx + 1}`, `\\dfrac{${tm(missing)}}{${tm(flows[idx])}} = ${t(frac, 4)}`),
          step('Resultado', `t = ${idx} + ${t(frac, 4)} = ${t(pb, 4)} \\text{ períodos}`),
        ],
        table: {
          columns: ['Período', 'Fluxo', 'Saldo acumulado'],
          rows: [
            ['0', fmtMoney(-FC0), fmtMoney(-FC0)],
            ...flows.map((fc, k) => [String(k + 1), fmtMoney(fc), fmtMoney(accs[k] - FC0)]),
          ],
          highlight: idx + 1,
        },
      }
    },
  },
  {
    id: 'inv-roi',
    category: 'investimentos',
    name: 'Retorno sobre investimento (ROI)',
    description: 'Ganho obtido em relação ao valor investido, no período todo. Não considera o tempo nem o custo de oportunidade.',
    latex: 'ROI = \\dfrac{V_{final} - V_{inicial}}{V_{inicial}}',
    inputs: [
      inp('Vi', 'V_{inicial}', 'Valor investido', 'currency', 10000, { min: 0, exclusiveMin: true }),
      inp('Vf', 'V_{final}', 'Valor final (resgatado)', 'currency', 13500),
    ],
    compute: ({ Vi, Vf }) => {
      const ganho = Vf - Vi
      const roi = ganho / Vi
      return {
        label: 'Retorno sobre investimento', symbol: 'ROI', value: roi, kind: 'percent',
        steps: [
          step('Ganho líquido', `${tm(Vf)} - ${tm(Vi)} = ${tm(ganho)}`),
          step('Resultado', `ROI = \\dfrac{${tm(ganho)}}{${tm(Vi)}} = ${t(roi, 6)} = ${tp(roi)}`),
        ],
      }
    },
  },
]
