import ErrorHandler from './errorHandler';

class InternalServerError extends ErrorHandler {
    constructor(message : string = 'Internal server error') {
        super(message, 500);
    }
}

class RouteNowFoundError extends ErrorHandler {
    constructor(message : string) {
        super(message, 404);
    }
}

export { InternalServerError, RouteNowFoundError }