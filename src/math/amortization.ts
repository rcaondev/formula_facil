import type { Formula, TableData } from '@/types/formula'
import { ensure, fmtMoney, inp, rate, rateStep, step, t, tm } from './format'

const PV = inp('PV', 'PV', 'Valor financiado', 'currency', 100000)
const i = rate('i', 'i', 'Taxa de juros por período', 1, { min: 0 })
const n = inp('n', 'n', 'Número de parcelas', 'integer', 12, { min: 1 })
const k = inp('k', 'k', 'Período consultado', 'integer', 1, { min: 1 })

interface Row {
  k: number
  P: number
  J: number
  A: number
  saldo: number
}

const MAX_N = 600

function checkTerm(n: number, k?: number) {
  ensure(n <= MAX_N, `Use no máximo ${MAX_N} parcelas.`)
  if (k !== undefined) ensure(k <= n, 'O período consultado (k) não pode ser maior que o número de parcelas (n).')
}

function pricePmt(PV: number, i: number, n: number) {
  return i === 0 ? PV / n : (PV * i) / (1 - (1 + i) ** -n)
}

function price(PV: number, i: number, n: number): Row[] {
  const P = pricePmt(PV, i, n)
  const rows: Row[] = []
  let saldo = PV
  for (let k = 1; k <= n; k++) {
    const J = saldo * i
    const A = P - J
    saldo -= A
    rows.push({ k, P, J, A, saldo: Math.abs(saldo) < 1e-7 ? 0 : saldo })
  }
  return rows
}

function sac(PV: number, i: number, n: number): Row[] {
  const A = PV / n
  const rows: Row[] = []
  for (let k = 1; k <= n; k++) {
    const J = (PV - (k - 1) * A) * i
    rows.push({ k, P: A + J, J, A, saldo: Math.max(0, PV - k * A) })
  }
  return rows
}

function table(PV: number, rows: Row[], highlight?: number): TableData {
  const totals = rows.reduce((s, r) => ({ P: s.P + r.P, J: s.J + r.J, A: s.A + r.A }), { P: 0, J: 0, A: 0 })
  return {
    columns: ['Período', 'Prestação', 'Juros', 'Amortização', 'Saldo devedor'],
    rows: [
      ['0', '—', '—', '—', fmtMoney(PV)],
      ...rows.map((r) => [String(r.k), fmtMoney(r.P), fmtMoney(r.J), fmtMoney(r.A), fmtMoney(r.saldo)]),
      ['Total', fmtMoney(totals.P), fmtMoney(totals.J), fmtMoney(totals.A), ''],
    ],
    highlight,
  }
}

