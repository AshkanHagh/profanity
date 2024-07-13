export type TErrorHandler = {
    statusCode : number; message : string
}

export type TProfanityCheck = {
    isProfanity : boolean; score : number; text? : string | undefined
}