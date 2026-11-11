<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{ tex: string; display?: boolean }>()

const html = computed(() =>
  katex.renderToString(props.tex, { throwOnError: false, displayMode: props.display ?? false }),
)
</script>

<template>
  <span v-html="html" />
</template>
