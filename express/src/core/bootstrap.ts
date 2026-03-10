import Application from 'src/core/app'
import express from 'express'

export const expressApp = express()

export const app = new Application(expressApp)