import { BindingSpecification, QueueSpecitication, TopicSpecification } from './resources.model'
import { EventBus } from '../api/emitters/event-bus'

export interface Connection {
  id: string
  sender: BrokerSender
  receiver: BrokerReceiver

  onConnect(listener: (event: { host: string }) => void): void
  onDisconnect(listener: (err: Error) => void): void
}

export type MessageConsumer<T> = (messageContent: Message<T>) => Promise<void>

export type Headers = {
  [name: string]: string
}

export class Message<T> {
  constructor(public data: T, public headers: Headers = {}) {}
}

export interface BrokerSender {
  declareQueue(specification: QueueSpecitication): Promise<void>

  declareTopic(specification: TopicSpecification): Promise<void>

  bind(specification: BindingSpecification): Promise<void>

  publish<T>(topic: string, routingKey: string, message: Message<T>): Promise<void>
}

export interface BrokerReceiver {
  consume<T>(queueName: string, consumer: MessageConsumer<T>): Promise<void>
}

export interface Broker {
  connect(): Connection
}
