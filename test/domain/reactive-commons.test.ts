import { HandlerRegistry, ReactiveCommons } from '../../src'
import { EventListener } from '../../src/domain/api/listeners/event-listener'
import { QueryListener } from '../../src/domain/api/listeners/query-listener'
import { Connection } from '../../src/domain/model/broker.model'

jest.mock('../../src/domain/api/listeners/query-listener')
jest.mock('../../src/domain/api/listeners/event-listener')
jest.mock('../../src/domain/api/listeners/command-listener')
jest.mock('../../src/domain/api/listeners/reply-listener')
jest.mock('../../src/domain/api/reactive-commons-context')

describe(`Reactive commons`, () => {
  it(`instantiate listeners and connection on start`, async () => {
    const connectionId = '123'
    const broker = {
      connect: jest.fn(
        () =>
          (({
            id: connectionId
          } as any) as Connection)
      )
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
