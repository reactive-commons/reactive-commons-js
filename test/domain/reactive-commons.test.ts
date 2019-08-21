import { ReactiveCommons, HandlerRegistry } from '../../src'
import { QueryListener } from '../../src/domain/api/listeners/query-listener'
import { EventListener } from '../../src/domain/api/listeners/event-listener'

jest.mock('../../src/domain/api/listeners/query-listener')
jest.mock('../../src/domain/api/listeners/event-listener')

describe(`Reactive commons`, () => {
  it(`instantiate listeners and connection on start`, async () => {
    const broker = {
      connect: jest.fn()
    }
    const registry = {} as HandlerRegistry
    const config = {
      appName: 'myApp'
    }

    const app = new ReactiveCommons(broker, registry, config)
    await app.start()

    const EventListenerMock = EventListener as jest.MockedFunction<any>
    const QueryListenerMock = QueryListener as jest.MockedFunction<any>
    const queryListenerInstance = QueryListenerMock.mock.instances[0]
    const eventListenerInstance = EventListenerMock.mock.instances[0]

    expect(broker.connect).toBeCalledTimes(1)
    expect(QueryListener).toBeCalledTimes(1)
    expect(EventListener).toBeCalledTimes(1)

    expect(EventListenerMock.mock.calls[0][0]).toStrictEqual({
      appName: 'myApp'
    })

    expect(queryListenerInstance.setupResources).toBeCalledTimes(1)
    expect(eventListenerInstance.setupResources).toBeCalledTimes(1)
    expect(queryListenerInstance.startListening).toBeCalledTimes(1)
    expect(eventListenerInstance.startListening).toBeCalledTimes(1)
  })
})
