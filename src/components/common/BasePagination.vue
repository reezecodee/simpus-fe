<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface Props {
    currentPage: number
    totalPages: number
    totalItems?: number
    pageSize?: number
}

const props = defineProps<Props>()
const emit = defineEmits(['change']) // Emit page number baru

const prev = () => {
    if (props.currentPage > 1) emit('change', props.currentPage - 1)
}

const next = () => {
    if (props.currentPage < props.totalPages) emit('change', props.currentPage + 1)
}
</script>

<template>
    <div class="flex items-center justify-between px-[2px] py-[10px] select-none">

        <div class="text-[11px] text-gray-500 font-medium">
            Halaman <span class="font-bold text-gray-800">{{ currentPage }}</span> dari <span
                class="font-bold text-gray-800">{{ totalPages }}</span>
            <span v-if="totalItems" class="ml-1 text-gray-400">
                (Total {{ totalItems }} data)
            </span>
        </div>

        <div class="flex items-center gap-[5px]">
            <button @click="prev" :disabled="currentPage === 1"
                class="h-[28px] w-[28px] flex items-center justify-center rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600">
                <ChevronLeftIcon class="w-3 h-3" stroke-width="3" />
            </button>

            <button @click="next" :disabled="currentPage === totalPages"
                class="h-[28px] w-[28px] flex items-center justify-center rounded-[6px] border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600">
                <ChevronRightIcon class="w-3 h-3" stroke-width="3" />
            </button>
        </div>
    </div>
</template>