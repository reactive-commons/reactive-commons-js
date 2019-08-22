import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { URL } from 'url'
import { v4 as uuid } from 'uuid'
import { Connection } from '../../domain/model/broker.model'
import { AmqpReceiver } from './amqp-receiver'
import { AmqpSender } from './amqp-sender'

export class AmqpConnection implements Connection {
  public id: string

  private channel: ChannelWrapper
  private _sender: AmqpSender
  private _receiver: AmqpReceiver

  get sender() {
    return this._sender
  }

  get receiver() {
    return this._receiver
  }

  constructor(private connectionManager: AmqpConnectionManager) {
    this.id = uuid().replace(/-/g, '')

    this.channel = connectionManager.createChannel({
      json: false
    })

    this._sender = new AmqpSender(this.channel)
    this._receiver = new AmqpReceiver(this.channel)
  }

  onConnect(listener: (event: { host: string }) => void) {
    this.connectionManager.on('connect', connected => {
      const url = new URL(connected.url)
      listener({ host: url.host })
    })
  }

  onDisconnect(listener: (err: Error) => void) {
    this.connectionManager.on('disconnect', err => listener(err.err))
  }
}
