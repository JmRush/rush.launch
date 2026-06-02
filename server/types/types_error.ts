class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class InvalidTokenError extends UnauthorizedError {
    constructor(message: string) {
        super(message);
    }
}

class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export { NotFoundError, UnauthorizedError, BadRequestError, InternalServerError, ForbiddenError, InvalidTokenError };