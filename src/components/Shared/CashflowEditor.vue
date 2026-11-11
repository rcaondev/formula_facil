<script setup lang="ts">
import { parseNumber } from '@/math/format'

const props = defineProps<{ label: string; modelValue: string[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function update(idx: number, value: string) {
  const next = [...props.modelValue]
  next[idx] = value
  emit('update:modelValue', next)
}
function add() {
  const last = props.modelValue[props.modelValue.length - 1] ?? '0'
  emit('update:modelValue', [...props.modelValue, last])
}
function remove(idx: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== idx))
}
function invalid(v: string) {
  const n = parseNumber(v)
  return n === null || Number.isNaN(n)
}
function onInput(idx: number, e: Event) {
  update(idx, (e.target as HTMLInputElement).value)
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-baseline justify-between">
      <span class="text-[14.5px] font-medium text-tinta">{{ label }}</span>
      <span class="rotulo !text-[0.62rem]">{{ modelValue.length }} períodos</span>
    </div>
    <ul class="space-y-2">
      <li v-for="(v, idx) in modelValue" :key="idx" class="flex items-center gap-2">
        <span
          class="flex h-7 w-12 shrink-0 items-center justify-center rounded-lg bg-azul-claro font-serif text-[13px] text-azul italic"
        >
          t={{ idx + 1 }}
        </span>
        <div
          class="flex flex-1 items-center rounded-xl border bg-white transition-all focus-within:border-azul focus-within:ring-4 focus-within:ring-azul/10"
          :class="invalid(v) ? 'border-erro/60' : 'border-azul-borda hover:border-azul/40'"
        >
          <span class="pl-3.5 text-sm text-tinta-3">R$</span>
          <input
            :value="v"
            inputmode="decimal"
            autocomplete="off"
            class="w-full bg-transparent px-2 py-2.5 text-[15.5px] font-medium text-tinta tabular outline-none"
            @input="onInput(idx, $event)"
          />
        </div>
        <button
          type="button"
          class="rounded-full p-2 text-tinta-3 hover:bg-azul-claro hover:text-erro disabled:opacity-30 disabled:hover:bg-transparent"
          :disabled="modelValue.length <= 1"
          :aria-label="`Remover período ${idx + 1}`"
          @click="remove(idx)"
        >
          <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M5 5l10 10M15 5L5 15" stroke-linecap="round" />
          </svg>
        </button>
      </li>
    </ul>
    <button type="button" class="pilula mt-4" @click="add">+ Adicionar período</button>
  </div>
</template>
