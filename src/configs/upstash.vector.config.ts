import { Index } from '@upstash/vector';

export const vectorClient = new Index({
    url : process.env.UPSTASH_VECTOR_REST_URL,
    token : process.env.UPSTASH_VECTOR_REST_TOKEN
});