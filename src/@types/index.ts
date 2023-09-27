import type { ComponentInternalInstance, ComponentOptionsMixin, DefineComponent, ExtractPropTypes, FunctionalComponent, PropType, Renderer } from "vue"

export interface NavItems {
  href: string
  label: string
  classes?: string
  items?: NavItems[]
}

export type VueComponent = DefineComponent<
  any, // stores the component props
  {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin,
  any, // stores the component props
  string, {},
  any, // stores the component props
  {}
>