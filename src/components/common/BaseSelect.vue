<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

interface Option {
    label: string
    value: string | number
}

interface Props {
    label?: string
    options: Option[] | string[] // Bisa array object atau array string biasa
    placeholder?: string
    error?: string
    disabled?: boolean
    required?: boolean
}

const model = defineModel<string | number>()
const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    required: false
})
</script>

<template>
    <div class="flex flex-col gap-[4px]">
        <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative">
            <select v-model="model" :disabled="disabled" class="w-full h-[32px] pl-[10px] pr-[30px] rounded-[6px] border bg-white text-[12px] font-medium text-gray-800 transition-all duration-200 outline-none appearance-none cursor-pointer
        focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:bg-gray-100 disabled:text-gray-500" :class="[
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
            !model ? 'text-gray-400' : '' // Warna abu jika belum pilih (placeholder look)
        ]">
                <option value="" disabled selected v-if="placeholder">{{ placeholder }}</option>

                <template v-for="(opt, idx) in options" :key="idx">
                    <option :value="typeof opt === 'object' ? opt.value : opt">
                        {{ typeof opt === 'object' ? opt.label : opt }}
                    </option>
                </template>
            </select>

            <div class="absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDownIcon class="w-[12px] h-[12px]" stroke-width="2.5" />
            </div>
        </div>

        <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
            {{ error }}
        </span>
    </div>
</template>