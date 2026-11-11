<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import ConceptCard from '@/components/Shared/ConceptCard.vue'

/** Cartão flutuante ancorado ao lado direito de um elemento (usado no menu lateral). */
const props = defineProps<{ id: string | null; anchor: DOMRect | null }>()

const WIDTH = 360
const MARGIN = 16

const el = ref<HTMLElement | null>(null)
const height = ref(0)

// Mede a altura real do cartão para mantê-lo inteiro dentro da tela.
watch(
  () => [props.id, props.anchor],
  async () => {
    await nextTick()
    height.value = el.value?.offsetHeight ?? 0
  },
  { flush: 'post' },
)

const top = computed(() => {
  if (!props.anchor) return 0
  const max = window.innerHeight - height.value - MARGIN
  return Math.max(MARGIN, Math.min(props.anchor.top - 24, max))
})

const arrowTop = computed(() => {
  if (!props.anchor) return 0
  const y = props.anchor.top + props.anchor.height / 2 - top.value - 7
  return Math.max(14, Math.min(y, height.value - 28))
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-x-2"
      leave-active-class="transition duration-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="id && anchor"
        ref="el"
        class="pointer-events-none fixed z-50 max-h-[calc(100vh-32px)] overflow-hidden rounded-2xl border border-azul-borda bg-white p-5 shadow-[var(--sombra-forte)]"
        :style="{ left: `${anchor.right + 14}px`, top: `${top}px`, width: `${WIDTH}px` }"
        role="tooltip"
      >
        <span
          class="absolute -left-[7px] h-3.5 w-3.5 rotate-45 border-b border-l border-azul-borda bg-white"
          :style="{ top: `${arrowTop}px` }"
          aria-hidden="true"
        />
        <ConceptCard :id="id" compact />
      </div>
    </Transition>
  </Teleport>
</template>
