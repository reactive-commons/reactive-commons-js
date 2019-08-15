import {
  CommandHandler,
  HandlerRegistryRoutes,
  QueryHandler,
  EventListener
} from './model/message-handlers.model'

export class HandlerRegistry {
  commandHandlers: HandlerRegistryRoutes<CommandHandler<any>> = {}
  queryHandlers: HandlerRegistryRoutes<QueryHandler<any, any>> = {}
  eventListeners: HandlerRegistryRoutes<EventListener<any>> = {}

  private constructor() {}

  public static register() {
    return new HandlerRegistry()
  }

  public handleCommand<M>(commandName: string, handler: CommandHandler<M>): void {
    this.push(this.commandHandlers, commandName, handler)
  }

  public serverQuery<M, R>(queryName: string, handler: QueryHandler<M, R>): void {
    this.push(this.queryHandlers, queryName, handler)
  }

  public listenEvent<M>(eventName: string, handler: EventListener<M>): void {
    this.push(this.eventListeners, eventName, handler)
  }

  private push<H>(routes: HandlerRegistryRoutes<H>, path: string, handler: H) {
    if (!routes[path]) {
      routes[path] = []
    }

    routes[path].push(handler)
  }
}
