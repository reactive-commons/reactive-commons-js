import { AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { URL } from 'url'
import { v4 as uuid } from 'uuid'
import { Connection } from '../../domain/model/broker.model'
import { AmqpReceiver } from './amqp-receiver'
import { AmqpSender } from './amqp-sender'
import { EventBus } from '../../domain/api/emitters/event-bus'

export class AmqpConnection implements Connection {
  public id: string

  private channel: ChannelWrapper
  private _sender: AmqpSender
  private _receiver: AmqpReceiver
  private _eventBus: EventBus

  get sender() {
    return this._sender
  }

  get receiver() {
    return this._receiver
  }

  get eventBus() {
    return this._eventBus
  }

  constructor(private connectionManager: AmqpConnectionManager) {
    this.id = uuid().replace(/-/g, '')

    this.channel = connectionManager.createChannel({
      json: false
    })

    this._sender = new AmqpSender(this.channel)
    this._receiver = new AmqpReceiver(this.channel)
    this._eventBus = new EventBus(this._sender, 'domainEvents')
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
