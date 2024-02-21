import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { clientAmazon } from '../lib/s3'
import { z } from 'zod'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3'
import { deleteImages } from '../lib/delete-images'

export async function deleteNotebook(app: FastifyInstance) {
  app.delete('/notebook/:id', async (request, reply) => {

    await request.jwtVerify()

    const paramsSchema = z.object({
      id: z.string()
    })

    const { id } = paramsSchema.parse(request.params)
    const idConverted = parseInt(id)

    const notebook = await prisma.notebook.findUnique({
      where: {
        id: idConverted
      },
      include: {
        photos: true
      }
    })

    if(!notebook)
      return reply.send('Notebook doesn\'t exist')

    const paths = notebook?.photos

    let pathArray: string[] = []

    paths?.forEach((item) => {
      pathArray.push(item.path)
    })

    await deleteImages(pathArray)
    
    await prisma.notebook.delete({
      where:{
        id: idConverted
      }
    })

    await prisma.photo.deleteMany({
      where:{
        notebookId: idConverted
      }
    })
    
    reply.send('Deleted')
  })
}
