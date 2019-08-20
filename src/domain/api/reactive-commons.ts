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

  private listenForEvents(connection: Connection) {
    return connection.receiver.consume(`${this.config.appName}.subscribedEvents`, message => {
      console.log(message)
      return Promise.resolve()
    })
  }

  private declareEventsTopic(connectioon: Connection): Promise<void> {
    return connectioon.sender.declareTopic({
      name: 'domainEvents',
      type: 'topic'
    })
  }

  private declareDirectMessagesTopic(connection: Connection): Promise<void> {
    return connection.sender.declareTopic({
      name: 'directMessages',
      type: 'direct'
    })
  }

  private declareCommandsQueue(connection: Connection): Promise<void> {
    return connection.sender.declareQueue({
      name: `${this.config.appName}.commands`
    })
  }

  private declareQueriesQueue(connection: Connection): Promise<void> {
    return connection.sender.declareQueue({
      name: `${this.config.appName}.queries`
    })
  }

  private declareEventsQueue(connection: Connection): Promise<void> {
    return connection.sender.declareQueue({
      name: `${this.config.appName}.subscribedEvents`
    })
  }

  private declareReplyQueue(connection: Connection): Promise<void> {
    return connection.sender.declareQueue({
      name: `${this.config.appName}.${connection.id}.replies`,
      exclusive: true
    })
  }
}
