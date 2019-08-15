import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConnectionOptions } from 'tls'
import { URL } from 'url'

import { Broker, BrokerSender, BrokerReceiver, Connection } from '../../domain/model/broker.model'
import { AmqpSender } from './amqp-sender'
import { AmqpReceiver } from './amqp-receiver'

export class AmqpBroker implements Broker {
  connectionManager?: AmqpConnectionManager
  channel?: ChannelWrapper
  sender?: BrokerSender
  receiver?: BrokerReceiver

  constructor(private url: string, private options?: ConnectionOptions) {}

  connect(): Connection {
    if (this.connectionManager) {
      throw new Error('AMQP connection already created')
    }

    const connection = connect(
      [this.url],
      { connectionOptions: this.options }
    )

    const channel = connection.createChannel({
      json: true
    })

    this.connectionManager = connection
    this.channel = channel
    this.sender = new AmqpSender(channel)
    this.receiver = new AmqpReceiver(channel)

    return {
      onConnect: listener => {
        connection.on('connect', connected => {
          const url = new URL(connected.url)
          listener({ host: url.host })
        })
      },
      onDisconnect: listener => {
        connection.on('disconnect', err => listener(err.err))
      }
    }
  }

  getSender(): AmqpSender {
    if (!this.connectionManager) {
      throw new Error('AMQP sender must be accessed after connection creation')
    }

    return this.sender as AmqpSender
  }

  getReceiver(): AmqpReceiver {
    if (!this.connectionManager) {
      throw new Error('AMQP receiver must be accessed after connection creation')
    }

    return this.receiver as AmqpReceiver
  }
}
