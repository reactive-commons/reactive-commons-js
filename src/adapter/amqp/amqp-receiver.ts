import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'

import { BrokerReceiver, MessageConsumer } from '../../domain/model/broker.model'

export class AmqpReceiver implements BrokerReceiver {
  constructor(private channel: ChannelWrapper) {}

  async consume(queueName: string, consumer: MessageConsumer): Promise<void> {
    await this.channel.addSetup((channel: ConfirmChannel) => {
      return channel.consume(queueName, message => {
        if (message) {
          consumer(JSON.parse(message.content.toString()))
            .then(() => channel.ack(message))
            .catch(() => {
              channel.nack(message)
            })
        }
      })
    })
  }
}
