import type { Formula } from '@/types/formula'
import { ensure, inp, periods, rate, rateStep, step, t, tm, tp } from './format'

const PV = inp('PV', 'PV', 'Valor presente (capital)', 'currency', 10000)
const FV = inp('FV', 'FV', 'Valor futuro (montante)', 'currency', 12682.42)
const i = rate('i', 'i', 'Taxa de juros por período', 2, { min: -100, exclusiveMin: true })
const n = periods()
const N = inp('N', 'N', 'Valor nominal (de face)', 'currency', 10000)

export const compoundInterestFormulas: Formula[] = [
  // ---------------- Juros Compostos ----------------
  {
    id: 'jc-montante',
    category: 'juros-compostos',
    name: 'Montante (FV)',
    description: 'Valor futuro de um capital aplicado a juros compostos: os juros de cada período são incorporados ao capital.',
    latex: 'FV = PV \\times (1 + i)^n',
    inputs: [PV, i, n],
    compute: ({ PV, i, n }) => {
      const f = (1 + i) ** n
      const FV = PV * f
      return {
        label: 'Valor futuro', symbol: 'FV', value: FV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `FV = ${tm(PV)} \\times (1 + ${t(i, 8)})^{${t(n)}}`),
          step('Fator de acumulação', `(${t(1 + i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Resultado', `FV = ${tm(PV)} \\times ${t(f, 8)} = ${tm(FV)}`),
        ],
      }
    },
  },
  {
    id: 'jc-valor-presente',
    category: 'juros-compostos',
    name: 'Valor presente (PV)',
    description: 'Capital que, aplicado a juros compostos, resulta no valor futuro informado.',
    latex: 'PV = \\dfrac{FV}{(1 + i)^n}',
    inputs: [FV, i, n],
    compute: ({ FV, i, n }) => {
      const f = (1 + i) ** n
      const PV = FV / f
      return {
        label: 'Valor presente', symbol: 'PV', value: PV, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Substituindo os valores', `PV = \\dfrac{${tm(FV)}}{(1 + ${t(i, 8)})^{${t(n)}}}`),
          step('Fator de acumulação', `(${t(1 + i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Resultado', `PV = \\dfrac{${tm(FV)}}{${t(f, 8)}} = ${tm(PV)}`),
        ],
      }
    },
  },
  {
    id: 'jc-taxa',
    category: 'juros-compostos',
    name: 'Taxa de juros',
    description: 'Taxa por período que transforma o valor presente no valor futuro em n períodos.',
    latex: 'i = \\left(\\dfrac{FV}{PV}\\right)^{\\frac{1}{n}} - 1',
    inputs: [FV, PV, n],
    compute: ({ FV, PV, n }) => {
      ensure(PV > 0 && FV > 0, 'PV e FV devem ser positivos.')
      const ratio = FV / PV
      const r = ratio ** (1 / n) - 1
      return {
        label: 'Taxa por período', symbol: 'i', value: r, kind: 'percent',
        steps: [
          step('Razão entre os valores', `\\dfrac{FV}{PV} = \\dfrac{${tm(FV)}}{${tm(PV)}} = ${t(ratio, 8)}`),
          step('Raiz de ordem n', `(${t(ratio, 8)})^{\\frac{1}{${t(n)}}} = ${t(ratio ** (1 / n), 8)}`),
          step('Resultado', `i = ${t(ratio ** (1 / n), 8)} - 1 = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'jc-periodos',
    category: 'juros-compostos',
    name: 'Número de períodos',
    description: 'Quantos períodos são necessários para que o valor presente atinja o valor futuro à taxa informada.',
    latex: 'n = \\dfrac{\\ln(FV / PV)}{\\ln(1 + i)}',
    inputs: [FV, PV, rate('i', 'i', 'Taxa de juros por período', 2, { min: 0, exclusiveMin: true })],
    compute: ({ FV, PV, i }) => {
      ensure(PV > 0 && FV > 0, 'PV e FV devem ser positivos.')
      const a = Math.log(FV / PV)
      const b = Math.log(1 + i)
      const nn = a / b
      return {
        label: 'Número de períodos', symbol: 'n', value: nn, kind: 'periods',
        steps: [
          rateStep('i', i),
          step('Logaritmo da razão', `\\ln\\left(\\dfrac{${tm(FV)}}{${tm(PV)}}\\right) = ${t(a, 8)}`),
          step('Logaritmo do fator', `\\ln(${t(1 + i, 8)}) = ${t(b, 8)}`),
          step('Resultado', `n = \\dfrac{${t(a, 8)}}{${t(b, 8)}} = ${t(nn, 4)} \\text{ períodos}`),
        ],
      }
    },
  },
  {
    id: 'jc-juros',
    category: 'juros-compostos',
    name: 'Juros acumulados',
    description: 'Total de juros gerados por um capital aplicado a juros compostos.',
    latex: 'J = PV \\times \\left((1 + i)^n - 1\\right)',
    inputs: [PV, i, n],
    compute: ({ PV, i, n }) => {
      const f = (1 + i) ** n
      const J = PV * (f - 1)
      return {
        label: 'Juros acumulados', symbol: 'J', value: J, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de acumulação', `(1 + ${t(i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Substituindo os valores', `J = ${tm(PV)} \\times (${t(f, 8)} - 1)`),
          step('Resultado', `J = ${tm(J)}`),
        ],
      }
    },
  },

  // ---------------- Descontos Compostos ----------------
  {
    id: 'dc-desconto-racional',
    category: 'descontos-compostos',
    name: 'Desconto racional composto',
    description: 'Diferença entre o valor nominal e o valor presente obtido por capitalização composta.',
    latex: 'D_r = N \\times \\left(1 - \\dfrac{1}{(1 + i)^n}\\right)',
    inputs: [N, i, n],
    compute: ({ N, i, n }) => {
      const f = (1 + i) ** n
      const D = N * (1 - 1 / f)
      return {
        label: 'Desconto racional composto', symbol: 'D_r', value: D, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de acumulação', `(1 + ${t(i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Substituindo os valores', `D_r = ${tm(N)} \\times \\left(1 - \\dfrac{1}{${t(f, 8)}}\\right) = ${tm(N)} \\times ${t(1 - 1 / f, 8)}`),
          step('Resultado', `D_r = ${tm(D)}`),
        ],
      }
    },
  },
  {
    id: 'dc-vp-racional',
    category: 'descontos-compostos',
    name: 'Valor presente racional composto',
    description: 'Valor atual de um título pelo desconto racional composto.',
    latex: 'V_r = \\dfrac{N}{(1 + i)^n}',
    inputs: [N, i, n],
    compute: ({ N, i, n }) => {
      const f = (1 + i) ** n
      const V = N / f
      return {
        label: 'Valor presente racional', symbol: 'V_r', value: V, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de acumulação', `(1 + ${t(i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Resultado', `V_r = \\dfrac{${tm(N)}}{${t(f, 8)}} = ${tm(V)}`),
        ],
      }
    },
  },
  {
    id: 'dc-desconto-comercial',
    category: 'descontos-compostos',
    name: 'Desconto comercial composto',
    description: 'Desconto composto calculado "por fora", aplicando a taxa sucessivamente sobre o valor nominal.',
    latex: 'D_c = N \\times \\left(1 - (1 - i)^n\\right)',
    inputs: [N, rate('i', 'i', 'Taxa de desconto por período', 2, { min: 0 }), n],
    compute: ({ N, i, n }) => {
      ensure(i < 1, 'A taxa de desconto comercial deve ser menor que 100%.')
      const f = (1 - i) ** n
      const D = N * (1 - f)
      return {
        label: 'Desconto comercial composto', symbol: 'D_c', value: D, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de desconto', `(1 - ${t(i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Substituindo os valores', `D_c = ${tm(N)} \\times (1 - ${t(f, 8)})`),
          step('Resultado', `D_c = ${tm(D)}`),
        ],
      }
    },
  },
  {
    id: 'dc-vp-comercial',
    category: 'descontos-compostos',
    name: 'Valor presente comercial composto',
    description: 'Valor atual de um título pelo desconto comercial composto.',
    latex: 'V_c = N \\times (1 - i)^n',
    inputs: [N, rate('i', 'i', 'Taxa de desconto por período', 2, { min: 0 }), n],
    compute: ({ N, i, n }) => {
      ensure(i < 1, 'A taxa de desconto comercial deve ser menor que 100%.')
      const f = (1 - i) ** n
      const V = N * f
      return {
        label: 'Valor presente comercial', symbol: 'V_c', value: V, kind: 'currency',
        steps: [
          rateStep('i', i),
          step('Fator de desconto', `(1 - ${t(i, 8)})^{${t(n)}} = ${t(f, 8)}`),
          step('Resultado', `V_c = ${tm(N)} \\times ${t(f, 8)} = ${tm(V)}`),
        ],
      }
    },
  },

  // ---------------- Conversão de Taxas ----------------
  {
    id: 'tx-equivalente',
    category: 'taxas',
    name: 'Taxas equivalentes',
    description: 'Converte uma taxa composta entre períodos diferentes. Informe os prazos na mesma unidade (ex.: 12 meses → 1 mês para ir de anual a mensal).',
    latex: 'i_q = (1 + i_t)^{\\frac{q}{t}} - 1',
    inputs: [
      rate('it', 'i_t', 'Taxa conhecida', 12, { min: -100, exclusiveMin: true }),
      periods('t', 't', 'Prazo da taxa conhecida', 12),
      periods('q', 'q', 'Prazo da taxa desejada', 1),
    ],
    compute: ({ it, t: tt, q }) => {
      const r = (1 + it) ** (q / tt) - 1
      return {
        label: 'Taxa equivalente', symbol: 'i_q', value: r, kind: 'percent',
        steps: [
          rateStep('i_t', it),
          step('Expoente', `\\dfrac{q}{t} = \\dfrac{${t(q)}}{${t(tt)}} = ${t(q / tt, 8)}`),
          step('Substituindo os valores', `i_q = (${t(1 + it, 8)})^{${t(q / tt, 8)}} - 1 = ${t(r + 1, 8)} - 1`),
          step('Resultado', `i_q = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'tx-nominal-efetiva',
    category: 'taxas',
    name: 'Taxa nominal → efetiva',
    description: 'Taxa efetiva de uma taxa nominal capitalizada k vezes no período (ex.: 12% a.a. capitalizada mensalmente → k = 12).',
    latex: 'i_{ef} = \\left(1 + \\dfrac{i_{nom}}{k}\\right)^k - 1',
    inputs: [
      rate('inom', 'i_{nom}', 'Taxa nominal', 12),
      periods('k', 'k', 'Capitalizações no período', 12),
    ],
    compute: ({ inom, k }) => {
      const per = inom / k
      const r = (1 + per) ** k - 1
      return {
        label: 'Taxa efetiva', symbol: 'i_{ef}', value: r, kind: 'percent',
        steps: [
          rateStep('i_{nom}', inom),
          step('Taxa por subperíodo', `\\dfrac{i_{nom}}{k} = \\dfrac{${t(inom, 8)}}{${t(k)}} = ${t(per, 8)}`),
          step('Substituindo os valores', `i_{ef} = (${t(1 + per, 8)})^{${t(k)}} - 1`),
          step('Resultado', `i_{ef} = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'tx-real',
    category: 'taxas',
    name: 'Taxa real (Fisher)',
    description: 'Rendimento descontado da inflação do mesmo período.',
    latex: 'i_{real} = \\dfrac{1 + i_{nom}}{1 + i_{infl}} - 1',
    inputs: [
      rate('inom', 'i_{nom}', 'Taxa nominal', 12),
      rate('infl', 'i_{infl}', 'Inflação do período', 4.5, { min: -100, exclusiveMin: true }),
    ],
    compute: ({ inom, infl }) => {
      const r = (1 + inom) / (1 + infl) - 1
      return {
        label: 'Taxa real', symbol: 'i_{real}', value: r, kind: 'percent',
        steps: [
          step('Taxas na forma decimal', `i_{nom} = ${t(inom, 8)},\\quad i_{infl} = ${t(infl, 8)}`),
          step('Substituindo os valores', `i_{real} = \\dfrac{${t(1 + inom, 8)}}{${t(1 + infl, 8)}} - 1 = ${t(r + 1, 8)} - 1`),
          step('Resultado', `i_{real} = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'tx-proporcional',
    category: 'taxas',
    name: 'Taxa proporcional',
    description: 'Conversão linear de taxas (juros simples). Ex.: 24% a.a. → mensal com k₁ = 1 e k₂ = 12.',
    latex: 'i_1 = i_2 \\times \\dfrac{k_1}{k_2}',
    inputs: [
      rate('i2', 'i_2', 'Taxa conhecida', 24),
      periods('k1', 'k_1', 'Prazo da taxa desejada', 1),
      periods('k2', 'k_2', 'Prazo da taxa conhecida', 12),
    ],
    compute: ({ i2, k1, k2 }) => {
      const r = (i2 * k1) / k2
      return {
        label: 'Taxa proporcional', symbol: 'i_1', value: r, kind: 'percent',
        steps: [
          rateStep('i_2', i2),
          step('Substituindo os valores', `i_1 = ${t(i2, 8)} \\times \\dfrac{${t(k1)}}{${t(k2)}}`),
          step('Resultado', `i_1 = ${t(r, 8)} = ${tp(r)}`),
        ],
      }
    },
  },
  {
    id: 'tx-continua',
    category: 'taxas',
    name: 'Taxa efetiva da capitalização contínua',
    description: 'Converte uma taxa com capitalização contínua (r) na taxa efetiva equivalente do mesmo período.',
    latex: 'i_{efetiva} = e^{r} - 1',
    inputs: [rate('r', 'r', 'Taxa contínua por período', 10)],
    compute: ({ r }) => {
      const ef = Math.exp(r) - 1
      return {
        label: 'Taxa efetiva', symbol: 'i_{efetiva}', value: ef, kind: 'percent',
        steps: [
          rateStep('r', r),
          step('Exponencial', `e^{${t(r, 8)}} = ${t(Math.exp(r), 8)}`),
          step('Resultado', `i_{efetiva} = ${t(Math.exp(r), 8)} - 1 = ${t(ef, 8)} = ${tp(ef)}`),
        ],
      }
    },
  },
  // ---------------- Juros Compostos (contínuo) ----------------
  {
    id: 'jc-continua',
    category: 'juros-compostos',
    name: 'Capitalização contínua',
    description: 'Montante quando os juros são incorporados a cada instante — o limite da capitalização composta com períodos infinitamente curtos.',
    latex: 'FV = PV \\times e^{r \\times n}',
    inputs: [PV, rate('r', 'r', 'Taxa contínua por período', 2), n],
    compute: ({ PV, r, n }) => {
      const x = r * n
      const f = Math.exp(x)
      const FV = PV * f
      return {
        label: 'Valor futuro', symbol: 'FV', value: FV, kind: 'currency',
        steps: [
          rateStep('r', r),
          step('Expoente', `r \\times n = ${t(r, 8)} \\times ${t(n)} = ${t(x, 8)}`),
          step('Fator de acumulação', `e^{${t(x, 8)}} = ${t(f, 8)}`),
          step('Resultado', `FV = ${tm(PV)} \\times ${t(f, 8)} = ${tm(FV)}`),
        ],
      }
    },
  },
]
