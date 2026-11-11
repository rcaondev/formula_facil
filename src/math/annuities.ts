import type { Formula } from '@/types/formula'
import { ensure, fmtMoney, inp, periods, rate, rateStep, step, t, tm } from './format'

const PMT = inp('PMT', 'PMT', 'Parcela (pagamento periódico)', 'currency', 500)
const PV = inp('PV', 'PV', 'Valor presente', 'currency', 10000)
const FV = inp('FV', 'FV', 'Valor futuro', 'currency', 10000)
const i = rate('i', 'i', 'Taxa de juros por período', 1.5, { min: 0, exclusiveMin: true })
const n = periods()

/** Fator de valor futuro de série: ((1+i)^n - 1) / i */
const sFactor = (i: number, n: number) => ((1 + i) ** n - 1) / i
/** Fator de valor presente de série: (1 - (1+i)^-n) / i */
const aFactor = (i: number, n: number) => (1 - (1 + i) ** -n) / i

export const annuityFormulas: Formula[] = [
  {
    id: 'an-fv-postecipada',
    category: 'anuidades',
    name: 'Valor futuro — postecipada',
    description: 'Montante acumulado por uma série de depósitos iguais feitos ao final de cada período.',
    latex: 'FV = PMT \\times \\dfrac{(1 + i)^n - 1}{i}',
    inputs: [PMT, i, n],
    compute: ({ PMT, i, n }) => {
      const f = sFactor(i, n)
      const FV = PMT * f
      return {
        label: 'Valor futuro', symbol: 'FV', value: FV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de acumulação da série', `\\dfrac{(1 + ${t(i, 8)})^{${t(n)}} - 1}{${t(i, 8)}} = ${t(f, 8)}`),
          step('Resultado', `FV = ${tm(PMT)} \\times ${t(f, 8)} = ${tm(FV)}`),
        ],
      }
    },
  },
  {
    id: 'an-pv-postecipada',
    category: 'anuidades',
    name: 'Valor presente — postecipada',
    description: 'Valor à vista equivalente a uma série de pagamentos iguais ao final de cada período.',
    latex: 'PV = PMT \\times \\dfrac{1 - (1 + i)^{-n}}{i}',
    inputs: [PMT, i, n],
    compute: ({ PMT, i, n }) => {
      const f = aFactor(i, n)
      const PV = PMT * f
      return {
        label: 'Valor presente', symbol: 'PV', value: PV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de valor presente da série', `\\dfrac{1 - (1 + ${t(i, 8)})^{-${t(n)}}}{${t(i, 8)}} = ${t(f, 8)}`),
          step('Resultado', `PV = ${tm(PMT)} \\times ${t(f, 8)} = ${tm(PV)}`),
        ],
      }
    },
  },
  {
    id: 'an-pmt-pv',
    category: 'anuidades',
    name: 'Parcela a partir do PV',
    description: 'Valor da prestação postecipada que quita um valor presente (financiamento) em n períodos.',
    latex: 'PMT = PV \\times \\dfrac{i}{1 - (1 + i)^{-n}}',
    inputs: [PV, i, n],
    compute: ({ PV, i, n }) => {
      const f = 1 / aFactor(i, n)
      const PMT = PV * f
      return {
        label: 'Parcela', symbol: 'PMT', value: PMT, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de recuperação de capital', `\\dfrac{${t(i, 8)}}{1 - (1 + ${t(i, 8)})^{-${t(n)}}} = ${t(f, 8)}`),
          step('Resultado', `PMT = ${tm(PV)} \\times ${t(f, 8)} = ${tm(PMT)}`),
        ],
      }
    },
  },
  {
    id: 'an-pmt-fv',
    category: 'anuidades',
    name: 'Parcela a partir do FV',
    description: 'Depósito periódico (ao final de cada período) necessário para acumular o valor futuro desejado.',
    latex: 'PMT = FV \\times \\dfrac{i}{(1 + i)^n - 1}',
    inputs: [FV, i, n],
    compute: ({ FV, i, n }) => {
      const f = 1 / sFactor(i, n)
      const PMT = FV * f
      return {
        label: 'Parcela', symbol: 'PMT', value: PMT, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de formação de capital', `\\dfrac{${t(i, 8)}}{(1 + ${t(i, 8)})^{${t(n)}} - 1} = ${t(f, 8)}`),
          step('Resultado', `PMT = ${tm(FV)} \\times ${t(f, 8)} = ${tm(PMT)}`),
        ],
      }
    },
  },
  {
    id: 'an-fv-antecipada',
    category: 'anuidades',
    name: 'Valor futuro — antecipada',
    description: 'Montante de uma série com pagamentos no início de cada período: cada parcela rende um período a mais.',
    latex: 'FV_{ant} = FV_{post} \\times (1 + i)',
    inputs: [PMT, i, n],
    compute: ({ PMT, i, n }) => {
      const post = PMT * sFactor(i, n)
      const FV = post * (1 + i)
      return {
        label: 'Valor futuro antecipado', symbol: 'FV_{ant}', value: FV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Série postecipada', `FV_{post} = ${tm(PMT)} \\times ${t(sFactor(i, n), 8)} = ${tm(post)}`),
          step('Resultado', `FV_{ant} = ${tm(post)} \\times ${t(1 + i, 8)} = ${tm(FV)}`),
        ],
      }
    },
  },
  {
    id: 'an-pv-antecipada',
    category: 'anuidades',
    name: 'Valor presente — antecipada',
    description: 'Valor à vista de uma série com a primeira parcela paga no ato (entrada).',
    latex: 'PV_{ant} = PV_{post} \\times (1 + i)',
    inputs: [PMT, i, n],
    compute: ({ PMT, i, n }) => {
      const post = PMT * aFactor(i, n)
      const PV = post * (1 + i)
      return {
        label: 'Valor presente antecipado', symbol: 'PV_{ant}', value: PV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Série postecipada', `PV_{post} = ${tm(PMT)} \\times ${t(aFactor(i, n), 8)} = ${tm(post)}`),
          step('Resultado', `PV_{ant} = ${tm(post)} \\times ${t(1 + i, 8)} = ${tm(PV)}`),
        ],
      }
    },
  },
  {
    id: 'an-perpetuidade',
    category: 'anuidades',
    name: 'Perpetuidade simples',
    description: 'Valor presente de uma série infinita de pagamentos constantes.',
    latex: 'PV = \\dfrac{PMT}{i}',
    inputs: [PMT, i],
    compute: ({ PMT, i }) => {
      const PV = PMT / i
      return {
        label: 'Valor presente', symbol: 'PV', value: PV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Resultado', `PV = \\dfrac{${tm(PMT)}}{${t(i, 8)}} = ${tm(PV)}`),
        ],
      }
    },
  },
  {
    id: 'an-gordon',
    category: 'anuidades',
    name: 'Perpetuidade com crescimento',
    description: 'Modelo de Gordon: série infinita cujo primeiro pagamento é PMT e que cresce à taxa g por período.',
    latex: 'PV = \\dfrac{PMT}{i - g}',
    inputs: [PMT, i, rate('g', 'g', 'Taxa de crescimento por período', 0.5)],
    compute: ({ PMT, i, g }) => {
      ensure(i > g, 'A taxa de desconto (i) precisa ser maior que a taxa de crescimento (g).')
      const PV = PMT / (i - g)
      return {
        label: 'Valor presente', symbol: 'PV', value: PV, kind: 'currency',
        steps: [
          step('Taxas na forma decimal', `i = ${t(i, 8)},\\quad g = ${t(g, 8)}`),
          step('Substituindo os valores', `PV = \\dfrac{${tm(PMT)}}{${t(i, 8)} - ${t(g, 8)}} = \\dfrac{${tm(PMT)}}{${t(i - g, 8)}}`),
          step('Resultado', `PV = ${tm(PV)}`),
        ],
      }
    },
  },
  {
    id: 'an-n-parcelas',
    category: 'anuidades',
    name: 'Número de parcelas',
    description: 'Quantas parcelas postecipadas de valor PMT são necessárias para quitar um valor presente PV.',
    latex: 'n = \\dfrac{-\\ln\\left(1 - \\dfrac{PV \\times i}{PMT}\\right)}{\\ln(1 + i)}',
    inputs: [PV, PMT, i],
    compute: ({ PV, PMT, i }) => {
      const juros = PV * i
      ensure(PMT > juros, `A parcela precisa ser maior que os juros do primeiro período (${fmtMoney(juros)}); senão a dívida nunca diminui.`)
      const ratio = 1 - juros / PMT
      const num = -Math.log(ratio)
      const den = Math.log(1 + i)
      const n = num / den
      return {
        label: 'Número de parcelas', symbol: 'n', value: n, kind: 'periods',
        note: Number.isInteger(Math.round(n * 1e6) / 1e6) ? undefined : `Na prática: ${Math.ceil(n)} parcelas, sendo a última menor.`,
        steps: [
          rateStep('i', i),
          step('Juros do primeiro período', `PV \\times i = ${tm(PV)} \\times ${t(i, 8)} = ${tm(juros)}`),
          step('Razão entre os valores', `1 - \\dfrac{${tm(juros)}}{${tm(PMT)}} = ${t(ratio, 8)}`),
          step('Logaritmo da razão', `-\\ln(${t(ratio, 8)}) = ${t(num, 8)}`),
          step('Logaritmo do fator', `\\ln(${t(1 + i, 8)}) = ${t(den, 8)}`),
          step('Resultado', `n = \\dfrac{${t(num, 8)}}{${t(den, 8)}} = ${t(n, 4)}`),
        ],
      }
    },
  },
  {
    id: 'an-diferida',
    category: 'anuidades',
    name: 'Valor presente — diferida (carência)',
    description: 'Série postecipada que só começa após m períodos de carência: calcula-se a série e desconta-se a carência.',
    latex: 'PV = PMT \\times \\dfrac{1 - (1 + i)^{-n}}{i} \\times \\dfrac{1}{(1 + i)^{m}}',
    inputs: [PMT, i, n, inp('m', 'm', 'Períodos de carência', 'integer', 3, { min: 0 })],
    compute: ({ PMT, i, n, m }) => {
      const a = aFactor(i, n)
      const post = PMT * a
      const disc = (1 + i) ** m
      const PV = post / disc
      return {
        label: 'Valor presente', symbol: 'PV', value: PV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Série postecipada', `PV_{post} = ${tm(PMT)} \\times ${t(a, 8)} = ${tm(post)}`),
          step('Fator de desconto', `(1 + ${t(i, 8)})^{${t(m)}} = ${t(disc, 8)}`),
          step('Resultado', `PV = \\dfrac{${tm(post)}}{${t(disc, 8)}} = ${tm(PV)}`),
        ],
      }
    },
  },
]
