import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'
import router from '../router'
import { markRaw, type Component } from 'vue'

export interface TabItem {
  name: string
  path: string
  title: string
  icon?: Component
}

interface TabState {
  openTabs: TabItem[]
  activeTabPath: string
}

export const useTabStore = defineStore('tab', {
  state: (): TabState => ({
    openTabs: [],
    activeTabPath: '',
  }),

  actions: {
    addTab(route: RouteLocationNormalized) {
      if (!route.name || !route.meta?.title) return

      const existing = this.openTabs.find((t) => t.path === route.path)

      if (!existing) {
        this.openTabs.push({
          // Paksa (Cast) menjadi string karena kita sudah cek di atas
          name: route.name as string,
          path: route.path,
          title: route.meta.title as string,
          icon: route.meta?.icon ? markRaw(route.meta.icon as Component) : undefined,
        })
      }

      this.activeTabPath = route.path
    },

    closeTab(path: string) {
      const index = this.openTabs.findIndex((t) => t.path === path)
      if (index === -1) return

      this.openTabs.splice(index, 1)

      if (this.activeTabPath === path) {
        if (this.openTabs.length > 0) {
          // Cek apakah nextTab benar-benar ada sebelum diakses
          const nextTab = this.openTabs[this.openTabs.length - 1]

          if (nextTab) {
            // <-- Pengecekan null safety
            router.push(nextTab.path)
          }
        } else {
          router.push('/')
        }
      }
    },
  },
})
