<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

// Logic Click Outside
const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const toggle = () => isOpen.value = !isOpen.value

const close = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', close))
onUnmounted(() => document.removeEventListener('click', close))
</script>

<template>
    <div ref="containerRef" class="relative inline-block text-left">
        <button @click.stop="toggle"
            class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-green-500/50 cursor-pointer">
            <EllipsisVerticalIcon class="w-5 h-5" stroke-width="2" />
        </button>

        <Transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-100 z-50 overflow-hidden origin-top-right">
                <div class="py-1" @click="isOpen = false">
                    <slot />
                </div>
            </div>
        </Transition>
    </div>
</template>