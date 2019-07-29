import {
  Command,
  createCommand,
  Query,
  createQuery,
  Event,
  createEvent
} from '../src/reactive-commons'

describe(`Message factory`, () => {
  it(`builds valid command instances`, () => {
    const expected = {
      id: '123',
      name: 'microservice.executeTask',
      data: 'withThisParam'
    }

    const creator = createCommand('microservice.executeTask')
    const result = creator('123', 'withThisParam')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Command)
  })

  it(`builds valid query instances`, () => {
    const expected = {
      id: '123',
      name: 'microservice.fetchSomething',
      data: 'withThisParam'
    }

    const creator = createQuery('microservice.fetchSomething')
    const result = creator('123', 'withThisParam')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Query)
  })

  it(`builds valid query instances`, () => {
    const expected = {
      id: '123',
      name: 'microservice.somethingHappened',
      data: 'withThisData'
    }

    const creator = createEvent('microservice.somethingHappened')
    const result = creator('123', 'withThisData')

    expect(result).toMatchObject(expected)
    expect(result).toBeInstanceOf(Event)
  })
})
