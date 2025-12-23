<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    label?: string
    value: string | number | boolean // Value wajib untuk identifikasi
    name?: string // Optional, untuk grouping native (aksesibilitas)
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false
})

const model = defineModel<string | number | boolean>()

const isSelected = computed(() => model.value === props.value)

const select = () => {
    if (!props.disabled) {
        model.value = props.value
    }
}
</script>

<template>
    <div @click="select" class="flex items-center gap-[8px] cursor-pointer group select-none inline-flex"
        :class="disabled ? 'opacity-50 cursor-not-allowed' : ''">
        <div class="w-[16px] h-[16px] rounded-full border flex items-center justify-center transition-all duration-200 shadow-sm relative"
            :class="[
                isSelected
                    ? 'border-[#16a34a] bg-white'
                    : 'bg-white border-gray-300 group-hover:border-[#16a34a]'
            ]">
            <div class="w-[8px] h-[8px] rounded-full bg-[#16a34a] transition-transform duration-200"
                :class="isSelected ? 'scale-100' : 'scale-0'"></div>
        </div>

        <span v-if="label" class="text-[12px] font-medium text-gray-700 pt-[1px]">
            {{ label }}
        </span>
    </div>
</template>