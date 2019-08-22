import { Connection, Headers, Message } from '../../model/broker.model'
import { COMPLETION_ONLY_SIGNAL, CORRELATION_ID, REPLY_ID } from '../../model/headers.model'
import { MessageListener } from '../../model/message-listener.model'
import { Query } from '../../model/messages.model'
import { HandlerRegistry } from '../handler-registry'
import { ReactiveCommonsConfiguration } from '../reactive-commons'

export class QueryListener implements MessageListener {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private connection: Connection,
    private registry: HandlerRegistry
  ) {}

  public setupResources(): Promise<void> {
    const queueName = `${this.config.appName}.queries`
    const topicName = 'directMessages'
    const routingKey = `${this.config.appName}.query`

    return Promise.all([
      this.declareQueriesQueue(queueName),
      this.declareDirectMessagesTopic(topicName),
      this.setupBindings(queueName, topicName, routingKey)
    ]).then()
  }

  public startListening(): Promise<void> {
    return this.connection.receiver.consume<Query<unknown>>(
      `${this.config.appName}.queries`,
      message => {
        const query = message.data
        const handler = this.registry.getQueryHandler(query.resource)

        return handler(query).then(response => this.publishResponse(message, response))
      }
    )
  }

  private publishResponse(request: Message<Query<unknown>>, response: any): Promise<void> {
    const replyId = request.headers[REPLY_ID]
    const correlationId = request.headers[CORRELATION_ID]
    const responseHeaders: Headers = {
      [CORRELATION_ID]: correlationId
    }

    if (!response) {
      responseHeaders[COMPLETION_ONLY_SIGNAL] = '1'
    }

    return this.connection.sender.publish(
      'globalReply',
      replyId,
      new Message(response, responseHeaders)
    )
  }

  private declareQueriesQueue(queueName: string): Promise<void> {
    return this.connection.sender.declareQueue({
      name: queueName
    })
  }

  private declareDirectMessagesTopic(topicName: string): Promise<void> {
    return this.connection.sender.declareTopic({
      name: topicName,
      type: 'direct'
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