export const amortizationFormulas: Formula[] = [
  {
    id: 'am-price-pmt',
    category: 'amortizacao',
    name: 'Price — prestação',
    description: 'Tabela Price (sistema francês): prestações constantes; os juros caem e a amortização cresce ao longo do tempo.',
    latex: 'PMT = PV \\times \\dfrac{i}{1 - (1 + i)^{-n}}',
    inputs: [PV, i, n],
    compute: ({ PV, i, n }) => {
      checkTerm(n)
      const P = pricePmt(PV, i, n)
      return {
        label: 'Prestação constante', symbol: 'PMT', value: P, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `PMT = ${tm(PV)} \\times \\dfrac{${t(i, 8)}}{1 - (${t(1 + i, 8)})^{-${n}}}`),
          step('Resultado', `PMT = ${tm(P)}`),
        ],
        table: table(PV, price(PV, i, n)),
      }
    },
  },
  {
    id: 'am-price-juros',
    category: 'amortizacao',
    name: 'Price — juros no período k',
    description: 'Juros pagos na k-ésima prestação da Tabela Price: taxa aplicada sobre o saldo devedor anterior.',
    latex: 'J_k = Saldo_{k-1} \\times i',
    inputs: [PV, i, n, k],
    compute: ({ PV, i, n, k }) => {
      checkTerm(n, k)
      const rows = price(PV, i, n)
      const prev = k === 1 ? PV : rows[k - 2].saldo
      const J = rows[k - 1].J
      return {
        label: `Juros no período ${k}`, symbol: `J_{${k}}`, value: J, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Saldo devedor anterior', `Saldo_{${k - 1}} = ${tm(prev)}`),
          step('Resultado', `J_{${k}} = ${tm(prev)} \\times ${t(i, 8)} = ${tm(J)}`),
        ],
        table: table(PV, rows, k),
      }
    },
  },
  {
    id: 'am-price-amortizacao',
    category: 'amortizacao',
    name: 'Price — amortização no período k',
    description: 'Parcela da prestação que efetivamente reduz a dívida no período k.',
    latex: 'A_k = PMT - J_k',
    inputs: [PV, i, n, k],
    compute: ({ PV, i, n, k }) => {
      checkTerm(n, k)
      const rows = price(PV, i, n)
      const r = rows[k - 1]
      return {
        label: `Amortização no período ${k}`, symbol: `A_{${k}}`, value: r.A, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Prestação', `PMT = ${tm(r.P)}`),
          step('Juros do período', `J_{${k}} = ${tm(r.J)}`),
          step('Resultado', `A_{${k}} = ${tm(r.P)} - ${tm(r.J)} = ${tm(r.A)}`),
        ],
        table: table(PV, rows, k),
      }
    },
  },
  {
    id: 'am-sac-amortizacao',
    category: 'amortizacao',
    name: 'SAC — amortização constante',
    description: 'No Sistema de Amortização Constante a dívida é reduzida pelo mesmo valor em todas as parcelas.',
    latex: 'A = \\dfrac{PV}{n}',
    inputs: [PV, n],
    compute: ({ PV, n }) => {
      checkTerm(n)
      const A = PV / n
      return {
        label: 'Amortização constante', symbol: 'A', value: A, kind: 'currency',
        steps: [step('Resultado', `A = \\dfrac{${tm(PV)}}{${n}} = ${tm(A)}`)],
      }
    },
  },
  {
    id: 'am-sac-juros',
    category: 'amortizacao',
    name: 'SAC — juros no período k',
    description: 'Juros da k-ésima parcela no SAC: taxa sobre o saldo após k − 1 amortizações.',
    latex: 'J_k = \\left(PV - (k - 1) \\times A\\right) \\times i',
    inputs: [PV, i, n, k],
    compute: ({ PV, i, n, k }) => {
      checkTerm(n, k)
      const A = PV / n
      const saldo = PV - (k - 1) * A
      const J = saldo * i
      return {
        label: `Juros no período ${k}`, symbol: `J_{${k}}`, value: J, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Amortização constante', `A = \\dfrac{${tm(PV)}}{${n}} = ${tm(A)}`),
          step('Saldo antes da parcela', `${tm(PV)} - ${k - 1} \\times ${tm(A)} = ${tm(saldo)}`),
          step('Resultado', `J_{${k}} = ${tm(saldo)} \\times ${t(i, 8)} = ${tm(J)}`),
        ],
        table: table(PV, sac(PV, i, n), k),
      }
    },
  },
  {
    id: 'am-sac-prestacao',
    category: 'amortizacao',
    name: 'SAC — prestação no período k',
    description: 'Prestação da k-ésima parcela no SAC: amortização constante mais os juros do período (decrescente).',
    latex: 'P_k = A + J_k',
    inputs: [PV, i, n, k],
    compute: ({ PV, i, n, k }) => {
      checkTerm(n, k)
      const rows = sac(PV, i, n)
      const r = rows[k - 1]
      return {
        label: `Prestação no período ${k}`, symbol: `P_{${k}}`, value: r.P, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Amortização constante', `A = \\dfrac{${tm(PV)}}{${n}} = ${tm(r.A)}`),
          step('Juros do período', `J_{${k}} = ${tm(PV - (k - 1) * r.A)} \\times ${t(i, 8)} = ${tm(r.J)}`),
          step('Resultado', `P_{${k}} = ${tm(r.A)} + ${tm(r.J)} = ${tm(r.P)}`),
        ],
        table: table(PV, rows, k),
      }
    },
  },
  {
    id: 'am-sam',
    category: 'amortizacao',
    name: 'SAM — prestação no período k',
    description: 'Sistema de Amortização Misto: cada prestação é a média aritmética entre a prestação Price e a SAC.',
    latex: 'P_{SAM} = \\dfrac{P_{Price} + P_{SAC}}{2}',
    inputs: [PV, i, n, k],
    compute: ({ PV, i, n, k }) => {
      checkTerm(n, k)
      const p = price(PV, i, n)
      const s = sac(PV, i, n)
      const rows: Row[] = p.map((r, idx) => {
        const q = s[idx]
        return { k: r.k, P: (r.P + q.P) / 2, J: (r.J + q.J) / 2, A: (r.A + q.A) / 2, saldo: (r.saldo + q.saldo) / 2 }
      })
      const P = rows[k - 1].P
      return {
        label: `Prestação SAM no período ${k}`, symbol: `P_{SAM,${k}}`, value: P, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Prestação Price', `P_{Price} = ${tm(p[k - 1].P)}`),
          step(`Prestação SAC no período ${k}`, `P_{SAC} = ${tm(s[k - 1].P)}`),
          step('Resultado', `P_{SAM} = \\dfrac{${tm(p[k - 1].P)} + ${tm(s[k - 1].P)}}{2} = ${tm(P)}`),
        ],
        table: table(PV, rows, k),
      }
    },
  },
]
