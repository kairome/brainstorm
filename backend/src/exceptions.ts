import { Response } from 'express';
import { ValidationError } from '@/types/entities';

export abstract class Exception {
  abstract readonly statusCode: number;
  abstract message: string | undefined;

  public throw(res: Response) {
    res.status(this.statusCode).json({ message: this.message });
  }
}

export class UnauthorizedException extends Exception {
  readonly statusCode = 401;
  readonly message = 'Unauthorized';
}

export class ForbiddenException extends Exception {
  readonly statusCode = 403;
  message = 'Action forbidden';

  constructor(message?: string) {
    super();
    if (message) {
      this.message = message;
    }
  }
}

export class BadRequestException extends Exception {
  statusCode = 400;
  message = 'Bad request';

  constructor(options: { message?: string, code?: number }) {
    super();

    if (options.code) {
      this.statusCode = options.code;
    }

    if (options.message) {
      this.message = options.message;
    }
  }
}

export class ValidationException extends Exception {
  statusCode = 400;
  message = undefined;
  private readonly errors;

  constructor(errors: ValidationError[]) {
    super();
    this.errors = errors;
  }

  public throw(res: Response) {
    res.status(this.statusCode).json({ errors: this.errors });
  }
}