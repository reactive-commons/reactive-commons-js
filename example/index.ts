import { AmqpBroker, HandlerRegistry, createEvent, ReactiveCommons } from '../src/'

const broker = new AmqpBroker('amqp://user:MxWKtXejdv62tB8w@dev.rabbitmq.hibot.us/local')
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
  .then(connection => {
    connection.onConnect(() => console.log('Connection stablished'))
    connection.onDisconnect(err => console.error(err))

    const appCreated = createEvent<string>('myInstance.appCreated')
    connection.eventBus
      .emit(appCreated('133', 'myApp'))
      .then(() => console.log('this will succeed'))
      .catch(err => console.error(err))
  })
  .catch(err => console.error('Error initializing app', err))
