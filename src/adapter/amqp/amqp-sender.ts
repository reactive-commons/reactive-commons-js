import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'

import {
  BrokerSender,
  QueueSpecitication,
  ExchangeSpecification,
  BindingSpecification
} from '../../domain/model/broker.model'

export class AmqpSender implements BrokerSender {
  constructor(private channel: ChannelWrapper) {}

  declareQueue({ name, ...rest }: QueueSpecitication): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) => channel.assertQueue(name, rest))
  }

  declareTopic({ name }: ExchangeSpecification): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) => channel.assertExchange(name, 'topic'))
  }

  bind({ queue, topic, routingKey }: BindingSpecification): Promise<void> {
    return this.channel.addSetup((channel: ConfirmChannel) =>
      channel.bindQueue(queue, topic, routingKey)
    )
  }

  publish(topic: string, routingKey: string, content: object) {
    return this.channel.publish(topic, routingKey, content as Buffer, {
      deliveryMode: 2
    })
  }
}
