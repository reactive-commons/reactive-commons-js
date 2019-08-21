import { Command, Query, Event } from './messages.model'

export type CommandHandler<M> = (message: Command<M>) => Promise<void>
export type QueryHandler<M, R> = (message: Query<M>) => Promise<R>
export type EventListener<M> = (message: Event<M>) => Promise<void>

export type HandlerRegistryRoutes<H> = {
  [path: string]: H
}
