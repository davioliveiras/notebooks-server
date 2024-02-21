import { prisma } from './prisma'

type brand = {
  name: string
}

type system = {
  name: string
}

type processor = {
  model: string,
  clock: number,
  brand: brand
}

type graphics_card = {
  model: string,
  brand: brand
}

export default async function VerifyTables(brandParams: brand, systemParams: system, processorParams: processor, cardParams: graphics_card | null){
  // MARCA DO NOTEBOOK //

  let noteBrand = await prisma.brand.findFirst({
    where: {
      name: brandParams.name,
    }
  })

  if(!noteBrand){
    noteBrand = await prisma.brand.create({
      data:{
        name: brandParams.name
      }
    })
  }

  // PROCESSADOR //

  let noteProcessor = await prisma.processor.findFirst({
    where: {
      model: processorParams.model
    }
  })

  if(!noteProcessor){
    let processorBrand = await prisma.brand.findFirst({
      where: {
        name: processorParams.brand.name,
      }
    })

    if(!processorBrand){
      processorBrand = await prisma.brand.create({
        data:{
          name: processorParams.brand.name
        }
      })
    }

    noteProcessor = await prisma.processor.create({
      data: {
        model: processorParams.model,
        clock: processorParams.clock,
        brandId: processorBrand.id
      }
    })
  }

  // SISTEMA //

  let noteSystem = await prisma.system.findFirst({
    where: {
      name: systemParams.name
    }
  })

  if(!noteSystem){
    noteSystem = await prisma.system.create({
      data:{
        name: systemParams.name,
      }
    })
  }

  // PLACA DE VÍDEO //

  let cardId

  if(cardParams){
    let graphicsCard = await prisma.graphics_Card.findFirst({
      where: {
        model: cardParams.model
      }
    })

    if(!graphicsCard){
      let graphicsBrand = await prisma.brand.findFirst({
        where: {
          name: cardParams.brand.name
        }
      })

      if(!graphicsBrand){
        graphicsBrand = await prisma.brand.create({
          data: {
            name: cardParams.brand.name
          }
        })
      }
      
      graphicsCard = await prisma.graphics_Card.create({
        data:{
          model: cardParams.model,
          brandId: graphicsBrand.id
        }
      })
    }

    cardId = graphicsCard.id
  }
  else{
    cardId = null
  }

  return {
    processorId: noteProcessor.id, 
    systemId: noteSystem.id,
    brandId: noteBrand.id, 
    cardId: cardId
  }
}
