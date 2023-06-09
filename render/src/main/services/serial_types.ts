export interface SendOptions {
  directive: Directives
  payload: boolean | number
}

export type Directives = 'enable' | 'auto' | 'delta' | 'angle'
