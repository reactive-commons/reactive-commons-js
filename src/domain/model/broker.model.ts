export interface QueueSpecitication {
  name: string
  exclusive: boolean
}

export interface ExchangeSpecification {
  name: string
}

export interface BindingSpecification {
  queue: string
  topic: string
  routingKey: string
}

export interface Connection {
  onConnect(listener: (event: { host: string }) => void): void
  onDisconnect(listener: (err: Error) => void): void
}

export type MessageConsumer = (messageContent: object) => Promise<void>

export interface BrokerSender {
  declareQueue(specification: QueueSpecitication): Promise<void>

  declareTopic(specification: ExchangeSpecification): Promise<void>

  bind(specification: BindingSpecification): Promise<void>
}

export interface BrokerReceiver {
  consume(queueName: string, consumer: MessageConsumer): Promise<void>
}

export interface Broker {
  connect(): Connection
  getSender(): BrokerSender
  getReceiver(): BrokerReceiver
}
