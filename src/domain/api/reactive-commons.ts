import { Broker } from '../model/broker.model'
import { MessageListener } from '../model/message-listener.model'
import { HandlerRegistry } from './handler-registry'
import { CommandListener } from './listeners/command-listener'
import { EventListener } from './listeners/event-listener'
import { QueryListener } from './listeners/query-listener'
import { ReactiveCommonsContext } from './reactive-commons-context'

export interface ReactiveCommonsConfiguration {
  appName: string
}

export class ReactiveCommons {
  constructor(
    private broker: Broker,
    private registry: HandlerRegistry,
    private config: ReactiveCommonsConfiguration
  ) {}

  start(): Promise<ReactiveCommonsContext> {
    const connection = this.broker.connect()

    const messageListeners: MessageListener[] = [
      new EventListener(this.config, connection, this.registry),
      new QueryListener(this.config, connection, this.registry),
      new CommandListener(this.config, connection, this.registry)
    ]

    const context = new ReactiveCommonsContext(connection)

    return Promise.all(
      messageListeners.map(listener =>
        Promise.all([listener.setupResources(), listener.startListening()])
      )
    ).then(() => context)
  }
}
