import { connect } from 'amqp-connection-manager'
import { ConnectionOptions } from 'tls'
import { Broker, Connection } from '../../domain/model/broker.model'
import { AmqpConnection } from './amqp-connection'

export class AmqpBroker implements Broker {
  constructor(private url: string, private options?: ConnectionOptions) {}

  connect(): Connection {
    const connection = connect(
      [this.url],
      { connectionOptions: this.options }
    )

    return new AmqpConnection(connection)
  }
}
