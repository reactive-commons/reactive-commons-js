import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import { BrokerSender, Headers, Message } from '../../domain/model/broker.model'
import {
  BindingSpecification,
  QueueSpecitication,
  TopicSpecification
} from '../../domain/model/resources.model'

export class AmqpSender implements BrokerSender {
  constructor(private channel: ChannelWrapper) {}

  declareQueue({ name, ...rest }: QueueSpecitication): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) => channel.assertQueue(name, rest))
  }

  declareTopic({ name, type }: TopicSpecification): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) => channel.assertExchange(name, type))
  }

  bind({ queue, topic, routingKey }: BindingSpecification): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) =>
      channel.bindQueue(queue, topic, routingKey)
    )
  }

  publish<T>(topic: string, routingKey: string, message: Message<T>): Promise<void> {
    const content = Buffer.from(JSON.stringify(message.data))
    return this.channel.publish(topic, routingKey, content, {
      deliveryMode: 2,
      headers: message.headers
    })
  }
}
