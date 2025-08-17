import { ref, reactive } from 'vue'
import type { MenuItem } from '@/components/FloatingMenu.vue'

export interface TabFile {
  id: string
  title: string
  artist: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export const tabsState = reactive({
  tabs: [] as TabFile[],
  currentTab: null as TabFile | null,
  isLoading: false,
  error: '',
  renamingTab: null as TabFile | null
})

export const currentView = ref<'list' | 'editor'>('list')
export const showNewTabForm = ref(false)
export const newTabTitle = ref('')
export const newTabArtist = ref('')

export async function loadTabs(): Promise<void> {
  tabsState.isLoading = true
  tabsState.error = ''

  try {
    const stored = localStorage.getItem('tablature-tabs')
    if (stored) {
      const parsed = JSON.parse(stored)
      tabsState.tabs = parsed.map((tab: any) => ({
        ...tab,
        createdAt: new Date(tab.createdAt),
        updatedAt: new Date(tab.updatedAt)
      }))
    }
  } catch (e) {
    tabsState.error = 'Failed to load tabs from storage'
    console.error(e)
  } finally {
    tabsState.isLoading = false
  }
}

export async function saveTabs(): Promise<void> {
  try {
    localStorage.setItem('tablature-tabs', JSON.stringify(tabsState.tabs))
  } catch (e) {
    tabsState.error = 'Failed to save tabs to storage'
    console.error(e)
  }
}

export async function createTab(title: string, artist: string = '', content: string = ''): Promise<TabFile> {
  const newTab: TabFile = {
    id: Date.now().toString(),
    title,
    artist,
    content,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  tabsState.tabs.push(newTab)
  await saveTabs()
  return newTab
}

export async function updateTab(id: string, updates: Partial<Omit<TabFile, 'id' | 'createdAt'>>): Promise<void> {
  const tabIndex = tabsState.tabs.findIndex(tab => tab.id === id)
  if (tabIndex !== -1) {
    tabsState.tabs[tabIndex] = {
      ...tabsState.tabs[tabIndex],
      ...updates,
      updatedAt: new Date()
    }
    await saveTabs()

    if (tabsState.currentTab?.id === id) {
      tabsState.currentTab = tabsState.tabs[tabIndex]
    }
  }
}

export async function deleteTab(id: string): Promise<void> {
  tabsState.tabs = tabsState.tabs.filter(tab => tab.id !== id)
  if (tabsState.currentTab?.id === id) {
    tabsState.currentTab = null
  }
  await saveTabs()
}

export function loadTab(id: string): TabFile | null {
  const tab = tabsState.tabs.find(tab => tab.id === id)
  if (tab) {
    tabsState.currentTab = tab
    return tab
  }
  return null
}

export function exportTab(tab: TabFile): void {
  const dataStr = JSON.stringify(tab, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)

  const exportFileDefaultName = `${tab.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`

  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export async function importTab(file: File): Promise<TabFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string
        const importedTab = JSON.parse(content) as TabFile

        const newTab: TabFile = {
          ...importedTab,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        tabsState.tabs.push(newTab)
        await saveTabs()
        resolve(newTab)
      } catch (error) {
        reject(new Error('Invalid tab file format'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

export async function handleCreateTab(): Promise<void> {
  if (!newTabTitle.value.trim()) return

  const tab = await createTab(newTabTitle.value, newTabArtist.value)
  tabsState.currentTab = tab
  currentView.value = 'editor'

  // Reset form
  newTabTitle.value = ''
  newTabArtist.value = ''
  showNewTabForm.value = false
}

export async function handleRename(tab: TabFile): Promise<void> {
  tabsState.renamingTab = tab
}

export async function handleDuplicate(tab: TabFile): Promise<void> {
  const duplicatedTab = await createTab(`${tab.title} (Copy)`, tab.artist, tab.content)
  tabsState.currentTab = duplicatedTab
  currentView.value = 'editor'
}

export function handleExport(tab?: TabFile): void {
  const tabToExport = tab || tabsState.currentTab
  if (tabToExport) {
    exportTab(tabToExport)
  }
}

export async function handleImportFile(file: File): Promise<void> {
  try {
    const importedTab = await importTab(file)
    tabsState.currentTab = importedTab
    currentView.value = 'editor'
  } catch (e) {
    console.error('Import failed:', e)
  }
}

export function handleOpenTab(tabId: string): void {
  loadTab(tabId)
  currentView.value = 'editor'
}

export function handleCloseEditor(): void {
  tabsState.currentTab = null
  currentView.value = 'list'
}

export async function handleDeleteTab(tabId: string): Promise<void> {
  await deleteTab(tabId)
}

export function handleTabSave(content: string): void {
  if (tabsState.currentTab) {
    updateTab(tabsState.currentTab.id, { content })
  }
}

export function triggerFileInput(fileInputRef: HTMLInputElement | undefined): void {
  fileInputRef?.click()
}

export function getTabMenuItems(
  tab: TabFile,
): MenuItem[] {
  return [
    {
      label: 'Rename',
      icon: 'pencil',
      action: () => handleRename(tab)
    },
    {
      label: 'Duplicate',
      icon: 'copy',
      action: () => handleDuplicate(tab)
    },
    {
      label: 'Export',
      icon: 'download',
      action: () => handleExport(tab)
    },
    {
      label: 'Delete',
      icon: 'close',
      action: () => handleDeleteTab(tab.id),
      variant: 'danger',
      separator: true
    }
  ]
}