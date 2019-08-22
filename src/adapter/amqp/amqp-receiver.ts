import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'

import { BrokerReceiver, MessageConsumer } from '../../domain/model/broker.model'

export class AmqpReceiver implements BrokerReceiver {
  constructor(private channel: ChannelWrapper) {}

  async consume<T>(queueName: string, consumer: MessageConsumer<T>): Promise<void> {
    await this.channel.addSetup((channel: ConfirmChannel) => {
      return channel.consume(queueName, (message: any) => {
        if (message) {
          consumer({
            properties: message.properties,
            data: JSON.parse(message.content.toString())
          })
            .then(() => channel.ack(message))
            .catch(err => {
              console.error('Error processing message', err)
              channel.nack(message)
            })
        }
      })
    })
  }
}
