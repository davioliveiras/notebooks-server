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

    // // MARCA DO NOTEBOOK //

    // let noteBrand = await prisma.brand.findFirst({
    //   where: {
    //     name: notebook.brand.name,
    //   }
    // })

    // if(!noteBrand){
    //   noteBrand = await prisma.brand.create({
    //     data:{
    //       name: notebook.brand.name
    //     }
    //   })
    // }

    // // PROCESSADOR //

    // let processor = await prisma.processor.findFirst({
    //   where: {
    //     model: notebook.processor.model
    //   }
    // })

    // if(!processor){
    //   let processorBrand = await prisma.brand.findFirst({
    //     where: {
    //       name: notebook.processor.brand.name,
    //     }
    //   })
  
    //   if(!processorBrand){
    //     processorBrand = await prisma.brand.create({
    //       data:{
    //         name: notebook.processor.brand.name
    //       }
    //     })
    //   }

    //   processor = await prisma.processor.create({
    //     data: {
    //       model: notebook.processor.model,
    //       clock: notebook.processor.clock,
    //       brandId: processorBrand.id
    //     }
    //   })
    // }

    // // SISTEMA //

    // let system = await prisma.system.findFirst({
    //   where: {
    //     name: notebook.system.name
    //   }
    // })

    // if(!system){
    //   system = await prisma.system.create({
    //     data:{
    //       name: notebook.system.name,
    //     }
    //   })
    // }

    // // PLACA DE VÍDEO //

    // let cardId

    // if(notebook.graphics_card){
    //   let graphicsCard = await prisma.graphics_Card.findFirst({
    //     where: {
    //       model: notebook.graphics_card.model
    //     }
    //   })

    //   if(!graphicsCard){
    //     let graphicsBrand = await prisma.brand.findFirst({
    //       where: {
    //         name: notebook.graphics_card.brand.name
    //       }
    //     })

    //     if(!graphicsBrand){
    //       graphicsBrand = await prisma.brand.create({
    //         data: {
    //           name: notebook.graphics_card.brand.name
    //         }
    //       })
    //     }
        
    //     graphicsCard = await prisma.graphics_Card.create({
    //       data:{
    //         model: notebook.graphics_card.model,
    //         brandId: graphicsBrand.id
    //       }
    //     })
    //   }

    //   cardId = graphicsCard.id
    // }
    // else{
    //   cardId = null
    // }

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

        processorId: tables.processorId,
        systemId: tables.systemId,        
        brandId: tables.brandId,
        graphics_CardId: tables.cardId
      }
    })

    notebook.photos.forEach(async (photo) => {
      await prisma.photo.create({
        data:{
          path: photo,
          notebookId: noteCreated.id
        }
      })
    })

    // return reply.statusCode
    reply.send(noteCreated)
  })
}
