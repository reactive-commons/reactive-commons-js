import { Message } from './messages.model'

export type MessageCreator<R extends Message<T>, T> = (id: string, data: T) => R
