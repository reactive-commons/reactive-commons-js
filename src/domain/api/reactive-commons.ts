import { HandlerRegistry } from './handler-registry'
import { Broker, Connection } from '../model/broker.model'
import { EventListener } from './listeners/event-listener'
import { QueryListener } from './listeners/query-listener'

export interface ReactiveCommonsConfiguration {
  appName: string
}

export class ReactiveCommons {
  constructor(
    private broker: Broker,
    private registry: HandlerRegistry,
    private config: ReactiveCommonsConfiguration
  ) {}

  start(): Promise<Connection> {
    const connection = this.broker.connect()

    const eventListener = new EventListener(this.config, connection, this.registry)
    const queryListener = new QueryListener(this.config, connection, this.registry)

    return Promise.all([
      eventListener.setupResources(),
      queryListener.setupResources(),
      eventListener.startListening(),
      queryListener.startListening()
    ]).then(() => connection)
  }
}
