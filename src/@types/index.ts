import type { ComponentOptionsMixin, DefineComponent } from "vue"

// type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
//     Pick<T, Exclude<keyof T, Keys>>
//     & {
//         [K in Keys]-?:
//             Required<Pick<T, K>>
//             & Partial<Record<Exclude<Keys, K>, undefined>>
//     }[Keys]

// type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
//     Pick<T, Exclude<keyof T, Keys>> 
//     & {
//         [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
//     }[Keys]

// type RequireAtMostOne<T, Keys extends keyof T = keyof T> =
//     Pick<T, Exclude<keyof T, Keys>> 
//     & {
//         [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
//     }[Keys]

type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

type Either<T, U> = Only<T, U> | Only<U, T>;


export type PreviewCard = {
  path: string
  title: string
  subtitle?: string
} & Either<{
  thumb?: string
}, {
  previewComponent?: () => unknown
}>

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