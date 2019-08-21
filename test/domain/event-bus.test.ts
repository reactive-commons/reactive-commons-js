import { EventBus } from '../../src/domain/api/emitters/event-bus'
import { BrokerSender, Message } from '../../src/domain/model/broker.model'

describe(`event bus`, () => {
  it(`publishes events on passed topic`, async () => {
    const topicName = 'myTopic'
    const sender = ({
      publish: jest.fn()
    } as any) as BrokerSender

    const mockedPublish = sender.publish as jest.MockedFunction<typeof sender.publish>

    const event = {
      eventId: '123',
      name: 'foo',
      data: 'bar'
    }

    const message = new Message(event, {})

    const eventBus = new EventBus(sender, topicName)

    await eventBus.emit(event)

    expect(sender.publish).toBeCalledTimes(1)
    expect(mockedPublish.mock.calls[0][0]).toBe(topicName)
    expect(mockedPublish.mock.calls[0][1]).toBe(event.name)
    expect(mockedPublish.mock.calls[0][2]).toStrictEqual(message)
  })
})
