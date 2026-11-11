import type { Formula } from '@/types/formula'
import { ensure, inp, periods, rate, rateStep, step, t, tm, tp } from './format'

const C = inp('C', 'C', 'Capital', 'currency', 10000)
const J = inp('J', 'J', 'Juros', 'currency', 2400)
const i = rate('i', 'i', 'Taxa de juros por período', 2)
const tt = periods('t', 't', 'Tempo (nº de períodos)', 12)
const N = inp('N', 'N', 'Valor nominal (de face)', 'currency', 10000)

const SAME_UNIT = 'Taxa e tempo devem estar na mesma unidade (ex.: taxa mensal e prazo em meses).'

export const simpleInterestFormulas: Formula[] = [
  // ---------------- Juros Simples ----------------
  {
    id: 'js-juros',
    category: 'juros-simples',
    name: 'Juros',
    description: `Juros gerados por um capital aplicado a juros simples. ${SAME_UNIT}`,
    latex: 'J = C \\times i \\times t',
    inputs: [C, i, tt],
    compute: ({ C, i, t: n }) => {
      const J = C * i * n
      return {
        label: 'Juros', symbol: 'J', value: J, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `J = ${tm(C)} \\times ${t(i, 8)} \\times ${t(n)}`),
          step('Resultado', `J = ${tm(J)}`),
        ],
      }
    },
  },
  {
    id: 'js-montante',
    category: 'juros-simples',
    name: 'Montante',
    description: `Valor final (capital + juros) de uma aplicação a juros simples. ${SAME_UNIT}`,
    latex: 'M = C + J = C \\times (1 + i \\times t)',
    inputs: [C, i, tt],
    compute: ({ C, i, t: n }) => {
      const f = 1 + i * n
      const M = C * f
      return {
        label: 'Montante', symbol: 'M', value: M, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `M = ${tm(C)} \\times (1 + ${t(i, 8)} \\times ${t(n)})`),
          step('Fator de acumulação', `1 + ${t(i, 8)} \\times ${t(n)} = ${t(f, 8)}`),
          step('Resultado', `M = ${tm(C)} \\times ${t(f, 8)} = ${tm(M)}`),
        ],
      }
    },
  },
  {
    id: 'js-capital',
    category: 'juros-simples',
    name: 'Capital',
    description: `Capital necessário para gerar um determinado valor de juros. ${SAME_UNIT}`,
    latex: 'C = \\dfrac{J}{i \\times t}',
    inputs: [J, i, tt],
    compute: ({ J, i, t: n }) => {
      ensure(i * n !== 0, 'A taxa e o tempo devem ser diferentes de zero.')
      const C = J / (i * n)
      return {
        label: 'Capital', symbol: 'C', value: C, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `C = \\dfrac{${tm(J)}}{${t(i, 8)} \\times ${t(n)}} = \\dfrac{${tm(J)}}{${t(i * n, 8)}}`),
          step('Resultado', `C = ${tm(C)}`),
        ],
      }
    },
  },
  {
    id: 'js-taxa',
    category: 'juros-simples',
    name: 'Taxa de juros',
    description: 'Taxa por período que, aplicada ao capital durante o tempo informado, gera os juros indicados.',
    latex: 'i = \\dfrac{J}{C \\times t}',
    inputs: [J, C, tt],
    compute: ({ J, C, t: n }) => {
      ensure(C * n !== 0, 'O capital e o tempo devem ser diferentes de zero.')
      const r = J / (C * n)
      return {
        label: 'Taxa por período', symbol: 'i', value: r, kind: 'percent',
        steps: [
          step('Substituindo os valores', `i = \\dfrac{${tm(J)}}{${tm(C)} \\times ${t(n)}} = \\dfrac{${tm(J)}}{${tm(C * n)}}`),
          step('Resultado', `i = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'js-tempo',
    category: 'juros-simples',
    name: 'Tempo',
    description: 'Número de períodos necessários para que o capital gere os juros indicados. O resultado sai na mesma unidade da taxa.',
    latex: 't = \\dfrac{J}{C \\times i}',
    inputs: [J, C, i],
    compute: ({ J, C, i }) => {
      ensure(C * i !== 0, 'O capital e a taxa devem ser diferentes de zero.')
      const n = J / (C * i)
      return {
        label: 'Tempo', symbol: 't', value: n, kind: 'periods',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `t = \\dfrac{${tm(J)}}{${tm(C)} \\times ${t(i, 8)}} = \\dfrac{${tm(J)}}{${tm(C * i)}}`),
          step('Resultado', `t = ${t(n, 4)} \\text{ períodos}`),
        ],
      }
    },
  },

  // ---------------- Descontos Simples ----------------
  {
    id: 'ds-desconto-racional',
    category: 'descontos-simples',
    name: 'Desconto racional (por dentro)',
    description: 'Desconto calculado sobre o valor presente do título. Equivale aos juros simples sobre o valor atual.',
    latex: 'D_r = \\dfrac{N \\times i \\times t}{1 + i \\times t}',
    inputs: [N, i, tt],
    compute: ({ N, i, t: n }) => {
      const den = 1 + i * n
      ensure(den !== 0, 'O denominador (1 + i·t) não pode ser zero.')
      const D = (N * i * n) / den
      return {
        label: 'Desconto racional', symbol: 'D_r', value: D, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `D_r = \\dfrac{${tm(N)} \\times ${t(i, 8)} \\times ${t(n)}}{1 + ${t(i, 8)} \\times ${t(n)}}`),
          step('Simplificando', `D_r = \\dfrac{${tm(N * i * n)}}{${t(den, 8)}}`),
          step('Resultado', `D_r = ${tm(D)}`),
        ],
      }
    },
  },
  {
    id: 'ds-vp-racional',
    category: 'descontos-simples',
    name: 'Valor presente racional',
    description: 'Valor atual de um título descontado pelo critério racional (por dentro).',
    latex: 'V_r = \\dfrac{N}{1 + i \\times t}',
    inputs: [N, i, tt],
    compute: ({ N, i, t: n }) => {
      const den = 1 + i * n
      ensure(den !== 0, 'O denominador (1 + i·t) não pode ser zero.')
      const V = N / den
      return {
        label: 'Valor presente racional', symbol: 'V_r', value: V, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `V_r = \\dfrac{${tm(N)}}{1 + ${t(i, 8)} \\times ${t(n)}} = \\dfrac{${tm(N)}}{${t(den, 8)}}`),
          step('Resultado', `V_r = ${tm(V)}`),
        ],
      }
    },
  },
  {
    id: 'ds-desconto-comercial',
    category: 'descontos-simples',
    name: 'Desconto comercial (por fora)',
    description: 'Desconto calculado diretamente sobre o valor nominal do título. É o critério usado pelos bancos.',
    latex: 'D_c = N \\times i \\times t',
    inputs: [N, i, tt],
    compute: ({ N, i, t: n }) => {
      const D = N * i * n
      return {
        label: 'Desconto comercial', symbol: 'D_c', value: D, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `D_c = ${tm(N)} \\times ${t(i, 8)} \\times ${t(n)}`),
          step('Resultado', `D_c = ${tm(D)}`),
        ],
      }
    },
  },
  {
    id: 'ds-vp-comercial',
    category: 'descontos-simples',
    name: 'Valor presente comercial',
    description: 'Valor atual de um título descontado pelo critério comercial (por fora).',
    latex: 'V_c = N \\times (1 - i \\times t)',
    inputs: [N, i, tt],
    compute: ({ N, i, t: n }) => {
      const f = 1 - i * n
      const V = N * f
      return {
        label: 'Valor presente comercial', symbol: 'V_c', value: V, kind: 'currency',
        note: f <= 0 ? 'Com i·t ≥ 1 o desconto comercial consome todo o valor nominal; o resultado não tem sentido econômico.' : undefined,
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `V_c = ${tm(N)} \\times (1 - ${t(i, 8)} \\times ${t(n)}) = ${tm(N)} \\times ${t(f, 8)}`),
          step('Resultado', `V_c = ${tm(V)}`),
        ],
      }
    },
  },
  {
    id: 'ds-relacao',
    category: 'descontos-simples',
    name: 'Relação comercial × racional',
    description: 'Obtém o desconto comercial a partir do desconto racional para a mesma taxa e prazo.',
    latex: 'D_c = D_r \\times (1 + i \\times t)',
    inputs: [inp('Dr', 'D_r', 'Desconto racional', 'currency', 1935.48), i, tt],
    compute: ({ Dr, i, t: n }) => {
      const f = 1 + i * n
      const D = Dr * f
      return {
        label: 'Desconto comercial', symbol: 'D_c', value: D, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `D_c = ${tm(Dr)} \\times (1 + ${t(i, 8)} \\times ${t(n)}) = ${tm(Dr)} \\times ${t(f, 8)}`),
          step('Resultado', `D_c = ${tm(D)}`),
        ],
      }
    },
  },
]
