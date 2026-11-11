<script setup lang="ts">
import type { TableData } from '@/types/formula'

defineProps<{ data: TableData }>()
</script>

<template>
  <div class="max-h-[480px] overflow-auto">
    <table class="w-full text-[14px] tabular">
      <thead class="sticky top-0 z-10 bg-white/95 backdrop-blur">
        <tr class="border-b border-azul-borda text-tinta-3">
          <th
            v-for="(col, c) in data.columns"
            :key="col"
            class="px-6 py-3 text-[11px] font-medium tracking-[0.14em] whitespace-nowrap uppercase"
            :class="c === 0 ? 'text-left' : 'text-right'"
          >
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, r) in data.rows"
          :key="r"
          class="border-b border-azul-borda/50 transition-colors last:border-0 hover:bg-azul-claro/50"
          :class="[
            r === data.highlight ? 'bg-azul-claro font-semibold text-azul' : 'text-tinta',
            row[0] === 'Total' ? 'bg-azul-claro/60 font-semibold' : '',
          ]"
        >
          <td
            v-for="(cell, c) in row"
            :key="c"
            class="px-6 py-2.5 whitespace-nowrap"
            :class="c === 0 ? 'text-left text-tinta-3' : 'text-right'"
          >
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
