<script setup lang="ts">
interface Column {
  key: string
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  data: any[]
  loading?: boolean
  maxHeight?: string
}

withDefaults(defineProps<Props>(), {
  loading: false,
  maxHeight: 'auto'
})
</script>

<template>
  <div 
    class="w-full bg-white border border-gray-300 shadow-md flex flex-col relative overflow-hidden"
    :style="{ height: maxHeight !== 'auto' ? maxHeight : undefined }"
  >
    
    <div v-if="loading" class="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-[1px]">
      <span class="bg-black/80 text-white px-3 py-1 rounded text-xs font-bold shadow-lg animate-pulse">Loading...</span>
    </div>

    <div class="flex-1 overflow-auto w-full custom-scrollbar">
      <table class="w-full text-left border-collapse">
        
        <thead class="bg-[#16a34a] text-white sticky top-0 z-10 shadow-md">
          <tr>
            <th 
              v-for="col in columns" 
              :key="col.key"
              class="px-[14px] py-[10px] whitespace-nowrap text-[11px] font-bold uppercase tracking-wider border-r border-green-500 last:border-r-0"
              :class="`text-${col.align || 'left'}`"
              :style="{ width: col.width }"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        
        <tbody class="text-[12px] text-gray-800 divide-y divide-gray-200">
          <tr 
            v-for="(row, idx) in data" 
            :key="idx" 
            class="group transition-colors hover:bg-yellow-50 even:bg-gray-50"
          >
            <td 
              v-for="col in columns" 
              :key="col.key"
              class="px-[14px] py-[9px] border-r border-gray-200 last:border-r-0 tabular-nums"
              :class="`text-${col.align || 'left'}`"
            >
              <slot 
                :name="col.key" 
                :row="row" 
                :index="idx" 
                :value="row[col.key]"
              >
                <span class="truncate block max-w-[200px]" :title="String(row[col.key])">
                  {{ row[col.key] }}
                </span>
              </slot>
            </td>
          </tr>

          <tr v-if="!loading && data.length === 0">
            <td :colspan="columns.length" class="px-[20px] py-[40px] text-center text-gray-400">
              Data Kosong
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar agak tebal dikit biar gampang digeser */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8; 
}
</style>