import { ChannelWrapper } from 'amqp-connection-manager'

import { AmqpReceiver } from '../../src/adapter/amqp/amqp-receiver'
import { ConfirmChannel, ConsumeMessage, Message } from 'amqplib'

const queueName = 'myQueue'
const messageContent = Buffer.from('{"foo": "bar"}', 'utf8')

describe(`AMQP receiver`, () => {
  let addSetupMock: jest.MockedFunction<
    (func: (channel: ConfirmChannel) => Promise<void>) => Promise<void>
  >
  let channelWrapper: ChannelWrapper
  let consumeMock: jest.MockedFunction<
    (queue: string, onMessage: (msg: ConsumeMessage | null) => any) => Promise<void>
  >
  let receiver: AmqpReceiver

  beforeEach(() => {
    jest.clearAllMocks()
    addSetupMock = jest.fn(func => Promise.resolve())
    channelWrapper = ({ addSetup: addSetupMock } as any) as ChannelWrapper
    consumeMock = jest.fn((queue, onMessage) => Promise.resolve())
    receiver = new AmqpReceiver(channelWrapper)
  })

  it(`it consumes the passed queue and ack them`, async () => {
    const ackMock = jest.fn(message => undefined)
    const channel = ({ consume: consumeMock, ack: ackMock } as any) as ConfirmChannel
    const consumer = jest.fn(messageContent => Promise.resolve())
    const message = ({
      content: messageContent
    } as any) as ConsumeMessage

    await receiver.consume(queueName, consumer)
    await addSetupMock.mock.calls[0][0](channel)
    consumeMock.mock.calls[0][1](message)

    expect(consumeMock.mock.calls[0][0]).toBe(queueName)
  })

  it(`it catches errors and nack the message`, async () => {
    const nackMock = jest.fn(message => undefined)
    const channel = ({ consume: consumeMock, nack: nackMock } as any) as ConfirmChannel
    const consumer = jest.fn(messageContent => Promise.reject(Error('something wrong happened')))
    const message = ({
      content: messageContent
    } as any) as ConsumeMessage

    await receiver.consume(queueName, consumer)
    await addSetupMock.mock.calls[0][0](channel)
    consumeMock.mock.calls[0][1](message)

    expect(consumeMock.mock.calls[0][0]).toBe(queueName)
  })

  it(`it ignores null messages`, async () => {
    const channel = ({ consume: consumeMock } as any) as ConfirmChannel
    const consumer = jest.fn()
    const message = null

    await receiver.consume(queueName, consumer)
    await addSetupMock.mock.calls[0][0](channel)
    consumeMock.mock.calls[0][1](message)

    expect(consumeMock.mock.calls[0][0]).toBe(queueName)
    expect(consumer).toBeCalledTimes(0)
  })
})
