<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTabStore } from '../stores/tabStore'

import RailSidebar from '../components/layout/RailSidebar.vue'
import MainSidebar from '../components/layout/MainSidebar.vue'

const store = useTabStore()
const route = useRoute()
const isSidebarOpen = ref(true)

// --- Logic Jam & Tanggal Digital ---
const currentTime = ref('00:00')
const currentDate = ref('') // Variable baru untuk tanggal
let timer: ReturnType<typeof setInterval>

const updateClock = () => {
    const now = new Date()

    // 1. Ambil Jam (Format 12:00:00)
    currentTime.value = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).replace('.', ':')

    // 2. Ambil Tanggal Lengkap (Format: Senin, 23 Desember 2025)
    currentDate.value = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

onMounted(() => {
    updateClock()
    timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})

watch(
    () => route.path, // Yang dipantau
    () => {
        store.addTab(route)
    },
    { immediate: true } // PENTING: Supaya saat pertama kali refresh halaman, tab langsung muncul
)
</script>

<template>
    <div class="flex h-screen w-screen bg-[#f3f4f6] overflow-hidden font-sans text-[12px] text-[#334155]">

        <RailSidebar />
        <MainSidebar :is-open="isSidebarOpen" />

        <div class="flex-1 flex flex-col min-w-0 transition-all duration-300">

            <nav
                class="h-[50px] bg-white border-b border-[#e5e7eb] flex items-center justify-between px-[20px] shadow-sm z-30 flex-shrink-0">

                <div class="flex items-center">
                    <button @click="isSidebarOpen = !isSidebarOpen"
                        class="text-[#64748b] hover:text-green-700 text-[20px] cursor-pointer transition-colors p-1 rounded hover:bg-gray-50"
                        title="Toggle Sidebar">
                        ☰
                    </button>
                </div>

                <div class="flex items-center gap-[20px]">

                    <div
                        class="bg-[#f8fafc] border border-[#e2e8f0] px-[12px] py-[5px] rounded-[20px] text-[12px] font-semibold text-[#475569] flex items-center gap-2 shadow-sm">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor" class="w-[14px] h-[14px] text-gray-500">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <span class="text-gray-600">{{ currentDate }}</span>

                        <span class="text-gray-300">|</span>

                        <span class="text-gray-800 font-bold">{{ currentTime }}</span>
                    </div>

                    <div class="h-[20px] w-[1px] bg-gray-200"></div>

                    <div class="flex items-center gap-[10px] cursor-pointer group">
                        <div class="text-right hidden sm:block">
                            <div
                                class="text-[12px] font-bold text-gray-700 group-hover:text-green-700 transition leading-tight">
                                Atyla Azfa
                            </div>
                            <div class="text-[10px] font-medium text-gray-400 leading-tight mt-[1px]">
                                Petugas Pendaftaran
                            </div>
                        </div>

                        <div
                            class="w-[32px] h-[32px] rounded-full bg-green-100 border border-green-200 flex items-center justify-center text-green-700 font-bold text-[11px] group-hover:ring-2 ring-green-100 transition shadow-sm">
                            AA
                        </div>
                    </div>

                </div>
            </nav>

            <div class="bg-[#e2e8f0] px-[12px] border-b border-[#cbd5e1] flex gap-[3px] overflow-x-auto flex-shrink-0">

                <div v-for="tab in store.openTabs" :key="tab.path" @click="$router.push(tab.path)"
                    class="cursor-pointer mt-[5px] px-[10px] py-[7px] rounded-t-[6px] text-[11px] flex items-center gap-2 select-none min-w-[120px] max-w-[180px] transition-all relative group"
                    :class="route.path === tab.path
                        ? 'bg-white text-[#0f172a] font-bold shadow-sm z-10'
                        : 'bg-[#cbd5e1] text-[#64748b] hover:bg-[#d1d5db]'">
                    <component v-if="tab.icon" :is="tab.icon" class="w-[14px] h-[14px] flex-shrink-0"
                        :class="route.path === tab.path ? 'text-green-700' : 'text-gray-500'" stroke-width="2" />

                    <span class="truncate flex-1">{{ tab.title }}</span>

                    <span @click.stop="store.closeTab(tab.path)"
                        class="w-[14px] h-[14px] flex items-center justify-center rounded-full hover:bg-red-500 hover:text-white text-[9px] text-[#666] opacity-0 group-hover:opacity-100 transition-opacity"
                        :class="route.path === tab.path ? 'opacity-100' : ''">
                        ✕
                    </span>

                    <div v-if="route.path === tab.path" class="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-white">
                    </div>
                </div>

            </div>

            <main class="flex-1 bg-white overflow-y-auto p-[15px] relative">
                <div class="p-[15px] mx-auto font-sans text-[#1f2937]">
                    <router-view v-slot="{ Component }">
                        <keep-alive>
                            <component :is="Component" :key="route.fullPath" />
                        </keep-alive>
                    </router-view>
                </div>
            </main>

        </div>
    </div>
</template>