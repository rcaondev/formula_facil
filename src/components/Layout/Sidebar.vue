<script setup lang="ts">
import { ref } from 'vue'
import { formulas } from '@/math'
import FormulaSelector from '@/components/Calculator/FormulaSelector.vue'

defineProps<{ selectedId: string; open: boolean }>()
const emit = defineEmits<{ select: [id: string]; close: [] }>()

const query = ref('')

function select(id: string) {
  emit('select', id)
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity"
    leave-to-class="opacity-0"
  >
    <div v-if="open" class="fixed inset-0 z-30 bg-tinta/30 backdrop-blur-sm lg:hidden" @click="emit('close')" />
  </Transition>

  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-azul-borda/70 bg-white/95 backdrop-blur-md transition-transform duration-300 lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Marca -->
    <a href="#" class="flex items-center gap-3 px-5 pt-6 pb-5">
      <span
        class="flex h-10 w-10 items-center justify-center rounded-xl font-serif text-xl text-white italic shadow-[0_8px_20px_-6px_rgba(43,59,255,0.6)]"
        style="background: var(--gradiente)"
      >
        ƒ
      </span>
      <span class="leading-tight">
        <span class="block text-[19px] font-semibold tracking-tight text-tinta">formula<span class="texto-gradiente">fácil</span></span>
        <span class="rotulo block !text-[0.6rem] !tracking-[0.24em]">{{ formulas.length }} fórmulas</span>
      </span>
    </a>

    <!-- Busca -->
    <div class="px-4 pb-3">
      <div class="relative">
        <svg
          class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-tinta-3"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
        >
          <circle cx="9" cy="9" r="5.5" />
          <path d="M13.5 13.5L17 17" stroke-linecap="round" />
        </svg>
        <input
          v-model="query"
          type="search"
          placeholder="Buscar fórmula…"
          class="w-full rounded-full border border-azul-borda bg-azul-claro/50 py-2.5 pr-4 pl-10 text-sm text-tinta outline-none placeholder:text-tinta-3 focus:border-azul focus:bg-white focus:ring-4 focus:ring-azul/10"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto px-3 pt-1 pb-6">
      <FormulaSelector :selected-id="selectedId" :query="query" @select="select" />
    </div>

    <div class="border-t border-azul-borda/70 px-5 py-4 text-[11px] leading-relaxed text-tinta-3">
      <div>© {{ new Date().getFullYear() }} <span class="font-medium text-tinta-2">Rodrigo Caon</span></div>
      <a
        href="https://rodrigocaon.com.br"
        target="_blank"
        rel="noopener"
        class="font-medium text-azul hover:underline"
      >
        rodrigocaon.com.br ↗
      </a>
    </div>
  </aside>
</template>
