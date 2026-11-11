<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CategoryId } from '@/types/formula'
import { categories, formulaById, formulas } from '@/math'
import ConceptPopover from '@/components/Shared/ConceptPopover.vue'

const props = defineProps<{ selectedId: string; query: string }>()
defineEmits<{ select: [id: string] }>()

/** Glifo de cada tema, exibido no menu. */
const glyphs: Record<CategoryId, string> = {
  'juros-simples': 'J',
  'descontos-simples': 'D',
  'juros-compostos': 'xⁿ',
  'descontos-compostos': 'x⁻ⁿ',
  taxas: '%',
  anuidades: 'Σ',
  amortizacao: '▤',
  investimentos: '∫',
  inflacao: 'π',
}

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

const groups = computed(() => {
  const q = normalize(props.query.trim())
  return categories
    .map((cat) => ({
      ...cat,
      glyph: glyphs[cat.id],
      items: formulas.filter(
        (f) => f.category === cat.id && (!q || normalize(`${f.name} ${cat.name} ${f.description}`).includes(q)),
      ),
    }))
    .filter((g) => g.items.length > 0)
})

const expanded = ref(new Set<string>([formulaById.get(props.selectedId)?.category ?? '']))

watch(
  () => props.selectedId,
  (id) => {
    const cat = formulaById.get(id)?.category
    if (cat) expanded.value.add(cat)
  },
)

function toggle(id: string) {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}

const isOpen = (id: string) => props.query.trim() !== '' || expanded.value.has(id)
const hasSelected = (id: string) => formulaById.get(props.selectedId)?.category === id

onMounted(async () => {
  await nextTick()
  document.querySelector('[data-formula-active]')?.scrollIntoView({ block: 'nearest' })
})

// ---------- Conceito ao passar o mouse (só em telas com mouse e menu fixo) ----------
const canHover = window.matchMedia('(hover: hover) and (min-width: 1024px)').matches
const hoverId = ref<string | null>(null)
const hoverRect = ref<DOMRect | null>(null)
let timer: ReturnType<typeof setTimeout> | undefined

function onEnter(e: MouseEvent, id: string) {
  if (!canHover) return
  const el = e.currentTarget as HTMLElement
  clearTimeout(timer)
  // Pequeno atraso para não piscar ao percorrer o menu; se já há um aberto, troca na hora.
  timer = setTimeout(
    () => {
      hoverRect.value = el.getBoundingClientRect()
      hoverId.value = id
    },
    hoverId.value ? 60 : 350,
  )
}
function hide() {
  clearTimeout(timer)
  hoverId.value = null
}
onMounted(() => window.addEventListener('scroll', hide, true))
onBeforeUnmount(() => {
  window.removeEventListener('scroll', hide, true)
  clearTimeout(timer)
})
</script>

<template>
  <nav aria-label="Fórmulas" class="space-y-1">
    <div v-for="g in groups" :key="g.id">
      <button
        type="button"
        class="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors"
        :class="hasSelected(g.id) ? 'bg-azul-claro' : 'hover:bg-azul-claro/60'"
        :aria-expanded="isOpen(g.id)"
        @click="toggle(g.id)"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-serif text-[15px] italic transition-colors"
          :class="
            hasSelected(g.id)
              ? 'text-white shadow-[0_6px_14px_-6px_rgba(43,59,255,0.7)]'
              : 'border border-azul-borda bg-white text-azul group-hover:border-azul/40'
          "
          :style="hasSelected(g.id) ? 'background: var(--gradiente)' : ''"
        >
          {{ g.glyph }}
        </span>
        <span class="flex-1 text-[14.5px] font-medium" :class="hasSelected(g.id) ? 'text-azul-escuro' : 'text-tinta'">
          {{ g.name }}
        </span>
        <span class="text-[11px] text-tinta-3 tabular">{{ g.items.length }}</span>
        <svg
          class="h-3.5 w-3.5 text-tinta-3 transition-transform duration-200"
          :class="isOpen(g.id) ? 'rotate-90' : ''"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M7 4l7 6-7 6z" />
        </svg>
      </button>

      <div
        class="grid transition-[grid-template-rows] duration-300"
        :class="isOpen(g.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <ul class="overflow-hidden">
          <li v-for="f in g.items" :key="f.id" class="relative ml-[26px] border-l border-azul-borda">
            <button
              type="button"
              class="-ml-px block w-full border-l-2 py-1.5 pr-2 pl-5 text-left text-[13.5px] transition-colors"
              :class="
                f.id === selectedId
                  ? 'border-azul font-semibold text-azul'
                  : 'border-transparent text-tinta-2 hover:border-azul/30 hover:text-tinta'
              "
              :aria-current="f.id === selectedId ? 'page' : undefined"
              :data-formula-active="f.id === selectedId ? '' : undefined"
              :tabindex="isOpen(g.id) ? 0 : -1"
              @mouseenter="onEnter($event, f.id)"
              @mouseleave="hide"
              @click="hide(); $emit('select', f.id)"
            >
              {{ f.name }}
            </button>
          </li>
          <li class="h-2" aria-hidden="true" />
        </ul>
      </div>
    </div>
    <p v-if="groups.length === 0" class="px-3 py-6 text-center text-sm text-tinta-3">Nenhuma fórmula encontrada.</p>
    <ConceptPopover :id="hoverId" :anchor="hoverRect" />
  </nav>
</template>
