import { Command } from '../../..'
import { BrokerSender, Message } from '../../model/broker.model'
import { Query } from '../../model/messages.model'
import { ReactiveCommonsConfiguration } from '../reactive-commons'
import { now } from '../time-provider'

export class DirectGateway {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private sender: BrokerSender,
    private topicName: string
  ) {}

  sendCommand<T>(command: Command<T>, targetName: string): Promise<void> {
    return this.sender.publish(
      this.topicName,
      targetName,
      new Message(command, {
        appId: this.config.appName,
        timestamp: now(),
        headers: {
          sourceApplication: this.config.appName
        }
      })
    )
  }

  requestReply<T, R>(query: Query<T>): Promise<R> {
    return Promise.reject(`Not implemented yet`)
  }
}
