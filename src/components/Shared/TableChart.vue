<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TableData } from '@/types/formula'
import { fmtMoney, parseNumber } from '@/math/format'

const props = defineProps<{ data: TableData }>()

const COLORS = ['#2b3bff', '#19c3e6']

/** Quais colunas da tabela viram séries do gráfico (empilhadas). */
const seriesCols = computed<string[]>(() => {
  const cols = props.data.columns
  if (cols.includes('Amortização') && cols.includes('Juros')) return ['Amortização', 'Juros']
  if (cols.includes('Valor presente')) return ['Valor presente']
  if (cols.includes('Valor contábil')) return ['Valor contábil']
  return []
})

const num = (s: string) => {
  const n = parseNumber(s.replace('−', '-'))
  return n === null || Number.isNaN(n) ? null : n
}

const points = computed(() => {
  const idx = seriesCols.value.map((c) => props.data.columns.indexOf(c))
  return props.data.rows
    .filter((r) => /^\d+$/.test(r[0]))
    .map((r) => ({ label: r[0], values: idx.map((i) => num(r[i])) }))
    .filter((p) => p.values.every((v) => v !== null)) as { label: string; values: number[] }[]
})

const W = 800
const H = 200
const PAD_T = 8
const PAD_B = 0

const scale = computed(() => {
  let max = 0
  let min = 0
  for (const p of points.value) {
    const pos = p.values.filter((v) => v > 0).reduce((a, b) => a + b, 0)
    const neg = p.values.filter((v) => v < 0).reduce((a, b) => a + b, 0)
    max = Math.max(max, pos)
    min = Math.min(min, neg)
  }
  const span = max - min || 1
  const y = (v: number) => PAD_T + ((max - v) / span) * (H - PAD_T - PAD_B)
  return { y, zero: y(0) }
})

const bars = computed(() => {
  const n = points.value.length
  const slot = W / Math.max(n, 1)
  const bw = Math.max(1.5, Math.min(36, slot * 0.62))
  return points.value.map((p, i) => {
    const x = i * slot + (slot - bw) / 2
    let accPos = 0
    let accNeg = 0
    const rects = p.values.map((v, s) => {
      const from = v >= 0 ? accPos : accNeg
      const to = from + v
      if (v >= 0) accPos = to
      else accNeg = to
      const y1 = scale.value.y(Math.max(from, to))
      const y2 = scale.value.y(Math.min(from, to))
      return { x, y: y1, h: Math.max(0.5, y2 - y1), w: bw, color: v < 0 ? '#e5384b' : COLORS[s] }
    })
    return { label: p.label, slotX: i * slot, slot, rects, values: p.values }
  })
})

const labelEvery = computed(() => Math.ceil(points.value.length / 12))
const hover = ref<number | null>(null)
const hovered = computed(() => (hover.value === null ? null : bars.value[hover.value]))
</script>

<template>
  <div v-if="seriesCols.length && points.length > 1">
    <div class="mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 px-2 text-[13px] text-tinta-2">
      <span v-for="(s, i) in seriesCols" :key="s" class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-sm" :style="{ background: COLORS[i] }" />
        {{ s }}
      </span>
      <span class="ml-auto min-h-[1.25rem] text-tinta tabular">
        <template v-if="hovered">
          <span class="text-tinta-3">Período {{ hovered.label }} ·</span>
          <span v-for="(v, i) in hovered.values" :key="i" class="ml-2">
            <span :style="{ color: COLORS[i] }">●</span> {{ fmtMoney(v) }}
          </span>
        </template>
      </span>
    </div>
    <svg
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      class="block h-[200px] w-full"
      role="img"
      :aria-label="`Gráfico de ${seriesCols.join(' e ')} por período`"
      @mouseleave="hover = null"
    >
      <line :x1="0" :x2="W" :y1="scale.zero" :y2="scale.zero" stroke="#d9defc" stroke-width="1" />
      <g v-for="(b, i) in bars" :key="b.label">
        <rect
          :x="b.slotX"
          y="0"
          :width="b.slot"
          :height="H - PAD_B"
          :fill="hover === i ? 'rgba(43,59,255,0.06)' : 'transparent'"
          @mouseenter="hover = i"
        />
        <rect
          v-for="(r, s) in b.rects"
          :key="s"
          :x="r.x"
          :y="r.y"
          :width="r.w"
          :height="r.h"
          :fill="r.color"
          :opacity="hover === null || hover === i ? 1 : 0.45"
          rx="2"
          class="pointer-events-none transition-opacity"
        />
      </g>
    </svg>
    <div class="mt-2 flex text-[11px] text-tinta-3 tabular" aria-hidden="true">
      <span v-for="(b, i) in bars" :key="b.label" class="flex-1 text-center">
        {{ i % labelEvery === 0 ? b.label : '' }}
      </span>
    </div>
  </div>
</template>
