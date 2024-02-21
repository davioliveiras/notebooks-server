import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function auth(app: FastifyInstance){

  const data = z.object({
    user: z.object({
      displayName: z.string(),
      photoURL: z.string(),
      uid: z.string()
    })
  })

  app.post('/auth', async (request, reply) => {
    const { user } = data.parse(request.body)

    const token = app.jwt.sign({
      name: user.displayName,
      photo: user.photoURL
    }, {
      sub: user.uid,
      expiresIn: '1 day'
    })

    const userRegistered = await prisma.user.findUnique({
      where: {
        id: user.uid
      }
    })

    if(!userRegistered){
      await prisma.user.create({
        data:{
          id: user.uid,
          name: user.displayName
        }
      })
    }
    
    reply.send(token)
  })
}
