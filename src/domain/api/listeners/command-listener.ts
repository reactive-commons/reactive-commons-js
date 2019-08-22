import { Connection } from '../../model/broker.model'
import { MessageListener } from '../../model/message-listener.model'
import { Command } from '../../model/messages.model'
import { HandlerRegistry } from '../handler-registry'
import { ReactiveCommonsConfiguration } from '../reactive-commons'

export class CommandListener implements MessageListener {
  constructor(
    private config: ReactiveCommonsConfiguration,
    private connection: Connection,
    private registry: HandlerRegistry
  ) {}

  public setupResources(): Promise<void> {
    const queueName = `${this.config.appName}.commands`
    const topicName = 'directMessages'
    const routingKey = this.config.appName

    return Promise.all([
      this.declareCommandsQueue(queueName),
      this.declareDirectMessagesTopic(topicName),
      this.setupBindings(queueName, topicName, routingKey)
    ]).then()
  }

  public startListening(): Promise<void> {
    return this.connection.receiver.consume<Command<unknown>>(
      `${this.config.appName}.commands`,
      message => {
        const command = message.data
        const handler = this.registry.getCommandHandler(command.name)

        return handler(command)
      }
    )
  }

  private declareCommandsQueue(queueName: string): Promise<void> {
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
