export interface QueueSpecitication {
  name: string
  exclusive?: boolean
}

export interface TopicSpecification {
  name: string
  type: 'direct' | 'topic'
}

export interface BindingSpecification {
  queue: string
  topic: string
  routingKey: string
}
