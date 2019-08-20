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

    expect(registry.commandHandlers[commandName][0]).toBe(handler)
  })

  it(`registers two command handlers with the same name`, () => {
    const registry = HandlerRegistry.register()

    const commandName = 'myContext.command'
    const handler1 = (m: Command<string>) => Promise.resolve()
    const handler2 = (m: Command<string>) => Promise.resolve()

    registry.handleCommand(commandName, handler1)
    registry.handleCommand(commandName, handler2)

    expect(registry.commandHandlers[commandName]).toStrictEqual([handler1, handler2])
  })

  it(`registers a query handler correctly`, () => {
    const registry = HandlerRegistry.register()

    const queryName = 'myContext.query'
    const handler = (m: Query<string>) => Promise.resolve('result')

    registry.serverQuery(queryName, handler)

    expect(registry.queryHandlers[queryName][0]).toBe(handler)
  })

  it(`registers a event listener correctly`, () => {
    const registry = HandlerRegistry.register()

    const eventName = 'myContext.event'
    const handler = (m: Event<string>) => Promise.resolve()

    registry.listenEvent(eventName, handler)

    expect(registry.eventListeners[eventName][0]).toBe(handler)
  })
})
