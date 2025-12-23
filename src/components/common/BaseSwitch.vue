<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    label?: string
    disabled?: boolean
    color?: string // Bisa custom warna kalau mau (default hijau)
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    color: 'bg-green-600'
})

const model = defineModel<boolean>({ default: false })

const toggle = () => {
    if (!props.disabled) model.value = !model.value
}
</script>

<template>
    <div class="flex items-center gap-[10px] cursor-pointer select-none"
        :class="disabled ? 'opacity-50 cursor-not-allowed' : ''" @click="toggle">
        <div class="w-[36px] h-[20px] rounded-full relative transition-colors duration-300"
            :class="model ? color : 'bg-gray-300'">
            <div class="absolute top-[2px] left-[2px] w-[16px] h-[16px] bg-white rounded-full shadow-sm transition-transform duration-300"
                :class="model ? 'translate-x-[16px]' : 'translate-x-0'"></div>
        </div>

        <span v-if="label" class="text-[12px] font-medium text-gray-700">
            {{ label }}
        </span>
    </div>
</template>