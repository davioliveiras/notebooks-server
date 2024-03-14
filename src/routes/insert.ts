import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import VerifyTables from '../lib/verify-tables'

export async function insert(app: FastifyInstance){
  app.post('/notebook', async (request, reply) => {

    await request.jwtVerify()

    const bodySchema = z.object({
      code: z.number(),
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
      isArchived: z.boolean(),

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
      
      // photos: z.array(z.string()),
      photos: z.array(z.object({
        path: z.string()
      })) 
    })

    const notebook = bodySchema.parse(request.body)

    let noteAlreadyExists = await prisma.notebook.findFirst({
      where: {
        code: notebook.code,
        userId: request.user.sub
      }
    })

    if(noteAlreadyExists){
      reply.status(400).send('Já existe um notebook com esse identificador.')
      return
    }

    const tables = await VerifyTables(notebook.brand, notebook.system, notebook.processor, notebook.graphics_card)

    console.log(request)

    const noteCreated = await prisma.notebook.create({
      data: {
        userId: request.user.sub,
        code: notebook.code,
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
        isArchived: notebook.isArchived,    

        processorId: tables.processorId,
        systemId: tables.systemId,        
        brandId: tables.brandId,
        graphics_CardId: tables.cardId
      }
    })

    notebook.photos.forEach(async (photo) => {
      await prisma.photo.create({
        data:{
          path: photo.path,
          notebookId: noteCreated.id
        }
      })
    })

    // return reply.statusCode
    reply.send(noteCreated)
  })
}
