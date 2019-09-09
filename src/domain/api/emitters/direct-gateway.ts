import { v4 as uuid } from 'uuid'
import { Command } from '../../..'
import { BrokerSender, Message } from '../../model/broker.model'
import { CORRELATION_ID, REPLY_ID, SERVED_QUERY_ID } from '../../model/headers.model'
import { Query } from '../../model/messages.model'
import { ReactiveCommonsConfiguration } from '../reactive-commons'
import { ReplyRouter } from '../reply-router'
import { now } from '../time-provider'

export class DirectGateway {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private sender: BrokerSender,
    private replyRouter: ReplyRouter,
    private topicName: string,
    private instanceId: string
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

  requestReply<T, R>(query: Query<T>, targetName: string): Promise<R> {
    const correlationId = uuid().replace(/-/g, '')

    return Promise.all([
      this.sender.publish(
        this.topicName,
        `${targetName}.query`,
        new Message(query, {
          appId: this.config.appName,
          timestamp: now(),
          headers: {
            sourceApplication: this.config.appName,
            [REPLY_ID]: this.instanceId,
            [SERVED_QUERY_ID]: query.resource,
            [CORRELATION_ID]: correlationId
          }
        })
      ),
      this.replyRouter.register<R>(correlationId)
    ]).then(response => response[1])
  }
}
