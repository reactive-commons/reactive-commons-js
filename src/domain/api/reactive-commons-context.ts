import { Connection } from '../model/broker.model'
import { DirectGateway } from './emitters/direct-gateway'
import { EventBus } from './emitters/event-bus'

export class ReactiveCommonsContext {
  public id: string
  public eventBus: EventBus
  public directGateway: DirectGateway

  constructor(public connection: Connection) {
    this.id = connection.id
    this.eventBus = new EventBus(connection.sender, 'domainEvents')
    this.directGateway = new DirectGateway(connection.sender, 'directMessages')
  }
}
