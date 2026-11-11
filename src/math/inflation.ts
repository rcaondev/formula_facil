import type { Formula } from '@/types/formula'
import { ensure, fmtMoney, fmtNumber, fmtPercent, inp, rate, rateStep, step, t, tm } from './format'

const custo = inp('custo', '\\text{Custo}', 'Custo de aquisição', 'currency', 50000, { min: 0 })
const residual = inp('residual', '\\text{VR}', 'Valor residual', 'currency', 5000, { min: 0 })
const infl = rate('infl', '\\pi', 'Inflação acumulada', 4.5, { min: -100, exclusiveMin: true })

export const inflationFormulas: Formula[] = [
  {
    id: 'inf-correcao',
    category: 'inflacao',
    name: 'Correção monetária',
    description: 'Atualiza um valor nominal pela inflação acumulada do período.',
    latex: 'V_{corrigido} = V_{nominal} \\times (1 + \\pi)',
    inputs: [inp('V', 'V_{nominal}', 'Valor nominal', 'currency', 1000), infl],
    compute: ({ V, infl }) => {
      const Vc = V * (1 + infl)
      return {
        label: 'Valor corrigido', symbol: 'V_{corrigido}', value: Vc, kind: 'currency',
        steps: [
          rateStep('\\pi', infl),
          step('Fator de correção', `1 + ${t(infl, 8)} = ${t(1 + infl, 8)}`),
          step('Resultado', `V_{corrigido} = ${tm(V)} \\times ${t(1 + infl, 8)} = ${tm(Vc)}`),
        ],
      }
    },
  },
  {
    id: 'inf-valor-real',
    category: 'inflacao',
    name: 'Valor real (deflacionar)',
    description: 'Traz um valor nominal futuro para o poder de compra de hoje, descontando a inflação do período.',
    latex: 'V_{real} = \\dfrac{V_{nominal}}{1 + \\pi}',
    inputs: [inp('V', 'V_{nominal}', 'Valor nominal', 'currency', 1045), infl],
    compute: ({ V, infl }) => {
      const Vr = V / (1 + infl)
      const loss = 1 - 1 / (1 + infl)
      return {
        label: 'Valor real', symbol: 'V_{real}', value: Vr, kind: 'currency',
        note: infl > 0 ? `Perda de poder de compra no período: ${fmtPercent(loss, 2)}.` : undefined,
        steps: [
          rateStep('\\pi', infl),
          step('Fator de correção', `1 + ${t(infl, 8)} = ${t(1 + infl, 8)}`),
          step('Resultado', `V_{real} = \\dfrac{${tm(V)}}{${t(1 + infl, 8)}} = ${tm(Vr)}`),
        ],
      }
    },
  },
  {
    id: 'dep-linear',
    category: 'inflacao',
    name: 'Depreciação linear',
    description: 'Distribui o valor depreciável igualmente ao longo da vida útil do bem.',
    latex: 'D_{anual} = \\dfrac{\\text{Custo} - \\text{Valor Residual}}{\\text{Vida Útil}}',
    inputs: [custo, residual, inp('vida', 'n', 'Vida útil (anos)', 'number', 10, { min: 0, exclusiveMin: true })],
    compute: ({ custo, residual, vida }) => {
      const base = custo - residual
      const D = base / vida
      const showTable = Number.isInteger(vida) && vida <= 100
      let book = custo
      return {
        label: 'Depreciação anual', symbol: 'D_{anual}', value: D, kind: 'currency',
        steps: [
          step('Valor depreciável', `${tm(custo)} - ${tm(residual)} = ${tm(base)}`),
          step('Resultado', `D_{anual} = \\dfrac{${tm(base)}}{${t(vida)}} = ${tm(D)}`),
        ],
        table: showTable
          ? {
              columns: ['Ano', 'Depreciação', 'Depreciação acumulada', 'Valor contábil'],
              rows: Array.from({ length: vida }, (_, idx) => {
                book -= D
                return [String(idx + 1), fmtMoney(D), fmtMoney(D * (idx + 1)), fmtMoney(book)]
              }),
            }
          : undefined,
      }
    },
  },
  {
    id: 'dep-soyd',
    category: 'inflacao',
    name: 'Depreciação soma dos dígitos',
    description: 'Método acelerado (SOYD): deprecia mais nos primeiros anos, na proporção dos anos restantes de vida útil.',
    latex: 'D_k = (\\text{Custo} - \\text{VR}) \\times \\dfrac{\\text{Anos restantes}}{\\sum \\text{Dígitos}}',
    inputs: [
      custo,
      residual,
      inp('vida', 'n', 'Vida útil (anos)', 'integer', 5, { min: 1 }),
      inp('k', 'k', 'Ano consultado', 'integer', 1, { min: 1 }),
    ],
    compute: ({ custo, residual, vida, k }) => {
      ensure(vida <= 100, 'Use uma vida útil de no máximo 100 anos.')
      ensure(k <= vida, 'O ano consultado (k) não pode ser maior que a vida útil.')
      const base = custo - residual
      const soma = (vida * (vida + 1)) / 2
      const rest = vida - k + 1
      const D = (base * rest) / soma
      let acc = 0
      return {
        label: `Depreciação no ano ${k}`, symbol: `D_{${k}}`, value: D, kind: 'currency',
        steps: [
          step('Valor depreciável', `${tm(custo)} - ${tm(residual)} = ${tm(base)}`),
          step('Soma dos dígitos', `1 + 2 + \\cdots + ${vida} = \\dfrac{${vida} \\times ${vida + 1}}{2} = ${soma}`),
          step(`Anos restantes no ano ${k}`, `${vida} - ${k} + 1 = ${rest}`),
          step('Resultado', `D_{${k}} = ${tm(base)} \\times \\dfrac{${rest}}{${soma}} = ${tm(D)}`),
        ],
        table: {
          columns: ['Ano', 'Fração', 'Depreciação', 'Valor contábil'],
          rows: Array.from({ length: vida }, (_, idx) => {
            const r = vida - idx
            const d = (base * r) / soma
            acc += d
            return [String(idx + 1), `${r}/${soma} (${fmtNumber((r / soma) * 100, 2)}%)`, fmtMoney(d), fmtMoney(custo - acc)]
          }),
          highlight: k - 1,
        },
      }
    },
  },
  {
    id: 'dep-exponencial',
    category: 'inflacao',
    name: 'Depreciação exponencial',
    description: 'Método do saldo decrescente: a cada ano o bem perde uma taxa fixa d do valor contábil que ainda resta.',
    latex: 'V_n = \\text{Custo} \\times (1 - d)^n',
    inputs: [
      custo,
      rate('d', 'd', 'Taxa de depreciação anual', 20, { min: 0 }),
      inp('n', 'n', 'Anos decorridos', 'integer', 3, { min: 1 }),
    ],
    compute: ({ custo, d, n }) => {
      ensure(d < 1, 'A taxa de depreciação precisa ser menor que 100%.')
      ensure(n <= 100, 'Use no máximo 100 anos.')
      const f = (1 - d) ** n
      const Vn = custo * f
      let book = custo
      return {
        label: `Valor contábil após ${n} anos`, symbol: `V_{${n}}`, value: Vn, kind: 'currency',
        steps: [
          rateStep('d', d),
          step('Fator de permanência', `(1 - ${t(d, 8)})^{${n}} = ${t(1 - d, 8)}^{${n}} = ${t(f, 8)}`),
          step('Resultado', `V_{${n}} = ${tm(custo)} \\times ${t(f, 8)} = ${tm(Vn)}`),
        ],
        table: {
          columns: ['Ano', 'Depreciação', 'Depreciação acumulada', 'Valor contábil'],
          rows: Array.from({ length: n }, (_, idx) => {
            const dep = book * d
            book -= dep
            return [String(idx + 1), fmtMoney(dep), fmtMoney(custo - book), fmtMoney(book)]
          }),
          highlight: n - 1,
        },
      }
    },
  },
]
