import type { Category, Formula } from '@/types/formula'
import { simpleInterestFormulas } from './simpleInterest'
import { compoundInterestFormulas } from './compoundInterest'
import { annuityFormulas } from './annuities'
import { amortizationFormulas } from './amortization'
import { investmentFormulas } from './investments'
import { inflationFormulas } from './inflation'

export const categories: Category[] = [
  { id: 'juros-simples', name: 'Juros Simples' },
  { id: 'descontos-simples', name: 'Descontos Simples' },
  { id: 'juros-compostos', name: 'Juros Compostos' },
  { id: 'descontos-compostos', name: 'Descontos Compostos' },
  { id: 'taxas', name: 'Conversão de Taxas' },
  { id: 'anuidades', name: 'Séries Uniformes' },
  { id: 'amortizacao', name: 'Sistemas de Amortização' },
  { id: 'investimentos', name: 'Análise de Investimentos' },
  { id: 'inflacao', name: 'Inflação e Depreciação' },
]

export const formulas: Formula[] = [
  ...simpleInterestFormulas,
  ...compoundInterestFormulas,
  ...annuityFormulas,
  ...amortizationFormulas,
  ...investmentFormulas,
  ...inflationFormulas,
]

export const formulaById = new Map(formulas.map((f) => [f.id, f]))
export const categoryById = new Map(categories.map((c) => [c.id, c]))
