export class Message<T> {
  id: string
  name: string
  data: T

  constructor(id: string, name: string, data: T) {
    this.id = id
    this.name = name
    this.data = data
  }
}

export class Command<T> extends Message<T> {}

export class Query<T> extends Message<T> {}

export class Event<T> extends Message<T> {}
