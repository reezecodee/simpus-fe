<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseTable from './BaseTable.vue'
import BasePagination from './BasePagination.vue'
import BaseInput from './BaseInput.vue'

// Re-export interface biar bisa dipake parent
export interface TableColumn {
    key: string
    label: string
    width?: string
    align?: 'left' | 'center' | 'right'
}

interface Props {
    columns: TableColumn[]
    data: any[]
    loading?: boolean
    // Pagination Props
    totalItems?: number
    totalPages?: number
    currentPage?: number
    hideSearch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
})

const emit = defineEmits(['update:search', 'update:page', 'filter'])

// Search State (Debounce manual atau v-model langsung)
const searchQuery = ref('')

// Watch search buat emit ke parent
watch(searchQuery, (val) => {
    emit('update:search', val)
})
</script>

<template>
    <div class="flex flex-col gap-[10px]">

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-[10px]">

            <div v-if="!hideSearch" class="w-full md:w-[250px]">
                <BaseInput v-model="searchQuery" placeholder="Cari data..." class="bg-white" />
            </div>

            <div class="flex items-center gap-[10px] overflow-x-auto pb-[2px] md:pb-0">
                <slot name="filters" />
            </div>
        </div>

        <BaseTable :columns="columns" :data="data" :loading="loading">
            <template v-for="(_, name) in $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData" />
            </template>
        </BaseTable>

        <BasePagination :current-page="currentPage" :total-pages="totalPages" :total-items="totalItems"
            @change="(page) => emit('update:page', page)" />

    </div>
</template>