<script setup lang="ts">
import type { FormulaResult } from '@/types/formula'
import { fmtResult } from '@/math/format'
import MathTex from '@/components/Shared/MathTex.vue'

defineProps<{ result: FormulaResult | null; error: string | null }>()
</script>

<template>
  <div
    class="relative flex min-h-[240px] flex-col justify-center overflow-hidden rounded-[20px] p-7 text-white sm:p-9"
    :class="error ? 'bg-white ring-1 ring-erro/30' : ''"
    :style="error ? '' : 'background: var(--gradiente); box-shadow: var(--sombra-forte)'"
  >
    <!-- Arcos decorativos -->
    <div
      v-if="!error"
      class="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full opacity-30"
      style="background: repeating-radial-gradient(circle, transparent 0 9px, rgba(255, 255, 255, 0.5) 9px 10px)"
      aria-hidden="true"
    />

    <div v-if="error" class="text-tinta">
      <div class="rotulo !text-erro">Não foi possível calcular</div>
      <p class="mt-3 text-[15px] leading-relaxed text-tinta-2">{{ error }}</p>
    </div>

    <template v-else-if="result">
      <div class="relative flex items-center gap-3">
        <span class="rotulo !text-white/75">{{ result.label }}</span>
        <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-sm"><MathTex :tex="result.symbol" /></span>
      </div>
      <Transition name="passo" mode="out-in">
        <div
          :key="fmtResult(result.value, result.kind)"
          class="relative mt-3 flex flex-wrap items-baseline gap-x-3 text-[clamp(2.4rem,5.5vw,3.6rem)] leading-none font-semibold tracking-tight tabular"
        >
          {{ fmtResult(result.value, result.kind) }}
          <span v-if="result.kind === 'periods'" class="text-lg font-normal text-white/75">períodos</span>
        </div>
      </Transition>
      <p v-if="result.note" class="relative mt-5 max-w-md text-[14.5px] leading-relaxed text-white/85">
        {{ result.note }}
      </p>
    </template>

    <div v-else class="relative text-white/85">
      <div class="rotulo !text-white/70">Resultado</div>
      <p class="mt-3 text-[15px]">Preencha os parâmetros para ver o resultado.</p>
    </div>
  </div>
</template>
