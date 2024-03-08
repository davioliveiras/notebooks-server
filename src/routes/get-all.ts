import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function getAll(app: FastifyInstance){

  app.get('/notebook', async (request, reply) => {

    await request.jwtVerify()

    // const paramsSchema = z.object({
    //   id: z.string()
    // })

    // const { id } = paramsSchema.parse(request.params)

    const notebooks = await prisma.notebook.findMany({
      orderBy: {code: 'asc'},
      where: {
        userId: request.user.sub        
      },
      include:{
        photos:{
          select:{
            path: true
          }
        },
        brand: {
          select:{
            name: true
          }
        },
        system: {
          select:{
            name: true
          }
        },
        processor:{
          select:{
            clock: true,
            model: true,
            brand: true
          }
        },
        graphics_card:{
          select:{
            model: true,
            brand: true
          }
        }
      }
    })

    if(notebooks.length == 0)
      return reply.send('No notebooks')

    return reply.send(notebooks)
  })
}
