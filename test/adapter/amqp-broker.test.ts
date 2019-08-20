import { connect } from 'amqp-connection-manager'
import { ConnectionOptions } from 'tls'
import { AmqpBroker } from '../../src'
import { AmqpConnection } from '../../src/adapter/amqp/amqp-connection'

jest.mock('amqp-connection-manager')
jest.mock('../../src/adapter/amqp/amqp-connection')

const url = 'amqp://myrabbitserver'
const options: ConnectionOptions = { timeout: 10 }

describe(`AMQP Broker`, () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it(`connects using connection manager`, () => {
    const connectMock = connect as jest.MockedFunction<typeof connect>

    const broker = new AmqpBroker(url, options)
    const connection = broker.connect()

    expect(connectMock).toHaveBeenCalledTimes(1)
    expect(connectMock.mock.calls[0][0]).toStrictEqual([url])
    expect(connectMock.mock.calls[0][1]).toStrictEqual({ connectionOptions: options })

    expect(connection).toBeInstanceOf(AmqpConnection)
  })
})
