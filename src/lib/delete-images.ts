import { clientAmazon } from '../lib/s3'
import { DeleteObjectsCommand } from '@aws-sdk/client-s3'

export async function deleteImages(paths: string[]) {

    type myObjectType = {
      Key: string
    }

    let objects: myObjectType[] = []

    paths.forEach((item) => {
      objects.push({Key: item})
    })

    const input = {
      Bucket: 'notebooks-project',
      Delete: {
        Objects: objects
      } 
    }

    const command = new DeleteObjectsCommand(input)
    await clientAmazon.send(command)
}
