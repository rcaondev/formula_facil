<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { categoryById, formulaById, formulas } from '@/math'
import Header from '@/components/Layout/Header.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import HomeView from '@/views/HomeView.vue'

const fromHash = () => {
  const id = window.location.hash.slice(1)
  return formulaById.has(id) ? id : formulas[0].id
}

const selectedId = ref(fromHash())
const menuOpen = ref(false)
const formula = computed(() => formulaById.get(selectedId.value)!)
const categoryName = computed(() => categoryById.get(formula.value.category)?.name ?? '')
const homeRef = ref<InstanceType<typeof HomeView> | null>(null)

watch(selectedId, (id) => {
  if (window.location.hash.slice(1) !== id) history.replaceState(null, '', `#${id}`)
  window.scrollTo({ top: 0 })
})

watch(
  formula,
  (f) => {
    document.title = `${f.name} · formulafácil`
  },
  { immediate: true },
)

const onHash = () => (selectedId.value = fromHash())
onMounted(() => window.addEventListener('hashchange', onHash))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHash))
</script>

<template>
  <div class="cenario" aria-hidden="true" />
  <Sidebar :selected-id="selectedId" :open="menuOpen" @select="selectedId = $event" @close="menuOpen = false" />
  <div class="relative z-10 min-h-screen lg:pl-72">
    <Header
      :title="formula.name"
      :category="categoryName"
      @toggle-menu="menuOpen = !menuOpen"
      @reset="homeRef?.reset()"
    />
    <main>
      <HomeView ref="homeRef" :formula="formula" />
    </main>
  </div>
</template>
