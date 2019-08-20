import { AmqpBroker, HandlerRegistry, createEvent, ReactiveCommons } from '../src/'

const broker = new AmqpBroker('amqp://user:MxWKtXejdv62tB8w@dev.rabbitmq.hibot.us/local')
const registry = HandlerRegistry.register()
const app = new ReactiveCommons(broker, registry, {
  appName: 'microTest'
})

registry.listenEvent<string>('myInstance.appCreated', event => {
  console.log(`Evento recibido: ${event.data}`)
  return Promise.resolve()
})

registry.serverQuery<string, string>('cosa.traeme', request => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('holiii ' + request.queryData), 0)
  })
})

app
  .start()
  .then(connection => {
    connection.onConnect(() => console.log('Nos conectamos mi pana'))
    connection.onDisconnect(err => console.error(err))

    const appCreated = createEvent<string>('myInstance.appCreated')
    connection.eventBus
      .emit(appCreated('133', 'holi'))
      .then(() => console.log('this will succeed'))
      .catch(err => console.error(err))
  })
  .catch(err => console.error(`Esto se puteó`, err))
