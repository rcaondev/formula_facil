<script setup lang="ts">
import { computed } from 'vue'
import { formulaById } from '@/math'
import { concepts } from '@/math/concepts'
import MathTex from '@/components/Shared/MathTex.vue'

const props = defineProps<{ id: string; compact?: boolean }>()

const formula = computed(() => formulaById.get(props.id))
const concept = computed(() => concepts[props.id])
</script>

<template>
  <div v-if="formula && concept">
    <div class="rotulo rotulo-azul !text-[0.64rem]">Conceito</div>
    <div class="mt-1 font-semibold tracking-tight text-tinta" :class="compact ? 'text-[17px]' : 'text-2xl'">
      {{ formula.name }}
    </div>
    <div
      class="mt-3 overflow-x-auto rounded-xl border border-azul-borda bg-azul-claro/50 px-4 py-3 text-center text-tinta"
      :class="compact ? 'text-[15px]' : 'text-lg'"
    >
      <MathTex :tex="formula.latex" />
    </div>

    <p class="mt-4 leading-relaxed text-tinta" :class="compact ? 'text-[14px]' : 'text-[15.5px]'">{{ concept.ideia }}</p>

    <dl class="mt-4 space-y-3" :class="compact ? 'text-[13px]' : 'text-[14.5px]'">
      <div class="flex gap-3">
        <dt class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-azul-claro text-[11px] text-azul">
          ?
        </dt>
        <dd class="leading-relaxed text-tinta-2">
          <span class="font-semibold text-tinta">Quando usar. </span>{{ concept.quandoUsar }}
        </dd>
      </div>
      <div class="flex gap-3">
        <dt
          class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white"
          style="background: var(--gradiente)"
        >
          ✓
        </dt>
        <dd class="leading-relaxed text-tinta-2">
          <span class="font-semibold text-tinta">Exemplo. </span>{{ concept.exemplo }}
        </dd>
      </div>
    </dl>
  </div>
</template>
