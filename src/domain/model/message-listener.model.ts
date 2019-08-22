export interface MessageListener {
  startListening(): Promise<void>
  setupResources(): Promise<void>
}
