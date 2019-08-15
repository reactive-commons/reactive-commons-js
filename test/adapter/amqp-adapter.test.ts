import { connect, AmqpConnectionManager, ChannelWrapper } from 'amqp-connection-manager'
import { ConnectionOptions } from 'tls'

import { AmqpBroker } from '../../src/adapter/amqp/amqp-adapter'
import { AmqpSender } from '../../src/adapter/amqp/amqp-sender'
import { AmqpReceiver } from '../../src/adapter/amqp/amqp-receiver'

jest.mock('amqp-connection-manager', () => ({
  _esModule: true,
  connect: jest.fn(() => ({
    createChannel: jest.fn(),
    on: jest.fn()
  }))
}))

const mockedConnect = connect as jest.MockedFunction<typeof connect>
const url = 'amqp://myrabbitserver'
const options: ConnectionOptions = { timeout: 10 }

describe(`AMQP Broker`, () => {
  let broker: AmqpBroker

  beforeEach(() => {
    jest.clearAllMocks()
    broker = new AmqpBroker(url, options)
  })

  it(`connects using connection manager`, () => {
    broker.connect()

    const connectionManager = mockedConnect.mock.results[0].value as AmqpConnectionManager

    expect(mockedConnect).toHaveBeenCalledTimes(1)
    expect(mockedConnect.mock.calls[0][0]).toStrictEqual([url])
    expect(mockedConnect.mock.calls[0][1]).toStrictEqual({ connectionOptions: options })
    expect(broker.connectionManager).toBe(connectionManager)

    const mockedChannel = connectionManager.createChannel as jest.MockedFunction<
      typeof connectionManager.createChannel
    >

    expect(mockedChannel).toHaveBeenCalledTimes(1)
    expect(mockedChannel.mock.calls[0][0]).toStrictEqual({ json: true })
  })

  it(`connect can only be called once`, () => {
    broker.connect()
    expect(() => broker.connect()).toThrow('AMQP connection already created')
  })

  it(`must create an instance of AmqpSender`, () => {
    broker.connect()

    expect(broker.getSender()).toBeInstanceOf(AmqpSender)
  })

  it(`must create an instance of AmqpReceiver`, () => {
    broker.connect()

    expect(broker.getReceiver()).toBeInstanceOf(AmqpReceiver)
  })

  it(`AmqpSender can only be accessed after connect`, () => {
    expect(() => broker.getSender()).toThrow(
      'AMQP sender must be accessed after connection creation'
    )
  })

  it(`AmqpReceiver can only be accessed after connect`, () => {
    expect(() => broker.getReceiver()).toThrow(
      'AMQP receiver must be accessed after connection creation'
    )
  })

  it(`should call onConnect callback when connectionManager emits it`, () => {
    const connection = broker.connect()
    const connectionManager = mockedConnect.mock.results[0].value as AmqpConnectionManager
    const mockedOn = connectionManager.on as jest.MockedFunction<typeof connectionManager.on>

    const onConnect = jest.fn()
    connection.onConnect(onConnect)

    const listener = mockedOn.mock.calls[0][1] as (arg: object) => void
    listener({ url })

    expect(mockedOn.mock.calls[0][0]).toBe('connect')
    expect(onConnect.mock.calls[0][0]).toStrictEqual({ host: 'myrabbitserver' })
  })

  it(`should call onDisconnect callback when connectionManager emits it`, () => {
    const connection = broker.connect()
    const connectionManager = mockedConnect.mock.results[0].value as AmqpConnectionManager
    const mockedOn = connectionManager.on as jest.MockedFunction<typeof connectionManager.on>
    const error = Error('something went wrong')

    const onDisconnect = jest.fn()
    connection.onDisconnect(onDisconnect)

    const listener = mockedOn.mock.calls[0][1]
    listener({ err: error })

    expect(mockedOn.mock.calls[0][0]).toBe('disconnect')
    expect(onDisconnect.mock.calls[0][0]).toBe(error)
  })
})
