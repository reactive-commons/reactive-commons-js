import { Connection } from '../../model/broker.model'
import { HandlerRegistry } from '../handler-registry'
import { ReactiveCommonsConfiguration } from '../reactive-commons'
import { Event } from '../../model/messages.model'

export class EventListener {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private connection: Connection,
    private registry: HandlerRegistry
  ) {}

  public setupResources(): Promise<void> {
    const queueName = `${this.config.appName}.subscribedEvents`
    const topicName = 'domainEvents'

    this.listenForNewListeners(queueName, topicName)

    return Promise.all([
      this.declareEventsQueue(queueName),
      this.declareEventsTopic(topicName),
      this.setupBindings(queueName, topicName)
    ]).then()
  }

  public startListening(): Promise<void> {
    return this.connection.receiver.consume<Event<unknown>>(
      `${this.config.appName}.subscribedEvents`,
      message => {
        const event = message.data
        const listeners = this.registry
          .getEventListeners(event.name)
          .map(listener => listener(event))

        return Promise.all(listeners).then()
      }
    )
  }

  private listenForNewListeners(queueName: string, topicName: string) {
    this.registry.onEventListenerPushed(name => {
      this.connection.sender
        .bind({
          queue: queueName,
          topic: topicName,
          routingKey: name
        })
        .catch(error => console.error(error))
    })
  }

  private declareEventsQueue(queueName: string): Promise<void> {
    return this.connection.sender.declareQueue({
      name: queueName
    })
  }

  private declareEventsTopic(topicName: string): Promise<void> {
    return this.connection.sender.declareTopic({
      name: topicName,
      type: 'topic'
    })
  }

  private setupBindings(queueName: string, topicName: string): Promise<void> {
    const eventListeners = Object.keys(this.registry.eventListeners).map(eventName =>
      this.connection.sender.bind({
        queue: queueName,
        topic: topicName,
        routingKey: eventName
      })
    )

    return Promise.all(eventListeners).then()
  }
}
