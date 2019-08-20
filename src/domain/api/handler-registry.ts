import {
  CommandHandler,
  HandlerRegistryRoutes,
  QueryHandler,
  EventListener
} from '../model/message-handlers.model'
import { EventEmitter } from 'events'

export class HandlerRegistry {
  private _commandHandlers: HandlerRegistryRoutes<CommandHandler<any>> = {}
  private _queryHandlers: HandlerRegistryRoutes<QueryHandler<any, any>> = {}
  private _eventListeners: HandlerRegistryRoutes<EventListener<any>> = {}
  private eventListenersUpdates: EventEmitter

  get commandHandlers() {
    return this._commandHandlers
  }

  get queryHandlers() {
    return this._queryHandlers
  }

  get eventListeners() {
    return this._eventListeners
  }

  private constructor() {
    this.eventListenersUpdates = new EventEmitter()
  }

  public static register() {
    return new HandlerRegistry()
  }

  public getCommandHandlers<M>(name: string): CommandHandler<M>[] {
    return this.commandHandlers[name] || []
  }

  public getQueryHandlers<M, R>(resource: string): QueryHandler<M, R>[] {
    return this.queryHandlers[resource] || []
  }

  public getEventListeners<M>(name: string): EventListener<M>[] {
    return this.eventListeners[name] || []
  }

  public handleCommand<M>(name: string, handler: CommandHandler<M>): void {
    this.push(this.commandHandlers, name, handler)
  }

  public serverQuery<M, R>(resource: string, handler: QueryHandler<M, R>): void {
    this.push(this.queryHandlers, resource, handler)
  }

  public listenEvent<M>(name: string, listener: EventListener<M>): void {
    this.push(this.eventListeners, name, listener)
    this.eventListenersUpdates.emit('eventListenerPushed', name, listener)
  }

  public onEventListenerPushed(handle: (name: string, listener: EventListener<unknown>) => void) {
    this.eventListenersUpdates.on('eventListenerPushed', handle)
  }

  private push<H>(routes: HandlerRegistryRoutes<H>, path: string, handler: H) {
    if (!routes[path]) {
      routes[path] = []
    }

    routes[path].push(handler)
  }
}
