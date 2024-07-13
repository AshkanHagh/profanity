import type { Document } from 'langchain/document';
import ErrorHandler from '../libs/utils/errorHandler';
import type { TErrorHandler, TProfanityCheck } from '../types/index.type';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { vectorClient } from '../configs/upstash.vector.config';
import type { QueryResult } from '@upstash/vector';

const semanticSplitter = new RecursiveCharacterTextSplitter({chunkSize : 25, separators : [' '], chunkOverlap : 8});

export const profanityService = async (message : string) => {
    try {
        const WHITELIST : string[] = ['black', 'swear'];
        const PROFANITY_THRESHOLD : number = 0.86

        const filteredMessage : string = message.split(/\s/).filter(word => !WHITELIST.includes(word.toLowerCase())).join(' ');
        const [semanticChunks, wordChunks] : string[][] = await Promise.all([
            splitTextIntoSemantics(filteredMessage), splitTextIntoWords(filteredMessage)
        ]);
        const flaggedFor : Set<{score : number, text : string}> = new Set<{score : number, text : string}>();

        const vectorRes : ({score: number} | QueryResult<Dict<string>>)[] = await Promise.all([
            ...wordChunks.map(async wordChunk => {
                const [vector] : QueryResult<Dict<string>>[] = await vectorClient.query({
                    topK : 1, data : wordChunk, includeMetadata : true
                });
                if(vector && vector.score > 0.95) flaggedFor.add({
                    score : vector.score, text : vector!.metadata!['text'] as string
                });
                return { score : 0 }
            }),
            ...semanticChunks.map(async semanticChunk => {
                const [vector] : QueryResult<Dict<string>>[] = await vectorClient.query({
                    topK : 1, data : semanticChunk, includeMetadata : true
                });
                if(vector && vector.score > PROFANITY_THRESHOLD) flaggedFor.add({
                    score : vector.score, text : vector!.metadata!['text'] as string
                });
                return vector;
            })
        ]);

        if(flaggedFor.size === 0) {
            const {score} : ({score: number} | QueryResult<Dict<string>>) = vectorRes.sort((a, b) => a.score > b.score ? -1 : 1)[0];
            return { isProfanity : false, score } as TProfanityCheck;
        }

        const {score, text} = Array.from(flaggedFor).sort((a, b) => a.score > b.score ? -1 : 0)[0];
        return { isProfanity : true, score, text } as TProfanityCheck;
    
    } catch (err : unknown) {
        const error = err as TErrorHandler;
        throw new ErrorHandler(`An error occurred : ${error.message}`, error.statusCode);
    }
}

const splitTextIntoWords = (text : string) : string[] => {
    return text.split(/\s/);
}

const splitTextIntoSemantics = async (text : string) : Promise<string[]> => {
    if(text.split(/\s/).length === 0) return [];
    const documents : Document<Record<string, string>>[] = await semanticSplitter.createDocuments([text]);
    return documents.map(chunk => chunk.pageContent);
}