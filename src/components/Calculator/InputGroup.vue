<script setup lang="ts">
import type { FormulaInput } from '@/types/formula'
import MathTex from '@/components/Shared/MathTex.vue'

defineProps<{ input: FormulaInput; modelValue: string; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <label class="block">
    <span class="mb-2 flex items-center gap-2.5">
      <span
        class="flex h-7 min-w-7 items-center justify-center rounded-lg border border-azul-borda bg-azul-claro px-1.5 text-[13px] text-azul"
      >
        <MathTex :tex="input.symbol" />
      </span>
      <span class="text-[14.5px] font-medium text-tinta">{{ input.label }}</span>
    </span>
    <span
      class="flex items-center rounded-xl border bg-white transition-all focus-within:border-azul focus-within:ring-4 focus-within:ring-azul/10"
      :class="error ? 'border-erro/60' : 'border-azul-borda hover:border-azul/40'"
    >
      <span v-if="input.kind === 'currency'" class="pl-4 text-[15px] text-tinta-3">R$</span>
      <input
        :value="modelValue"
        inputmode="decimal"
        autocomplete="off"
        class="w-full bg-transparent py-3 text-[17px] font-medium text-tinta tabular outline-none"
        :class="input.kind === 'currency' ? 'pr-4 pl-2' : 'px-4'"
        @input="onInput"
      />
      <span v-if="input.kind === 'percent'" class="pr-4 text-[15px] text-tinta-3">%</span>
    </span>
    <span v-if="error" class="mt-1.5 block text-[13px] text-erro">{{ error }}</span>
    <span v-else-if="input.hint" class="mt-1.5 block text-[13px] text-tinta-3">{{ input.hint }}</span>
  </label>
</template>
