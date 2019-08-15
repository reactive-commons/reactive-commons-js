export type CommandHandler<M> = (message: M) => Promise<void>
export type QueryHandler<M, R> = (message: M) => Promise<R>
export type EventListener<M> = (message: M) => Promise<void>

export type HandlerRegistryRoutes<H> = {
  [path: string]: H[]
}
