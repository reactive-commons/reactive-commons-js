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

export interface Headers {
  [name: string]: string
}

export interface Properties {
  contentType?: string
  contentEncoding?: string
  headers: Headers
  correlationId?: string
  replyTo?: string
  messageId?: string
  timestamp?: number
  type?: string
  userId?: string
  appId?: string
}

export class Message<T> {
  constructor(public data: T, public properties: Properties = { headers: {} }) {}
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
