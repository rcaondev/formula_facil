<script setup lang="ts">
import { onBeforeUnmount, watch } from 'vue'
import ConceptCard from '@/components/Shared/ConceptCard.vue'

const props = defineProps<{ id: string | null }>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

watch(
  () => props.id,
  (id) => {
    if (id) {
      window.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  },
)
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div
        v-if="id"
        class="fixed inset-0 z-50 flex items-end justify-center bg-tinta/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label="Conceito da fórmula"
        @click.self="emit('close')"
      >
        <div
          class="relative max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-white p-7 shadow-[var(--sombra-forte)] sm:max-w-xl sm:rounded-3xl sm:p-9"
        >
          <div class="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl" style="background: var(--gradiente)" aria-hidden="true" />
          <button
            type="button"
            class="absolute top-5 right-5 rounded-full p-2 text-tinta-3 hover:bg-azul-claro hover:text-azul"
            aria-label="Fechar"
            @click="emit('close')"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 5l10 10M15 5L5 15" stroke-linecap="round" />
            </svg>
          </button>
          <ConceptCard :id="id" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
