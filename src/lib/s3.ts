import { S3Client } from '@aws-sdk/client-s3'

export const clientAmazon = new S3Client(
  {
    region: process.env.AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,      
    }
  }
)
