import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { deleteImages } from '../lib/delete-images'
import VerifyTables from '../lib/verify-tables'

export async function update(app: FastifyInstance){
  app.put('/notebook', async (request, reply) =>{
    request.jwtVerify()
    
    const bodySchema = z.object({
      id: z.number(),
      // code: z.number(),
      ram: z.number(),
      ddr: z.number(),
      hd: z.number().optional().nullable(),
      ssd: z.number().optional().nullable(),
      model: z.string(),
      note: z.string().optional().nullable(),
      resolution: z.string(),
      inch: z.number().optional().nullable(),
      hertz: z.number(),
      touch: z.boolean(),
      system_version: z.string(),

      processor: z.object({
        model: z.string(),
        clock: z.number(),
        brand: z.object({
          name: z.string()
        }),
      }),

      system: z.object({
        name: z.string(),
      }),

      brand: z.object({
        name: z.string()
      }),

      graphics_card: z.object({
        model: z.string(),
        brand: z.object({
          name: z.string()
        }),
      }).nullable(),
      
      photos: z.array(z.string())
    })

    const notebook = bodySchema.parse(request.body)

    const noteExists = await prisma.notebook.findUnique({
      where: {
        id: notebook.id
      }
    })

    if(!noteExists)
      return reply.send('Notebook doesn\'t exist')

    const tables = await VerifyTables(notebook.brand, notebook.system, notebook.processor, notebook.graphics_card)

    await prisma.notebook.update({
      where: {
        id: notebook.id
      },
      data: {
        ram: notebook.ram,
        ddr: notebook.ddr,
        hd: notebook.hd,
        ssd: notebook.ssd,       
        model: notebook.model,
        note: notebook.note,
        resolution: notebook.resolution,
        inch: notebook.inch,
        hertz: notebook.hertz,
        touch: notebook.touch,
        system_version: notebook.system_version,

        processorId: tables.processorId,
        systemId: tables.systemId,        
        brandId: tables.brandId,
        graphics_CardId: tables.cardId
      },
    })
    
    if(notebook.photos[0] != ''){

      const photos = await prisma.photo.findMany({
        where: {
          notebookId: notebook.id
        }
      })

      let photoArray: string[] = []

      photos.forEach((item) => {
        photoArray.push(item.path)
      })

      await deleteImages(photoArray)

      await prisma.photo.deleteMany({
        where: {
          notebookId: notebook.id
        }
      })

      notebook.photos.forEach(async (photo) => {
        await prisma.photo.createMany({
          data:{
            path: photo,
            notebookId: notebook.id
          }
        })
      })
    }

    reply.send('updated')
  })
}
