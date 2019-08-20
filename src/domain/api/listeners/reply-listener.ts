import { Connection } from '../../model/broker.model'
import { HandlerRegistry } from '../handler-registry'
import { ReactiveCommonsConfiguration } from '../reactive-commons'

export class ReplyListener {
  private queueName: string
  private topicName: string
  private routingKey: string

  constructor(
    private config: ReactiveCommonsConfiguration,
    private connection: Connection,
    private registry: HandlerRegistry
  ) {
    this.queueName = `${this.config.appName}.${this.connection.id}.replies`
    this.topicName = 'globalReply'
    this.routingKey = this.config.appName
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
