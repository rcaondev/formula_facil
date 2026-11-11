export type InputKind = 'currency' | 'percent' | 'number' | 'integer'
export type ResultKind = 'currency' | 'percent' | 'number' | 'periods'

export type CategoryId =
  | 'juros-simples'
  | 'descontos-simples'
  | 'juros-compostos'
  | 'descontos-compostos'
  | 'taxas'
  | 'anuidades'
  | 'amortizacao'
  | 'investimentos'
  | 'inflacao'

export interface Category {
  id: CategoryId
  name: string
}

export interface FormulaInput {
  key: string
  /** Símbolo em LaTeX (ex.: "C", "i", "FC_0") */
  symbol: string
  label: string
  kind: InputKind
  default: number
  hint?: string
  min?: number
  /** Se true, o valor precisa ser estritamente maior que `min` */
  exclusiveMin?: boolean
}

export interface Step {
  label: string
  latex: string
}

export interface TableData {
  columns: string[]
  rows: string[][]
  /** índice da linha a destacar */
  highlight?: number
}

export interface FormulaResult {
  label: string
  /** Símbolo do resultado em LaTeX */
  symbol: string
  value: number
  kind: ResultKind
  steps: Step[]
  table?: TableData
  note?: string
}

export interface CashflowConfig {
  label: string
  default: number[]
}

export type Values = Record<string, number>

export interface Formula {
  id: string
  category: CategoryId
  name: string
  description: string
  latex: string
  inputs: FormulaInput[]
  cashflows?: CashflowConfig
  compute: (values: Values, flows: number[]) => FormulaResult
}
