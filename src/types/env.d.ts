declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UPSTASH_VECTOR_REST_URL : string;
      UPSTASH_VECTOR_REST_TOKEN : string;
      PORT : string;
      ORIGIN : string
    }
  }
}

export {}
