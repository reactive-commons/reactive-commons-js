import { AmqpBroker, HandlerRegistry, createEvent, ReactiveCommons } from '../src/'

const broker = new AmqpBroker('amqp://localhost')
const registry = HandlerRegistry.register()
const app = new ReactiveCommons(broker, registry, {
  appName: 'microTest'
})

registry.listenEvent<string>('myInstance.appCreated', event => {
  console.log(`Event received: ${event.data}`)
  return Promise.resolve()
})

registry.serveQuery<string, string>('cosa.traeme', request => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('hi ' + request.queryData), 0)
  })
})

app
  .start()
  .then(context => {
    context.connection.onConnect(() => console.log('Connection stablished'))
    context.connection.onDisconnect(err => console.error(err))

    const appCreated = createEvent<string>('myInstance.appCreated')
    context.eventBus
      .emit(appCreated('133', 'myApp'))
      .then(() => console.log('this will succeed'))
      .catch(err => console.error(err))
  })
  .catch(err => console.error('Error initializing app', err))
