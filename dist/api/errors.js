export class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export class ClientError extends HttpError {
    constructor(message) {
        super(message, 400);
    }
}
export class AuthorizationError extends HttpError {
    constructor(message) {
        super(message, 401);
    }
}
export class ForbiddenError extends HttpError {
    constructor(message) {
        super(message, 403);
    }
}
export class NotFoundError extends HttpError {
    constructor(message) {
        super(message, 404);
    }
}
