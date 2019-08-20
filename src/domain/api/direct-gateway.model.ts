import { Command } from '../..'
import { Query } from '../model/messages.model'

export interface DirectGateway {
  sendCommand<T>(command: Command<T>): Promise<void>
  requestReply<T, R>(query: Query<T>): Promise<R>
}
