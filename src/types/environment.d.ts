declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_ACCESS_KEY_ID: string;
      AWS_ACCESS_SECRET_KEY: string;
      AWS_DEFAULT_REGION: string
    }
  }
}

export {}
