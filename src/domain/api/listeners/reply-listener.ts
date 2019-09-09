import { Connection } from '../../model/broker.model'
import { CORRELATION_ID } from '../../model/headers.model'
import { ReactiveCommonsConfiguration } from '../reactive-commons'
import { ReplyRouter } from '../reply-router'

export class ReplyListener {
  private queueName: string
  private topicName: string
  private routingKey: string

  constructor(
    private config: ReactiveCommonsConfiguration,
    private connection: Connection,
    private replyRouter: ReplyRouter
  ) {
    this.queueName = `${this.config.appName}.${this.connection.id}.replies`
    this.topicName = 'globalReply'
    this.routingKey = this.connection.id
  }

  public setupResources(): Promise<void> {
    return Promise.all([
      this.declareRepliesQueue(this.queueName),
      this.declareGlobalReplyTopic(this.topicName),
      this.setupBindings(this.queueName, this.topicName, this.routingKey)
    ]).then()
  }

  public startListening(): Promise<void> {
    return this.connection.receiver.consume<unknown>(this.queueName, message => {
      this.replyRouter.routeReply(message.properties.headers[CORRELATION_ID], message)

      return Promise.resolve()
    })
  }

  private declareRepliesQueue(queueName: string): Promise<void> {
    return this.connection.sender.declareQueue({
      name: queueName,
      exclusive: true
    })
  }

  private declareGlobalReplyTopic(topicName: string): Promise<void> {
    return this.connection.sender.declareTopic({
      name: topicName,
      type: 'topic'
    })
  }

  private setupBindings(queueName: string, topicName: string, routingKey: string): Promise<void> {
    return this.connection.sender.bind({
      queue: queueName,
      topic: topicName,
      routingKey: routingKey
    })
  }
}
