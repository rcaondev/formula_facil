<script setup lang="ts">
defineProps<{ title: string; category: string }>()
defineEmits<{ toggleMenu: []; reset: [] }>()
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-azul-borda/70 bg-white/80 px-4 backdrop-blur-md sm:px-8"
  >
    <button
      type="button"
      class="-ml-1 rounded-full border border-azul-borda p-2 text-tinta-2 hover:border-azul hover:text-azul lg:hidden"
      aria-label="Abrir menu de fórmulas"
      @click="$emit('toggleMenu')"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.75">
        <path d="M3 6h14M3 10h14M3 14h14" stroke-linecap="round" />
      </svg>
    </button>

    <div class="min-w-0">
      <div class="rotulo hidden truncate !text-[0.64rem] sm:block">{{ category }}</div>
      <div class="rotulo rotulo-azul truncate !text-[0.78rem] !font-semibold">{{ title }}</div>
    </div>

    <button type="button" class="pilula ml-auto shrink-0" @click="$emit('reset')">
      <span aria-hidden="true">↻</span>
      <span class="hidden sm:inline">Restaurar exemplo</span>
    </button>
  </header>
</template>
