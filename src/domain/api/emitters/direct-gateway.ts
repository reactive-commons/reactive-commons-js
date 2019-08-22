import { Command } from '../../..'
import { Query } from '../../model/messages.model'
import { BrokerSender, Message } from '../../model/broker.model'

export class DirectGateway {
  constructor(private sender: BrokerSender, private topicName: string) {}

  sendCommand<T>(command: Command<T>, targetName: string): Promise<void> {
    return this.sender.publish(this.topicName, targetName, new Message(command))
  }

  requestReply<T, R>(query: Query<T>): Promise<R> {
    return Promise.reject(`Not implemented yet`)
  }
}
