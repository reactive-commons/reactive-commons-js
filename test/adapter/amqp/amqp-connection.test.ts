import { AmqpConnectionManager } from 'amqp-connection-manager'
import { AmqpConnection, AmqpReceiver, AmqpSender } from '../../../src'
import { EventBus } from '../../../src/domain/api/emitters/event-bus'

jest.mock('../../../src/domain/api/emitters/event-bus')
jest.mock('../../../src/adapter/amqp/amqp-sender')
jest.mock('../../../src/adapter/amqp/amqp-receiver')


describe(`AMQP connection`, () => {
  let createChannelMock
  let connectionManager: AmqpConnectionManager
  let onMock: jest.MockedFunction<typeof connectionManager.on>
  let connection: AmqpConnection

  beforeEach(() => {
    createChannelMock = jest.fn()
    onMock = jest.fn()
    connectionManager = ({
      createChannel: createChannelMock,
      on: onMock
    } as object) as AmqpConnectionManager
    connection = new AmqpConnection(connectionManager)
  })

  it(`creates AmqpSender instance`, () => {
    const sender = connection.sender

    expect(sender).toBeInstanceOf(AmqpSender)
  })

  it(`creates AmqpReceiver instance`, () => {
    const receiver = connection.receiver

    expect(receiver).toBeInstanceOf(AmqpReceiver)
  })

  it(`creates EventBus instance`, () => {
    const receiver = connection.eventBus

    expect(receiver).toBeInstanceOf(EventBus)
  })

  it(`calls onConnect callback when connectionManager emits it`, () => {
    const url = 'amqp://myrabbitserver'

    const onConnect = jest.fn()
    connection.onConnect(onConnect)

    const listener = onMock.mock.calls[0][1] as (arg: object) => void
    listener({ url })

    expect(onMock.mock.calls[0][0]).toBe('connect')
    expect(onConnect.mock.calls[0][0]).toStrictEqual({ host: 'myrabbitserver' })
  })

  it(`calls onDisconnect callback when connectionManager emits it`, () => {
    const error = Error('something went wrong')

    const onDisconnect = jest.fn()
    connection.onDisconnect(onDisconnect)

    const listener = onMock.mock.calls[0][1]
    listener({ err: error })

    expect(onMock.mock.calls[0][0]).toBe('disconnect')
    expect(onDisconnect.mock.calls[0][0]).toBe(error)
  })
})
