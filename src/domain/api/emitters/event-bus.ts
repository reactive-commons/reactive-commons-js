import { Event } from '../../model/messages.model'
import { Message, BrokerSender } from '../../model/broker.model'
import { ReactiveCommonsConfiguration } from '../reactive-commons'
import { now } from '../time-provider'

export class EventBus implements EventBus {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private sender: BrokerSender,
    private topicName: string
  ) {}

  emit<T>(event: Event<T>): Promise<void> {
    return this.sender.publish(
      this.topicName,
      event.name,
      new Message(event, {
        appId: this.config.appName,
        timestamp: now(),
        headers: {
          sourceApplication: this.config.appName
        }
      })
    )
  }
}
