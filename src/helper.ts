import { Context } from 'rvl-pipe'

export const merge = (key: string, ctx: Context) => (value: any) =>
  Object.assign(ctx, { [key]: value })
