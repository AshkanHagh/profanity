import type { Document } from 'langchain/document';
import index from '../configs/upstash.vector.config';
import ErrorHandler from '../libs/utils/errorHandler';
import type { TErrorHandler, TResponse } from '../types/index.type';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import type { QueryResult } from '@upstash/vector';

const semanticSplitter = new RecursiveCharacterTextSplitter({chunkSize: 25, separators: [' '], chunkOverlap: 8});

export const profanityCheckerService = async (message : string) : Promise<TResponse> => {
    try {
        const WHITELIST : string[] = ['black', 'swear'];
        const PROFANITY_THRESHOLD : number = 0.86; 

        message.split(/\s/).filter(word => !WHITELIST.includes(word.toLowerCase())).join(' ');
        const [semanticChunks, wordChunks] : string[][] = await Promise.all([
            splitTextIntoSemantics(message), splitTextIntoWords(message)
        ]);

        const flaggedFor : Set<{score : number, text : string}> = new Set<{score : number, text : string}>();

        const vectorRes = await Promise.all([
            ...wordChunks.map(async wordChunk => {
                const [vector] : QueryResult<Dict<string>>[] = await index.query({
                    topK : 1, data : wordChunk, includeMetadata : true
                });
                if(vector && vector.score > 0.95) flaggedFor.add({
                    text : vector!.metadata!['text']! as string, score : vector.score
                })
                return {score : 0};
            }),
            ...semanticChunks.map(async semanticChunk => {
                const [vector] = await index.query({
                    topK : 1, data : semanticChunk, includeMetadata : true
                });
                if(vector && vector.score > PROFANITY_THRESHOLD) flaggedFor.add({
                    text : vector!.metadata!['text']! as string, score : vector.score
                })
                return vector;
            })
        ]);

        if(flaggedFor.size == 0) {
            const mostProfaneChunk = vectorRes.sort((a, b) => a.score > b.score ? -1 : 1)[0];
            return {isProfanity : false, score : mostProfaneChunk.score}
        }

        const sorted = Array.from(flaggedFor).sort((a, b) => a.score > b.score ? -1 : 1)[0];
        return {isProfanity : true, score : sorted.score, flaggedFor : sorted.text}
        
    } catch (err : unknown) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

const splitTextIntoWords = (text : string) : string[] => {
    return text.split(/\s/);
}

const splitTextIntoSemantics = async (text : string) : Promise<string[]> => {
    if(text.split(/\s/).length === 1) return [];
    const documents : Document<Record<string, string>>[] = await semanticSplitter.createDocuments([text]);
    const chunks : string[] = documents.map((chunk) => chunk.pageContent);
    return chunks;
}