<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

interface Props {
    modelValue: boolean // v-model untuk show/hide
    title?: string
    width?: string // Class width tailwind (max-w-md, max-w-lg, dll)
}

const props = withDefaults(defineProps<Props>(), {
    width: 'max-w-md' // Default width sedang
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
    emit('update:modelValue', false)
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="modelValue"
                class="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-[15px] backdrop-blur-[1px]"
                @click.self="close">

                <Transition name="scale">
                    <div v-if="modelValue"
                        class="bg-white rounded-[10px] shadow-2xl w-full flex flex-col max-h-[90vh] border border-gray-200"
                        :class="width">
                        <div class="flex items-center justify-between px-[15px] py-[12px] border-b border-gray-100">
                            <h3 class="text-[14px] font-bold text-gray-800">{{ title || 'Modal Title' }}</h3>
                            <button @click="close" class="text-gray-400 hover:text-red-500 transition cursor-pointer">
                                <XMarkIcon class="w-[16px] h-[16px]" stroke-width="2.5" />
                            </button>
                        </div>

                        <div class="p-[15px] overflow-y-auto text-[13px] text-gray-600">
                            <slot />
                        </div>

                        <div v-if="$slots.footer"
                            class="px-[15px] py-[10px] bg-gray-50 border-t border-gray-100 flex justify-end gap-[10px] rounded-b-[10px]">
                            <slot name="footer" :close="close" />
                        </div>
                    </div>
                </Transition>

            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Animasi Fade Backdrop */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Animasi Scale Modal */
.scale-enter-active,
.scale-leave-active {
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}
</style>