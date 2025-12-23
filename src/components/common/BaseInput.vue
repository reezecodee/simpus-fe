<script setup lang="ts">
interface Props {
    label?: string
    placeholder?: string
    type?: string
    error?: string
    disabled?: boolean
    required?: boolean
    mono?: boolean // <--- 1. Tambah Prop Baru
}

const model = defineModel<string | number>()

withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    required: false,
    mono: false // Defaultnya false (tetap Sans Serif)
})
</script>

<template>
    <div class="flex flex-col gap-[4px]">
        <label v-if="label" class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">
            {{ label }} <span v-if="required" class="text-red-500">*</span>
        </label>

        <input v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled" class="w-full h-[32px] px-[10px] rounded-[6px] border bg-white text-[12px] font-medium text-gray-800 placeholder-gray-400 transition-all duration-200 outline-none tabular-nums
      focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:bg-gray-100 disabled:text-gray-500" :class="[
        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
        mono ? 'font-mono tracking-tighter' : ''
    ]" />

        <span v-if="error" class="text-[9px] text-red-500 font-medium mt-[1px]">
            {{ error }}
        </span>
    </div>
</template>