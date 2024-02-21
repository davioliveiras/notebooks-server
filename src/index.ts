import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import jwt from '@fastify/jwt'
import fastifyExpress from '@fastify/express'
import { insert } from './routes/insert'
import { getAll } from './routes/get-all'
import { deleteNotebook } from './routes/delete'
import { getById } from './routes/get-by-id'
import { auth } from './routes/auth'
import { expressApp } from './routes/upload-images'
import { update } from './routes/update'

const port = 3333
const app = fastify()
const cors = ['http://192.168.15.50:5173', 'http://localhost:5173']

app.register(fastifyCors, {origin: cors})
app.register(jwt, {
  secret: 'secretgarden'
})
app.register(fastifyExpress).after(() => {
  app.use(expressApp) // images upload
})

app.register(insert)
app.register(getAll)
app.register(deleteNotebook)
app.register(getById)
app.register(auth)
app.register(update)

app.listen({ port: port, host: '0.0.0.0'}, () => {
  console.log('server => http://192.168.15.50:3333')
})
