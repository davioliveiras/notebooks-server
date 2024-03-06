import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function getById(app:FastifyInstance) {
  app.get('/notebook/:id', async (request, reply) => {

    await request.jwtVerify()
    
    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const idConverted = parseInt(id)

    const note = await prisma.notebook.findFirst({
      where:{
        code: idConverted,
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

    if(!note){
      reply.status(400).send('Notebook não encontrado')
      return
    }

    reply.send(note)
  })
}
