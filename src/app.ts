import express, { Express } from 'express'
import { ChattyServer } from './setupServer'
import databaseConnection from './setupDb'
import { config } from './config'

class Application {
  public initialize(): void {
    this.loadConfig()
    databaseConnection()
    const app: Express = express()
    const server: ChattyServer = new ChattyServer(app)
    server.start()
  }
  private loadConfig(): void {
    config.validateConfig()
    config.cloudinaryConfig()
  }
}

const application: Application = new Application()
application.initialize()
