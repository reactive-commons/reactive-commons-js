import { Event } from '../../model/messages.model'
import { Message, BrokerSender } from '../../model/broker.model'

export class EventBus implements EventBus {
  constructor(private sender: BrokerSender, private topicName: string) {}

  emit<T>(event: Event<T>): Promise<void> {
    return this.sender.publish(this.topicName, event.name, new Message(event))
  }
}
