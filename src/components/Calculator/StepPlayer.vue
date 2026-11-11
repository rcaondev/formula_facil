<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Step } from '@/types/formula'
import MathTex from '@/components/Shared/MathTex.vue'
import { explainStep } from '@/math/narrative'

const props = defineProps<{ steps: Step[]; resultLabel: string }>()

const explain = (s: Step, i: number) =>
  explainStep(s.label, { result: props.resultLabel, isLast: i === props.steps.length - 1 })

const idx = ref(0)
const showAll = ref(false)
const total = computed(() => props.steps.length)
const current = computed(() => props.steps[Math.min(idx.value, total.value - 1)])
const isLast = computed(() => idx.value >= total.value - 1)
const progress = computed(() => (total.value <= 1 ? 100 : (idx.value / (total.value - 1)) * 100))

// Se a quantidade de passos mudar (ex.: novo valor digitado), mantém o índice válido.
watch(total, (n) => {
  if (idx.value > n - 1) idx.value = Math.max(0, n - 1)
})

const prev = () => (idx.value = Math.max(0, idx.value - 1))
const next = () => (idx.value = Math.min(total.value - 1, idx.value + 1))

function onKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement | null
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
  if (showAll.value) return
  if (e.key === 'ArrowRight') next()
  else if (e.key === 'ArrowLeft') prev()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <section class="cartao palco overflow-hidden">
    <div class="flex items-center justify-between gap-4 px-6 pt-6 sm:px-7">
      <div class="rotulo">Passo a passo</div>
      <div class="flex rounded-full border border-azul-borda bg-azul-claro/50 p-0.5 text-[11px] font-medium tracking-[0.12em] uppercase">
        <button
          type="button"
          class="rounded-full px-3 py-1 transition-colors"
          :class="!showAll ? 'bg-white text-azul shadow-sm' : 'text-tinta-3 hover:text-tinta'"
          @click="showAll = false"
        >
          Guiado
        </button>
        <button
          type="button"
          class="rounded-full px-3 py-1 transition-colors"
          :class="showAll ? 'bg-white text-azul shadow-sm' : 'text-tinta-3 hover:text-tinta'"
          @click="showAll = true"
        >
          Todos
        </button>
      </div>
    </div>

    <!-- Modo guiado -->
    <template v-if="!showAll">
      <div class="relative flex min-h-[200px] items-center justify-center overflow-x-auto px-6 py-10 sm:px-10">
        <Transition name="passo" mode="out-in">
          <div
            :key="idx + current.latex"
            class="text-center"
            :class="isLast ? 'text-azul' : 'text-tinta'"
          >
            <MathTex :tex="current.latex" display />
          </div>
        </Transition>
      </div>

      <div class="relative mx-6 mb-6 rounded-2xl border border-azul-borda bg-azul-claro/40 px-5 pt-6 pb-4 text-center sm:mx-auto sm:max-w-xl">
        <span
          class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-azul-borda bg-white px-3 py-0.5 text-[10.5px] font-semibold tracking-[0.2em] text-azul uppercase"
        >
          Passo {{ idx + 1 }}
        </span>
        <Transition name="passo" mode="out-in">
          <div :key="idx + current.label">
            <p class="text-[15.5px] font-semibold text-tinta">{{ current.label }}</p>
            <p class="mt-1.5 text-[14.5px] leading-relaxed text-tinta-2">{{ explain(current, idx) }}</p>
          </div>
        </Transition>
      </div>

      <div class="flex items-center gap-4 px-6 pb-5 sm:px-7">
        <button type="button" class="pilula" :disabled="idx === 0" @click="prev">← <span class="hidden sm:inline">Anterior</span></button>
        <div class="flex-1 text-center text-sm text-tinta-3 tabular">
          <span class="text-lg font-semibold text-azul">{{ idx + 1 }}</span> / {{ total }}
        </div>
        <button type="button" class="pilula pilula-cheia" :disabled="isLast" @click="next">
          <span class="hidden sm:inline">Próximo</span> →
        </button>
      </div>
      <div class="px-6 pb-6 sm:px-7">
        <input
          v-model.number="idx"
          type="range"
          min="0"
          :max="total - 1"
          step="1"
          class="trilha"
          :style="{ '--p': progress + '%' }"
          aria-label="Navegar pelos passos"
        />
      </div>
    </template>

    <!-- Todos os passos -->
    <ol v-else class="space-y-1 px-4 pt-5 pb-6 sm:px-6">
      <li
        v-for="(s, i) in steps"
        :key="i"
        class="flex gap-4 rounded-xl px-3 py-3"
        :class="i === steps.length - 1 ? 'bg-azul-claro/70' : ''"
      >
        <span
          class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold tabular"
          :class="i === steps.length - 1 ? 'text-white' : 'border border-azul-borda bg-white text-azul'"
          :style="i === steps.length - 1 ? 'background: var(--gradiente)' : ''"
        >
          {{ i + 1 }}
        </span>
        <div class="min-w-0 flex-1">
          <div class="text-[14px] font-semibold text-tinta">{{ s.label }}</div>
          <div class="mt-0.5 text-[13.5px] leading-relaxed text-tinta-2">{{ explain(s, i) }}</div>
          <div class="mt-2 overflow-x-auto pb-1 text-tinta"><MathTex :tex="s.latex" /></div>
        </div>
      </li>
    </ol>
  </section>
</template>
