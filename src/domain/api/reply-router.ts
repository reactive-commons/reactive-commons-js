import { Message } from '../..'

export class ReplyRouter {
  private routes: {
    [correlationId: string]: Function
  } = {}

  register<R>(correlationId: string): Promise<R> {
    return this.withTimeout<R>(
      new Promise<R>(resolve => {
        this.routes[correlationId] = resolve
      })
    )
  }

  withTimeout<T>(promise: Promise<T>, ms: number = 15000): Promise<T> {
    const timeout = new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id)
        reject('Timed out in ' + ms + 'ms.')
      }, ms)
    })

    return Promise.race([promise, timeout])
  }

  routeReply(correlationId: string, message: Message<any>) {
    const callback = this.routes[correlationId]
    delete this.routes[correlationId]

    if (callback) {
      callback(message.data)
    }
  }
}
