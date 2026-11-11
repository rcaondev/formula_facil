<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Formula, FormulaInput, FormulaResult, Values } from '@/types/formula'
import { categoryById, formulas } from '@/math'
import { CalcError, fmtInput, parseNumber } from '@/math/format'
import InputGroup from '@/components/Calculator/InputGroup.vue'
import ResultDisplay from '@/components/Calculator/ResultDisplay.vue'
import StepPlayer from '@/components/Calculator/StepPlayer.vue'
import MathTex from '@/components/Shared/MathTex.vue'
import CashflowEditor from '@/components/Shared/CashflowEditor.vue'
import DataTable from '@/components/Shared/DataTable.vue'
import TableChart from '@/components/Shared/TableChart.vue'
import ConceptModal from '@/components/Shared/ConceptModal.vue'

const props = defineProps<{ formula: Formula }>()

const conceptOpen = ref<string | null>(null)

interface FormState {
  values: Record<string, string>
  flows: string[]
}

function defaults(f: Formula): FormState {
  return {
    values: Object.fromEntries(f.inputs.map((i) => [i.key, fmtInput(i.default, i.kind)])),
    flows: (f.cashflows?.default ?? []).map((v) => fmtInput(v, 'currency')),
  }
}

/** Estado preservado por fórmula, para não perder o que foi digitado ao navegar. */
const states = reactive<Record<string, FormState>>(Object.fromEntries(formulas.map((f) => [f.id, defaults(f)])))

const state = computed<FormState>(() => states[props.formula.id])

function reset() {
  states[props.formula.id] = defaults(props.formula)
}
defineExpose({ reset })

function validate(input: FormulaInput, raw: string): { value?: number; error?: string } {
  const n = parseNumber(raw)
  if (n === null) return { error: 'Campo obrigatório' }
  if (Number.isNaN(n)) return { error: 'Número inválido' }
  if (input.kind === 'integer' && !Number.isInteger(n)) return { error: 'Use um número inteiro' }
  if (input.min !== undefined) {
    const shown = input.kind === 'percent' ? `${input.min}%` : String(input.min)
    if (input.exclusiveMin && n <= input.min) return { error: `Deve ser maior que ${shown}` }
    if (!input.exclusiveMin && n < input.min) return { error: `Deve ser no mínimo ${shown}` }
  }
  return { value: input.kind === 'percent' ? n / 100 : n }
}

const parsed = computed(() => {
  const errors: Record<string, string> = {}
  const values: Values = {}
  for (const input of props.formula.inputs) {
    const r = validate(input, state.value.values[input.key] ?? '')
    if (r.error) errors[input.key] = r.error
    else values[input.key] = r.value!
  }
  const flows = state.value.flows.map((s) => parseNumber(s))
  const flowsOk = flows.every((v) => v !== null && !Number.isNaN(v))
  return { errors, values, flows: flows as number[], valid: Object.keys(errors).length === 0 && flowsOk }
})

const outcome = computed<{ result: FormulaResult | null; error: string | null }>(() => {
  if (!parsed.value.valid) return { result: null, error: null }
  try {
    const result = props.formula.compute(parsed.value.values, parsed.value.flows)
    if (!Number.isFinite(result.value)) {
      return { result: null, error: 'O resultado não é um número finito. Verifique os parâmetros.' }
    }
    return { result, error: null }
  } catch (e) {
    if (e instanceof CalcError) return { result: null, error: e.message }
    throw e
  }
})

const categoryName = computed(() => categoryById.get(props.formula.category)?.name ?? '')
</script>

<template>
  <Transition name="troca" mode="out-in" appear>
    <div :key="formula.id" class="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-8 lg:pt-14">
      <!-- Hero -->
      <section class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <div class="rotulo rotulo-azul">{{ categoryName }}</div>
          <h1 class="mt-3 text-4xl leading-[1.05] font-medium tracking-tight text-tinta sm:text-5xl">
            <span class="texto-gradiente">{{ formula.name }}</span>
          </h1>
          <p class="mt-4 max-w-md text-[15.5px] leading-relaxed text-tinta-2">{{ formula.description }}</p>
          <button type="button" class="pilula mt-6" @click="conceptOpen = formula.id">
            <span
              class="-ml-1 flex h-5 w-5 items-center justify-center rounded-full font-serif text-[12px] text-white normal-case italic"
              style="background: var(--gradiente)"
              aria-hidden="true"
              >i</span
            >
            Entenda o conceito
          </button>
        </div>

        <div class="formula-hero relative">
          <div
            class="absolute -inset-3 -z-10 rounded-[28px] opacity-60 blur-2xl"
            style="background: var(--gradiente)"
            aria-hidden="true"
          />
          <div class="cartao overflow-x-auto px-6 py-9 text-center sm:px-10 sm:py-12">
            <MathTex :tex="formula.latex" display />
          </div>
        </div>
      </section>

      <!-- Calculadora -->
      <section class="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div class="cartao p-6 sm:p-7">
          <div class="rotulo mb-6">Parâmetros</div>
          <div class="space-y-5">
            <InputGroup
              v-for="input in formula.inputs"
              :key="formula.id + input.key"
              v-model="state.values[input.key]"
              :input="input"
              :error="parsed.errors[input.key]"
            />
            <CashflowEditor
              v-if="formula.cashflows"
              v-model="state.flows"
              :label="formula.cashflows.label"
              class="border-t border-azul-borda/70 pt-5"
            />
          </div>
        </div>

        <ResultDisplay :result="outcome.result" :error="outcome.error" />
      </section>

      <!-- Passo a passo -->
      <StepPlayer
        v-if="outcome.result"
        :key="formula.id"
        :steps="outcome.result.steps"
        :result-label="outcome.result.label"
        class="mt-6"
      />

      <!-- Gráfico + tabela -->
      <section v-if="outcome.result?.table" class="cartao mt-6 overflow-hidden">
        <div class="flex items-center justify-between px-6 pt-6 sm:px-7">
          <div class="rotulo">Evolução</div>
        </div>
        <TableChart :data="outcome.result.table" class="px-4 pt-4 sm:px-6" />
        <div class="rotulo border-t border-azul-borda/70 px-6 pt-6 pb-2 sm:px-7">Tabela detalhada</div>
        <DataTable :data="outcome.result.table" />
      </section>
    </div>
  </Transition>
  <ConceptModal :id="conceptOpen" @close="conceptOpen = null" />
</template>
