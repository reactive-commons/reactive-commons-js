import { Connection } from '../model/broker.model'
import { DirectGateway } from './emitters/direct-gateway'
import { EventBus } from './emitters/event-bus'
import { ReactiveCommonsConfiguration } from './reactive-commons'

export class ReactiveCommonsContext {
  public id: string
  public eventBus: EventBus
  public directGateway: DirectGateway

  constructor(config: ReactiveCommonsConfiguration, public connection: Connection) {
    this.id = connection.id
    this.eventBus = new EventBus(config, connection.sender, 'domainEvents')
    this.directGateway = new DirectGateway(config, connection.sender, 'directMessages')
  }
}
