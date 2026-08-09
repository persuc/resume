import { ref, reactive } from 'vue'
import type { MenuItem } from '@/components/FloatingMenu.vue'
import type { ExampleTab } from '@/assets/tablature/examples'
import { printTab } from './tab-print'

export interface TabFile {
  id: string
  title: string
  artist: string
  content: string
  link?: string
  createdAt: Date
  updatedAt: Date
}

export const tabsState = reactive({
  tabs: [] as TabFile[],
  currentTab: null as TabFile | null,
  isLoading: false,
  error: '',
  renamingTab: null as TabFile | null,
  linkingTab: null as TabFile | null
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

export async function createTab(
  title: string,
  artist: string = '',
  content: string = '',
  link: string = ''
): Promise<TabFile> {
  const newTab: TabFile = {
    id: Date.now().toString(),
    title,
    artist,
    content,
    link,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  tabsState.tabs.push(newTab)
  await saveTabs()
  return newTab
}

export async function updateTab(tab: TabFile, updates: Partial<Omit<TabFile, 'id' | 'createdAt'>>): Promise<void> {
  Object.assign(tab, updates, { updatedAt: new Date() })
  await saveTabs()
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
  let parsed: Partial<TabFile>
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    throw new Error('Invalid tab file format')
  }

  if (typeof parsed?.title !== 'string' || typeof parsed?.content !== 'string') {
    throw new Error('Invalid tab file format')
  }

  return createTab(parsed.title, parsed.artist ?? '', parsed.content, parsed.link ?? '')
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
  const duplicatedTab = await createTab(`${tab.title} (Copy)`, tab.artist, tab.content, tab.link)
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
    tabsState.error = ''
    tabsState.currentTab = await importTab(file)
    currentView.value = 'editor'
  } catch (e) {
    tabsState.error = e instanceof Error ? e.message : 'Import failed'
    console.error('Import failed:', e)
  }
}

export async function handleFileSelect(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await handleImportFile(file)
  input.value = ''
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

export function openExample(example: ExampleTab): void {
  tabsState.currentTab = {
    id: Date.now().toString(),
    title: example.title,
    artist: example.artist,
    content: example.content,
    link: example.link ?? '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
  currentView.value = 'editor'
}

// An example opened straight from its URL only joins the library once edited.
function adopt(tab: TabFile): void {
  if (!tabsState.tabs.some((candidate) => candidate.id === tab.id)) tabsState.tabs.push(tab)
}

export function handleLinkSave(link: string): void {
  const tab = tabsState.currentTab
  if (!tab) return

  adopt(tab)
  updateTab(tab, { link })
}

export function handleTabSave(content: string): void {
  const tab = tabsState.currentTab
  if (!tab) return

  adopt(tab)
  updateTab(tab, { content })
}

export function triggerFileInput(fileInputRef: HTMLInputElement | undefined): void {
  fileInputRef?.click()
}

export async function handlePrintTab(tab: TabFile): Promise<void> {
  tabsState.error = ''

  const printed = await printTab(tab)
  if (!printed) tabsState.error = `"${tab.title}" has no valid notation to print`
}

export function handleSetLink(tab: TabFile): void {
  tabsState.linkingTab = tab
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
      label: 'Set link',
      icon: 'comments',
      action: () => handleSetLink(tab)
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
      label: 'PDF',
      icon: 'download',
      action: () => handlePrintTab(tab)
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