import { Command, createCommand, Query, createQuery, Event, createEvent } from '../../src'

describe(`Message factory`, () => {
  it(`builds valid command instances`, () => {
    const expected: Command<string> = {
      commandId: '123',
      name: 'myContext.executeTask',
      data: 'withThisParam'
    }

    const creator = createCommand('myContext.executeTask')
    const result = creator('123', 'withThisParam')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Command)
  })

  it(`builds valid query instances`, () => {
    const expected: Query<string> = {
      queryId: '123',
      resource: 'myContext.fetchSomething',
      queryData: 'withThisParam'
    }

    const creator = createQuery('myContext.fetchSomething')
    const result = creator('123', 'withThisParam')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Query)
  })

  it(`builds valid event instances`, () => {
    const expected: Event<string> = {
      eventId: '123',
      name: 'myContext.somethingHappened',
      data: 'withThisData'
    }

    const creator = createEvent('myContext.somethingHappened')
    const result = creator('123', 'withThisData')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Event)
  })
})
