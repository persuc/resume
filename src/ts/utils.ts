import type { Component, FunctionalComponent } from "vue"

export function getComponentName(component: Component): string {
  return (component as FunctionalComponent).__file!.match(/.*\/([A-z]+)\.vue/)![1]!
}