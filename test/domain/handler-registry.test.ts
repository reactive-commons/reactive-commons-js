import { HandlerRegistry, Command, Query, Event } from '../../src'

describe(`Handler registry`, () => {
  it(`creates a valid instance using register`, () => {
    const result = HandlerRegistry.register()

    expect(result).toBeInstanceOf(HandlerRegistry)
  })

  it(`registers a command handler correctly`, () => {
    const registry = HandlerRegistry.register()

    const commandName = 'myContext.command'
    const handler = (m: Command<string>) => Promise.resolve()

    registry.handleCommand(commandName, handler)

    expect(registry.commandHandlers[commandName]).toBe(handler)
    expect(registry.getCommandHandler(commandName)).toBe(handler)
  })

  it(`registers a query handler correctly`, () => {
    const registry = HandlerRegistry.register()

    const queryName = 'myContext.query'
    const handler = (m: Query<string>) => Promise.resolve('result')

    registry.serveQuery(queryName, handler)

    expect(registry.queryHandlers[queryName]).toBe(handler)
    expect(registry.getQueryHandler(queryName)).toStrictEqual(handler)
  })

  it(`registers a event listener correctly`, () => {
    const registry = HandlerRegistry.register()

    const eventName = 'myContext.event'
    const handler = (m: Event<string>) => Promise.resolve()

    registry.listenEvent(eventName, handler)

    expect(registry.eventListeners[eventName][0]).toBe(handler)
    expect(registry.getEventListeners(eventName)).toStrictEqual([handler])
  })

  it(`registers two event listeners with the same name`, () => {
    const registry = HandlerRegistry.register()

    const eventName = 'myContext.event'
    const handler1 = (m: Event<string>) => Promise.resolve()
    const handler2 = (m: Event<string>) => Promise.resolve()

    registry.listenEvent(eventName, handler1)
    registry.listenEvent(eventName, handler2)

    expect(registry.eventListeners[eventName]).toStrictEqual([handler1, handler2])
    expect(registry.getEventListeners(eventName)).toStrictEqual([handler1, handler2])
  })

  it(`emits event registered event`, () => {
    const registry = HandlerRegistry.register()
    const eventListenerPushed = jest.fn()

    const eventName = 'myContext.event'
    const handler = (m: Event<string>) => Promise.resolve()

    registry.onEventListenerPushed(eventListenerPushed)
    registry.listenEvent(eventName, handler)

    expect(eventListenerPushed).toBeCalledTimes(1)
  })

  it(`returns undefined if there is no commands registered with that path`, () => {
    const registry = HandlerRegistry.register()

    expect(registry.getCommandHandler('no.existent')).toBeUndefined()
  })

  it(`returns undefined if there is no queries registered with that path`, () => {
    const registry = HandlerRegistry.register()

    expect(registry.getQueryHandler('no.existent')).toBeUndefined()
  })

  it(`returns an empty array if there is no events registered with that path`, () => {
    const registry = HandlerRegistry.register()

    expect(registry.getEventListeners('no.existent')).toStrictEqual([])
  })

  it(`throws error when command handler already registered`, () => {
    const registry = HandlerRegistry.register()

    const commandName = 'myContext.command'
    const handler = (m: Command<string>) => Promise.resolve()

    registry.handleCommand(commandName, handler)

    expect(() => registry.handleCommand(commandName, handler)).toThrow(
      'Command myContext.command already registered'
    )
  })

  it(`throws error when query handler already registered`, () => {
    const registry = HandlerRegistry.register()

    const queryName = 'myContext.query'
    const handler = (m: Query<string>) => Promise.resolve('result')

    registry.serveQuery(queryName, handler)

    expect(() => registry.serveQuery(queryName, handler)).toThrow(
      'Query myContext.query already registered'
    )
  })
})
