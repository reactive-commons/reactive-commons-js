import { ChannelWrapper } from 'amqp-connection-manager'
import { ConfirmChannel } from 'amqplib'
import {
  BindingSpecification,
  createEvent,
  QueueSpecitication,
  TopicSpecification
} from '../../src'
import { AmqpSender } from '../../src/adapter/amqp/amqp-sender'
import { Message } from '../../src/domain/model/broker.model'

const queueName = 'myQueue'
const topicName = 'mytopic'
const routingKey = 'myRoutingKey'

describe(`AMQP sender`, () => {
  let addSetupMock: jest.MockedFunction<
    (func: (channel: ConfirmChannel) => Promise<void>) => Promise<void>
  >
  let publishMock: jest.MockedFunction<
    (exchange: string, routingKey: string, content: Buffer) => Promise<void>
  >
  let channelWrapper: ChannelWrapper
  let sender: AmqpSender

  beforeEach(() => {
    jest.clearAllMocks()
    addSetupMock = jest.fn(func => Promise.resolve())
    publishMock = jest.fn((exchange, routingKey, content) => Promise.resolve())
    channelWrapper = ({ addSetup: addSetupMock, publish: publishMock } as any) as ChannelWrapper
    sender = new AmqpSender(channelWrapper)
  })

  it(`declares a queue`, async () => {
    const queue: QueueSpecitication = {
      name: queueName,
      exclusive: true
    }

    const assertQueueMock = jest.fn((name, options) => undefined)
    const channel = ({ assertQueue: assertQueueMock } as any) as ConfirmChannel

    await sender.declareQueue(queue)
    await addSetupMock.mock.calls[0][0](channel)

    expect(assertQueueMock.mock.calls[0][0]).toBe(queueName)
    expect(assertQueueMock.mock.calls[0][1]).toStrictEqual({
      exclusive: true
    })
  })

  it(`declares a topic`, async () => {
    const topic: TopicSpecification = {
      name: topicName,
      type: 'direct'
    }

    const assertExchangeMock = jest.fn((name, type) => undefined)
    const channel = ({ assertExchange: assertExchangeMock } as any) as ConfirmChannel

    await sender.declareTopic(topic)
    await addSetupMock.mock.calls[0][0](channel)

    expect(assertExchangeMock.mock.calls[0][0]).toBe(topicName)
    expect(assertExchangeMock.mock.calls[0][1]).toBe(topic.type)
  })

  it(`do a binding`, async () => {
    const binding: BindingSpecification = {
      queue: queueName,
      topic: topicName,
      routingKey: routingKey
    }

    const bindQueueMock = jest.fn((queue, topic, routingKey) => undefined)
    const channel = ({ bindQueue: bindQueueMock } as any) as ConfirmChannel

    await sender.bind(binding)
    await addSetupMock.mock.calls[0][0](channel)

    expect(bindQueueMock.mock.calls[0][0]).toBe(queueName)
    expect(bindQueueMock.mock.calls[0][1]).toEqual(topicName)
    expect(bindQueueMock.mock.calls[0][2]).toEqual(routingKey)
  })

  it(`publish serialized messages`, async () => {
    const creator = createEvent('myContext.somethingHappened')
    const event = creator('123', 'withThisData')
    const serialized = Buffer.from(
      '{"eventId":"123","name":"myContext.somethingHappened","data":"withThisData"}'
    )
    const message = new Message(event)

    await sender.publish(topicName, routingKey, message)

    expect(publishMock.mock.calls[0][0]).toBe(topicName)
    expect(publishMock.mock.calls[0][1]).toBe(routingKey)
    expect(publishMock.mock.calls[0][2]).toStrictEqual(serialized)
  })
})
