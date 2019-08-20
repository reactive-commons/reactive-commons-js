export class Command<T> {
  constructor(public commandId: string, public name: string, public data: T) {}
}

export class Query<T> {
  constructor(public queryId: string, public resource: string, public queryData: T) {}
}

export class Event<T> {
  constructor(public eventId: string, public name: string, public data: T) {}
}
