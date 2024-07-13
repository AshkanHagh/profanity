declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      UPSTASH_VECTOR_REST_URL: string;
      UPSTASH_VECTOR_REST_TOKEN: string;
    }
  }
}

export {}
