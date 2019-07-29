import { MessageCreator } from './model/message-creator.model'
import { Command, Query, Event } from './model/messages.model'

export function createCommand<T>(name: string): MessageCreator<Command<T>, T> {
  return (id: string, data: T) => new Command(id, name, data)
}

export function createQuery<T>(name: string): MessageCreator<Query<T>, T> {
  return (id: string, data: T) => new Query(id, name, data)
}

export function createEvent<T>(name: string): MessageCreator<Event<T>, T> {
  return (id: string, data: T) => new Event(id, name, data)
}
